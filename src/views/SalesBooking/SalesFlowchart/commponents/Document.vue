<template>
  <div class="Document_content sonBox">
    <div class="case">
      <div v-if="!location" class="lfLable">Booking of Unit</div>
      <div v-if="!location" class="fromDiv publicity">
        <h1>
          Option Date
          <span>{{ documentObj.OptionDate }}</span>
        </h1>
        <h1>
          System No.
          <span>{{ documentObj.SystemNo }}</span>
        </h1>
      </div>
      <div class="fromDiv Document_content_div">
        <el-table border :header-cell-style="{ background: '#f5f7fa' }" class="Document_content_div_tab" :data="tableData" style="width: 100%">
          <el-table-column label="No." prop="method">
            <template slot-scope="scope">{{ scope.$index + 1 }}</template>
          </el-table-column>
          <el-table-column label="Documet" prop="title"></el-table-column>
          <el-table-column label="Files" prop="chequeNo" width="300">
            <template slot-scope="scope" v-if="scope.row.allowGenerate == 1">
              <el-tag v-for="(tag, index) in scope.row.url" :key="index" closable v-if="tag" effect="dark" @close="deleteImg(scope.row, tag)" @click="PreviewFn(tag)" style="
                  display: block;
                  width: 130px;
                  margin: 5px auto;
                  cursor: pointer;
                ">
                #{{ index + 1 }}Pic Preview
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="Attachment" prop="attachment">
            <template slot-scope="scope">
              <el-button v-if="scope.row.attachment" size="mini" @click="PreviewFn(scope.row.attachment)">
                View
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="edit" width="500">
            <template slot-scope="scope">
              <el-button size="mini" v-if="scope.row.allowGenerate == 0" @click="ViewFn(scope.row)" :disabled="scope.row.url == ''">View</el-button>

              <el-upload class="upload-demo" :action="baseURL + $api.uploadTransactionFile" accept="application/pdf,image/jpeg,image/png" :data="{
                  ...upDataObj,
                  docId: scope.row.docId,
                  id: scope.row.id,
                }" :limit="30" auto-upload :on-success="upImgSuccess" :on-error="upImgError" v-if="scope.row.allowGenerate == 1" :show-file-list="false">
                <el-button size="small" type="primary" v-if="scope.row.url.length < 2">Click on the upload</el-button>
                <div slot="tip" class="el-upload__tip">
                  Only JPG/PNG/PDF files and no more than 1MB can be uploaded
                </div>
              </el-upload>
              <el-button size="mini" v-if="scope.row.allowGenerate == 0" @click="VersionView(scope.row)">Version
              </el-button>
              <el-button size="mini" v-if="scope.row.allowGenerate == 0" @click="OpenContractSettings(scope.row)" :disabled="(isAgentCompany == 3 && scope.row.type == 2)">Generate</el-button>
              <el-button size="mini" :disabled="scope.row.url == ''" v-if="scope.row.allowGenerate == 0 && scope.row.type == 1" @click="PDIFn(scope.row)">Go to E-Sign
              </el-button>
              <el-button size="mini" :disabled="scope.row.url == ''" v-if="AccessData['PDI_SIGNED']== 1&&(documentObj.transactionStatus=='PDI PENDING'||!documentObj.transactionStatus) && scope.row.type==1" @click="updateStatus('PDI SIGNED')">{{ $t('PDI SIGNED') }}</el-button>
              <el-button size="mini" :disabled="scope.row.url == ''" v-if="AccessData['COMPLETED']== 1&&documentObj.transactionStatus=='PDI SIGNED'&&userInfo.type!==3&& scope.row.type==2" @click="updateStatus('COMPLETED')">{{ $t('COMPLETED') }}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog title="Version" center :visible.sync="dialogVisible" width="40%">
      <div>
        <el-table border class="Document_content_div_tab" :data="VersionData" style="width: 100%">
          <el-table-column label="Date" prop="createTime"> </el-table-column>
          <el-table-column label="Adimin" prop="agentName"></el-table-column>

          <el-table-column label="edit">
            <template slot-scope="scope">
              <el-button size="mini" @click="ViewFn(scope.row)">View</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <el-dialog title="PDI" center :visible.sync="PdiVisible" width="70%">
      <PdiTemplate :recordId="upDataObj.recordId" :attachment="attachmentpath" :docid="nowdocid" />
    </el-dialog>

    <!-- 合同编号生产弹窗 -->
    <el-dialog title="OTP Settings" width="30%" center :visible.sync="outerVisible">
      <div>
        <p v-if="otpNewest">Last Generated OTP No.{{otpNewest}}</p>
        <p v-if="acitveGontractInfon.otp">Existing OTP No.{{acitveGontractInfon.otp}}</p>
        <p>Please select OTP No. output</p>
        <div style="text-align: center;">
          <el-button type="warning" style="margin-top: 20px" :disabled="isDisabled" @click="GenerateFn(1)">System
            generated OTP no. </el-button>
          </br>
          <el-button type="primary" style="margin-top: 20px" :disabled="isDisabled" @click="GenerateFn(2)">Select
            previous OTP no.</el-button>
          </br>
          <el-button type="danger" style="margin-top: 20px" @click="innerVisible = true">Manual input OTP no.
          </el-button>
        </div>
      </div>
      <el-dialog width="30%" title="OTP Settings" :visible.sync="innerVisible" append-to-body center @closed="otpNo = ''">
        <div style="text-align: center;">
          <el-input placeholder="Please key in OTP no." v-model="otpNo">
            <template slot="prepend">Please key in OTP no.</template>
          </el-input>
          <el-button type="primary" style="margin-top: 20px" :disabled="isDisabled" @click="GenerateFn(3)">Generate OTP
          </el-button>
        </div>
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
import { baseURL } from '@/InterfaceConfig/env'
import PdiTemplate from './module/pdiTemplate'
export default {
  components: { PdiTemplate },
  props: {
    documentObj: {
      type: Object,
    },
    location: {
      type: String,
      default: '',
    }
  },
  data () {
    return {
      query: this.$route.query,
      tableData: [],
      SystemNo: '',
      attachmentpath: '',
      nowdocid: '',
      upDataObj: {
        projectId: this.$route.query.projectId,
        unitId: this.$route.query.unitId,
        agentId: JSON.parse(sessionStorage.getItem('userInfo')).agentId,
        recordId: this.documentObj.recordId,
        brokeId: JSON.parse(sessionStorage.getItem('userInfo')).brokeId,
        token: JSON.parse(sessionStorage.getItem('userInfo')).token,
        source: 'manager',
        userId: JSON.parse(sessionStorage.getItem('userInfo')).agentId,
      },
      hostUrl: sessionStorage.getItem('serveUrl'),
      baseURL: baseURL,
      isDisabled: false,
      VersionData: [],
      dialogVisible: false,
      PdiVisible: false,
      acitveGontractInfon: {},
      outerVisible: false,
      innerVisible: false,
      userInfo: JSON.parse(sessionStorage.getItem('userInfo')),
      otpNo: '',
      otpNewest: '',
      isAgentCompany: JSON.parse(sessionStorage.getItem('userInfo')).type,
      AccessData: {}
    }
  },
  watch: {
    documentObj (val) {
      this.upDataObj.recordId = val.recordId
      this.queryDocumentList()
    },
  },
  mounted () {
    if (this.documentObj.recordId) {
      // this.upDataObj.recordId = this.documentObj.recordId
      this.queryDocumentList()
    }
    let data = {
      unitId: this.query.unitId,
      projectId: this.query.projectId,
    }
    this.$Post(this.$api.getUnitAccess, data).then((res) => {
      if (res.code == 0) {
        this.AccessData = res.datas
      }
    })
  },
  methods: {
    updateStatus (val) {
      this.$emit('updateStatus', val)
    },
    ViewFn (row) {
      if (!row.url) {
        this.$notify.error({
          title: 'Error',
          message: 'No file, click Generate!',
        })
        return false
      }
      window.open(this.hostUrl + row.url)
    },
    VersionView (row) {
      let data = {
        docId: row.docId,
        unitId: this.$route.query.unitId,
        recordId: this.documentObj.recordId,
      }
      this.$Posting(this.$api.queryDocumentsVersion, data).then((res) => {
        if (res.code == 0) {
          this.VersionData = res.datas
          this.dialogVisible = true
        } else {
          this.$notify.error({
            title: 'Error',
            message: res.msg,
          })
        }
      })
    },
    OpenContractSettings (row) {
      this.acitveGontractInfon = row
      if (row.allowGenerate == 0 && row.type == 2) {
        this.outerVisible = true
        this.$Geting(this.$api.queryMaxOtp, {
          projectId: this.$route.query.projectId,
          otpNo: row.otpNo,
          otpNewest: row.otpNewest
        })
          .then(res => {
            if (res.code == 0) {
              this.otpNewest = res.datas.otpNewest
            }
          })
      } else {
        this.GenerateFn()
      }
    },
    GenerateFn (type) {
      let data = {
        docId: this.acitveGontractInfon.docId,
        projectId: this.$route.query.projectId,
        unitId: this.$route.query.unitId,
        recordId: this.documentObj.recordId,
        genType: type,
        otpNo: this.otpNo,
      }
      this.isDisabled = true
      this.$Posting(this.$api.transactionGenerate, data).then((res) => {
        this.isDisabled = false
        if (res.code == 0) {
          this.$notify({
            title: 'Success',
            message: 'Generated File!',
            type: 'success',
          })
          this.outerVisible = false
          this.innerVisible = false
          this.queryDocumentList()
        } else {
          this.$notify.error({
            title: 'Error',
            message: res.msg,
          })
        }
      })
    },
    queryDocumentList () {
      this.$Posting(this.$api.queryDocumentsList, {
        projectId: this.$route.query.projectId,
        recordId: this.documentObj.recordId,
        unitId: this.$route.query.unitId,
      }).then((res) => {
        if (res.code == 0) {
          this.tableData = res.datas.map((i) => {
            return { ...i, url: i.url ? i.url.split(';') : [] }
          })
          // console.log('33333', this.tableData)
        }
      })
    },
    upImgSuccess (response, file, fileList) {
      if (response.code == 0) {
        this.queryDocumentList()
      } else {
        this.$notify.error({
          title: 'Error',
          message: response.msg,
        })
      }
    },
    upImgError (err, file, fileList) {
      console.log('err', err, file, fileList)
    },
    deleteImg (row, url) {
      let _this = this
      this.$confirm(
        'This action will delete the photo completly, Whether or not to continue?',
        'Caution',
        {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning',
        }
      )
        .then(() => {
          let data = {
            id: row.id,
            url: url,
          }
          _this.$Post(_this.$api.deleteTransactionFile, data).then((res) => {
            if (res.code == 0) {
              _this.$notify({
                title: 'Success',
                message: 'successfully delete',
                type: 'success',
              })
              this.queryDocumentList()
            } else {
              _this.$notify.error({
                title: 'error',
                message: res.msg,
              })
            }
          })
        })
        .catch(() => { })
    },
    PreviewFn (url) {
      window.open(this.hostUrl + url)
    },
    PDIFn (row) {
      this.PdiVisible = true
      this.attachmentpath = row.attachment
      this.nowdocid = row.docId
    },
  },
}
</script>

