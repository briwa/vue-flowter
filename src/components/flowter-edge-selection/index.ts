// Libraries
import { Component, Vue, Prop } from 'vue-property-decorator'

// Components
import FlowterEdge from '@/components/flowter-edge'
import { EditingEdgeDetails, Mode, EdgeType, EdgeMarker, GraphNodeDetails } from '@/shared/types'

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
  /**
   * Whether an edge is being edited or not.
   */
  @Prop({ type: Boolean, required: true })
  public editing!: boolean

  /**
   * Specifies the node id that the edited edge is connected from.
   */
  @Prop({ type: Object, required: true })
  public from!: GraphNodeDetails

  /**
   * Specifies the node id that the edited edge is connected to.
   */
  @Prop({ type: Object, required: true })
  public to!: GraphNodeDetails

  /**
   * The flowchart mode.
   *
   * This follows [[Flowter.mode]].
   */
  @Prop({ type: String, required: true })
  public mode!: Mode

  /**
   * The edge type.
   *
   * This follows [[Flowter.edgeType]].
   */
  @Prop({ type: String, required: true })
  public edgeType!: EdgeType

  /**
   * The edge text's font size.
   * This follows [[Flowter.fontSize]].
   */
  @Prop({ type: Number, required: true })
  public fontSize!: number

  /**
   * The side of the marker that will be rendered (optional).
   *
   * This should be derived from [[Flowter.edges]] members' `marker` value.
   * By default, it is set to [[EdgeMarker.END]].
   */
  @Prop({ type: String, default: EdgeMarker.END })
  public marker!: EdgeMarker

  /**
   * The color of the edge (optional).
   *
   * This should be derived from [[Flowter.edges]] members' `color` value.
   * By default, it is set to black (`#000000`).
   */
  @Prop({ type: String, default: '#000000' })
  public color!: string
}
