// Libraries
import { Component, Vue, Prop } from 'vue-property-decorator'

// Components
import FlowterEdge from '@/components/flowter-edge'
import { EditingEdgeDetails, Mode, EdgeType, EdgeMarker, Direction } from '@/shared/types'

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
   * @todo: Annotate
   */
  @Prop({ type: Boolean, required: true })
  public editing!: EditingEdgeDetails['editing']

  /**
   * @todo: Annotate
   */
  @Prop({ type: Boolean, required: true })
  public showing!: EditingEdgeDetails['showing']

  /**
   * @todo: Annotate
   */
  @Prop({ type: Boolean, required: true })
  public dragging!: EditingEdgeDetails['dragging']

  /**
   * @todo: Annotate
   */
  @Prop({ type: Object, default: null })
  public from!: EditingEdgeDetails['from']

  /**
   * @todo: Annotate
   */
  @Prop({ type: Object, default: null })
  public to!: EditingEdgeDetails['to']

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

  /*
   * -------------------------------
   * Public methods
   * -------------------------------
   */

  /**
   * @todo Comment this
   */
  public knobStyle (position: { x: number, y: number }) {
    return {
      left: `${position.x - 5}px`,
      top: `${position.y - 5}px`
    }
  }

  /**
   * @todo Comment this
   */
  public onMouseDown (dragType: string) {
    if (!this.dragging) {
      this.$emit('edit', { type: 'drag-start', payload: dragType })
      this.attachMouseEvents()
    }
  }

  /*
   * -------------------------------
   * Private methods
   * -------------------------------
   */

  /**
   * Attaching mouseup events to the document.
   *
   * This is because the interactions when dragging is
   * beyond this component's scope, hence attaching to `document` instead.
   */
  private attachMouseEvents () {
    document.addEventListener('mouseup', this.onMouseUp)
  }

  /**
   * Detaching mouseup events to the document.
   */
  private detachMouseEvents () {
    document.addEventListener('mouseup', this.onMouseUp)
  }

  private onMouseUp () {
    if (this.dragging) {
      this.$emit('edit', { type: 'drag-end' })
      this.detachMouseEvents()
    }
  }
}
