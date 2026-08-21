import { copyFile, mkdir } from 'node:fs/promises'
import { build } from 'esbuild'

const shared = {
  entryPoints: ['src/stackColumns.jsx'],
  bundle: true,
  external: ['react', 'react/jsx-runtime'],
  jsx: 'automatic',
  sourcemap: true,
  logLevel: 'info',
}

await build({ ...shared, format: 'esm', outfile: 'dist/index.js' })
await build({ ...shared, format: 'cjs', outfile: 'dist/index.cjs' })
await mkdir('dist', { recursive: true })
await copyFile('src/index.d.ts', 'dist/index.d.ts')