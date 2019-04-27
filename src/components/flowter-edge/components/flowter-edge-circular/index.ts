// Libraries
import { Component, Mixins } from 'vue-property-decorator'

// Constants
import { EDGE_SR_ARC_SIZE_RATIO } from '@/shared/constants'

// Mixins
import FlowterEdgeSharedMixin from '../../mixins/flowter-edge-shared'
/**
 * The Flowter edge's Vue class component.
 */
@Component
export default class FlowterEdgeCircular extends Mixins(FlowterEdgeSharedMixin) {
  /*
   * -------------------------------
   * Public accessor/computed
   * -------------------------------
   */

  /**
   * The edge's `path` points.
   */
  public get points () {
    const { from, to } = this.relativePosition

    return [
      { x: from.x, y: from.y },
      { x: to.x, y: to.y }
    ]
  }

  /**
   * The edge's `path` command.
   */
  public get pathCommand () {
    const { from, to } = this.relativePosition
    const isSweeping = this.side === 'e' || this.side === 'n'

    return `M ${from.x} ${from.y} `
      + `A ${Math.floor(this.renderedWidth / EDGE_SR_ARC_SIZE_RATIO)} `
      + `${Math.floor(this.renderedHeight / EDGE_SR_ARC_SIZE_RATIO)} `
      + `0 1 ${Number(isSweeping)} ${to.x} ${to.y}`
  }

  /**
   * The edge's width rendered in the DOM.
   *
   * The width also accounts for the padding size, left and right.
   */
  public get renderedWidth () {
    switch (this.arcSide) {
      case 'v': {
        // @todo This is still incorrect. Find out the right value
        return this.relativeHeight * 3
      }
      case 'h': {
        return Math.abs(this.relativeWidth) + (this.paddingSize * 2)
      }
      default: {
        throw new Error(`Invalid arc side: ${this.arcSide}`)
      }
    }
  }

  /**
   * The edge's height rendered in the DOM.
   *
   * The height also accounts for the padding size, top and bottom.
   */
  public get renderedHeight () {
    switch (this.arcSide) {
      case 'v': {
        return Math.abs(this.relativeHeight) + (this.paddingSize * 2)
      }
      case 'h': {
        // @todo This is still incorrect. Find out the right value
        return this.relativeWidth
      }
      default: {
        throw new Error(`Invalid arc side: ${this.arcSide}`)
      }
    }
  }

  /**
   * The position of the edge in the DOM.
   *
   * The only complication is the self-referential node, otherwise
   * it would be defined solely on the start and the edge of the edge.
   */
  public get domPosition () {
    switch (this.side) {
      case 'w': {
        const xOffset = this.renderedWidth - (this.paddingSize * 2)

        return {
          x: this.fromPosition.x - xOffset,
          y: this.fromPosition.y
        }
      }
      case 'n': {
        const yOffset = this.renderedHeight - (this.paddingSize * 2)

        return {
          x: this.fromPosition.x,
          y: this.fromPosition.y - yOffset
        }
      }
      case 's':
      case 'e': {
        return {
          x: this.fromPosition.x,
          y: this.fromPosition.y
        }
      }
      default: {
        throw new Error(`Unknown edge side: ${this.side}.`)
      }
    }
  }

  /*
   * -------------------------------
   * Private accessor/computed
   * -------------------------------
   */

  private get arcSide () {
    if (this.fromPosition.x === this.toPosition.x) {
      return 'v'
    }

    if (this.fromPosition.y === this.toPosition.y) {
      return 'h'
    }

    throw new Error ('Invalid circular edge position.')
  }
}
