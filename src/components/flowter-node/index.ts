// Libraries
import { Prop, Component, Vue } from 'vue-property-decorator'
import { NodeSymbol } from '@/shared/types'
import { DEFAULT_STROKE_WIDTH, NODE_SMALLER_RATIO } from '@/shared/constants'

/**
 * The Flowter node's Vue class component.
 *
 * This component renders the node given the position and size.
 * This component can be rendered on its own, however it is
 * most useful when rendered together with its parent, [[Flowter]].
 */
@Component
export default class FlowterNode extends Vue {
  /**
   * @hidden
   * -------------------------------
   * Props
   * -------------------------------
   */

  /**
   * Id of the node.
   *
   * This is mainly used as an identifier
   * when sending out events to the parent.
   * This is derived from [[RenderedGraphNode.id]]'s key
   * as part of [[FlowterNode.nodeLists]].
   */
  @Prop({ type: String, required: true })
  public id!: string

  /**
   * X position of the node.
   *
   * This is derived from [[RenderedGraphNode.x]]
   * as part of [[FlowterNode.nodeLists]].
   */
  @Prop({ type: Number, required: true })
  public x!: number

  /**
   * Y position of the node.
   *
   * This is derived from [[RenderedGraphNode.y]]
   * as part of [[FlowterNode.nodeLists]].
   */
  @Prop({ type: Number, required: true })
  public y!: number

  /**
   * Width of the node.
   *
   * This is derived from [[RenderedGraphNode.width]]
   * as part of [[FlowterNode.nodeLists]].
   */
  @Prop({ type: Number, required: true })
  public width!: number

  /**
   * Height of the node.
   *
   * This is derived from [[RenderedGraphNode.height]]
   * as part of [[FlowterNode.nodeLists]].
   */
  @Prop({ type: Number, required: true })
  public height!: number

  /**
   * Node symbol.
   *
   * This is derived from [[RenderedGraphNode.symbol]]
   * as part of [[FlowterNode.nodeLists]].
   */
  @Prop({ type: String, required: true })
  public symbol!: NodeSymbol

  /**
   * Node background color.
   *
   * This is derived from [[RenderedGraphNode.bgcolor]]
   * as part of [[FlowterNode.nodeLists]].
   */
  @Prop({ type: String, required: true })
  public bgcolor!: string

  /**
   * Node's text.
   *
   * This is derived from [[RenderedGraphNode.text]]
   * as part of [[FlowterNode.nodeLists]].
   */
  @Prop({ type: String, required: true })
  public text!: string

  /**
   * Node's font size.
   *
   * This follows [[Flowter.fontSize]].
   */
  @Prop({ type: Number, required: true })
  public fontSize!: number

  /**
   * @hidden
   * -------------------------------
   * Public accessor/computed
   * -------------------------------
   */

  /**
   * The node's CSS style.
   */
  public get nodeStyle (): Record<string, string> {
    return {
      width: `${this.width}px`,
      height: `${this.height}px`,
      fontSize: `${this.fontSize}px`,
      lineHeight: `${this.height - (this.fontSize / 2)}px`,
      top: `${this.y}px`,
      left: `${this.x}px`
    }
  }

  /**
   * The node's svg viewbox.
   *
   * This is solely based on node's [[width]] and [[height]].
   */
  public get viewBox (): string {
    return `0 0 ${this.width} ${this.height}`
  }

  /**
   * Whether a node has to be rendered as an ellipse or not.
   *
   * If it's an ellipse, it will be rendered as `ellipse`,
   * otherwise `path`.
   */
  public get isNodeEllipse (): boolean {
    return this.symbol === NodeSymbol.ELLIPSE
  }

  /**
   * The node's symbol as the SVG `path`.
   *
   * This is derived from [[RenderedGraphNode.symbol]] value.
   */
  public get nodePoints (): string | null {
    // These calcs only matter if it's not an ellipse.
    if (this.isNodeEllipse) {
      return null
    }

    // Some symbols are a little smaller than the
    // actual node width.
    const offset = NODE_SMALLER_RATIO * this.width

    switch (this.symbol) {
      case NodeSymbol.RECTANGLE: {
        return `M ${this.margin} ${this.margin} `
          + `H ${this.width - this.margin} V ${this.height - this.margin} `
          + `H ${this.margin} Z`
      }
      case NodeSymbol.PARALLELOGRAM: {
        // Parallelogram is basically rectangle
        // with added offset for start and the finish
        return `M ${this.margin + offset} ${this.margin} `
          + `H ${this.width - this.margin} L ${this.width - (this.margin + offset)} ${this.height - this.margin} `
          + `H ${this.margin} Z`
      }
      case NodeSymbol.RHOMBUS: {
        return `M ${this.halfWidth} ${this.margin} `
          + `L ${this.width - this.margin} ${this.halfHeight} `
          + `L ${this.halfWidth} ${this.height - this.margin} `
          + `L ${this.margin} ${this.halfHeight} Z`
      }
      case NodeSymbol.ROUNDED_RECTANGLE: {
        // The start of a rounded rectangle is going to have
        // the same offset as parallelogram. The arc
        // x radius will be the offset.
        const startArcX = this.margin + offset
        const endArcX = this.width - startArcX

        const rX = startArcX
        const rY = this.halfHeight
        return `M ${startArcX} ${this.margin} `
          + `H ${endArcX} `
          + `A ${rX} ${rY} 0 0 1 ${endArcX} ${this.height - this.margin} `
          + `H ${startArcX} `
          + `A ${rX} ${rY} 0 0 1 ${startArcX} ${this.margin} Z`
      }
      default: {
        throw new Error(`Unknown symbol: ${this.symbol}`)
      }
    }
  }

  /**
   * Half of the node's width.
   */
  public get halfWidth () {
    return this.width / 2
  }

  /**
   * Half of the node's height.
   */
  public get halfHeight () {
    return this.height / 2
  }

  /**
   * The center of the node, with margin taken into account.
   */
  public get nodeCenter () {
    return {
      x: (this.halfWidth) - this.margin,
      y: (this.halfHeight) - this.margin
    }
  }

  /**
   * The margin to account for the stroke width.
   *
   * This is to make the edge always renders inside the
   * container, regardless of the stroke width.
   */
  public get margin () {
    return DEFAULT_STROKE_WIDTH / 2
  }

  /**
   * The default stroke width.
   * @todo This could be configurable.
   */
  public get strokeWidth () {
    return DEFAULT_STROKE_WIDTH
  }

  /**
   * @hidden
   * -------------------------------
   * Public methods
   * -------------------------------
   */

  /**
   * When a node is clicked, this emits the id.
   * @event
   *
   * @fires click
   */
  public onClick () {
    this.$emit('click', this.id)
  }

  /**
   * @todo This is currently unused, handle this event properly.
   *
   * When a mouse is over the node, this emits the id.
   * @event
   *
   * @fires mouseover
   */
  public onMouseOver () {
    this.$emit('mouseover', this.id)
  }
}
