<template>
  <div class="edit_version">
    <div class="version_form">
      <el-form class="demo-ruleForm" label-width="170px" size="small">
        <div class="form_section" v-if="type==0||type==-1">
          <el-form-item label="AppName" v-if="type==-1">
            <el-input class="form_input_375" v-model="appName" placeholder="Please fill in the APP name"></el-input>
          </el-form-item>
          <div class="form_title">
            <span>{{$t('ios_set')}}</span>
          </div>
          <el-form-item label="AppName" v-if="type==0">
            <el-input class="form_input_375" v-model="appName" placeholder="Please fill in the APP name"></el-input>
          </el-form-item>
          <el-form-item :label="$t('version_num')">
            <el-input class="form_input_375" v-model="iosVersion" :placeholder="$t('verificate_version_num')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('update_url')">
            <el-input class="form_input_375" v-model="iosUrl" :placeholder="$t('verificate_update_url')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('force_update')">
            <el-radio v-model="iosUpdate" :label="1">{{$t('yes')}}</el-radio>
            <el-radio v-model="iosUpdate" :label="0">{{$t('no')}}</el-radio>
          </el-form-item>
          <el-form-item :label="$t('update_desc')">
            <el-input type="textarea" v-model="iosDesc" style="width:375px" rows="5" :placeholder="$t('verificate_update_desc')"></el-input>
          </el-form-item>
        </div>
        <div class="form_section" v-if="type==1||type==-1">
          <div class="form_title">
            <span>{{$t('android_set')}}</span>
          </div>
          <el-form-item label="AppName" v-if="type==1">
            <el-input class="form_input_375" v-model="appName" placeholder="Please fill in the APP name"></el-input>
          </el-form-item>
          <el-form-item :label="$t('version_num')">
            <el-input class="form_input_375" v-model="androidVersion" :placeholder="$t('verificate_version_num')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('update_url')">
            <el-input class="form_input_375" v-model="androidUrl" :placeholder="$t('verificate_update_url')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('force_update')">
            <el-radio v-model="androidUpdate" :label="1">{{$t('yes')}}</el-radio>
            <el-radio v-model="androidUpdate" :label="0">{{$t('no')}}</el-radio>
          </el-form-item>
          <el-form-item :label="$t('update_desc')">
            <el-input type="textarea" v-model="androidDesc" style="width:375px" rows="5" :placeholder="$t('verificate_update_desc')"></el-input>
          </el-form-item>
        </div>
        <div class="form_section" v-if="type==2||type==-1">
          <div class="form_title">
            <span>{{$t('resource_set')}}</span>
          </div>
          <el-form-item label="AppName" v-if="type==2">
            <el-input class="form_input_375" v-model="appName" placeholder="Please fill in the APP name"></el-input>
          </el-form-item>
          <el-form-item :label="$t('version_num')">
            <el-input class="form_input_375" v-model="webVersion" :placeholder="$t('verificate_version_num')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('update_desc')">
            <el-input type="textarea" v-model="webDesc" style="width:375px" rows="5" :placeholder="$t('verificate_update_desc')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('upload_web_file')">
            <el-upload class="upload-demo" :before-upload="beforeUploadFile" :http-request="uploadSectionFile" action accept=".upk" :show-file-list="false">
              <el-button type="primary">{{$t('browse')}}</el-button>
              <span class="fileName">
                {{webZip[0]&&webZip[0].src}}
                <span v-if="webZip[0]&&webZip[0].src" class="el-icon-delete icon_delete" @click.stop="deleteZip"></span>
              </span>
            </el-upload>
          </el-form-item>
        </div>
        <div class="submit_form">
          <el-button type="primary" size="medium" style="width:300px;height:40px" @click="submitVersionForm">{{$t('release')}}</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
