import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import axios from 'axios'
import vueAxios from 'vue-axios'
import './utils/http'
// 按需加载组件
import { Input, Checkbox, Button, List, message  } from 'ant-design-vue';

Vue.config.productionTip = false;

// 使用组件
Vue.use(Input)
Vue.use(Checkbox)
Vue.use(Button)
Vue.use(List)
// 向vue实例中挂在axios
Vue.use(vueAxios, axios);

Vue.prototype.$message = message

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
 