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
    const points = [{ x: from.x, y: from.y }]

    switch (this.side) {
      case 'e':
      case 'w': {
        const halfY = this.relativeHeight / 2
        const halfArcX = this.side === 'e'
          ? (this.arcRadiusX * 2) - (this.strokeWidth * 2)
          : (this.renderedWidth - (this.arcRadiusX * 2)) + (this.strokeWidth * 2)

        const halfArcY = from.y + halfY
        points.push({ x: halfArcX, y: halfArcY })
        break
      }
      case 'n':
      case 's': {
        const halfX = this.relativeWidth / 2
        const halfArcY = this.side === 's'
          ? (this.arcRadiusY * 2) - (this.strokeWidth * 2)
          : (this.renderedHeight - (this.arcRadiusY * 2)) + (this.strokeWidth * 2)

        const halfArcX = from.x + halfX
        points.push({ x: halfArcX, y: halfArcY })
        break
      }
      default: {
        throw new Error(`Unknown edge side: ${this.side}.`)
      }
    }

    points.push({ x: to.x, y: to.y })

    return points
  }

  /**
   * The edge's `path` command.
   */
  public get pathCommand () {
    return this.points.reduce((command, point, index) => {
      switch (index) {
        case 0: {
          return `M ${point.x} ${point.y}`
        }
        case 1:
        case 2: {
          const isSweeping = Number(this.side === 'e' || this.side === 'n')

          return `${command} A ${this.arcRadiusX} `
            + `${this.arcRadiusY} 0 0 ${isSweeping} `
            + `${point.x} ${point.y}`
        }
        default: {
          throw new Error(`Unhandled point index: ${index}`)
        }
      }
    }, '')
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
        // @todo This is still incorrect. Find out the right value
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
        return this.relativeWidth / 1.25
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

  /**
   * @todo Comment this.
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

  /**
   * @todo Comment this.
   */
  private get arcRadiusX () {
    return Math.floor(this.renderedWidth / EDGE_SR_ARC_SIZE_RATIO)
  }

  /**
   * @todo Comment this.
   */
  private get arcRadiusY () {
    return Math.floor(this.renderedHeight / EDGE_SR_ARC_SIZE_RATIO)
  }
}
