// Libraries
import { Component, Vue } from 'vue-property-decorator'

// Components
import FlowterFlowchart from '@/components/flowter-flowchart/index.vue'

// Fixtures
// It won't be used for production...
import allGraph from '../../../__fixtures__/all.json'

// Types
import {
  GraphNode, GraphEdge,
  EditingEdgeDetails, EventEditingEdge,
  Mode, EdgeType, Editing
} from '@/shared/types'

/**
 * The Flowter editor's Vue class component.
 */
@Component({
  components: {
    FlowterFlowchart
  }
})
export default class FlowterEditor extends Vue {
  /*
   * -------------------------------
   * Public data
   * -------------------------------
   */

  /**
   * The nodes to be rendered in this editor.
   * Right now it is seeded from the fixtures.
   */
  public nodes: Record<string, GraphNode> = allGraph.nodes

  /**
   * The edges to be rendered in this editor.
   * Right now it is seeded from the fixtures.
   */
  public edges: GraphEdge[] = allGraph.edges

  /**
   * The flowchart mode for the editor.
   */
  public mode: Mode = Mode.VERTICAL

  /**
   * The currently edited node id.
   */
  public editingNodeId: string = this.defaultElems.nodeId

  /**
   * Whenever the mouse is over a node, the id is saved here.
   */
  public mouseOverNodeId: string | null = null

  /**
   * The information needed when editing an edge.
   */
  public editingEdge: EditingEdgeDetails = {
    draggingType: 'from',
    from: this.defaultElems.edgeFrom,
    to: this.defaultElems.edgeTo
  }

  /**
   * Whether it's editing an edge or a node.
   */
  public editing: Editing = Editing.NONE

  /**
   * The type of the edge being rendered in the editor.
   */
  public edgeType: EdgeType = EdgeType.BENT

  /**
   * The font size for nodes and edges in the editor.
   */
  public fontSize: number = 12

  /*
   * -------------------------------
   * Public computed properties
   * -------------------------------
   */

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
   * The currently edited edge's node id from.
   */
  public get editingEdgeFromId () {
    return this.isEditingEdge
      && this.editingEdge.draggingType === 'from'
      && this.mouseOverNodeId
      ? this.mouseOverNodeId : this.editingEdge.from
  }

  /**
   * The currently edited edge's node id to.
   */
  public get editingEdgeToId () {
    return this.isEditingEdge
      && this.editingEdge.draggingType === 'to'
      && this.mouseOverNodeId
      ? this.mouseOverNodeId : this.editingEdge.to
  }

  /**
   * Disable the user select when editing.
   */
  public get flowchartStyle () {
    return {
      userSelect: this.isNotEditing ? 'auto' : 'none'
    }
  }

  /**
   * Whether it's currently editing a node.
   */
  public get isEditingNode () {
    return this.editing === Editing.NODE
  }

  /**
   * Whether it's currently editing an edge.
   */
  public get isEditingEdge () {
    return this.editing === Editing.EDGE
  }

  /**
   * Whether it's currently not editing anything.
   */
  public get isNotEditing () {
    return this.editing === Editing.NONE
  }

  /*
   * -------------------------------
   * Private computed properties
   * -------------------------------
   */

  /**
   * All the node ids in the flowchart.
   */
  private get nodeIds (): string[] {
    return Object.keys(this.nodes)
  }

  /*
   * -------------------------------
   * Public methods
   * -------------------------------
   */

  /**
   * When an edge is edited, it is handled depending on the type.
   */
  public onEditEdge (event: EventEditingEdge) {
    switch (event.type) {
      case 'drag-start': {
        if (this.editing === Editing.NONE) {
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

          this.editing = Editing.EDGE

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

          this.editing = Editing.NONE
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

        this.editing = Editing.NONE
        break
      }
      default: {
        throw new Error(`Unknown type: ${event.type}`)
      }
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
      case Editing.NODE: {
        break
      }
      case Editing.EDGE: {
        const event = { type: 'drag-end', payload: null } as EventEditingEdge
        this.onEditEdge(event)
        break
      }
      default: {
        throw new Error('Mouseup is executed while not editing anything.')
      }
    }
  }
}
