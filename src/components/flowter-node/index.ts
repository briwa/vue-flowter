import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class FlowterNode extends Vue {
  @Prop({ type: Number, required: true })
  public id!: number

  @Prop({ type: String, default: '' })
  public text!: string

  // Data
  public width: number = 100
  public height: number = 100

  public get nodeStyle () {
    return `width: ${this.width}px; height: ${this.height}px`
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
