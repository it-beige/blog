<template>
  <div class="login">
    <!-- 自定义容器 -->
    <div class="right-group">
      <div class="item">
        <h3 class="title">关注作者公众号</h3>
        <span class="desc">自学路上一起进步!</span>
        <img
          width="100%"
          src="http://resource.beige.world/imgs/gongconghao.png"
        />
      </div>
      <div class="item">
        <h3 class="title">加入前端自学交流群</h3>
        <span class="desc"
          >扫描二维码回复 <span class="inner">加群</span> 学习</span
        >
        <img width="100%" src="http://resource.beige.world/imgs/weixin.png" />
      </div>
    </div>

    <div class="table">
      <div class="optionsBox">
        <div class="options options1">
          <el-select
            v-model="filterTerm.value1"
            clearable
            placeholder="请选择合同状态"
            @change="filterStatus"
            @clear="this.value1 = null"
          >
            <el-option
              v-for="item in options1"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>

        <div class="options options2">
          <el-select
            v-model="filterTerm.value2"
            clearable
            placeholder="按照次数排序"
            @change="filterNum($event, 'cooperateNum')"
            @clear="this.value2 = null"
          >
            <el-option
              v-for="item in options2"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>

        <div class="options options3">
          <el-select
            v-model="filterTerm.value3"
            clearable
            placeholder="按照金额排序"
            @change="filterNum($event, 'amount')"
            @clear="this.value3 = null"
          >
            <el-option
              v-for="item in options3"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <el-button type="primary" @click="filterCompose">筛选</el-button>
      </div>

      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="index" width="50" label="序号">
        </el-table-column>
        <el-table-column prop="projectName" label="项目名称" width="180">
        </el-table-column>
        <el-table-column prop="status" label="状态" width="180">
        </el-table-column>
        <el-table-column prop="cooperateNum" label="合作次数">
        </el-table-column>
        <el-table-column prop="amount" label="金额"> </el-table-column>
        <el-table-column prop="createTime" label="签订时间"> </el-table-column>
      </el-table>
    </div>

    <div class="card">
      前端自学驿站
    </div>
  </div>
</template>

<script>
const R = require("ramda");
export default {
  name: "Demo",
  data() {
    return {
      filterTerm: {
        value1: null,
        value2: null,
        value3: null,
      },
      filterFns: [],
      tableData: [],
      options1: [
        {
          value: 0,
          label: "废除",
        },
        {
          value: 1,
          label: "正常"
        },
      ],
      options2: [
        {
          value: 0,
          label: "降序",
        },
        {
          value: 1,
          label: "升序"
        },
      ],
      options3: [
        {
          value: 0,
          label: "降序",
        },
        {
          value: 1,
          label: "升序"
        },
      ]
    };
  },
  created() {
    this.getData()
  },
  methods: {
    async getData() {
      let list = []
      const res = await this.axios("/list")
      this.tableData = res.data.list;
      return res.data.list
    },

    // 合同状态筛选
    filterStatus(val) {
      if (this.isNull(val) || val === '') return
      let status = val ? "正常" : "废除";
      this.filterFns.push((data) => {
        return data.filter(i => i.status === status)
      })
    },

    // 合作次数的筛选
    filterNum(val, field) {
      if (this.isNull(val)) return
      this.filterFns.push((data) => {
       return data.sort((a, b) => val ? a[field] - b[field] : b[field] - a[field])
      })
    },

    // 金额的筛选
    filterNum(val, field) {
      if (this.isNull(val)) return
      this.filterFns.push((data) => {
       return data.sort((a, b) => val ? a[field] - b[field] : b[field] - a[field])
      })
    },

    // utils
    isNull(val) {
      if (Object.prototype.toString.call(val) === "[object Null]") return true;
      return false;
    },

    isOwnProperty(obj, key) {
      if (Object.prototype.hasOwnProperty.call(obj, key) !== "[object Null]") return true;
      return false;
    },

    // 筛选操作
    async filterCompose() { // 组装函数
      if (this.filterFns.length > 0) {
        const filterFn = this.pipe(...this.filterFns)
        this.tableData = filterFn(await this.getData())
        this.filterFns.length = 0;
      } else {
        this.getData()
      }
    },

    pipe(...fns) {
       return (data) => {
         return fns.reduce((list, fn) => {
           return fn(list)
         }, data)
       }
    }
  },
  
};
</script>

<style lang="less" scoped>
.table {
  width: 60%;
  position: fixed;
  top: 280px;
  left: 55%;
  transform: translate(-50%);
}
.optionsBox {
  display: flex;
  margin-bottom: 8px;
}
.options {
  margin-right: 20px;
}
.options1 {
  margin-left: 10px;
}

.login /deep/ .ant-form {
  padding: 0 20px;
  margin-top: 105px;
}
.login {
  position: relative;
  width: 100%;
  height: 800px;
  background-color: #2b4b6b;

  .login-box {
    width: 500px;
    height: 300px;
    position: absolute;
    left: 30%;
    top: 30%;
    background-color: #fff;

    .avatar {
      background-color: #fff;
      position: absolute;
      top: -20%;
      left: 50%;
      transform: translateX(-50%);
      width: 130px;
      height: 130px;
      border-radius: 50%;
      padding: 10px;
      border: 1px solid #eee;
      box-shadow: 0 0 10px #ddd;
      .avatar-img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }

    .btn-item {
      text-align: center;
      .my-btn {
        width: 80px;
        height: 40px;
      }
    }
  }
}

// 自定义容器
.right-group {
  position: fixed;
  right: 0px;
  top: 100px;
  width: 150px;
  padding: 18px 13px;
  background-color: #fff;
  box-shadow: -1px 0 2px 0.5px rgba(0, 127, 255, 0.2);
  .item:last-child {
    margin-bottom: 0;
  }
  .item {
    text-align: center;
    font-family: Roboto, Lato, sans-serif;
    margin-bottom: 40px;
    .title {
      font-size: 15px;
      color: #007fff;
      margin: 0;
    }
    .desc {
      font-size: 12px;
      margin: 15px 0;
      .inner {
        color: #007fff;
        font-weight: 700;
      }
    }
  }
}

.card {
  position: fixed;
  top: 200px;
  left: 120px;
  color: #fff;
  font-size: 80px;
  transform: rotate(-45deg);
  box-shadow: 2px 3px 3px #ccc;
}
</style>
