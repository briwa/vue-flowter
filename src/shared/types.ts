export type Orients = 'n' | 's' | 'e' | 'w'

export interface Point {
  x: number
  y: number
}

export enum EdgeMarker {
  START = 'start',
  END = 'end'
}

export enum EdgeDirection {
  FORWARD = 'forward',
  BACKWARD = 'backward'
}

export enum EdgeType {
  CROSS = 'cross',
  BENT = 'bent'
}

export interface GraphNode {
  text: string
  width?: number
  height?: number
  x?: number
  y?: number
}

export interface RenderedGraphNode extends GraphNode {
  id: string
  x: number
  y: number
  width: number
  height: number
}

export interface GraphNodeDetails {
  rowLength: number
  rowIdx: number
  colIdx: number
  node: RenderedGraphNode
}

export interface EditingNodeDetails {
  node?: RenderedGraphNode,
  minX: number,
  maxX: number,
  minY: number,
  maxY: number
}

export interface GraphEdge {
  from: string
  to: string
  text?: string
  color?: string
}

export interface RenderedGraphEdge extends GraphEdge {
  id: string
  text: string
  startPoint: Point
  startOrient: Orients
  endPoint: Point
  endOrient: Orients
  marker: EdgeMarker
  direction: EdgeDirection
  color: string
}

export interface EdgesIdsDict {
  toIds: Record<string, GraphEdge['to'][]>
  fromIds: Record<string, GraphEdge['from'][]>
}

export enum Mode {
  VERTICAL = 'vertical', // Top-bottom
  HORIZONTAL = 'horizontal' // Left-right
}
