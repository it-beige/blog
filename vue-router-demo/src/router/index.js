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
    name: 'Home', // 命名路由
    component: Home,
    redirect: '/index', // 重定向到'/index' 是将index做为Home的子路由, 如果不是子路由, index组件是没有Home的嵌套组件的
    children: [
      {
        path: '/index',
        name: 'index',
        components: {
          // 默认的路由出口渲染的组件
          default: () => import('../views/Index'),
          // 命名为'user', 的路由出口渲染的组件
          index2: () => import('../views/Index2'),
        },
        meta: { title: '首页' } 
      },
    ],
  },
  {
    path: '/user/:id', // 动态路由
    meta: { title: '用户页' },
    component: () => import('../views/User'),
    props: true, // 通过布尔模式向路由组件传递参数
  },
  {
    path: '/login',
    name: 'Login',
    title: '登录页',
    meta: { title: '登录页' },
    component: () => import('../views/Login')
  },
  {
    path: '/demo',
    name: 'Demo',
    title: '函数式编程',
    meta: { title: '函数式编程' },
    component: () => import('../views/Demo')
  },
  { // 路由匹配捕获所有路由来处理 404 Not found => 这里就涉及到了路由匹配的优先级, 根据路由写的顺序
    // 谁先定义的，谁的优先级就最高。
    path: '*',
    name: '404',
    meta: { title: '404页面' },
    component: () => import('../views/404')
  }
]



const router = new VueRouter({
  routes
})

let isAuthenticated = localStorage.getItem('USER_INFO') && JSON.parse(localStorage.getItem('USER_INFO')).id
// 全局前置路由 => 实现用户没有登录强制跳转登录页面
router.beforeEach((to, from, next) => {
  // this => undefined 
  // 导航触发时，守卫是异步执行的，此时Vue实例还没有创建，所以在这里获取不到vue实例  
  message.success(`从${from.path} -> ${to.path}`)

  // 使用路由元信息动态修改标题
  if (to.meta && to.meta.title) {
    document.title = to.meta.title
  } else {
    document.title = 'default title'
  }
  console.log(localStorage);
  
  isAuthenticated = localStorage.getItem('USER_INFO') && JSON.parse(localStorage.getItem('USER_INFO')).id
  // 判断用户是否登录
  if (to.name !== 'Login' && !isAuthenticated) {
    next({name: 'Login'}) 
  }else next()

 
})


export default router
