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
  GraphNodeDetails, EditingNodeDetails, OrderedNode, NodeRow
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
      row.nodes.forEach((node, colIdx) => {
        dict[node.id] = { rowIdx, colIdx, rowLength: row.nodes.length, node }
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
    const nodeRow = this.nodeLists[nodeDetails.rowIdx].nodes

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
          const prevMaxY = prevRow.nodes.reduce((maxY, node) => {
            return Math.max(node.y + node.height, maxY)
          }, 0)

          details.minY = prevMaxY
        } else {
          details.minY = this.heightMargin
        }

        if (nextRow) {
          const nextMinY = nextRow.nodes.reduce((minY, node) => {
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
          const prevMaxX = prevRow.nodes.reduce((maxX, node) => {
            return Math.max(node.x + node.width, maxX)
          }, 0)

          details.minX = prevMaxX
        } else {
          details.minX = this.widthMargin
        }

        if (nextRow) {
          const nextMinX = nextRow.nodes.reduce((minX, node) => {
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
      const leftMostNodeRow = row.nodes.reduce((n, currentNode) => {
        return currentNode.x < n.x ? currentNode : n
      }, row.nodes[0])

      return leftMostNodeRow.x < node.x ? leftMostNodeRow : node
    }, this.nodeLists[0].nodes[0])

    return leftMostNode.x - this.widthMargin
  }
  private get rightMostX () {
    const rightMostNode = this.nodeLists.reduce((node, row) => {
      const rightMostNodeRow = row.nodes.reduce((n, currentNode) => {
        return currentNode.x > n.x ? currentNode : n
      }, row.nodes[0])

      return rightMostNodeRow.x > node.x ? rightMostNodeRow : node
    }, this.nodeLists[0].nodes[0])

    return rightMostNode.x + rightMostNode.width + this.widthMargin
  }
  private get topMostY () {
    const topMostNode = this.nodeLists.reduce((node, row) => {
      const topMostNodeRow = row.nodes.reduce((n, currentNode) => {
        return currentNode.y < n.y ? currentNode : n
      }, row.nodes[0])

      return topMostNodeRow.y < node.y ? topMostNodeRow : node
    }, this.nodeLists[0].nodes[0])

    return topMostNode.y - this.heightMargin
  }
  private get bottomMostY () {
    const bottomMostNode = this.nodeLists.reduce((node, row) => {
      const bottomMostNodeRow = row.nodes.reduce((n, currentNode) => {
        return currentNode.y > n.y ? currentNode : n
      }, row.nodes[0])

      return bottomMostNodeRow.y > node.y ? bottomMostNodeRow : node
    }, this.nodeLists[0].nodes[0])

    return bottomMostNode.y + bottomMostNode.height + this.heightMargin
  }
  private get widthRatio () {
    return this.width ? this.width / this.containerWidth : 1
  }
  private get heightRatio () {
    return this.height ? this.height / this.containerHeight : 1
  }
  private get nodeLists () {
    const { maxIndex, dict } = this.orderedNodes
    const nodeList: NodeRow[] = Array.from({ length: maxIndex + 1 }, () => ({
      nodes: [],
      width: 0,
      height: 0
    }))

    // Find out maximum width/height possible
    let maxWidth = 0
    let maxHeight = 0

    // Loop through the nodes dictionary
    // to shape it into rows of nodes
    for (const nodeId in dict) {
      if (dict.hasOwnProperty(nodeId)) {
        const { index } = dict[nodeId]
        const node = this.nodes[nodeId]
        const renderedNode = this.shapeNode(nodeId, node)

        nodeList[index].nodes.push(renderedNode)
        nodeList[index].width = nodeList[index].width + renderedNode.width + this.nodeColSpacing
        nodeList[index].height = nodeList[index].height + renderedNode.height + this.nodeRowSpacing

        // Always check whether this is the row that has the most width/height
        maxWidth = Math.max(maxWidth, nodeList[index].width)
        maxHeight = Math.max(maxHeight, nodeList[index].height)
      }
    }

    // Shape the nodes to assign
    // positions depending on the mode
    switch (this.mode) {
      case Mode.VERTICAL: {
        this.shapeNodesVertically(nodeList, maxWidth)
        break
      }
      case Mode.HORIZONTAL: {
        this.shapeNodesHorizontally(nodeList, maxHeight)
        break
      }
      default: {
        throw new Error(`Unknown mode :${this.mode}`)
      }
    }

    return nodeList
  }
  private get orderedNodes () {
    return this.edges.reduce<{ dict: Record<string, OrderedNode>, maxIndex: number }>((result, edge) => {
      const { dict } = result

      if (!dict[edge.from]) {
        dict[edge.from] = {
          from: {},
          to: {},
          index: 0
        }
      }

      const fromNode = dict[edge.from]
      const newToIndex = fromNode.index + 1

      // A valid node index difference is when
      // two nodes connect, which is why the to-node
      // has only one index higher than the from-node
      if (!dict[edge.to]) {
        dict[edge.to] = {
          from: {},
          to: {},
          index: newToIndex
        }
      }

      const toNode = dict[edge.to]

      // Establish the reference between two nodes
      fromNode.to[edge.to] = toNode
      toNode.from[edge.from] = fromNode

      // Do not assign the new index to the to-node
      // if it's just a connection within the row
      const inSameRow = fromNode.index === toNode.index

      // The index difference that matters is when two nodes
      // connect between two adjacent rows, so the current to-node
      // index is exactly one index lower than the intended index
      const isNextRow = toNode.index === newToIndex

      if (!inSameRow && isNextRow) {
        toNode.index = newToIndex

        // Update the maximum row for future usage
        result.maxIndex = Math.max(result.maxIndex, newToIndex)
      }

      return result
    }, { dict: {}, maxIndex: 0 })
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
  private shapeNode (id: string, node: GraphNode): RenderedGraphNode {
    return {
      id,
      text: node.text,
      x: typeof node.x !== 'undefined' ? node.x : -Infinity,
      y: typeof node.y !== 'undefined' ? node.y : -Infinity,
      width: typeof node.width !== 'undefined' ? node.width : this.nodeWidth,
      height: typeof node.height !== 'undefined' ? node.height : this.nodeHeight
    }
  }
  private shapeNodesVertically (nodeList: NodeRow[], maxLength: number) {
    let cumulativeY = this.heightMargin

    nodeList.forEach((row) => {
      const currentRowLength = row.width

      // Nodes should start from the far left of the row
      let cumulativeX = (maxLength / 2) - (currentRowLength / 2)

      // Start with zero because the padding has been accounted for
      // when accumulating each node's y
      let maxHeight = 0

      row.nodes.forEach((node) => {
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
  private shapeNodesHorizontally (nodeList: NodeRow[], maxLength: number) {
    let cumulativeX = this.widthMargin

    nodeList.forEach((row) => {
      const currentRowLength = row.height

      // Nodes should start from the far top of the row
      let cumulativeY = (maxLength / 2) - (currentRowLength / 2)

      // Start with zero because the padding has been accounted for
      // when accumulating each node's x
      let maxWidth = 0

      row.nodes.forEach((node) => {
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
