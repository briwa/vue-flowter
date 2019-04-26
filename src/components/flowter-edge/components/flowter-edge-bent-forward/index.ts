// Libraries
import { Component, Mixins } from 'vue-property-decorator'

// Mixins
import FlowterEdgeSharedMixin from '../../mixins/flowter-edge-shared'

/**
 * The Flowter edge's Vue class component.
 */
@Component
export default class FlowterEdgeBentForward extends Mixins(FlowterEdgeSharedMixin) {
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
      case 's': {
        const halfLength = (to.y + this.paddingSize) * 0.5

        return `M ${from.x} ${from.y} `
          + `V ${halfLength} `
          + `H ${to.x} `
          + `V ${to.y}`
      }
      case 'e': {
        const halfLength = (to.x + this.paddingSize) * 0.5

        return `M ${from.x} ${from.y} `
          + `H ${halfLength} `
          + `V ${to.y} `
          + `H ${to.x}`
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
