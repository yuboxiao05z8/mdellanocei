<template>
  <div class="addEditSchedule">
    <el-dialog center title="Link" :visible.sync="show" :close-on-click-modal="false" :close-on-press-escape="false" width="800px" append-to-body :show-close='false'>
      <div class="addEditSchedule_box">
        <el-form ref="form_schedule" :rules="rules" :model="scheduleForm" label-width="120px">
          <el-form-item label="Title" prop="title">
            <el-input size="mini" style="width:200px" v-model="scheduleForm.title"></el-input>
          </el-form-item>
          <el-form-item label="Types" prop="type">
            <el-select v-model="scheduleForm.type" placeholder="select" size="mini">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Venue">
            <el-input size="mini" style="width:200px" v-model="scheduleForm.venue"></el-input>
          </el-form-item>
          <el-form-item label="Calendar Time" prop="calendarTime">
            <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" format="dd-MMM-yyyy HH:mm:ss" type="datetime" v-model="scheduleForm.calendarTime"></el-date-picker>
          </el-form-item>
          <el-form-item label="Picture upload" prop="picture">
            <el-upload class="upload-demo" :before-upload="beforeUpload" :http-request="uploadLogo" action :show-file-list="false">
              <img v-if="scheduleForm.picture" :src="serveUrl+scheduleForm.picture" class="logo">
              <i v-else class="el-icon-plus upload-demo-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="Description" prop="description" v-if="show">
            <editor editorId="description" :value="scheduleForm.description" :setting="editorSetting" @show="editors" @on-upload-success="onEditorUploadComplete"></editor>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closedForm(false)">Cancel</el-button>
        <el-button type="primary" @click="addDataFn">Save</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import editor from '@/components/editor'
