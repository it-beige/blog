import SlotContent from './slotContent'
import request from '@/utils/request'
request.defaults.timeout = 15000
import { deepClone } from '@/utils'
const defaultProps = {
  label: 'label',
  value: 'value',
  children: 'children'
}
export default {
  name: 'DynamicSelect',
  componentName: 'DynamicSelect',
  components: { SlotContent },
  inheritAttrs: false,
  inject: {
    jlFormSubject: { default: null }
  },
  props: {
    value: {
      type: [String, Boolean, Number, Array],
      required: true,
    },
    disabled: Boolean,
    readonly: Boolean,
    // 备选项
    options: {
      type: Array,
      default() {
        return []
      }
    },
    // optionsProps 备选项映射
    props: {
      type: Object,
      default: () => defaultProps
    },
    // 插槽
    slots: {
      type: Object,
      default() {
        return {}
      }
    },
    // 作用域插槽
    scopedSlots: {
      type: Object,
      default() {
        return {}
      }
    },
    // 事件
    listeners: {
      type: Object,
      default() {
        return {}
      }
    },
    // 格式化函数
    formatter: Function,
    // 类名
    className: {
      type: [String, Array]
    },
    // 自定义样式
    customStyle: Object,
    // 动态获取数据url
    url: String,
    // 动态获取数据请求方式
    method: {
      type: String,
      default: 'GET'
    },
    // 动态获取数据请求参数
    params: Object,
    // 解析接口返回的数据
    parseData: Function,
    // 是否可远程搜索
    searchable: Boolean,
    // 搜索关键字字段名
    searchKey: {
      type: String,
      default: 'label'
    },
    // 远程搜索方法 配置remote 或者searchable 可自定义远程搜索方法
    remoteMethod: Function,
    autoSelectFirst: Boolean
  },
  data() {
    return {
      // 默认事件
      defaultOn: {
        input: this.handleChange
      },
      optionsData: this.options,
      loading: false,
      oldOptionsData: null,
      type: ['Boolean', 'Number', 'String', 'Array']
    }
  },
  computed: {
    newValue: {
      // 因为Vue不能修改props传递过来的值, 所以借助新的值进行传递
      get({ value }) {
      // 对数据进行格式化
        return this.handleValueChanged(value)
      },
      set(val) {
        // 双向绑定
        this.$emit('update:value', val)
        return val
      }
    },
    onEvents() {
      return Object.assign({}, this.defaultOn, this.listeners)
    },
    bindAttrs() {
      const obj = {
        // 禁用的情况下不显示placeholder
       	placeholder: this.disabled ? '' : this.$attrs.placeholder || '请选择'
      }
      // 远程搜索功能开启再添加必要props
      if (this.searchable) {
        obj.filterable = true
        obj.remote = true
      }
      return Object.assign(
        {},
        this.$attrs,
        obj
      )
    },
    optionsProps() {
      return Object.assign({}, defaultProps, this.props)
    },
    requestOption() {
      let paramsKey = this.method.toUpperCase() === 'GET' ? 'params' : 'data'
      return {
        url: this.url,
        method: this.method,
        [paramsKey]: this.params || this.$attrs.data,
      }
    }
  },
  watch: {
    options: {
      handler(value) {
        this.optionsData = value
      },
      deep: true,
      immediate: true
    },
    requestOption: {
      handler() {
        if (this.url) {
          this.getOptionsData()
        }
      },
      deep: true
    },
  },
  created() {
    if (!Reflect.has(this.bindAttrs, 'cascade') && this.url) {
      this.getOptionsData().then(data => {
        // 自动选中第一个
        if (this.autoSelectFirst && data.length && !this.newValue) {
          const firstValue = data[0][this.optionsProps.value]
          this.$nextTick(() => {
            this.handleInputEvent(firstValue)
          })
        }
      })
    }
    if (this.jlFormSubject) {
      this.jlFormSubject.subscribe(({ init, prop, value, cascadeField }) => {
        if (prop === this.$attrs.prop) {
          if (value) {
            this.params[cascadeField] = value
            this.getOptionsData()
          } else {
            this.optionsData = []
          }
          if (!init) {
            this.newValue = null
            this.handleChange(null)
          }
        }
      })
    }
  },
  methods: {
    handleInputEvent(val) {
      this.newValue = val
      if (this.onEvents.input) {
        this.onEvents.input(val)
      }
    },
    handleChangeEvent(val) {
      if (this.onEvents.change) {
        this.onEvents.change(val)
      }
      // 处理传入选中的整个对象
      if (this.onEvents.dataChange) {
        // 多选
        let data = null
        if (this.bindAttrs.multiple) {
          data = []
          if (val && val.length) {
            data = this.optionsData.filter(i => val.includes(i[this.optionsProps.value]))
          }
        } else {
          data = this.optionsData.find(i => i[this.optionsProps.value] === val)
        }
        this.onEvents.dataChange(data)
      }
    },
    handleVisibleChange(val) {
      if (this.onEvents.visibleChange) {
        this.onEvents.visibleChange(val)
      }
      if (!val) {
        this.$nextTick(() => {
          setTimeout(() => {
            this.defaultRemoteMethod()
          }, 300)
        })
      }
    },
    // 变化处理
    handleChange(value) {
      this.$emit('input', value)
    },
      // 自定义格式化数据
    handleValueChanged(value) {
      if (this.formatter && typeof this.formatter === 'function') {
        value = this.formatter(value)
      }
      return value
    },

    // 动态拉取选项数据
    async getOptionsData(query) {
      return new Promise((resolve, reject) => {
        let {
          requestOption
        } = this;
        // 兜底校验
        if (!requestOption.url) return;
        const queryParam = Object.create(null)
        if (query) {
          queryParam[this.searchKey] = query
        }
        this.loading = true
        request({...requestOption, ...queryParam}).then(res => {
          this.loading = false
          if (this.parseData && typeof this.parseData === 'function') {
            res = this.parseData(res)
          }
          if (res.data && res.data instanceof Array) {
            this.optionsData = res.data
          } else {
            this.optionsData = []
          }
          this.$emit('getOptionsSuccess', this.optionsData)
          resolve(this.optionsData)
        }).catch(() => {
          this.optionsData = []
          this.loading = false
          reject()
        })
      })
    },

    // 远程搜索方法
    defaultRemoteMethod(query = '') {
      if (this.remoteMethod && typeof this.remoteMethod === 'function') {
        return this.remoteMethod(query)
      }
      if (query.trim()) {
        if (!this.oldOptionsData || !this.oldOptionsData.length) {
          this.oldOptionsData = deepClone(this.optionsData)
        }
        this.getOptionsData(query)
      } else {
        if (this.oldOptionsData && this.oldOptionsData.length) {
          this.optionsData = this.oldOptionsData
        }
      }
    }
  },
  render(h) {
    const self = this
    // 配置插槽
    const slots = Object.keys(self.slots).map(slotName => {
      return [h('slot-content', {
        props: {
          render: self.slots[slotName],
          data: self
        },
        slot: slotName,
        key: slotName
      })]
    })

    const { value, label, labelRender } = self.optionsProps
    // 选项格式化显示
    let labelRenderNode = null
    if (labelRender && typeof labelRender === 'function') {
      labelRenderNode = function(labelValue, op) {
        return labelRender(h, labelValue, op)
      }
    }
    // 渲染options
    const optionsVnode = self.optionsData.map((op, index) => {
      return [h('el-option', {
        attrs: {
          value: op[value],
          label: op[label],
          disabled: op.disabled
        },
        key: op.key || index
      }, labelRenderNode ? labelRenderNode(op[label], op) : null)]
    })
    return h('el-select', {
      class: self.className,
      staticClass: 'jl-full-line',
      style: self.customStyle,
      attrs: {
        ...self.bindAttrs
      },
      props: {
        value: self.newValue,
        loading: self.loading,
        remoteMethod: self.defaultRemoteMethod,
        ...self.bindAttrs
      },
      on: {
        ...self.onEvents,
        input: self.handleInputEvent,
        change: self.handleChangeEvent,
        'visible-change': self.handleVisibleChange
      },
    }, [Object.keys(this.$slots).map(s => this.$slots[s]), ...optionsVnode, ...slots])
  },
}
