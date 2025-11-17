import React, { useState, useEffect } from 'react'
import { Box, Paper, Typography, CircularProgress } from '@mui/material'
import MJPEG from './mjpeg'

/**
 * Reusable NDI Preview Component
 * Displays a live preview of the selected NDI source
 * 
 * @param {string} sourceName - The NDI source name to preview
 * @param {string} sessionId - Unique session ID for this preview
 * @param {object} containerSx - Optional MUI sx prop for the container
 * @param {number} maxHeight - Maximum height in pixels (default: 300)
 * @param {boolean} showLabel - Whether to show the source name label (default: true)
 */
const NDIPreview = ({ 
  sourceName, 
  sessionId, 
  containerSx = {}, 
  maxHeight = 300,
  showLabel = true,
  baseUrl = '',
  paperProps = {},
  previewBoxProps = {},
  mjpegProps = {}
}) => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (sourceName) {
      setIsLoading(true)
      // Give a brief moment for the stream to initialize
      const timer = setTimeout(() => setIsLoading(false), 500)
      return () => clearTimeout(timer)
    }
  }, [sourceName])

  if (!sourceName) {
    return (
      <Paper 
        elevation={0} 
        {...paperProps}
        sx={{ 
          p: 3, 
          textAlign: 'center', 
          background: 'rgba(0,0,0,0.05)',
          border: '1px dashed rgba(0,0,0,0.12)',
          borderRadius: 2,
          ...containerSx,
          ...(paperProps.sx || {}) 
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Select an NDI source to preview
        </Typography>
      </Paper>
    )
  }

  const normalizedBaseUrl = (baseUrl || '').replace(/\/+$/, '')
  const previewPath = `/preview?stream=${encodeURIComponent(sourceName)}&session=${encodeURIComponent(sessionId || '')}`
  const previewUrl = normalizedBaseUrl ? `${normalizedBaseUrl}${previewPath}` : previewPath
  const { containerSx: mjpegContainerSx = {}, frameSx: mjpegFrameSx = {}, ...restMjpegProps } = mjpegProps || {}

  return (
    <Paper 
      elevation={2} 
      {...paperProps}
      sx={{ 
        p: 1.5, 
        background: '#000',
        borderRadius: 2,
        ...containerSx,
        ...(paperProps.sx || {}) 
      }}
    >
      {showLabel && (
        <Typography 
          variant="caption" 
          sx={{ 
            display: 'block', 
            mb: 1, 
            px: 1,
            color: 'rgba(255,255,255,0.7)',
            fontFamily: 'monospace',
            fontSize: '0.75rem'
          }}
        >
          {sourceName}
        </Typography>
      )}
      
      <Box 
        {...previewBoxProps}
        sx={{ 
          position: 'relative', 
          width: '100%', 
          maxHeight: `${maxHeight}px`,
          minHeight: '150px',
          background: '#000',
          borderRadius: 1,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          ...(previewBoxProps.sx || {})
        }}
      >
        {isLoading && (
          <Box 
            sx={{ 
              position: 'absolute', 
              inset: 0, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              background: 'rgba(0,0,0,0.7)',
              zIndex: 2
            }}
          >
            <CircularProgress size={32} sx={{ color: '#38bdf8' }} />
          </Box>
        )}
        
        <MJPEG
          {...restMjpegProps}
          url={previewUrl}
          containerSx={{ 
            width: '100%', 
            height: '100%',
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            ...mjpegContainerSx 
          }}
          frameSx={{ 
            width: '100%', 
            height: '100%',
            maxHeight: `${maxHeight}px`,
            objectFit: 'contain',
            borderRadius: 1,
            ...mjpegFrameSx
          }}
        />
      </Box>
    </Paper>
  )
}

export default NDIPreview
