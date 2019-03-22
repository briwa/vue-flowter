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

export interface GraphEdge {
  from: string
  to: string
  text?: string
}

export interface RenderedGraphEdge extends GraphEdge {
  id: string
  startPoint: Point
  endPoint: Point
  marker: EdgeMarker
  direction: EdgeDirection
}

export interface EdgesDict {
  toIds: Record<string, GraphEdge['to'][]>
  fromIds: Record<string, GraphEdge['from'][]>
}

export enum Mode {
  VERTICAL = 'vertical', // Top-bottom
  HORIZONTAL = 'horizontal' // Left-right
}
