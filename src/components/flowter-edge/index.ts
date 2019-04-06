// Libraries
import { Prop, Component, Vue } from 'vue-property-decorator'

// Constants
import {
  MIN_EDGE_SIZE, MIN_EDGE_DETOUR_SIZE,
  EDGE_MIDPOINT_RATIO, EDGE_SR_SIZE_RATIO, EDGE_SR_ARC_SIZE_RATIO, DEFAULT_STROKE_WIDTH
} from '@/shared/constants'

// Types
import {
  Mode, GraphNodeDetails, RenderedGraphNode, EdgeType, ShapedEdge, EdgeMarker
} from '@/shared/types'

/**
 * The Flowter edge's Vue class component.
 *
 * This component renders the edge given the two nodes being connected.
 * This component can be rendered on its own, however it is
 * most useful when rendered together with its parent, [[Flowter]].
 *
 * Due to its rendering styling and mode, it relies on a few info from
 * [[Flowter]], mainly its configurable props. See all required properties
 * of this component for more details.
 */
@Component
export default class FlowterEdge extends Vue {
  /**
   * @hidden
   * -------------------------------
   * Props
   * -------------------------------
   */

  /**
   * The id of an edge.
   *
   * This is needed so that we have a unique id for each edge.
   */
  @Prop({ type: String, required: true })
  public id!: string

  /**
   * The node where the edge is connecting from.
   *
   * It can be any node from the [[Flowter.renderedNodesDict]].
   * This should be derived from [[Flowter.edges]] members' `from` value.
   */
  @Prop({ type: Object, required: true })
  public from!: GraphNodeDetails

  /**
   * The node where the edge is connecting to.
   *
   * It can be any node from the [[Flowter.renderedNodesDict]].
   * This should be derived from [[Flowter.edges]] members' `to` value.
   */
  @Prop({ type: Object, required: true })
  public to!: GraphNodeDetails

  /**
   * The flowchart mode.
   *
   * This follows [[Flowter.mode]].
   */
  @Prop({ type: String, required: true })
  public mode!: Mode

  /**
   * The edge type.
   *
   * This follows [[Flowter.edgeType]].
   */
  @Prop({ type: String, required: true })
  public edgeType!: EdgeType

  /**
   * The edge text's font size.
   * This follows [[Flowter.fontSize]].
   */
  @Prop({ type: Number, required: true })
  public fontSize!: number

  /**
   * The side of the marker that will be rendered (optional).
   *
   * This should be derived from [[Flowter.edges]] members' `marker` value.
   * By default, it is set to [[EdgeMarker.END]].
   */
  @Prop({ type: String, default: EdgeMarker.END })
  public marker!: EdgeMarker

  /**
   * The color of the edge (optional).
   *
   * This should be derived from [[Flowter.edges]] members' `color` value.
   * By default, it is set to black (`#000000`).
   */
  @Prop({ type: String, default: '#000000' })
  public color!: string

  /**
   * The text of the edge (optional).
   *
   * This should be derived from [[Flowter.edges]] members' `text` value.
   * By default, it is set to an empty string.
   */
  @Prop({ type: String, default: '' })
  public text!: string

  /**
   * @hidden
   * -------------------------------
   * Public accessor/computed
   * -------------------------------
   */

  /**
   * The edge's CSS style.
   *
   * This defines the position and the size of the edge in the DOM.
   * The position relies on the nodes' from and to position. This
   * also accounts for the padding which is needed so that it won't
   * be rendered right at the edge of the container.
   */
  public get edgeStyle () {
    return {
      width: `${this.renderedWidth}px`,
      height: `${this.renderedHeight}px`,
      top: `${this.domPosition.y - this.paddingSize}px`,
      left: `${this.domPosition.x - this.paddingSize}px`
    }
  }

  /**
   * The edge's text style.
   *
   * Given the node's direction, the text will be rendered
   * differently in the DOM.
   */
  public get textStyle () {
    switch (this.edgeDirection) {
      case 'n':
      case 's': {
        return this.verticalTextStyle
      }
      case 'e':
      case 'w': {
        return this.horizontalTextStyle
      }
      default: {
        throw new Error(`Unknown edge direction: ${this.edgeDirection}`)
      }
    }
  }

