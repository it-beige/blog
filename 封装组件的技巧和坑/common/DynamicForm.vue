<template>
  <el-form
    :ref="elFormRef"
    :model="model"
    v-bind="$attrs"
  >
    <template v-for="formItem of formItemList">
      <!-- :value="_getDeepAttr(value, formItem.prop)" -->
      <dynamic-form-item
        :key="formItem.prop"
        :value="value[formItem.prop] | _formatterItemVal(value, formItem, _getDeepAttr)"
        v-bind="formItem"
        v-on="_listeners"
        @input="bindItemValue(value, formItem, $event)"
      />
    </template>
  </el-form>
</template>

<script>
import DynamicFormItem from './DynamicFormItem'

export default {
  name: 'DynamicForm',
  // 解决$listeners透传事件导致双绑问题
  model: {
    // 自定义v-model的监听事件名
    event: 'dyInput'
  },
  provide() {
    return {
      formThis: this
    }
  },
  filters: {
    /**
     * @description:
     * @param {any} curVal 当前表单的值(如果是深度属性就为空)
     * @param {Object} value form的值
     * @param {Object} item 当前表单配置项
     * @param {Function} _getDeepAttr 格式化item值的方法
     * @return {*}
     */
    _formatterItemVal: (curVal, value, item, _getDeepAttr) => {
      if (curVal) {
        return curVal
      }

      // 往下走就是深度属性的情况，需要格式化获取值

      // 提供给用户格式化value的的方法: 如trim、number等作用
      const formater = item.formatter

      return typeof formater === 'function'
        ? formater(_getDeepAttr(value, item.prop))
        : _getDeepAttr(value, item.prop)
    }
  },
  components: {
    DynamicFormItem
  },
  props: {
    value: {
      type: Object,
      required: true
    },
    formItemList: {
      type: Array,
      default: () => ([])
    },
    // 自定义elForm的ref属性
    elFormRef: {
      type: String,
      default: 'elForm'
    },
  },
  computed: {
    // 需要校验的item
    validateItem({ formItemList }) {
      return formItemList.filter(i => i.rules)
    },
    // 传递的form的数据源，用于处理深度属性校验问题
    model({ validateItem, value, isDeepPath, _getDeepAttr }) {
      const _model = { ...value }
      if (!validateItem.length) return _model

      validateItem.forEach(({ prop }) => {
        if (isDeepPath(prop)) {
          _model[prop] = _getDeepAttr(_model, prop, _getDeepAttr)
        }
      })
      return _model
    },
    // 能在dynamic-form监听的事件
    _listeners({ $listeners }) {
      // 支持往下透传的事件
      let supportEvent = ['input', 'change']
      return supportEvent.reduce((_listeners, eventName) => {
        _listeners[eventName] = $listeners[eventName] || (() => { })
        return _listeners
      }, {})
    }

  },
  created() {
    console.log(this)
  },
  methods: {
    /**
     * @description: 表单整体校验
     */
    validate(callback) {
      return this.$refs[this.elFormRef].validate(callback)
    },
    /**
     * @description: 单个字段校验
     */
    validateField(props, callback) {
      return this.$refs[this.elFormRef].validateField(props, callback)
    },
    /**
     * @description: 清除校验
     */
    clearValidate(props) {
      return this.$refs[this.elFormRef].clearValidate(props)
    },
    /**
     * @description: 表单重置，清除校验
     */
    resetFields() {
      return this.$refs[this.elFormRef].resetFields()
    },
    /**
     * @description: 是否是深度属性
     * @param {String} path
     * @return {Boolean}
     */
    isDeepPath(path) {
      return path.indexOf('.') !== -1
    },

    /**
     * @description: 深度获取属性
     * @param {Object} model 表单对象
     * @param {String} deepPath 深度属性
     * @return {any}
     */
    _getDeepAttr(model, deepPath) {
      if (!deepPath) return
      if (this.isDeepPath(deepPath)) {
        const paths = deepPath.split('.')
        let current = model
        let result = null
        for (let i = 0, j = paths.length; i < j; i++) {
          const path = paths[i]
          if (!current) break
          if (i === j - 1) {
            result = current[path]
            break
          }
          current = current[path]
        }
        return result
      } else {
        return model[deepPath]
      }
    },

    /**
     * @description: 设置深度属性
     * @param {Object} model 表单对象
     * @param {String} deepPath 深度属性
     * @param {any} val 要设置的值
     */
    _setDeepAttr(model, deepPath, val) {
      // 路径
      const paths = deepPath.split('.')
      // 目标值，后面这个值会存放符合路径下的所有属性
      const targetVal = {}
      // 陆续查找每个对象的prop
      const pathsNew = paths.concat([])
      let prop
      for (let i = paths.length - 1, j = i; i >= 0; i--) {
        prop = paths[i]
        // 最后一层要设定的值
        if (i === j) {
          targetVal[prop] = val
        } else if (i === 0) {
          // 先获取根属性的值
          const originalVal = model[prop]
          // 第一层需要直接替换的根属性
          // this.$set(model, prop, Object.assign(originalVal, targetVal))
          model[prop] = Object.assign(originalVal, targetVal)
        } else {
          // 更新每一个层级的值(去除存起来的值)
          const curDeppObj = this._getDeepAttr(model, pathsNew.join('.'))
          // 将当前层级的值存储起来
          targetVal[prop] = Object.assign({}, curDeppObj, targetVal)
          // 删除上个路径存储的值
          delete targetVal[paths[i + 1]]
        }

        // 将处理过的路径去除
        pathsNew.pop()
      }
    },

    /**
     * @description: 实现双向绑定
     * @param {Object} model 表单对象
     * @param {String} deepPath 深度属性
     * @param {any} val 要设置的值
     */
    bindItemValue(model, item, val) {
      // 深度属性需要格式化
      if (~item.prop.indexOf('.')) {
        this._setDeepAttr(model, item.prop, val)
      } else {
        model[item.prop] = val
      }

      const _model = { ...model }
      this.$emit('dyInput', _model)
    },


  }
}
</script>

<style scoped lang="scss">
</style>
