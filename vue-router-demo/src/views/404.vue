<template>
  <div class="absence">
    <div class="title">404</div>
    <div class="info">你要访问的站点找不到了噢...</div>
  </div>
</template>

<script>
/* eslint-disable */
import Index from '../views/Index'
export default {
  
}
</script>

<style lang="less">
.absence {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 22px;
  .title {
    font-size: 80px;
  }
  .info {
    position: relative;
    bottom: 25px;
  }
}
</style>
