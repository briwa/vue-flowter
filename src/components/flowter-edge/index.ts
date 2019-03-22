// Libraries
import { Prop, Component, Vue } from 'vue-property-decorator'

// Types
import {
  Point, EdgeMarker, EdgeDirection, Mode, EdgeType
} from '@/types'

@Component
export default class FlowterEdge extends Vue {
  @Prop({ type: String, required: true })
  public id!: string
  @Prop({ type: Object, required: true })
  public startPoint!: Point
  @Prop({ type: Object, required: true })
  public endPoint!: Point
  @Prop({ type: Object, required: true })
  public centerPoint!: Point
  @Prop({ type: String, default: '' })
  public text!: string
  @Prop({ type: String, default: EdgeMarker.END })
  public marker!: EdgeMarker
  @Prop({ type: String, default: EdgeType.BENT })
  public edgeType!: EdgeType
  @Prop({ type: String, default: EdgeDirection.FORWARD })
  public direction!: EdgeDirection
  @Prop({ type: String, default: Mode.VERTICAL })
  public mode!: Mode

  // Computed
  public get edgeStyle () {
    return {
      width: `${this.renderedWidth}px`,
      height: `${this.renderedHeight}px`,
      top: `${this.startPoint.y - this.relativeStartY}px`,
      left: `${this.startPoint.x - this.relativeStartX}px`
    }
  }
  public get textStyle () {
    switch (this.mode) {
      case Mode.VERTICAL: return this.verticalTextStyle
      case Mode.HORIZONTAL: return this.horizontalTextStyle
    }
  }
  public get verticalTextStyle () {
    const style: Record<string, string> = {
      top: `${(this.renderedHeight / 2) - (this.textFontSize * 1.5)}px`,
      fontSize: `${this.textFontSize}px`
    }

    switch (this.direction) {
      case EdgeDirection.FORWARD: {
        const delimiter = this.endPoint.x > this.startPoint.x
          ? 'right' : 'left'

        style[delimiter] = `${this.paddingSize * 2}px`

        return style
      }
      case EdgeDirection.BACKWARD: {
        const delimiter = this.startPoint.x > this.centerPoint.x
          ? 'right' : 'left'

        style[delimiter] = `${this.detourSize * 2}px`

        return style
      }
    }
  }
  public get horizontalTextStyle () {
    const style: Record<string, string> = {
      left: `${(this.renderedWidth / 2) - (this.textFontSize * 1.5)}px`,
      fontSize: `${this.textFontSize}px`
    }

    switch (this.direction) {
      case EdgeDirection.FORWARD: {
        const delimiter = this.endPoint.y > this.startPoint.y
          ? 'bottom' : 'top'

        style[delimiter] = `${this.paddingSize * 2}px`

        return style
      }
      case EdgeDirection.BACKWARD: {
        const delimiter = this.startPoint.y > this.centerPoint.y
          ? 'bottom' : 'top'

        style[delimiter] = `${this.detourSize * 2}px`

        return style
      }
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
    }
  }
  public get verticalPolylinePoints () {
    switch (this.direction) {
      case EdgeDirection.FORWARD: {
        const halfLength = this.renderedHeight / 2

        return `${this.relativeStartX},${this.relativeStartY} `
          + `${this.relativeStartX},${halfLength} `
          + `${this.renderedWidth - this.relativeStartX},${halfLength} `
          + `${this.renderedWidth - this.relativeStartX},${this.renderedHeight - this.relativeStartY} `
      }
      case EdgeDirection.BACKWARD: {
        // To simplify the calc, always assume
        // that the edges go from left to right.
        // For edges that go right to left, we'll just inverse it.
        const isEdgeRightSide = this.startPoint.x > this.centerPoint.x
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
          ? this.startPoint.x > this.endPoint.x : this.endPoint.x > this.startPoint.x

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
    }
  }
  public get horizontalPolylinePoints () {
    switch (this.direction) {
      case EdgeDirection.FORWARD: {
        const halfLength = this.renderedWidth / 2

        return `${this.relativeStartX},${this.relativeStartY} `
          + `${this.relativeStartX + halfLength},${this.relativeStartY} `
          + `${this.relativeStartX + halfLength},${this.renderedHeight - this.relativeStartY} `
          + `${this.renderedWidth - this.relativeStartX},${this.renderedHeight - this.relativeStartY} `
      }
      case EdgeDirection.BACKWARD: {
        // To simplify the calc, always assume
        // that the edges go from top to bottom.
        // For edges that go bottom to top, we'll just inverse it.
        const isEdgeTopSide = this.startPoint.y > this.centerPoint.y
        const edgeYDirection = isEdgeTopSide ? 1 : -1

        // Both the detour and the direction of the width depending
        // On whether they go ltr or rtl
        const relativeDetourSize = this.detourSize * edgeYDirection
        const absoluteHeight = Math.abs(this.relativeHeight) * edgeYDirection

        // Two types of backward edge;
        // - they move vertically then horizontally (because the target is at se)
        // - they move horizontally then vertically (because the target is at nw)
        // Inverse the start/end for nodes going right to left
        const isEdgeGoingVH = isEdgeTopSide
          ? this.startPoint.y > this.endPoint.y : this.endPoint.y > this.startPoint.y

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
    }
  }
  public get markerStart () {
    return this.marker === EdgeMarker.START
      ? 'url(#arrow)' : undefined
  }
  public get markerEnd () {
    return this.marker === EdgeMarker.END
      ? 'url(#arrow)' : undefined
  }
  public get shapeRendering () {
    switch (this.edgeType) {
      case EdgeType.CROSS: {
        return null
      }
      case EdgeType.BENT: {
        return 'crispEdges'
      }
    }
  }
  public get viewBox () {
    return `0 0 ${this.renderedWidth} ${this.renderedHeight}`
  }
  private get relativeWidth () {
    return this.endPoint.x - this.startPoint.x
  }
  private get relativeHeight () {
    return this.endPoint.y - this.startPoint.y
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
    }
  }
  private get paddingSize () {
    return this.direction === EdgeDirection.FORWARD
      ? this.minSize : (this.minSize + this.detourSize)
  }
  private get renderedWidth () {
    return Math.abs(this.relativeWidth)
      + (this.paddingSize * 2)
  }
  private get renderedHeight () {
    return Math.abs(this.relativeHeight)
      + (this.paddingSize * 2)
  }
  // Minimum size of the edge, both width and height
  private get minSize () {
    return 10
  }
  // For backward edge, there should be a space to 'detour'
  private get detourSize () {
    return 10
  }
  private get textFontSize () {
    return 12
  }
}
