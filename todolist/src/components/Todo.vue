<template>
  <div class="todo">
    <a-input
      class="my-input"
      :value="matterName"
      placeholder="请输入任务事项"
      @change="hanlderInput"
      @keydown.enter="addTodo"
    />
    <a-button type="primary" @click="addTodo">
      添加事项
    </a-button>
    <div class="header" slot="hader">
      <a-checkbox :checked="checkAll" @change="onCheckAllTodo">
        全选
      </a-checkbox>
    </div>
    <a-list
      :bordered="bordered"
      item-layout="horizontal"
      class="dotoList-wrapper"
      :data-source="matterList"
    >
      <a-list-item slot="renderItem" slot-scope="item, index">
        <a-checkbox
          class="item-checked"
          :checked="item.done"
          @change="onCheckedChange(item, index)"
        >
        </a-checkbox>
        <br />
        <a-list-item-meta :description="item.info"> </a-list-item-meta>
        <a slot="actions" @click="dleteDoto(index)">删除</a>
      </a-list-item>
      <div class="footer" slot="footer">
        <template>
          <span data-v-26163d76="">{{ todoListLength }}条剩余</span>
          <div class="footer-btn">
            <a-button
              :type="btnType === 0 ? 'primary' : 'default'"
              @click="changeMatterType(0)"
            >
              全 部
            </a-button>
            <a-button
              :type="btnType === 1 ? 'primary' : 'default'"
              @click="changeMatterType(1)"
            >
              未完成
            </a-button>
            <a-button
              :type="btnType === 2 ? 'primary' : 'default'"
              @click="changeMatterType(2)"
            >
              已完成
            </a-button>
          </div>
          <a slot="actions" @click="clearDoneTodo">清除已完成</a>
        </template>
      </div>
    </a-list>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from "vuex";
export default {
  name: "todo",
  data() {
    return {
      //配置组件默认样式
      bordered: true,
      checkAll: false,
      // 事项类型
      btnType: 0 // 0: 全部 1: 未完成 2: 已完成
    };
  },
  created() {
    this.getMatterData();
  },
  computed: {
    ...mapState(["matterName"]),
    ...mapGetters(["todoListLength", "matterList"])
  },
  methods: {
    ...mapActions(["getMatterData"]),
    ...mapMutations([
      "inputValue",
      "addTodoList",
      "deleteTodoList",
      "changeTodoStatus",
      "changeTodoBtn",
      "clearDone"
    ]),

    //
    hanlderInput(e) {
      this.inputValue(e.target.value);
    },

    // 修改事项状态
    onCheckedChange(item) {
      let isAllChecked = true;
      item.done = !item.done;
      // this.changeTodoStatus(item);
      for (let key of this.matterList.keys()) {
        if (!this.matterList[key].done) {
          isAllChecked = false;
        }
      }
      this.checkAll = isAllChecked;
    },

    // 全选 反选
    onCheckAllTodo() {
      this.checkAll = !this.checkAll;
      for (let key of this.matterList.keys()) {
        this.matterList[key].done = this.checkAll;
      }
    },

    // 添加事项
    addTodo() {
      if (this.matterName.trim().length <= 0) {
        this.$message.warning("事项名称不能为空");
        return;
      }
      this.addTodoList(this.matterName);
    },

    // 删除事项
    dleteDoto(index) {
      this.deleteTodoList(index);
    },

    // 修改事项面板
    changeMatterType(type) {
      let btn = 0;
      switch (type) {
        case 0:
          btn = 0;
          break;
        case 1:
          btn = 1;
          break;
        default:
          btn = 2;
      }
      this.btnType = btn;
      this.changeTodoBtn(type);
    },

    // 清除已完成事项
    clearDoneTodo() {
      this.clearDone();
    }
  }
};
</script>

<style lang="less">
.todo {
  margin: 20px 50px;
}
.my-input {
  width: 500px;
  margin-right: 10px;
}

.dotoList-wrapper {
  width: 500px;
  margin-top: 10px;
  .item-checked {
    margin-right: 8px;
  }
}
.header {
  width: 500px;
  margin-top: 20px;
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.isDone {
  text-decoration: line-through;
}
</style>
