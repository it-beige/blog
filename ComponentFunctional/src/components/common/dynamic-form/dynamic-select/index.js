import DynamicSelect from './src/select'
DynamicSelect.install = vue => {
  vue.component(DynamicSelect.componentName, DynamicSelect)
}
export default DynamicSelect
