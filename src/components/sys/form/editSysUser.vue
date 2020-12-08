<template>
  <div>
    <el-dialog :title="title" :visible="isSysUserEditShow" @open="handleOpen" :modal="false" width="50%"
               :before-close="handleClose">
      <el-row>
        <el-form :model="ruleForm" status-icon :rules="rules" ref="form" v-loading="$store.state.loading"
                 label-width="100px">
          <el-row>
            <el-col :span="11">
              <el-form-item label="账号:" prop="username">
                <el-input :disabled="isDisabled" v-model="ruleForm.username"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="密码:" prop="password">
                <el-input type="password" v-model="ruleForm.password"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="姓名:" prop="name">
                <el-input v-model="ruleForm.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="联系方式:" prop="phone">
                <el-input v-model="ruleForm.phone"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="roleIsShow">
            <el-col :span="11">
              <el-form-item label="角色:" prop="roleId">
                <el-select style="width: 100%" v-model="ruleForm.roleId" placeholder="请选择角色">
                  <el-option :label="item.name" :value="item.id" :key="item.id" v-for="item in roleList"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="22">
              <el-form-item label="备注:" prop="remark">
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
    props: ['isSysUserEditShow', 'sysUserInfo', 'sysTitle'],
    data() {
      const validateUsername = async (rule, value, callback) => {
        if (!value) return callback(new Error('账号不能为空！'));
      }
      const validatePassword = async (rule, value, callback) => {
        if (!value) return callback(new Error("密码不能为空！"));
      }
      const validateName = async (rule, value, callback) => {
        if (!value) return callback(new Error("姓名不能为空！"));
      }
      const validateRole = async (rule, value, callback) => {
        if (!value) return callback(new Error("请选择角色！"));
      }
      return {
        url: '/sysUser/sys-user',
        title: '',
        roleList: [],
        roleIsShow: true,
        isDisabled: false,
        ruleForm: {
          username: "",
          password: '',
          name: '',
          roleId: '',
          phone: '',
          remark: ''
        },
        rules: {
          username: [
            {validator: validateUsername, trigger: 'blur'}
          ],
          password: [
            {validator: validatePassword, trigger: 'blur'}
          ],
          name: [
            {validator: validateName, trigger: 'blur'}
          ],
          roleId: [
            {validator: validateRole, trigger: 'blur'}
          ],
        },
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
        if (this.sysTitle === '0') await this._post(this.url + "/addUser", this.ruleForm);
        else if (this.sysTitle === '3') await this._post(this.url + "/upUserPassword", this.ruleForm);
        else await this._post(this.url + "/upUser", this.ruleForm);
        await this.handleClose();
        this.$emit("refGetAllUserInfo");
      },
      async handleClose() {
        this.ruleForm = {};
        this.$emit("update:isSysUserEditShow", false);
      },
      async handleOpen() {
        const {data: res} = await this._post("/sysRole/sys-role/getSysRoleInfo");
        this.roleList = res.list;
        if (this.sysTitle === '0') this.title = '新建用户';
        else if (this.sysTitle === '3') {
          this.title = '修改密码';
          this.roleIsShow = false;
          this.isDisabled = true;
          let {data: res} = await this._post(this.url + '/findUserById', {'id': this.sysUserInfo.id});
          this.ruleForm = res;
        } else {
          this.title = '修改用户';
          this.ruleForm = {...this.sysUserInfo};
        }
      }
    }
  }
</script>
