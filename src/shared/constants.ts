/**
 * @hidden
 * -------------------------------
 * Flowchart constants
 * -------------------------------
 */

/**
 * Default width margin if [[Flowter.widthMargin]] is not specified.
 */
export const DEFAULT_WIDTH_MARGIN = 25

/**
 * Default height margin if [[Flowter.heightMargin]] is not specified.
 */
export const DEFAULT_HEIGHT_MARGIN = 25

/**
 * Default font size if [[Flowter.fontSize]] is not specified.
 */
export const DEFAULT_FONT_SIZE = 14

/**
 * @hidden
 * -------------------------------
 * Node constants
 * -------------------------------
 */

/**
 * Default node width if [[Flowter.nodeWidth]] is not specified.
 */
export const DEFAULT_NODE_WIDTH = 150

/**
 * Default node height if [[Flowter.nodeHeight]] is not specified.
 */
export const DEFAULT_NODE_HEIGHT = 70

/**
 * Default node row spacing if [[Flowter.nodeRowSpacing]] is not specified.
 */
export const DEFAULT_NODE_ROW_SPACING = 70

/**
 * Default node column spacing if [[Flowter.nodeColSpacing]] is not specified.
 */
export const DEFAULT_NODE_COL_SPACING = 50

/**
 * Default node background color.
 */
export const DEFAULT_NODE_BGCOLOR = '#ffffff'

/**
 * Smaller node size for certain symbols.
 */
export const NODE_SMALLER_RATIO = .1

/**
 * Nodes with [[NodeSymbol.RHOMBUS]] would be rendered with too many
 * whitespaces around it, due to the characteristics of the shape.
 * It should be rendered larger than any other symbols.
 */
export const NODE_RHOMBUS_RATIO = 1.25

/**
 * @hidden
 * -------------------------------
 * Edge constants
 * -------------------------------
 */

/**
 * The minimum edge size allowed.
 */
export const MIN_EDGE_SIZE = 10

/**
 * The minimum detour size allowed.
 */
export const MIN_EDGE_DETOUR_SIZE = 10

/**
 * The point where the edge has to stop and continue renders
 * to a different direction.
 */
export const EDGE_MIDPOINT_RATIO = .8

/**
 * The self-referential edge size ratio.
 */
export const EDGE_SR_SIZE_RATIO = 1.2

/**
 * The self-referential edge arc ratio.
 */
export const EDGE_SR_ARC_SIZE_RATIO = 2.1

/**
 * @hidden
 * -------------------------------
 * Shared constants
 * -------------------------------
 */

/**
 * Default stroke width for both nodes and edges.
 */
export const DEFAULT_STROKE_WIDTH = 2

/**
 * Default stroke color for both nodes and edges.
 */
export const DEFAULT_STROKE_COLOR = '#000000'

/**
 * Default values for [[Flowter.allBounds]].
 */
export const DEFAULT_BOUNDS = () => ({
  x: {
    min: 0,
    max: 0
  },
  y: {
    min: 0,
    max: 0
  },
  length: 0
})
