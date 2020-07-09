import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { Menu, Button, message, Form, Input, Icon } from 'ant-design-vue'
Vue.config.productionTip = false
Vue.use(Menu)
Vue.use(Button)
Vue.use(Form)
Vue.use(Input)
Vue.use(Icon)
Vue.prototype.$message = message
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
