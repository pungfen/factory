import { rm } from 'fs/promises'
import { build } from 'esbuild'

const outdir = 'dist'

await rm(outdir, { recursive: true, force: true })

import pi from './package.json'

build({
  bundle: true,
  define: { VERSION: JSON.stringify(pi.version) },
  entryPoints: ['src/swagger.ts'],
  external: Object.keys(pi.dependencies),
  format: 'esm',
  outdir: 'dist',
  platform: 'node',
  treeShaking: true
})