  /**
   * The edge's `path` points.
   *
   * Given the from and to nodes, this will define how the edge
   * is being rendered as the SVG `path`. The points are relative
   * to the SVG.
   *
   * - An arc path is used to render self-referential edges, which
   *   the edge will point to its own node.
   * - A simple straight path is used to render edges with [[EdgeStyle.CROSS]],
   *   and also edges within the same node row.
   * - A bent path is used to render edges with [[EdgeStyle.BENT]], for
   *   connections between nodes from different rows and columns. The style
   *   for connections that goes forward or backward in the flowchart is going
   *   to be rendered differently.
   */
  public get edgePoints () {
    // Relative position of the edge points is determined
    // by the actual position from the node relative to
    // the SVG position in the DOM
    const start = {
      x: this.start.x - this.domPosition.x + this.paddingSize,
      y: this.start.y - this.domPosition.y + this.paddingSize
    }

    const end = {
      x: this.end.x - this.domPosition.x + this.paddingSize,
      y: this.end.y - this.domPosition.y + this.paddingSize
    }

    if (this.isSelfReferential) {
      const isSweeping = this.edgeSide === 'e' || this.edgeSide === 'n'

      return `M ${start.x} ${start.y} `
        + `A ${Math.floor(this.renderedWidth / EDGE_SR_ARC_SIZE_RATIO)} `
        + `${Math.floor(this.renderedHeight / EDGE_SR_ARC_SIZE_RATIO)} `
        + `0 1 ${Number(isSweeping)} ${end.x} ${end.y}`
    }

    const isCross = this.edgeType === EdgeType.CROSS
    const isWithinRow = this.from.rowIdx === this.to.rowIdx

    if (isCross || isWithinRow) {
      return `M ${start.x} ${start.y} `
        + `L ${end.x} ${end.y}`
    }

    switch (this.edgeDirection) {
      case 's': {
        const halfLength = (end.y + this.paddingSize) * this.edgeMidPointRatio

        return `M ${start.x} ${start.y} `
          + `V ${halfLength} `
          + `H ${end.x} `
          + `V ${end.y}`
      }
      case 'e': {
        const halfLength = (end.x + this.paddingSize) * this.edgeMidPointRatio

        return `M ${start.x} ${start.y} `
          + `H ${halfLength} `
          + `V ${end.y} `
          + `H ${end.x}`
      }
      case 'n': {
        // To simplify the calc, always assume
        // that the edges go from left to right.
        // For edges that go right to left, we'll just inverse it.
        // This is determined from where the endpoint is in the flowchart.
        const isEdgeRightSide = this.start.nodeDirection === 'e'
          && this.end.nodeDirection === 'e'

        // The detour value depends on whether
        // the node is going right to left or left to right
        const relativeDetourSize = isEdgeRightSide
          ? this.detourSize : -this.detourSize

        // Two types of backward edge;
        // - they move horizontally then vertically (because the target is at ne)
        // - they move vertically then horizontally (because the target is at sw)
        // Inverse the start/end for nodes going right to left
        const isEdgeGoingHV = isEdgeRightSide
          ? this.start.x > this.end.x : this.end.x > this.start.x

        // If they go horizontally then vertically (HV),
        // they just need to make a little detour before going vertical
        // Otherwise, go all the way till the end point
        const middlePointX = isEdgeGoingHV
          ? start.x + relativeDetourSize : end.x + relativeDetourSize

        return `M ${start.x} ${start.y} `
          + `H ${middlePointX} `
          + `V ${end.y} `
          + `H ${end.x}`
      }
      case 'w': {
        // To simplify the calc, always assume
        // that the edges go from top to bottom.
        // For edges that go bottom to top, we'll just inverse it.
        // This is determined from where the endpoint is in the flowchart.
        const isEdgeBottomSide = this.start.nodeDirection === 's'
          && this.end.nodeDirection === 's'

        // The detour value depends on whether
        // the node is going bottom to top or top to bottom
        const relativeDetourSize = isEdgeBottomSide
          ? this.detourSize : -this.detourSize

        // Two types of backward edge;
        // - they move vertically then horizontally (because the target is at se)
        // - they move horizontally then vertically (because the target is at nw)
        const isEdgeGoingVH = isEdgeBottomSide
          ? this.start.y > this.end.y : this.end.y > this.start.y

        // If they go horizontally then vertically (HV),
        // they just need to make a little detour before going vertical
        // Otherwise, go all the way till the end point
        const middlePointY = isEdgeGoingVH
          ? start.y + relativeDetourSize : end.y + relativeDetourSize

        return `M ${start.x} ${start.y} `
          + `V ${middlePointY} `
          + `H ${end.x} `
          + `V ${end.y}`
      }
      default: {
        throw new Error(`Unknown direction: ${this.edgeDirection}`)
      }
    }
  }

