<template>
  <div class="addEditCompany">
    <el-dialog center title="Link" :visible.sync="show" :close-on-click-modal="false" :close-on-press-escape="false"
      width="800px" append-to-body :show-close='false'>
      <div class="addEditCompany_box">
        <el-form ref="form_company" :rules="rules" :model="linkForm" label-width="120px">
          <el-form-item label="Link Name" prop="linkName">
            <el-input size="mini" v-model="linkForm.linkName"></el-input>
          </el-form-item>
          <el-form-item label="URL" prop="link">
            <el-input size="mini" v-model="linkForm.link"></el-input>
          </el-form-item>
          <el-form-item label="APP Group" prop="type">
            <el-select v-model="linkForm.type" placeholder="select" size="mini"
              :disabled='imgLoad.length>0 || type ==="edit"'>
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="LOGO" prop="logo">
            <el-upload class="upload-demo" :before-upload="beforeUpload" :http-request="uploadLogo" action
              :show-file-list="false">
              <img v-if="linkForm.logo" :src="serveUrl+linkForm.logo" class="logo">
              <i v-else class="el-icon-plus upload-demo-icon"></i>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closedForm(0)">Cancel</el-button>
        <el-button type="primary" @click="addDataFn">Save</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { setRulesData } from '@/utils/validate'
export default {
  props: ['show', 'type', 'editData'],
  data () {
    return {
      serveUrl: sessionStorage.getItem('serveUrl'),
      linkForm: { logo: '' },
      options: [
        {
          value: 'Property Portals',
          label: 'Property Portals'
        },
        {
          value: 'PND Social Media',
          label: 'PND Social Media'
        }
      ],
      uploadFlag: false,
      imgLoad: '',
      editLogo: ''
    }
  },
  computed: {
    rules () {
      let blurArr = [
        'linkName',
        'link',
      ]
      let changeArr = [
        'type',
        'logo',
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
        this.linkForm = JSON.parse(JSON.stringify(this.editData))
        this.editLogo = JSON.parse(JSON.stringify(this.editData)).logo
      }
    },
  },
  methods: {
    addDataFn () {
      this.$refs['form_company'].validate((valid) => {
        if (valid) {
          this.linkForm.userId = JSON.parse(sessionStorage.getItem('userInfo')).userId
          this.$Post(this.$api.saveLink, this.linkForm).then(res => {
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
              this.$message.success('保存成功');
              this.closedForm(1)
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
      const type = this.linkForm.type
      if (!type) {
        this.$message.error('请先选择APP Group再进行上传')
        this.uploadFlag = false
        return false
      };
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
      if (isLt2M && type && isJPG_Png) this.uploadFlag = true
      // return isLt2M && type;
    },
    uploadLogo (file) {
      if (this.uploadFlag) {
        let formData = new FormData()
        let self = this
        formData.append('type', 'pnd_link_logo')
        formData.append('group', this.linkForm.type)
        formData.append('signature', this.$signatrue({ type: 'pnd_link_logo', group: this.linkForm.type }))
        formData.append('file', file.file)
        self.$PostFormData(this.$api.pndUploadFile, formData)
          .then(res => {
            if (res.code == 0) {
              self.linkForm.logo = res.datas.filePath
              self.$message.success('上传成功');
              if (self.imgLoad.length === 0) {
                self.imgLoad = res.datas.filePath
              } else {
                self.$Get(self.$api.deleteUploadFile, { path: self.imgLoad }).then(_res => {
                  if (_res.code == 0) {
                    self.imgLoad = ''
                    self.imgLoad = res.datas.filePath
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
    closedForm (id) {
      this.$refs['form_company'].resetFields();
      this.linkForm = {
        logo: '',
      }
      this.editLogo = ''
      if (this.imgLoad.length > 0 && !id) {
        this.$Get(this.$api.deleteUploadFile, { path: this.imgLoad }).then(_res => {
          if (_res.code == 0) {
            this.imgLoad = ''
          }
        })
      }
      this.$emit('cancel')
    },
  }
}
</script>
<style lang="less" scoped>
.addEditCompany_box {
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