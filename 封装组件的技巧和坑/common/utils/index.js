/**
 * @description: 解决$attrs并不会自动将kebab-case转换为camelCase的问题
 * @param {Object} $attrs
 * @param {String} name
 * @return {*} camelCase风格的name
 */
export function getAttrsName($attrs, name) {
  const replaceKebabReg = /-+([A-z])/g
  const camelCaseName = name.replace(replaceKebabReg, (execStr, $1) => {
    return $1.toUpperCase()
  })
  return $attrs[camelCaseName]
}

/**
 * @description: 判断数据类型
 * @param {any} val
 * @return {Sting} isType(fun) => 'Function'
 */
export function isType(val) {
  const typeStr = Object.prototype.toString.call(val)
  const reg = /\[.*([A-Z][a-z]+)\]/g
  const [group] = [...(typeStr.matchAll(reg) || [])]
  const ret = group[1]
  return ret
}
