import { Prop, Component, Vue } from 'vue-property-decorator'
import FlowterEdge from '@/components/flowter-edge/index.vue'
import FlowterNode from '@/components/flowter-node/index.vue'

interface GraphNode {
  id: number | string
  text: string
}

interface GraphEdge {
  from: number | string
  to: number | string
  option?: string
}

@Component({
  components: {
    FlowterEdge,
    FlowterNode
  }
})
export default class Flowter extends Vue {
  // @Prop({ type: Array, default: () => [] })
  // public nodes!: any[] // TODO: type this
  // @Prop({ type: Array, default: () => [] })
  // public edges!: any[] // TODO: type this
  @Prop({ type: Number, default: 500 })
  public width!: number
  @Prop({ type: Number, default: 500 })
  public height!: number

  // Data
  public nodes: GraphNode[] = [
    { id: 1, text: 'First A' },
    { id: 2, text: 'First B' },
    { id: 3, text: 'Second?' },
    { id: 4, text: 'You said No' },
    { id: 5, text: 'You said Yes' },
    { id: 6, text: 'Since you said No, then No' },
    { id: 7, text: 'Since you said Yes, then Yes' },
    { id: 8, text: 'Alright then.' }
  ]
  public edges: GraphEdge[] = [
    { from: 1, to: 3 },
    { from: 2, to: 3 },
    { from: 3, to: 4, option: 'No' },
    { from: 3, to: 5, option: 'Yes' },
    { from: 4, to: 6 },
    { from: 5, to: 7 },
    { from: 6, to: 8 },
    { from: 7, to: 8 }
  ]

  // Computed
  public get containerStyle () {
    return {
      width: `${this.width}px`,
      height: `${this.height}px`
    }
  }

  public get shapedNodes () {
    // Map all edges into to/from ids for easier access
    interface EdgeDict {
      toIds: Record<string, GraphEdge['to'][]>
      fromIds: Record<string, GraphEdge['from'][]>
    }

    const { toIds, fromIds } = this.edges.reduce<EdgeDict>((dict, edge) => {
      if (!dict.toIds[edge.from]) {
        dict.toIds[edge.from] = []
      }

      if (!dict.fromIds[edge.to]) {
        dict.fromIds[edge.to] = []
      }

      dict.toIds[edge.from].push(edge.to)
      dict.fromIds[edge.to].push(edge.from)
      return dict
    }, {
      toIds: {},
      fromIds: {}
    })

    return this.nodes.reduce<GraphNode[][]>((total, node, idx) => {
      // Chances are it's the first/last node
      // so there would be no edges from/to
      const currToIds = toIds[node.id] || []
      const currFromIds = fromIds[node.id] || []

      // The first node in the loop has to be pushed
      // as the new node in the new layer
      let pushAsNewLayer = total.length === 0

      if (this.nodes[idx - 1]) {
        const prevNode = this.nodes[idx - 1]
        const prevToIds = toIds[prevNode.id] || []
        const prevFromIds = fromIds[prevNode.id] || []

        // Only push the layer when previous node's to/from
        // is different than the current node's to/from!
        pushAsNewLayer = prevToIds[0] !== currToIds[0]
          && prevFromIds[0] !== currFromIds[0]
      }

      // New layer with the new node
      if (pushAsNewLayer) {
        total.push([node])
        return total
      }

      // Another node in the layer
      total[total.length - 1].push(node)
      return total
    }, [])
  }
}
