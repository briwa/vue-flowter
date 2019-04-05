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
  DEFAULT_FONT_SIZE,
  DEFAULT_BOUNDS,
  DEFAULT_NODE_BGCOLOR,
  NODE_RHOMBUS_RATIO
} from '@/shared/constants'

// Types
import {
  EdgeType, Mode,
  GraphNode, RenderedGraphNode, GraphEdge,
  GraphNodeDetails, OrderedNode, NodeRow, Bounds, NodeSymbol
} from '@/shared/types'

/**
 * The main Flowter Vue class component.
 *
 * This class includes Node and Edge component
 * together with its selection component as its children.
 *
 * This component processes nodes and edges so that it
 * will be rendered accordingly, taking the component props
 * into account.
 */
@Component({
  components: {
    FlowterEdge,
    FlowterNode,
    FlowterNodeSelection
  }
})
export default class Flowter extends Vue {
  /**
   * @hidden
   * -------------------------------
   * Props
   * -------------------------------
   */

  /**
   * Nodes to be rendered.
   *
   * The key of the nodes dictionary corresponds to
   * the node id, which means the id has to be unique.
   *
   * The bare minimum of a node is that it has to have a `text`
   * property in it. If the optional values are not set, it will
   * be set to default values. See [[GraphNode]] for more details
   * on what are the configurable optionals.
   *
   * Note that nodes has to connect to another note
   * in order to be rendered. See [[nodeLists]] for more details.
   */
  @Prop({ type: Object, required: true })
  public nodes!: Record<string, GraphNode>

  /**
   * Edges that connect the nodes.
   *
   * The bare minimum of an edge is that it has to have a `from`
   * and `to` properties in it. If the optional values are not set,
   * it will be set to default values. See [[GraphEdge]] for more
   * details on what are the configurable optionals.
   *
   * Note that the edges are in an array, which means
   * _the order of the edges matter_. The shape of the
   * whole flowchart is going to be determined by how
   * the edges are connected based on the order. See [[orderedNodes]]
   * for more details.
   *
   * The edges support different types of connection
   * between nodes:
   * 1. Different node rows, going forward
   * 2. Different node rows, going backward
   * 3. Same node rows
   * 4. Same node
   *
   * Each of these types of connection will be rendered
   * differently. See [[FlowterEdge.edgePoints]] for more details.
   */
  @Prop({ type: Array, required: true })
  public edges!: GraphEdge[]

  /**
   * Width of the flowchart (optional).
   *
   * By default, the flowchart width will be rendered as-is,
   * meaning all the sizes are derived from the nodes width and height.
   * See [[naturalWidth]] for more details.
   *
   * If specified, the flowchart width will be rendered exactly as the width.
   * Since the flowchart has its own 'natural' size, the flowchart
   * will be scaled to match the specified width. See [[containerStyle]]
   * for more details.
   */
  @Prop({ type: Number, default: null })
  public width!: number

  /**
   * Height of the flowchart (optional).
   *
   * By default, the flowchart height will be rendered as-is,
   * meaning all the sizes are derived from the nodes width and height.
   * See [[naturalHeight]] for more details.
   *
   * If specified, the flowchart's height will be rendered exactly as the height.
   * Since the flowchart has its own 'natural' size, the flowchart
   * will be scaled to match the specified height. See [[containerStyle]]
   * for more details.
   */
  @Prop({ type: Number, default: null })
  public height!: number

  /**
   * How the flowchart is being rendered (optional).
   *
   * By default, the flowchart is rendered vertically
   * ([[Mode.VERTICAL]]).
   *
   * See [[Mode]] for the supported modes.
   */
  @Prop({ type: String, default: Mode.VERTICAL })
  public mode!: Mode

  /**
   * How the edges are being rendered (optional).
   *
   * By default, the edges are rendered with the bent mode
   * ([[EdgeType.BENT]]).
   *
   * See [[EdgeType]] for the supported modes.
   */
  @Prop({ type: String, default: EdgeType.BENT })
  public edgeType!: EdgeType

