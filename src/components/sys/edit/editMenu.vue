<template>
  <div>
    <el-dialog :title="setTitle =='0'?'新增菜单':'修改菜单'" :visible="isShow" @open="handleOpen" :modal="false" width="50%"
               :before-close="handleClose">
      <el-row>
        <el-form :model="ruleForm" status-icon :rules="rules" ref="form" v-loading="$store.state.loading"
                 label-width="100px">
          <el-row>
            <el-col :span="11">
              <el-form-item label="菜单名称:" prop="nodeName">
                <el-input v-model="ruleForm.nodeName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="父级名称:" prop="label">
                <div v-if="ruleForm.label != null">
                  <el-input v-model="ruleForm.label"
                            disabled></el-input>
                </div>
                <div v-else>
                  <el-input v-model="ruleForm.nodePidName"
                            disabled></el-input>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="排序号:" prop="roderCode">
                <el-input v-model="ruleForm.roderCode" :placeholder="ruleForm.code"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="节点图标:" prop="nodeIconcls">
                <el-input v-model="ruleForm.nodeIconcls"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="节点名称:" prop="nodePath">
                <el-input v-model="ruleForm.nodePath"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="节点路径:" prop="nodeComponent">
                <el-input v-model="ruleForm.nodeComponent"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
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

<script>
  export default {
    props: ['isShow', 'setTitle', 'menuData'],
    data() {
      const validateRodeName = async (rule, value, callback) => {
        if (!value) return callback(new Error('请输入菜单名称'));
      };
      const validateRoderCode = async (rule, value, callback) => {
        if (!value) return callback(new Error('请输入排序号'));
        if (!Number.isInteger(parseInt(value))) return callback(new Error('排序号必须为数字值'));
      };
      const validateNodeIconcls = async (rule, value, callback) => {
        if (!value) return callback(new Error('请输入节点图标'));
        if (/^[\u4e00-\u9fa5]+$/.test(value.trim())) return callback(new Error('节点图标不能输入中文！'));
      };
      const validateNodePath = async (rule, value, callback) => {
        if (!value) return callback(new Error('请输入节点名称'));
        if (/^[\u4e00-\u9fa5]+$/.test(value.trim())) return callback(new Error('节点名称不能输入中文！'));
      };
      const validateNodeComponent = async (rule, value, callback) => {
        if (!value) return callback(new Error('请输入节点路径'));
        if (/^[\u4e00-\u9fa5]+$/.test(value.trim())) return callback(new Error('节点路径不能输入中文！'));
      };
      return {
        ruleForm: {},
        title: '',
        rules: {
          nodeName: [
            {validator: validateRodeName, trigger: 'blur'}
          ],
          roderCode: [
            {validator: validateRoderCode, trigger: 'blur'}
          ],
          nodeIconcls: [
            {validator: validateNodeIconcls, trigger: 'blur'}
          ],
          nodePath: [
            {validator: validateNodePath, trigger: 'blur'}
          ],
          nodeComponent: [
            {validator: validateNodeComponent, trigger: 'blur'}
          ],

        }
      }
    },
    methods: {
      handleOpen() {
        this.ruleForm = {...this.menuData};
      },
      async handleClose() {
        this.ruleForm = {};
        this.$emit('update:isShow', false);
      },
      async subSave() {
        const valid = await this.$refs.form.validate().catch(() => {
        });
        if (!valid) return;
        if (this.setTitle === '0') {
          this.$set(this.ruleForm, 'nodePid', this.menuData.nodePid);
          const {data: res} = await this._post(this.$parent.url + '/addMenu', this.ruleForm);
          this.$emit('handleAppendNode', res);
        } else {
          const {data: res} = await this._post(this.$parent.url + '/updateMenu', this.ruleForm);
          this.$emit('handleUpdateNode');
        }
        await this.handleClose();
        this.$emit('refGetMenuInfo');
      }
    }
  }
</script>

<style scoped>

</style>