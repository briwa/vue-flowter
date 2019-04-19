// Libraries
import { Prop, Component, Vue } from 'vue-property-decorator'

// Types
import { Mode, SelectionType, GraphNodeDetails } from '@/shared/types'
import { DEFAULT_BOUNDS } from '@/shared/constants'

/**
 * The Flowter node selection's Vue class component.
 *
 * This component acts as a representation of the currently
 * edited node. It takes in the `node` as the [[FlowterFlowchart.RenderedGraphNode]]
 * and `bounds` to limit the movements of the edited node.
 * It should be used alongside with [[Flowter]].
 */
@Component
export default class FlowterNodeSelection extends Vue {
  /*
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
  @Prop({ type: Object, required: true })
  public nodeDetails!: GraphNodeDetails

  /**
   * Whether the node is being edited or not.
   */
  @Prop({ type: Boolean, required: true })
  public editing!: boolean

  /*
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

  /*
   * -------------------------------
   * Public accessor/computed
   * -------------------------------
   */

  /**
   * The edited node's CSS position style.
   */
  public get containerStyle () {
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
    return {
      width: `${this.node.width}px`,
      height: `${this.node.height}px`,
      transform: `scaleX(${this.scaleX}) scaleY(${this.scaleY})`
        + `translateX(${this.translateX}px) translateY(${this.translateY}px)`
    }
  }

  /**
   * @todo: Annotate this
   */
  public get node () {
    return this.nodeDetails.node.current
  }

  /**
   * @todo: Annotate this
   */
  public get bounds () {
    const bounds = DEFAULT_BOUNDS()

    const {
      row,
      node
    } = this.nodeDetails

    const prevRow = row.prev
    const nextRow = row.next
    const prevNode = node.prev
    const nextNode = node.next
    const currentNode = node.current

    switch (this.mode) {
      case Mode.VERTICAL: {
        if (prevNode) {
          bounds.x.min = prevNode.x + prevNode.width
        } else {
          bounds.x.min = currentNode.x
        }

        if (nextNode) {
          bounds.x.max = nextNode.x
        } else {
          bounds.x.max = currentNode.x + currentNode.width
        }

        if (prevRow) {
          const prevYMax = prevRow.nodes.reduce((yMax, n) => {
            return Math.max(n.y + n.height, yMax)
          }, 0)

          bounds.y.min = prevYMax
        } else {
          bounds.y.min = 0
        }

        if (nextRow) {
          const nexYMin = nextRow.nodes.reduce((yMin, n) => {
            return Math.max(n.y, yMin)
          }, 0)

          bounds.y.max = nexYMin
        } else {
          bounds.y.max = currentNode.y + currentNode.height
        }

        break
      }
      case Mode.HORIZONTAL: {
        if (prevNode) {
          bounds.y.min = prevNode.y + prevNode.height
        } else {
          bounds.y.min = currentNode.y
        }

        if (nextNode) {
          bounds.y.max = nextNode.y
        } else {
          bounds.y.max = currentNode.y + currentNode.height
        }

        if (prevRow) {
          const prevXMax = prevRow.nodes.reduce((xMax, n) => {
            return Math.max(n.x + n.width, xMax)
          }, 0)

          bounds.x.min = prevXMax
        } else {
          bounds.x.min = 0
        }

        if (nextRow) {
          const prevXMin = nextRow.nodes.reduce((xMin, n) => {
            return Math.max(n.x, xMin)
          }, 0)

          bounds.x.max = prevXMin
        } else {
          bounds.x.max = currentNode.x + currentNode.width
        }

        break
      }
      default: {
        throw new Error(`Unknown mode: ${this.mode}`)
      }
    }

    return bounds
  }

  /*
   * -------------------------------
   * Private accessor/computed
   * -------------------------------
   */

  /**
   * Depending on the selection, a factor is used
   * to determine the direction of the selection.
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

  /*
   * -------------------------------
   * Public methods
   * -------------------------------
   */

  /**
   * When it is exiting the edited node, it should emit an event
   * to its parent, let them handle it.
   * @event
   *
   * @fires exit
   */
  public onClickExit () {
    this.$emit('exit')
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

  /*
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
        const isWithinXMin = this.node.x + deltaX >= this.bounds.x.min
        const isWithinXMax = this.node.x + this.node.width + deltaX <= this.bounds.x.max

        if (isWithinXMin && isWithinXMax) {
          this.translateX = deltaX
        }

        const deltaY = e.pageY - this.mouseDownY
        const isWithinYMin = this.node.y + deltaY >= this.bounds.y.min
        const isWithinYMax = this.node.y + this.node.height + deltaY <= this.bounds.y.max

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
        if (this.scaleX !== 1) {
          this.$emit('update', {
            id: this.node.id,
            type: 'width',
            value: Math.abs(this.node.width * this.scaleX)
          })
        }

        if (this.scaleY !== 1) {
          this.$emit('update', {
            id: this.node.id,
            type: 'height',
            value: Math.abs(this.node.height * this.scaleY)
          })
        }

        // Reset both scales to the default value
        this.scaleX = 1
        this.scaleY = 1
        break
      }
      case SelectionType.MOVE: {
        if (this.translateX !== 0) {
          this.$emit('update', {
            id: this.node.id,
            type: 'x',
            value: this.node.x + this.translateX
          })
        }

        if (this.translateY !== 0) {
          this.$emit('update', {
            id: this.node.id,
            type: 'y',
            value: this.node.y + this.translateY
          })
        }

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