  /**
   * The default width of all nodes, if not specified in [[nodes]] (optional).
   *
   * If not specified, the value is set to [[DEFAULT_NODE_WIDTH]].
   */
  @Prop({ type: Number, default: DEFAULT_NODE_WIDTH })
  public nodeWidth!: number

  /**
   * The default height of all nodes, if not specified in [[nodes]] (optional).
   *
   * If not specified, the value is set to [[DEFAULT_NODE_HEIGHT]].
   */
  @Prop({ type: Number, default: DEFAULT_NODE_HEIGHT })
  public nodeHeight!: number

  /**
   * The row spacing between nodes (optional).
   *
   * Note that if the nodes have its own `x` or `y`,
   * the spacing is ignored. See [[shapeNodesVertically]] or
   * [[shapeNodesHorizontally]] for more details.
   *
   * If not specified, the value is set to [[DEFAULT_NODE_ROW_SPACING]].
   */
  @Prop({ type: Number, default: DEFAULT_NODE_ROW_SPACING })
  public nodeRowSpacing!: number

  /**
   * The spacing between nodes (optional).
   *
   * Note that if the nodes have its own `x` or `y`,
   * the spacing is ignored. See [[shapeNodesVertically]] or
   * [[shapeNodesHorizontally]] for more details.
   *
   * If not specified, the value is set to [[DEFAULT_NODE_COL_SPACING]].
   */
  @Prop({ type: Number, default: DEFAULT_NODE_COL_SPACING })
  public nodeColSpacing!: number

  /**
   * The width margin of the flowchart (optional).
   *
   * If not specified, the value is set to [[DEFAULT_WIDTH_MARGIN]].
   */
  @Prop({ type: Number, default: DEFAULT_WIDTH_MARGIN })
  public widthMargin!: number

  /**
   * The height margin of the flowchart (optional).
   *
   * If not specified, the value is set to [[DEFAULT_HEIGHT_MARGIN]].
   */
  @Prop({ type: Number, default: DEFAULT_HEIGHT_MARGIN })
  public heightMargin!: number

  /**
   * The font size of the texts in nodes and edges (optional).
   *
   * If not specified, the value is set to [[DEFAULT_FONT_SIZE]].
   */
  @Prop({ type: Number, default: DEFAULT_FONT_SIZE })
  public fontSize!: number

  /**
   * @hidden
   * -------------------------------
   * Public accessor/computed
   * -------------------------------
   */

  /**
   * The style of the flowchart's container.
   *
   * When [[width]] and/or [[height]] is specified,
   * This will set the custom width and height based
   * on the ratio. See [[widthRatio]] or [[heightRatio]]
   * for more details.
   *
   * Also, this will set the style to have a non-selectable
   * styling when it is in editing mode.
   * @todo Remove this styling and make it modular.
   */
  public get containerStyle (): Record<string, string> {
    const style: Record<string, string> = {
      userSelect: this.editingNodeId ? 'none' : 'initial',
      width: this.naturalWidth + 'px',
      height: this.naturalHeight + 'px'
    }

    // Scale the flowchart if width is specified
    if (this.width) {
      style.width = `${this.width}px`

      // The width should never be lower than the natural height
      style.height = `${Math.max(this.height, this.naturalHeight * this.widthRatio)}px`

      return style
    }

    // Same thing for height in horizontal mode
    if (this.height) {
      style.height = `${this.height}px`

      // The height should never be lower than the natural width
      style.width = `${Math.max(this.width, this.naturalWidth * this.heightRatio)}px`

      return style
    }

    return style
  }

