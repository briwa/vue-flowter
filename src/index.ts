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
} from '@/shared/constants'

// Types
import {
  EdgeType, Mode,
  GraphNode, RenderedGraphNode, GraphEdge,
  EdgesIdsDict, GraphNodeDetails, EditingNodeDetails
} from '@/shared/types'

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
    // To keep the flowchart at the center,
    // translate them accordingly
    const translateX = -this.leftMostX * this.widthRatio
    const translateY = -this.topMostY * this.heightRatio
    let scaleRatio = 1
    let widthDiff = 0
    let heightDiff = 0

    const style: Record<string, string> = {
      transformOrigin: '0% 0%'
    }

    if (this.width) {
      scaleRatio = this.widthRatio

      // Make sure that the flowchart is still at the middle of the container
      const scaledHeight = this.containerHeight * this.widthRatio
      if (this.height > scaledHeight) {
        heightDiff = (this.height - scaledHeight) / 2
      }
    } else if (this.height) {
      scaleRatio = this.heightRatio

      // Make sure that the flowchart is still at the middle of the container
      const scaledWidth = this.containerWidth * this.heightRatio
      if (this.width > scaledWidth) {
        widthDiff = (this.width - scaledWidth) / 2
      }
    }

    style.transform = `scale(${scaleRatio})`
      + ` translateX(${translateX + widthDiff}px)`
      + ` translateY(${translateY + heightDiff}px)`

    return style
  }
  public get renderedNodesDict () {
    const dict: Record<string, GraphNodeDetails> = {}

    this.nodeLists.forEach((row, rowIdx) => {
      row.forEach((node, colIdx) => {
        dict[node.id] = { rowIdx, colIdx, rowLength: row.length, node }
      })
    })

    return dict
  }
  public get editingNodeDetails () {
    const details: EditingNodeDetails = {
      minX: -Infinity,
      maxX: Infinity,
      minY: -Infinity,
      maxY: Infinity
    }

    if (!this.editingNodeId) {
      return details
    }

    const nodeDetails = this.renderedNodesDict[this.editingNodeId]
    const nodeRow = this.nodeLists[nodeDetails.rowIdx]

    details.node = nodeDetails.node
    const prevRow = this.nodeLists[nodeDetails.rowIdx - 1]
    const nextRow = this.nodeLists[nodeDetails.rowIdx + 1]
    const prevNode = nodeRow[nodeDetails.colIdx - 1]
    const nextNode = nodeRow[nodeDetails.colIdx + 1]

    switch (this.mode) {
      case Mode.VERTICAL: {
        if (prevNode) {
          details.minX = prevNode.x + prevNode.width
        }

        if (nextNode) {
          details.maxX = nextNode.x
        }

        if (prevRow) {
          const prevMaxY = prevRow.reduce((maxY, node) => {
            return Math.max(node.y + node.height, maxY)
          }, 0)

          details.minY = prevMaxY
        } else {
          details.minY = this.heightMargin
        }

        if (nextRow) {
          const nextMinY = nextRow.reduce((minY, node) => {
            return Math.max(node.y, minY)
          }, 0)

          details.maxY = nextMinY
        }

        break
      }
      case Mode.HORIZONTAL: {
        if (prevNode) {
          details.minY = prevNode.y + prevNode.height
        }

        if (nextNode) {
          details.maxY = nextNode.y
        }

        if (prevRow) {
          const prevMaxX = prevRow.reduce((maxX, node) => {
            return Math.max(node.x + node.width, maxX)
          }, 0)

          details.minX = prevMaxX
        } else {
          details.minX = this.widthMargin
        }

        if (nextRow) {
          const nextMinX = nextRow.reduce((minX, node) => {
            return Math.max(node.x, minX)
          }, 0)

          details.maxX = nextMinX
        }

        break
      }
      default: {
        throw new Error(`Unknown mode: ${this.mode}`)
      }
    }

    return details
  }
  private get containerWidth () {
    return this.rightMostX - this.leftMostX
  }
  private get containerHeight () {
    return this.bottomMostY - this.topMostY
  }
  private get leftMostX () {
    const leftMostNode = this.nodeLists.reduce((node, row) => {
      const leftMostNodeRow = row.reduce((n, currNode) => {
        return currNode.x < n.x ? currNode : n
      }, row[0])

      return leftMostNodeRow.x < node.x ? leftMostNodeRow : node
    }, this.nodeLists[0][0])

    return leftMostNode.x - this.widthMargin
  }
  private get rightMostX () {
    const rightMostNode = this.nodeLists.reduce((node, row) => {
      const rightMostNodeRow = row.reduce((n, currNode) => {
        return currNode.x > n.x ? currNode : n
      }, row[0])

      return rightMostNodeRow.x > node.x ? rightMostNodeRow : node
    }, this.nodeLists[0][0])

    return rightMostNode.x + rightMostNode.width + this.widthMargin
  }
  private get topMostY () {
    const topMostNode = this.nodeLists.reduce((node, row) => {
      const topMostNodeRow = row.reduce((n, currNode) => {
        return currNode.y < n.y ? currNode : n
      }, row[0])

      return topMostNodeRow.y < node.y ? topMostNodeRow : node
    }, this.nodeLists[0][0])

    return topMostNode.y - this.heightMargin
  }
  private get bottomMostY () {
    const bottomMostNode = this.nodeLists.reduce((node, row) => {
      const bottomMostNodeRow = row.reduce((n, currNode) => {
        return currNode.y > n.y ? currNode : n
      }, row[0])

      return bottomMostNodeRow.y > node.y ? bottomMostNodeRow : node
    }, this.nodeLists[0][0])

    return bottomMostNode.y + bottomMostNode.height + this.heightMargin
  }
  private get widthRatio () {
    return this.width ? this.width / this.containerWidth : 1
  }
  private get heightRatio () {
    return this.height ? this.height / this.containerHeight : 1
  }
  private get nodeLists () {
    const { toIds, fromIds } = this.edgesIdsDict
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
          x: typeof node.x !== 'undefined' ? node.x : -Infinity,
          y: typeof node.y !== 'undefined' ? node.y : -Infinity,
          width: typeof node.width !== 'undefined' ? node.width : this.nodeWidth,
          height: typeof node.height !== 'undefined' ? node.height : this.nodeHeight
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
  private get edgesIdsDict () {
    return this.edges.reduce<EdgesIdsDict>((dict, edge) => {
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
  private shapeNodesVertically (nodes: RenderedGraphNode[][], maxLength: number) {
    let cumulativeY = this.heightMargin

    nodes.forEach((row) => {
      // Get the current row's length to
      // map out each node's x position
      const currRowMargin = (row.length - 1) * this.nodeColSpacing
      const currRowLength = row
        .reduce((size, node) => size + node.width, currRowMargin)

      // Nodes should start from the far left of the row
      let cumulativeX = (maxLength / 2) - (currRowLength / 2)

      // Start with zero because the padding has been accounted for
      // when accumulating each node's y
      let maxHeight = 0

      row.forEach((node) => {
        const hasCustomX = node.x !== -Infinity
        const hasCustomY = node.y !== -Infinity

        // Use the x/y value provided from the props,
        // otherwise accumulate from the previous node
        node.x = hasCustomX ? node.x : cumulativeX
        node.y = hasCustomY ? node.y : cumulativeY

        // The y position depends on the node with the highest height
        maxHeight = Math.max(maxHeight, node.height)

        // The current node's column spacing is determined
        // by whether the previous node has custom x. This is because
        // if the x has been tampered, it means it doesn't need the spacing
        // from the previous node
        const colSpacing = hasCustomX
          ? this.nodeColSpacing - (node.x - cumulativeX) : this.nodeColSpacing

        // Accumulate the x for each node
        cumulativeX = node.x + node.width + colSpacing
      })

      // Accumulate the y for each row
      cumulativeY = cumulativeY + maxHeight + this.nodeRowSpacing
    })
  }
  private shapeNodesHorizontally (nodes: RenderedGraphNode[][], maxLength: number) {
    let cumulativeX = this.widthMargin

    nodes.forEach((row) => {
      // Get the current row's length to
      // map out each node's y position
      const currRowMargin = (row.length - 1) * this.nodeRowSpacing
      const currRowLength = row
        .reduce((size, node) => size + node.height, currRowMargin)

      // Nodes should start from the far top of the row
      let cumulativeY = (maxLength / 2) - (currRowLength / 2)

      // Start with zero because the padding has been accounted for
      // when accumulating each node's x
      let maxWidth = 0

      row.forEach((node) => {
        const hasCustomX = node.x !== -Infinity
        const hasCustomY = node.y !== -Infinity

        // Use the x/y value provided from the props,
        // otherwise accumulate from the previous node
        node.x = hasCustomX ? node.x : cumulativeX
        node.y = hasCustomY ? node.y : cumulativeY

        // The x position depends on the node with the highest width
        maxWidth = Math.max(maxWidth, node.width)

        // The current node's column spacing is determined
        // by whether the previous node has custom x. This is because
        // if the x has been tampered, it means it doesn't need the spacing
        // from the previous node
        const rowSpacing = hasCustomY
          ? this.nodeRowSpacing - (node.y - cumulativeY) : this.nodeRowSpacing

        // Accumulate the y for each node
        cumulativeY = node.y + node.height + rowSpacing
      })

      // Accumulate the x for each row
      cumulativeX = cumulativeX + maxWidth + this.nodeColSpacing
    })
  }
}
