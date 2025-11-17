const { defineConfig } = require('tsup')

module.exports = defineConfig({
  entry: ['src/index.js'],
  format: ['esm', 'cjs'],
  dts: false,
  splitting: false,
  sourcemap: false,
  clean: true,
  outDir: 'dist',
  target: 'node16',
  loader: {
    '.js': 'jsx'
  },
  external: [
    'react',
    'react-dom',
    '@mui/material',
    '@emotion/react',
    '@emotion/styled'
  ]
})
