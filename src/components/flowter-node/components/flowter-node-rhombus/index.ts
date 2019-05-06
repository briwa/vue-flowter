// Libraries
import { Component, Mixins } from 'vue-property-decorator'

// Mixins
import FlowterNodeSharedMixin from '../../mixins/flowter-node-shared'
import { NODE_SMALLER_RATIO } from '@/shared/constants'

/**
 * The Flowter node rhombus's Vue class component.
 */
@Component
export default class FlowterNodeRhombus extends Mixins(FlowterNodeSharedMixin) {
  /*
   * -------------------------------
   * Public accessor/computed
   * -------------------------------
   */

  /**
   * The node's symbol as the SVG `path`.
   *
   * This is derived from [[RenderedGraphNode.symbol]] value.
   */
  public get nodePoints () {
    return `M ${this.halfWidth} ${this.margin} `
      + `L ${this.width - this.margin} ${this.halfHeight} `
      + `L ${this.halfWidth} ${this.height - this.margin} `
      + `L ${this.margin} ${this.halfHeight} Z`
  }
}

