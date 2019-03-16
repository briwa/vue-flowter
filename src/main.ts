import Vue from 'vue'
import Flowter from './flowter.vue'

Vue.config.productionTip = false

// This is an example of the props you can supply.
// Used in development.
const nodes = {
  1: { text: 'First A' },
  2: { text: 'First B' },
  3: { text: 'Second?' },
  4: { text: 'You said No' },
  5: { text: 'You said Yes' },
  6: { text: 'No means No' },
  7: { text: 'Yes means Yes' },
  8: { text: 'That\'s it!' }
}

const edges = [
  { from: '1', to: '3' },
  { from: '2', to: '3' },
  { from: '3', to: '4', option: 'No' },
  { from: '3', to: '5', option: 'Yes' },
  { from: '4', to: '6' },
  { from: '5', to: '7' },
  { from: '6', to: '8' },
  { from: '7', to: '8' }
]

new Vue({
  render: (h) => h(Flowter, {
    props: { nodes, edges }
  })
}).$mount('#app')
