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

    <div class="login-box">
      <!-- 头像 -->
      <div class="avatar">
        <img class="avatar-img" src="../assets/bg1.jpg" />
      </div>
      <a-form
        id="components-form-demo-normal-login"
        :form="form"
        class="login-form"
      >
        <a-form-item>
          <a-input
            v-decorator="[
              'userName',
              {
                rules: [
                  { required: true, message: 'Please input your username!' }
                ]
              }
            ]"
            placeholder="Username"
          >
            <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)" />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-input type="password" placeholder="Password">
            <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)" />
          </a-input>
        </a-form-item>
        <a-form-item class="btn-item">
          <a-button type="primary" html-type="submit" class="login-form-button my-btn" @click="loginBtn">
            Log in
          </a-button>
        </a-form-item>
      </a-form>
    </div>

    <div class="card">
      前端自学驿站
    </div>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: "Login",
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: "normal_login" });
  },
  methods: {
    loginBtn () {
      return new Promise((resolve) => {
        localStorage.setItem('USER_INFO', '{"id": "Beige"}')
        resolve();
      }).then(() => {
        this.$router.push('index')
      })
    }
  }
};
</script>

<style lang="less" scoped>
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
