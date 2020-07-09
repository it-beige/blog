<template>
  <div class="Home">
    <nav-header></nav-header>
    <nav-bar></nav-bar>
    <!-- 路由占位符, 会渲染路由匹配的组件 -->
    <router-view />
    <!-- 命名视图 -->
    <router-view name="index2"></router-view>
    <nav-footer></nav-footer>
  </div>
</template>

<script>
/* eslint-disable */
import NavHeader from '../components/NavHeader'
import NavFooter from '../components/NavFooter'
import NavBar from '../components/NavBar'
export default {
  name: 'Home',
  components: {
    NavHeader,
    NavFooter,
    NavBar
  },
  /* beforeRouteLeave(to, from, next) {
    const answer = window.confirm(
      "是否退出登录"
    );
    if (answer) {
      localStorage.clear()
      next();
    } else {
      next(false);
    }
  } */
}
</script>

<style lang="less" scoped>
.Home {
  position: relative;
}
</style>