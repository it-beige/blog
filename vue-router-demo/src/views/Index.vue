<template>
  <div class="Index">
    Index1的内容
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'Index'
}
</script>

<style lang="less">
.Index {
  width: 100%;
  height: 450px;
  line-height: 450px;
  text-align: center;
  color: rgba(0, 0, 0, .1);
  font-size: 50px;
}
</style>
