/**
 * @hidden
 * -------------------------------
 * Flowchart types
 * -------------------------------
 */

/**
 * The flowchart's rendering mode.
 *
 * Vertical means the nodes go from top to bottom.
 * Horizontal means the nodes go from left to right.
 */
export enum Mode {
  VERTICAL = 'vertical',
  HORIZONTAL = 'horizontal'
}

/**
 * @hidden
 * -------------------------------
 * Node types
 * -------------------------------
 */

/**
 * All of the node's possible symbols.
 */
export enum NodeSymbol {
  ROUNDED_RECTANGLE = 'rounded-rectangle',
  ELLIPSE = 'ellipse',
  RECTANGLE = 'rectangle',
  PARALLELOGRAM = 'parallelogram',
  RHOMBUS = 'rhombus'
}

 /**
  * The node shape, retrieved as props in [[Flowter.nodes]].
  *
  * `Graph` prefix is used so that it won't be confused
  * with the global `Node` type.
  */
export interface GraphNode {
  /**
   * The node's text.
   */
  text: string
  /**
   * The node's width.
   *
   * If specified, this will override [[DEFAULT_NODE_WIDTH]].
   */
  width?: number

  /**
   * The node's height.
   *
   * If specified, this will override [[DEFAULT_NODE_HEIGHT]].
   */
  height?: number

  /**
   * The node's x position in the DOM.
   *
   * If specified, this will be the position used when rendering.
   * Do be careful when setting this option manually; it might
   * not be rendered in accordance to the rest of the nodes,
   * since their positions are being calculated depending on
   * the edges.
   */
  x?: number

  /**
   * The node's y position in the DOM.
   *
   * If specified, this will be the position used when rendering.
   * Do be careful when setting this option manually; it might
   * not be rendered in accordance to the rest of the nodes,
   * since their positions are being calculated depending on
   * the edges.
   */
  y?: number

  /**
   * The node's symbol.
   *
   * If specified, this will override the default shape, which is
   * [[NodeSymbol.RECTANGLE]]
   */
  symbol?: NodeSymbol

  /**
   * The node's background color.
   *
   * If specified, this will override the default color, which is
   * [[DEFAULT_NODE_BGCOLOR]]
   */
  bgcolor?: string
}

/**
 * The ordered node shape.
 */
export interface OrderedNode {
  /**
   * All the nodes that connects to this node.
   */
  from: Record<string, OrderedNode>

  /**
   * All the nodes that this node connects to.
   */
  to: Record<string, OrderedNode>

  /**
   * The index that represents this node in [[NodeRow]].
   */
  index: number
}

/**
 * More detailed node shape, to be rendered in the DOM.
 */
export interface RenderedGraphNode extends GraphNode {
  id: string
  x: number
  y: number
  width: number
  height: number
  symbol: NodeSymbol
  bgcolor: string
}

/**
 * The rows of nodes.
 */
export interface NodeRow {
  nodes: RenderedGraphNode[]
  width: number
  height: number
}

/**
 * The detailed info of the node.
 *
 * This includes its position on the [[NodeRow]].
 */
export interface GraphNodeDetails {
  rowLength: number
  rowIdx: number
  colIdx: number
  node: RenderedGraphNode
}

/**
 * @hidden
 * -------------------------------
 * Edge types
 * -------------------------------
 */

/**
 * Determines whether an edge has to have the marker
 * at the start, end of the edge, or both.
 */
export enum EdgeMarker {
  START = 'start',
  END = 'end',
  BOTH = 'both'
}

/**
 * Types of the edges.
 */
export enum EdgeType {
  CROSS = 'cross',
  BENT = 'bent'
}

/**
 * The edge shape, retrieved as props in [[Flowter.edges]].
 *
 * `Graph` prefix is used to make it consistent
 * with [[GraphNode]].
 */
export interface GraphEdge {
  /**
   * The node id this edge is connecting from.
   */
  from: string

  /**
   * The node id this edge is connecting to.
   */
  to: string

  /**
   * The text that this edge might have.
   */
  text?: string

  /**
   * The color of the edge.
   */
  color?: string
}

/**
 * The edge translated into the node position.
 */
export interface ShapedEdge {
  x: number
  y: number
  nodeDirection: Direction
}

/**
 * The detailed info when editing an edge.
 */
export interface EditingEdgeDetails {
  showing: boolean
  editing: boolean
  from: null | GraphNodeDetails,
  to: null | GraphNodeDetails
}

/**
 * The shape of the event when editing an edge.
 */
export interface EventEditingNode {
  event: MouseEvent
  type: string
  details: { from: string, to: string }
}

/**
 * @hidden
 * -------------------------------
 * Shared types
 * -------------------------------
 */

/**
 * Cardinal directions.
 *
 * Determines points/directions in nodes and edges.
 */
export type Direction = 'n' | 's' | 'e' | 'w'

/**
 * The bounds, ranging from the vertical and horizontal bounds.
 */
export interface Bounds {
  x: { min: number, max: number }
  y: { min: number, max: number }
}

/**
 * The selection types when editing a node.
 */
export enum SelectionType {
  RESIZE_N = 'resize-n',
  RESIZE_S = 'resize-s',
  RESIZE_W = 'resize-w',
  RESIZE_E = 'resize-e',
  MOVE = 'move',
  DEFAULT = 'default'
}