  /**
   * The scaling style of the flowchart container.
   *
   * This will scale and translate the flowchart given the
   * specified [[width]] and [[height]]. Furthermore, this would
   * also translate the flowchart so that it will always be at
   * the center of the container.
   *
   * This will take [[allBounds]]'s minimum x and y into account,
   * so that if there are nodes that are outside of the container,
   * the whole flowchart is going to be translated so that it is
   * still inside the flowchart.
   */
  public get scaleStyle (): Record<string, string> {
    // To keep the flowchart at the center,
    // translate them accordingly
    const translateX = -this.allBounds.x.min * this.widthRatio
    const translateY = -this.allBounds.y.min * this.heightRatio
    let scaleRatio = 1
    let widthDiff = 0
    let heightDiff = 0

    const style: Record<string, string> = {
      transformOrigin: '0% 0%'
    }

    if (this.width) {
      scaleRatio = this.widthRatio

      // Make sure that the flowchart is still at the middle of the container
      const scaledHeight = this.naturalHeight * this.widthRatio
      if (this.height > scaledHeight) {
        heightDiff = (this.height - scaledHeight) / 2
      }
    } else if (this.height) {
      scaleRatio = this.heightRatio

      // Make sure that the flowchart is still at the middle of the container
      const scaledWidth = this.naturalWidth * this.heightRatio
      if (this.width > scaledWidth) {
        widthDiff = (this.width - scaledWidth) / 2
      }
    }

    style.transform = `scale(${scaleRatio})`
      + ` translateX(${translateX + widthDiff}px)`
      + ` translateY(${translateY + heightDiff}px)`

    return style
  }

  /**
   * A dictionary of all the rendered nodes details.
   *
   * Since it is being computed in [[nodeLists]] as an array
   * of node rows, this is to make it easier to access by the ids,
   * while retaining the info. See [[GraphNodeDetails]] for all the info.
   */
  public get renderedNodesDict (): Record<string, GraphNodeDetails> {
    const dict: Record<string, GraphNodeDetails> = {}

    this.nodeLists.forEach((row, rowIdx) => {
      row.nodes.forEach((node, colIdx) => {
        dict[node.id] = {
          rowIdx,
          colIdx,
          rowLength: row.nodes.length,
          node
        }
      })
    })

    return dict
  }

  /**
   * Required values for editing the nodes.
   *
   * `node` is the currently edited node.
   * `bounds` will limit the movement of the nodes when editing the position.
   * Only being computed when it is currently editing a node.
   *
   * For editing the node position,nodes are being limited vertically
   * when editing the position by its previous and the next row.
   * Also, it is being limited horizontally by the previous and
   * the next node in that node row.
   */
  public get editingNodeDetails (): { bounds: Bounds, node: RenderedGraphNode | null } {
    const bounds = DEFAULT_BOUNDS()

    if (!this.editingNodeId) {
      return { bounds, node: null }
    }

    const {
      rowIdx,
      colIdx,
      node
    } = this.renderedNodesDict[this.editingNodeId]

    const nodeRow = this.nodeLists[rowIdx].nodes
    bounds.length = nodeRow.length

    const prevRow = this.nodeLists[rowIdx - 1]
    const nextRow = this.nodeLists[rowIdx + 1]
    const prevNode = nodeRow[colIdx - 1]
    const nextNode = nodeRow[colIdx + 1]

    switch (this.mode) {
      case Mode.VERTICAL: {
        if (prevNode) {
          bounds.x.min = prevNode.x + prevNode.width
        }

        if (nextNode) {
          bounds.x.max = nextNode.x
        }

        if (prevRow) {
          const prevYMax = prevRow.nodes.reduce((yMax, n) => {
            return Math.max(n.y + n.height, yMax)
          }, 0)

          bounds.y.min = prevYMax
        } else {
          bounds.y.min = 0
        }

        if (nextRow) {
          const nexYMin = nextRow.nodes.reduce((yMin, n) => {
            return Math.max(n.y, yMin)
          }, 0)

          bounds.y.max = nexYMin
        }

        break
      }
      case Mode.HORIZONTAL: {
        if (prevNode) {
          bounds.y.min = prevNode.y + prevNode.height
        }

        if (nextNode) {
          bounds.y.max = nextNode.y
        }

        if (prevRow) {
          const prevXMax = prevRow.nodes.reduce((xMax, n) => {
            return Math.max(n.x + n.width, xMax)
          }, 0)

          bounds.x.min = prevXMax
        } else {
          bounds.x.min = 0
        }

        if (nextRow) {
          const prevXMin = nextRow.nodes.reduce((xMin, n) => {
            return Math.max(n.x, xMin)
          }, 0)

          bounds.x.max = prevXMin
        }

        break
      }
      default: {
        throw new Error(`Unknown mode: ${this.mode}`)
      }
    }

    return { bounds, node }
  }

