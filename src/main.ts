// Libraries
import Vue from 'vue'
Vue.config.productionTip = false

// Components
import Flowter from './index.vue'

// Types
import { GraphNode, GraphEdge } from './shared/types'
interface Main extends Vue {
  nodes: Record<string, GraphNode>
  edges: GraphEdge[]
}

// To populate data during development,
// use the test fixtures data by default
// since those covers all the use cases.
import graph from '../__fixtures__/all.json'
const nodes = graph.nodes
const edges = graph.edges

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
    const inst = this as Main

    return h(Flowter, {
      props: { nodes: inst.nodes, edges: inst.edges }
    })
  },
  mounted () {
    const inst = this as Main

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
      }

      if (y) {
        instance.$set(instance.$data.nodes[id], 'y', y)
      }
    })
  }
})

instance.$mount('#app')
