import type { DefineComponent } from 'vue'

interface BaseOptions {
  name?: string
}

interface HookOptions {
  mounted?: () => void
  unmounted?: () => void
}

export interface Options extends BaseOptions, HookOptions {
  props?: {}
}
