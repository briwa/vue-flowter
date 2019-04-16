// Libraries
import { Component, Vue } from 'vue-property-decorator'

// Parent
import FlowterFlowchartClass from '@/components/flowter-flowchart/index'

// Constants
import { DEFAULT_BOUNDS } from '../shared/constants'

// Types
import {
  EditingEdgeDetails, EventEditingEdge,
  Mode, EditingNodeDetails, EventEditingNode
} from '../shared/types'

@Component
export default class FlowterEventManagerMixin extends Vue {
  /*
   * -------------------------------
   * Properties from Flowter flowchart component
   * -------------------------------
   *
   * By right, mixins should have access to its parent's properties,
   * however I can't seem to find a way to inherit its types properly.
   * @todo: Find a better way to do this, maybe in Vue 3??
   */
  public renderedNodes!: FlowterFlowchartClass['renderedNodes']
  public mode!: FlowterFlowchartClass['mode']
  public nodes!: FlowterFlowchartClass['nodes']
  public edges!: FlowterFlowchartClass['edges']

  /**
   * @todo Comment this
   */
  public editingEdgeDetails: EditingEdgeDetails = {
    showing: false,
    editing: false,
    dragging: false,
    draggingNode: 'from',
    from: this.defaultElems.edgeFrom,
    to: this.defaultElems.edgeTo
  }

  /**
   * @todo Comment this
   */
  public editingNodeDetails: EditingNodeDetails = {
    showing: false,
    editing: false,
    id: this.defaultElems.nodeId
  }

  /**
   * @todo Comment this
   */
  public get editingNodeBounds () {
    const { id, editing } = this.editingNodeDetails
    const bounds = DEFAULT_BOUNDS()

    if (!editing) {
      return bounds
    }

    const {
      row,
      node
    } = this.renderedNodes[id]

    const prevRow = row.prev
    const nextRow = row.next
    const prevNode = node.prev
    const nextNode = node.next

    switch (this.mode) {
      case Mode.VERTICAL: {
        if (prevNode) {
          bounds.x.min = prevNode.x + prevNode.width
        }

        if (nextNode) {
          bounds.x.max = nextNode.x
        }

        if (prevRow) {
          const prevYMax = prevRow.nodes.reduce((yMax, n) => {
            return Math.max(n.y + n.height, yMax)
          }, 0)

          bounds.y.min = prevYMax
        } else {
          bounds.y.min = 0
        }

        if (nextRow) {
          const nexYMin = nextRow.nodes.reduce((yMin, n) => {
            return Math.max(n.y, yMin)
          }, 0)

          bounds.y.max = nexYMin
        }

        break
      }
      case Mode.HORIZONTAL: {
        if (prevNode) {
          bounds.y.min = prevNode.y + prevNode.height
        }

        if (nextNode) {
          bounds.y.max = nextNode.y
        }

        if (prevRow) {
          const prevXMax = prevRow.nodes.reduce((xMax, n) => {
            return Math.max(n.x + n.width, xMax)
          }, 0)

          bounds.x.min = prevXMax
        } else {
          bounds.x.min = 0
        }

        if (nextRow) {
          const prevXMin = nextRow.nodes.reduce((xMin, n) => {
            return Math.max(n.x, xMin)
          }, 0)

          bounds.x.max = prevXMin
        }

        break
      }
      default: {
        throw new Error(`Unknown mode: ${this.mode}`)
      }
    }

    return bounds
  }

  /**
   * @todo Comment this
   */
  public get editingNode () {
    return this.renderedNodes[this.editingNodeDetails.id].node
  }

  /**
   * @todo Comment this
   */
  public get editingEdgeFrom () {
    const fromId = this.editingEdgeDetails.dragging
      && this.editingEdgeDetails.draggingNode === 'from'
      && this.editingNodeDetails.id
      ? this.editingNodeDetails.id : this.editingEdgeDetails.from

    return this.renderedNodes[fromId]
  }

