<template>
  <div class="login_container">
    <el-row class="header_title">
      监狱会见管理系统V1.0.1
    </el-row>
    <el-row class="center_area">
      <div class="login_area">
        <el-form ref="form" :rules="rules" :model="loginForm" v-loading="$store.state.loading">
          <h3 class="login_title">会见系统</h3>
          <el-form-item prop="loginName">
            <el-input v-model="loginForm.loginName" prefix-icon="el-icon-s-custom"
                      auto-complete="off" placeholder="账号" @keyup.enter.native="submitClick"></el-input>
          </el-form-item>
          <el-form-item prop="passWord">
            <el-input show-password v-model="loginForm.passWord" prefix-icon="el-icon-key"
                      auto-complete="off" placeholder="密码" @keyup.enter.native="submitClick"></el-input>
          </el-form-item>
          <el-form-item style="width: 100%">
            <el-button type="primary" style="width: 100%" @click="submitClick">登录</el-button>
          </el-form-item>
        </el-form>
        <!--<img src="../assets/img/bg_login_form.png" height="105" width="435"
             style="position: absolute; bottom: -3px;left:0;"/>-->
      </div>
    </el-row>
  </div>
</template>
<script>
  import store from "../libs/store";

  export default {
    data() {
      return {
        url: '/sysUser/sys-user',
        rules: {
          loginName: [{required: true, message: '请输入用户名', trigger: 'blur'}],
          passWord: [{required: true, message: '请输入密码', trigger: 'blur'}]
        },
        loginForm: {
          loginName: '',
          passWord: ''
        }
      }
    },
    methods: {
      async submitClick() {
        let valid = await this.$refs.form.validate().catch(() => {
        });
        if (!valid) return;
        await this.login({
          username: this.loginForm.loginName,
          password: this.loginForm.passWord
        }, this.url + '/login');
      },
      async login(params, path) {
        let {data: res} = await this._post(path, params);
        if (res.id) sessionStorage.setItem('id', res.id);
        if (res.username) sessionStorage.setItem('username', res.username);
        if (res.name) sessionStorage.setItem('name', res.name);
        if (res.roleId) sessionStorage.setItem('roleId', res.roleId);
        if (res.phone) sessionStorage.setItem('phone', res.phone);
        await this.$router.replace("/home").catch(err => {
        });
      }
    }
  }
</script>
<style scoped>
  .login_container {
    width: 100%;
    height: 100%;
    position: fixed;
    background-image: url("../assets/img/basks.jpg");
    background-position: 50% 50%;
    background-size: cover;
    background-repeat: no-repeat;
  }

  .header_title {
    width: 100%;
    height: 195px;
    font-size: 2.4rem;
    padding-top: 58px;
    text-shadow: 0 1px 1px #ddd, 0 2px 1px #deebfc, 0 8px 5px rgba(0, 0, 0, .3);
    color: #fff;
    text-align: center;
  }

  .logo_img {
    height: 55px;
    width: 80px;
    position: relative;
    top: 14px;
  }

  .center_area {
    width: 100%;
  }

  .login_area {
    border-radius: 15px;
    margin: 30px auto;
    width: 380px;
    height: 200px;
    padding: 60px 28px 120px 28px;
    background: #fff;
    box-shadow: 0 0 25px rgb(34, 34, 34);
    position: relative;
  }

  .login_title {
    margin: 0 auto 40px auto;
    text-align: center;
    font-size: 25px;
    font-weight: 400;
  }

  .el-form-item {
    margin-bottom: 30px;
  }
</style>
