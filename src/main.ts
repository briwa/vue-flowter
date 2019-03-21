import Vue from 'vue'
import Flowter from './index.vue'
import { GraphNode, GraphEdge } from './types'

// To populate data during development,
// use the test fixtures data by default
// since those covers all the use cases.
import graph from '../fixtures/graph.json'
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
      props: { nodes: inst.nodes, edges: inst.edges }
    })
  },
  mounted () {
    const inst = this as any

    inst.$children[0].$on('resize', ({ id, width, height }: { id: string, width: number, height: number }) => {
      instance.$set(instance.$data.nodes[id], 'width', width)
      instance.$set(instance.$data.nodes[id], 'height', height)
    })
  }
})

instance.$mount('#app')
