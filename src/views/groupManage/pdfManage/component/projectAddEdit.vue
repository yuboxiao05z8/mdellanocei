<template>
  <div class="addEditCompany">
    <el-dialog center title="Project" :visible.sync="show" :close-on-click-modal="false" :close-on-press-escape="false" width="800px" append-to-body :show-close='false'>
      <div class="addEditCompany_box">
        <el-form ref="form_pro" :rules="rules" :model="proForm" label-width="120px">
          <el-form-item label="Pro Name" prop="projectId">
            <el-select v-model="proForm.projectName" @change="proChange" size="mini" filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="remoteMethod" :loading="loading">
              <el-option v-for="item in projectList" :key="item.projectId" :label="item.projectName" :value="item.projectId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="TYPE" prop="pdfType">
            <el-select v-model="proForm.pdfType" placeholder="select" size="mini">
              <el-option label="facilities" :value="1">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="File" prop="logo">
            <el-upload class="upload-demo" :before-upload="beforeUpload" :http-request="uploadLogo" action :show-file-list="false">
              <img v-if="proForm.logo" :src="serveUrl+proForm.logo" class="logo">
              <i v-else class="el-icon-plus upload-demo-icon"></i>
            </el-upload>
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
import { setRulesData } from '@/utils/validate'
export default {
  props: ['show', 'type', 'editData'],
  data () {
    return {
      serveUrl: sessionStorage.getItem('serveUrl'),
      loading: false,
      proForm: { logo: '', projectId: '', pdfType: 1, projectName: '' },
      uploadFlag: false,
      imgLoad: '',
      editLogo: '',
      editLogo1: '',
      projectList: []
    }
  },
  computed: {
    rules () {
      let changeArr = [
        'projectId',
        'pdfType',
        'logo',
      ]
      return {
        ...setRulesData('change', changeArr),
      }
    },
  },
  watch: {
    show (val) {
      if (val && this.type === 'edit') {
        this.proForm = JSON.parse(JSON.stringify(this.editData))
        this.editLogo = JSON.parse(JSON.stringify(this.editData)).logo
      }
    },
  },
  methods: {
    proChange (val) {
      this.proForm.projectId = val
    },
    remoteMethod (query) {
      if (query !== '') {
        this.loading = true;
        this.$Get(this.$api.queryProjectBySearch, { pageNo: 1, pageSize: 50, projectName: query }).then(res => {
          this.projectList = res.datas
          this.loading = false
        })
      } else {
        this.projectList = [];
        this.loading = false
      }
    },
    addDataFn () {
      this.$refs['form_pro'].validate((valid) => {
        if (valid) {
          this.proForm.userId = JSON.parse(sessionStorage.getItem('userInfo')).userId
          this.$Post(this.$api.saveOrUpdatePndProject, this.proForm).then(res => {
            if (res.code == 0) {
              if (this.type === 'edit') {
                if (this.editLogo.length > 0 && this.imgLoad.length > 0) {
                  this.$Get(this.$api.deleteUploadFile, { path: this.editLogo }).then(_res => {
                    if (_res.code == 0) {
                      this.editLogo = ''
                    }
                  })
                }
              }
              this.$message.success('保存成功');
              this.closedForm(true)
              this.$emit('loadData')
            } else {
              this.$message.error(res.msg)
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
        formData.append('type', 'pnd_logo')
        formData.append('id', this.type === 'edit' ? this.proForm.pdfId : '')
        formData.append('signature', this.$signatrue({ type: 'pnd_logo', id: this.type === 'edit' ? this.proForm.pdfId : '' }))
        formData.append('file', file.file)
        self.$PostFormData(this.$api.pndUploadFile, formData)
          .then(res => {
            if (res.code == 0) {
              self.proForm.logo = res.datas.filePath
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
    closedForm (bool) {
      this.$refs['form_pro'].resetFields();
      this.proForm = {
        logo: '',
      }
      this.editLogo = ''
      if (this.imgLoad.length > 0 && !bool) {
        this.$Get(this.$api.deleteUploadFile, { path: this.imgLoad }).then(_res => {
          if (_res.code == 0) {
            this.imgLoad = ''
          }
        })
      } else {
        this.imgLoad = ''
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
    height: 60px;
    display: flex;
    padding: 5px;
    img {
      margin-right: 5px;
    }
    p {
      line-height: 18px;
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