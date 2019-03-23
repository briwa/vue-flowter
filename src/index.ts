// Libraries
import { Prop, Component, Vue } from 'vue-property-decorator'

// Components
import FlowterEdge from '@/components/flowter-edge/index.vue'
import FlowterNode from '@/components/flowter-node/index.vue'
import FlowterNodeSelection from '@/components/flowter-node-selection/index.vue'

// Constants
import {
  DEFAULT_NODE_WIDTH,
  DEFAULT_NODE_HEIGHT,
  DEFAULT_NODE_ROW_SPACING,
  DEFAULT_NODE_COL_SPACING,
  DEFAULT_WIDTH_MARGIN,
  DEFAULT_HEIGHT_MARGIN,
  DEFAULT_FONT_SIZE
} from '@/constants'

// Types
import {
  EdgeMarker, EdgeDirection, EdgeType, Mode,
  GraphNode, RenderedGraphNode, GraphEdge, RenderedGraphEdge,
  EdgesDict
} from '@/types'

@Component({
  components: {
    FlowterEdge,
    FlowterNode,
    FlowterNodeSelection
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
  @Prop({ type: Number, default: DEFAULT_NODE_WIDTH })
  public nodeWidth!: number
  @Prop({ type: Number, default: DEFAULT_NODE_HEIGHT })
  public nodeHeight!: number
  @Prop({ type: Number, default: DEFAULT_NODE_ROW_SPACING })
  public nodeRowSpacing!: number
  @Prop({ type: Number, default: DEFAULT_NODE_COL_SPACING })
  public nodeColSpacing!: number
  @Prop({ type: Number, default: DEFAULT_WIDTH_MARGIN })
  public widthMargin!: number
  @Prop({ type: Number, default: DEFAULT_HEIGHT_MARGIN })
  public heightMargin!: number
  @Prop({ type: Number, default: DEFAULT_FONT_SIZE })
  public fontSize!: number

  // Data
  private editingNodeId: string = ''

  // Computed
  public get containerStyle () {
    const style: Record<string, string | null> = {
      userSelect: this.editingNodeId ? 'none' : null,
      width: `${this.containerWidth}px`,
      height: `${this.containerHeight}px`
    }

    // Scale the flowchart if width is specified
    // It will ignore the custom height though
    // since the scale is solely by the width
    if (this.width) {
      style.width = `${this.width}px`

      // The width should never be lower than the natural height
      style.height = `${Math.max(this.height, this.containerHeight * this.widthRatio)}px`

      return style
    }

    // Same thing for height in horizontal mode
    if (this.height) {
      style.height = `${this.height}px`

      // The height should never be lower than the natural width
      style.width = `${Math.max(this.width, this.containerWidth * this.heightRatio)}px`

      return style
    }

    return style
  }
  public get scaleStyle () {
    if (this.width) {
      const style: Record<string, string> = {
        transform: `scale(${this.widthRatio})`,
        transformOrigin: '0% 0%'
      }

      // Make sure that the flowchart is still at the middle of the container
      const scaledHeight = this.containerHeight * this.widthRatio
      if (this.height > scaledHeight) {
        style.marginTop = `${(this.height - scaledHeight) / 2}px`
      }

      return style
    }

    if (this.height) {
      const style: Record<string, string> = {
        transform: `scale(${this.heightRatio})`,
        transformOrigin: '0% 0%'
      }

      // Make sure that the flowchart is still at the middle of the container
      const scaledWidth = this.containerWidth * this.heightRatio
      if (this.width > scaledWidth) {
        style.marginLeft = `${(this.width - scaledWidth) / 2}px`
      }

      return style
    }

    return null
  }
  public get renderedNodes () {
    const { toIds, fromIds } = this.edgesDict
    const nodes: RenderedGraphNode[][] = []
    const loneNodes: RenderedGraphNode[] = []

    // Find out maximum width/height possible
    let maxWidth = 0
    let maxHeight = 0
    let currRowHeight = 0
    let currRowWidth = 0

    // Loop through the nodes dictionary
    // to shape it into rows of nodes
    for (const nodeId in this.nodes) {
      if (this.nodes.hasOwnProperty(nodeId)) {
        const node = this.nodes[nodeId]
        const renderedNode = {
          id: nodeId,
          text: node.text,
          x: node.x || 0,
          y: node.y || 0,
          width: node.width || this.nodeWidth,
          height: node.height || this.nodeHeight
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
        const lastRow = nodes[nodes.length - 1]

        // Subsequent nodes should use
        // the previous node as the reference
        if (!pushAsNewRow) {
          const lastRowIds = lastRow.map((n) => n.id)

          // If the node comes from the previous row, it is in the same row
          pushAsNewRow = currFromIds.some((id) => lastRowIds.includes(id))
        }

        // New layer with the new node
        if (pushAsNewRow) {
          nodes.push([renderedNode])

          // Reset the current row height/width calculation
          currRowWidth = renderedNode.width + this.nodeColSpacing
          currRowHeight = renderedNode.height + this.nodeRowSpacing
        } else {
          // Another node in the layer
          lastRow.push(renderedNode)

          // Accumulate both current row width and height
          currRowWidth = currRowWidth + renderedNode.width + this.nodeColSpacing
          currRowHeight = currRowHeight + renderedNode.height + this.nodeRowSpacing
        }

        // Always check whether this is the row that has the most width/height
        maxWidth = Math.max(maxWidth, currRowWidth)
        maxHeight = Math.max(maxHeight, currRowHeight)
      }
    }

    // Shape the nodes to assign
    // positions depending on the mode
    switch (this.mode) {
      case Mode.VERTICAL: {
        this.shapeNodesVertically(nodes, maxWidth)
        break
      }
      case Mode.HORIZONTAL: {
        this.shapeNodesHorizontally(nodes, maxHeight)
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
  public get editingNode () {
    return this.editingNodeId
      ? this.renderedNodesDict[this.editingNodeId].node : null
  }
  private get containerWidth () {
    switch (this.mode) {
      case Mode.VERTICAL: {
        return this.renderedNodes.reduce((size, row) => {
          const lastNode = row[row.length - 1]
          const rowWidth = lastNode.x + lastNode.width + this.widthMargin
          return Math.max(rowWidth, size)
        }, 0)
      }
      case Mode.HORIZONTAL: {
        return this.renderedNodes.reduce((size, row) => {
          const maxWidth = row.reduce((width, node) => {
            return Math.max(width, node.width)
          }, 0)

          return size + maxWidth + this.nodeColSpacing
        }, 0)
      }
    }
  }
  private get containerHeight () {
    switch (this.mode) {
      case Mode.VERTICAL: {
        return this.renderedNodes.reduce((size, row) => {
          const maxHeight = row.reduce((height, node) => {
            return Math.max(height, node.height)
          }, 0)

          return size + maxHeight + this.nodeRowSpacing
        }, 0)
      }
      case Mode.HORIZONTAL: {
        return this.renderedNodes.reduce((size, row) => {
          const lastNode = row[row.length - 1]
          const rowWidth = lastNode.y + lastNode.height + this.heightMargin
          return Math.max(rowWidth, size)
        }, 0)
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
    interface NodeDetails {
      rowLength: number
      rowIdx: number
      colIdx: number
      node: RenderedGraphNode
    }

    const dict: Record<string, NodeDetails> = {}

    this.renderedNodes.forEach((row, rowIdx) => {
      row.forEach((node, colIdx) => {
        dict[node.id] = { rowIdx, colIdx, rowLength: row.length, node }
      })
    })

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

  // Methods
  public getEdges (node: RenderedGraphNode, rowIdx: number, colIdx: number, colLength: number): RenderedGraphEdge[] {
    return this.edges.reduce<RenderedGraphEdge[]>((edges, edge) => {
      if (edge.from !== node.id) {
        return edges
      }

      edges.push(this.shapeEdge(edge, node, rowIdx, colIdx, colLength))
      return edges
    }, [])
  }
  public onEditingNode (id: string) {
    this.editingNodeId = id
  }
  public onExitEditingNode () {
    this.editingNodeId = ''
  }
  public onResizeNode (event: { id: string, width: number, height: number }) {
    this.$emit('resize', event)
  }
  public onMoveNode (event: { id: string, x?: number, y?: number }) {
    this.$emit('move', event)
  }
  private getOrientPoints (node: RenderedGraphNode) {
    return {
      n: { x: node.width / 2, y: 0 },
      w: { x: 0, y: node.height / 2 },
      e: { x: node.width, y: node.height / 2 },
      s: { x: node.width / 2, y: node.height }
    }
  }
  private shapeEdge (
    edge: GraphEdge,
    startNode: RenderedGraphNode,
    startRowIdx: number,
    startColIdx: number,
    startRowLength: number
  ) {
    const startOrients = this.getOrientPoints(startNode)
    const endNodeDetails = this.renderedNodesDict[edge.to]

    // Get the end node
    // Chances are this node isn't properly linked
    if (!endNodeDetails) {
      throw new Error(`Unable to find a end node with id: ${edge.to}`)
    }

    const {
      node: endNode,
      colIdx: endColIdx,
      rowIdx: endRowIdx,
      rowLength: endRowLength
    } = endNodeDetails

    const endOrients = this.getOrientPoints(endNode)

    const shapedEdge: RenderedGraphEdge = {
      id: `edge-${edge.from}-${edge.to}`,
      from: edge.from,
      to: edge.to,
      text: edge.text,
      startPoint: { x: 0, y: 0 },
      startOrient: 'n',
      endPoint: { x: 0, y: 0 },
      endOrient: 'n',
      marker: EdgeMarker.END,
      direction: EdgeDirection.FORWARD
    }

    if (endRowIdx >= startRowIdx) {
      switch (this.mode) {
        case Mode.VERTICAL: {
          shapedEdge.startOrient = 's'
          shapedEdge.endOrient = 'n'
          break
        }
        case Mode.HORIZONTAL: {
          shapedEdge.startOrient = 'e'
          shapedEdge.endOrient = 'w'
          break
        }
      }

      shapedEdge.startPoint.x = startOrients[shapedEdge.startOrient].x + startNode.x
      shapedEdge.startPoint.y = startOrients[shapedEdge.startOrient].y + startNode.y

      shapedEdge.endPoint.x = endOrients[shapedEdge.endOrient].x + endNode.x
      shapedEdge.endPoint.y = endOrients[shapedEdge.endOrient].y + endNode.y
    } else {
      // Positive total index indicates that the nodes are on
      // one side of the flowchart, while negative indicates otherwise.
      // This is to indicate whether they should start and end
      // from on side of the node or the other
      const startSide = endColIdx - Math.floor(endRowLength / 2)
      const endSide = startColIdx - Math.floor(startRowLength / 2)
      const totalIdxSide = startSide + endSide >= 0

      switch (this.mode) {
        case Mode.VERTICAL: {
          const orient = totalIdxSide ? 'e' : 'w'
          shapedEdge.startOrient = orient
          shapedEdge.endOrient = orient
          break
        }
        case Mode.HORIZONTAL: {
          const orient = totalIdxSide ? 's' : 'n'
          shapedEdge.startOrient = orient
          shapedEdge.endOrient = orient
          break
        }
        default: {
          throw new Error(`Unknown mode: ${this.mode}`)
        }
      }

      shapedEdge.startPoint.x = endOrients[shapedEdge.endOrient].x + endNode.x
      shapedEdge.startPoint.y = endOrients[shapedEdge.endOrient].y + endNode.y

      shapedEdge.endPoint.x = startOrients[shapedEdge.startOrient].x + startNode.x
      shapedEdge.endPoint.y = startOrients[shapedEdge.startOrient].y + startNode.y

      shapedEdge.marker = EdgeMarker.START
      shapedEdge.direction = EdgeDirection.BACKWARD
    }

    return shapedEdge
  }
  private shapeNodesVertically (nodes: RenderedGraphNode[][], maxLength: number) {
    let cumulativeY = this.heightMargin

    nodes.forEach((row) => {
      const currRowMargin = (row.length - 1) * this.nodeColSpacing
      const currRowLength = row
        .reduce((size, node) => size + node.width, currRowMargin)

      let cumulativeX = (maxLength / 2) - (currRowLength / 2)
      let maxHeight = 0

      row.forEach((node) => {
        node.x = node.x || cumulativeX
        node.y = cumulativeY
        maxHeight = Math.max(maxHeight, node.height)

        cumulativeX = node.x + node.width + this.nodeColSpacing
      })

      cumulativeY = cumulativeY + maxHeight + this.nodeRowSpacing
    })
  }
  private shapeNodesHorizontally (nodes: RenderedGraphNode[][], maxLength: number) {
    let cumulativeX = this.widthMargin

    nodes.forEach((row) => {
      const currRowMargin = (row.length - 1) * this.nodeRowSpacing
      const currRowLength = row
        .reduce((size, node) => size + node.height, currRowMargin)

      let cumulativeY = (maxLength / 2) - (currRowLength / 2)
      let maxWidth = 0

      row.forEach((node) => {
        node.x = cumulativeX
        node.y = node.y || cumulativeY
        maxWidth = Math.max(maxWidth, node.width)

        cumulativeY = node.y + node.height + this.nodeRowSpacing
      })

      cumulativeX = cumulativeX + maxWidth + this.nodeColSpacing
    })
  }
}
