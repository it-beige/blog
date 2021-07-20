<template>
  <card-panel header="协议基本信息">
    <dynamic-form
      ref="dynamicForm"
      v-model="formModel"
      v-bind="formConfig"
      @input="handleInput"
      @change="handleChange"
    >
      <!-- -->
      <template #depositAgreementCustomLabel>
        <div>
          <el-link type="primary">自定义Label</el-link>
        </div>
      </template>
      <template #depositAgreementCustom="{value}">
        <el-button @click="handleSubmit">{{ value }}</el-button>
      </template>

      <template #depositAgreementDepositAmountError="{error}">
        <el-link type="danger">错误信息- {{ error }}, 点击查看详情</el-link>
      </template>
    </dynamic-form>

    <!-- <el-button @click="hanldeBtnClick">操作</el-button> -->

    <!-- <dynamic-form
      :value="testModel"
      :eventName="eventName"
      v-on:[eventName]="testModel = $event"
    /> -->

    <!-- <dynamic-form
      :value.sync="testModel"
      :value2.sync="testModel2"
    /> -->

    <!-- <dynamic-form v-model="testModel" /> -->

  </card-panel>
</template>

<script>
import DynamicForm from './common/DynamicForm'
export default {
  name: 'Model',
  components: {
    [DynamicForm.name]: DynamicForm
  },
  data() {
    return {
      testModel: [],
      // eventName: 'update:newValue',
      /* testModel: {
        v1: 'Init Value',
      }, */
      formModel: {
        depositAgreement: {
          depositAmount: 100,
          businessType: 'traditionWork',
          signDate: '2021-07-18',
          custom: '自定义表单项内容'
        }
      },
      formConfig: {
        labelWidth: '100px',
        formItemList: [
          {
            label: '金额',
            type: 'text',
            prop: 'depositAgreement.depositAmount',
            rules: [
              {
                required: true,
                message: '金额不能为空',
                trigger: 'blur'
              },
              {
                validator: (rule, val, callback) => {
                  if (val < 100) {
                    return callback(new Error('金额不能小于100'))
                  }
                  return callback()
                },
                trigger: ['change', 'blur']
              }
            ]
          },
          {
            label: '协议类型',
            type: 'select',
            prop: 'depositAgreement.businessType',
            options: [
              {
                dictKey: 'traditionWork',
                dictValue: '专属办公'
              }
            ],
            props: {
              label: 'dictValue',
              value: 'dictKey'
            },
            listeners: {
              'visible-change': (isShow) => {
                console.log(isShow, 'select');
              },
            }
          },
          {
            label: '签订日期',
            type: 'date',
            prop: 'depositAgreement.signDate'
          },
          {
            label: '自定义',
            type: 'slot',
            prop: 'depositAgreement.custom'
            /* render: ({ value, $createElement: h }) => {
              return h('el-button', value)
            } */
          }
        ]
      }
    }
  },
  methods: {
    handleInput(...arg) {
      console.log(...arg, 'input');
    },
    handleChange(...arg) {
      console.log(...arg, 'change');
    },
    handleSubmit() {
      this.$refs.dynamicForm.validate()
        .then(res => {
          console.log(res) // sy-log
        })
        .catch(reason => {
          console.log(reason) // sy-log
        })
    }

  }
}
</script>
