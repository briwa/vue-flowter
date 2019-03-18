import Vue from 'vue'
import Flowter from './index.vue'

// To populate data during development,
// use the test fixtures data by default
// since those covers all the use cases.
import { nodes, edges } from '../fixtures/graph.json'

Vue.config.productionTip = false

new Vue({
  render: (h) => h(Flowter, {
    props: { nodes, edges }
  })
}).$mount('#app')
