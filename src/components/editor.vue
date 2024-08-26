<template>
  <textarea class="textInput" :id='editorId' :value='value'></textarea>
</template>
<script>
// Import TinyMCE
import tinymce from "tinymce/tinymce";
import editorConfig from "@/util/editor.js";
export default {
  props: {
    value: {
      type: String,
      required: true
    },
    setting: {},
    editorId: {
      type: String,
      required: true
    },
    uploadImageType: {
      type: String,
      default: '1'
    }
  },
  data() {
    return {
      accept: "image/jpeg, image/png,image/jpg",
      hostUrl: sessionStorage.getItem("serveUrl") || ""
    };
  },
  mounted() {
    let setting = this.getSetting();
    let _this = this;
    Object.assign(setting, editorConfig, this.setting);
    tinymce.init(setting);
  },
  methods: {
    getSetting() {
      let _this = this;
      return {
        selector: "#" + _this.editorId,
        // readonly: 1,
        init_instance_callback: function(editor) {
          editor.on("input change undo redo", () => {
            var content = editor.getContent();
            _this.$emit("show", { content: content, id: _this.editorId });
          });
        },
        // 图片上传
        images_upload_handler: function(blobInfo, success, failure) {
          if (blobInfo.blob().size / 1024 / 1024 > 3) {
            failure("File size is too large");
          }
          if (_this.accept.indexOf(blobInfo.blob().type) >= 0) {
            _this.uploadPic(blobInfo, success, failure);
          } else {
            failure("Image format error");
          }
        }
      };
    },
    uploadPic(blobInfo, success, failure) {
      let _this = this;
      // 发送请求
      const formData = new FormData();
      let userInfo = JSON.parse(
        window.sessionStorage.getItem("userInfo") || "{}"
      );
      let editorImg = [];
      let uploadImageUrl = this.$api.uploadFile;
      formData.append("brokeId", userInfo.brokeId);
      formData.append("userId", userInfo.userId);
      formData.append("token", userInfo.token);
      formData.append("file", blobInfo.blob());
      if (this.uploadImageType == 1) {
        let projectId =
          JSON.parse(sessionStorage.getItem("projectDesc") || "{}").id || "";
        formData.append("type", "projectImg");
        formData.append("projectId", projectId);
      } else {
        uploadImageUrl = this.$api.uploadEditorImg;
      }

      _this
        .$PostFormData(uploadImageUrl, formData)
        .then(function(data) {
          if (data.code == 0) {
            if (window.sessionStorage.getItem("editorImg")) {
              editorImg = JSON.parse(
                window.sessionStorage.getItem("editorImg")
              );
            }
            editorImg.push(_this.hostUrl + data.datas.filePath);
            window.sessionStorage.setItem(
              "editorImg",
              JSON.stringify(editorImg)
            );
            _this.$emit("on-upload-success", [data.datas, success, failure]);
          } else {
            failure("Update Fail: " + data.code);
            return;
          }
        })
        .catch(err => {
          failure("Busy network");
        });
    }
  },
  beforeDestroy: function() {
    tinymce.get(this.editorId).destroy();
  }
};
</script>

<style lang="less">
.mce-panel{
  width: 100% !important;
}
  
</style>