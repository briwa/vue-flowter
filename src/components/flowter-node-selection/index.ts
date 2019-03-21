import { Component, Vue, Prop, Watch } from 'vue-property-decorator'

import { RenderedGraphNode } from '@/types'

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

  // Data
  private mouseDownX: number = 0
  private mouseDownY: number = 0
  private scaleX: number = 1
  private scaleY: number = 1
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
    }
  }
  private onMouseUp () {
    this.detachMouseEvents()

    if (this.scaleX !== 1 || this.scaleY !== 1) {
      this.$emit('resize', {
        id: this.node.id,
        width: Math.abs(this.node.width * this.scaleX),
        height: Math.abs(this.node.height * this.scaleY)
      })
    }

    this.scaleX = 1
    this.scaleY = 1
    this.selectionType = SelectionType.DEFAULT
  }
}

