import { Prop, Component, Vue } from 'vue-property-decorator'
import FlowterEdge from '@/components/flowter-edge/index.vue'
import FlowterNode from '@/components/flowter-node/index.vue'

@Component({
  components: {
    FlowterEdge,
    FlowterNode
  }
})
export default class App extends Vue {
  @Prop({ type: Array, default: () => [] })
  public nodes!: any[] // TODO: type this

  @Prop({ type: Array, default: () => [] })
  public edges!: any[] // TODO: type this
}
