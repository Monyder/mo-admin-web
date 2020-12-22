<template>
  <el-scrollbar class="left_menu_scrollbar">
    <el-row class="logo" v-show="!isCollapse">
      <!--<img src="../../assets/img/logo.png" class="logo_img"/>-->
    </el-row>
    <el-row>
      <el-menu
        router
        :default-active="defaultActive"
        class="el-menu-vertical-demo"
        background-color="#101c29"
        text-color="#fff"
        active-text-color="#05D7FF"
        :collapse="isCollapse">
        <el-menu-item index="/home" @click="addTabProxy('首页', '/home')">
          <i class="el-icon-s-home"/>
          <span slot="title">首页</span>
        </el-menu-item>
        <el-submenu v-for="(menu,index) in $store.state.menus" :key="index" :index="index + ''">
          <template slot="title">
            <i :class="menu.iconCls"/>
            <span>{{menu.label}}</span>
          </template>
          <template v-if="menu.children && menu.children.length > 0">
            <el-menu-item v-for="child in menu.children" :key="child.index" :index="'/home/' + child.index"
                          @click="addTabProxy(child.label, '/home/' + child.index)">
              <i :class="child.iconCls"/>
              <span slot="title">{{child.label}}</span>
            </el-menu-item>
          </template>
        </el-submenu>
      </el-menu>
    </el-row>
  </el-scrollbar>
</template>

<script>
  export default {
    name: "Menu",
    props: ['isCollapse'],
    data() {
      return {
        defaultActive: this.$route.path
      }
    },
    watch: {
      $route(to) {
        this.defaultActive = to.path
      }
    },
    methods: {
      addTabProxy(title, name) {
        this.$emit('addTabProxy', title, name)
      }
    }
  }
</script>

<style scoped>
  .logo {
    text-align: center;
    padding-top: 10px;
    color: white;
    font-size: 20px;
  }

  .logo_img {
    height: 110px;
    width: 160px;
  }

  .el-menu {
    border-right: 0;
  }

  .el-menu-item:hover {
    background-color: #107D94 !important;
  }

  .left_menu_scrollbar {
    height: 100%;
  }
</style>
