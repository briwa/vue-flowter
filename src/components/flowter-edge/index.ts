// Libraries
import { Prop, Component, Vue } from 'vue-property-decorator'

// Constants
import { MIN_EDGE_SIZE, MIN_DETOUR_SIZE } from '@/shared/constants'

// Types
import {
  Mode, GraphNodeDetails, RenderedGraphNode, EdgeType, ShapedEdge, EdgeMarker
} from '@/shared/types'

@Component
export default class FlowterEdge extends Vue {
  @Prop({ type: Object, required: true })
  public from!: GraphNodeDetails
  @Prop({ type: Object, required: true })
  public to!: GraphNodeDetails
  @Prop({ type: String, default: '#000000' })
  public color!: string
  @Prop({ type: String, default: '' })
  public text!: string
  @Prop({ type: String, default: EdgeMarker.END })
  public marker!: EdgeMarker
  @Prop({ type: String, default: EdgeType.BENT })
  public edgeType!: EdgeType
  @Prop({ type: Number, default: EdgeType.BENT })
  public fontSize!: number
  @Prop({ type: String, default: Mode.VERTICAL })
  public mode!: Mode

  // Computed
  public get edgeStyle () {
    return {
      width: `${this.renderedWidth}px`,
      height: `${this.renderedHeight}px`,
      top: `${this.domPosition.y - this.paddingSize}px`,
      left: `${this.domPosition.x - this.paddingSize}px`
    }
  }
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

    const isStraightEdge = this.edgeType === EdgeType.CROSS
      || this.from.rowIdx === this.to.rowIdx

    if (isStraightEdge) {
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
  public get markerStart () {
    switch (this.marker) {
      case EdgeMarker.BOTH: return 'url(#arrow)'
      default: return null
    }
  }
  public get markerEnd () {
    switch (this.marker) {
      case EdgeMarker.END:
      case EdgeMarker.BOTH: return 'url(#arrow)'
      default: return null
    }
  }
  public get shapeRendering () {
    switch (this.edgeType) {
      case EdgeType.CROSS: {
        return null
      }
      case EdgeType.BENT: {
        return 'crispEdges'
      }
      default: {
        throw new Error(`Unknown edge type: ${this.edgeType}`)
      }
    }
  }
  public get viewBox () {
    return `0 0 ${this.renderedWidth} ${this.renderedHeight}`
  }
  private get verticalTextStyle () {
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
  private get horizontalTextStyle () {
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
  private get relativeWidth () {
    return this.end.x - this.start.x
  }
  private get relativeHeight () {
    return this.end.y - this.start.y
  }
  private get domPosition () {
    return {
      x: Math.min(this.start.x, this.end.x),
      y: Math.min(this.start.y, this.end.y)
    }
  }
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
  private get renderedWidth () {
    return Math.abs(this.relativeWidth)
      + (this.paddingSize * 2)
  }
  private get renderedHeight () {
    return Math.abs(this.relativeHeight)
      + (this.paddingSize * 2)
  }
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
  private get shapedEdge () {
    const {
      node: startNode,
      colIdx: startColIdx,
      rowIdx: startRowIdx,
      rowLength: startRowLength
    } = this.from
    const startDirections = this.getDirections(startNode)

    const {
      node: endNode,
      colIdx: endColIdx,
      rowIdx: endRowIdx,
      rowLength: endRowLength
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
      // When the edges go backward,
      // it is always going from the same side of the node.
      // This depends on where the node is located on the flowchart.
      // Positive total index indicates that the nodes are on
      // one side of the flowchart, while negative indicates otherwise.
      // This is used to tell whether they should start and end
      // from on side of the node or the other.
      const startSide = endColIdx - Math.floor(endRowLength / 2)
      const endSide = startColIdx - Math.floor(startRowLength / 2)
      const isNodeIdxPositive = startSide + endSide >= 0

      switch (this.edgeDirection) {
        case 'n':
        case 's': {
          const direction = isNodeIdxPositive ? 'e' : 'w'
          shapedEdge.start.nodeDirection = direction
          shapedEdge.end.nodeDirection = direction
          break
        }
        case 'e':
        case 'w': {
          const direction = isNodeIdxPositive ? 's' : 'n'
          shapedEdge.start.nodeDirection = direction
          shapedEdge.end.nodeDirection = direction
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
      switch (this.mode) {
        case Mode.VERTICAL: {
          shapedEdge.start.nodeDirection = 's'
          shapedEdge.end.nodeDirection = 'n'
          break
        }
        case Mode.HORIZONTAL: {
          shapedEdge.start.nodeDirection = 'e'
          shapedEdge.end.nodeDirection = 'w'
          break
        }
        default: {
          throw new Error(`Unknown mode: ${this.mode}`)
        }
      }
    }

    shapedEdge.start.x = startDirections[shapedEdge.start.nodeDirection].x + startNode.x
    shapedEdge.start.y = startDirections[shapedEdge.start.nodeDirection].y + startNode.y

    shapedEdge.end.x = endDirections[shapedEdge.end.nodeDirection].x + endNode.x
    shapedEdge.end.y = endDirections[shapedEdge.end.nodeDirection].y + endNode.y

    return shapedEdge
  }
  private get start () {
    return this.shapedEdge.start
  }
  private get end () {
    return this.shapedEdge.end
  }
  private get edgeMidPointRatio () {
    const distance = this.to.rowIdx - this.from.rowIdx + 1
    return 1 / distance * (distance === 2 ? 1 : distance - 0.8)
  }
  private get minSize () {
    return MIN_EDGE_SIZE
  }
  private get detourSize () {
    return MIN_DETOUR_SIZE
  }

  // Methods
  public onClick () {
    this.$emit('click', {
      from: this.from.node.id,
      to: this.to.node.id
    })
  }
  private getDirections (node: RenderedGraphNode) {
    return {
      n: { x: node.width / 2, y: 0 },
      w: { x: 0, y: node.height / 2 },
      e: { x: node.width, y: node.height / 2 },
      s: { x: node.width / 2, y: node.height },
      m: { x: node.width / 2, y: node.height / 2 }
    }
  }
}
