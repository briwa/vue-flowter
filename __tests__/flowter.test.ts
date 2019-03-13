import { shallowMount } from '@vue/test-utils'
import Flowter from '@/flowter.vue'

describe('Flowter', () => {
  test('Simply passing', () => {
    const wrapper = shallowMount(Flowter)
    expect(wrapper.exists()).toBe(true)
  })
})
