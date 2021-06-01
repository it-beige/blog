// Store: 统一存储state，并且是响应式的，


// 它提供给用户一些api：commit/dispatch
let Vue


function setGetters(state, getters) {
  for (let key in getters) {
    return Object.defineProperty({}, key, {
      get () {
        let fn = Reflect.get(getters, key)
        console.log(fn);
        if (typeof fn === 'function') {
          return fn(state)
        }
        return undefined
      },
      set(key) {
        console.error(`Cannot set ${key}`)
      }
       
    })
  }
}


// function setGetters2(state, getters) {
//   let computed = {}
//   for (let key in getters) {
//     computed[key] = getters[key]
//     return Object.defineProperty(getters, key, {
//       get() {
//         return computed[key](state)
//       }
//     })
//   }
//   return computed
// }

class Store {
  constructor(options) {
    // 0.保存选项
    this._mutations = options.mutations
    this._actions = options.actions
    

  
    // 1.对state做响应式处理
    // Vue.util.defineReactive(this, 'state', {})
    // this._vm.foo = 'fooooooo'
    let computed = {}
    this._vm = new Vue({
      data() {
        return {
          // 不做代理
          $$state: options.state,
        }
      },
      computed
    })

    console.log(this);
    

    // getters
    // 可否结合计算属性
    
    // 绑定this
    this.commit = this.commit.bind(this)
    this.dispatch = this.dispatch.bind(this)
    this.getters = setGetters(
      this._vm._data.$$state,
      options.getters
    )

    // for (let key in options.getters) {
    //   computed[key] = options.getters[key]
    //    Object.defineProperty(this.getters, key, {
    //     get: () => {
    //       return computed[key](this._vm._data.$$state)
    //     }
    //   })
    // }
    
    /* setInterval(() => {
      this.state.counter++
    }, 1000); */
  }

  get state() {
    return this._vm._data.$$state
  }
  set state(v) {
    console.error('请使用repalceState重置state');
  }

  // getters = setGetters(this._getters)

  // store.commit('add', 2)
  commit(type, payload) {
    // 根据type从用户配置的mutations中获取那个函数
    const entry = this._mutations[type]
    if (!entry) {
      console.error('unknown mutation！');
      return 
    }
    entry.call(this, this.state, payload)
  }
  dispatch(type, payload) {
    const entry = this._actions[type]
    if (!entry) {
      console.error('unknown action!');
      return 
    }
    // dispatch的上下文是Store实例
    entry.call(this, this, payload)
  }
}

function install(_Vue) {
  Vue = _Vue
  
  // 注册$store
  Vue.mixin({
    beforeCreate() {
      // 此处this指的是组件实例
      if (this.$options.store) {
        Vue.prototype.$store = this.$options.store;
      }
    },
  });
}




// 导出对象是Vuex
export default { Store, install }