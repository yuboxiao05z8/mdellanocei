<template>
  <div class="vue-uploader">
    <div class="file-list">
      <section v-for="(item, index) of backData" class="file-item draggable-item">
        <img @click.stop="$imgPreview(item.src)" :src="item.src" alt="">
        <span class="file-remove el-icon-error" @click="remove(index,item)"></span>
      </section>
      <section v-if="backData.length < mixLength||mixLength===0" class="file-item">
        <div @click="add" class="add">
          <span>+</span>
        </div>
      </section>
    </div>
    <input :id="id" type="file" accept="image/*" @change="fileChanged" ref="file" multiple="multiple">
  </div>
</template>
<script>
import md5 from 'js-md5'
export default {
  props: {
    mixLength: Number, // 限制数量
    id: String, // input ID 必填
    backData: Array, // 父组件容器，必填
    folder: {
      type: String,
      default: 'transactionImg'
    }, // 传入图片类型 type：CalendarImg(日历图片)
    editBrokeId: {
      type: String,
      default: ''
    },
    maxSize: {
      type: Number,
      default: 100
    }
  },
  data () {
    return {
      files: [],
      percent: 0,
      hostUrl: window.sessionStorage.getItem("serveUrl") || ""
    };
  },
  mounted () {
    console.log(this.brokeId);
  },
  methods: {
    add () {
      this.$refs.file.click();
    },
    remove (index, item) {
      this.deleteUpImg(item.src);
      this.backData.splice(index, 1);
    },

    fileChanged () {
      let self = this;
      const list = this.$refs.file.files;
      for (let i = 0; i < list.length; i++) {
        if (!this.isContain(list[i]) || this.id === 'certificateImg') {
          if (list[i].size / 1024 > self.maxSize) {
            this.$message({
              message: `${self.$t("uploadmorethan")} ${self.maxSize}k ${self.$t(
                "picture"
              )}`,
              type: "warning"
            });
          } else {
            this.html5Reader(list[i]);
          }
        } else {
          this.$message({
            message: self.$t("hasbeenuploaded"),
            type: "warning"
          });
        }
      }
      let num = this.id.replace(/[^0-9]/gi, "");
      let iDs = this.id;
      this.$refs.file.value = "";
    },

    // 将图片文件转成BASE64格式 压缩
    html5Reader (file) {
      let self = this;
      let reader = new FileReader();
      reader.readAsDataURL(file);
      // console.log(file)
      reader.onloadend = function () {
        let result = this.result;
        let img = new Image();
        img.src = result;
        // console.log("********未压缩前的图片大小********");
        // console.log(result.length);
        img.onload = function () {
          // 压缩
          let data;
          // if (img.src.length / 1024 / 1024 > 2) {
          //   data = self.compress(img);
          // } else {
          data = img.src;
          // }
          // 转成File模式
          let blob = self.dataURItoFile(data, file.name);
          let item = {
            name: file.name,
            upImgData: blob
          };
          if (self.files.length < self.mixLength || self.mixLength === 0) {
            //不能超过限定图片数量
            self.UpLoadImg(item);
          }
        };
      };
    },
    compress (img) {
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d");
      let initSize = img.src.length;
      let width = img.width;
      let height = img.height;
      canvas.width = width;
      canvas.height = height;
      // 铺底色
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, width, height);

      //进行最小压缩
      let ndata = canvas.toDataURL("image/jpeg", 0.3);
      // console.log("*******压缩后的图片大小*******");
      // console.log(ndata.length / 1024 / 1024 + 'k');
      return ndata;
    },
    // base64转成bolb对象

    UpLoadImg (imgBlob) {
      let user = JSON.parse(window.sessionStorage.getItem("userInfo"));
      let formData = new FormData();
      formData.append("brokeId", user.brokeId);
      formData.append("token", user.token);
      formData.append("userId", user.userId);
      formData.append("file", imgBlob.upImgData);
      formData.append("type", this.folder);
      let params = { brokeId: user.brokeId, userId: user.userId, type: this.folder }
      if (this.editBrokeId) {
        formData.append("editBrokeId", this.editBrokeId)
        params["editBrokeId"] = this.editBrokeId
      }
      let signStr = ''
      for (const key in this.$objKeySort(params)) {
        if (
          this.$objKeySort(params)[key] !== null &&
          typeof this.$objKeySort(params)[key] !== 'undefined'
          && key !== 'file' &&
          key !== 'appVer' &&
          key !== 'mobileMode' &&
          key !== 'appSource' &&
          key !== 'token'
        ) {
          signStr += this.$objKeySort(params)[key]
        }
      }
      let sign = md5(signStr + 'c1d65f3667324592a071ebec5038f38c')
      formData.append("signature", sign);
      console.log(formData)
      this.$PostFormData(this.$api.uploadFile, formData).then(res => {
        if (res.code === "0") {
          let item = {
            src: this.hostUrl + res.datas.filePath,
            name: imgBlob.name,
            url: res.datas.filePath
          };
          this.backData.push(item);
          let uploadedImg = JSON.parse(
            window.sessionStorage.getItem("uploadImg")
          );
          if (uploadedImg) {
            uploadedImg.push(this.hostUrl + res.datas.filePath);
            window.sessionStorage.setItem(
              "uploadImg",
              JSON.stringify(uploadedImg)
            );
          } else {
            uploadedImg = [];
            uploadedImg.push(this.hostUrl + res.datas.filePath);
            window.sessionStorage.setItem(
              "uploadImg",
              JSON.stringify(uploadedImg)
            );
          }
        }
      });
    },
    deleteUpImg (imgPush) {
      this.$Post(this.$api.deleteFile, { path: imgPush }).then(res => {
        if (res.code === "0") {
          let uploadedImg = JSON.parse(
            window.sessionStorage.getItem("uploadImg")
          );
          if (uploadedImg) {
            uploadedImg.forEach((item, index) => {
              if (item === imgPush) {
                uploadedImg.splice(index, 1);
                console.log(item, imgPush);
              }
            });
            window.sessionStorage.setItem(
              "uploadImg",
              JSON.stringify(uploadedImg)
            );
          }
        }
      });
    },

    dataURItoFile (base64Data, filename = "file") {
      let arr = base64Data.split(",");
      let mime = arr[0].match(/:(.*?);/)[1];
      // let suffix = mime.split("/")[1];
      let bstr = atob(arr[1]);
      let n = bstr.length;
      let u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], `${filename}`, {
        type: mime
      });
    },

    isContain (file) {
      return this.backData.find(item => item.name === file.name);
    },

    uploadProgress (evt) {
      const component = this;
      if (evt.lengthComputable) {
        const percentComplete = Math.round(evt.loaded * 100 / evt.total);
        component.percent = percentComplete / 100;
      } else {
        console.warn("upload progress unable to compute");
      }
    }
  }
};
</script>
<style>
.vue-uploader {
  display: inline-block;
  /* border: 1px solid #e5e5e5; */
}
.vue-uploader .file-list {
  padding: 10px 0px;
  padding-top: 0;
}
.vue-uploader .file-list:after {
  content: "";
  display: block;
  clear: both;
  visibility: hidden;
  line-height: 0;
  height: 0;
  font-size: 0;
}
.vue-uploader .file-list .file-item {
  float: left;
  position: relative;
  width: 80px;
  height: 80px;
  border: 1px solid #ddd;
  text-align: center;
  margin-right: 10px;
}
.vue-uploader .file-list .file-item img {
  width: 100%;
  height: 100%;
  /* border: 1px solid #ececec; */
}
.vue-uploader .file-list .file-item .file-remove {
  position: absolute;
  right: 0px;
  display: none;
  top: 0px;
  font-size: 20px;
  color: red;
  cursor: pointer;
  border-radius: 100%;
}
.vue-uploader .file-list .file-item:hover .file-remove {
  display: inline;
}
.vue-uploader .file-list .file-item .file-name {
  margin: 0;
  height: 20px;
  line-height: 20px;
  word-break: break-all;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
.vue-uploader .add {
  width: 80px;
  height: 80px;
  margin-right: 10px;
  float: left;
  text-align: center;
  line-height: 80px;
  /* border: 1px dashed #ececec; */
  font-size: 30px;
  cursor: pointer;
}
.vue-uploader .upload-func {
  display: flex;
  padding: 10px;
  margin: 0px;
  background: #f8f8f8;
  border-top: 1px solid #ececec;
}
.vue-uploader .upload-func .progress-bar {
  flex-grow: 1;
}
.vue-uploader .upload-func .progress-bar section {
  margin-top: 5px;
  background: #00b4aa;
  border-radius: 3px;
  text-align: center;
  color: #fff;
  font-size: 12px;
  transition: all 0.5s ease;
}
.vue-uploader .upload-func .operation-box {
  flex-grow: 0;
  padding-left: 10px;
}
.vue-uploader .upload-func .operation-box button {
  padding: 4px 12px;
  color: #fff;
  background: #007acc;
  border: none;
  border-radius: 2px;
  cursor: pointer;
}
.vue-uploader > input[type="file"] {
  display: none;
}
</style>