// Libraries
import { Prop, Component, Vue } from 'vue-property-decorator'

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
   */
  @Prop({ type: String, required: true })
  public id!: string

  /**
   * X position of the node.
   *
   * This should be derived from [[Flowter.nodeLists]] members.
   */
  @Prop({ type: Number, required: true })
  public x!: number

  /**
   * Y position of the node.
   *
   * This should be derived from [[Flowter.nodeLists]] members.
   */
  @Prop({ type: Number, required: true })
  public y!: number

  /**
   * Width of the node.
   *
   * This should be derived from [[Flowter.nodeLists]] members.
   */
  @Prop({ type: Number, required: true })
  public width!: number

  /**
   * Height of the node.
   *
   * This should be derived from [[Flowter.nodeLists]] members.
   */
  @Prop({ type: Number, required: true })
  public height!: number

  /**
   * The node's text.
   *
   * This should be derived from [[Flowter.nodeLists]] members.
   */
  @Prop({ type: String, required: true })
  public text!: string

  /**
   * The node's font size.
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
      lineHeight: `${this.height - (this.fontSize / 2)}px`
    }
  }
  /**
   * The node's container position style.
   *
   * This position is absolute to its parent, [[Flowter]].
   */
  public get containerStyle () {
    return {
      top: `${this.y}px`,
      left: `${this.x}px`
    }
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
