<template>
  <div>
    <el-row>
      <div style="float: left;margin-left: 50px;margin-top: 10px" v-if="$store.state.isAuthority">
        <el-button type="success" size="medium" @click="handleAdd">添加字段</el-button>
      </div>
      <div style="float: right; margin-right: 50px; margin-top: 10px">
        <el-page-header @back="handerReturnDirectory" :content="infoSetCode">
        </el-page-header>
      </div>
    </el-row>
    <el-row style="margin-top: 10px">
      <el-table highlight-current-row :data="tableData" v-loading="$store.state.loading">
        <el-table-column align="center" type="index" label="序号"></el-table-column>
        <el-table-column align="center" prop="code" label="字段"></el-table-column>
        <el-table-column align="center" prop="name" label="名称"></el-table-column>
        <el-table-column align="center" prop="dataType" label="数据类型"></el-table-column>
        <el-table-column align="center" prop="length" label="长度"></el-table-column>
        <el-table-column align="center" prop="precisionSet" label="精度"></el-table-column>
        <el-table-column align="center" prop="nullableName" label="不是NULL"></el-table-column>
        <el-table-column align="center" prop="remark" label="注释"></el-table-column>
        <el-table-column align="center" label="操作" width="300" v-if="$store.state.isAuthority">
          <template slot-scope="scope">
            <el-tooltip :open-delay="700" effect="light" content="上移" placement="top">
              <el-button type="warning" @click="handleEditTop(scope.$index, scope.row)"
                         icon="el-icon-top" size="mini"/>
            </el-tooltip>
            <el-tooltip :open-delay="700" effect="light" content="下移" placement="top">
              <el-button type="warning" @click="handleEditBottom(scope.$index, scope.row)"
                         icon="el-icon-bottom" size="mini"/>
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
    <edit-info-item :isInfoItemEditShow.sync="isInfoItemEditShow" :sysTitle="sysTitle"
                    @refHandleGetInfo="handleGetInfoItemBySetCode"
                    :sysInfoItem="sysInfoItem"></edit-info-item>
    <!--<el-row class="table_pagination">
      <el-pagination background layout="prev, pager, next"
                     hide-on-single-page
                     :current-page="currentPage"
                     :page-size="pageSize"
                     :total="total"
                     @current-change="handlerCurrentChange"></el-pagination>
    </el-row>-->
  </div>
</template>

<script>
  import editInfoItem from "./edit/editInfoItem";

  export default {
    components: {editInfoItem},
    data() {
      return {
        url: '/sysInfoItem/sys-info-item',
        tableData: [],
        sysInfoItem: {},
        infoSetCode: '',
        sysTitle: '',
        isInfoItemEditShow: false
      }
    },
    mounted() {
      this.handleGetInfoItemBySetCode();
    },
    methods: {
      async handleGetInfoItemBySetCode() {
        this.infoSetCode = this.$route.query.infoSetcode;
        if (!this.infoSetCode) {
          this.$message.error('获取不到信息集编码，请重新选择信息集编码！');
          return;
        }
        let {data: res} = await this._post(this.url + '/findInfoItemBySetCode', {
          'infoSetCode': this.infoSetCode
        });
        this.tableData = res;
      },
      async handerReturnDirectory() {
        await this.$router.push({path: '/home/sysInfoSet'}).catch((err) => {
        });
      },
      async handleDelete(index, row) {
        let isConfirm = await this.$confirm("此删除将会删除此字段，并且不会恢复，确认删除？", '提示', {type: 'warning'}).catch(() => {
        });
        if (!isConfirm) return;
        await this._post(this.url + '/delInfoItemById', {'id': row.id});
        await this.handleGetInfoItemBySetCode();
      },
      async handleEditTop(index, row) {
        await this._post(this.url + '/topMoveColumn', {'id': row.id});
        await this.handleGetInfoItemBySetCode();
      },
      async handleEditBottom(index, row) {
        await this._post(this.url + '/bottomMoveColumn', {'id': row.id});
        await this.handleGetInfoItemBySetCode();
      },
      async handleEdit(index, row) {
        this.sysInfoItem = row;
        this.sysTitle = '1';
        this.isInfoItemEditShow = true;
      },
      async handleAdd() {
        this.sysTitle = '0';
        this.isInfoItemEditShow = true;
      }
    }
  }
</script>

<style>
  .el-page-header__title {
    color: #409eff;
    font-size: 15px;
  }

  .el-page-header__content {
    color: #f56c6c;
  }

</style>