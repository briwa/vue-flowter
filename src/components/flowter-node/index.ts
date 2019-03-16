import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class FlowterNode extends Vue {
  @Prop({ type: String, required: true })
  public id!: string
  @Prop({ type: String, default: '' })
  public text!: string
  @Prop({ type: Number, default: 0 })
  public top!: number
  @Prop({ type: Number, default: 0 })
  public left!: number
  @Prop({ type: Number, default: 100 })
  public width!: number
  @Prop({ type: Number, default: 50 })
  public height!: number
  @Prop({ type: Number, default: 12 })
  public fontSize!: number

  public get nodeStyle () {
    return {
      width: `${this.width}px`,
      height: `${this.height}px`,
      fontSize: `${this.fontSize}px`,
      lineHeight: `${this.height - (this.fontSize / 2)}px`,
      overflow: 'hidden'
    }
  }
  public get containerStyle () {
    return {
      top: `${this.top}px`,
      left: `${this.left}px`
    }
  }
}
