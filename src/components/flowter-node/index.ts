// Libraries
import { Component,  Mixins } from 'vue-property-decorator'

// Components
import FlowterNodeEllipse from './components/flowter-node-ellipse'
import FlowterNodeParallelogram from './components/flowter-node-parallelogram'
import FlowterNodeRectangle from './components/flowter-node-rectangle'
import FlowterNodeRhombus from './components/flowter-node-rhombus'
import FlowterNodeRoundedRectangle from './components/flowter-node-rounded-rectangle'

// Mixins
import FlowterNodePropsMixin from './mixins/flowter-node-props'

/**
 * The Flowter node's base component.
 * This holds all the node symbols' components.
 */
@Component({
  components: {
    FlowterNodeEllipse,
    FlowterNodeParallelogram,
    FlowterNodeRectangle,
    FlowterNodeRhombus,
    FlowterNodeRoundedRectangle
  }
})
export default class FlowterEdgeBase extends Mixins(FlowterNodePropsMixin) {
  /*
   * -------------------------------
   * Public accessor/computed
   * -------------------------------
   */

  /**
   * The node component name based on the symbol
   */
  public get componentName () {
    return `flowter-node-${this.symbol}`
  }
}
