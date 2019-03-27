export type Direction = 'n' | 's' | 'e' | 'w' | 'm'

export enum EdgeMarker {
  START = 'start',
  END = 'end',
  BOTH = 'both'
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

export interface ShapedEdge {
  x: number
  y: number
  nodeDirection: Direction
}

export interface EdgesIdsDict {
  toIds: Record<string, GraphEdge['to'][]>
  fromIds: Record<string, GraphEdge['from'][]>
}

export enum Mode {
  VERTICAL = 'vertical', // Top-bottom
  HORIZONTAL = 'horizontal' // Left-right
}
