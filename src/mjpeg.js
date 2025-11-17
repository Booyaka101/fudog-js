import { Box, LinearProgress, Typography } from "@mui/material"
import React, { useEffect, useRef, useState } from "react"

const MJPEG = ({
    url,
    containerSx = {},
    frameSx = {},
    onResolution,
    maxRetries = 3,
    retryDelay = 1000,
    connectTimeout = 1500,
    onLoad,
    onError,
    onLoadingChange,
    debug = false
}) => {
    const fux = useRef()
    const timeoutRef = useRef()
    const retryRef = useRef()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {
        const debugLog = (...args) => {
            if (debug) {
                console.log(...args)
            }
        }

        const debugError = (...args) => {
            if (debug) {
                console.error(...args)
            }
        }

        const img = fux.current

        if (!img) {
            debugError("❌ MJPEG: Image element ref not available!")
            return
        }

        if (!url) {
            setLoading(false)
            setError(true)
            try {
                if (typeof onLoadingChange === "function") {
                    onLoadingChange(false)
                }
                if (typeof onError === "function") {
                    onError(new Error("MJPEG: No URL provided for stream"))
                }
                if (typeof onResolution === "function") {
                    onResolution(0, 0)
                }
            } catch (_) {}
            return
        }

        setLoading(true)
        setError(false)
        try {
            if (typeof onLoadingChange === "function") {
                onLoadingChange(true)
            }
        } catch (_) {}

        let cancelled = false
        let attemptId = 0
        let totalErrors = 0

        const handleLoad = () => {
            if (cancelled) return
            setLoading(false)
            setError(false)
            try {
                const imgEl = fux.current
                if (imgEl && typeof onResolution === "function") {
                    const w = imgEl.naturalWidth || 0
                    const h = imgEl.naturalHeight || 0
                    if (w > 0 && h > 0) onResolution(w, h)
                }
                if (typeof onLoadingChange === "function") {
                    onLoadingChange(false)
                }
                if (typeof onLoad === "function") {
                    onLoad()
                }
            } catch (_) {}
        }

        const startStream = () => {
            if (cancelled || !img) {
                return
            }
            attemptId += 1
            const currentAttempt = attemptId
            const streamUrl = url + "&t=" + Date.now()
            debugLog("🎥 MJPEG: Starting live stream from:", streamUrl)
            debugLog("🎥 MJPEG: Image element ready, setting src")
            img.onload = handleLoad
            img.src = streamUrl
            debugLog("🎥 MJPEG: Waiting for stream to start...")

            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
            timeoutRef.current = setTimeout(() => {
                if (cancelled || currentAttempt !== attemptId) {
                    return
                }
                debugLog("✅ MJPEG: Stream should be playing now (timeout fallback)")
                setLoading(false)
                setError(false)
                try {
                    if (typeof onLoadingChange === "function") {
                        onLoadingChange(false)
                    }
                } catch (_) {}
            }, connectTimeout)
        }

        const scheduleRetry = () => {
            if (retryRef.current) {
                clearTimeout(retryRef.current)
            }
            retryRef.current = setTimeout(() => {
                if (cancelled) {
                    return
                }
                debugLog("🔄 MJPEG: Retrying in", retryDelay, "ms...")
                startStream()
            }, retryDelay)
        }

        const handleError = (e) => {
            if (cancelled) {
                return
            }
            totalErrors++
            debugError("❌ MJPEG: Stream error, attempt", totalErrors, e)
            try {
                if (typeof onResolution === "function") onResolution(0, 0)
                if (typeof onError === "function") onError(e)
            } catch (_) {}
            if (totalErrors >= maxRetries) {
                debugError("❌ MJPEG: Max retries reached, giving up")
                setError(true)
                setLoading(false)
                try {
                    if (typeof onLoadingChange === "function") {
                        onLoadingChange(false)
                    }
                } catch (_) {}
                return
            }
            scheduleRetry()
        }

        img.onerror = handleError
        startStream()

        return () => {
            cancelled = true
            debugLog("🧹 MJPEG: Cleaning up stream")
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
            if (retryRef.current) {
                clearTimeout(retryRef.current)
            }
            if (img) {
                debugLog("🧹 MJPEG: Clearing image source")
                img.onerror = null
                img.onload = null
                img.src = ""
            }
            try {
                if (typeof onLoadingChange === "function") {
                    onLoadingChange(false)
                }
            } catch (_) {}
        }
    }, [url, maxRetries, retryDelay, connectTimeout, onResolution, onLoad, onError, onLoadingChange, debug])

    const defaultContainerSx = {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }

    const defaultFrameSx = {
        position: 'relative',
        width: '100%',
        aspectRatio: '16 / 9',
        backgroundColor: '#000',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '2px solid rgba(0,188,212,0.3)',
        boxShadow: '0 20px 40px rgba(0,188,212,0.15)'
    }

    return <Box sx={{ ...defaultContainerSx, ...containerSx }}>
        <Box sx={{ ...defaultFrameSx, ...frameSx }}>
            {loading && !error && (
                <Box sx={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 2,
                    px: 4
                }}>
                    <LinearProgress sx={{ width: '100%' }} />
                    <Typography sx={{ textAlign: 'center', color: '#aaa' }}>
                        Loading stream...
                    </Typography>
                </Box>
            )}
            {error && (
                <Box sx={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 1.5,
                    px: 5,
                    textAlign: 'center',
                    background: 'linear-gradient(135deg, rgba(244,67,54,0.3) 0%, rgba(0,0,0,0.8) 100%)'
                }}>
                    <Typography variant="h6" sx={{ color: '#f44336', fontWeight: 700 }}>
                        ⚠️ Stream Error
                    </Typography>
                    <Typography sx={{ color: '#ddd' }}>
                        Failed to load preview stream. Check if the source is active.
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#aaa' }}>
                        URL: {url}
                    </Typography>
                </Box>
            )}
            <img
                alt="preview"
                ref={fux}
                style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    display: 'block',
                    visibility: (loading || error) ? 'hidden' : 'visible'
                }}
            />
        </Box>
    </Box>
}

export default MJPEG