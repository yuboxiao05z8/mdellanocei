<template>
  <div class="landInfo">
    <div>
      <p>数据录入</p>
      <el-button size="mini" @click="selectFile">上传文件</el-button>
      <el-button size="mini" @click="downloadTemplate">下载文件</el-button>
      <input type="file" id="fileId" class="file_input" @change="fileChange" accept=".xls,.xlsx" v-show="false">
    </div>
  </div>
</template>
<script>
export default {

  data () {
    return {
      uploadParam: []
    }
  },
  methods: {
    downloadTemplate () {
      window.location.href = this.$addDownUrl(this.$api.downloadAgentTemplate)
    },
    selectFile () {
      let domEle = document.getElementById('fileId');
      domEle.click();
    },
    fileChange () {
      let domEle = document.getElementById('fileId');
      if (domEle.files.length) {
        //选择了文件
        if (domEle.files[0].size / 1024 / 1024 > this.maxSize) {
          console.log("文件大小大于设定的值");
          this.$alertWarn(`File size is greater than ${this.maxSize}M`);
          domEle.value = "";
          return;
        }
      }
    },
    uploadFile () {
      let formData = new FormData();
      let self = this;
      let userInfo = JSON.parse(
        window.sessionStorage.getItem("userInfo") || "{}"
      );
      // formData.append("brokeId", userInfo.brokeId);
      // formData.append("userId", userInfo.userId);
      // formData.append("token", userInfo.token);
      formData.append("file", document.getElementById('fileId').files[0]);
      this.$PostFormData(self.url, formData)
        .then(res => {
          if (res.code == 0) {
            self.$notify({
              title: "success",
              message: res.msg,
              type: "success"
            });
            // console.log('456',this.fileData, self.progress.status)
          } else {
            self.$notify({
              title: "error",
              message: res.msg,
              type: "error"
            });
          }
        })
    }
  }
}
</script>
<style lang="less" scoped>
.landInfo {
  width: 50%;
  height: 300px;
  margin: 0 auto;
  background: #fff;
  padding: 20px;
  & > div {
    width: 100%;
    text-align: center;
    p {
      margin-bottom: 100px;
    }
  }
}
</style>