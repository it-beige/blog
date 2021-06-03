<template>
  <div class="app-container test-component">
    <!-- radio -->
    <el-card slot="left" shadow="never" header="radio">
      <el-radio-group v-model="testVal1">
        <template v-for="item of cites">
          <dynamic-checkbox
            :key="item"
            :label="item"
            type="radio"
            ref-name="radio"
            @change="checkboxChang('radio', $event)"
          >
            备选项-{{ item }}
          </dynamic-checkbox>
        </template>
      </el-radio-group>
    </el-card>

    <!-- radio-group -->
    <el-card slot="left" shadow="never" header="radio-group">
      <dynamic-checkbox
        ref="radio-group"
        v-model="testVal2"
        :options="data"
        type="radio"
        :button="true"
        ref-name="radio-group"
        @change="checkboxChang('radio-group', $event)"
      />
    </el-card>

    <!-- checkbox -->
    <el-card slot="left" shadow="never" header="checkbox">
      <dynamic-checkbox
        v-model="testVal3"
        :options="data"
        type="checkbox"
        size="mini"
        :button="true"
        @change="checkboxChang('checkbox', $event)"
      />
    </el-card>

    <!-- checkbox-Group -->
    <el-card slot="left" shadow="never" header="checkbox-group">
      <el-checkbox
        v-model="checkAll"
        :indeterminate="isIndeterminate"
        @change="handleCheckAllChange"
      >全选
      </el-checkbox>
      <dynamic-checkbox
        ref="checkbox-group"
        v-model="testVal4"
        :options-url="url"
        size="medium"
        :border="true"
        :formatter="formatterOptions"
        @change="checkboxChang('checkbox-group', $event)"
      />

    </el-card>
  </div>
</template>

<script>
import dynamicCheckbox from '@/components/common/dynamic-checkbox'
export default {
  name: 'CkTestCheckbox',
  components: {
    'dynamic-checkbox': dynamicCheckbox
  },
  data() {
    return {
      cites: ['上海', '北京', '广州'],
      url: 'http://mengxuegu.com:7300/mock/6074eb6a56076a4a764847d5/book-components/optionsData',
      data: [
        { 'text': '贡茶', 'label': '上海市长宁区金钟路633号' },
        { 'text': '豪大大香鸡排超级奶爸', 'label': '上海市嘉定区曹安公路曹安路1685号' },
        { 'text': '茶芝兰（奶茶，手抓饼）', 'label': '上海市普陀区同普路1435号' },
        { 'text': '十二泷町', 'label': '上海市北翟路1444弄81号B幢-107' },
        { 'text': '星移浓缩咖啡', 'label': '上海市嘉定区新郁路817号' },
        { 'text': '阿姨奶茶/豪大大', 'label': '嘉定区曹安路1611号' },
        { 'text': '新麦甜四季甜品炸鸡', 'label': '嘉定区曹安公路2383弄55号' },
        { 'text': 'Monica摩托主题咖啡店', 'label': '嘉定区江桥镇曹安公路2409号1F，2383弄62号1F' },
        { 'text': '浮生若茶（凌空soho店）', 'label': '上海长宁区金钟路968号9号楼地下一层' }
      ],
      testVal1: '',
      testVal2: '上海市长宁区金钟路633号',
      testVal3: [],
      testVal4: [],
      isIndeterminate: false,
      checkAll: false

    }
  },
  created() {
    this.testVal3 = this.data.filter(i => i.label.length > 16).map(i => i.label)

    // this.$refs.dynamicChekbox1.
  },
  methods: {
    checkboxChang(type, $event) {
      console.log(type, $event)
    },
    handleCheckAllChange(val) {
      const options = this.$refs['checkbox-group'].newOptions
      const labels = options.map(i => i.address)
      this.testVal4 = val ? labels : []
      this.isIndeterminate = false
    },
    formatterOptions(o) {
      return {
        label: o.address,
        text: o.value
      }
    }
  }
}
</script>

<style scoped lang="scss"></style>
