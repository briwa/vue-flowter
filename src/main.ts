import Vue from 'vue'
import Flowter from './index.vue'

Vue.config.productionTip = false

// This is an example of the props
// that can be supplied. Only used in development.
const nodes = {
  z: { text: 'Before first' },
  a: { text: 'First A' },
  b: { text: 'First B' },
  cca: { text: 'Second A' },
  ccb: { text: 'Second B' },
  ccc: { text: 'Second C' },
  ccz: { text: 'In between second' },
  dd1: { text: 'Third 1' },
  dd2: { text: 'Third 2' },
  dd3: { text: 'Third 3' },
  dd4: { text: 'Third 4' },
  ea: { text: 'Fourth A?' },
  eb: { text: 'Fourth B?' },
  f: { text: 'You said No' },
  g: { text: 'You said Yes' },
  h: { text: 'That\'s it!' }
}

const edges = [
  { from: 'z', to: 'a'},
  { from: 'z', to: 'b'},
  { from: 'a', to: 'cca' },
  { from: 'a', to: 'ccb' },
  { from: 'b', to: 'ccc' },
  { from: 'cca', to: 'ccz' },
  { from: 'ccb', to: 'ccz' },
  { from: 'ccz', to: 'dd1' },
  { from: 'ccz', to: 'dd2' },
  { from: 'ccz', to: 'dd3' },
  { from: 'ccz', to: 'dd4' },
  { from: 'dd1', to: 'ea' },
  { from: 'dd2', to: 'ea' },
  { from: 'dd3', to: 'eb' },
  { from: 'dd4', to: 'eb' },
  { from: 'ea', to: 'f', option: 'No' },
  { from: 'ea', to: 'g', option: 'Yes' },
  { from: 'eb', to: 'f', option: 'No' },
  { from: 'eb', to: 'g', option: 'Yes' },
  { from: 'eb', to: 'dd3' },
  { from: 'eb', to: 'dd4' },
  { from: 'ea', to: 'dd1' },
  { from: 'eb', to: 'ccc' },
  { from: 'ea', to: 'cca' },
  { from: 'ea', to: 'dd2' },
  { from: 'f', to: 'h' },
  { from: 'g', to: 'h' }
]

new Vue({
  render: (h) => h(Flowter, {
    props: { nodes, edges }
  })
}).$mount('#app')
