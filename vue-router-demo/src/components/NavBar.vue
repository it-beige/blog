<template>
  <div class="NavBar">
    <a-menu
      class="my_menu"
      style="width: 256px"
      :default-selected-keys="['1']"
      :default-open-keys="['sub1']"
      mode="horizontal"
      :theme="theme"
      :selected-keys="[current]"
    >
      <a-menu-item class="menu-item" key="1">
        <div @click="toLoginHandler">to Login</div>
        <!-- <router-link to="/login"></router-link> -->
      </a-menu-item>
      <a-sub-menu class="menu-item" key="sub1">
        <span slot="title"><span>to User</span></span>
        <a-menu-item key="3">
          <!-- 声明式导航 -->
          <router-link to="/user/A">
            to User/A
          </router-link>
        </a-menu-item>
        <a-menu-item key="4">
          <!-- 声明式导航 -->
          <router-link :to="{ path: '/user/B' }">
            to User/B
          </router-link>
        </a-menu-item>
      </a-sub-menu>
      <a-sub-menu class="menu-item" key="sub2">
        <span slot="title"><span>to Home</span></span>
      </a-sub-menu>
    </a-menu>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: "NavBar",
  data() {
    return {
      current: "1",
      theme: "dark"
    };
  },
  methods: {
    toLoginHandler() {
      const answer = window.confirm("是否退出登录");
      if (!answer) return;
      localStorage.clear();
      this.$router.push('/login')
    }
  }
};
</script>

<style lang="less" scoped>
.NavBar {
  margin-top: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  /deep/ .ant-menu {
    width: 18% !important;
    display: flex;
  }
}
</style>
