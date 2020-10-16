<template>
  <el-container>
    <el-dialog title="关于" :visible="aboutVisible" width="25%" :before-close="handleClose" :close-on-click-modal="false"
               append-to-body>
      <el-row>系统：监狱会见系统</el-row>
      <el-row>开发单位：辽宁纬恒科技发展有限公司</el-row>
    </el-dialog>
  </el-container>
</template>

<script>
  export default {
    name: "About",
    props: ['aboutVisible'],
    methods: {
      handleClose() {
        this.$emit('update:aboutVisible', false)
      }
    }
  }
</script>

<style scoped>

</style>
