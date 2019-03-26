// Libraries
import { Prop, Component, Vue } from 'vue-property-decorator'

@Component
export default class FlowterNode extends Vue {
  @Prop({ type: String, required: true })
  public id!: string
  @Prop({ type: Number, required: true })
  public x!: number
  @Prop({ type: Number, required: true })
  public y!: number
  @Prop({ type: Number, required: true })
  public width!: number
  @Prop({ type: Number, required: true })
  public height!: number
  @Prop({ type: Number, required: true })
  public fontSize!: number
  @Prop({ type: String, required: true })
  public text!: string

  // Getters
  public get nodeStyle () {
    return {
      width: `${this.width}px`,
      height: `${this.height}px`,
      fontSize: `${this.fontSize}px`,
      lineHeight: `${this.height - (this.fontSize / 2)}px`
    }
  }
  public get containerStyle () {
    return {
      top: `${this.y}px`,
      left: `${this.x}px`
    }
  }

  // Methods
  public onClick () {
    this.$emit('click', this.id)
  }
  public onMouseOver () {
    this.$emit('mouseover', this.id)
  }
}
