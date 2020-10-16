<template>
  <div>
    <el-dialog :title="title" :visible="isEditShow" @open="handleOpen" :modal="false" width="50%"
               :before-close="handleClose">
      <el-row>
        <el-form :model="ruleForm" status-icon :rules="rules" ref="form" v-loading="$store.state.loading"
                 label-width="100px">
          <el-row>
            <el-col :span="11">
              <el-form-item label="角色编码:" prop="code">
                <el-input v-model="ruleForm.code"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="角色名称:" prop="name">
                <el-input v-model="ruleForm.name"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="角色状态:" prop="statusName">
                <el-select style="width: 100%" v-model="ruleForm.statusName" placeholder="请选择角色状态">
                  <el-option label="有效" value="有效"></el-option>
                  <el-option label="无效" value="无效"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="权限状态:" prop="authorityName">
                <el-select style="width: 100%" v-model="ruleForm.authorityName" placeholder="请选择权限状态">
                  <el-option label="读写" value="读写"></el-option>
                  <el-option label="只读" value="只读"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="优先级:" prop="orders">
                <el-input v-model="ruleForm.orders"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="22">
              <el-form-item label="备注:" prop="remark">
                <el-input type="textarea" :rows="3" v-model="ruleForm.remark"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-row>
      <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose">取 消</el-button>
                <el-button type="primary" @click="subSave">确 定</el-button>
          </span>
    </el-dialog>
  </div>
</template>
<style>

</style>
<script>
  export default {
    props: ['isEditShow', 'roleData', 'sysTitle'],
    data() {
      const validateCode = async (rule, value, callback) => {
        if (!value) return callback(new Error('角色编码不能为空！'));
        if (/^[\u4e00-\u9fa5]+$/.test(value.trim())) return callback(new Error('角色编码不能输入中文！'));
      }
      const validateName = async (rule, value, callback) => {
        if (!value) return callback(new Error("角色名称不能为空！"));
      }
      const validateStatusName = async (rule, value, callback) => {
        if (!value) return callback(new Error("请选择角色状态！"));
      }
      const validateAuthorityName = async (rule, value, callback) => {
        if (!value) return callback(new Error("请选择权限状态！"));
      }
      const validateOrders = async (rule, value, callback) => {
        if (!value) return callback(new Error("优先级不能为空！"));
        if (!Number.isInteger(parseInt(value))) return callback(new Error('排序号必须为数字值'));
      }
      return {
        title: '',
        url: '/unit/unit',
        areaList: [],
        ruleForm: {
          code: '',
          name: '',
          statusName: '',
          authorityName: '',
          orders: '',
          remark: ''
        },
        rules: {
          code: [
            {validator: validateCode, trigger: 'blur'}
          ],
          name: [
            {validator: validateName, trigger: 'blur'}
          ],
          statusName: [
            {validator: validateStatusName, trigger: 'blur'}
          ],
          authorityName: [
            {validator: validateAuthorityName, trigger: 'blur'}
          ],
          orders: [
            {validator: validateOrders, trigger: 'blur'}
          ],
        },
      }

    },
    methods: {
      async subSave() {
        let valid = await this.$refs.form.validate().catch(() => {
        });
        if (!valid) return;
        else await this.handleSave();
      },
      async handleSave() {
        if (this.sysTitle === '0') await this._post(this.$parent.url + "/addRole", this.ruleForm);
        else await this._post(this.$parent.url + "/upRole", this.ruleForm);
        await this.handleClose();
        this.$emit("refRoleInfo");
      },
      async handleClose() {
        this.ruleForm = {};
        this.$emit("update:isEditShow", false);
      },
      async handleOpen() {
        if (this.sysTitle === '0') this.title = '新建角色';
        else {
          this.title = '修改角色';
          this.ruleForm = {...this.roleData};
        }
      },
    }
  }
</script>
