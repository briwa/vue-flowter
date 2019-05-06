// Libraries
import { Prop, Component, Vue, Mixins } from 'vue-property-decorator'

// Components
import FlowterEdgeStraight from './components/flowter-edge-straight/index.vue'
import FlowterEdgeBentForward from './components/flowter-edge-bent-forward/index.vue'
import FlowterEdgeBentBackward from './components/flowter-edge-bent-backward/index.vue'
import FlowterEdgeCircular from './components/flowter-edge-circular/index.vue'

// Mixins
import FlowterEdgePropsMixin from './mixins/flowter-edge-props'

// Types
import { EdgeType, EdgeShape } from '@/shared/types'

/**
 * The Flowter edge's base component.
 * This holds all of the edge shapes' components.
 */
@Component({
  components: {
    FlowterEdgeStraight,
    FlowterEdgeBentForward,
    FlowterEdgeBentBackward,
    FlowterEdgeCircular
  }
})
export default class FlowterEdgeBase extends Mixins(FlowterEdgePropsMixin) {
  /*
   * -------------------------------
   * Public accessor/computed
   * -------------------------------
   */

  /**
   * @todo Comment this.
   */
  public get componentName () {
    const namePrefix = 'flowter-edge'

    if (this.isCircular) {
      return `${namePrefix}-${EdgeShape.CIRCULAR}`
    }

    if (this.type === EdgeType.CROSS) {
      return `${namePrefix}-${EdgeShape.STRAIGHT}`
    }

    switch (this.direction) {
      case 's':
      case 'e': {
        return `${namePrefix}-${EdgeShape.BENT_FORWARD}`
      }
      case 'n':
      case 'w': {
        return `${namePrefix}-${EdgeShape.BENT_BACKWARD}`
      }
      default: {
        throw new Error(`Invalid edge direction: ${this.direction}`)
      }
    }
  }
}
