import Vue from 'vue'
import Flowter from './flowter.vue'

Vue.config.productionTip = false

new Vue({
  render: (h) => h(Flowter)
}).$mount('#app')
