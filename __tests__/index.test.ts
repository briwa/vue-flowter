// Libraries
import { mount } from '@vue/test-utils'

// Component to test
import Flowter from '@/index.vue'

// Mocked data
import allGraph from '../__fixtures__/all.json'
import simpleGraph from '../__fixtures__/simple.json'

// This is to test all the possible edges and nodes
// Using the complex wrapper from the fixtures
function getComplexWrapper (props = {}) {
  return mount(Flowter, {
    propsData: {
      nodes: allGraph.nodes,
      edges: allGraph.edges,
      ...props
    }
  })
}

// This is just to test container styles,
// when changes are not affecting the nodes/edges
function getSimpleWrapper (props = {}) {
  return mount(Flowter, {
    propsData: {
      nodes: simpleGraph.nodes,
      edges: simpleGraph.edges,
      ...props
    }
  })
}

// Types
import { EdgeType, Mode } from '@/shared/types'

describe('Flowter', () => {
  describe('When rendering in default mode (vertical)', () => {
    describe('And rendering with the default edge type (bent)', () => {
      test('Should render all nodes and edges vertically with edge type bent', () => {
        const wrapper = getComplexWrapper()
        expect(wrapper.html()).toMatchSnapshot()
      })
    })

    describe('And rendering with the edge type cross', () => {
      test('Should render all nodes and edges vertically with edge type cross', () => {
        const wrapper = getComplexWrapper({
          edgeType: EdgeType.CROSS
        })

        expect(wrapper.html()).toMatchSnapshot()
      })
    })
  })

  describe('When rendering in horizontal mode', () => {
    describe('And rendering with the default edge type (bent)', () => {
      test('Should render all nodes and edges horizontally with edge type bent', () => {
        const wrapper = getComplexWrapper({
          mode: Mode.HORIZONTAL
        })

        expect(wrapper.html()).toMatchSnapshot()
      })
    })

    describe('And rendering with the edge type cross', () => {
      test('Should render all nodes and edges horizontally with edge type cross', () => {
        const wrapper = getComplexWrapper({
          mode: Mode.HORIZONTAL,
          edgeType: EdgeType.CROSS
        })

        expect(wrapper.html()).toMatchSnapshot()
      })
    })
  })

  describe('When rendering using custom size', () => {
    describe('Using custom width', () => {
      describe('Using only the width', () => {
        test('Should render the flowchart with the custom width', () => {
          const wrapper = getSimpleWrapper({
            mode: Mode.VERTICAL,
            width: 1200
          })

          expect(wrapper.html()).toMatchSnapshot()
        })
      })

      describe('Using the width and the height', () => {
        describe('And the height is lower than its natural height', () => {
          test('Should render using the custom width and the natural height', () => {
            const wrapper = getSimpleWrapper({
              mode: Mode.VERTICAL,
              width: 1200,
              height: 300
            })

            expect(wrapper.html()).toMatchSnapshot()
          })
        })

        describe('And the height is higher than its natural height', () => {
          test('Should render using the custom width and the custom height with margin', () => {
            const wrapper = getSimpleWrapper({
              mode: Mode.VERTICAL,
              width: 1200,
              height: 2000
            })

            expect(wrapper.html()).toMatchSnapshot()
          })
        })
      })
    })

    describe('Using custom height', () => {
      describe('Using only the height', () => {
        test('Should render the flowchart with the custom height', () => {
          const wrapper = getSimpleWrapper({
            mode: Mode.HORIZONTAL,
            height: 1000
          })

          expect(wrapper.html()).toMatchSnapshot()
        })
      })

      describe('Using the height and the width', () => {
        describe('And the width is lower than its natural width', () => {
          test('Should render using the custom width and the natural width', () => {
            const wrapper = getSimpleWrapper({
              mode: Mode.HORIZONTAL,
              width: 300,
              height: 1000
            })

            expect(wrapper.html()).toMatchSnapshot()
          })
        })

        describe('And the width is higher than its natural width', () => {
          test('Should render using the custom width and the custom width', () => {
            const wrapper = getSimpleWrapper({
              mode: Mode.HORIZONTAL,
              width: 1500,
              height: 1000
            })

            expect(wrapper.html()).toMatchSnapshot()
          })
        })
      })
    })
  })

  describe('When rendering using custom node sizes', () => {
    describe('In vertical mode', () => {
      test('Should render the flowchart with the custom node size', () => {
        // Make a copy of it since it would be mutating the node
        const alteredNodes = {
          ...simpleGraph.nodes,
          second: {
            ...simpleGraph.nodes.second,
            width: 200,
            height: 200
          }
        }

        const wrapper = getSimpleWrapper({
          nodes: alteredNodes,
          mode: Mode.VERTICAL
        })

        expect(wrapper.html()).toMatchSnapshot()
      })
    })

    describe('In horizontal mode', () => {
      test('Should render the flowchart with the custom node size', () => {
        // Make a copy of it since it would be mutating the node
        const alteredNodes = {
          ...simpleGraph.nodes,
          second: {
            ...simpleGraph.nodes.second,
            width: 200,
            height: 200
          }
        }

        const wrapper = getSimpleWrapper({
          nodes: alteredNodes,
          mode: Mode.HORIZONTAL
        })

        expect(wrapper.html()).toMatchSnapshot()
      })
    })
  })
})