  /**
   * @todo Comment this
   */
  public get editingEdgeTo () {
    const toId = this.editingEdgeDetails.dragging
      && this.editingEdgeDetails.draggingNode === 'to'
      && this.editingNodeDetails.id
      ? this.editingNodeDetails.id : this.editingEdgeDetails.to

    return this.renderedNodes[toId]
  }


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
   * All the node ids in the flowchart.
   */
  private get nodeIds (): string[] {
    return Object.keys(this.nodes)
  }

  /*
   * -------------------------------
   * Lifecycles
   * -------------------------------
   */

  /**
   * Since the idea is to make it decoupled
   * with the flowchart component, listen to the
   * events on mounted instead.
   */
  public mounted () {
    this.$on('node-click', (event: string) => this.onEditNode({ type: 'edit-start', payload: event }))
    this.$on('node-edit-exit', (event: string) => this.onEditNode({ type: 'edit-end', payload: event }))
    this.$on('node-mouseenter', (event: string) => this.onEditNode({ type: 'hover-start', payload: event }))
    this.$on('node-mouseleave', (event: string) => this.onEditNode({ type: 'hover-end', payload: event }))
  }

  /*
   * -------------------------------
   * Public methods - events
   * -------------------------------
   */

  /**
   * @todo Comment this.
   */
  public onEditEdge (event: EventEditingEdge) {
    switch (event.type) {
      case 'hover-start': {
        if (this.editingEdgeDetails.editing) {
          return false
        }

        const payload = event.payload as EventEditingEdge<'fromTo'>['payload']

        this.editingEdgeDetails.from = payload.from
        this.editingEdgeDetails.to = payload.to
        this.editingEdgeDetails.showing = true
        break
      }
      case 'hover-end': {
        if (this.editingEdgeDetails.editing) {
          return false
        }

        this.editingEdgeDetails.showing = false
        break
      }
      case 'edit-start': {
        this.editingEdgeDetails.editing = true
        const payload = event.payload as EventEditingEdge<'fromTo'>['payload']

        this.editingEdgeDetails.from = payload.from
        this.editingEdgeDetails.to = payload.to
        break
      }
      case 'edit-end': {
        this.editingEdgeDetails.editing = false
        this.editingEdgeDetails.showing = false
        this.editingEdgeDetails.dragging = false
        break
      }
      case 'drag-start': {
        const payload = event.payload as EventEditingEdge<'dragType'>['payload']

        this.editingEdgeDetails.dragging = true
        this.editingEdgeDetails.draggingNode = payload
        break
      }
      case 'drag-end': {
        if (!this.editingEdgeDetails.from || !this.editingEdgeDetails.to) {
          throw new Error(`Unable to find the original edited node from and/or to.`)
        }

        const updated = {
          from: this.editingEdgeFrom.node.current.id,
          to: this.editingEdgeTo.node.current.id
        }

        if (this.renderedNodes[updated.from].to[updated.to]) {
          // @todo Use a proper notification system
          // tslint:disable-next-line
          console.warn('There is already an edge for that.')
          break
        }

        const original = {
          from: this.editingEdgeDetails.from,
          to: this.editingEdgeDetails.to
        }

        this.$emit('update-edge', { original, updated })

        // Update the currently editing edge to the new one
        this.editingEdgeDetails.from = updated.from
        this.editingEdgeDetails.to = updated.to
        this.editingEdgeDetails.dragging = false
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
  public onEditNode (event: EventEditingNode) {
    switch (event.type) {
      case 'hover-start': {
        if (this.editingNodeDetails.editing) {
          return false
        }

        this.editingNodeDetails.showing = true
        this.editingNodeDetails.id = event.payload
        break
      }
      case 'hover-end': {
        if (this.editingNodeDetails.editing) {
          return false
        }

        this.editingNodeDetails.showing = false
        break
      }
      case 'edit-start': {
        this.editingEdgeDetails.editing = true
        break
      }
      case 'edit-end': {
        this.editingEdgeDetails.editing = false
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
}
