<template>
  <div class="upload_section">
    <template v-if="showType==0">
      <span class="file_name" v-if="fileName" :title="fileName">{{fileName}}</span>
      <i
        class="el-icon-delete"
        style="margin-left:5px;cursor:pointer"
        @click="removeFile"
        v-if="fileName"
      ></i>
      <el-button size="mini" :disabled="selfNum == 0" @click="selectFile">{{btnText.select}}</el-button>
      <el-button size="mini" :disabled="selfNum == 0" @click="uploadFile">{{btnText.import}}</el-button>
    </template>
    <template v-else>
      <el-button size="mini" @click="uploadTableFile" :disabled="!isDisabled || selfNum == 0">{{btnText.import}}</el-button>
    </template>
    <input type="file" :disabled="selfNum == 0" :id="fileId" class="file_input" @change="fileChange" :accept="fileType">
    <div class="mask" v-if="progress.isShowProgress">
      <el-progress
        type="circle"
        :percentage="progress.percent"
        class="mask_progress"
        :status="progress.status"
        :show-text="false"
      ></el-progress>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    isDisabled: {
      type: Boolean,
      default: false
    },
    showType: {
      type: Number,
      default: 0
    },
    fileId: {
      type: String,
      required: true
    },
    fileData: {
      //文件数据(父组件需要删除时传递)
      default: undefined
    },
    url: {
      //上传地址
      type: String,
      required: true
    },
    fileType: {
      //上传类型
      type: String
    },
    btnText: {
      //按钮名称
      type: Object
    },
    maxSize: {
      //允许上传的文件大小
      type: Number
    },
    uploadParam: {
      type: Array,
      default: undefined
    },
    selfNum: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      fileName: "",
      progress: {
        percent: 0,
        isShowProgress: false,
        status: "success"
      },
      isUpResult: false
    };
  },
  watch: {
    isUpResult(now, old) {
      let _this = this;
      if (now) {
        setTimeout(() => {
          _this.progress.isShowProgress = false;
          _this.progress.status = "success";
          _this.progress.percent = 0;
          _this.isUpResult = false;
          console.log('触发',_this.progress )
        }, 1500);
      } else {
        return;
      }
    }
  },
  methods: {
    removeFile() {
      this.fileName = "";
      document.getElementById(this.fileId).value = "";
    },
    selectFile() {
      let domEle = document.getElementById(this.fileId);
      domEle.click();
    },
    fileChange() {
      let domEle = document.getElementById(this.fileId);
      if (domEle.files.length) {
        //选择了文件
        if (domEle.files[0].size / 1024 / 1024 > this.maxSize) {
          console.log("文件大小大于设定的值");
          this.$alertWarn(`File size is greater than ${this.maxSize}M`);
          domEle.value = "";
          return;
        } else {
          if (this.showType == 0) {
            this.fileName = domEle.files[0].name;
          } else {
            this.uploadFile();
          }
        }
      } else {
        //取消了文件
        if (this.showType == 0) {
          this.fileName = "";
        }
      }
    },
    uploadTableFile() {
      let domEle = document.getElementById(this.fileId);
      domEle.click();
    },
    uploadFile() {
      if (this.showType == 0) {
        if (!this.fileName) {
          return;
        }
        if (Array.isArray(this.fileData) && this.fileData.length) {
          this.$alertWarn("Need to delete the original file");
          return;
        }
      }
      let formData = new FormData();
      let self = this;
      let userInfo = JSON.parse(
        window.sessionStorage.getItem("userInfo") || "{}"
      );
      formData.append("brokeId", userInfo.brokeId);
      formData.append("userId", userInfo.userId);
      formData.append("token", userInfo.token);
      formData.append("file", document.getElementById(self.fileId).files[0]);
      // console.log(this.uploadParam)
      if (this.uploadParam) {
        for (let i = 0; i < this.uploadParam.length; i++) {
          formData.append(this.uploadParam[i].name, this.uploadParam[i].value);
        }
      }
      this.progress.isShowProgress = true;
      let timer = setInterval(() => {
        if (self.progress.percent == 85) {
          clearInterval(timer);
        }
        self.progress.percent += 5;
      }, Math.random() * 1000 + 100);
      let hostUrl = sessionStorage.getItem("serveUrl") || "";
      this.$PostFormData(self.url, formData)
        .then(res => {
          if (res.code == 0) {
            this.$emit("uploadAfter", res.datas);
            this.removeFile();
            self.progress.percent = 100;
            self.progress.status = "success";
            // console.log('123',this.fileData, self.progress.status)
            if (this.fileData) {
              this.fileData.push({
                path: res.datas.filePath,
                url: `${hostUrl}${res.datas.filePath}`
              });
              window.sessionStorage.setItem(
                "uploadImg",
                hostUrl + res.datas.filePath
              );
            }
            self.$notify({
              title: "success",
              message: res.msg,
              type: "success"
            });
            // console.log('456',this.fileData, self.progress.status)
          } else {
            self.progress.status = "exception";
            // document.getElementById(this.fileId).value = "";
            // console.log('321', self.progress.status)
          }
          clearInterval(timer);
          self.isUpResult = true;
        })
        .catch(err => {
          document.getElementById(this.fileId).value = "";
          self.progress.status = "exception";
          clearInterval(timer);
          self.isUpResult = true;
        });
    }
  }
};
</script>
<style lang="less">
.upload_section {
  display: inline-block;
  margin: 0 10px;
  .file_name {
    font-size: 13px;
    padding-left: 10px;
    color: #000;
    display: inline-block;
    max-width: 240px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    vertical-align: middle;
  }
  .file_input {
    display: none;
  }
  .mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9999;
    background-color: rgba(0, 0, 0, 0.3);
    .mask_progress {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
</style>


