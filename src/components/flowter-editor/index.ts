// Libraries
import { Component, Vue } from 'vue-property-decorator'

// Components
import FlowterFlowchart from '@/components/flowter-flowchart/index.vue'
import FlowterNodeSelection from '@/components/flowter-node-selection/index.vue'
import FlowterEdgeSelection from '@/components/flowter-edge-selection/index.vue'

// Fixtrues
// It won't be used for production...
import allGraph from '../../../__fixtures__/all.json'

// Types
import {
  GraphNode, GraphEdge,
  EditingEdgeDetails, EventEditingEdge,
  Mode, EventEditingNode, EdgeType
} from '@/shared/types'

/**
 * The Flowter editor's Vue class component.
 */
@Component({
  components: {
    FlowterFlowchart,
    FlowterNodeSelection,
    FlowterEdgeSelection
  }
})
export default class FlowterEditor extends Vue {
  public nodes: Record<string, GraphNode> = allGraph.nodes
  public edges: GraphEdge[] = allGraph.edges
  public mode: Mode = Mode.VERTICAL

  /**
   * @todo Comment this
   */
  public editingNodeId: string = this.defaultElems.nodeId

  /**
   * @todo Comment this
   */
  public editingEdge: EditingEdgeDetails = {
    draggingType: 'from',
    from: this.defaultElems.edgeFrom,
    to: this.defaultElems.edgeTo
  }

  /**
   * @todo Comment this
   */
  public editing: string | null = null

  /**
   * @todo Comment this
   */
  public edgeType: EdgeType = EdgeType.BENT

  /**
   * @todo Comment this
   */
  public fontSize: number = 12


  /**
   * The default values for the flowchart elements.
   *
   * This is basically the first node and the first edge.
   */
  public get defaultElems (): Record<string, string> {
    return {
      nodeId: this.nodeIds[0],
      edgeFrom: this.edges[0].from,
      edgeTo: this.edges[0].to
    }
  }

  /**
   * @todo Annotate
   */
  public get editingEdgeFromId () {
    return this.editing === 'edge'
      && this.editingEdge.draggingType === 'from'
      ? this.editingNodeId : this.editingEdge.from
  }

  /**
   * @todo Annotate
   */
  public get editingEdgeToId () {
    return this.editing === 'edge'
      && this.editingEdge.draggingType === 'to'
      ? this.editingNodeId : this.editingEdge.to
  }

  /**
   * @todo Annotate
   */
  public get flowchartStyle () {
    return {
      userSelect: this.editing ? 'none' : 'auto'
    }
  }

  /**
   * All the node ids in the flowchart.
   */
  private get nodeIds (): string[] {
    return Object.keys(this.nodes)
  }

  /*
   * -------------------------------
   * Public methods - events
   * -------------------------------
   */

  /**
   * @todo Comment this.
   */
  public onEditNode (event: EventEditingNode) {
    switch (event.type) {
      case 'hover-start': {
        if (this.editing === 'node') {
          break
        }

        this.editingNodeId = event.payload
        break
      }
      case 'hover-end': {
        // Do nothing, for now...
        break
      }
      case 'edit-start': {
        this.editingNodeId = event.payload
        this.editing = 'node'
        break
      }
      case 'edit-end': {
        this.editing = null
        break
      }
      case 'update': {
        // @todo: type this
        const payload = event.payload as any
        const editedNode = this.nodes[payload.id]
        this.$set(editedNode, payload.type, payload.value)
        break
      }
      case 'drag-end': {
        break
      }
      default: {
        throw new Error(`Unknown type: ${event.type}`)
      }
    }
  }

  /**
   * @todo Comment this.
   */
  public onEditEdge (event: EventEditingEdge) {
    switch (event.type) {
      case 'drag-start': {
        if (!this.editing) {
          const payload = event.payload as EventEditingEdge<'from-to'>['payload']
          this.editingEdge.from = payload.from
          this.editingEdge.to = payload.to
          this.editingEdge.draggingType = payload.draggingType

          switch (payload.draggingType) {
            case 'from': {
              this.editingNodeId = payload.from
              break
            }
            case 'to': {
              this.editingNodeId = payload.to
              break
            }
            default: {
              throw new Error(`Unknown dragging type: ${payload.draggingType}`)
              break
            }
          }

          this.editing = 'edge'

          // Attach global mouse events to detect dragging
          this.attachMouseEvents()
        }
        break
      }
      case 'drag-end': {
        this.detachMouseEvents()

        const newFromId = this.editingEdgeFromId
        const newToId = this.editingEdgeToId

        if (this.getEdge(newFromId, newToId)) {
          // @todo Use a proper notification system
          // tslint:disable-next-line
          console.warn('There is already an edge for that')

          this.editing = null
          break
        }

        const edge = this.getEdge(this.editingEdge.from, this.editingEdge.to)
        if (!edge) {
          throw new Error(`Unable to find edge from list of edges with `
            + `from id: ${this.editingEdge.from} and `
            + `to id: ${this.editingEdge.to}.`)
        }

        this.$set(edge, 'from', newFromId)
        this.$set(edge, 'to', newToId)

        this.editing = null
        break
      }
      default: {
        throw new Error(`Unknown type: ${event.type}`)
      }
    }
  }


  /**
   * The style of the edge knob being dragged in/out.
   */
  public knobStyle (position: { x: number, y: number }) {
    return {
      left: `${position.x - 5}px`,
      top: `${position.y - 5}px`
    }
  }

  /**
   * Get the edge given the from and to id.
   */
  private getEdge (from: string, to: string) {
    return this.edges.find((edge) => {
      return edge.from === from && edge.to === to
    })
  }


  /*
   * -------------------------------
   * Public methods
   * -------------------------------
   */

  /**
   * Attaching mouseup events to the document.
   *
   * This is because the interactions when dragging is
   * beyond this component's scope, hence attaching to `document` instead.
   */
  private attachMouseEvents () {
    document.addEventListener('mouseup', this.onMouseUp)
  }

  /**
   * Detaching mouseup events to the document.
   */
  private detachMouseEvents () {
    document.removeEventListener('mouseup', this.onMouseUp)
  }

  /**
   * When it is no longer dragging, this should do
   * the callback depending on whether it is editing node or edge.
   */
  private onMouseUp () {
    switch (this.editing) {
      case 'node': {
        break
      }
      case 'edge': {
        // @todo: type this
        const event = { type: 'drag-end', payload: null } as any
        this.onEditEdge(event)
        break
      }
      default: {
        throw new Error('Mouseup is executed while not editing anything.')
      }
    }
  }
}
