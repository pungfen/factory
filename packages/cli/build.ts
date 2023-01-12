import { rm } from 'fs/promises'
import { build } from 'esbuild'

const outdir = 'dist'

await rm(outdir, { recursive: true, force: true })

build({
  bundle: true,
  entryPoints: ['src/swagger.ts'],
  external: ['commander', 'node-fetch', 'prettier', 'unconfig', 'magic-string'],
  format: 'cjs',
  outdir: 'dist',
  platform: 'node',
  treeShaking: true
})
