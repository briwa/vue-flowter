import { Component, Vue, Prop } from 'vue-property-decorator'

enum Marker {
  START = 'start',
  END = 'end'
}

enum PathStyle {
  CROSS = 'cross',
  ANGLE = 'angle'
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
  @Prop({ type: String, default: Marker.END })
  public marker!: Marker
  @Prop({ type: String, default: PathStyle.ANGLE })
  public pathStyle!: PathStyle

  // Computed
  public get edgeStyle () {
    const width = this.renderedWidth
    const height = this.renderedHeight

    return {
      width: `${width}px`,
      height: `${height}px`,
      top: `${this.startPoint[1]}px`,
      // The edge should be positioned at the middle of the starting point
      left: `${this.startPoint[0] - (width / 2)}px`
    }
  }
  public get polylinePoints () {
    // Let's make a really naive approach on the edge.
    // For now, all edges move downwards.
    // Magic number -2 is so that the tip of the arrow
    // won't touch the next node, because it's ugly.
    const edgeHeight = this.renderedHeight - 2
    const halfHeight = this.renderedHeight / 2

    // Straight arrows don't need no customizations
    if (this.relativeWidth === 0) {
      return `0,0 0,${edgeHeight} `
    }

    const halfWidth = this.relativeWidth / 2
    const startX = (this.direction === Direction.FORWARD
      ? Math.abs(halfWidth) : halfWidth) - (this.minSize / 2)

    switch (this.pathStyle) {
      case PathStyle.CROSS: {
        // When the arrows are crossing at the end,
        // they're all stacked together, which makes it hard to see.
        // Move it slightly to either direction so that it's better.
        const arrowOffset = halfWidth > 0 ? 6 : -6
        return `${startX},0 ${startX + halfWidth - arrowOffset},${edgeHeight}`
      }
      case PathStyle.ANGLE: {
        return `${startX},0 `
          + `${startX},${halfHeight} `
          + `${startX + halfWidth},${halfHeight} `
          + `${startX + halfWidth},${edgeHeight} `
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
    return `-${this.minSize} 0 ${this.renderedWidth} ${this.renderedHeight}`
  }
  // Minimum size of the edge, both width and height
  private get minSize () {
    return 10
  }
  private get relativeWidth () {
    // Multiply by two because the edge starts
    // from the middle of the SVG. The size should be
    // at least twice the difference
    return (this.endPoint[0] - this.startPoint[0]) * 2
  }
  private get relativeHeight () {
    return this.endPoint[1] - this.startPoint[1]
  }
  private get renderedWidth () {
    return Math.max(Math.abs(this.relativeWidth), this.minSize) + this.minSize
  }
  private get renderedHeight () {
    return Math.max(Math.abs(this.relativeHeight), this.minSize)
  }
  private get direction () {
    return this.relativeWidth >= 0 || this.relativeHeight >= 0
      ? Direction.FORWARD : Direction.BACKWARD
  }
}
