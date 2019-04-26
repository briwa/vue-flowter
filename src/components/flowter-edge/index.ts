// Libraries
import { Prop, Component, Vue, Mixins } from 'vue-property-decorator'

// Components
import FlowterEdgeStraight from './components/flowter-edge-straight/index.vue'
import FlowterEdgeBentForward from './components/flowter-edge-bent-forward/index.vue'
import FlowterEdgeBentBackward from './components/flowter-edge-bent-backward/index.vue'
import FlowterEdgeCircular from './components/flowter-edge-circular/index.vue'

// Mixins
import FlowterEdgePropsMixin from './mixins/flowter-edge-props'

/**
 * The Flowter edge's base mixin.
 * This is shared across all edge types.
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
  public get style () {
    if (this.isCircular) {
      return 'circular'
    }

    switch (this.direction) {
      case 's':
      case 'e': {
        const sameX = this.fromPosition.x === this.toPosition.x
        const sameY = this.fromPosition.y === this.toPosition.y
        if (sameX || sameY) {
          return 'straight'
        }

        return 'bent-forward'
      }
      case 'n':
      case 'w': {
        return 'bent-backward'
      }
      default: {
        throw new Error(`Invalid edge direction: ${this.direction}`)
      }
    }
  }
}
