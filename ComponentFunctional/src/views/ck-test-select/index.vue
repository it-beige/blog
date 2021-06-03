<template>
  <div class="app-container test-component">
    <el-card slot="left" shadow="never">
      <!-- :model="customModel" -->
      <dynamic-input
        v-model.lazy="testVal"
        :type="testType"
        @change="inputMethod"
        @input="inputMethod"
      />

      <el-button @click="changeTestVal('changeVal')">改变值</el-button>
    </el-card></div>
</template>

<script>
import dynamicInput from '@/components/common/dynamic-input'
export default {
  // name: 'TestComponent',
  components: {
    'dynamic-input': dynamicInput
  },
  data() {
    return {
      testType: 'text',
      testVal: ''
    }
  },
  methods: {
    changeTestVal(changeVal) {
      this.testVal = changeVal
    },
    inputMethod(val) {
      console.log(val, '-->')
    }
  }
}
</script>

<style scoped lang="scss"></style>
