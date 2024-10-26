import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/InterfaceConfig/api'
import '@/InterfaceConfig/axios'
import '@/utils/utils'
import '@/utils/commonFun'
import '@/router/routingGuard'
import i18n from './assets/i18n/index'
// Vue.use(ElementUI)

Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
})
Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
