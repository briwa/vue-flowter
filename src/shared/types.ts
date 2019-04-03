export type Direction = 'n' | 's' | 'e' | 'w'

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

export interface OrderedNode {
  from: Record<string, OrderedNode>
  to: Record<string, OrderedNode>
  index: number
}

export interface RenderedGraphNode extends GraphNode {
  id: string
  x: number
  y: number
  width: number
  height: number
}

export interface NodeRow {
  nodes: RenderedGraphNode[]
  width: number
  height: number
}

export interface GraphNodeDetails {
  rowLength: number
  rowIdx: number
  colIdx: number
  node: RenderedGraphNode
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

export enum Mode {
  VERTICAL = 'vertical', // Top-bottom
  HORIZONTAL = 'horizontal' // Left-right
}

export interface Bounds {
  x: { min: number, max: number }
  y: { min: number, max: number }
}
