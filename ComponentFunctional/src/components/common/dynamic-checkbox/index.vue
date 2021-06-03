<script>
// 供全局使用
let h
// 支持的类型
const checkBoxType = [
  'checkbox',
  'radio'
]

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

// 判断数据类型
const isType = (type) => (obj) => Object.prototype.toString.call(obj) === `[object ${type}]`
export const isObject = isType('Object')

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
    }
    // 支持el-radio/checkbox/checkbox-group所有参数
  },
  data() {
    return {
      newOptions: []
    }
  },
  computed: {
    newValue: {
      get({ value }) {
        return value
      },
      set(value) {
        this.$emit('change', value)
      }
    },
    // 是否渲染组合
    group({ $attrs }) {
      const {
        options
      } = $attrs
      return options || getAttrsName($attrs, 'optionsUrl')
        ? 'group'
        : ''
    },
    // 只要这三个参数有一个变动，就会触发重新计算
    requestOption({ $attrs, getParamskeyByMethod }) {
      const {
        method = 'get'
      } = $attrs
      return {
        url: getAttrsName($attrs, 'optionsUrl'),
        [getParamskeyByMethod(method)]: $attrs.params,
        method: method
      }
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
  watch: {
    // 异步获取数据
    group: {
      async handler(isGroup) {
        if (!this.isAsyncOptions({ isGroup, $attrs: this.$attrs })) {
          return
        }

        this.newOptions = await this.getAsyncOptions(this.$attrs)
      },
      immediate: true
    },
    requestOption: {
      async handler() {
        const isAsync = this.isAsyncOptions({
          isGroup: this.$attrs.isGroup,
          $attrs: this.$attrs
        })
        if (!isAsync) {
          return
        }
        this.newOptions = await this.getAsyncOptions(this.$attrs)
      },
      deep: true
    }
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {
      if (this.$attrs.options) {
        this.newOptions = this.$attrs.options
      }
    },
    onChangeHandle(val) {
      this.newValue = val
    },
    // 是否渲染按钮类型
    isRenderButton(button) {
      return button
        ? '-button'
        : ''
    },
    // 渲染optionVNode
    renderOptionsVNode(tag, newOptions) {
      let item = {}
      return newOptions.map(o => {
        if (!isObject(o)) {
          item.label = o
        } else {
          // 提供给用户formater方法来格式化选项
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
    // 渲染默认插槽内容
    renderSlots($slots) {
      return Object.values($slots).map(s => $slots[s])
    },
    // 异步获取数据
    async getAsyncOptions($attrs) {
      const {
        $http,
        requestOption
      } = this
      let request
      if ($http) {
        request = $http
      }
      // 动态加载axios
      const options = await import('@/utils/request')
        .then(module => {
          request = module.default
          return request(requestOption)
        })
        .then(res => {
          return $attrs.parseData && $attrs.parseData(res) ||
          res.pageData ||
          res.data
        })
        .catch(err => {
          console.error(err)
        })
      return options || []
    },
    // 根据method获取params的Key
    getParamskeyByMethod(method) {
      return method.toUpperCase() === 'GET' ? 'params' : 'data'
    },
    // 必须是组合且提供了optionsUrl才会被认定异步获取数据
    isAsyncOptions({ isGroup, $attrs }) {
      return isGroup && getAttrsName($attrs, 'optionsUrl')
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
      isRenderButton
    } = this

    // 子内容
    const childrenContent = []

    // 组合选项
    if (group && this.newOptions.length) {
      // 组合子选项VNode
      const optionsVNodes = this.renderOptionsVNode(
        `el-${type}${isRenderButton($attrs.button)}`,
        this.newOptions
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
</script>

