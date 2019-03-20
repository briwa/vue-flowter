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

  describe('When rendering using custom size', () => {
    describe('Using custom width', () => {
      describe('Using vertical mode', () => {
        test('Should render the flowchart with the custom width', () => {
          const wrapper = mount(Flowter, {
            propsData: { nodes, edges, mode: Mode.VERTICAL, width: 800 }
          })

          expect(wrapper.html()).toMatchSnapshot()
        })
      })

      describe('Using horizontal mode', () => {
        test('Should ignore the width', () => {
          const wrapper = mount(Flowter, {
            propsData: { nodes, edges, mode: Mode.HORIZONTAL, width: 800 }
          })

          expect(wrapper.html()).toMatchSnapshot()
        })
      })
    })

    describe('Using custom height', () => {
      describe('Using horizontal mode', () => {
        test('Should render the flowchart with the custom height', () => {
          const wrapper = mount(Flowter, {
            propsData: { nodes, edges, mode: Mode.HORIZONTAL, height: 800 }
          })

          expect(wrapper.html()).toMatchSnapshot()
        })
      })

      describe('Using vertical mode', () => {
        test('Should ignore the height', () => {
          const wrapper = mount(Flowter, {
            propsData: { nodes, edges, mode: Mode.VERTICAL, height: 800 }
          })

          expect(wrapper.html()).toMatchSnapshot()
        })
      })
    })
  })
})
