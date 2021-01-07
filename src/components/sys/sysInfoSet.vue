<template>
  <div>
    <el-row style="margin-top: 20px">
      <div style="float: left;margin-left: 50px;" v-if="$store.state.isAuthority">
        <el-button type="success" size="medium" @click="handleAdd">新建</el-button>
      </div>
      <div>
        <el-form :model="form" class="form-inline" label-width="100px">
          <el-col :span="5" :push="16">
            <el-form-item>
              <el-input v-model="form.name" prefix-icon="el-icon-search" placeholder="搜索"
                        @input="handleGetInfo"
                        @keyup.enter.native="handleGetInfo"></el-input>
            </el-form-item>
          </el-col>
        </el-form>
      </div>
    </el-row>
    <el-row style="margin-top: 10px">
      <el-table highlight-current-row :data="tableData" v-loading="$store.state.loading">
        <el-table-column align="center" type="index" label="序号"></el-table-column>
        <el-table-column align="center" prop="code" label="编码"></el-table-column>
        <el-table-column align="center" prop="name" label="表名"></el-table-column>
        <el-table-column align="center" prop="isSysName" label="是否是系统表"></el-table-column>
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
    <el-row class="table_pagination">
      <el-pagination background layout="prev, pager, next"
                     hide-on-single-page
                     :current-page="currentPage"
                     :page-size="pageSize"
                     :total="total"
                     @current-change="hendlerCurrentChange"></el-pagination>
    </el-row>
  </div>
</template>

<script>
  import editInfoSet from './edit/editInfoSet'

  export default {
    components: {editInfoSet},
    data() {
      return {
        url: '/sysInfoSet/sys-info-set',
        tableData: [],
        sysInfoSet: {},
        total: 0,
        pageSize: 10,
        currentPage: 0,
        sysTitle: '',
        isInfoSetEditShow: false,
        form: {
          name: '',
        },
      }
    },
    mounted() {
      this.handleGetInfo();
    },
    methods: {
      async handleGetInfo(code) {
        let {data: res} = await this._post(this.url + '/findSysInfoSet', {
          'pageNum': this.currentPage,
          'pageSize': this.pageSize,
          'code': code
        });
        this.tableData = res.records;
        this.currentPage = res.current;
        this.pageSize = res.size;
        this.total = res.total;
      },
      async hendlerCurrentChange(currentPage) {
        if (currentPage !== this.currentPage) this.currentPage = currentPage;
        await this.handleGetInfo();
      },
      async handleConfig(index, row) {
        const {data: res} = await this._post('/sysMenu/sys-menu/getSysMenuByNodePath', {'nodePath': 'sysInfoItem'});
        this.addMenuDevToRouter(res);
        await this.$router.push({path: '/home/sysInfoItem', query: {infoSetcode: row.code}}).catch((err) => {
        });
      },
      async handleDelete(index, row) {
        let isConfirm = await this.$confirm("此删除将会删除表中所有数据，并且不会恢复，确认删除？", '提示', {type: 'warning'}).catch(() => {
        });
        if (!isConfirm) return;
        await this._post(this.url + '/delInfoSetByCode', {"code": row.code});
        await this.handleGetInfo();
      },
      async handleEdit(index, row) {
        this.sysInfoSet = row;
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