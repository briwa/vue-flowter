import { mount } from '@vue/test-utils'
import Flowter from '../src/index.vue'
import { nodes, edges } from '../fixtures/graph.json'
import { EdgeType, Mode } from '@/types'

describe('Flowter', () => {
  describe('When rendering in default mode (vertical)', () => {
    describe('And rendering with the default edge type (bent)', () => {
      test('Should render all nodes and edges vertically with edge type bent', () => {
        const wrapper = mount(Flowter, {
          propsData: { nodes, edges }
        })

        expect(wrapper.html()).toMatchSnapshot()
      })
    })

    describe('And rendering with the edge type cross', () => {
      test('Should render all nodes and edges vertically with edge type cross', () => {
        const wrapper = mount(Flowter, {
          propsData: { nodes, edges, edgeType: EdgeType.CROSS }
        })

        expect(wrapper.html()).toMatchSnapshot()
      })
    })
  })

  describe('When rendering in horizontal mode', () => {
    describe('And rendering with the default edge type (bent)', () => {
      test('Should render all nodes and edges horizontally with edge type bent', () => {
        const wrapper = mount(Flowter, {
          propsData: { nodes, edges, mode: Mode.HORIZONTAL }
        })

        expect(wrapper.html()).toMatchSnapshot()
      })
    })

    describe('And rendering with the edge type cross', () => {
      test('Should render all nodes and edges horizontally with edge type cross', () => {
        const wrapper = mount(Flowter, {
          propsData: { nodes, edges, mode: Mode.HORIZONTAL, edgeType: EdgeType.CROSS }
        })

        expect(wrapper.html()).toMatchSnapshot()
      })
    })
  })
})
