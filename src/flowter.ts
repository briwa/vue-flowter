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
  @Prop({ type: Number, default: null })
  public width!: number
  @Prop({ type: Number, default: null })
  public height!: number

  // Computed
  public get containerStyle () {
    const minWidth = Math.max(this.width, this.containerWidth)
    const minHeight = Math.max(this.height, this.containerHeight)

    return {
      width: `${this.width || this.containerWidth}px`,
      height: `${this.height || this.containerHeight}px`,
      minWidth: `${minWidth}px`,
      minHeight: `${minHeight}px`,
      overflow: 'hidden'
    }
  }
  public get renderedNodes () {
    const { toIds, fromIds } = this.edgesDict
    const nodes: RenderedGraphNode[][] = []
    let maxColSize = 0

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
          // The new column size would at least be 1,
          // let's see if it's bigger than the current one
          maxColSize = Math.max(1, maxColSize)

          nodes.push([{
            id: nodeId,
            text: node.text,
            top: 0,
            left: 0,
            width: this.defaultNodeWidth,
            height: this.defaultNodeHeight
          }])

        } else { // Another node in the layer
          const row = nodes[nodes.length - 1]

          row.push({
            id: nodeId,
            text: node.text,
            top: 0,
            left: 0,
            width: this.defaultNodeWidth,
            height: this.defaultNodeHeight
          })

          maxColSize = Math.max(row.length, maxColSize)
        }
      }
    }

    // Since the full rows and cols of the nodes is there,
    // the maximum width can only now be determined.
    const maxRowLength = (maxColSize * this.defaultNodeWidth)
      + ((maxColSize - 1) * this.defaultNodeColSpacing)
    const minWidth = Math.max(this.width, maxRowLength)

    nodes.forEach((row, rowIdx) => {
      const currRowLength = (row.length * this.defaultNodeWidth)
          + ((row.length - 1) * this.defaultNodeColSpacing)

      row.forEach((node, colIdx) => {
        // TODO: This needs no change when
        // the horizontal mode is implemented
        node.top = rowIdx * (this.defaultNodeHeight + this.defaultNodeRowSpacing)

        node.left =
          // Get the leftmost position
          (minWidth / 2) - (currRowLength / 2)
          // Plus each of the nodes' width
          // Plus the spacing for each of the node (except the first one)
          + (colIdx * (this.defaultNodeWidth + (colIdx !== 0 ? this.defaultNodeColSpacing : 0)))
      })
    })

    return nodes
  }
  private get containerWidth () {
    const maxColSize = this.renderedNodes.reduce((colSize, row) => {
      return Math.max(colSize, row.length)
    }, 0)

    return maxColSize * this.defaultNodeWidth
      + ((maxColSize - 1) * this.defaultNodeColSpacing)
  }
  private get containerHeight () {
    return this.renderedNodes.length * this.defaultNodeHeight
      + ((this.renderedNodes.length - 1) * this.defaultNodeRowSpacing)
  }
  // Map all nodes into a dictionary for easier access
  private get renderedNodesDict () {
    const dict: Record<string, RenderedGraphNode> = {}

    for (const row of this.renderedNodes) {
      for (const node of row) {
        dict[node.id] = node
      }
    }

    return dict
  }
  // Map all edges into to/from ids also for easier access
  private get edgesDict () {
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
  private get defaultNodeWidth () {
    return 100
  }
  private get defaultNodeHeight () {
    return 50
  }
  private get defaultNodeRowSpacing () {
    return 50
  }
  private get defaultNodeColSpacing () {
    return 50
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