  /**
   * @hidden
   * -------------------------------
   * Private accessor/computed
   * -------------------------------
   */

  /**
   * Flowchart's natural width.
   *
   * Computed from the bounds' min and max `x` values.
   * See [[allBounds]] for more details.
   */
  private get naturalWidth () {
    return this.allBounds.x.max - this.allBounds.x.min
  }

  /**
   * Flowchart's natural height.
   *
   * Computed from the bounds' min and max `y` values.
   * See [[allBounds]] for more details.
   */
  private get naturalHeight () {
    return this.allBounds.y.max - this.allBounds.y.min
  }

  /**
   * The flowchart's bounds.
   *
   * For the `x` min/max values, it is calculated from
   * the leftmost and the rightmost nodes.
   * For the `y` min/max values, it is calculated from
   * the topmost and the bottommost nodes.
   * See [[getBounds]] for more details.
   */
  private get allBounds (): Bounds {
    const { x, y } = this.nodeLists.reduce<Bounds>((bounds, row) => {
      return row.nodes.reduce(this.getBounds, bounds)
    }, DEFAULT_BOUNDS())

    // All bounds should take the margin into account
    return {
      x: {
        min: x.min - this.widthMargin,
        max: x.max + this.widthMargin
      },
      y: {
        min: y.min - this.heightMargin,
        max: y.max + this.widthMargin
      }
    }
  }

  /**
   * The ratio of the [[width]] provided and the [[naturalWidth]].
   *
   * If [[width]] is not provided, it will always be set to 1.
   */
  private get widthRatio () {
    return this.width ? this.width / this.naturalWidth : 1
  }

  /**
   * The ratio of the [[height]] provided and the [[naturalHeight]].
   *
   * If [[height]] is not provided, it will always be set to 1.
   */
  private get heightRatio () {
    return this.height ? this.height / this.naturalHeight : 1
  }

