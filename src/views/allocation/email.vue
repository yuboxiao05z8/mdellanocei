<template>
  <div class="email_wrapper">
    <div class="head">
      <el-row>
        <el-col :span="12" class="el_col_name">
          <div>{{$t('email.emailTemplates')}}</div>
        </el-col>
        <el-col :span="12" style="text-align:right">
          <el-button size="mini" @click="saveTemplate">{{$t('email.update')}}</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="email_content">
      <el-form class="demo-form-inline form" :inline="true" label-position="left" size="small">
        <el-alert
          style="padding:8px 0;margin-bottom:20px"
          :title="$t('email.unitDetailsEmailTemplate')"
          type="info"
          :closable="false"
        ></el-alert>
        <el-row>
          <el-col :span="12" class="col_padding_x">
            <el-form-item :label="$t('email.subject')">
              <el-input class="width_300px" v-model.trim="subject1"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="col_padding_x">
            <el-form-item :label="$t('email.welcomeMessage')">
              <editor
                editorId="unitEdit"
                :value="unitEdit"
                :setting="editorSetting"
                @show="editors"
                @on-upload-success="onEditorUploadComplete"
              ></editor>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="col_padding_x">
            <el-form-item :label="$t('email.emailTemplate')">
              <editor
                editorId="unitEdit1"
                :value="unitEdit1"
                :setting="editorSetting"
                @show="editors"
                @on-upload-success="onEditorUploadComplete"
              ></editor>
            </el-form-item>
          </el-col>
        </el-row>
        <el-alert
          style="padding:8px 0;margin-bottom:20px"
          :title="$t('email.PropertyDetailsEmailTemplate')"
          type="info"
          :closable="false"
        ></el-alert>
        <el-row>
          <el-col :span="12" class="col_padding_x">
            <el-form-item :label="$t('email.subject')">
              <el-input class="width_300px" v-model.trim="subject2"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="col_padding_x">
            <el-form-item :label="$t('email.welcomeMessage')">
              <editor
                editorId="propertyEdit"
                :value="propertyEdit"
                :setting="editorSetting"
                @show="editors"
                @on-upload-success="onEditorUploadComplete"
              ></editor>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="col_padding_x">
            <el-form-item :label="$t('email.emailTemplate')">
              <editor
                editorId="propertyEdit1"
                :value="propertyEdit1"
                :setting="editorSetting"
                @show="editors"
                @on-upload-success="onEditorUploadComplete"
              ></editor>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>
