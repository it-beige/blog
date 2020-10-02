import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import { message } from 'ant-design-vue'
/* eslint-disable */
Vue.use(VueRouter)
Vue.use(message)

const routes = [
  {
    path: '/',
    name: 'Demo',
    title: '函数式编程',
    meta: { title: '函数式编程' },
    component: () => import('../views/Demo')
  },
]


const router = new VueRouter({
  routes
})



export default router
