import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Element from 'element-ui'
import "element-ui/lib/theme-chalk/index.css"
import axios from 'axios'
import  qs from 'qs'


import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'


import "./axios"
import "./permission"


Vue.prototype.$qs = qs
Vue.use(Element)
Vue.prototype.$axios = axios

Vue.config.productionTip = false

Vue.use(mavonEditor)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

