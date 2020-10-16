<template>
     
  <div>
    <el-row style="margin-top: 20px">
      <el-form :model="form" class="form-inline" label-width="100px">
        <el-row>
          <el-col :span="4">
            <el-form-item label="操作人:">
              <el-input v-model="form.name" placeholder="请输入操作人"
                        @keyup.enter.native="subform"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="操作ip:">
              <el-input v-model="form.ip" placeholder="请输入ip"
                        @keyup.enter.native="subform"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="操作功能:">
              <el-input v-model="form.func" placeholder="请输入操作功能"
                        @keyup.enter.native="subform"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="操作时间:">
              <div class="block">
                <el-date-picker
                        v-model="form.operatingTime"
                        type="daterange"
                        value-format="yyyy-MM-dd"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                </el-date-picker>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="1" :pull="1">
            <el-form-item>
              <el-button size="medium" type="success" @click="subform">查询</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="1" style="margin-left: -40px">
            <div>
              <el-form-item>
                <el-button size="medium" type="primary" @click="clears">重置</el-button>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </el-row>
    <el-row style="margin-top: 10px">
      <el-table highlight-current-row :data="tableData">
        <el-table-column align="center" type="index" label="序号" width="180"></el-table-column>
        <el-table-column align="center" prop="operator" label="操作人" width="280"></el-table-column>
        <el-table-column align="center" prop="operatingTime" label="操作时间" width="280"></el-table-column>
        <el-table-column align="center" prop="ip" label="操作ip" width="280"></el-table-column>
        <el-table-column align="center" prop="func" label="操作功能" width="380"></el-table-column>
        <el-table-column align="center" prop="remarks" label="备注"></el-table-column>
      </el-table>
    </el-row>
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
<style>

</style>
<script>
  export default {
    data() {
      return {
        url: '/sysLog/sys-log',
        tableData: [],
        total: 0,
        pageSize: 10,
        currentPage: 0,
        form: {
          name: '',
          ip: '',
          func: '',
          operatingTime: ''
        },
      }
    },
    mounted() {
      this.getAll();
    },
    methods: {
      async getAll() {
        let {data: res} = await this._post(this.url + '/findAll', {
          'pageNum': this.currentPage,
          'pageSize': this.pageSize
        });
        this.tableData = res.list;
        this.total = res.total;
        this.pageSize = res.pageSize;
        this.currentPage = res.pageNum;
      },
      async hendlerCurrentChange(currentPage) {
        if (currentPage !== this.currentPage) this.currentPage = currentPage;
        await this.getAll();
      },
      async subform() {
        let {data: res} = await this._post(this.url + '/findLogByCondition', {
          'pageNum': this.currentPage,
          'pageSize': this.pageSize,
          'name': this.form.name,
          'ip': this.form.ip,
          'func': this.form.func,
          'startOperatingTime': this.form.operatingTime[0],
          'endOperatingTime': this.form.operatingTime[1],
        });
        this.tableData = res.list;
        this.total = res.total;
        this.pageSize = res.pageSize;
        this.currentPage = res.pageNum;
      },
      async clears() {
        this.form.name = '';
        this.form.ip = '';
        this.form.func = '';
        this.form.operatingTime = '';
        await this.getAll();
      }
    }
  }
</script>
  