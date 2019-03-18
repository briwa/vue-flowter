import { mount } from '@vue/test-utils'
import Flowter from '../src/index.vue'
import { nodes, edges } from '../fixtures/graph.json'

describe('Flowter', () => {
  describe('When rendering in default mode (vertical)', () => {
    test('Should render all nodes and edges vertically', () => {
      const wrapper = mount(Flowter, {
        propsData: { nodes, edges }
      })

      expect(wrapper.html()).toMatchSnapshot()
    })
  })

  describe('When rendering in horizontal mode', () => {
    test('Should render all nodes and edges horizontally', () => {
      const wrapper = mount(Flowter, {
        propsData: { nodes, edges, mode: 'horizontal' }
      })

      expect(wrapper.html()).toMatchSnapshot()
    })
  })
})
