import { loadConfig } from 'unconfig'

import type { SwaggerConfig } from './swagger'

interface Config {
  swagger: SwaggerConfig
}

export const config = (
  await loadConfig<Config>({
    sources: [{ files: 'package.json' }]
  })
).config
