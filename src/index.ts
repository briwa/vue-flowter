import { Prop, Component, Vue } from 'vue-property-decorator'

// Components
import FlowterEdge from '@/components/flowter-edge/index.vue'
import FlowterNode from '@/components/flowter-node/index.vue'

// Types
import {
  EdgeMarker, EdgeDirection, EdgeType, Mode,
  GraphNode, RenderedGraphNode, GraphEdge, RenderedGraphEdge,
  EdgesDict
} from '@/types'

@Component({
  components: {
    FlowterEdge,
    FlowterNode
  }
})
export default class Flowter extends Vue {
  @Prop({ type: Object, required: true })
  public nodes!: Record<string, GraphNode>
  @Prop({ type: Array, required: true })
  public edges!: GraphEdge[]
  @Prop({ type: Number, default: null })
  public width!: number
  @Prop({ type: Number, default: null })
  public height!: number
  @Prop({ type: String, default: Mode.VERTICAL })
  public mode!: Mode
  @Prop({ type: String, default: EdgeType.BENT })
  public edgeType!: EdgeType

  // Computed
  public get containerStyle () {
    // Scale the flowchart if width is specified
    // It will ignore the custom height though
    // since the scale is solely by the width
    if (this.width && this.mode === Mode.VERTICAL) {
      return {
        width: `${this.width}px`,
        height: `${this.containerHeight * this.widthRatio}px`
      }
    }

    // Same thing for height in horizontal mode
    if (this.height && this.mode === Mode.HORIZONTAL) {
      return {
        height: `${this.height}px`,
        width: `${this.containerWidth * this.heightRatio}px`
      }
    }

    return {
      width: `${this.containerWidth}px`,
      height: `${this.containerHeight}px`
    }
  }
  public get scaleStyle () {
    let ratio
    if (this.width && this.mode === Mode.VERTICAL) {
      ratio = this.widthRatio
    }

    // Same thing for height in horizontal mode
    if (this.height && this.mode === Mode.HORIZONTAL) {
      ratio = this.heightRatio
    }

    if (!ratio) {
      return null
    }

    return {
      transform: `scale(${ratio})`,
      transformOrigin: '0% 0%'
    }
  }
  public get renderedNodes () {
    const { toIds, fromIds } = this.edgesDict
    const nodes: RenderedGraphNode[][] = []
    const loneNodes: RenderedGraphNode[] = []
    let maxColSize = 1

    // Loop through the nodes dictionary
    // to shape it into rows of nodes
    for (const nodeId in this.nodes) {
      if (this.nodes.hasOwnProperty(nodeId)) {
        const node = this.nodes[nodeId]
        const renderedNode = {
          id: nodeId,
          text: node.text,
          x: 0,
          y: 0,
          width: this.defaultNodeWidth,
          height: this.defaultNodeHeight
        }

        const currFromIds = fromIds[nodeId]
        const currToIds = toIds[nodeId]

        // If for some reason there's a node that
        // has no both from and to, it's a lone node...
        // Don't bother doing anything else
        if (!currFromIds && !currToIds) {
          loneNodes.push(renderedNode)
          continue
        }

        // The first node in the loop has to be pushed
        // as the new node in the new row
        let pushAsNewRow = nodes.length === 0

        // Subsequent nodes should use
        // the previous node as the reference
        if (!pushAsNewRow) {
          const lastRow = nodes[nodes.length - 1]
          const lastRowIds = lastRow.map((n) => n.id)

          // If the node comes from the previous row, it is in the same row
          pushAsNewRow = currFromIds.some((id) => lastRowIds.indexOf(id) >= 0)
        }

        // New layer with the new node
        if (pushAsNewRow) {
          nodes.push([renderedNode])
        } else { // Another node in the layer
          const row = nodes[nodes.length - 1]

          row.push(renderedNode)
          maxColSize = Math.max(row.length, maxColSize)
        }
      }
    }

    // Shape the nodes to assign
    // positions depending on the mode
    switch (this.mode) {
      case Mode.VERTICAL: {
        this.shapeNodesVertically(nodes, maxColSize)
        break
      }
      case Mode.HORIZONTAL: {
        this.shapeNodesHorizontally(nodes, maxColSize)
        break
      }
      default: {
        throw new Error(`Unknown mode :${this.mode}`)
      }
    }

    // Render lone nodes too,
    // and it will always be at the top left corner
    if (loneNodes.length) {
      nodes.push(loneNodes)
    }

    return nodes
  }
  public get centerPoint () {
    return {
      x: this.containerWidth / 2,
      y: this.containerHeight / 2
    }
  }
  public get maxColSize () {
    return this.renderedNodes.reduce((colSize, row) => {
      return Math.max(colSize, row.length)
    }, 0)
  }
  private get containerWidth () {
    switch (this.mode) {
      case Mode.VERTICAL: {
        return this.maxColSize * this.defaultNodeWidth
          + ((this.maxColSize - 1) * this.defaultNodeColSpacing)
          + (this.defaultWidthMargin * 2)
      }
      case Mode.HORIZONTAL: {
        return this.renderedNodes.length * this.defaultNodeWidth
          + ((this.renderedNodes.length - 1) * this.defaultNodeRowSpacing)
          + (this.defaultWidthMargin * 2)
      }
    }
  }
  private get containerHeight () {
    switch (this.mode) {
      case Mode.VERTICAL: {
        return this.renderedNodes.length * this.defaultNodeHeight
          + ((this.renderedNodes.length - 1) * this.defaultNodeRowSpacing)
          + (this.defaultHeightMargin * 2)
      }
      case Mode.HORIZONTAL: {
        return this.maxColSize * this.defaultNodeHeight
          + ((this.maxColSize - 1) * this.defaultNodeColSpacing)
          + (this.defaultHeightMargin * 2)
      }
    }
  }
  private get widthRatio () {
    return this.width ? this.width / this.containerWidth : 1
  }
  private get heightRatio () {
    return this.height ? this.height / this.containerHeight : 1
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
    return this.edges.reduce<EdgesDict>((dict, edge) => {
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
  // TODO: These constants will be overidden
  // by props since it's supposed to be configurable
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
    return 25
  }
  private get defaultHeightMargin () {
    return 25
  }

  // Methods
  public getEdges (node: RenderedGraphNode): RenderedGraphEdge[] {
    return this.edges.reduce<RenderedGraphEdge[]>((edges, edge, idx) => {
      if (edge.from !== node.id) {
        return edges
      }

      edges.push(this.shapeEdge(node, edge, idx))
      return edges
    }, [])
  }
  private getOrientPoints (node: RenderedGraphNode) {
    return {
      n: { x: node.width / 2, y: 0 },
      w: { x: 0, y: node.height / 2 },
      e: { x: node.width, y: node.height / 2 },
      s: { x: node.width / 2, y: node.height }
    }
  }
  private shapeEdge (originNode: RenderedGraphNode, edge: GraphEdge, idx: number) {
    const originPoints = this.getOrientPoints(originNode)
    const fromIndex = this.getNodeRowIndex(originNode)

    // Get the target node
    // Chances are this node isn't properly linked
    const targetNode = this.renderedNodesDict[edge.to]
    if (!targetNode) {
      throw new Error(`Unable to find a target node with id: ${edge.to}`)
    }

    const targetPoints = this.getOrientPoints(targetNode)
    const toIndex = this.getNodeRowIndex(targetNode)

    const shapedEdge: RenderedGraphEdge = {
      id: `${edge.from}-${edge.to}-${idx}`,
      from: edge.from,
      to: edge.to,
      text: edge.text,
      startPoint: { x: 0, y: 0 },
      endPoint: { x: 0, y: 0 },
      marker: EdgeMarker.END,
      direction: EdgeDirection.FORWARD
    }

    switch (this.mode) {
      case Mode.VERTICAL: {
        if (toIndex > fromIndex) {
          shapedEdge.startPoint.x = originPoints.s.x + originNode.x
          shapedEdge.startPoint.y = originPoints.s.y + originNode.y

          shapedEdge.endPoint.x = targetPoints.n.x + targetNode.x
          shapedEdge.endPoint.y = targetPoints.n.y + targetNode.y
        } else if (toIndex < fromIndex) {
          // For backward edge, to simplify the calc,
          // make the marker go from the target node
          // to the origin node, then swap the marker
          // Also, the entry point will always be either
          // west or east depending on the distance between
          // target and origin
          const originNodeCenterPoint = (originNode.x + (originNode.width / 2))
          const direction = originNodeCenterPoint > this.containerWidth / 2
            ? 'e' : 'w'

          shapedEdge.startPoint.x = originPoints[direction].x + targetNode.x
          shapedEdge.startPoint.y = originPoints[direction].y + targetNode.y

          shapedEdge.endPoint.x = targetPoints[direction].x + originNode.x
          shapedEdge.endPoint.y = targetPoints[direction].y + originNode.y

          shapedEdge.marker = EdgeMarker.START
          shapedEdge.direction = EdgeDirection.BACKWARD
        }
        break
      }
      case Mode.HORIZONTAL: {
        if (toIndex >= fromIndex) {
          shapedEdge.startPoint.x = originPoints.e.x + originNode.x
          shapedEdge.startPoint.y = originPoints.e.y + originNode.y

          shapedEdge.endPoint.x = targetPoints.w.x + targetNode.x
          shapedEdge.endPoint.y = targetPoints.w.y + targetNode.y
        } else if (toIndex < fromIndex) {
          // For backward edge, to simplify the calc,
          // make the marker go from the target node
          // to the origin node, then swap the marker
          // Also, the entry point will always be either
          // south or north depending on the distance between
          // target and origin
          const originNodeCenterPoint = (originNode.y + (originNode.height / 2))
          const direction = originNodeCenterPoint > this.containerHeight / 2
            ? 's' : 'n'

          shapedEdge.startPoint.x = originPoints[direction].x + targetNode.x
          shapedEdge.startPoint.y = originPoints[direction].y + targetNode.y

          shapedEdge.endPoint.x = targetPoints[direction].x + originNode.x
          shapedEdge.endPoint.y = targetPoints[direction].y + originNode.y

          shapedEdge.marker = EdgeMarker.START
          shapedEdge.direction = EdgeDirection.BACKWARD
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
  private shapeNodesVertically (nodes: RenderedGraphNode[][], maxColSize: number) {
    // Since the full rows and cols of the nodes is there,
    // the maximum width can only now be determined.
    const maxRowLength =
      // The width of all nodes
      (maxColSize * this.defaultNodeWidth)
      // With the spacing except for the first and last one
      + ((maxColSize - 1) * this.defaultNodeColSpacing)
      // With the default width margin left and right
      + (this.defaultWidthMargin * 2)

    nodes.forEach((row, rowIdx) => {
      const currRowLength = (row.length * this.defaultNodeWidth)
          + ((row.length - 1) * this.defaultNodeColSpacing)

      row.forEach((node, colIdx) => {
        node.x =
          // Get the leftmost position
          (maxRowLength / 2) - (currRowLength / 2)
          // Plus each of the nodes' width
          // Plus the spacing for each of the node (except the first and the last one)
          + (colIdx * (this.defaultNodeWidth + (colIdx !== 0 ? this.defaultNodeColSpacing : 0)))

        node.y =
          // For every row, add height plus the margin
          (rowIdx * (this.defaultNodeHeight + this.defaultNodeRowSpacing))
          // Only need to add the top margin since
          // the bottom one is being taken care of by
          // the row spacing
          + (this.defaultHeightMargin)
      })
    })
  }
  private shapeNodesHorizontally (nodes: RenderedGraphNode[][], maxColSize: number) {
    // Since the full rows and cols of the nodes is there,
    // the maximum width can only now be determined.
    const maxColLength =
      // The width of all nodes
      (maxColSize * this.defaultNodeHeight)
      // With the spacing except for the first and last one
      + ((maxColSize - 1) * this.defaultNodeColSpacing)
      // With the default width margin left and right
      + (this.defaultHeightMargin * 2)

    nodes.forEach((row, rowIdx) => {
      const currRowLength = (row.length * this.defaultNodeHeight)
          + ((row.length - 1) * this.defaultNodeColSpacing)

      row.forEach((node, colIdx) => {
        node.x =
          // For every row, add height plus the margin
          (rowIdx * (this.defaultNodeWidth + this.defaultNodeRowSpacing))
          // Only need to add the top margin since
          // the bottom one is being taken care of by
          // the row spacing
          + (this.defaultWidthMargin)

        node.y =
          // Get the topmost position
          (maxColLength / 2) - (currRowLength / 2)
          // Plus each of the nodes' width
          // Plus the spacing for each of the node (except the first and the last one)
          + (colIdx * (this.defaultNodeHeight + (colIdx !== 0 ? this.defaultNodeColSpacing : 0)))
      })
    })
  }
}
