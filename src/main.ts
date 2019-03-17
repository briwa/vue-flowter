import Vue from 'vue'
import Flowter from './index.vue'

Vue.config.productionTip = false

// This is an example of the props
// that can be supplied. Only used in development.
const nodes = {
  z: { text: 'Before first' },
  a: { text: 'First A' },
  b: { text: 'First B' },
  c: { text: 'First C' },
  cca: { text: 'Second A' },
  ccb: { text: 'Second B' },
  ccc: { text: 'After second 2' },
  cccc: { text: 'After second 3' },
  ccccc: { text: 'After second 4' },
  cccccc: { text: 'After second 5' },
  da: { text: 'Third A?' },
  db: { text: 'Third B?' },
  e: { text: 'You said No' },
  f: { text: 'You said Yes' },
  i: { text: 'That\'s it!' }
}

const edges = [
  { from: 'z', to: 'a'},
  { from: 'z', to: 'b'},
  { from: 'z', to: 'c'},
  { from: 'a', to: 'cca' },
  { from: 'b', to: 'cca' },
  { from: 'c', to: 'cca' },
  { from: 'a', to: 'ccb' },
  { from: 'b', to: 'ccb' },
  { from: 'c', to: 'ccb' },
  { from: 'cca', to: 'ccc' },
  { from: 'cca', to: 'cccc' },
  { from: 'ccb', to: 'ccccc' },
  { from: 'ccb', to: 'cccccc' },
  { from: 'ccc', to: 'da' },
  { from: 'cccc', to: 'da' },
  { from: 'ccccc', to: 'db' },
  { from: 'cccccc', to: 'db' },
  { from: 'da', to: 'e', option: 'No' },
  { from: 'da', to: 'f', option: 'Yes' },
  { from: 'db', to: 'e', option: 'No' },
  { from: 'db', to: 'f', option: 'Yes' },
  { from: 'db', to: 'cccccc' },
  { from: 'da', to: 'ccc' },
  // TODO: figure out how to do these two properly
  // { from: 'db', to: 'ccb' },
  // { from: 'da', to: 'cca' },
  { from: 'e', to: 'i' },
  { from: 'f', to: 'i' }
]

new Vue({
  render: (h) => h(Flowter, {
    props: { nodes, edges }
  })
}).$mount('#app')
