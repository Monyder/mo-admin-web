<template>
  <div>
    <el-upload action="/family/family/handlerUpload"
               ref="uploads"
               :data="imgData"
               accept=".png,.jpg,.gif,.svg"
               :auto-upload="false"
               list-type="picture-card"
               :on-preview="handlePictureCardPreview">
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>
<style>

</style>
<script>
  export default {
    name: 'reUpload',
    props: ['imageType'],
    data() {
      return {
        dialogImageUrl: '',
        dialogVisible: false,
        imgData: {
          type: this.imageType
        },
      };
    },
    methods: {
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      async handleSub(idCard) {
        this.imgData.idCard = idCard;
        this.$refs.uploads.submit();
      },
      handleClearFile(){
        this.$refs.uploads.clearFiles();
      },
    }
  }
</script>
  