  /**
   * All nodes in a form of an array of node rows.
   *
   * The order is set based on [[orderedNodes]]. For performance
   * reason, the size and the position of the nodes are also assigned
   * when looping through the nodes. See [[shapeNodesVertically]] and
   * [[shapeNodesHorizontally]] for more details.
   */
  private get nodeLists (): NodeRow[] {
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

  /**
   * All nodes sorted based on the edges, in a form of a dictionary.
   *
   * Since the way the flowchart is rendered is by rows,
   * the rows are only defined by edges that connect one node
   * to another node from the adjacent row, going forward.
   * Any other connections are simply ignored, and let [[FlowterEdge]]
   * renders the connection as the path.
   *
   * `dict` determines all the nodes by its id. Each member contains
   * all the connections to another nodes along with its index, representing
   * its position in [[nodeLists]].
   * `maxIndex` determines the maximum number of node rows.
   */
  private get orderedNodes (): { dict: Record<string, OrderedNode>, maxIndex: number } {
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

  /**
   * @hidden
   * -------------------------------
   * Private data properties
   * -------------------------------
   */

  /**
   * The currently edited node's id.
   *
   * This value will only be there when a node is
   * being edited. By default, the value is empty.
   * See [[onEditingNode]] for more details.
   */
  private editingNodeId: string = ''

  /**
   * @hidden
   * -------------------------------
   * Public methods - events
   * -------------------------------
   */

  /**
   * When editing a node, this will set [[editingNodeId]]
   * with the node's id.
   * @event
   */
  public onEditingNode (id: string) {
    this.editingNodeId = id
  }

  /**
   * When exiting a node, this will set [[editingNodeId]]
   * to its default value (empty string).
   * @event
   */
  public onExitEditingNode () {
    this.editingNodeId = ''
  }

  /**
   * When `resize` event is received from the node,
   * this should fire the exact same event to the parent.
   * @event
   *
   * @fires resize
   */
  public onResizeNode (event: { id: string, width: number, height: number }) {
    this.$emit('resize', event)
  }

  /**
   * When `move` event is received from the node,
   * this should fire the exact same event to the parent.
   * @event
   *
   * @fires resize
   */
  public onMoveNode (event: { id: string, x?: number, y?: number }) {
    this.$emit('move', event)
  }

  /**
   * @hidden
   * -------------------------------
   * Private methods
   * -------------------------------
   */

  /**
   * Shapes the node from [[GraphNode]] to [[RenderedGraphNode]].
   *
   * This would conditionally set the values depending on whether it exists
   * or not, otherwise it is set to its default value.
   *
   * For nodes with [[NodeSymbol.RHOMBUS]], it will be rendered slightly bigger
   * than the rest. See [[NODE_RHOMBUS_RATIO]] for more details.
   *
   * For `x` and `y`, values are set to `-Infinity` if not specified, since
   * there will be some logic to set the actual values. See [[shapeNodesVertically]]
   * or [[shapeNodesHorizontally]] for mode details.
   */
  private shapeNode (id: string, node: GraphNode): RenderedGraphNode {
    const symbol = typeof node.symbol !== 'undefined' ? node.symbol : NodeSymbol.RECTANGLE
    const text = typeof node.text !== 'undefined' ? node.text.toString() : ''
    const bgcolor = typeof node.bgcolor !== 'undefined' ? node.bgcolor : DEFAULT_NODE_BGCOLOR
    const x = typeof node.x !== 'undefined' ? node.x : -Infinity
    const y = typeof node.y !== 'undefined' ? node.y : -Infinity

    const defaultNodeWidth = symbol === NodeSymbol.RHOMBUS
      ? this.nodeWidth * NODE_RHOMBUS_RATIO : this.nodeWidth
    const defaultNodeHeight = symbol === NodeSymbol.RHOMBUS
      ? this.nodeHeight * NODE_RHOMBUS_RATIO : this.nodeHeight
    const width = typeof node.width !== 'undefined' ? node.width : defaultNodeWidth
    const height = typeof node.height !== 'undefined' ? node.height : defaultNodeHeight

    return {
      id,
      text,
      x,
      y,
      width,
      height,
      symbol,
      bgcolor
    }
  }

  /**
   * Shapes all nodes position when being rendered in [[Mode.VERTICAL]].
   *
   * The nodes' position will be rendered from the center towards the edge
   * of the flowchart. This would take the nodes' `x` and `y` values into account
   * if specified from [[nodes]].
   */
  private shapeNodesVertically (nodeList: NodeRow[], maxWidth: number) {
    let cumulativeY = 0

    nodeList.forEach((row) => {
      // Nodes should start from the far left of the row
      let cumulativeX = (maxWidth / 2) - (row.width / 2)

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

  /**
   * Shapes all nodes position when being rendered in [[Mode.HORIZONTAL]].
   *
   * The nodes' position will be rendered from the center towards the edge
   * of the flowchart. This would take the nodes' `x` and `y` values into account
   * if specified from [[nodes]].
   */
  private shapeNodesHorizontally (nodeList: NodeRow[], maxHeight: number) {
    let cumulativeX = 0

    nodeList.forEach((row) => {
      // Nodes should start from the far top of the row
      let cumulativeY = (maxHeight / 2) - (row.height / 2)

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

  /**
   * Given a node, it checks whether the node exceeds the bounds
   * `x` and `y` range. If it does, update the bounds range.
   */
  private getBounds (bounds: Bounds, node: RenderedGraphNode): Bounds {
    if (node.x <= bounds.x.min) {
      bounds.x.min = node.x
    } else if (node.x + node.width > bounds.x.max) {
      bounds.x.max = node.x + node.width
    }

    if (node.y <= bounds.y.min) {
      bounds.y.min = node.y
    } else if (node.y + node.height > bounds.y.max) {
      bounds.y.max = node.y + node.height
    }

    return bounds
  }
}
