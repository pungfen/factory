import { defineComponent } from 'vue'

import type { Component, ComponentPropsOptions, DefineComponent, ExtractPropTypes } from 'vue'

type FactoryOptions<PropsOptions, Children, Props = Readonly<ExtractPropTypes<PropsOptions>>> = {
  name?: string
  props?: PropsOptions & ThisType<void>
  mounted?: (this: Props & Children) => void
  unmounted?: () => void
  layout?: string | Component
  children: Children
}

interface FactoryChildren {
  [index: string]: any
  children?: Record<string, FactoryChildren>
}

const factory = <PropsOptions extends Readonly<ComponentPropsOptions>, Children extends FactoryChildren>(
  options: FactoryOptions<PropsOptions, Children>
): DefineComponent<PropsOptions> => {
  const { layout, name, props, mounted, unmounted } = options

  const component = defineComponent({
    name,

    props,

    setup(props, ctx) {
      return {}
    },
  }) as any

  return component
}

factory({
  props: {
    name: {
      type: Number,
    },
  },
  mounted() {
    this.name
    this.form.data.name
    this.form.children.name
  },
  children: {
    form: {
      data: {
        name: '',
      },
      children: {
        name: {},
      },
    },
  },
})
