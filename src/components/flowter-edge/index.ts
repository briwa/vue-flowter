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
  @Prop({ type: Array, required: true })
  public centerPoint!: [number, number]
  @Prop({ type: String, default: Marker.END })
  public marker!: Marker
  @Prop({ type: String, default: PathStyle.ANGLE })
  public pathStyle!: PathStyle
  @Prop({ type: String, default: Direction.FORWARD })
  public direction!: Direction

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
    const magicNumber = -2
    const edgeHeight = this.renderedHeight - 2
    const halfHeight = this.renderedHeight / 2

    // Straight arrows don't need no customizations
    if (this.relativeWidth === 0) {
      return `0,0 0,${edgeHeight} `
    }

    const halfWidth = this.relativeWidth / 2
    const startX = Math.abs(halfWidth) - (this.minSize / 2)

    // When the arrows are crossing at the end,
    // they're all stacked together, which makes it hard to see.
    // Move it slightly to either direction so that it's better.
    const arrowOffset = halfWidth > 0 ? 6 : -6

    switch (this.pathStyle) {
      case PathStyle.CROSS: {
        return `${startX},0 ${startX + halfWidth - arrowOffset},${edgeHeight}`
      }
      case PathStyle.ANGLE: {
        switch (this.direction) {
          case Direction.FORWARD: {
            return `${startX},0 `
              + `${startX},${halfHeight} `
              + `${startX + halfWidth},${halfHeight} `
              + `${startX + halfWidth},${edgeHeight} `
          }
          case Direction.BACKWARD: {
            // There are two types of backward edge:
            // 1. The one that goes vertical then horizontal
            // 2. The one that goes horizontal then vertical
            // We should determine the type by the size of width and height
            // Also, the detour direction matters depending on whether
            // the target x and the origin x is placed
            // TODO: improve this ever-complicated algorithm
            const direction = this.startPoint[0] > this.centerPoint[0] ? 1 : -1
            const detourOffset = this.startPoint[0] > this.centerPoint[0]
              ? (this.detourSize * 2) + magicNumber : 0

            // (1)
            if (this.renderedHeight >= this.renderedWidth) {
              return `${startX + this.detourSize - (magicNumber * direction)},${arrowOffset * direction} `
                + `${startX + halfWidth + detourOffset},${arrowOffset * direction} `
                + `${startX + halfWidth + detourOffset},${edgeHeight} `
                + `${startX + halfWidth + this.detourSize},${edgeHeight} `
            }

            // (2)
            return `${startX + this.detourSize - magicNumber},${-arrowOffset * direction} `
              + `${startX + detourOffset },${-arrowOffset * direction} `
              + `${startX + detourOffset },${edgeHeight} `
              + `${startX + this.detourSize + halfWidth },${edgeHeight} `
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
    return `-${this.minSize} 0 ${this.renderedWidth} ${this.renderedHeight}`
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
    // Multiply by two because the edge starts
    // from the middle of the SVG. The size should be
    // at least twice the difference
    return (this.endPoint[0] - this.startPoint[0]) * 2
  }
  private get relativeHeight () {
    return this.endPoint[1] - this.startPoint[1]
  }
  private get renderedWidth () {
    const naturalSize = Math.max(Math.abs(this.relativeWidth), this.minSize) + this.minSize
    if (this.direction === Direction.FORWARD) {
      return naturalSize
    }

    return naturalSize + (this.detourSize * 2)
  }
  private get renderedHeight () {
    return Math.max(Math.abs(this.relativeHeight), this.minSize)
  }
}
