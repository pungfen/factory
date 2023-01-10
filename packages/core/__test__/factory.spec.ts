import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import { factory } from '../src'

const Component = factory({
  name: 'my-component',

  children: {}
})

describe('factory', () => {
  it('mount', () => {
    const wrapper = mount(Component)
  })
})