<style lang="less">
.Document_content {
  .publicity {
    padding: 20px;
    h1 {
      margin-bottom: 15px;
      color: #999;
      padding-left: 30px;
      span {
        color: #000;
        margin-left: 20px;
      }
    }
  }
  .Document_content_div {
    padding: 20px 30px !important;
  }
  .Document_content_div_tab {
    border: 1px solid #f4f4f4;
    td,
    th {
      text-align: center;
    }
    .el-icon-circle-close {
      color: crimson;
    }
    .img_div {
      background: #999;
      width: 100px;
      height: 80px;
      display: inline-block;
      border-radius: 5px;
      position: relative;
      &:hover {
        .el-icon-error {
          opacity: 1;
        }
      }
      .el-icon-error {
        position: absolute;
        font-size: 25px;
        right: -5px;
        opacity: 0;
        top: 0;
        z-index: 100;
        box-shadow: 0 0 5px #000;
        border-radius: 50%;
        color: red;
        background: #fff;
        transition: all 0.2s;
      }
      &:last-child {
        margin-left: 15px;
      }
      .el-image {
        width: 100%;
        height: 100%;
      }
      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }
    .image-slot {
      width: 100%;
      height: 100%;
      line-height: 60px;
      background: #f4f4f4;
    }
  }
}
</style>