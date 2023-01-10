#!/usr/bin/env node

import { Command } from 'commander'
import { cwd } from 'node:process'
import { writeFileSync, existsSync, lstatSync, mkdirSync } from 'node:fs'
import { resolve, relative } from 'node:path'
import fetch from 'node-fetch'

// import prettier, { type Options as PrettierOptions } from 'prettier'
// import parserTypescript from 'prettier/parser-typescript.js'

import { config } from './config'

interface ResourceOptions {
  name: string
  url: string
}

export interface SwaggerConfig {
  ext?: 'd.ts' | 'ts'
  output?: string
  resources: ResourceOptions[]
}

type ResolvedSwaggerConfig = Required<SwaggerConfig>

interface Definition {
  properties: Record<string, { description?: string; type?: 'string' | 'integer' | 'array' | 'number'; $ref?: string; items?: { $ref: string } }>
  title: string
  type: 'string' | 'object'
  required?: string[]
}

type ContextDocDefinition = Record<string, Definition>

interface Schema {
  $ref?: string
}

interface Parameters {
  name: string
  description?: string
  in: 'query' | 'body' | 'path'
  required: boolean
  type: 'array' | 'string' | 'integer' | 'number' | 'boolean'
  collectionFormat?: 'multi'
  items?: { type: 'string' | 'integer'; format?: string; enum?: string[] }
  enum?: string[]
  schema?: Schema
}

type contextDocPaths = Record<
  'get' | 'post' | 'put' | 'delete',
  {
    description: string
    operationId: string
    parameters: Parameters[]
    responses: Record<string, { description?: string; schema?: Schema }>
    summary: string
    tags: string[]
  }
>

interface RequestOptions<T> {
  method?: 'get' | 'post'
  url: string
  convert?: (data: T) => T
}

const request = async <T = unknown>(options: RequestOptions<T>): Promise<T> => {
  try {
    options.method ||= 'get'
    const res = (await (await fetch(options.url, { method: options.method })).json()) as T
    return Promise.resolve(options.convert?.(res) || res)
  } catch (err) {
    return Promise.reject(err)
  }
}

interface Resource {
  location: string
  name: string
  swaggerVersion: string
  url: string
  source: string
}

interface Doc {
  definitions?: ContextDocDefinition
  info: { title: string; description: string }
  paths?: Record<string, contextDocPaths>
  tags: { name: string; description: string }[]
  resource: Resource
}

let resolvedConfig: ResolvedSwaggerConfig

const swagger = {
  resource: {
    data: [] as Resource[][],
    async get() {
      const pollings = resolvedConfig.resources.map((resource) =>
        request<Resource[]>({
          url: `${resource.url}/swagger-resources`,
          convert(data) {
            return data.map((item) => Object.assign(item, { source: resource.name, url: resource.url + item.url }))
          }
        })
      )
      swagger.resource.data = await Promise.all(pollings)
    }
  },
  doc: {
    data: [] as Doc[],
    async get() {
      const pollings = swagger.resource.data.reduce((_pollings, resources) => {
        _pollings.push(
          ...resources.map((resource) =>
            request<Doc>({
              url: resource.url,
              convert(data) {
                data.resource = resource
                return data
              }
            })
          )
        )
        return _pollings
      }, [] as Promise<Doc>[])
      swagger.doc.data = await Promise.all(pollings)
    }
  }
}

const resolvedSwaggerConfig = (config: SwaggerConfig): ResolvedSwaggerConfig => {
  return Object.assign({ ext: 'd.ts', output: 'definitions', resources: [] }, config)
}

const format = (doc: Doc) => {
  return ''
}

const run = async () => {
  resolvedConfig = resolvedSwaggerConfig(config.swagger)
  await swagger.resource.get()
  await swagger.doc.get()

  const root = cwd()
  for (const doc of swagger.doc.data) {
    const timeStart = process.hrtime()
    const dirPath = resolve(root, `${resolvedConfig.output}/${doc.resource.name}`)
    const isDir = existsSync(dirPath) && lstatSync(dirPath).isDirectory()
    if (!isDir) mkdirSync(dirPath, { recursive: true })
    const filePath = `${dirPath}/${doc.resource.name}.${resolvedConfig.ext}`
    const code = format(doc)
    writeFileSync(filePath, code, 'utf8')
    const timeEnd = process.hrtime(timeStart)
    const time = timeEnd[0] + Math.round(timeEnd[1] / 1e6)
    console.log('\x1B[36m%s\x1B[0m', '🚀 ' + doc.info.title + ' ' + doc.info.description + ' ' + relative(root, filePath) + ' ' + time + 'ms')
  }
}

run()

// const program = new Command()

// program.name('swagger').action(run)
