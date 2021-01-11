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
      <el-dropdown class="header_operation" @command="handleGetMenuCommandDev" v-if="$store.state.dev">
        <span>
          <i class="el-icon-s-tools"/>
          <span class="header_dropdown_title">
            控制面板
            <i class="el-icon-arrow-down"/>
          </span>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="menu in menuList" :icon="menu.nodeIconcls" :command="menu">
            {{menu.nodeName}}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <el-dropdown class="header_operation" @command="handleCommand">
        <span>
          <i class="el-icon-s-custom"/>
          <span class="header_dropdown_title">
            {{username}}
            <i class="el-icon-arrow-down"/>
          </span>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item icon="el-icon-key" command="editPassWord">修改密码</el-dropdown-item>
          <el-dropdown-item icon="el-icon-top-left" command="logout">注销</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div style="clear: both"></div>
    <edit-sys-user :isSysUserEditShow.sync="formVisible" :sysTitle="sysTitle"
                   :sysUserInfo="sysUserInfo" @refGetAllUserInfo="refGetAllUserInfo"></edit-sys-user>
  </div>
</template>

<script>
  import editSysUser from "../sys/edit/editSysUser"

  export default {
    name: "TopHeader",
    components: {editSysUser},
    props: ['leftCollapse'],
    data() {
      return {
        sysTitle: '',
        username: '',
        sysUserInfo: {},
        menuList: [],
        formVisible: false
      }
    },
    mounted() {
      this.username = sessionStorage.getItem('username');
      this.sysUserInfo.id = sessionStorage.getItem('id');
      this.handleGetMenuDev();
    },
    methods: {
      unfoldOrFold() {
        this.$emit('update:leftCollapse', !this.leftCollapse)
      },
      async handleGetMenuDev() {
        const {data: res} = await this._post('/sysMenu/sys-menu/getSysMenuByDev');
        this.menuList = res;
      },
      handleGetMenuCommandDev(command) {
        this.addMenuDevToRouter(command);
        this.$emit('addTabProxy', command.nodeName, '/home/' + command.nodePath);
      },
      handleCommand(command) {
        if (command == 'editPassWord') {
          this.sysTitle = '3';
          this.formVisible = true;
        }
        if (command == 'logout') {
          this.refGetAllUserInfo();
        }
      },
      refGetAllUserInfo() {
        this.clearCookie();
        this.clearRouteAndMenu();
        sessionStorage.clear();
        this.$router.replace({path: '/'}).catch(err => {
        })
      }

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