  /**
   * Whether the arrow marker is rendered at the start of the `path`.
   */
  public get markerStart () {
    switch (this.marker) {
      case EdgeMarker.BOTH: return `url(#${this.arrowId})`
      default: return null
    }
  }

  /**
   * Whether the arrow marker is rendered at the end of the `path`.
   */
  public get markerEnd () {
    switch (this.marker) {
      case EdgeMarker.END:
      case EdgeMarker.BOTH: return `url(#${this.arrowId})`
      default: return null
    }
  }

  /**
   * Defines the `shapeRendering` property in the `path`.
   *
   * It is only needed for certain types of edges.
   */
  public get shapeRendering () {
    if (this.isSelfReferential || this.edgeType === EdgeType.CROSS) {
      return null
    }

    return 'crispEdges'
  }

  /**
   * Defines the unique arrow marker id.
   */
  public get arrowId () {
    return `arrow-${this.id}`
  }

  /**
   * Defines the `viewBox` property of the SVG.
   *
   * Based on the edge's container size itself.
   */
  public get strokeWidth () {
    return DEFAULT_STROKE_WIDTH
  }

  /**
   * Defines the `viewBox` property of the SVG.
   *
   * Based on the edge's container size itself.
   */
  public get viewBox () {
    return `0 0 ${this.renderedWidth} ${this.renderedHeight}`
  }

  /**
   * @hidden
   * -------------------------------
   * Private accessor/computed
   * -------------------------------
   */

  /**
   * The styling for the edge's text in [[Mode.VERTICAL]].
   *
   * It should be at least at the center of the edge.
   */
  private get verticalTextStyle (): Record<string, string> {
    const style: Record<string, string> = {
      top: `${(this.renderedHeight / 2) - (this.fontSize * 1.5)}px`,
      fontSize: `${this.fontSize}px`
    }

    switch (this.edgeDirection) {
      case 's':
      case 'e': {
        const delimiter = this.relativeWidth > 0
          ? 'right' : 'left'

        style[delimiter] = `${this.paddingSize * 2}px`

        return style
      }
      case 'n':
      case 'w': {
        const delimiter = this.start.nodeDirection === 'e'
          ? 'right' : 'left'

        style[delimiter] = `${this.detourSize * 2}px`

        return style
      }
      default: {
        throw new Error(`Unknown direction: ${this.edgeDirection}`)
      }
    }
  }

  /**
   * The styling for the edge's text in [[Mode.HORIZONTAL]].
   *
   * It should be at least at the center of the edge.
   */
  private get horizontalTextStyle (): Record<string, string> {
    const style: Record<string, string> = {
      left: `${(this.renderedWidth / 2) - (this.fontSize * 1.5)}px`,
      fontSize: `${this.fontSize}px`
    }

    switch (this.edgeDirection) {
      case 's':
      case 'e': {
        const delimiter = this.relativeHeight > 0
          ? 'bottom' : 'top'

        style[delimiter] = `${this.paddingSize * 2}px`

        return style
      }
      case 'n':
      case 'w': {
        const delimiter = this.start.nodeDirection === 's'
          ? 'bottom' : 'top'

        style[delimiter] = `${this.detourSize * 2}px`

        return style
      }
      default: {
        throw new Error(`Unknown direction: ${this.edgeDirection}`)
      }
    }
  }

  /**
   * The width relative to the start and the end of the edge.
   */
  private get relativeWidth () {
    return this.end.x - this.start.x
  }

  /**
   * The height relative to the start and the end of the edge.
   */
  private get relativeHeight () {
    return this.end.y - this.start.y
  }

  /**
   * The position of the edge in the DOM.
   *
   * The only complication is the self-referential node, otherwise
   * it would be defined solely on the start and the edge of the edge.
   */
  private get domPosition () {
    if (this.isSelfReferential) {
      switch (this.edgeSide) {
        case 'w': {
          const xOffset = this.renderedWidth - (this.paddingSize * 2)

          return {
            x: this.start.x - xOffset,
            y: this.start.y
          }
        }
        case 'n': {
          const yOffset = this.renderedHeight - (this.paddingSize * 2)

          return {
            x: this.start.x,
            y: this.start.y - yOffset
          }
        }
        case 's':
        case 'e': {
          return {
            x: this.start.x,
            y: this.start.y
          }
        }
        default: {
          throw new Error(`Unknown edge side: ${this.edgeSide}.`)
        }
      }
    }

    return {
      x: Math.min(this.start.x, this.end.x),
      y: Math.min(this.start.y, this.end.y)
    }
  }

