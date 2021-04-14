## 下拉选择框

:::tip
扩展属性`props.formatter` 自定义事件回调`listeners`
:::




### 高级用法

:::demo 格式化选项数据`props.formatter`、选中事件监听处理`listeners`

```html
<template>
  <jl-select type="select" v-model="value" v-bind="config">
</jl-select>
   <div>选中的值：{{value}}</div>
</template>

<script>
  export default {
    data() {
      return {
        value: '',
        config: {
            clearable: true,
            filterable: true,
            options: [
              {
                name: '选项一',
                id: '1',
                number: 'FFF1'
              },
              {
                name: '选项二',
                id: '2',
                number: 'SSS2'
              },
              {
                name: '选项三',
                id: '3',
                number: 'TTT3',
                disabled: true
              },
              {
                name: '选项四',
                id: 4,
                number: 'LLL4'
              } 
            ],
            props: {
              label: 'name',
              value: 'id',
              formatter: (val, op) => {
                return `${val} ${op.number}`
              }
            },
            multiple: true,
            listeners: {
              change: (val) => {console.log('change ===> ', val)},
              dataChange: (val) => {console.log('dataChange ===> ', val)},
            },
            slots: {
                prefix: (h) => (<i class='el-icon-edit el-input__icon' />)
            }           
        }
      }
    },
  }
</script>
```

:::