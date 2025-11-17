# @booyaka101/fudog-js

React components for previewing NDI sources via MJPEG streams on Linux.

## Installation

```bash
npm install @booyaka101/fudog-js
# or
yarn add @booyaka101/fudog-js
```

## Usage

```jsx
import NDIPreview, { MJPEG } from '@booyaka101/fudog-js'

function Example() {
  return (
    <NDIPreview
      sourceName="NDI Source Name"
      sessionId="unique-session-id"
      baseUrl="http://localhost:3000" // your backend providing /preview
      maxHeight={300}
      showLabel
    />
  )
}
```

`NDIPreview` internally uses the `MJPEG` component to render a live MJPEG stream from:

```text
${baseUrl}/preview?stream=${encodeURIComponent(sourceName)}&session=${encodeURIComponent(sessionId)}
```

## Peer dependencies

This package expects the following to be present in your app:

- react
- react-dom
- @mui/material
- @emotion/react
- @emotion/styled

## Development

- Build: `npm run build`
- Watch build: `npm run dev`
- The package is built with `tsup` and outputs both CJS (`dist/index.cjs`) and ESM (`dist/index.js`).

## API

### NDIPreview

- `sourceName` – NDI source name to preview (required for preview)
- `sessionId` – unique session identifier
- `baseUrl` – base URL of your backend (e.g. `http://localhost:3000`)
- `maxHeight` – maximum height in pixels (default: 300)
- `showLabel` – whether to show the source name label (default: true)
- `containerSx` – MUI `sx` for the outer `Paper`
- `paperProps` – props forwarded to the outer `Paper`
- `previewBoxProps` – props forwarded to the inner preview `Box`
- `mjpegProps` – additional props forwarded to the underlying `MJPEG` component

### MJPEG

- `url` – MJPEG stream URL
- `containerSx` – MUI `sx` for the outer container
- `frameSx` – MUI `sx` for the frame wrapper
- `onResolution(width, height)` – called when the stream resolution is known
- `maxRetries` – maximum number of retry attempts (default: 3)
- `retryDelay` – delay between retries in ms (default: 1000)
- `connectTimeout` – timeout before considering the initial connection as failed (default: 1500ms)
- `onLoad()` – called when the stream has loaded
- `onError(error)` – called when an error occurs
- `onLoadingChange(loading)` – called whenever loading state changes
- `debug` – enables verbose console logging when true

## Publishing

1. Log in to npm: `npm login`
2. Build: `npm run build`
3. (Optional) Test the tarball: `npm pack`
4. Publish as public scoped package:

   ```bash
   npm publish --access public
   ```
