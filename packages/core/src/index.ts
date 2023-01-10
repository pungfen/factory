import { defineComponent } from 'vue'

import type { Component, ComponentPropsOptions, DefineComponent, ExtractPropTypes } from 'vue'

type Index<T> = {
  [K in Exclude<keyof T, 'ajax' | 'children'>]: T[K]
}

type ExtractSetupTypes<O> = {
  [K in keyof Omit<O, 'children'>]: O[K]
}

type Options<PropsOptions, SetupOptions, Props = Readonly<ExtractPropTypes<PropsOptions>>, Setup = ExtractSetupTypes<SetupOptions>> = {
  name?: string
  props?: PropsOptions & ThisType<void>
  mounted?: (this: Props & Setup) => void
  unmounted?: () => void
  layout?: string | Component
  setup: (this: Props & { xx: number }) => SetupOptions
}

interface Actions {
  'GET /xx': {
    Client: {
      name: string
    }
    Payload: {
      name?: string
    }
  }
  'GET /yy': {
    Client: {
      name: string
    }
    Payload: {
      name?: string
    }
  }
}

interface MapActions {}

type AjaxConfig = {
  [Action in keyof Actions]: {
    action: Action
    params?: (params: { path: Actions[Action]['Paths']; payload: Actions[Action]['Payload'] }) => void
  }
}[keyof Actions]

interface Setup {
  [index: string]: any
  ajax?: Record<string, AjaxConfig>
  children?: Record<string, Setup>
}

type ComponentSetupOptions = Record<string, Setup>

export const factory = <PropsOptions extends ComponentPropsOptions, SetupOptions extends ComponentSetupOptions>(
  options: Options<PropsOptions, SetupOptions>
): DefineComponent<PropsOptions> => {
  const { layout, name, props, mounted, unmounted } = options

  const component = defineComponent({
    name,

    props,

    setup(props, ctx) {
      return {}
    }
  }) as any

  return component
}

factory({
  props: {
    name: {
      type: Number
    }
  },
  mounted() {
    this.name
    this.form.children.foo
    // this.form.data.name
    // this.form.children.name
  },
  setup() {
    return {
      form: {
        data: {
          name: ''
        },
        children: {
          foo: {
            ajax: {
              get: {
                action: 'GET /yy',
                params(params) {
                  params.payload.name = 'xxx'
                }
              }
            },
            xx: 'xx',
            // change() {
            //   this
            // }
            change() {}
          }
        }
      }
    }
  }
})