<script>
import editor from "@/components//editor";
import tinymce from "tinymce/tinymce";
export default {
  components: {
    editor
  },
  data() {
    return {
      hostUrl: sessionStorage.getItem("serveUrl") || "",
      unitId: "",
      propertyId: "",
      subject1: "",
      subject2: "",
      unitEdit: "",
      unitEdit1: "",
      propertyEdit: "",
      propertyEdit1: "",
      editorSetting: {
        // 配置富文本编辑器高
        height: 300,
        width: 900
      },
      callbackList: [],
      editorArr: [], //获取数据时富文本编辑器的图片数组
      updateEditorArr: [] //提交时富文本编辑器里面的图片数组
    };
  },
  mounted() {
    this.getTemplate();
  },
  methods: {
    getTemplate() {
      this.$Geting(this.$api.queryProjectTemplate, { }).then(
        res => {
          if (res.code == 0) {
            let unitData = res.datas.unitEmail;
            let propertyData = res.datas.projectEmail;
            if (unitData) {
              this.unitId = unitData.id;
              this.subject1 = unitData.subject;
              this.unitEdit = this.$base64ToContent(unitData.description);
              tinymce.editors[0].setContent(this.unitEdit);
              this.unitEdit1 = this.$base64ToContent(unitData.content);
              tinymce.editors[1].setContent(this.unitEdit1);
            }
            if (propertyData) {
              this.propertyId = propertyData.id;
              this.subject2 = propertyData.subject;
              this.propertyEdit = this.$base64ToContent(
                propertyData.description
              );
              tinymce.editors[2].setContent(this.propertyEdit);
              this.propertyEdit1 = this.$base64ToContent(propertyData.content);
              tinymce.editors[3].setContent(this.propertyEdit1);
            }

            this.beforeSaveGetInitEdit(
              this.unitEdit,
              this.unitEdit1,
              this.propertyEdit,
              this.propertyEdit1
            );
          } else {
            this.$notify.error({
              title: "fail",
              message: res.msg
            });
            return false;
          }
        }
      );
    },
    saveTemplate() {
      let unitEmail = {
        id: this.unitId,
        subject: this.subject1,
        description: this.$contentToBase64(this.unitEdit),
        content: this.$contentToBase64(this.unitEdit1),
        type: "unit"
      };
      let projectEmail = {
        id: this.propertyId,
        subject: this.subject2,
        description: this.$contentToBase64(this.propertyEdit),
        content: this.$contentToBase64(this.propertyEdit1),
        type: "project"
      };

      this.$Posting(this.$api.saveProjectTemplate, {
        unitEmail: JSON.stringify(unitEmail),
        projectEmail: JSON.stringify(projectEmail)
      }).then(res => {
        if (res.code == 0) {
          this.beforeSaveCheckImage();
          this.editorArr = [];
          this.updateEditorArr = [];
          this.$notify({
            title: "success",
            message: this.$t("alert.operate_success_title"),
            type: "success"
          });
          this.getTemplate();
          // console.log(this.editorArr);
          // console.log(this.updateEditorArr);
          if (window.sessionStorage.getItem("uploadImg")) {
            window.sessionStorage.removeItem("uploadImg");
          }
        } else {
          this.$notify.error({
            title: "fail",
            message: res.msg
          });
          return false;
        }
      });
    },
    editors(obj) {
      // editor组件传过来的值赋给content
      this[obj.id] = obj.content;
    },
    onEditorUploadComplete(json) {
      // 处理上传图片后返回数据，添加img标签到编辑框内
      json[1](this.hostUrl + json[0].filePath);
    },
    //保存前先读取服务端返回的富文本编辑器里面的内容，晒选出图片存在缓存中
    beforeSaveGetInitEdit() {
      for (let i = 0; i < arguments.length; i++) {
        this.editorArr = this.editorArr.concat(
          this.$changeHtmlStr(arguments[i])
        );
      }
    },
    //保存前获取编辑后的富文本编辑器的内容
    beforeSaveGetEdit() {
      for (let i = 0; i < arguments.length; i++) {
        this.updateEditorArr = this.updateEditorArr.concat(
          this.$changeHtmlStr(arguments[i])
        );
      }
    },
    //提交之前进行图片的检测
    beforeSaveCheckImage() {
      let editorImg =
        JSON.parse(window.sessionStorage.getItem("editorImg")) || [];
      this.beforeSaveGetEdit(
        this.unitEdit,
        this.unitEdit1,
        this.propertyEdit,
        this.propertyEdit1
      );

      let allEditorArr = [...editorImg, ...this.editorArr]; //将缓存里面的图片和获取的富文本编辑器的图片进行整合
      allEditorArr.length &&
        window.sessionStorage.setItem(
          "editorImg",
          JSON.stringify(allEditorArr)
        ); //点击时将之前富文本编辑器里面的图片进行缓存
      this.$changeSession(this.updateEditorArr);
    }
  },
  beforeDestroy() {
    this.$deleteImg();
  }
};
</script>
<style lang="less">
.email_wrapper {
  background-color: #fff;
  height: 100%;
  position: relative;
  overflow: hidden;
  .head {
    height: 62px;
    position: absolute;
    top: 0;
    width: 100%;
    border-bottom: 1px solid #dcdfe6;
    border-top: 1px solid #dcdfe6;
    padding: 15px 30px;
    .el_col_name {
      div {
        padding: 4px 0;
      }
    }
  }
  .email_content {
    position: absolute;
    top: 62px;
    bottom: 0;
    width: 100%;
    overflow: auto;
    padding: 15px 30px;
    .el-alert__title {
      font-size: 14px !important;
    }
  }
  .col_padding_x {
    padding: 0 30px;
  }
}
</style>
