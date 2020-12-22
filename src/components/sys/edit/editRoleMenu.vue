<template>
  <div>
    <el-row>
      <el-col>
        <el-drawer
                :visible="drawer"
                :modal="false"
                :size="sizes"
                :direction="direction"
                @open="handleRoleMenu"
                :before-close="handleClose">
          <span style="">菜单权限</span>
          <el-card shadow="hover" class="card_role">
            <el-tree
                    :data="treeData"
                    show-checkbox
                    node-key="id"
                    default-expand-all
                    :check-on-click-node="true"
                    highlight-current
                    ref="tree"
                    :props="defaultProps">
            </el-tree>
          </el-card>
        </el-drawer>
      </el-col>
      <el-col>
      </el-col>
    </el-row>
  </div>
</template>
<style>
  .card_role {
    margin-bottom: 20px;
    margin-left: 28px;
    margin-top: 50px;
    height: 80%;
    width: 85%;
  }

</style>
<script>
  export default {
    props: ['drawer', 'roleMenuData'],
    data() {
      return {
        direction: 'rtl',
        sizes: '20%',
        treeData: [],
        ids: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
      }
    },
    methods: {
      async handleRoleMenu() {
        await this.handleMenuInfo();
        this.handleChecked();
      },
      async handleMenuInfo() {
        const res = await this._post(this.$parent.url + '/findMenuInfo', {id: this.roleMenuData.id});
        const assembleMenus = this.assembleMenus(res.data);
        if (res.msg === 'admin') {
          await this.handleDisMenu(assembleMenus);
          this.treeData = assembleMenus;
        } else this.treeData = assembleMenus;
        if (this.roleMenuData.menuIds == null || undefined) this.roleMenuData.menuIds = ",";
        this.ids = this.roleMenuData.menuIds.split(",");
      },
      handleChecked() {
        this.ids.forEach((i) => {
          const node = this.$refs.tree.getNode(i);
          if (node.isLeaf) {
            this.$refs.tree.setChecked(node, true);
          }
        })
      },
      handleDisMenu(menus) {
        menus.forEach((menu) => {
          let {children} = menu;
          if (children && children instanceof Array) {
            children = this.handleDisMenu(children);
          }
          this.$set(menu, 'disabled', true);
        })
      },
      async handleUpdateRole(ids) {
        await this._post(this.$parent.url + '/updateRoleMenu', {id: this.roleMenuData.id, menuIds: ids.join(',')});
      },
      async handleClose() {
        await this.handleUpdateRole(this.$refs.tree.getHalfCheckedKeys().concat(this.$refs.tree.getCheckedKeys()));
        this.$emit('refGetSysRoleInfo');
      }
    }
  }
</script>
  