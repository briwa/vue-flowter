// Libraries
import { Component, Prop, Vue } from 'vue-property-decorator'

// Constants
import { DEFAULT_KNOB_SIZE, DEFAULT_STROKE_WIDTH } from '@/shared/constants'

/**
 * The Flowter knob's Vue class component.
 */
@Component
export default class FlowterKnob extends Vue {
  /*
   * -------------------------------
   * Props
   * -------------------------------
   */

  /**
   * The x position of the knob.
   */
  @Prop({ type: Number, required: true })
  public x!: number

  /**
   * The y position of the knob.
   */
  @Prop({ type: Number, required: true })
  public y!: number

  /**
   * The size of the knob.
   */
  @Prop({ type: Number, default: DEFAULT_KNOB_SIZE })
  public size!: number

  /*
   * -------------------------------
   * Public acessors/computed
   * -------------------------------
   */

  /**
   * The style of the knob.
   */
  public get knobStyle () {
    return {
      left: `${this.x - ((this.size - this.strokeWidth) / 2)}px`,
      top: `${this.y - ((this.size - this.strokeWidth) / 2)}px`,
      width: `${this.size - this.strokeWidth}px`,
      height: `${this.size - this.strokeWidth}px`
    }
  }

  /**
   * The stroke width of the knob.
   */
  public get strokeWidth () {
    return DEFAULT_STROKE_WIDTH
  }

  /**
   * The viewbox of the knob.
   */
  public get viewBox () {
    return `0 0 ${this.size * 2} ${this.size * 2}`
  }
}
