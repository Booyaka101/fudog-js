import * as React from 'react'
import { SxProps, Theme, BoxProps, PaperProps } from '@mui/material'

export interface MJPEGProps {
  url?: string
  containerSx?: SxProps<Theme>
  frameSx?: SxProps<Theme>
  onResolution?: (width: number, height: number) => void
  maxRetries?: number
  retryDelay?: number
  connectTimeout?: number
  onLoad?: () => void
  onError?: (error: unknown) => void
  onLoadingChange?: (loading: boolean) => void
  debug?: boolean
}

export interface NDIPreviewProps {
  sourceName?: string
  sessionId?: string
  containerSx?: SxProps<Theme>
  maxHeight?: number
  showLabel?: boolean
  baseUrl?: string
  paperProps?: PaperProps
  previewBoxProps?: BoxProps
  mjpegProps?: MJPEGProps
}

export const MJPEG: React.FC<MJPEGProps>

export const NDIPreview: React.FC<NDIPreviewProps>

export default NDIPreview
