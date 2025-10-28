<template>
  <div class="addEditFile">
    <el-dialog center title="小组文件上传" :visible.sync="show" :close-on-click-modal="false" :close-on-press-escape="false" width="500px" append-to-body v-loading="loading" element-loading-text="文件上传中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" :show-close='false'>
      <div class="addEditFile_box">
        <div style="text-align:center;margin-bottom:15px">
          <el-upload class="upload-demo" drag :show-file-list="false" action :before-upload="beforeUpload" :http-request="uploadFile">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          </el-upload>
        </div>
        <el-form ref="form_File" :model="fileForm" label-width="100px">
          <el-form-item label="文件地址">
            <el-input size="mini" v-model="fileForm.url" disabled></el-input>
          </el-form-item>
          <el-form-item label="文件名称">
            <el-input size="mini" v-model="fileForm.fileName"></el-input>
          </el-form-item>
          <el-form-item label="展示位置">
            <el-select v-model="fileForm.type" placeholder="select" size="mini" style="display: block;" :disabled='fileLoad.length>0 && type ==="edit"'>
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
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
export default {
  props: ['show', 'type', 'editData'],
  data () {
    return {
      fileForm: {},
      options: [
        {
          value: 'object Handling',
          label: 'object Handling'
        },
        {
          value: 'Land Bid',
          label: 'Land Bid'
        },
        {
          value: 'Branding Awareness',
          label: 'Branding Awareness'
        },
        {
          value: 'report',
          label: 'report'
        }
      ],
      fileLoad: '',
      editFile: '',
      uploadFlag: false,
      loading: false
    }
  },
  watch: {
    show (val) {
      if (val && this.type === 'edit') {
        this.fileForm = JSON.parse(JSON.stringify(this.editData))
        this.editFile = JSON.parse(JSON.stringify(this.editData)).url
      }
    }
  },
  methods: {
    beforeUpload (file) {
      const isPDF = file.type === 'application/pdf';
      const type = this.fileForm.type
      if (!type) {
        this.$message.error('请先选择展示位置')
        this.uploadFlag = false
        return false
      };
      if (!isPDF) {
        this.$message.error('请上传pdf文件')
        this.uploadFlag = false
        return false
      }
      if (isPDF && type) this.uploadFlag = true
    },
    uploadFile (file) {
      if (this.uploadFlag) {
        let formData = new FormData()
        formData.append('type', 'pnd_file')
        formData.append('group', this.fileForm.type)
        formData.append('id', this.type === 'edit' ? this.fileForm.fileId : '')
        formData.append('signature', this.$signatrue({ type: 'pnd_file', group: this.fileForm.type, id: this.type === 'edit' ? this.fileForm.fileId : '' }))
        formData.append('file', file.file)
        this.loading = true
        this.$PostFormData(this.$api.pndUploadFile, formData).then(res => {
          if (res.code == 0) {
            this.loading = false
            this.fileForm.url = res.datas.filePath
            this.fileForm.fileName = res.datas.fileName
            this.$message.success('上传成功');
            if (this.fileLoad.length === 0) {
              this.fileLoad = res.datas.filePath
            } else {
              this.$Get(this.$api.deleteUploadFile, { path: this.filePath }).then(_res => {
                if (_res.code == 0) {
                  this.fileLoad = ''
                  this.fileLoad = res.datas.filePath
                }
              })
            }
          } else {
            this.loading = false
            this.$message.error('上传失败');
          }
        })
      }
    },
    addDataFn () {
      this.fileForm.userId = JSON.parse(sessionStorage.getItem('userInfo')).userId
      this.$Post(this.$api.saveFile, this.fileForm).then(res => {
        if (res.code == 0) {
          this.$message.success('保存成功');
          if (this.type === 'edit') {
            if (this.fileLoad.length > 0) {
              this.$Get(this.$api.deleteUploadFile, { path: this.editFile }).then(_res => {
                if (_res.code == 0) {
                  this.editLogo = ''
                }
              })
            }
          }
          this.closedForm(true)
          this.$emit('loadData')
        }
      })
    },
    deleteUpload (type) {
      this.$Get(this.$api.deleteUploadFile, { path: type ? this.editFile : this.fileLoad }).then(_res => {
        if (_res.code == 0) {
          this.fileLoad = ''
        }
      })
    },
    closedForm (boole) {
      this.$refs['form_File'].resetFields();
      this.fileForm = {}
      this.editFile = ''
      if (boole) this.fileLoad = ''
      if (this.fileLoad.length > 0 && !boole) {
        this.deleteUpload(false)
      }
      this.$emit('cancel')
    },
  }
}
</script>
<style lang="less" scoped>
.addEditFile_box {
}
</style>