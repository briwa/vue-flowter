import { Component, Vue, Prop } from 'vue-property-decorator'

enum Marker {
  START = 'start',
  END = 'end'
}

@Component
export default class FlowterEdge extends Vue {
  @Prop({ type: Number, required: true })
  public from!: number
  @Prop({ type: Number, required: true })
  public to!: number
  @Prop({ type: Array, required: true })
  public startPoint!: [number, number]
  @Prop({ type: Array, required: true })
  public endPoint!: [number, number]
  @Prop({ type: String, default: Marker.END })
  public marker!: Marker

  // Computed
  // Since SVG viewboxes are counted in 'units',
  // it would only get multiplied by the container's ratio
  // (it is intended this way). So now, all calculations to the DOM
  // is multiplied by this ratio, but NOT on the SVG itself.
  public get ratio () {
    return 2
  }

  public get minSize () {
    return 10
  }

  public get relativeWidth () {
    return this.endPoint[0] - this.startPoint[0]
  }

  public get relativeHeight () {
    return this.endPoint[1] - this.startPoint[1]
  }

  public get renderedWidth () {
    return Math.max(Math.abs(this.relativeWidth), this.minSize) + this.minSize
  }

  public get renderedHeight () {
    return Math.max(Math.abs(this.relativeHeight), this.minSize)
  }

  public get viewBox () {
    return `-${this.minSize} 0 ${this.renderedWidth} ${this.renderedHeight}`
  }

  public get edgeStyle () {
    const width = this.renderedWidth * this.ratio
    const height = this.renderedHeight * this.ratio

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
    const edgeHeight = this.renderedHeight - 2
    const halfHeight = this.renderedHeight / 2

    if (this.relativeWidth === 0) {
      return `0,0 0,${edgeHeight} `
    }

    const halfWidth = this.relativeWidth / 2
    const startX = Math.abs(halfWidth) - (this.minSize / 2)

    return `${startX},0 `
      + `${startX},${halfHeight} `
      + `${startX + halfWidth},${halfHeight} `
      + `${startX + halfWidth},${edgeHeight} `
  }

  public get markerStart () {
    return this.marker === Marker.START
      ? 'url(#arrow)' : undefined
  }

  public get markerEnd () {
    return this.marker === Marker.END
      ? 'url(#arrow)' : undefined
  }
}
