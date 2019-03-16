import { Prop, Component, Vue } from 'vue-property-decorator'
import FlowterEdge from '@/components/flowter-edge/index.vue'
import FlowterNode from '@/components/flowter-node/index.vue'

// TODO:
// - Use x/y for all points related

interface GraphNode {
  text: string
}

interface RenderedGraphNode {
  id: string
  text: string
  top: number
  left: number
  width: number
  height: number
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
  @Prop({ type: Object, required: true })
  public nodes!: Record<string, GraphNode>
  @Prop({ type: Array, default: () => [] })
  public edges!: GraphEdge[]
  @Prop({ type: Number, default: 500 })
  public width!: number
  @Prop({ type: Number, default: 500 })
  public height!: number

  // Computed
  public get defaultNodeWidth () {
    return 100
  }
  public get defaultNodeHeight () {
    return 50
  }
  public get defaultNodeRowSpacing () {
    return 100
  }
  public get defaultNodeColSpacing () {
    return 50
  }
  public get containerStyle () {
    return {
      width: `${this.width}px`,
      height: `${this.height}px`
    }
  }
  // Map all edges into to/from ids for easier access
  public get edgesDict () {
    return this.edges.reduce<EdgeDict>((dict, edge) => {
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
  }
  public get renderedNodes () {
    const { toIds, fromIds } = this.edgesDict
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
            top: rowIdx * this.defaultNodeRowSpacing,
            left: (this.width / 2) - (this.defaultNodeWidth / 2),
            width: this.defaultNodeWidth,
            height: this.defaultNodeHeight
          }])
        } else { // Another node in the layer
          const row = nodes[nodes.length - 1]
          const rowIdx = nodes.length - 1

          row.push({
            id: nodeId,
            text: node.text,
            top: rowIdx * this.defaultNodeRowSpacing,
            left: 0,
            width: this.defaultNodeWidth,
            height: this.defaultNodeHeight
          })

          // After the new node gets pushed,
          // The current nodes horizontal position in that row
          // needs to get 'fixed' since new member came along
          const rowHorizontalLength = (row.length * this.defaultNodeWidth)
            + ((row.length - 1) * this.defaultNodeColSpacing)

          row.forEach((n, idx) => {
            n.left = (this.width / 2) - (rowHorizontalLength / 2)
              + (idx * (this.defaultNodeWidth))
              + (idx !== 0 ? this.defaultNodeColSpacing : 0)
          })
        }
      }
    }

    return nodes
  }
  public get renderedNodesDict () {
    const dict: Record<string, RenderedGraphNode> = {}

    for (const row of this.renderedNodes) {
      for (const node of row) {
        dict[node.id] = node
      }
    }

    return dict
  }

  // Methods
  public getEdges (node: RenderedGraphNode) {
    return this.edges.filter((edge) => edge.from === node.id)
  }
  public getOrientPoints (node: RenderedGraphNode) {
    return {
      n: [node.width / 2, 0],
      w: [node.width / 2, node.height / 2],
      e: [node.width, node.height / 2],
      s: [node.width / 2, node.height]
    }
  }
  public getStartPoint (originNode: RenderedGraphNode) {
    const points = this.getOrientPoints(originNode)
    // TODO: for now, orient is always from the south
    const point = points.s

    return [
      point[0] + originNode.left,
      point[1] + originNode.top
    ]
  }
  public getEndPoint (edge: GraphEdge) {
    const targetNode = this.renderedNodesDict[edge.to]
    const points = this.getOrientPoints(targetNode)
    // TODO: for now, orient is always from the north
    const point = points.n

    return [
      point[0] + targetNode.left,
      point[1] + targetNode.top
    ]
  }
}
