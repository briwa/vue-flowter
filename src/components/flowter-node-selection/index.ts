// Libraries
import { Prop, Component, Vue } from 'vue-property-decorator'

// Types
import { RenderedGraphNode, Mode, Bounds, SelectionType } from '@/shared/types'
import { DEFAULT_BOUNDS } from '@/shared/constants'

/**
 * The Flowter node selection's Vue class component.
 *
 * This component acts as a representation of the currently
 * edited node. It takes in the `node` as the [[Flowter.RenderedGraphNode]]
 * and `bounds` to limit the movements of the edited node.
 * It should be used alongside with [[Flowter]].
 */
@Component
export default class FlowterNodeSelection extends Vue {
  /**
   * @hidden
   * -------------------------------
   * Props
   * -------------------------------
   */

  /**
   * The flowchart mode.
   *
   * This is used to detect the movements, since it is only
   * allowed to resize certain directions on certain modes.
   */
  @Prop({ type: String, required: true })
  public mode!: Mode

  /**
   * Node being edited.
   *
   * When no node is being edited, it is set to `null`
   * so that it doesn't have to render/compute anything.
   */
  @Prop({ type: Object, default: null })
  public node!: RenderedGraphNode

  /**
   * The bounds allowed to edit node.
   *
   * When no node is being edited, it is set to [[DEFAULT_BOUNDS]].
   */
  @Prop({ type: Object, default: DEFAULT_BOUNDS() })
  public bounds!: Bounds

  /**
   * @hidden
   * -------------------------------
   * Private data
   * -------------------------------
   */

  /**
   * The mousedown's X position recored for calculation purpose.
   */
  private mouseDownX: number = 0

  /**
   * The mousedown's Y position recored for calculation purpose.
   */
  private mouseDownY: number = 0

  /**
   * The node's scale X ratio as the new node size.
   */
  private scaleX: number = 1

  /**
   * The node's scale Y ratio as the new node size.
   */
  private scaleY: number = 1

  /**
   * The node's translate X value as the new node position.
   */
  private translateX: number = 0

  /**
   * The node's translate Y value as the new node position.
   */
  private translateY: number = 0

  /**
   * The edit selection type (either resizing or moving).
   */
  private selectionType: SelectionType = SelectionType.DEFAULT

  /**
   * @hidden
   * -------------------------------
   * Public accessor/computed
   * -------------------------------
   */

  /**
   * The edited node's CSS position style.
   */
  public get containerStyle () {
    if (!this.node) {
      return null
    }

    return {
      top: `${this.node.y}px`,
      left: `${this.node.x}px`
    }
  }

  /**
   * The edited node's overlay style.
   *
   * This is rendered based on the currently edited properties,
   * whether it is being moved or resized.
   */
  public get overlayStyle () {
    if (!this.node) {
      return null
    }

    return {
      width: `${this.node.width}px`,
      height: `${this.node.height}px`,
      transform: `scaleX(${this.scaleX}) scaleY(${this.scaleY})`
        + `translateX(${this.translateX}px) translateY(${this.translateY}px)`
    }
  }

  /**
   * @hidden
   * -------------------------------
   * Private accessor/computed
   * -------------------------------
   */

  /**
   * Depending on the selection, a factor is
   * used to determine the direction of the selection.
   */
  private get deltaDirection () {
    switch (this.selectionType) {
      case SelectionType.RESIZE_N:
      case SelectionType.RESIZE_W: {
        return -1
      }
      default: {
        return 1
      }
    }
  }

  /**
   * @hidden
   * -------------------------------
   * Public methods
   * -------------------------------
   */

  /**
   * When it is exiting the edited node, it should emit an event
   * to its parent, let them handle it.
   * @event
   *
   * @fires exit-editing
   */
  public onClickExit () {
    this.$emit('exit-editing')
  }

  /**
   * When the edited node is being clicked,
   * this will record its original mouse position and the selection type.
   *
   * A side effect is being run, which is attaching events to the document,
   * since user can simply drag even outside of the flowchart element and
   * it should still be detected.
   */
  public onMouseDown (e: MouseEvent, selectionType: SelectionType) {
    this.mouseDownX = e.pageX
    this.mouseDownY = e.pageY
    this.selectionType = selectionType

    this.attachMouseEvents()
  }

