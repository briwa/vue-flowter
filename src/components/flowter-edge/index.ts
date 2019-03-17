import { Component, Vue, Prop } from 'vue-property-decorator'

enum Marker {
  START = 'start',
  END = 'end'
}

enum PathStyle {
  CROSS = 'cross',
  BENT = 'bent'
}

enum Direction {
  FORWARD = 'forward',
  BACKWARD = 'backward'
}

@Component
export default class FlowterEdge extends Vue {
  @Prop({ type: Array, required: true })
  public startPoint!: [number, number]
  @Prop({ type: Array, required: true })
  public endPoint!: [number, number]
  @Prop({ type: Array, required: true })
  public centerPoint!: [number, number]
  @Prop({ type: String, default: Marker.END })
  public marker!: Marker
  @Prop({ type: String, default: PathStyle.BENT })
  public pathStyle!: PathStyle
  @Prop({ type: String, default: Direction.FORWARD })
  public direction!: Direction

  // Computed
  public get edgeStyle () {
    return {
      width: `${this.renderedWidth}px`,
      height: `${this.renderedHeight}px`,
      top: `${this.startPoint[1] - this.paddingSize}px`,
      left: `${this.startPoint[0] - this.relativeStartX}px`
    }
  }
  public get polylinePoints () {
    const edgeHeight = this.renderedHeight
    const halfHeight = this.renderedHeight / 2

    switch (this.pathStyle) {
      case PathStyle.CROSS: {
        return `${this.relativeStartX},${this.paddingSize} `
          + `${this.renderedWidth - this.relativeStartX},${edgeHeight - this.relativeStartY}`
      }
      case PathStyle.BENT: {
        switch (this.direction) {
          case Direction.FORWARD: {
            return `${this.relativeStartX},${this.relativeStartY} `
              + `${this.relativeStartX},${halfHeight} `
              + `${this.renderedWidth - this.relativeStartX},${halfHeight} `
              + `${this.renderedWidth - this.relativeStartX},${edgeHeight - this.relativeStartY} `
          }
          case Direction.BACKWARD: {
            // Depending on whether the edge goes rtl or ltr
            // (relative to the center of the flowchart, not the target)
            // the detour direction should follow the edge direction.
            // Also, since the startX has already taken minSize into account,
            // the detour size should only contain the value
            const relativeDetourSize = this.startPoint[0] > this.centerPoint[0]
              ? this.detourSize : -this.detourSize

            return `${this.relativeStartX},${this.relativeStartY} `
              + `${this.relativeStartX + relativeDetourSize},${this.relativeStartY} `
              + `${this.relativeStartX + relativeDetourSize},${edgeHeight - this.relativeStartY} `
              + `${this.renderedWidth - this.relativeStartX},${edgeHeight - this.relativeStartY} `
          }
        }
      }
    }
  }
  public get markerStart () {
    return this.marker === Marker.START
      ? 'url(#arrow)' : undefined
  }
  public get markerEnd () {
    return this.marker === Marker.END
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
    return this.endPoint[0] - this.startPoint[0]
  }
  private get relativeHeight () {
    return this.endPoint[1] - this.startPoint[1]
  }
  private get relativeStartX () {
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
  private get relativeStartY () {
    return this.paddingSize
  }
  private get paddingSize () {
    return this.direction === Direction.FORWARD
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
