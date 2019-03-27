// Libraries
import { Prop, Component, Vue } from 'vue-property-decorator'

// Constants
import { MIN_EDGE_SIZE, MIN_DETOUR_SIZE } from '@/shared/constants'

// Types
import {
  Mode, GraphNodeDetails, RenderedGraphNode, EdgeType, ShapedEdge
} from '@/shared/types'

@Component
export default class FlowterEdge extends Vue {
  @Prop({ type: Object, default: null })
  public from!: GraphNodeDetails
  @Prop({ type: Object, default: null })
  public to!: GraphNodeDetails
  @Prop({ type: String, default: '#000000' })
  public color!: string
  @Prop({ type: String, default: '' })
  public text!: string
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
      top: `${this.start.y - this.relativeStartY}px`,
      left: `${this.start.x - this.relativeStartX}px`
    }
  }
  public get textStyle () {
    switch (this.mode) {
      case Mode.VERTICAL: return this.verticalTextStyle
      case Mode.HORIZONTAL: return this.horizontalTextStyle
      default: throw new Error(`Unknown mode: ${this.mode}`)
    }
  }
  public get polylinePoints () {
    switch (this.edgeType) {
      case EdgeType.CROSS: {
        return `${this.relativeStartX},${this.relativeStartY} `
          + `${this.renderedWidth - this.relativeStartX},${this.renderedHeight - this.relativeStartY}`
      }
      case EdgeType.BENT: {
        switch (this.mode) {
          case Mode.VERTICAL: return this.verticalPolylinePoints
          case Mode.HORIZONTAL: return this.horizontalPolylinePoints
        }
      }
      default: {
        throw new Error(`Unknown edge type: ${this.edgeType}`)
      }
    }
  }
  public get markerStart () {
    switch (this.edgeDirection) {
      case 's':
      case 'w': {
        return null
      }
      case 'n':
      case 'e': {
        return 'url(#arrow)'
      }
      default: {
        throw new Error(`Unknown direction: ${this.edgeDirection}`)
      }
    }
  }
  public get markerEnd () {
    switch (this.edgeDirection) {
      case 's':
      case 'w': {
        return 'url(#arrow)'
      }
      case 'n':
      case 'e': {
        return null
      }
      default: {
        throw new Error(`Unknown direction: ${this.edgeDirection}`)
      }
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
      case 'w': {
        const delimiter = this.relativeWidth > 0
          ? 'right' : 'left'

        style[delimiter] = `${this.paddingSize * 2}px`

        return style
      }
      case 'n':
      case 'e': {
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
      case 'w': {
        const delimiter = this.relativeHeight > 0
          ? 'bottom' : 'top'

        style[delimiter] = `${this.paddingSize * 2}px`

        return style
      }
      case 'n':
      case 'e': {
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
  private get verticalPolylinePoints () {
    switch (this.edgeDirection) {
      case 's':
      case 'w': {
        const halfLength = this.renderedHeight / 2

        return `${this.relativeStartX},${this.relativeStartY} `
          + `${this.relativeStartX},${halfLength} `
          + `${this.renderedWidth - this.relativeStartX},${halfLength} `
          + `${this.renderedWidth - this.relativeStartX},${this.renderedHeight - this.relativeStartY} `
      }
      case 'n':
      case 'e': {
        // To simplify the calc, always assume
        // that the edges go from left to right.
        // For edges that go right to left, we'll just inverse it.
        // This is determined from where the endpoint is in the flowchart.
        const isEdgeRightSide = this.start.nodeDirection === 'e' && this.end.nodeDirection === 'e'
        const edgeXDirection = isEdgeRightSide ? 1 : -1

        // Both the detour and the direction of the width depending
        // On whether they go ltr or rtl
        const relativeDetourSize = this.detourSize * edgeXDirection
        const absoluteWidth = Math.abs(this.relativeWidth) * edgeXDirection

        // Two types of backward edge;
        // - they move horizontally then vertically (because the target is at ne)
        // - they move vertically then horizontally (because the target is at sw)
        // Inverse the start/end for nodes going right to left
        const isEdgeGoingHV = isEdgeRightSide
          ? this.start.x > this.end.x : this.end.x > this.start.x

        // Starting point is always the same
        const startPointX = this.relativeStartX

        // If they go HV, they just need to make a little detour before going vertical
        // Otherwise, go all the way till the edge of the horizontal space
        const middlePointX = isEdgeGoingHV
          ? this.relativeStartX + relativeDetourSize : this.relativeStartX + absoluteWidth + relativeDetourSize

        // Go to the opposite side of their starting point
        const endPointX = isEdgeGoingHV
          ? this.relativeStartX - absoluteWidth : this.relativeStartX + absoluteWidth

        // For backward edges going vertically, no changes on the vertical point
        const startPointY = this.relativeStartY
        const endPointY = this.renderedHeight - this.relativeStartY

        return `${startPointX},${startPointY} `
          + `${middlePointX},${startPointY} `
          + `${middlePointX},${endPointY} `
          + `${endPointX},${endPointY} `
      }
      default: {
        throw new Error(`Unknown direction: ${this.edgeDirection}`)
      }
    }
  }
  private get horizontalPolylinePoints () {
    switch (this.edgeDirection) {
      case 's':
      case 'w': {
        const halfLength = this.renderedWidth / 2

        return `${this.relativeStartX},${this.relativeStartY} `
          + `${this.relativeStartX + halfLength},${this.relativeStartY} `
          + `${this.relativeStartX + halfLength},${this.renderedHeight - this.relativeStartY} `
          + `${this.renderedWidth - this.relativeStartX},${this.renderedHeight - this.relativeStartY} `
      }
      case 'n':
      case 'e': {
        // To simplify the calc, always assume
        // that the edges go from top to bottom.
        // For edges that go bottom to top, we'll just inverse it.
        // This is determined from where the endpoint is in the flowchart.
        const isEdgeBottomSide = this.start.nodeDirection === 's' && this.end.nodeDirection === 's'
        const edgeYDirection = isEdgeBottomSide ? 1 : -1

        // Both the detour and the direction of the width depending
        // On whether they go ltr or rtl
        const relativeDetourSize = this.detourSize * edgeYDirection
        const absoluteHeight = Math.abs(this.relativeHeight) * edgeYDirection

        // Two types of backward edge;
        // - they move vertically then horizontally (because the target is at se)
        // - they move horizontally then vertically (because the target is at nw)
        // Inverse the start/end for nodes going right to left
        const isEdgeGoingVH = isEdgeBottomSide
          ? this.start.y > this.end.y : this.end.y > this.start.y

        // Starting point is always the same
        const startPointY = this.relativeStartY

        // If they go HV, they just need to make a little detour before going vertical
        // Otherwise, go all the way till the edge of the horizontal space
        const middlePointY = isEdgeGoingVH
          ? this.relativeStartY + relativeDetourSize : this.relativeStartY + absoluteHeight + relativeDetourSize

        // Go to the opposite side of their starting point
        const endPointY = isEdgeGoingVH
          ? this.relativeStartY - absoluteHeight : this.relativeStartY + absoluteHeight

        // For backward edges going horizontallyly, no changes on the horizontally point
        const startPointX = this.relativeStartX
        const endPointX = this.renderedWidth - this.relativeStartX

        return `${startPointX},${startPointY} `
          + `${startPointX},${middlePointY} `
          + `${endPointX},${middlePointY} `
          + `${endPointX},${endPointY} `
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
  private get relativeStartX () {
    switch (this.mode) {
      case Mode.VERTICAL: {
        // For edges going rtl,
        // it should start at the top right corner of the svg
        if (this.relativeWidth < 0) {
          return this.renderedWidth - this.paddingSize
        }

        // For edges going ltr,
        // it should start at the top left corner of the svg
        if (this.relativeWidth > 0) {
          return this.paddingSize
        }

        // For edges going straight,
        // it should just start at the middle of the svg
        return this.renderedWidth / 2
      }
      case Mode.HORIZONTAL: {
        return this.paddingSize
      }
      default: {
        throw new Error(`Unknown mode: ${this.mode}`)
      }
    }
  }
  private get relativeStartY () {
    switch (this.mode) {
      case Mode.VERTICAL: {
        return this.paddingSize
      }
      case Mode.HORIZONTAL: {
        // For edges going ttb,
        // it should start at the top right corner of the svg
        if (this.relativeHeight < 0) {
          return this.renderedHeight - this.paddingSize
        }

        // For edges going btt,
        // it should start at the top left corner of the svg
        if (this.relativeHeight > 0) {
          return this.paddingSize
        }

        // For edges going straight,
        // it should just start at the middle of the svg
        return this.renderedHeight / 2
      }
      default: {
        throw new Error(`Unknown mode: ${this.mode}`)
      }
    }
  }
  private get paddingSize () {
    switch (this.edgeDirection) {
      case 's':
      case 'w': {
        return this.minSize
      }
      case 'n':
      case 'e': {
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
        if (this.to.rowIdx >= this.from.rowIdx) {
          return 's'
        }

        return 'n'
      }
      case Mode.HORIZONTAL: {
        if (this.to.rowIdx >= this.from.rowIdx) {
          return 'w'
        }

        return 'e'
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

    if (endRowIdx >= startRowIdx) {
      // When the edges go forward,
      // it is always going from top to bottom (vertically)
      // or left to right (horizontally).
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

      shapedEdge.start.x = startDirections[shapedEdge.start.nodeDirection].x + startNode.x
      shapedEdge.start.y = startDirections[shapedEdge.start.nodeDirection].y + startNode.y

      shapedEdge.end.x = endDirections[shapedEdge.end.nodeDirection].x + endNode.x
      shapedEdge.end.y = endDirections[shapedEdge.end.nodeDirection].y + endNode.y
    } else {
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

      switch (this.mode) {
        case Mode.VERTICAL: {
          const direction = isNodeIdxPositive ? 'e' : 'w'
          shapedEdge.start.nodeDirection = direction
          shapedEdge.end.nodeDirection = direction
          break
        }
        case Mode.HORIZONTAL: {
          const direction = isNodeIdxPositive ? 's' : 'n'
          shapedEdge.start.nodeDirection = direction
          shapedEdge.end.nodeDirection = direction
          break
        }
        default: {
          throw new Error(`Unknown mode: ${this.mode}`)
        }
      }

      shapedEdge.start.x = endDirections[shapedEdge.end.nodeDirection].x + endNode.x
      shapedEdge.start.y = endDirections[shapedEdge.end.nodeDirection].y + endNode.y

      shapedEdge.end.x = startDirections[shapedEdge.start.nodeDirection].x + startNode.x
      shapedEdge.end.y = startDirections[shapedEdge.start.nodeDirection].y + startNode.y
    }

    return shapedEdge
  }
  private get start () {
    return this.shapedEdge.start
  }
  private get end () {
    return this.shapedEdge.end
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
