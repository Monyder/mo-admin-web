<template>
  <div>
    <el-dialog :title="title" :visible="isInfoSetEditShow" @open="handleOpen" :modal="false" width="50%"
               :before-close="handleClose">
      <el-row>
        <el-form :model="ruleForm" status-icon :rules="rules" ref="form" v-loading="$store.state.loading"
                 label-width="100px">
          <el-row>
            <el-col :span="11">
              <el-form-item label="编码:" prop="code">
                <el-input :disabled="isDisabled" v-model="ruleForm.code"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="名称:" prop="name">
                <el-input v-model="ruleForm.name"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="是否为系统表:" prop="isSysName">
                <el-select style="width: 100%" v-model="ruleForm.isSysName" placeholder="请选择是否为系统信息集">
                  <el-option label="否" value="否"></el-option>
                  <el-option label="是" value="是"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="字符集:" prop="characterSet">
                <el-select style="width: 100%" v-model="ruleForm.characterSet" placeholder="请选择字符集">
                  <el-option label="utf8" value="utf8"></el-option>
                  <el-option label="utf8mb4" value="utf8mb4"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="22">
              <el-form-item label="注释:" prop="remark">
                <el-input :disabled="isDisabled" type="textarea" :rows="3" v-model="ruleForm.remark"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-row>
      <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose">取 消</el-button>
                <el-button type="primary" @click="subSaveSysUser">确 定</el-button>
          </span>
    </el-dialog>
  </div>
</template>
<style>

</style>
<script>
  export default {
    props: ['isInfoSetEditShow', 'sysInfoSet', 'sysTitle'],
    data() {
      const validateCode = async (rule, value, callback) => {
        if (!value) return callback(new Error('信息集编码不能为空！'));
      }
      const validateName = async (rule, value, callback) => {
        if (!value) return callback(new Error("信息集名称不能为空！"));
      }
      return {
        url: '/sysUser/sys-user',
        title: '',
        isDisabled: false,
        ruleForm: {
          code: '',
          name: '',
          isSysName: '否',
          characterSet: 'utf8',
          remark: ''
        },
        rules: {
          code: [
            {validator: validateCode, trigger: 'blur'}
          ],
          name: [
            {validator: validateName, trigger: 'blur'}
          ]
        }
      }

    },
    methods: {
      async subSaveSysUser() {
        let valid = await this.$refs.form.validate().catch(() => {
        });
        if (!valid) return;
        else await this.handleSave();
      },
      async handleSave() {
        if (this.sysTitle === '0') await this._post(this.$parent.url + "/addInfoSet", this.ruleForm);
        else await this._post(this.url + "/upUser", this.ruleForm);
        await this.handleClose();
        this.$emit("refHandleGetInfo");
      },
      async handleClose() {
        this.ruleForm = {};
        this.ruleForm.isSysName = '否';
        this.ruleForm.characterSet = 'utf8';
        this.$emit("update:isInfoSetEditShow", false);
      },
      async handleOpen() {
        if (this.sysTitle === '0') this.title = '新建信息集';
        else {
          this.title = '修改信息集';
          this.ruleForm = {...this.sysInfoSet};
        }
      }
    }
  }
</script>
