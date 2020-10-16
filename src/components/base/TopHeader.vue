<template>
  <div class="header_container">
    <div style="float: left;">
      <i :class="leftCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'" @click="unfoldOrFold"/>
    </div>
    <div style="float: left;">
      <el-divider direction="vertical"/>
    </div>
    <div style="float: left;">
      <div class="header_title"></div>
    </div>
    <div style="float: right">
      <el-dropdown class="header_operation">
        <span>
          <i class="el-icon-s-custom"/>
          <span class="header_dropdown_title">
            {{userName}}
            <i class="el-icon-arrow-down"/>
          </span>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item icon="el-icon-key" command="editPassWord">修改密码</el-dropdown-item>
          <el-dropdown-item icon="el-icon-warning" command="about">关于</el-dropdown-item>
          <el-dropdown-item icon="el-icon-top-left" command="logout">注销</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div style="clear: both"></div>
    <about :aboutVisible.sync="aboutVisible"/>
  </div>
</template>

<script>
  import About from "./About";

  export default {
    name: "TopHeader",
    components: {About},
    props: ['leftCollapse'],
    data() {
      return {
        userName: '',
        formVisible: false,
        aboutVisible: false
      }
    },
    mounted() {
      this.userName = sessionStorage.getItem('userName')
    },
    methods: {
      unfoldOrFold() {
        this.$emit('update:leftCollapse', !this.leftCollapse)
      },
    }
  }
</script>

<style scoped>
  .header_container {
    width: 100%;
  }

  .el-icon-s-unfold, .el-icon-s-fold {
    font-size: 24px;
    cursor: pointer;
    margin: 5px 0;
  }

  .el-divider {
    background-color: #c0c4cc;
    height: 24px;
    margin: 5px 15px;
  }

  .header_title {
    font-size: 19px;
    font-weight: bold;
    margin: 5px 0;
  }

  .header_operation {
    height: 24px;
    margin: 5px 15px 5px 0;
  }
  .header_dropdown_title {
    cursor: pointer;
  }
</style>
