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
        { from: 'a', to: 'b' },
        { from: 'a', to: 'c' }
      ]
    }
  }
}
</script>
<template>
  <flowter :nodes="nodes" :edges="edges">
</template>
```

It would render something like this:

![flowchart](https://user-images.githubusercontent.com/8046636/54611144-619e7a00-4a91-11e9-8efe-11932f6727d4.png)

And you're pretty much set! Of course, you can add additional CSS and the likes.

## Properties
- `nodes`
  - Type: Object
  - Required
  - A list of nodes to be rendered. Each node is determined by the key which serves as the node id.
    Nodes in general should be connected by the edges, otherwise it won't be positioned properly.
- `edges`
  - Type: Array
  - Required
  - A list of edges that connects the nodes, determined by the `from` and `to` property
    which points to the node ids. The direction of the node can be forward or backward, but not
    to itself (for now...).
- `mode`
  - Type: String (`'horizontal', 'vertical'`)
  - Default: `'vertical'`
  - Whether the flowchart is rendered vertically or horizontally.
- `width`
  - Type: Number
  - Default: `null`
  - If specified, the flowchart's width container will be rendered to the size specified. Not responsize for now,
    otherwise the width will follow the maximum width of the flowchart.
- `height`
  - Type: Number
  - Default: `null`
  - If specified, the flowchart's height container will be rendered to the size specified. Not responsize for now,
    otherwise the width will follow the maximum height of the flowchart.
- `edgeType`
  - Type: String (`'cross', 'bent'`)
  - Default: `'bent'`
  - If specified, all of the edges will be rendered as specified.

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
- [ ] Ability to edit the nodes and the edges (and export the edited )
- [ ] Multiple types of the nodes
- [ ] Ability to customize the color of the nodes/edges/texts
- [ ] Nodes' text should fit the container
- [ ] Ability to add label to an edge
- [ ] Ability to point a node to an edge
- [ ] Ability to connet a node to itself

## Hats off
- [Vue CLI](https://cli.vuejs.org/) for the quick, hassle-free setup.

## License
MIT
