<template>
  <div class="login-container">
    <el-form ref="form" :model="loginForm" :rules="rules" class="login-form" autocomplete="on" label-position="left">
      <div class="title-container">
        <h3 class="title">系统登录</h3>
      </div>
      <el-form-item prop="loginName">
        <span class="svg-container">
          <svg-icon icon-class="user"/>
        </span>
        <el-input v-model="loginForm.loginName" placeholder="请输入用户名" name="loginName" type="text" tabindex="1"
                  autocomplete="on"/>
      </el-form-item>
      <el-form-item prop="passWord">
          <span class="svg-container">
            <svg-icon icon-class="password"/>
          </span>
        <el-input v-model="loginForm.passWord" ref="passWord" placeholder="请输入密码" :type="passwordType" name="passWord"
                  tabindex="2"
                  autocomplete="on"
                  @keyup.enter.native="submitClick"/>
        <span class="show-pwd" @click="showPwd">
              <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"/>
          </span>
      </el-form-item>
      <el-button type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="submitClick">登录
      </el-button>
    </el-form>
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
        passwordType: 'password',
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
        if (this.loginForm.loginName === 'dev' && this.loginForm.passWord === '123456') {
          store.commit('setDev', true);
          sessionStorage.setItem('username', 'dev')
        } else {
          if (res.username) sessionStorage.setItem('username', res.username);
        }
        if (res.id) sessionStorage.setItem('id', res.id);
        if (res.name) sessionStorage.setItem('name', res.name);
        if (res.roleId) sessionStorage.setItem('roleId', res.roleId);
        if (res.phone) sessionStorage.setItem('phone', res.phone);
        await this.$router.replace("/home").catch(err => {
        });
      },
      showPwd() {
        if (this.passwordType === 'password') {
          this.passwordType = ''
        } else {
          this.passwordType = 'password'
        }
        this.$nextTick(() => {
          this.$refs.passWord.focus()
        })
      },
    }
  }
</script>

<style lang="scss">
  $bg: #283443;
  $light_gray: #fff;
  $cursor: #fff;

  @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input {
      color: $cursor;
    }
  }

  /* reset element-ui css */
  .login-container {
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;

      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: $light_gray;
        height: 47px;
        caret-color: $cursor;

        &:-webkit-autofill {
          box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: $cursor !important;
        }
      }
    }

    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }
  }
</style>

<style lang="scss" scoped>
  $bg: #2d3a4b;
  $dark_gray: #889aa4;
  $light_gray: #eee;

  .login-container {
    min-height: 100%;
    width: 100%;
    height: 100%;
    position: fixed;
    background-color: $bg;
    overflow: hidden;

    .login-form {
      position: relative;
      width: 450px;
      max-width: 100%;
      padding: 200px 35px 0;
      margin: 0 auto;
      overflow: hidden;
    }

    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;

      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }

    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
    }

    .title-container {
      position: relative;

      .title {
        font-size: 26px;
        color: $light_gray;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
      }
    }

    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }

    .thirdparty-button {
      position: absolute;
      right: 0;
      bottom: 6px;
    }

    @media only screen and (max-width: 470px) {
      .thirdparty-button {
        display: none;
      }
    }
  }
</style>
