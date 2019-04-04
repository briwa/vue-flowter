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

Please see the [docs](https://briwa.github.io/vue-flowter/docs) for more details on the props.

## Running in development
```
npm run install && npm run serve
```
This will serve the component along with the example of the flowchart data.

## Test
```
npm run test
```
This will run all the tests using Jest.

## TODO
This component is not complete. Several things before the first major release:
- [x] Nodes' text should fit the container
- [x] Ability to add a text to an edge
- [x] Annotate props/getters/methods
- [x] Ability to connect a node to itself
- [x] Ability to edit the nodes size and position
- [ ] Ability to edit the edges position
- [ ] Multiple types of the nodes
- [ ] Ability to customize the color of the nodes/edges/texts
- [ ] Ability to point a node to an edge

## Hats off
- [Vue CLI](https://cli.vuejs.org/) for the quick, hassle-free setup.

## License
MIT
