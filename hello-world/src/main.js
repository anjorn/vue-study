import Vue from 'vue'
import App from './App.vue'

import Notice from './components/Notice.vue'
import create from './utils/create'
import router from './router'
import store from './store'
Vue.config.productionTip = false
Vue.prototype.$Notice = (props) => {
  return create(Notice, props)
}
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
