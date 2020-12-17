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
        <el-table-column align="center" prop="code" label="编码"></el-table-column>
        <el-table-column align="center" prop="name" label="名称"></el-table-column>
        <el-table-column align="center" prop="isSysName" label="是否为系统信息集"></el-table-column>
        <el-table-column align="center" prop="characterSet" label="字符集"></el-table-column>
        <el-table-column align="center" prop="remark" label="注释"></el-table-column>
        <el-table-column align="center" label="操作" v-if="$store.state.isAuthority">
          <template slot-scope="scope">
            <el-tooltip :open-delay="700" effect="light" content="配置" placement="top">
              <el-button type="warning" @click="handleConfig(scope.$index, scope.row)"
                         icon="el-icon-setting" size="mini"/>
            </el-tooltip>
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
    <edit-info-set :isInfoSetEditShow.sync="isInfoSetEditShow" :sysTitle="sysTitle"
                   @refHandleGetInfo="handleGetInfo"
                   :sysInfoSet="sysInfoSet"></edit-info-set>
  </div>
</template>

<script>
  import editInfoSet from './form/editInfoSet'

  export default {
    components: {editInfoSet},
    data() {
      return {
        url: '/sysInfoSet/sys-info-set',
        formInline: {},
        tableData: [],
        sysInfoSet: {},
        sysTitle: '',
        isInfoSetEditShow: false
      }
    },
    mounted() {
      this.handleGetInfo();
    },
    methods: {
      async handleGetInfo() {
        let {data: res} = await this._get(this.url + '/findSysInfoSet');
        this.tableData = res.records;
      },
      async handleConfig(index, row) {

      },
      async handleDelete(index, row) {
        let isConfirm = await this.$confirm("此删除将会删除表中所有数据，并且不会恢复，确认删除？", '提示', {type: 'warning'}).catch(() => {
        });
        if (!isConfirm) return;
        await this._post(this.url + '/delInfoSetByCode', {"code": row.code});
        await this.handleGetInfo();
      },
      async handleEdit(index, row) {
        this.sysUserInfo = row;
        this.sysTitle = '1';
        this.isInfoSetEditShow = true;
      },
      async handleAdd() {
        this.sysTitle = '0';
        this.isInfoSetEditShow = true;
      }
    }
  }
</script>

<style>

</style>