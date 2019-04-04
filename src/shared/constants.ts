/**
 * Default node width if [[Flowter.nodeWidth]] is not specified.
 */
export const DEFAULT_NODE_WIDTH = 100

/**
 * Default node height if [[Flowter.nodeWidth]] is not specified.
 */
export const DEFAULT_NODE_HEIGHT = 50

/**
 * Default node row spacing if [[Flowter.nodeRowSpacing]] is not specified.
 */
export const DEFAULT_NODE_ROW_SPACING = 50

/**
 * Default node column spacing if [[Flowter.nodeColSpacing]] is not specified.
 */
export const DEFAULT_NODE_COL_SPACING = 50

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
export const DEFAULT_FONT_SIZE = 12

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
export const EDGE_SR_ARC_SIZE_RATIO = 2.2

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