import tinymce from 'tinymce/tinymce'
import { setRulesData } from '@/utils/validate'
export default {
  components: { editor },
  props: ['show', 'type', 'editData'],
  data () {
    return {
      imgArr: [], //富文本编辑器上传的所有图片
      updateEditorArr: [], //提交时富文本编辑器里面的图片数组
      delArr: [],//富文本需要删除的图片
      editDelArr: [],
      serveUrl: sessionStorage.getItem('serveUrl') || '',
      scheduleForm: { picture: '', type: 'Tranining', description: '', calendarTime: '' },
      options: [
        {
          value: 'Tranining',
          label: 'Tranining'
        },
        {
          value: 'Project',
          label: 'Project'
        },
        {
          value: 'Events',
          label: 'Events'
        }
      ],
      uploadFlag: false,
      imgLoad: [],
      editLogo: '',
      editorSetting: {
        // 配置富文本编辑器高
        height: 120,
        width: 800,
      },
    }
  },
  computed: {
    rules () {
      let blurArr = [
        'title',
      ]
      let changeArr = [
        'type',
        'picture',
        'calendarTime',
        'description',
      ]
      return {
        ...setRulesData('blur', blurArr),
        ...setRulesData('change', changeArr),
      }
    },
  },
  watch: {
    show (val) {
      if (val && this.type === 'edit') {
        this.scheduleForm = JSON.parse(JSON.stringify(this.editData))
        this.scheduleForm.description = this.$base64ToContent(this.scheduleForm.description)
        setTimeout(() => {
          tinymce.editors[0].setContent(this.scheduleForm.description);
        }, 500);
        this.editLogo = JSON.parse(JSON.stringify(this.editData)).picture
        this.imgArr = this.$changeHtmlStr(this.scheduleForm.description)
      }
    },
  },
  methods: {
    editors (obj) {
      // editor组件传过来的值赋给content
      this.scheduleForm.description = obj.content
    },
    onEditorUploadComplete (json) {
      // 处理上传图片后返回数据，添加img标签到编辑框内
      json[1](this.serveUrl + json[0].filePath)
      this.imgArr.push(this.serveUrl + json[0].filePath)
      if (this.type === 'edit') {
        this.editDelArr.push(this.serveUrl + json[0].filePath)
      }
    },
    addDataFn () {
      this.$refs['form_schedule'].validate((valid) => {
        if (valid) {
          let data = Object.assign({}, this.scheduleForm)
          data.description = this.$contentToBase64(data.description)
          this.$Post(this.$api.saveOrUpdateCalendar, data).then(res => {
            if (res.code == 0) {
              if (this.type === 'edit') {
                if (this.imgLoad.length > 0) {
                  this.$Get(this.$api.deleteUploadFile, { path: this.editLogo }).then(_res => {
                    if (_res.code == 0) {
                      this.editLogo = ''
                    }
                  })
                }
              }
              //匹配富文本的img标签
              let patt1 = /<img\b.*?(?:\>|\/>)/gi
              let patt2 = /\bsrc\b\s*=\s*[\'\"]?([^\'\"]*)[\'\"]?/i
              let arr
              if (this.scheduleForm.description) {
                arr = this.scheduleForm.description.match(patt1)
              }
              if (arr) {
                for (let i = 0; i < arr.length; i++) {
                  this.updateEditorArr.push(arr[i].match(patt2)[1])
                }
              }
              if (this.updateEditorArr.length > 0) {
                for (let i of this.updateEditorArr) {
                  this.delArr = this.imgArr.filter(
                    (item) => item !== i
                  )
                }
              } else {
                this.delArr = this.imgArr
              }
              if (this.delArr.length > 0) {
                this.$Get(this.$api.deleteUploadFile, { path: this.delArr.join() }).then(_res => {
                  if (_res.code == 0) {
                    this.delArr = []
                    this.imgArr = []
                  }
                })
              }
              this.$message.success('保存成功');
              this.closedForm(true)
              this.$emit('loadData')
            }
          })
        } else {
          return false
        }
      })
    },
    beforeUpload (file) {
      const isJPG_Png = file.type === 'image/jpeg' || file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG_Png) {
        this.$message.error('请上传JPG或者PNG格式LOGO!');
        this.uploadFlag = false
        return false
      }
      if (!isLt2M) {
        this.$message.error('上传LOGO大小不能超过 2MB!');
        this.uploadFlag = false
        return false
      }
      if (isLt2M && isJPG_Png) this.uploadFlag = true
      // return isLt2M && type;
    },
    uploadLogo (file) {
      if (this.uploadFlag) {
        let formData = new FormData()
        let self = this
        formData.append('type', 'pnd_calendar_logo')
        formData.append('id', this.type === 'edit' ? this.scheduleForm.calendarId : '')
        formData.append('signature', this.$signatrue({ type: 'pnd_calendar_logo', id: this.type === 'edit' ? this.scheduleForm.calendarId : '' }))
        formData.append('file', file.file)
        self.$PostFormData(this.$api.pndUploadFile, formData)
          .then(res => {
            if (res.code == 0) {
              self.scheduleForm.picture = res.datas.filePath
              self.$message.success('上传成功');
              if (self.imgLoad.length === 0) {
                self.imgLoad.push(res.datas.filePath)
              } else {
                self.$Get(self.$api.deleteUploadFile, { path: self.imgLoad }).then(_res => {
                  if (_res.code == 0) {
                    self.imgLoad = []
                    self.imgLoad.push(res.datas.filePath)
                  }
                })
              }
            } else {
              self.$message.error('上传失败');
            }
          })
          .catch(err => {

          })
      }
    },
    closedForm (bool) {
      this.$refs['form_schedule'].resetFields();
      this.scheduleForm = {
        logo: '',
        type: 'Tranining',
        description: ''
      }
      this.editLogo = ''
      this.updateEditorArr = []
      if (!bool) {
        if (this.imgLoad.concat(this.imgArr).length > 0 && this.type === 'add') {
          this.$Get(this.$api.deleteUploadFile, { path: this.imgLoad.concat(this.imgArr).join() }).then(_res => {
            if (_res.code == 0) {
              this.imgLoad = []
              this.imgArr = []
            }
          })
        } else if (this.imgLoad.concat(this.editDelArr).length > 0 && this.type === 'edit') {
          this.$Get(this.$api.deleteUploadFile, { path: this.imgLoad.concat(this.editDelArr).join() }).then(_res => {
            if (_res.code == 0) {
              this.imgLoad = []
              this.editDelArr = []
            }
          })
        }
      } else {
        this.imgLoad = []
        this.editDelArr = []
      }
      this.$emit('cancel')
    },
  }
}
</script>
<style lang="less" scoped>
.addEditSchedule_box {
  /deep/.el-form-item__content {
    min-width: 120px;
  }
}
/deep/.upload-demo {
  .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    /deep/.upload-demo-icon {
      display: block;
    }
    .logo {
      width: 100px;
      height: 100px;
      display: block;
    }
  }
  .el-upload:hover {
    border-color: #409eff;
  }
  .upload-demo-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
}
.contact {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  .contact_box {
    min-width: 300px;
    box-shadow: 1px 3px 6px #888888;
    height: 40px;
    position: relative;
    p {
      position: absolute;
      left: 10px;
    }
    p:first-child {
      top: -8px;
    }
    p:last-child {
      top: 8px;
      font-size: 12px;
    }
  }
  i {
    font-size: 28px;
    color: red;
    margin-left: 10px;
    cursor: pointer;
  }
}
</style>