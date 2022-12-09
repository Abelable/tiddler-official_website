import Vue from 'vue'
import App from './App.vue'
import Router from 'vue-router'
import router from './router/index'
import store from './store/index'
import { Swipe, SwipeItem, Lazyload, Toast, Dialog, ImagePreview, Popup, List } from 'vant'
import { judgeHost } from './utils/bridge'
import './utils/remConfig'
import './assets/style/index.styl'
Vue.prototype.$host = judgeHost()
Vue.config.productionTip = false
Vue.config.ignoredElements = ['wx-open-launch-weapp']

Vue.use(Router)
Vue.use(Swipe)
Vue.use(SwipeItem)
Vue.use(Lazyload)
Vue.use(Toast)
Vue.use(Dialog)
Vue.use(ImagePreview)
Vue.use(Popup)
Vue.use(List)

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
