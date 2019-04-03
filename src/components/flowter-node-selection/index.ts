// Libraries
import { Prop, Component, Vue } from 'vue-property-decorator'

// Types
import { RenderedGraphNode, Mode, Bounds } from '@/shared/types'
import { DEFAULT_BOUNDS } from '@/shared/constants'

enum SelectionType {
  RESIZE_N = 'resize-n',
  RESIZE_S = 'resize-s',
  RESIZE_W = 'resize-w',
  RESIZE_E = 'resize-e',
  MOVE = 'move',
  DEFAULT = 'default'
}

@Component
export default class FlowterNodeSelection extends Vue {
  @Prop({ type: Object, default: null })
  public node!: RenderedGraphNode
  @Prop({ type: String, default: Mode.VERTICAL })
  public mode!: Mode
  @Prop({ type: Object, default: DEFAULT_BOUNDS() })
  public bounds!: Bounds

  // Data
  private mouseDownX: number = 0
  private mouseDownY: number = 0
  private scaleX: number = 1
  private scaleY: number = 1
  private translateX: number = 0
  private translateY: number = 0
  private selectionType: SelectionType = SelectionType.DEFAULT

  // Getters
  public get containerStyle () {
    if (!this.node) {
      return null
    }

    return {
      top: `${this.node.y}px`,
      left: `${this.node.x}px`
    }
  }
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

  // Methods
  public onMouseDown (e: MouseEvent, selectionType: SelectionType) {
    this.mouseDownX = e.pageX
    this.mouseDownY = e.pageY
    this.selectionType = selectionType

    this.attachMouseEvents()
  }
  public onClick () {
    this.$emit('exit-editing')
  }
  private attachMouseEvents () {
    document.addEventListener('mousemove', this.onMouseMove)
    document.addEventListener('mouseup', this.onMouseUp)
  }
  private detachMouseEvents () {
    document.removeEventListener('mousemove', this.onMouseMove)
    document.removeEventListener('mouseup', this.onMouseUp)
  }
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
