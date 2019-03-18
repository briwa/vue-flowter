import { Component, Vue, Prop } from 'vue-property-decorator'

import {
  Point, EdgeMarker, EdgeDirection, Mode, EdgeType
} from '@/types'

@Component
export default class FlowterEdge extends Vue {
  @Prop({ type: Object, required: true })
  public startPoint!: Point
  @Prop({ type: Object, required: true })
  public endPoint!: Point
  @Prop({ type: Object, required: true })
  public centerPoint!: Point
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
        // Depending on whether the edge goes rtl or ltr
        // (relative to the center of the flowchart, not the target)
        // the detour direction should follow the edge direction.
        // Also, since the startX has already taken minSize into account,
        // the detour size should only contain the value
        const relativeDetourSize = this.startPoint.x > this.centerPoint.x
          ? this.detourSize : -this.detourSize

        return `${this.relativeStartX},${this.relativeStartY} `
          + `${this.relativeStartX + relativeDetourSize},${this.relativeStartY} `
          + `${this.relativeStartX + relativeDetourSize},${this.renderedHeight - this.relativeStartY} `
          + `${this.renderedWidth - this.relativeStartX},${this.renderedHeight - this.relativeStartY} `
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
        // Depending on whether the edge goes ttb or btt
        // (relative to the center of the flowchart, not the target)
        // the detour direction should follow the edge direction.
        // Also, since the startY has already taken minSize into account,
        // the detour size should only contain the value
        const relativeDetourSize = this.startPoint.y > this.centerPoint.y
          ? this.detourSize : -this.detourSize

        return `${this.relativeStartX},${this.relativeStartY} `
          + `${this.relativeStartX },${this.relativeStartY + relativeDetourSize} `
          + `${this.renderedWidth - this.relativeStartX},${this.relativeStartY + relativeDetourSize} `
          + `${this.renderedWidth - this.relativeStartX},${this.renderedHeight - this.relativeStartY} `
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
  public get viewBox () {
    return `0 0 ${this.renderedWidth} ${this.renderedHeight}`
  }
  // Minimum size of the edge, both width and height
  private get minSize () {
    return 10
  }
  // For backward edge, there should be a space to 'detour'
  private get detourSize () {
    return 10
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
    return (Math.max(Math.abs(this.relativeWidth), this.minSize))
      + (this.paddingSize * 2)
  }
  private get renderedHeight () {
    return (Math.max(Math.abs(this.relativeHeight), this.minSize))
      + (this.paddingSize * 2)
  }
}