  /**
   * @hidden
   * -------------------------------
   * Private methods
   * -------------------------------
   */

  /**
   * Attaching mousemove and mouseup events to the document.
   */
  private attachMouseEvents () {
    document.addEventListener('mousemove', this.onMouseMove)
    document.addEventListener('mouseup', this.onMouseUp)
  }

  /**
   * Detaching mousemove and mouseup events to the document.
   */
  private detachMouseEvents () {
    document.removeEventListener('mousemove', this.onMouseMove)
    document.removeEventListener('mouseup', this.onMouseUp)
  }

  /**
   * When the mouse is moved, this should handle them based on
   * the [[SelectionType]].
   *
   * For resizing, it is only either resize horizontally or vertically.
   * The node cannot be resized both at the same time (for now).
   *
   * For moving, it can be moved freely as long as it is within the [[bounds]].
   */
  private onMouseMove (e: MouseEvent) {
    switch (this.selectionType) {
      case SelectionType.RESIZE_N:
      case SelectionType.RESIZE_S: {
        const deltaY = (e.pageY - this.mouseDownY) * this.deltaDirection
        this.scaleY =  (this.node.height + deltaY) / this.node.height
        break
      }
      case SelectionType.RESIZE_E:
      case SelectionType.RESIZE_W: {
        const deltaX = (e.pageX - this.mouseDownX) * this.deltaDirection
        this.scaleX = (this.node.width + deltaX) / this.node.width
        break
      }
      case SelectionType.MOVE: {
        // Check if the mouse is within the X/Y range
        // Also, allow translating when
        // the boundaries itself is 0 (i.e. at the edge or unset)
        const deltaX = e.pageX - this.mouseDownX
        const isWithinXMin = !this.bounds.x.min || this.node.x + deltaX >= this.bounds.x.min
        const isWithinXMax = !this.bounds.x.max || this.node.x + this.node.width + deltaX <= this.bounds.x.max

        if (isWithinXMin && isWithinXMax) {
          this.translateX = deltaX
        }

        const deltaY = e.pageY - this.mouseDownY
        const isWithinYMin = !this.bounds.y.min || this.node.y + deltaY >= this.bounds.y.min
        const isWithinYMax = !this.bounds.y.max || this.node.y + this.node.height + deltaY <= this.bounds.y.max

        if (isWithinYMin && isWithinYMax) {
          this.translateY = deltaY
        }
        break
      }
      default: {
        throw new Error(`Unknown selection type: ${this.selectionType}`)
      }
    }
  }

  /**
   * When the mouse is released, this should emit the event based on the
   * interactions. It is up to the parent on what to do with the event.
   *
   * This should also detach all the events attached on [[onMouseDown]].
   * @event
   *
   * @fires resize
   * @fires move
   */
  private onMouseUp () {
    this.detachMouseEvents()

    switch (this.selectionType) {
      case SelectionType.RESIZE_N:
      case SelectionType.RESIZE_S:
      case SelectionType.RESIZE_E:
      case SelectionType.RESIZE_W: {
        const payload: { id: string, width?: number, height?: number } = {
          id: this.node.id
        }

        if (this.scaleX !== 1) {
          payload.width = Math.abs(this.node.width * this.scaleX)
        } else if (this.scaleY !== 1) {
          payload.height = Math.abs(this.node.height * this.scaleY)
        }

        this.$emit('resize', payload)

        // Reset both scales to the default value
        this.scaleX = 1
        this.scaleY = 1
        break
      }
      case SelectionType.MOVE: {
        const payload: { id: string, x?: number, y?: number } = {
          id: this.node.id
        }

        if (this.translateX !== 0) {
          payload.x = this.node.x + this.translateX
        }

        if (this.translateY !== 0) {
          payload.y = this.node.y + this.translateY
        }

        this.$emit('move', payload)

        // Reset both translations to the default value
        this.translateX = 0
        this.translateY = 0
        break
      }
      default: {
        throw new Error(`Unknown selection type: ${this.selectionType}`)
      }
    }

    // Also reset the selection type
    this.selectionType = SelectionType.DEFAULT
  }
}
