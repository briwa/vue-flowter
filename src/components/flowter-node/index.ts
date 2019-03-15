import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class FlowterNode extends Vue {
  @Prop({ type: Number, required: true })
  public id!: number
  @Prop({ type: String, default: '' })
  public text!: string
  @Prop({ type: Number, default: 0 })
  public top!: number
  @Prop({ type: Number, default: 0 })
  public left!: number

  // Data
  public width: number = 100
  public height: number = 50
  public fontSize: number = 12

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

  public get orientPoints () {
    return {
      n: [this.width / 2, 0],
      w: [this.width / 2, this.height / 2],
      e: [this.width, this.height / 2],
      s: [this.width / 2, this.height]
    }
  }
}