  /**
   * The edge's padding size.
   *
   * For edges that go backward, it adds an extra padding from
   * the [[detourSize]] so that the detour won't be rendered
   * near the edge of the container.
   */
  private get paddingSize () {
    switch (this.edgeDirection) {
      case 's':
      case 'e': {
        return this.minSize
      }
      case 'n':
      case 'w': {
        return (this.minSize + this.detourSize)
      }
      default: throw new Error(`Unknown direction: ${this.edgeDirection}`)
    }
  }

  /**
   * The edge's width rendered in the DOM.
   *
   * The width also accounts for the padding size, left and right.
   * For self-referential edge, the width is sightly larger than
   * the node's width.
   */
  private get renderedWidth () {
    if (this.isSelfReferential && this.mode === Mode.VERTICAL) {
      return (this.from.node.width * EDGE_SR_SIZE_RATIO) + (this.paddingSize * 2)
    }

    return Math.abs(this.relativeWidth)
      + (this.paddingSize * 2)
  }

  /**
   * The edge's height rendered in the DOM.
   *
   * The height also accounts for the padding size, top and bottom.
   * For self-referential edge, the height is sightly larger than
   * the node's height.
   */
  private get renderedHeight () {
    if (this.isSelfReferential && this.mode === Mode.HORIZONTAL) {
      return (this.from.node.height * EDGE_SR_SIZE_RATIO) + (this.paddingSize * 2)
    }

    return Math.abs(this.relativeHeight)
      + (this.paddingSize * 2)
  }

  /**
   * The direction of where the node is going relative to the flowchart.
   *
   * This is based on where the from-node and the to-node are in the flowchart.
   * It is used to determine direction of the edge is rendered.
   */
  private get edgeDirection () {
    switch (this.mode) {
      case Mode.VERTICAL: {
        if (this.to.rowIdx === this.from.rowIdx) {
          return this.to.colIdx > this.from.colIdx
            ? 'e' : 'w'
        }

        return this.to.rowIdx > this.from.rowIdx
          ? 's' : 'n'
      }
      case Mode.HORIZONTAL: {
        if (this.to.rowIdx === this.from.rowIdx) {
          return this.to.colIdx > this.from.colIdx
            ? 's' : 'n'
        }

        return this.to.rowIdx > this.from.rowIdx
          ? 'e' : 'w'
      }
    }
  }

  /**
   * The side in which the edge is located, relative to the flowchart.
   */
  private get edgeSide () {
    const {
      colIdx: startColIdx,
      rowLength: startRowLength
    } = this.from

    const {
      colIdx: endColIdx,
      rowLength: endRowLength
    } = this.to

    const startSide = startColIdx - Math.floor(startRowLength / 2)
    const endSide = endColIdx - Math.floor(endRowLength / 2)
    const isNodeAtTheRightSide = startSide + endSide >= 0

    switch (this.mode) {
      case Mode.VERTICAL: {
        return isNodeAtTheRightSide ? 'e' : 'w'
      }
      case Mode.HORIZONTAL: {
        return isNodeAtTheRightSide ? 's' : 'n'
      }
      default: {
        throw new Error(`Unknown mode: ${this.mode}.`)
      }
    }
  }

