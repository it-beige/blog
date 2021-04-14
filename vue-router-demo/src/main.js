import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import vueAxios from 'vue-axios'
import elementUi from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';

axios.defaults.baseURL = 'https://www.easy-mock.com/mock/5f7601fdafffa44aa69cff74/Beige'
axios.interceptors.response.use(function (config) {
  // 在发送请求之前做些什么
  return config.data;
}, function (error) {
  return Promise.reject(error);
});
import { Menu, Button, message, Form, Input, Icon } from 'ant-design-vue'
Vue.config.productionTip = false
Vue.use(vueAxios, axios)
Vue.use(Menu)
Vue.use(elementUi)
Vue.use(Button)
Vue.use(Form)
Vue.use(Input)
Vue.use(Icon)
Vue.prototype.$message = message
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
