import { Prop, Component, Vue } from 'vue-property-decorator'
import FlowterEdge from '@/components/flowter-edge/index.vue'
import FlowterNode from '@/components/flowter-node/index.vue'

// TODO:
// - Use x/y for all points related

enum Marker {
  START = 'start',
  END = 'end'
}

enum Direction {
  FORWARD = 'forward',
  BACKWARD = 'backward'
}

interface GraphNode {
  text: string
}

interface RenderedGraphNode extends GraphNode {
  id: string
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

interface RenderedGraphEdge extends GraphEdge {
  startPoint: number[]
  endPoint: number[]
  marker: Marker
  direction: Direction
}

interface EdgeDict {
  toIds: Record<string, GraphEdge['to'][]>
  fromIds: Record<string, GraphEdge['from'][]>
}

enum Mode {
  VERTICAL = 'vertical', // Top-bottom
  HORIZONTAL = 'horizontal' // Left-right
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
  @Prop({ type: String, default: Mode.VERTICAL })
  public mode!: Mode

  // Computed
  public get containerStyle () {
    const styleDict: Record<string, string> = {
      width: `${this.width || this.containerWidth}px`,
      height: `${this.height || this.containerHeight}px`,
      overflow: 'hidden'
    }

    if (this.width) {
      styleDict.minWidth = `${this.minWidth}px`
    }

    if (this.height) {
      styleDict.minHeight = `${this.minHeight}px`
    }

    return styleDict
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
      + (this.defaultWidthMargin * 2)
    const minWidth = Math.max(this.width, maxRowLength)

    nodes.forEach((row, rowIdx) => {
      const currRowLength = (row.length * this.defaultNodeWidth)
          + ((row.length - 1) * this.defaultNodeColSpacing)

      row.forEach((node, colIdx) => {
        // TODO: This needs no change when
        // the horizontal mode is implemented
        node.top = (rowIdx * (this.defaultNodeHeight + this.defaultNodeRowSpacing))
         + (this.defaultHeightMargin)

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
  public get centerPoint () {
    return [this.minWidth / 2, this.minHeight / 2]
  }
  private get containerWidth () {
    const maxColSize = this.renderedNodes.reduce((colSize, row) => {
      return Math.max(colSize, row.length)
    }, 0)

    return maxColSize * this.defaultNodeWidth
      + ((maxColSize - 1) * this.defaultNodeColSpacing)
      + (this.defaultWidthMargin * 2)
  }
  private get containerHeight () {
    return this.renderedNodes.length * this.defaultNodeHeight
      + ((this.renderedNodes.length - 1) * this.defaultNodeRowSpacing)
      + (this.defaultHeightMargin * 2)
  }
  private get minWidth () {
    return Math.max(this.width, this.containerWidth)
  }
  private get minHeight () {
    return Math.max(this.width, this.containerWidth)
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
  private get defaultWidthMargin () {
    return this.width ? 0 : 25
  }
  private get defaultHeightMargin () {
    return this.height ? 0 : 25
  }

  // Methods
  public getEdges (node: RenderedGraphNode): RenderedGraphEdge[] {
    return this.edges.reduce<RenderedGraphEdge[]>((edges, edge) => {
      if (edge.from !== node.id) {
        return edges
      }

      edges.push(this.shapeEdge(node, edge))
      return edges
    }, [])
  }
  private getOrientPoints (node: RenderedGraphNode) {
    return {
      n: [node.width / 2, 0],
      w: [0, node.height / 2],
      e: [node.width, node.height / 2],
      s: [node.width / 2, node.height]
    }
  }
  private shapeEdge (originNode: RenderedGraphNode, edge: GraphEdge) {
    const originPoints = this.getOrientPoints(originNode)
    const fromIndex = this.getNodeRowIndex(originNode)
    const targetNode = this.renderedNodesDict[edge.to]
    const targetPoints = this.getOrientPoints(targetNode)
    const toIndex = this.getNodeRowIndex(targetNode)

    const shapedEdge: RenderedGraphEdge = {
      from: edge.from,
      to: edge.to,
      startPoint: [0, 0],
      endPoint: [0, 0],
      marker: Marker.END,
      direction: Direction.FORWARD
    }

    switch (this.mode) {
      case Mode.VERTICAL: {
        if (toIndex > fromIndex) {
          shapedEdge.startPoint = [
            originPoints.s[0] + originNode.left,
            originPoints.s[1] + originNode.top
          ]
          shapedEdge.endPoint = [
            targetPoints.n[0] + targetNode.left,
            targetPoints.n[1] + targetNode.top
          ]
        } else if (toIndex < fromIndex) {
          // For backward edge, to simplify the calc,
          // make the marker go from the target node
          // to the origin node, then swap the marker
          // Also, the entry point will always be either
          // west or east depending on the distance between
          // target and origin
          const originNodeCenterPoint = (originNode.left + (originNode.width / 2))
          const direction = originNodeCenterPoint > (this.minWidth / 2)
            ? 'e' : 'w'

          shapedEdge.startPoint = [
            originPoints[direction][0] + targetNode.left,
            originPoints[direction][1] + targetNode.top
          ]
          shapedEdge.endPoint = [
            targetPoints[direction][0] + originNode.left,
            targetPoints[direction][1] + originNode.top
          ]
          shapedEdge.marker = Marker.START
          shapedEdge.direction = Direction.BACKWARD
        }
        break
      }
      case Mode.HORIZONTAL: {
        if (toIndex >= fromIndex) {
          shapedEdge.startPoint = [
            originPoints.e[0] + originNode.left,
            originPoints.e[1] + originNode.top
          ]
          shapedEdge.endPoint = [
            targetPoints.w[0] + targetNode.left,
            targetPoints.w[1] + targetNode.top
          ]
        } else {
          // TODO: check if it's better to go left or right
          // For now, it will always go right
          shapedEdge.startPoint = [
            originPoints.s[0] + originNode.left,
            originPoints.s[1] + originNode.top
          ]
          shapedEdge.endPoint = [
            targetPoints.n[0] + targetNode.left,
            targetPoints.n[1] + targetNode.top
          ]
        }
        break
      }
      default: {
        throw new Error(`Unknown mode: ${this.mode}`)
      }
    }

    return shapedEdge
  }
  private getNodeRowIndex (targetNode: RenderedGraphNode) {
    return this.renderedNodes.findIndex((row) => {
      return !!row.find((node) => node.id === targetNode.id)
    })
  }
}
