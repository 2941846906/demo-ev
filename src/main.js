import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/global.less'
import axios from 'axios'
axios.defaults.baseURL = 'http://www.liulongbin.top:3008'
// 添加请求拦截器
// 所有的请求都会到这里来,会去执行第一个参数，同时自动传入config
axios.interceptors.request.use(function (config) {
  const token = store.state.user.token
  if (token) { // 如果本地有token,给它加上请求头
    config.headers.Authorization = token
  }
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

Vue.prototype.$http = axios
Vue.use(ElementUI)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
