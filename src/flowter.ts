import { Prop, Component, Vue } from 'vue-property-decorator'
import FlowterEdge from '@/components/flowter-edge/index.vue'
import FlowterNode from '@/components/flowter-node/index.vue'

interface GraphNode {
  id: number | string
  text: string
}

interface GraphEdge {
  from: number | string
  to: number | string
  option?: string
}

@Component({
  components: {
    FlowterEdge,
    FlowterNode
  }
})
export default class Flowter extends Vue {
  // @Prop({ type: Array, default: () => [] })
  // public nodes!: any[] // TODO: type this
  // @Prop({ type: Array, default: () => [] })
  // public edges!: any[] // TODO: type this
  @Prop({ type: Number, default: 500 })
  public width!: number
  @Prop({ type: Number, default: 500 })
  public height!: number

  // Data
  public nodes: GraphNode[] = [
    { id: 1, text: 'First' },
    { id: 2, text: 'Second' },
    { id: 3, text: 'Third?' },
    { id: 4, text: 'You said No' },
    { id: 5, text: 'You said Yes' },
    { id: 6, text: 'Very well then, bye' }
  ]
  public edges: GraphEdge[] = [
    { from: 1, to: 2 },
    { from: 2, to: 3 },
    { from: 3, to: 4, option: 'No' },
    { from: 3, to: 5, option: 'Yes' },
    { from: 4, to: 6 },
    { from: 5, to: 6 }
  ]
  public expected: GraphNode[][] = [
    [{ id: 1, text: 'First' }],
    [{ id: 2, text: 'Second' }],
    [{ id: 3, text: 'Third?' }],
    [{ id: 4, text: 'You said No' }, { id: 5, text: 'You said Yes' }],
    [{ id: 6, text: 'Very well then, bye' }]
  ]

  // Computed
  public get containerStyle () {
    return {
      width: `${this.width}px`,
      height: `${this.height}px`
    }
  }
}
