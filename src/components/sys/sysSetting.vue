<template>
  <div>
    <el-row style="margin-top: 20px">
      <el-form :model="form" status-icon ref="form" v-loading="$store.state.loading"
               label-width="180px">
        <el-row>
          <el-col :span="11">
            <el-form-item label="系统名称:" prop="sysName">
              <el-input v-model="form.sysName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="LOGO:" prop="faceUrlList">
              <logo-upload ref="refHandleSubFace" imageType="face"></logo-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="备注:" prop="remark">
              <el-input type="textarea" :rows="3" v-model="form.remark"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-row>
  </div>
</template>
<style>

</style>
<script>
  import logoUpload from './libs/reUpload'
  export default {
    components: {logoUpload},
    data() {
      return {
        form: {}
      }
    }
  }
</script>
  