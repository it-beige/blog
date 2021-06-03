# 选择框

## 支持的类型

- 多选(checkbox)
- 单选(radio)

## Attributes

|                    **参数**                    |    **说明**    |                 **类型**                  | **默认值** |
| :--------------------------------------------: | :------------: | :---------------------------------------: | :--------: |
|                value / v-model                 |     绑定值     |    `[String, Number，Boolean，Array]`     |            |
|                      type                      |    表单类型    | `["checkbox", "radio", 'checkbox-group']` |  checkbox  |
|                     button                     | 是否渲染成按钮 |                 `Boolean`                 |   false    |
| 支持`el-radio/checkbox/checkbox-group`所有参数 |                |                                           |            |

> 当value值为Array的时候，会被识别成`el-checkbox-group/el-radio-group`, 此时需要提供一个options选项或者提供一个optionsUrl异步获取，两者互斥

|           **参数**           |            **说明**            | **类型**                                                     | **默认值** |
| :--------------------------: | :----------------------------: | ------------------------------------------------------------ | :--------: |
|           options            |        多选组合框的选项        | `Array`                                                      |            |
|          optionsUrl          |          异步获取选项          | `String`                                                     |            |
| 当传入optionsUrl下面参数可选 |                                |                                                              |            |
|            method            |            请求方式            | 支持[RESTful-API](http://www.ruanyifeng.com/blog/2011/09/restful.html) |    get     |
|            params            | 请求参数(get/post都可以叫这个) | `Object`                                                     |     {}     |
|                              |                                |                                                              |            |


这是当前组件最初始的形态

```html
<script>
// 供全局使用
let h
// 支持的类型
const checkBoxType = [
  'checkbox',
  'checkbox-group',
  'radio'
]

export default {
  name: 'DynamicCheckbox',
  // $attrs中的成员不显示在dom上
  inheritAttrs: false,
  props: {
    // 类型
    type: {
      default: 'checkbox',
      validator: typeVal => {
        return checkBoxType.includes(typeVal)
      }
    },
    // 绑定值
    value: {
      type: [String, Number, Boolean, Array],
      default: ''
    },
    // 支持el-radio/checkbox/checkbox-group所有参数
  },
  computed: {
    // 双向绑定
    newValue: {
      get({ value }) {
        return value
      },
      set(value) {
        this.$emit('change', value)
      }
    },
  },
  methods: {
    onChangeHandle(val) {
      this.newValue = val
    }
  },
  render() {
    h = this.$createElement
    const {
      onChangeHandle,
      $attrs,
    } = this

    return h('?', {
      props: {
        value: this.newValue,
        ...this.$attrs
      },
      on: {
        change: onChangeHandle
      },
      ref: $attrs['ref-name'] || 'elCheckbox'
    },)
  }
}
</script>
```

## 解决$attrs中的中横线命名不转换

这里需要去考虑一个问题，就是在Vue中我们传递属性一般会用这两种方式去写

```js
<dynamic-checkbox ref-name="radio" />
<dynamic-checkbox refName="radio" />
```

但是通过prop识别的属性Vue会帮你自动将中横线转换，但是不被props识别的属性(也就是统一放到$attrs对象里面的)，是不会帮你自动转换的，所以我们需要实现现在的getAttrsName方法

```js
getAttrsName({inheritAttrs: true}, 'inherit-attrs') // true
getAttrsName({'inherit-attrs': true}, 'inheritAttrs') // true
```

```js
/**
* @description: 解决$attrs并不会自动将kebab-case转换为camelCase的问题
* @param {Object} $attrs
* @param {String} name
* @return {*} camelCase风格的name
*/
export function getAttrsName($attrs, name) {
  if ($attrs[name]) {
    return $attrs[name]
  }
  // 将中横线转转换为驼峰
  const kebabCase2camelCase = /-+([\w])/g
  const kebabCase2camelCaseFn = (name, reg) => {
    return name.replace(reg, (execStr, $1) => {
      return $1.toUpperCase()
    })
  }

  // 将驼峰转换为中横线
  const cameCase2kebabCase = /(?<=[a-z1-9])([A-Z])/g
  const cameCase2kebabCaseFn = (name, reg) => {
    return name.replace(reg, (execStr, $1) => {
      return `-${$1.toLocaleLowerCase()}`
    })
  }

  let reg
  let fn
  // 中横线转换成驼峰
  if (/-/g.test(name)) {
    reg = kebabCase2camelCase
    fn = kebabCase2camelCaseFn
  } else {
    // 驼峰转换为中横线
    reg = cameCase2kebabCase
    fn = cameCase2kebabCaseFn
  }

  return $attrs[fn(name, reg)]
}
```

上面那块代码需要转一下

```html
ref: $attrs['ref-name'] || 'elCheckbox'
// 替换
ref: getAttrsName($attrs, 'ref-name') || 'elCheckbox'
```

## el-radio

```html
<template>
  <el-card slot="left" shadow="never" header="A">
    <!-- A -->
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

  <!-- A-Group -->
  <el-card slot="left" shadow="never" header="A-Group">
    <dynamic-checkbox
      v-model="testVal2"
      :options="data"
      type="radio"
      ref-name="radio"
      @change="checkboxChang('radio-Group', $event)"
    />
  </el-card>
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
    }
  },
  methods: {
    checkboxChang(type, $event) {
      console.log(type, $event)
    }
  }
}
</script>
```

```js
export default {
  computed: {
    // 是否渲染组合
    group({ $attrs: { options, optionsUrl }}) {
      return options || optionsUrl
        ? 'group'
        : ''
    },
    // 最终要渲染的组件名称
    componentTag: {
      get({ type, group, $attrs, isRenderButton }) {
        const tag = `el-${type}`
        if (group) {
          return `${tag}-${group}`
        }

        return `${tag}${isRenderButton($attrs.button)}`
      }
    }
  },
  methods: {
    // 是否渲染按钮类型
    isRenderButton(button) {
      return button
        ? '-button'
        : ''
    },
    // 渲染选项节点
    renderOptionsVNode(tag, newOptions) {
      let item = {}
      return newOptions.map(o => {
        if (!isObject(o)) {
          item.label = o
        } else {
          // 提供给用户formatter方法来格式化选项
          item = this.$attrs.formatter &&
          this.$attrs.formatter(o) ||
          o
        }

        return h(tag, {
          props: {
            ...item
          }
        }, item.text || item.label)
      })
    },
    // 渲染默读插槽内容
    renderSlots($slots) {
      return Object.values($slots).map(s => $slots[s])
    },
    getAsyncOptions({ optionsUrl, params }) {

    }
  },
  render() {
    h = this.$createElement
    const {
      group,
      type,
      $attrs,
      $slots,
      componentTag,
      onChangeHandle,
      isRenderButton,
      getAsyncOptions
    } = this
    // console.log(this)

    // 子内容
    const childrenContent = []

    // 最终拿的options
    let newOptions = []

    // 组合选项
    if (group) {
      // 这里先不考虑异步options，后面再实现
      newOptions = $attrs.options

      // 组合子选项VNode
      const optionsVNodes = this.renderOptionsVNode(
        `el-${type}${isRenderButton($attrs)}`,
        newOptions
      )
      childrenContent.push(...optionsVNodes)
    } else {
      childrenContent.push(...$slots.default || [])
    }

    return h(componentTag, {
      props: {
        value: this.newValue,
        ...this.$attrs
      },
      on: {
        input: onChangeHandle,
        ...this.$listeners
      },
      ref: getAttrsName($attrs, 'ref-name') || 'elCheckbox'
    }, childrenContent)
  }
}
```






支持修饰符，最常见的就是当我们使用number类型输入框但输入框最后给定的值是字符串，这个时候可以通过添加`.number`修饰符内部帮你自动转换为number类型

```html
<dynamic-input
  v-model="testVal"
  type="number"
 />
<!-- testVal => 'string' -->

<dynamic-input
  v-model.number="testVal"
  type="number"
 />
<!-- testVal => 'number' -->
```

表单支持的修饰符

- number： 通过 `parseFloat()`解析之后的字符串数值
- trim： 过滤首尾空白字符
- lazy： 将事件触发从input从而转为在「 类似change」在值确认之后响应(当输入法没有按下时不做值变动可以使用这个)

![lzay修饰符](./imgs/1.png)

## Input Events

支持`el-input`所有事件

```html
<template>
  <dynamic-input
    ref="dynamicInput"
    v-model.lazy="testVal"
    :type="testType"
    @change="inputMethod"
    @input="inputMethod"
  />
</template>
```

## Input Methods

支持`el-input`所有方法，前提得通过ref去引用`dynamic-input`组件，组件封装的`el-input`默认取名`elInput`

```vue
<template>
  <dynamic-input
    ref="dynamicInput
    value="test"
  />
</template>

<script>
export default {
  mounted() {
    // 可以获取到dynamicInput组件内封装的elInput组件
    this.$refs.dynamicInput.$refs.elInput
  }
}
</script>
```
你也可以通过定义refName去重命名内部elInput组件的ref值

```vue
<template>
  <dynamic-input
    ref="dynamicInput"
    refName="child-input'
    value="test"
  />
</template>

<script>
export default {
  mounted() {
    // 可以获取到dynamicInput组件内封装的elInput组件
    this.$refs.dynamicInput.$refs['child-input']
    const {
      dynamicInput
    } = this.$refs
    // 可以通过去调用el-input组件提供方法
    dynamicInput.$refs['child-input'].focus() 
  }
}
</script>
```

## Input Slots

支持所有`el-input`提供的内置slot

```vue
<template>
  <dynamic-input
    ref="dynamicInput"
    refName="child-input'
    value="test"
  >
    <template slot="prepend">Http://</template>
    <i slot="prefix" class="el-input__icon el-icon-search" />
    <i slot="suffix" class="el-input__icon el-icon-date" />
  </dynamic-input>
</template>
```

## Autocomplete

autocomplete 是一个可带输入建议的输入框组件。可用于远程搜索， 通过传递`is-autocomplete`来确定是否渲染`el-autocomplete`组件

> 注意⚠：这里的is-autocomplete是用来判断是否渲染el-autocomplete组件的，并不是input提供的autocomplete属性

|      **参数**       |                           **说明**                           | **类型**   | **默认值** |
| :-----------------: | :----------------------------------------------------------: | ---------- | :--------: |
|  `is-autocomplete`  |                  是否渲染成autocomplete组件                  | `Boolean`  |  `false`   |
| `fetch-suggestions` | `返回输入建议的方法，仅当你的输入建议数据 resolve 时，通过调用 callback(data:[]) 来返回它` | `Function` |    必传    |

详情请查看Element-Ui官网 https://element.eleme.cn/#/zh-CN/component/input
