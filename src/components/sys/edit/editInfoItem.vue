<template>
  <div>
    <el-dialog :title="title" :visible="isInfoItemEditShow" @open="handleOpen" :modal="false" width="50%"
               :before-close="handleClose">
      <el-row>
        <el-form :model="ruleForm" status-icon :rules="rules" ref="form" v-loading="$store.state.loading"
                 label-width="100px">
          <el-row>
            <el-col :span="11">
              <el-form-item label="字段编码:" prop="code">
                <el-input v-model="ruleForm.code"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="字段名称:" prop="name">
                <el-input v-model="ruleForm.name"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="DB:" prop="databaseType">
                <el-select style="width: 100%" v-model="ruleForm.databaseType"
                           placeholder="请选择编码类型">
                  <el-option label="mysql" value="mysql"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="数据类型:" prop="dataTypeId">
                <el-select style="width: 100%" @change="handleTrigger" v-model="ruleForm.dataTypeId"
                           placeholder="请选择数据类型">
                  <el-option :label="item.code" :value="item.id" :key="item.id"
                             v-for="item in dataTypes"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11" v-if="isLengthShow">
              <el-form-item label="长度:" prop="length">
                <el-input type="number" v-model="ruleForm.length"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" v-if="isPrecisionSetShow">
              <el-form-item label="精度:" prop="precisionSet">
                <el-input type="number" v-model="ruleForm.precisionSet"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="22">
              <el-form-item label="注释:" prop="remark">
                <el-input type="textarea" :rows="3" v-model="ruleForm.remark"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-row>
      <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose">取 消</el-button>
                <el-button type="primary" @click="handleSub">确 定</el-button>
          </span>
    </el-dialog>
  </div>
</template>
<style>

</style>
<script>
  export default {
    props: ['isInfoItemEditShow', 'sysInfoItem', 'sysTitle'],
    data() {
      const validateCode = async (rule, value, callback) => {
        if (!value) return callback(new Error('字段编码编码不能为空！'));
        if (/^[\u4e00-\u9fa5]+$/.test(value.trim())) return callback(new Error('字段编码不能输入中文！'));
      }
      const validateDataTypeId = async (rule, value, callback) => {
        if (!value) return callback(new Error('请选择数据类型！'));
      }
      return {
        title: '',
        isLengthShow: false,
        isPrecisionSetShow: false,
        dataTypes: [],
        ruleForm: {
          infosetCode: '',
          code: '',
          name: '',
          databaseType: 'mysql',
          dataTypeId: '',
          length: '',
          precisionSet: '',
          remark: ''
        },
        rules: {
          code: [
            {validator: validateCode, trigger: 'blur'}
          ],
          dataTypeId: [
            {validator: validateDataTypeId, trigger: 'blur'}
          ],
        }
      }

    },
    mounted() {
      this.handleFindDataType();
    },
    methods: {
      async handleSub() {
        let valid = await this.$refs.form.validate().catch(() => {
        });
        if (!valid) return;
        else await this.handleSave();
      },
      async handleFindDataType() {
        const {data: res} = await this._get('/sysDataType/sys-data-type/findDataType');
        this.dataTypes = res;
      },
      async handleTrigger(id) {
        this.isLengthShow = false;
        this.isPrecisionSetShow = false;
        this.dataTypes.forEach(item => {
          if (item.id === id) {
            if (item.defaultLength) {
              this.isLengthShow = true;
              this.ruleForm.length = item.defaultLength;
            }
            if (item.defaultPrecision) {
              this.isPrecisionSetShow = true;
              this.ruleForm.precisionSet = item.defaultPrecision;
            }
            return;
          }
        })
      },
      async handleSave() {
        if (this.sysTitle === '0') await this._post(this.$parent.url + "/addInfoItem", this.ruleForm);
        else await this._post(this.$parent.url + "/upInfoItem", {
          'id': this.ruleForm.id,
          'name': this.ruleForm.name,
          'remark': this.ruleForm.remark
        });
        await this.handleClose();
        this.$emit("refHandleGetInfo");
      },
      async handleClose() {
        for (let key in this.ruleForm) {
          if (key === 'databaseType') {
            this.ruleForm[key] = 'mysql'
            continue;
          }
          this.ruleForm[key] = '';
        }
        this.isLengthShow = false;
        this.isPrecisionSetShow = false;
        this.$emit("update:isInfoItemEditShow", false);
      },
      async handleOpen() {
        if (this.sysTitle === '0') {
          this.title = '添加字段';
          this.ruleForm.infosetCode = this.$parent.infoSetCode;
        } else {
          this.title = '修改字段';
          this.ruleForm = {...this.sysInfoItem};
          this.isDisabled = true;
        }
      }
    }
  }
</script>
