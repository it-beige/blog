<script>
// 供全局使用
let h
// 支持的类型
const selectInputType = [
  'input',
  'text',
  'number',
  'password',
  'email',
  'textarea'
]
// 渲染el-input提供的slot
function renderElInputSlots($scopedSlots) {
  const slots = Object.keys($scopedSlots).map(slotName => {
    return h('slot-content', {
      props: {
        render: $scopedSlots[slotName]
      },
      slot: slotName,
      key: slotName
    })
  })

  return slots
}

export default {
  name: 'DynamicInput',
  components: {
    // 懒加载「专门用来渲染el-input提供的slot的无状态组件」
    SlotContent: () => import('./slotContent')
  },
  // $attrs中的成员不显示在dom上
  inheritAttrs: false,
  props: {
    // 类型
    type: {
      default: 'text',
      validator: typeVal => {
        return selectInputType.includes(typeVal)
      }
    },
    // 绑定值
    value: {
      type: [String, Number],
      default: ''
    },
    // 是否渲染el-autocomplete组件
    isAutocomplete: {
      type: Boolean,
      default: false
    }

    // 支持el-input所有参数
  },
  computed: {
    newValue: {
      get({ value }) {
        return value
      },
      set(val) {
        this.$emit('input', val)
      }
    },
    // 最终要渲染的组件名称
    componentTag: {
      get({ isAutocomplete, $attrs }) {
        const fetchSuggestions = $attrs['fetch-suggestions']
        // fetchSuggestions 返回输入建议的方法(isAutocomplete为true时必传)
        return isAutocomplete && typeof fetchSuggestions === 'function'
          ? 'el-autocomplete'
          : 'el-input'
      }
    }
  },
  methods: {
    onInputHandle(val) {
      this.newValue = val
    }
  },
  render() {
    h = this.$createElement
    const {
      onInputHandle,
      $attrs,
      $scopedSlots,
      componentTag
    } = this

    // 配置插槽(当用户传递了el-input提供的slot才去渲染)
    let elInputSlotsVNode = []
    if (Object.keys($scopedSlots).length) {
      elInputSlotsVNode = renderElInputSlots($scopedSlots)
    }

    return h(componentTag, {
      props: {
        type: this.type,
        value: this.newValue,
        ...this.$attrs
      },
      on: {
        input: onInputHandle,
        ...this.$listeners
      },
      ref: $attrs['ref-name'] || 'elInput'
    }, elInputSlotsVNode)
  }
}
</script>

