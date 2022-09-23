import Vue from 'vue'
import App from './App'
import store from './store'

// 注册全局组件
import MescrollBody from "@/components/mescroll-uni/mescroll-body.vue"
import MescrollUni from "@/components/mescroll-uni/mescroll-uni.vue"
Vue.component('mescroll-body', MescrollBody)
Vue.component('mescroll-uni', MescrollUni)

import { postRequest, getRequest, putRequest, deleteRequest } from './common/http/request'

Vue.config.productionTip = false

App.mpType = 'app'

Vue.prototype.$store = store
Vue.prototype.$getRequest = getRequest
Vue.prototype.$postRequest = postRequest
Vue.prototype.$putRequest = putRequest
Vue.prototype.$deleteRequest = deleteRequest

const app = new Vue({
	store,
    ...App
})
app.$mount()

