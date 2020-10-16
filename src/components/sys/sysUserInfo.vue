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
                <el-table-column align="center" prop="username" label="账号"></el-table-column>
                <el-table-column align="center" prop="name" label="姓名"></el-table-column>
                <el-table-column align="center" prop="roleIdName" label="角色"></el-table-column>
                <el-table-column align="center" prop="phone" label="联系方式"></el-table-column>
                <el-table-column align="center" prop="remark" label="备注"></el-table-column>
                <el-table-column align="center" label="操作" v-if="$store.state.isAuthority">
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
        <edit-sys-user :isSysUserEditShow.sync="isSysUserEditShow" :sysTitle="sysTitle"
                       @refGetAllUserInfo="getAllUserInfo"
                       :sysUserInfo="sysUserInfo"></edit-sys-user>
    </div>
</template>

<script>
  import editSysUser from './form/editSysUser'

  export default {
    components: {editSysUser},
    data() {
      return {
        formInline: {},
        tableData: [],
        sysUserInfo: {},
        sysTitle: '',
        isSysUserEditShow: false
      }
    },
    mounted() {
      this.getAllUserInfo();
    },
    methods: {
      async getAllUserInfo() {
        let {data: res} = await this._post("/sysUser/sys-user/getAllUserInfo");
        this.tableData = res;
      },
      async handleDelete(index, row) {
        let isConfirm = await this.$confirm("确认删除？", '提示', {type: 'warning'}).catch(() => {
        });
        if (!isConfirm) return;
        await this._post("/sysUser/sys-user/delUser", {"id": row.id});
        await this.getAllUserInfo();
      },
      async handleEdit(index, row) {
        this.sysUserInfo = row;
        this.sysTitle = '1';
        this.isSysUserEditShow = true;
      },
      async handleAdd() {
        this.sysTitle = '0';
        this.isSysUserEditShow = true;
      }
    }
  }
</script>

<style>

</style>