import { Prop, Component, Vue } from 'vue-property-decorator'
import FlowterEdge from '@/components/flowter-edge/index.vue'
import FlowterNode from '@/components/flowter-node/index.vue'

interface GraphNode {
  text: string
}

interface RenderedGraphNode {
  id: string
  text: string
  top: number
  left: number
}

interface GraphEdge {
  from: string
  to: string
  option?: string
}

interface EdgeDict {
  toIds: Record<string, GraphEdge['to'][]>
  fromIds: Record<string, GraphEdge['from'][]>
}

@Component({
  components: {
    FlowterEdge,
    FlowterNode
  }
})
export default class Flowter extends Vue {
  // @Prop({ type: Array, default: () => [] })
  // public nodes!: GraphNode[]
  // @Prop({ type: Array, default: () => [] })
  // public edges!: GraphEdge[]
  @Prop({ type: Number, default: 500 })
  public width!: number
  @Prop({ type: Number, default: 500 })
  public height!: number

  // Data
  public nodes: Record<string, GraphNode> = {
    1: { text: 'First A' },
    2: { text: 'First B' },
    3: { text: 'Second?' },
    4: { text: 'You said No' },
    5: { text: 'You said Yes' },
    6: { text: 'Since you said No, then No' },
    7: { text: 'Since you said Yes, then Yes' },
    8: { text: 'Alright then.' }
  }
  public edges: GraphEdge[] = [
    { from: '1', to: '3' },
    { from: '2', to: '3' },
    { from: '3', to: '4', option: 'No' },
    { from: '3', to: '5', option: 'Yes' },
    { from: '4', to: '6' },
    { from: '5', to: '7' },
    { from: '6', to: '8' },
    { from: '7', to: '8' }
  ]
  public nodeOrients = []

  // Computed
  public get containerStyle () {
    return {
      width: `${this.width}px`,
      height: `${this.height}px`
    }
  }

  public get shapedNodes () {
    // Map all edges into to/from ids for easier access
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

    const nodes: RenderedGraphNode[][] = []

    // Loop through the nodes dictionary
    // to shape it into rows of nodes
    for (const nodeId in this.nodes) {
      if (this.nodes.hasOwnProperty(nodeId)) {
        const node = this.nodes[nodeId]

        // First and last node wouldn't have this info
        const currToId = toIds[nodeId] ? toIds[nodeId][0] : null
        const currFromId = fromIds[nodeId] ? fromIds[nodeId][0] : null

        // The first node in the loop has to be pushed
        // as the new node in the new row
        let pushAsNewRow = nodes.length === 0

        // Subsequent nodes should use
        // the previous node as the reference
        if (!pushAsNewRow) {
          const lastRow = nodes[nodes.length - 1]
          const lastNode = lastRow[lastRow.length - 1]
          const prevToId = toIds[lastNode.id] ? toIds[lastNode.id][0] : null
          const prevFromId = fromIds[lastNode.id] ? fromIds[lastNode.id][0] : null

          // Only push the layer when previous node's to/from
          // is different than the current node's to/from!
          pushAsNewRow = prevToId !== currToId
            && prevFromId !== currFromId
        }

        // New layer with the new node
        if (pushAsNewRow) {
          const rowIdx = nodes.length

          nodes.push([{
            id: nodeId,
            text: node.text,
            top: rowIdx * 100,
            left: 0
          }])
        } else {
          // Another node in the layer
          const rowIdx = nodes.length - 1
          const row = nodes[nodes.length - 1]
          const colIdx = row.length

          row.push({
            id: nodeId,
            text: node.text,
            top: rowIdx * 100,
            left: colIdx * 150
          })
        }
      }
    }

    return nodes
  }

  public getEdges (node: RenderedGraphNode) {
    return this.edges.filter((edge) => edge.from === node.id)
  }
}
