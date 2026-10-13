<template>
  <div class="addEditCompany">
    <el-dialog center title="Link" :visible.sync="show" :close-on-click-modal="false" :close-on-press-escape="false" width="800px" append-to-body :show-close='false'>
      <div class="addEditCompany_box">
        <el-form ref="form_link" :rules="rules" :model="linkForm" label-width="120px">
          <el-form-item label="Link Name" prop="linkName">
            <el-input size="mini" v-model="linkForm.linkName"></el-input>
          </el-form-item>
          <el-form-item label="URL" prop="link">
            <el-input size="mini" v-model="linkForm.link"></el-input>
          </el-form-item>
          <el-form-item label="APP Group" prop="type">
            <el-select v-model="linkForm.type" placeholder="select" size="mini" :disabled='imgLoad.length>0 && type ==="edit"'>
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="LOGO" prop="logo">
            <el-upload class="upload-demo" :before-upload="beforeUpload" :http-request="uploadLogo" action :show-file-list="false">
              <img v-if="linkForm.logo" :src="serveUrl+linkForm.logo" class="logo">
              <i v-else class="el-icon-plus upload-demo-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="Contacts">
            <div class="contact" v-for="(item, index) in linkForm.pndLinkContact" :key="index">
              <div class="contact_box">
                <img v-if="item.contactLogo" :src="serveUrl+item.contactLogo" alt="" width="50px" height="50px">
                <div>
                  <p class="one">{{ item.contactName }}</p>
                  <p class="two">{{ item.contactEmail }}</p>
                  <p class="three">{{ item.contactMobile }}</p>
                </div>
              </div>
              <i class="el-icon-circle-close" @click="deleteContact(index)"></i>
            </div>
            <el-button size="mini" @click="dialogVisible = true">ADD</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closedForm(false)">Cancel</el-button>
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
      linkForm: { logo: '', pndLinkContact: [], },
      dialogVisible: false,
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
      imgLoad1: '',
      editLogo: '',
      editLogo1: '',
      contactObj: { contactLogo: '' },
      headImgCancel: [],//取消时删除
      headImgSave: []//保存时删除
    }
  },
  computed: {
    rules () {
      let blurArr = [
        'linkName',
        'link',
        'contactName',
        'contactMobile'
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
        this.$Get(this.$api.queryLinkContactList, {
          linkId: JSON.parse(JSON.stringify(this.editData)).linkId,
        }).then((res) => {
          if (res.code == 0) {
            this.linkForm = JSON.parse(JSON.stringify(this.editData))
            this.editLogo = JSON.parse(JSON.stringify(this.editData)).logo
            this.editLogo1 = JSON.parse(
              JSON.stringify(this.editData)
            ).pndLinkContact
            this.imgLoad = ''
            res.datas.contact.forEach((item) => {
              this.linkForm.pndLinkContact.push({
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
    deleteContact (index) {
      this.headImgSave.push(this.linkForm.pndLinkContact[index].contactLogo)
      this.linkForm.pndLinkContact.splice(index, 1)
    },
    addContact () {
      this.$refs['form_contact'].validate((valid) => {
        if (valid) {
          this.linkForm.pndLinkContact.push({
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
        formData.append('type', 'pnd_logo')
        formData.append('id', this.type === 'edit' ? this.linkForm.linkId : '')
        formData.append(
          'signature',
          this.$signatrue({
            type: 'pnd_logo',
            id: this.type === 'edit' ? this.linkForm.linkId : ''
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
    addDataFn () {
      this.$refs['form_link'].validate((valid) => {
        if (valid) {
          this.linkForm.userId = JSON.parse(sessionStorage.getItem('userInfo')).userId
          this.$Post(this.$api.saveLink, this.linkForm).then(res => {
            if (res.code == 0) {
              if (this.type === 'edit') {
                let path = this.headImgSave
                path.push()
                if (this.editLogo.length > 0 && this.imgLoad.length > 0) {
                  path.push(this.editLogo)
                }
                if (this.editLogo1.length > 0) {
                  path.push(this.editLogo1)
                }
                if (path.length > 0) {
                  this.$Get(this.$api.deleteUploadFile, { path: path.join() }).then(_res => {
                    if (_res.code == 0) {
                      this.editLogo = ''
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
        formData.append('id', this.type === 'edit' ? this.linkForm.linkId : '')
        formData.append('signature', this.$signatrue({ type: 'pnd_link_logo', group: this.linkForm.type, id: this.type === 'edit' ? this.linkForm.linkId : '' }))
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
    closedForm (bool) {
      this.$refs['form_link'].resetFields();
      this.linkForm = {
        logo: '',
      }
      this.editLogo = ''
      let path = this.headImgCancel
      if (this.imgLoad.length > 0) {
        path.push(this.imgLoad)
      }
      if (path.length > 0 && !bool) {
        this.$Get(this.$api.deleteUploadFile, { path: path.join() }).then(_res => {
          if (_res.code == 0) {
            this.imgLoad = ''
            this.headImgCancel = []
          }
        })
      } else {
        this.headImgCancel = []
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