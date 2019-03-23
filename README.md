# Vue Flowter
[![npm](https://img.shields.io/npm/v/vue-flowter.svg)](https://www.npmjs.com/package/vue-flowter)
[![Build Status](https://travis-ci.com/briwa/vue-flowter.svg?branch=master)](https://travis-ci.com/briwa/vue-flowter)

A simple flowchart component made with Vue. Requires a graph-like data structure as an input and renders it as a flowchart.

## Installation
```
npm install --save vue-flowter
```

## Usage
Import in your component (and the CSS as well):
```javascript
import 'vue-flowter/flowter.css'
import Flowter from 'vue-flowter'
Vue.component('Flowter', Flowter)
```

```html
<template>
  <flowter :nodes="nodes" :edges="edges">
</template>
<script>
export default {
  data () {
    return {
      nodes: {
        a: { text: 'Node A' },
        b: { text: 'Node B' },
        c: { text: 'Node C' }
      },
      edges: [
        { from: 'a', to: 'b', text: 'To B' },
        { from: 'a', to: 'c', text: 'To C' }
      ]
    }
  }
}
</script>
```

It would render something like this:

![flowchart](https://user-images.githubusercontent.com/8046636/54693874-4bacba00-4b62-11e9-8ff1-a3d6fc192dfc.png)

All of the nodes and edges are being positioned and shaped by default, although you can customize it if you want to (but not now, see **TODO**).
The goal is to make creating flowcharts as simple as possible.

If you need more visual customizations, of course you can add your own styling with CSS.

## Properties
- `nodes`
  - Type: `Object`
  - Required

    A list of nodes to be rendered. Each node is determined by the key which serves as the node id.
    Nodes in general should be connected by the edges, otherwise it won't be positioned properly.

    The bare minimum of a node is that it has the `text` property. The rest of the properties are optional.
    Refer to the `types` folder for more details.
- `edges`
  - Type: `Array`
  - Required

    A list of edges that connects the nodes, determined by the `from` and `to` property
    which points to the node ids. The direction of the node can be forward or backward, but not
    to itself (for now...).

    The bare minimum of a node is that it has to have both `from` and `to` property. The rest of the properties are optional.
    Refer to the `types` folder for more details.
- `mode`
  - Type: `String` (`'horizontal', 'vertical'`)
  - Default: `'vertical'`

    Whether the flowchart is rendered vertically or horizontally.
- `width`
  - Type: `Number`
  - Default: `null`

    If specified, the flowchart will be rendered to the width size if it's rendering in vertical mode. Custom height will be ignored since the calculation is solely by the width.
- `height`
  - Type: `Number`
  - Default: `null`

    If specified, the flowchart will be rendered to the height size if it's rendering in horizontal mode. Custom width will be ignored since the calculation is solely by the height.
- `edgeType`
  - Type: `String` (`'cross', 'bent'`)
  - Default: `'bent'`

    If specified, this value will override the default edge type.
- `nodeWidth`
  - Type: `Number`
  - Default: `DEFAULT_NODE_WIDTH`

    If specified, this value will override the default node width value when the node has no width. See `src/constants.ts` to see all the default values.
- `nodeHeight`
  - Type: `Number`
  - Default: `DEFAULT_NODE_HEIGHT`

    If specified, this value will override the default node height value when the node has no height. See `src/constants.ts` to see all the default values.
- `nodeRowSpacing`
  - Type: `Number`
  - Default: `DEFAULT_NODE_ROW_SPACING`

    If specified, this value will override the default node row spacing value. See `src/constants.ts` to see all the default values.
- `nodeColSpacing`
  - Type: `Number`
  - Default: `DEFAULT_NODE_COL_SPACING`

    If specified, this value will override the default node column spacing value. See `src/constants.ts` to see all the default values.
- `widthMargin`
  - Type: `Number`
  - Default: `DEFAULT_WIDTH_MARGIN`

    If specified, this value will override the default node width margin value. See `src/constants.ts` to see all the default values.
- `heightMargin`
  - Type: `Number`
  - Default: `DEFAULT_HEIGHT_MARGIN`

    If specified, this value will override the default node height margin value. See `src/constants.ts` to see all the default values.
- `fontSize`
  - Type: `Number`
  - Default: `DEFAULT_FONT_SIZE`

    If specified, this value will override the default font size, applies to nodes' and edges' `text`. See `src/constants.ts` to see all the default values.


## Running in development
```
npm run serve
```
This will serve the component along with the example of the flowchart data.

## Test
```
npm run test
```
This will run all the tests using Jest.

## TODO
This component is not complete. Several things before the first major release:
- [ ] Ability to connect a node to itself
- [ ] Ability to edit the nodes and the edges
- [ ] Multiple types of the nodes
- [ ] Ability to customize the color of the nodes/edges/texts
- [x] Nodes' text should fit the container
- [x] Ability to add a text to an edge
- [ ] Ability to point a node to an edge
- [ ] Annotate props/getters/methods, remove the ones on this README and move it to Typedoc

## Hats off
- [Vue CLI](https://cli.vuejs.org/) for the quick, hassle-free setup.

## License
MIT
