<template>
  <div>
    <el-row :gutter="15" class="table_container" style="margin-top: 20px">
      <el-col :span="5" class="table_left_container">
        <el-card shadow="hover" style="margin-bottom:10px">
          <el-row>
            <el-tree :data="treeData" node-key="id" default-expand-all highlight-current :expand-on-click-node="false"
                     ref="tree" @node-click="selTreeNode = $event" :filter-node-method="handleTreeNodeFilter"
                     :props="defaultProps"/>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="19">
        <el-row style="margin-bottom:10px" v-if="$store.state.isAuthority">
          <div class="input_container">
            <el-button type="success" @click="handleAdd" size="medium">新建</el-button>
          </div>
        </el-row>
        <el-row>
          <el-table highlight-current-row :data="tableData" v-loading="$store.state.loading">
            <el-table-column align="center" type="index" width="120" label="序号"></el-table-column>
            <el-table-column align="center" prop="nodeName" width="140" label="菜单名称"></el-table-column>
            <el-table-column align="center" prop="nodePidName" width="140" label="父级名称"></el-table-column>
            <el-table-column align="center" prop="roderCode" width="120" label="排序号"></el-table-column>
            <!--<el-table-column align="center" prop="nodeTypeName" width="100" label="节点类型"></el-table-column>-->
            <el-table-column align="center" prop="nodePath" label="节点名称"></el-table-column>
            <el-table-column align="center" prop="nodeComponent" label="节点路径"></el-table-column>
            <el-table-column align="center" prop="nodeIconcls" label="节点图标">
              <template slot-scope="scope">
                <el-tooltip :open-delay="700" effect="light" :content="scope.row.nodeIconcls" placement="top">
                  <i :class="scope.row.nodeIconcls"></i>
                </el-tooltip>
              </template>
            </el-table-column>
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
      </el-col>
    </el-row>
    <edit-menu :isShow.sync="isShow" :setTitle="setTitle" :menuData="menuData"
               @refGetMenuInfo="getSysMenu" @handleAppendNode="handleAppendNode"
               @handleUpdateNode="handleUpdateNode"></edit-menu>
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
  import editMenu from './edit/editMenu'

  export default {
    components: {editMenu},
    data() {
      return {
        url:'/sysMenu/sys-menu',
        tableData: [],
        treeData: [],
        total: 0,
        pageSize: 10,
        selTNCIdArray: [],
        currentPage: 0,
        selTreeNode: {},
        isShow: false,
        menuData: {},
        setTitle: '',
        defaultProps: {
          children: 'children',
          label: 'label'
        },
      }
    },
    mounted() {
      this.getSysMenu();
    },
    watch: {
      selTreeNode(val) {
        this.currentPage = 1;
        this.selTNCIdArray = [];
        this.selfAndAllChildrenIdArray(val);
        this.getSysMenuByNodePid();
      },
    },
    methods: {
      async getSysMenu() {
        let {data: res} = await this._post(this.url + '/getSysMenu');
        const assembleMenus = this.assembleMenus(res);
        this.treeData = assembleMenus;
      },
      selfAndAllChildrenIdArray(treeNode) {
        if (!treeNode || !treeNode.id) return;
        this.selTNCIdArray.push(treeNode.id);
        if (!treeNode.children || treeNode.children.length === 0) return;
        let children = treeNode.children;
        if (treeNode.id === '1' && treeNode.label == '根目录') {
          children.forEach((treeNode) => {
            this.selTNCIdArray.push(treeNode.id);
          })
          return;
        }
        children.forEach((treeNode) => {
          this.selfAndAllChildrenIdArray(treeNode)
        })
      },
      async hendlerCurrentChange(currentPage) {
        if (currentPage !== this.currentPage) this.currentPage = currentPage;
        await this.getSysMenu();
      },
      async getSysMenuByNodePid() {
        const {data: res} = await this._post(this.url + '/getSysMenuByNodePid', {
          'pageNum': this.currentPage,
          'pageSize': this.pageSize,
          'ids': this.selTNCIdArray
        });
        this.tableData = res.list;
        this.total = res.total;
        this.pageSize = res.pageSize;
        this.currentPage = res.pageNum;
      },
      handleTreeNodeFilter(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      async handleEdit(index, row) {
        this.setTitle = "1"
        this.isShow = true;
        this.menuData = row;
      },
      async handleAdd() {
        if (!this.selTreeNode.id || !this.selTreeNode.label) return this.$message({
          message: '请先选择父级菜单！',
          type: 'warning'
        });
        this.setTitle = "0";
        this.menuData = {
          nodePid: this.selTreeNode.id,
          label: this.selTreeNode.label,
          code: this.selTreeNode.roderCode
        };
        this.isShow = true;
      },
      async handleAppendNode(data) {
        this.selTNCIdArray.push(data.id);
        await this.getSysMenuByNodePid();
      },
      async handleUpdateNode() {
        await this.getSysMenuByNodePid();
      },
      async handleDelete(index, row) {
        let isConfirm = await this.$confirm("确认删除？", '提示', {type: 'warning'}).catch(() => {
        });
        if (!isConfirm) return;
        if (this.selTreeNode.children) return this.$message({
          message: '当前菜单有子集菜单，无法删除，请先删除子集菜单！',
          type: 'warning'
        });
        await this._post(this.url + "/deleteMenu", {id: row.id});
        await this.getSysMenuByNodePid();
        await this.getSysMenu();
      }
    }
  }
</script>
