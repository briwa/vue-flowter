// Libraries
import { Component, Vue } from 'vue-property-decorator'

// Components
import FlowterEdge from '@/components/flowter-edge'

/**
 * @wip
 * ## This component is still a work in progress.
 *
 * The Flowter node selection's Vue class component.
 *
 * This component acts as a representation of the currently
 * edited edge. It relies on [[FlowterEdge]] so that the edge
 * being edited is represented and rendered as the edge itself.
 *
 */
@Component({
  components: {
    FlowterEdge
  }
})
export default class FlowterEdgeSelection extends Vue {
}
