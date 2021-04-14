// 用于处理插槽
export default {
  name: 'SlotContent',
  functional: true,
  props: {
    render: {
      type: Function,
      require: true
    },
    data: Object
  },
  render: (h, ctx) => {
    return ctx.props.render(h, ctx.props.data)
  }
}
