// Libraries
import { Component, Mixins } from 'vue-property-decorator'

// Mixins
import FlowterNodeRendererMixin from '../../mixins/flowter-node-renderer'

/**
 * The Flowter node ellipse's Vue class component.
 */
@Component
export default class FlowterNodeEllipse extends Mixins(FlowterNodeRendererMixin) {
}
