// Libraries
import { mount } from '@vue/test-utils'

// Component to test
import FlowterFlowchart from '@/components/flowter-flowchart/index.vue'

// Mocked data
import allGraph from '../__fixtures__/all.json'
import simpleGraph from '../__fixtures__/simple.json'
import vueLifeCycleGraph from '../__fixtures__/vue-lifecycle.json'

// This is to test all the possible edges and nodes
// Using the complex wrapper from the fixtures
function getComplexWrapper (props = {}) {
  return mount(FlowterFlowchart, {
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
  return mount(FlowterFlowchart, {
    propsData: {
      nodes: simpleGraph.nodes,
      edges: simpleGraph.edges,
      ...props
    }
  })
}

// Types
import { EdgeType, Mode } from '@/shared/types'

describe('Flowter Flowchart', () => {
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

  describe('When rendering using custom appearances', () => {
    test('Should render all nodes and edges horizontally with edge type bent', () => {
      const wrapper = mount(FlowterFlowchart, {
        propsData: {
          nodes: vueLifeCycleGraph.nodes,
          edges: vueLifeCycleGraph.edges
        }
      })

      expect(wrapper.html()).toMatchSnapshot()
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
