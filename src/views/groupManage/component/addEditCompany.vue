<template>
  <div class="addEditCompany">
    <el-dialog center title="公司信息" :visible.sync="show" :close-on-click-modal="false" :close-on-press-escape="false" width="800px" append-to-body :show-close="false">
      <div class="addEditCompany_box">
        <el-form ref="form_company" :rules="rules" :model="companyForm" label-width="170px" :inline="true">
          <el-form-item label="Company Name" prop="companyName">
            <el-input size="mini" v-model="companyForm.companyName"></el-input>
          </el-form-item>
          <el-form-item label="Company URL">
            <el-input size="mini" v-model="companyForm.companyUrl"></el-input>
          </el-form-item>
          <el-form-item label="Company Addressed">
            <el-input size="mini" v-model="companyForm.companyAddress"></el-input>
          </el-form-item>
          <el-form-item label="APP Group" prop="type">
            <el-select v-model="companyForm.type" placeholder="select" size="mini" :disabled="imgLoad.length > 0 && type === 'edit'" style="width:178px">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Company Logo" prop="companyLogo">
            <div style="width:178px">
              <el-upload class="upload-demo" :before-upload="beforeUpload" :http-request="uploadLogo" action :show-file-list="false">
                <img v-if="companyForm.companyLogo" :src="serveUrl + companyForm.companyLogo" class="logo" />
                <i v-else class="el-icon-plus upload-demo-icon"></i>
              </el-upload>
            </div>
          </el-form-item>
          <el-form-item label="account">
            <el-input size="mini" type="textarea" v-model="companyForm.description" style="width:178px"></el-input>
          </el-form-item>
          <el-form-item label="Company Content">
            <div style="width:178px">
              <el-upload class="upload-demo" :before-upload="beforeUploadContent" :http-request="uploadLogoContent" action :show-file-list="false">
                <img v-if="companyForm.companyContent" :src="serveUrl + companyForm.companyContent" class="logo" />
                <i v-else class="el-icon-plus upload-demo-icon"></i>
              </el-upload>
            </div>
          </el-form-item>
          <el-form-item label="showIndex">
            <el-input size="mini" type="number" v-model="companyForm.showIndex" style="width:178px"></el-input>
          </el-form-item>
          <el-form-item label="Contacts" prop="companyContact" style="display:block">
            <div class="contact" v-for="(item, index) in companyForm.companyContact" :key="index">
              <div class="contact_box">
                <img v-if="item.contactLogo" :src="serveUrl+item.contactLogo" alt="" width="50px" height="50px">
                <div>
                  <p>{{ item.contactName }}</p>
                  <p>{{ item.contactEmail }}</p>
                  <p>{{ item.contactMobile }}</p>
                </div>
              </div>
              <i class="el-icon-circle-close" @click="deleteContact(index)"></i>
            </div>
            <el-button size="mini" @click="dialogVisible = true">ADD</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closedForm(0)">Cancel</el-button>
        <el-button type="primary" @click="addDataFn">Save</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisible" width="400px" :close-on-click-modal="false" :close-on-press-escape="false" @close="closeDia">
      <el-form ref="form_contact" :rules="rules" :model="contactObj" label-width="100px">
        <el-form-item label="portrait">
          <div style="width:100px">
            <el-upload class="upload-demo" :before-upload="beforeUploadHead" :http-request="uploadLogoHead" action :show-file-list="false">
              <img v-if="contactObj.contactLogo" :src="serveUrl + contactObj.contactLogo" class="logo" />
              <i v-else class="el-icon-plus upload-demo-icon"></i>
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item label="Name" prop="contactName">
          <el-input size="mini" v-model="contactObj.contactName" style="width:200px"></el-input>
        </el-form-item>
        <el-form-item label="Email">
          <el-input size="mini" v-model="contactObj.contactEmail" style="width:200px"></el-input>
        </el-form-item>
        <el-form-item label="Mobile" prop="contactMobile">
          <el-input size="mini" v-model="contactObj.contactMobile" style="width:200px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="addContact">ADD</el-button>
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
      companyForm: { companyLogo: '', companyContent: '', companyContact: [], showIndex: '' },
      options: [
        {
          value: 'Bankers',
          label: 'Bankers',
        },
        {
          value: 'Law Firms',
          label: 'Law Firms',
        },
        {
          value: 'Interior',
          label: 'Interior',
        },
        {
          value: 'Mortgage Broker',
          label: 'Mortgage Broker',
        },
        {
          value: 'Home Services',
          label: 'Home Services',
        },
        {
          value: 'Property Platforms',
          label: 'Property Platforms',
        },
      ],
      uploadFlag: false,
      dialogVisible: false,
      contactObj: { contactLogo: '' },
      imgLoad: '',
      editLogo: '',
      editLogo1: '',
      imgLoad1: '',
      imgLoad2: '',
      headImgCancel: [],//取消时删除
      headImgSave: []//保存时删除
    }
  },
  computed: {
    rules () {
      let blurArr = ['companyName', 'contactName', 'contactMobile']
      let changeArr = ['type', 'companyLogo', 'companyContact']
      return {
        ...setRulesData('blur', blurArr),
        ...setRulesData('change', changeArr),
      }
    },
  },
  watch: {
    show (val) {
      if (val && this.type === 'edit') {
        this.$Get(this.$api.queryCompanyContactList, {
          companyId: JSON.parse(JSON.stringify(this.editData)).companyId,
        }).then((res) => {
          if (res.code == 0) {
            this.companyForm = JSON.parse(JSON.stringify(this.editData))
            this.editLogo = JSON.parse(
              JSON.stringify(this.editData)
            ).companyLogo
            this.editLogo1 = JSON.parse(
              JSON.stringify(this.editData)
            ).companyContent
            this.imgLoad = ''
            this.imgLoad2 = ''
            res.datas.forEach((item) => {
              this.companyForm.companyContact.push({
                contactName: item.contactName,
                contactLogo: item.contactLogo,
                contactEmail: item.contactEmail,
                contactMobile: item.contactMobile,
              })
            })
          }
        })
      }
    },
  },
  methods: {
    addDataFn () {
      this.$refs['form_company'].validate((valid) => {
        if (valid) {
          this.companyForm.userId = JSON.parse(
            sessionStorage.getItem('userInfo')
          ).userId
          this.$Post(this.$api.saveCompany, this.companyForm).then((res) => {
            if (res.code == 0) {
              if (this.type === 'edit') {
                let path = this.headImgSave
                if (this.editLogo.length > 0 && this.imgLoad.length > 0) {
                  path.push(this.editLogo)
                }
                if (this.editLogo1.length > 0 && this.imgLoad2.length > 0) {
                  path.push(this.editLogo1)
                }
                if (path.length > 0) {
                  this.$Get(this.$api.deleteUploadFile, {
                    path: path.join(),
                  }).then((_res) => {
                    if (_res.code == 0) {
                      this.editLogo = ''
                      this.editLogo1 = ''
                      this.headImgSave = []
                    }
                  })
                }
              } else {
                if (this.headImgSave.length > 0) {
                  this.$Get(this.$api.deleteUploadFile, {
                    path: this.headImgSave.join(),
                  }).then((_res) => {
                    if (_res.code == 0) {
                      this.headImgSave = []
                    }
                  })
                }
              }
              this.$message.success('保存成功')
              this.closedForm(1)
              this.$emit('loadData')
            }
          })
        } else {
          return false
        }
      })
    },
    closeDia () {
      if (this.imgLoad1.length > 0) {
        this.$Get(this.$api.deleteUploadFile, { path: this.imgLoad1 })
          .then((_res) => {
            if (_res.code == 0) {
              this.imgLoad1 = ''
            }
          })
      }
      this.contactObj.contactLogo = ''
      this.contactObj.contactEmail = ''
      this.$refs['form_contact'].resetFields()

    },
    addContact () {
      this.$refs['form_contact'].validate((valid) => {
        if (valid) {
          this.companyForm.companyContact.push({
            contactName: this.contactObj.contactName,
            contactLogo: this.contactObj.contactLogo,
            contactEmail: this.contactObj.contactEmail,
            contactMobile: this.contactObj.contactMobile,
          })
          this.headImgCancel.push(this.contactObj.contactLogo)
          this.dialogVisible = false
          this.contactObj.contactLogo = ''
          this.contactObj.contactEmail = ''
          this.imgLoad1 = ''
          this.$refs['form_contact'].resetFields()
        } else {
          return false
        }
      })
    },
    beforeUpload (file) {
      const isJPG_Png = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      const type = this.companyForm.type
      if (!type) {
        this.$message.error('请先选择APP Group再进行上传')
        this.uploadFlag = false
        return false
      }
      if (!isJPG_Png) {
        this.$message.error('请上传JPG或者PNG格式LOGO!')
        this.uploadFlag = false
        return false
      }
      if (!isLt2M) {
        this.$message.error('上传LOGO大小不能超过 2MB!')
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
        formData.append('type', 'pnd_company_logo')
        formData.append('group', this.companyForm.type)
        formData.append('id', this.type === 'edit' ? this.companyForm.companyId : '')
        formData.append(
          'signature',
          this.$signatrue({
            type: 'pnd_company_logo',
            group: this.companyForm.type,
            id: this.type === 'edit' ? this.companyForm.companyId : ''
          })
        )
        formData.append('file', file.file)
        self
          .$PostFormData(this.$api.pndUploadFile, formData)
          .then((res) => {
            if (res.code == 0) {
              self.companyForm.companyLogo = res.datas.filePath
              self.$message.success('上传成功')
              if (self.imgLoad.length === 0) {
                self.imgLoad = res.datas.filePath
              } else {
                self
                  .$Get(self.$api.deleteUploadFile, { path: self.imgLoad })
                  .then((_res) => {
                    if (_res.code == 0) {
                      self.imgLoad = ''
                      self.imgLoad = res.datas.filePath
                    }
                  })
              }
            } else {
              self.$message.error('上传失败')
            }
          })
          .catch((err) => { })
      }
    },
    beforeUploadContent (file) {
      const isJPG_Png = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      const type = this.companyForm.type
      if (!type) {
        this.$message.error('请先选择APP Group再进行上传')
        this.uploadFlag = false
        return false
      }
      if (!isJPG_Png) {
        this.$message.error('请上传JPG或者PNG格式LOGO!')
        this.uploadFlag = false
        return false
      }
      if (!isLt2M) {
        this.$message.error('上传LOGO大小不能超过 2MB!')
        this.uploadFlag = false
        return false
      }
      if (isLt2M && type && isJPG_Png) this.uploadFlag = true
      // return isLt2M && type;
    },
    uploadLogoContent (file) {
      if (this.uploadFlag) {
        let formData = new FormData()
        let self = this
        formData.append('type', 'pnd_company_logo')
        formData.append('group', this.companyForm.type)
        formData.append('id', this.type === 'edit' ? this.companyForm.companyId : '')
        formData.append(
          'signature',
          this.$signatrue({
            type: 'pnd_company_logo',
            group: this.companyForm.type,
            id: this.type === 'edit' ? this.companyForm.companyId : ''
          })
        )
        formData.append('file', file.file)
        self
          .$PostFormData(this.$api.pndUploadFile, formData)
          .then((res) => {
            if (res.code == 0) {
              self.companyForm.companyContent = res.datas.filePath
              console.log(self.companyForm.companyContent);
              self.$message.success('上传成功')
              if (self.imgLoad2.length === 0) {
                self.imgLoad2 = res.datas.filePath
              } else {
                self
                  .$Get(self.$api.deleteUploadFile, { path: self.imgLoad2 })
                  .then((_res) => {
                    if (_res.code == 0) {
                      self.imgLoad2 = ''
                      self.imgLoad2 = res.datas.filePath
                    }
                  })
              }
            } else {
              self.$message.error('上传失败')
            }
          })
          .catch((err) => { })
      }
    },
    beforeUploadHead (file) {
      const isJPG_Png = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG_Png) {
        this.$message.error('请上传JPG或者PNG格式LOGO!')
        this.uploadFlag = false
        return false
      }
      if (!isLt2M) {
        this.$message.error('上传LOGO大小不能超过 2MB!')
        this.uploadFlag = false
        return false
      }
      if (isLt2M && isJPG_Png) this.uploadFlag = true
      // return isLt2M && type;
    },
    uploadLogoHead (file) {
      if (this.uploadFlag) {
        let formData = new FormData()
        let self = this
        formData.append('type', 'pnd_company_contact_logo')
        formData.append('id', this.type === 'edit' ? this.companyForm.companyId : '')
        formData.append(
          'signature',
          this.$signatrue({
            type: 'pnd_company_contact_logo',
            id: this.type === 'edit' ? this.companyForm.companyId : ''
          })
        )
        formData.append('file', file.file)
        self
          .$PostFormData(this.$api.pndUploadFile, formData)
          .then((res) => {
            if (res.code == 0) {
              self.contactObj.contactLogo = res.datas.filePath
              self.$message.success('上传成功')
              if (self.imgLoad1.length === 0) {
                self.imgLoad1 = res.datas.filePath
              } else {
                self
                  .$Get(self.$api.deleteUploadFile, { path: self.imgLoad1 })
                  .then((_res) => {
                    if (_res.code == 0) {
                      self.imgLoad1 = ''
                      self.imgLoad1 = res.datas.filePath
                    }
                  })
              }
            } else {
              self.$message.error('上传失败')
            }
          })
          .catch((err) => { })
      }
    },
    deleteContact (index) {
      this.headImgSave.push(this.companyForm.companyContact[index].contactLogo)
      this.companyForm.companyContact.splice(index, 1)
    },
    closedForm (id) {
      this.$refs['form_company'].resetFields()
      this.companyForm = {
        companyLogo: '',
        companyContent: '',
        companyContact: [],
      }
      this.editLogo = ''
      this.editLogo1 = ''
      let path = this.headImgCancel
      if (this.imgLoad.length > 0) {
        path.push(this.imgLoad)
      }
      if (this.imgLoad2.length > 0) {
        path.push(this.imgLoad2)
      }
      if (path.length > 0 && !id) {
        this.$Get(this.$api.deleteUploadFile, { path: path.join() }).then(
          (_res) => {
            if (_res.code == 0) {
              this.imgLoad = ''
              this.imgLoad2 = ''
              this.headImgCancel = []
            }
          }
        )
      } else {
        this.headImgCancel = []
      }
      this.$emit('cancel')
    },
  },
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
