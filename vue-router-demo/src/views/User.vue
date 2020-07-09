<template>
  <div class="User">
    <a-button class="my_btn" type="primary" @click="returnBtn">
      返回
    </a-button>
    <span class="info">User - {{id}}</span>
  </div>
</template>

<script>
/* eslint-disable */
import Index from '../views/Index'
export default {
  name: 'User',
  props: ['id'], // 接受路由组件传递过来的参数
  components: {
    Index
  },
  methods: {
    returnBtn() {
      // 编程式导航
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="less">
.User {
  width: 200px;
  height: 80px;
  line-height: 80px;
  text-align: center;
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translate(-50%);
  border: 1px solid #000;
  border-radius: 10px;
}
.my_btn {
  position: absolute;
  bottom: 80px;
}
</style>
