// Libraries
import Vue from 'vue'

// Components
import Flowter from './index.vue'

// Types
import { GraphNode, GraphEdge } from './types'

// To populate data during development,
// use the test fixtures data by default
// since those covers all the use cases.
import graph from '../__fixtures__/graph.json'
const nodes: Record<string, GraphNode> = graph.nodes
const edges: GraphEdge[] = graph.edges

Vue.config.productionTip = false

const instance = new Vue({
  data () {
    return {
      nodes,
      edges
    }
  },
  // This is just for development purpose;
  // Ideally the parent should be passing this as data properly
  // tslint:disable-next-line
  render: function (h) {
    const inst = this as any

    return h(Flowter, {
      props: { nodes: inst.nodes, edges: inst.edges, width: 800 }
    })
  },
  mounted () {
    const inst = this as any

    inst.$children[0].$on('resize', ({ id, width, height }: { id: string, width?: number, height?: number }) => {
      if (width) {
        instance.$set(instance.$data.nodes[id], 'width', width)
      } else if (height) {
        instance.$set(instance.$data.nodes[id], 'height', height)
      }
    })

    inst.$children[0].$on('move', ({ id, x, y }: { id: string, x?: number, y?: number }) => {
      if (x) {
        instance.$set(instance.$data.nodes[id], 'x', x)
      } else if (y) {
        instance.$set(instance.$data.nodes[id], 'y', y)
      }
    })
  }
})

instance.$mount('#app')
