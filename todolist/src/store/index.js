import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    matterName: "Beige",
    matterList: [],
    nextId: 5, // 下一个事项的id
    key: 0 // tab的状态 0: 全部 1: 已完成 2: 未完成
  },
  mutations: {
    init(state, list) {
      state.matterList = list;
    },
    //
    inputValue(state, name) {
      state.matterName = name;
    },

    // 添加事项
    addTodoList(state, name) {
      state.matterList.push({
        id: state.nextId++,
        done: false,
        info: name
      });
      state.matterName = "";
    },

    // 删除事项
    deleteTodoList(state, key) {
      state.matterList.splice(key, 1);
    },

    // 修改事项的状态
    changeTodoStatus(state, item) {
      let index = state.matterList.findIndex(x => x.id === item.id);
      state.matterList.splice(index, 1, item);
    },

    // 更改事项的选项
    changeTodoBtn(state, key) {
      state.key = key;
    },

    // 清除已完成事项
    clearDone(state) {
      let list = state.matterList;
      state.matterList = list.filter(x => !x.done);
    }
  },
  actions: {
    // 获取数据
    getMatterData() {
      axios.get("/list").then(res => {
        this.commit("init", res.data.list);
      });
    }
  },
  getters: {
    // 剩余事项
    todoListLength(state) {
      return state.matterList.filter(x => !x.done).length;
    },

    // 事项类型
    matterList(state) {
      let type = state.key,
        list = state.matterList;
      switch (type) {
        case 0:
          return list;
        case 1:
          return list.filter(x => !x.done);
        default:
          return list.filter(x => x.done);
      }
    }
  }
});
