<template>
  <div class="apponint_setting_vue">
    <!-- <div class="setting_content">
      <el-row :gutter="10">
        <el-col :span="4">
          <h4>Export booking form:</h4>
        </el-col>
        <el-col :span="20">
          <el-button size="mini" @click="exportExcel">Export Excel</el-button>
        </el-col>
      </el-row>
    </div> -->

    <div class="setting_content">
      <el-row :gutter="10">
        <el-col :span="4">
          <h4>Form Control:</h4>
        </el-col>
        <el-col :span="14">
          <div class="checkbox-group">
            <el-checkbox v-model="nameRequired" label="Name"></el-checkbox>
            <el-checkbox v-model="cardRequired" label="NRIC/ID"></el-checkbox>
            <el-checkbox v-model="mobileRequired" label="Mobile"></el-checkbox>
            <el-checkbox v-model="emailRequired" label="Email"></el-checkbox>
          </div>
        </el-col>
        <el-col :span="6">
          <el-button size="mini" @click="setCheckboxUpdate">Update</el-button>
        </el-col>
      </el-row>

      <el-row :gutter="10" class="booking_editor">
        <el-col :span="4">
          <h4>Remarks:</h4>
        </el-col>
        <el-col :span="20">
          <editor
            editorId="Remarks_id"
            :value="remark"
            :setting="editorSetting"
            @show="editors"
            @on-upload-success="onEditorUploadComplete"
          ></editor>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import editor from '@/components/editor'
import tinymce from 'tinymce/tinymce'
export default {
  components: { editor },
  data() {
    return {
      nameRequired: false,
      cardRequired: false,
      mobileRequired: false,
      emailRequired: false,
      remark: '',
      editorSetting: {
        // 配置富文本编辑器高
        height: 120,
        width: 900,
      },
      editorArr: [], //获取数据时富文本编辑器的图片数组
      updateEditorArr: [], //提交时富文本编辑器里面的图片数组
      serveUrl: sessionStorage.getItem('serveUrl'),
    }
  },
  mounted() {
    this.queryAppointmentSet()
  },
  methods: {
    editors(obj) {
      // editor组件传过来的值赋给content
      this.remark = obj.content
    },
    onEditorUploadComplete(json) {
      // 处理上传图片后返回数据，添加img标签到编辑框内
      json[1](this.serveUrl + json[0].filePath)
    },
    //保存前获取编辑后的富文本编辑器的内容
    beforeSaveGetEdit() {
      for (let i = 0; i < arguments.length; i++) {
        this.updateEditorArr = this.updateEditorArr.concat(
          this.$changeHtmlStr(arguments[i])
        )
      }
    },
    //提交之前进行图片的检测
    beforeSaveCheckImage() {
      let editorImg =
        JSON.parse(window.sessionStorage.getItem('editorImg')) || []
      this.beforeSaveGetEdit(this.remark)

      let allEditorArr = [...editorImg, ...this.editorArr] //将缓存里面的图片和获取的富文本编辑器的图片进行整合
      allEditorArr.length &&
        window.sessionStorage.setItem('editorImg', JSON.stringify(allEditorArr)) //点击时将之前富文本编辑器里面的图片进行缓存
      this.$changeSession(this.updateEditorArr)
    },
    queryAppointmentSet() {
      this.$Post(this.$api.queryAppointmentSet, {
        projectId: this.$route.query.id,
      }).then((res) => {
        if (res.code == 0) {
          if (res.datas) {
            this.nameRequired = !!res.datas.nameRequired
            this.cardRequired = !!res.datas.cardRequired
            this.mobileRequired = !!res.datas.mobileRequired
            this.emailRequired = !!res.datas.emailRequired
            this.remark = this.$base64ToContent(res.datas.remark)
            if (tinymce.editors[0]) {
              tinymce.editors[0].setContent(this.remark)
            }
          }
        }
      })
    },
    setCheckboxUpdate() {
      let data = {
        nameRequired: Number(this.nameRequired),
        cardRequired: Number(this.cardRequired),
        mobileRequired: Number(this.mobileRequired),
        emailRequired: Number(this.emailRequired),
        remark: this.$contentToBase64(this.remark),
        projectId: this.$route.query.id,
      }
      this.$Posting(this.$api.saveAppointmentSet, data).then((res) => {
        if (res.code == 0) {
          this.$notify({
            title: 'Success',
            message: 'SET OK!',
            type: 'success',
          })
          this.queryAppointmentSet()
          this.beforeSaveCheckImage()
        } else {
          this.$notify.error({
            title: 'Error',
            message: res.msg,
          })
        }
      })
    },
    async exportExcel() {
      window.location.href = await this.$addDownUrl(
        this.$api.exportAppointment,
        {
          projectId: this.$route.query.id,
        }
      )
    },
  },
  beforeDestroy() {
    this.$deleteImg()
  },
}
</script>


<style lang="less">
.apponint_setting_vue {
  .setting_content {
    h4,
    .checkbox-group {
      height: 28px;
      line-height: 28px;
    }
    border: 1px solid #f4f4f4;
    padding: 15px;
    margin-bottom: 15px;
    .booking_editor{
      margin-top: 30px;
    }
  }
}
</style>