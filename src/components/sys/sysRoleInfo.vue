<template>
  <div>
    <el-row v-if="$store.state.isAuthority">
      <div style="float: left;margin-left: 50px;margin-top: 10px">
        <el-button type="success" size="medium" @click="handleAdd">新建</el-button>
      </div>
    </el-row>
    <el-row style="margin-top: 10px">
      <el-table highlight-current-row :data="tableData" v-loading="$store.state.loading">
        <el-table-column align="center" type="index" label="序号"></el-table-column>
        <el-table-column align="center" prop="code" label="角色编码"></el-table-column>
        <el-table-column align="center" prop="name" label="角色名称"></el-table-column>
        <el-table-column align="center" prop="statusName" label="角色状态"></el-table-column>
        <el-table-column align="center" prop="menuIds" label="菜单权限">
          <template slot-scope="scope">
            <el-tooltip :open-delay="700" effect="light" content="查看菜单" placement="top">
              <el-button type="warning" @click="handleMenu(scope.$index, scope.row)" icon="el-icon-setting" size="mini"/>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="authorityName" label="权限状态"></el-table-column>
        <el-table-column align="center" prop="orders" label="优先级"></el-table-column>
        <el-table-column align="center" prop="remark" label="备注"></el-table-column>
        <el-table-column align="center" label="操作" width="280" v-if="$store.state.isAuthority">
          <template slot-scope="scope">
            <el-tooltip :open-delay="700" effect="light" content="修改" placement="top">
              <el-button type="success" @click="handleEdit(scope.$index, scope.row)"
                         icon="el-icon-edit" size="mini"/>
            </el-tooltip>
            <el-tooltip :open-delay="700" effect="light" content="删除" placement="top">
              <el-button type="danger" @click="handleDelete(scope.$index, scope.row)"
                         icon="el-icon-delete" size="mini"/>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row class="table_pagination">
      <el-pagination background layout="prev, pager, next"
                     hide-on-single-page
                     :current-page="pages.currentPage"
                     :page-size="pages.pageSize"
                     :total="pages.total"
                     @current-change="hendlerCurrentChange"></el-pagination>
    </el-row>
    <edit-role-menu :drawer.sync="isDrawer" @refGetSysRoleInfo="refGetSysRoleInfo"
                    :roleMenuData="roleMenuData"></edit-role-menu>
    <edit-role :isEditShow.sync="isEditShow" :sysTitle="sysTitle" :roleData="roleData"
               @refRoleInfo="refRoleInfo"></edit-role>
  </div>
</template>

<script>
  import editRoleMenu from './edit/editRoleMenu'
  import editRole from "./edit/editRole";

  export default {
    components: {editRoleMenu, editRole},
    data() {
      return {
        url: '/sysRole/sys-role',
        pages: {
          total: 0,
          pageSize: 10,
          currentPage: 0,
        },
        tableData: [],
        sysTitle: '',
        isDrawer: false,
        isEditShow: false,
        roleData: {},
        roleMenuData: {}

      }
    },
    mounted() {
      this.getSysRoleInfo();
    },
    methods: {
      async getSysRoleInfo() {
        let {data: res} = await this._post(this.url + '/getSysRoleInfo', {
          'pageNum': this.pages.currentPage,
          'pageSize': this.pages.pageSize
        });
        this.tableData = res.list;
        this.pages.total = res.total;
        this.pages.pageSize = res.pageSize;
        this.pages.currentPage = res.pageNum;
      },
      async handleDelete(index, row) {
        let isConfirm = await this.$confirm("确认删除？", '提示', {type: 'warning'}).catch(() => {
        });
        if (!isConfirm) return;
        await this._post(this.url + "/deleteRole", {"id": row.id});
        await this.getSysRoleInfo();
      },
      async handleEdit(index, row) {
        this.roleData = row;
        this.sysTitle = '1';
        this.isEditShow = true;
      },
      async handleMenu(index, row) {
        this.isDrawer = true;
        this.roleMenuData = row;
      },
      async handleAdd() {
        this.sysTitle = '0';
        this.isEditShow = true;
      },
      async refGetSysRoleInfo() {
        this.isDrawer = false;
        await this.getSysRoleInfo();
      },
      async refRoleInfo() {
        this.isEditShow = false;
        await this.getSysRoleInfo();
      },
      async hendlerCurrentChange(currentPage) {
        if (currentPage !== this.pages.currentPage) this.pages.currentPage = currentPage;
        await this.getSysRoleInfo();
      },
    }
  }
</script>

<style>

</style>