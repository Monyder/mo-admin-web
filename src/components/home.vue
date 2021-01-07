<template>
    <el-container class="container">
        <el-aside :class="{ menu_collapse: leftCollapse }" class="menu">
            <left-menu @addTabProxy="addTabProxy" :isCollapse="leftCollapse"/>
        </el-aside>
        <el-container :class="{ right_unfold: leftCollapse }" class="content">
            <el-header :class="{ right_unfold: leftCollapse }" class="header">
                <top-header :leftCollapse.sync="leftCollapse" @addTabProxy="addTabProxy"/>
            </el-header>
            <el-main :class="{ right_unfold: leftCollapse }" class="main">
                <center-main ref="centerMain"/>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
  import LeftMenu from "./base/menu";
  import TopHeader from "./base/header";
  import CenterMain from "./base/main";

  export default {
    name: "home",
    components: {LeftMenu, TopHeader, CenterMain},
    data() {
      return {
        leftCollapse: false,
        countUnread: '',
        countPendingCheckFlow: '',
        countPendingCheckDoc: '',
        countPendingReceive: '',
        isTipCountPendingReceive: false,
      }
    },
    beforeCreate() {
      /*this.$loading({
        lock: true,
        text: '加载中',
        background: 'rgba(0, 0, 0, 0.7)'
      })*/
    },
    mounted() {
      /*this.$loading().close()*/
    },

    methods: {
      addTabProxy(title, name) {
        this.$refs.centerMain.addTab(title, name);
      },
    }
  }
</script>

<style scoped>
    .container {
        width: 100%;
        height: 100%;
        position: fixed;
    }

    .menu {
        border-right: 1px solid #e6e6e6;
        width: 208px !important;
        height: 100%;
        padding-bottom: 30px;
        background-color: #101c29;
        overflow: hidden;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1000;
        -webkit-transition: margin-left .3s ease-out;
        transition: width .3s ease-out;
    }

    .content {
        width: calc(100% - 208px);
        height: 100%;
        position: fixed;
        left: 208px;
        z-index: 1000;
        -webkit-transition: all .3s ease-out;
        transition: all .3s ease-out;
    }

    .header {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-pack: justify;
        -ms-flex-pack: justify;
        justify-content: space-between;
        width: calc(100% - 208px);
        height: 60px !important;
        padding: 12px 15px;
        background-color: #fff;
        border-bottom: 1px solid #e5e7ea;
        position: fixed;
        top: 0;
        left: 208px;
        z-index: 2000;
        -webkit-transition: all .3s ease-out;
        transition: all .3s ease-out;
    }

    .main {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-pack: justify;
        -ms-flex-pack: justify;
        justify-content: space-between;
        width: calc(100% - 208px);
        height: 100%;
        padding: 12px 15px;
        border-top: 1px solid transparent;
        position: fixed;
        top: 60px;
        left: 208px;
        -webkit-transition: all .3s ease-out;
        transition: all .3s ease-out;
        overflow: hidden;
    }

    .menu_collapse {
        width: 72px !important;
    }

    .right_unfold {
        width: calc(100% - 72px);
        left: 72px;
    }
</style>
