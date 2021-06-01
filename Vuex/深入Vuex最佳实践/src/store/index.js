import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    counter: 1
  },
  getters: {
    doubleCounter: state => {
      return state.counter * 2
    }
  },
  mutations: {
    // state从何而来
    add(state) {
      state.counter++
      console.log(this, 'mutations');
    }
  },
  actions: {
    add(ctx) {
      setTimeout(() => {
        ctx.commit('add')
        console.log(this, 'actions');
      }, 1000);
    }
  },
  modules: {
  }
})
