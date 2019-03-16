import Vue from 'vue'
import Flowter from './flowter.vue'

Vue.config.productionTip = false

// This is an example of the props
// that can be supplied. Only used in development.
const nodes = {
  a: { text: 'First A' },
  b: { text: 'First B' },
  c: { text: 'First C' },
  cc: { text: 'Second' },
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
  { from: 'a', to: 'cc' },
  { from: 'b', to: 'cc' },
  { from: 'c', to: 'cc' },
  { from: 'cc', to: 'ccc' },
  { from: 'cc', to: 'cccc' },
  { from: 'cc', to: 'ccccc' },
  { from: 'cc', to: 'cccccc' },
  { from: 'ccc', to: 'da' },
  { from: 'cccc', to: 'da' },
  { from: 'ccccc', to: 'db' },
  { from: 'cccccc', to: 'db' },
  { from: 'da', to: 'e', option: 'No' },
  { from: 'da', to: 'f', option: 'Yes' },
  { from: 'db', to: 'e', option: 'No' },
  { from: 'db', to: 'f', option: 'Yes' },
  { from: 'e', to: 'i' },
  { from: 'f', to: 'i' }
]

new Vue({
  render: (h) => h(Flowter, {
    props: { nodes, edges }
  })
}).$mount('#app')