import md5 from 'js-md5'
export default {
  props: {
    editObj: {
      type: Object
    }
  },
  data () {
    return {
      iosVersion: '',
      iosUrl: '',
      iosUpdate: 0,
      iosDesc: '',
      androidVersion: '',
      androidUrl: '',
      androidUpdate: 0,
      androidDesc: '',
      webVersion: '',
      webZip: [],
      webDesc: '',
      verId: '',
      companyId: '',
      companyList: [],
      isShowSelectCompany: false,
      appName: '',
      hostUrl: sessionStorage.getItem('serveUrl') || '',
      type: -1 //页面类型 ios 安卓或者web
    }
  },
  watch: {
    editObj (val) {
      this.judgeSession(val)
    }
  },
  created () {
    this.judgeSession(this.editObj)
  },
  methods: {
    beforeUploadFile () {
      if (this.webZip.length) {
        this.$message({
          message: this.$t('delete_origin_file'),
          type: 'warning'
        })
        return false
      }
    },
    //判断是否有缓存
    judgeSession (obj) {
      if (JSON.stringify(obj) != '{}') {
        //判断缓存里面有没有编辑信息
        let editVersionMsg = obj
        this.type = editVersionMsg.type
        this.verId = editVersionMsg.verId
        this.appName = editVersionMsg.appName
        if (this.type == 0) {
          //ioc
          this.iosVersion = editVersionMsg.versionNo
          this.iosUrl = editVersionMsg.url
          this.iosUpdate = editVersionMsg.isUpdate
          this.iosDesc = editVersionMsg.desc
          // this.appName = editVersionMsg.appName;
        } else if (this.type == 1) {
          //安卓
          this.androidVersion = editVersionMsg.versionNo
          this.androidUrl = editVersionMsg.url
          this.androidUpdate = editVersionMsg.isUpdate
          this.androidDesc = editVersionMsg.desc
        } else if (this.type == 2) {
          //web
          this.webVersion = editVersionMsg.versionNo
          editVersionMsg.url &&
            (this.webZip = [
              {
                src: editVersionMsg.url
              }
            ])
          this.webDesc = editVersionMsg.desc
        }
      } else {
        this.type = -1
        this.verId = ''
        this.appName = ''
        this.iosVersion = ''
        this.iosUrl = ''
        this.iosUpdate = ''
        this.iosDesc = ''

        this.androidVersion = ''
        this.androidUrl = ''
        this.androidUpdate = ''
        this.androidDesc = ''
        this.webVersion = ''
        this.webZip = []
        this.webDesc = ''

        return
      }
    },
    //发布版本
    submitVersionForm () {
      let params
      let api = this.$api.updateAppVersion
      let iosParams = {
        url: this.iosUrl,
        versionNo: this.iosVersion,
        isUpdate: this.iosUpdate,
        desc: this.iosDesc,
        // appName: this.appName,
        type: 0
      }
      let androidParams = {
        url: this.androidUrl,
        versionNo: this.androidVersion,
        isUpdate: this.androidUpdate,
        desc: this.androidDesc,
        // appName: this.appName,
        type: 1
      }
      let webParams = {
        url: this.webZip[0] ? this.webZip[0].src : '',
        versionNo: this.webVersion,
        isUpdate: 0,
        desc: this.webDesc,
        // appName: this.appName,
        type: 2
      }
      if (this.type == 0) {
        params = iosParams
        params.verId = this.verId
        params.appName = this.appName
      } else if (this.type == 1) {
        params = androidParams
        params.verId = this.verId
        params.appName = this.appName
      } else if (this.type == 2) {
        params = webParams
        params.verId = this.verId
        params.appName = this.appName
      } else {
        api = this.$api.saveAppVersion
        params = [iosParams, androidParams, webParams]
        params = { appVersion: JSON.stringify(params), appName: this.appName }
        //编辑
      }
      this.$Posting(api, params)
        .then(res => {
          if (res.code === '0') {
            if (window.sessionStorage.getItem('uploadedZip')) {
              window.sessionStorage.removeItem('uploadedZip')
            }
            this.$notify.success({
              title: this.$t('alert.alert_success_title'),
              message: this.$t('alert.operate_success_title')
            })
            this.$emit('dialogFn')
            // this.$router.replace('/home/versionList.html')

          } else {
            this.$notify.error({
              title: this.$t('alert.fail'),
              message: this.$t('alert.operate_fail_title')
            })
          }
        })
        .catch(err => {
          this.$notify.error({
            title: this.$t('alert.fail'),
            message: this.$t('alert.operate_fail_title')
          })
        })
    },
    //删除文件
    deleteZip () {
      let self = this
      this.$Post(this.$api.deleteFile, { path: self.webZip[0].src })
        .then(res => {
          if (res.code === '0') {
            self.webZip = []
            if (window.sessionStorage.getItem('uploadedZip')) {
              window.sessionStorage.removeItem('uploadedZip')
            }
          } else {
            this.$notify.error({
              title: this.$t('alert_fail_title'),
              message: this.$t('alert_fail_delete_title')
            })
          }
        })
        .catch(err => {
          this.$notify.error({
            title: this.$t('alert_fail_title'),
            message: this.$t('alert_fail_delete_title')
          })
        })
    },
    //zip文件上传成功后的函数
    uploadSectionFile (file) {
      let user = JSON.parse(window.sessionStorage.getItem('userInfo'))
      let formData = new FormData()
      let self = this
      formData.append('brokeId', user.brokeId)
      formData.append('userId', user.userId)
      formData.append('token', user.token)
      formData.append('file', file.file)
      formData.append("signature", md5(user.brokeId + user.userId + 'c1d65f3667324592a071ebec5038f38c'));
      this.$PostFormData(this.$api.uploadWebResource, formData)
        .then(res => {
          if (res.code == 0) {
            self.webZip = [
              {
                src: this.hostUrl + res.datas.filePath
              }
            ]
            window.sessionStorage.setItem(
              'uploadedZip',
              JSON.stringify([this.hostUrl + res.datas.filePath])
            )
          } else {
            this.$notify.error({
              title: this.$t('alert.fail'),
              message: this.$t('upload_fail_alert')
            })
          }
        })
        .catch(err => {
          this.$notify.error({
            title: this.$t('alert.fail'),
            message: this.$t('upload_fail_alert')
          })
        })
    }
  },
  beforeDestroy () {
    this.$deleteZip()
  }
}
</script>
<style lang="less" scoped>
.edit_version {
  .form_section {
    padding: 18px 0 1px 20px;
    background-color: #fff;
    margin-bottom: 2px;
    .form_title {
      margin-bottom: 18px;
      span {
        background-color: #f0f0f0;
        font-size: 14px;
        padding: 5px 10px;
        border-radius: 10px;
      }
    }
    .form_input_375 {
      width: 375px;
    }
  }
  .submit_form {
    background-color: #fff;
    padding: 20px;
    text-align: center;
  }
}
</style>


