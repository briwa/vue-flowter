// Libraries
import { Component, Mixins } from 'vue-property-decorator'

// Mixins
import FlowterEdgeSharedMixin from '../../mixins/flowter-edge-shared'

/**
 * The Flowter edge's Vue class component.
 */
@Component
export default class FlowterEdgeBentBackward extends Mixins(FlowterEdgeSharedMixin) {
  /*
   * -------------------------------
   * Public accessor/computed
   * -------------------------------
   */

  /**
   * The edge's `path` points.
   */
  public get edgePoints () {
    const { from, to } = this.relativePosition

    switch (this.direction) {
      case 'n': {
        // To simplify the calc, always assume
        // that the edges go from left to right.
        // For edges that go right to left, we'll just inverse it.
        // This is determined from where the endpoint is in the flowchart.
        const isEdgeRightSide = this.side === 'e'

        // The detour value depends on whether
        // the node is going right to left or left to right
        const relativeDetourSize = isEdgeRightSide
          ? this.detourSize : -this.detourSize

        // Two types of backward edge;
        // - they move horizontally then vertically (because the target is at ne)
        // - they move vertically then horizontally (because the target is at sw)
        // Inverse the start/end for nodes going right to left
        const isEdgeGoingHV = isEdgeRightSide
          ? from.x > to.x : to.x > from.x

        // If they go horizontally then vertically (HV),
        // they just need to make a little detour before going vertical
        // Otherwise, go all the way till the end point
        const middlePointX = isEdgeGoingHV
          ? from.x + relativeDetourSize : to.x + relativeDetourSize

        return `M ${from.x} ${from.y} `
          + `H ${middlePointX} `
          + `V ${to.y} `
          + `H ${to.x}`
      }
      case 'w': {
        // To simplify the calc, always assume
        // that the edges go from top to bottom.
        // For edges that go bottom to top, we'll just inverse it.
        // This is determined from where the endpoint is in the flowchart.
        const isEdgeBottomSide = this.side === 'w'

        // The detour value depends on whether
        // the node is going bottom to top or top to bottom
        const relativeDetourSize = isEdgeBottomSide
          ? this.detourSize : -this.detourSize

        // Two types of backward edge;
        // - they move vertically then horizontally (because the target is at se)
        // - they move horizontally then vertically (because the target is at nw)
        const isEdgeGoingVH = isEdgeBottomSide
          ? from.y > to.y : to.y > from.y

        // If they go horizontally then vertically (HV),
        // they just need to make a little detour before going vertical
        // Otherwise, go all the way till the end point
        const middlePointY = isEdgeGoingVH
          ? from.y + relativeDetourSize : to.y + relativeDetourSize

        return `M ${from.x} ${from.y} `
          + `V ${middlePointY} `
          + `H ${to.x} `
          + `V ${to.y}`
      }
      default: {
        throw new Error(`Invalid direction for bent-forward edge: ${this.direction}`)
      }
    }
  }

  /**
   * The edge's width rendered in the DOM.
   *
   * The width also accounts for the padding size, left and right.
   */
  public get renderedWidth () {
    return Math.abs(this.relativeWidth) + (this.paddingSize * 2)
  }

  /**
   * The edge's height rendered in the DOM.
   *
   * The height also accounts for the padding size, top and bottom.
   */
  public get renderedHeight () {
    return Math.abs(this.relativeHeight) + (this.paddingSize * 2)
  }

  /**
   * The position of the edge in the DOM.
   *
   * The only complication is the self-referential node, otherwise
   * it would be defined solely on the start and the edge of the edge.
   */
  public get domPosition () {
    return {
      x: Math.min(this.fromPosition.x, this.toPosition.x),
      y: Math.min(this.fromPosition.y, this.toPosition.y)
    }
  }
}
