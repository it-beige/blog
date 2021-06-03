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
    // 最终要渲染的组件名称
    componentTag: {
      get({ type, group, $attrs, isRenderButton }) {
        const tag = `el-${type}`
        if (group) {
          return `${tag}-${group}`
        }

        return `${tag}${isRenderButton($attrs.button)}`
      }
    },
    newOptions: {
      get($attrs) {
        return $attrs.options || []
      },
      set(newOptions) {
        this.$attrs.options = newOptions
      }
    }
  },
  watch: {
    async group(isGroup) {
      if (!isGroup) return
      this.newOptions = await this.getAsyncOptions()
    }
  },
  methods: {
    onChangeHandle(val) {
      this.newValue = val
    },
    // 是否渲染按钮类型
    isRenderButton(button) {
      return button
        ? '-button'
        : ''
    },
    renderOptionsVNode(tag, newOptions) {
      let item = {}
      return newOptions.map(o => {
        if (!isObject(o)) {
          item.label = o
        } else {
          // 提供给用户formater方法来格式化选项
          item = this.$attrs.formater &&
          this.$attrs.formater(o) ||
          o
        }

        return h(tag, {
          props: {
            ...item
          }
        }, item.text || item.label)
      })
    },
    renderSlots($slots) {
      return Object.values($slots).map(s => $slots[s])
    },
    async getAsyncOptions($attrs) {
      const {
        $http,
        getParamsKey
      } = this
      const {
        method = 'get',
        params = {},
        parseData
      } = $attrs
      const optionsUrl = getAttrsName($attrs, 'optionsUrl')
      let request
      if ($http) {
        request = $http
      }
      // 动态加载axios
      const options = await import('@/utils/request')
        .then(modlue => {
          request = modlue.default
          return request({
            url: optionsUrl,
            method,
            [getParamsKey(method)]: params
          })
        })
        .then(res => {
          return parseData && parseData(res) ||
          res.pageData ||
          res.data
        })
        .catch(err => {
          console.error(err)
        })
      return options || []
    },
    getParamsKey(method) {
      return method.toUpperCase() === 'GET' ? 'params' : 'data'
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
      // 最终拿的options
      newOptions
    } = this
    // console.log(this)

    // 子内容
    const childrenContent = []

    // 组合选项
    if (group && newOptions.length) {
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
</script>