  /**
   * A detailed position and the direction of where the edge
   * is going to be rendered, from start to end.
   *
   * This detects whether an edge is going between node rows,
   * within node rows, and also self-referential node.
   */
  private get shapedEdge () {
    const {
      node: startNode,
      rowIdx: startRowIdx
    } = this.from
    const startDirections = this.getDirections(startNode)

    const {
      node: endNode,
      rowIdx: endRowIdx
    } = this.to
    const endDirections = this.getDirections(endNode)

    const shapedEdge: { start: ShapedEdge, end: ShapedEdge } = {
      start: { x: 0, y: 0, nodeDirection: 'n' },
      end: { x: 0, y: 0, nodeDirection: 'n' }
    }

    if (endRowIdx > startRowIdx) {
      // When the edges go forward,
      // it is always going from top to bottom (vertically)
      // or left to right (horizontally).
      switch (this.edgeDirection) {
        case 'n':
        case 's': {
          shapedEdge.start.nodeDirection = 's'
          shapedEdge.end.nodeDirection = 'n'
          break
        }
        case 'e':
        case 'w': {
          shapedEdge.start.nodeDirection = 'e'
          shapedEdge.end.nodeDirection = 'w'
          break
        }
        default: {
          throw new Error(`Unknown edge direction: ${this.edgeDirection}`)
        }
      }
    } else if (endRowIdx < startRowIdx) {
      switch (this.edgeDirection) {
        case 'n':
        case 's': {
          shapedEdge.start.nodeDirection = this.edgeSide
          shapedEdge.end.nodeDirection = this.edgeSide
          break
        }
        case 'e':
        case 'w': {
          shapedEdge.start.nodeDirection = this.edgeSide
          shapedEdge.end.nodeDirection = this.edgeSide
          break
        }
        default: {
          throw new Error(`Unknown edge direction: ${this.edgeDirection}`)
        }
      }
    } else if (this.to.colIdx !== this.from.colIdx) {
      shapedEdge.start.nodeDirection = this.edgeDirection

      switch (this.edgeDirection) {
        case 'n': {
          shapedEdge.end.nodeDirection = 's'
          break
        }
        case 's': {
          shapedEdge.end.nodeDirection = 'n'
          break
        }
        case 'e': {
          shapedEdge.end.nodeDirection = 'w'
          break
        }
        case 'w': {
          shapedEdge.end.nodeDirection = 'e'
          break
        }
        default: {
          throw new Error(`Unknown edge direction: ${this.edgeDirection}`)
        }
      }
    } else {
      switch (this.edgeDirection) {
        case 'w':
        case 'e': {
          shapedEdge.start.nodeDirection = 'n'
          shapedEdge.end.nodeDirection = 's'
          break
        }
        case 'n':
        case 's': {
          shapedEdge.start.nodeDirection = 'w'
          shapedEdge.end.nodeDirection = 'e'
          break
        }
        default: {
          throw new Error(`Unknown edge direction: ${this.edgeDirection}`)
        }
      }
    }

    shapedEdge.start.x = startDirections[shapedEdge.start.nodeDirection].x + startNode.x
    shapedEdge.start.y = startDirections[shapedEdge.start.nodeDirection].y + startNode.y

    shapedEdge.end.x = endDirections[shapedEdge.end.nodeDirection].x + endNode.x
    shapedEdge.end.y = endDirections[shapedEdge.end.nodeDirection].y + endNode.y

    return shapedEdge
  }

  /**
   * The edge's start point, based on [[shapedEdge]].
   */
  private get start () {
    return this.shapedEdge.start
  }

  /**
   * The edge's end point, based on [[shapedEdge]].
   */
  private get end () {
    return this.shapedEdge.end
  }

  /**
   * Determines when the edge should stop at the middle
   * and continues to render.
   */
  private get edgeMidPointRatio () {
    const distance = this.to.rowIdx - this.from.rowIdx + 1
    return 1 / distance * (distance === 2 ? 1 : distance - EDGE_MIDPOINT_RATIO)
  }

  /**
   * Determines whether an edge is connecting to its own node.
   */
  private get isSelfReferential () {
    return this.from.node.id === this.to.node.id
  }

  /**
   * The minimum size allowed for an edge.
   */
  private get minSize () {
    return MIN_EDGE_SIZE
  }

  /**
   * The size allocated to render the edge detour.
   */
  private get detourSize () {
    return MIN_EDGE_DETOUR_SIZE
  }

  /**
   * @hidden
   * -------------------------------
   * Public methods
   * -------------------------------
   */

  /**
   * @todo This is currently unused, handle this event properly.
   *
   * When an edge is clicked, this emits an event.
   * of the from and to's node id to the parent.
   * @event
   *
   * @fires click
   */
  public onClick () {
    this.$emit('click', {
      from: this.from.node.id,
      to: this.to.node.id
    })
  }

  /**
   * @todo This is currently unused, handle this event properly.
   *
   * When an edge is clicked, this emits an event.
   * of the from and to's node id to the parent.
   * @event
   *
   * @fires mouseenter
   */
  public onMouseEnter (event: MouseEvent) {
    this.$emit('mouseenter', {
      from: this.from.node.id,
      to: this.to.node.id
    })
  }

  /**
   * @todo This is currently unused, handle this event properly.
   * @todo Debounce this
   *
   * When an edge is clicked, this emits an event.
   * of the from and to's node id to the parent.
   * @event
   *
   * @fires mouseleave
   */
  public onMouseLeave (event: MouseEvent) {
    this.$emit('mouseleave', {
      from: this.from.node.id,
      to: this.to.node.id
    })
  }

  /**
   * @hidden
   * -------------------------------
   * Private methods
   * -------------------------------
   */

  /**
   * Get the node's relative direction as the
   * start/end point of an edge.
   */
  private getDirections (node: RenderedGraphNode) {
    return {
      n: { x: node.width / 2, y: 0 },
      w: { x: 0, y: node.height / 2 },
      e: { x: node.width, y: node.height / 2 },
      s: { x: node.width / 2, y: node.height }
    }
  }
}
