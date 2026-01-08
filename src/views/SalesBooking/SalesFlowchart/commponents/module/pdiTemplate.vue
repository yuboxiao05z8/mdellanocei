<template>
  <div class="pdiTemplate" v-loading="loading">
    <div class="pdiTemplate_text">
      Property Details Information (PDI) documents: This is a set of all the
      floor plans, rules and regulations, offered items and other documents
      relating to your unit.
    </div>
    <div class="pdiTemplate_view">
      <div class="initialize_pdi" v-if="!status">
        <el-button class="sign_btn" type="primary" @click="sign">
          <h1 style="margin-bottom:5px;font-size:18px">Generate E-Sign</h1>
          <p>& send email to buyer</p>
        </el-button>
        <p class="warning_info">
          Notice: Please check and confirm the details before generating the
          PDI. You will not be able to edit the information after PDI
          generation. Any post PDI generation editing request, please approach
          the Developer.
        </p>
      </div>
      <div class="complete_pdi" v-else>
        <el-card class="box-card" shadow="never">
          <div>
            PDI
            <el-button style="margin-left: 20px" size="mini" type="primary" @click="downloadFn('template')">PDI Template
              Download</el-button>
          </div>
          <!-- <div>PDI Reference No. : {{ contractInfo.code }}</div> -->
          <div>
            PDI Generation Date:
            {{ $dateFormatNoTime(contractInfo.createTime) }}
          </div>
        </el-card>
        <el-card shadow="never" class="Pdi_table">
          <el-table :data="tableData" size="small" class="fontChange">
            <el-table-column label="Buyer Name" prop="name"></el-table-column>
            <el-table-column label="Buyer Email" prop="email"></el-table-column>
            <el-table-column label="Signature Status">
              <template slot-scope="scope">
                <el-button v-if="
                    scope.row.status == 'signed' ||
                    scope.row.status == 'completed' ||
                    scope.row.status == 'faxpending'
                  " type="success" size="mini" round>{{ scope.row.status }}</el-button>
                <el-button v-else type="danger" size="mini" round>
                  {{
                  scope.row.status
                  }}
                </el-button>
              </template>
            </el-table-column>
            <el-table-column label="Edit" width="450">
              <template slot="header" slot-scope="scope">
                <el-button size="mini" @click="buyerList">Refresh Status Signature</el-button>
              </template>
              <template slot-scope="scope">
                <el-button size="mini" type="primary" @click="buyerSign(scope.row)">E-sign now</el-button>
                <el-button size="mini" type="primary" @click="buyerSignByEmail(scope.row)">Resend Email</el-button>
                <!-- <el-button size="mini" type="primary" @click="copyLink(scope.row, $event)">Copy Signing URL</el-button> -->
              </template>
            </el-table-column>
          </el-table>
        </el-card>

        <div class="pdi_btns">
          <el-button style="margin-right: 10px" type="primary" @click="downloadSignFile()" :disabled="isDisabled">Download
            Signed PDI</el-button>

          <el-button v-if="attachment" style="margin-right: 10px" type="primary" @click="downloadFile(attachment)">Annex
            Documents Download</el-button>

          <el-button type="danger" v-if="developers == 2" @click="sign">Click to regenerate and resign</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ClipboardJS from 'clipboard'
import { baseURL } from '@/InterfaceConfig/env'
export default {
  props: ['recordId', 'attachment', 'docid'],
  data () {
    return {
      baseURL: baseURL,
      status: 1,
      tableData: [],
      contractInfo: {},
      serveUrl: sessionStorage.getItem('serveUrl'),
      list: [],
      loading: false,
      isDisabled: false,
      developers: JSON.parse(sessionStorage.getItem('userInfo')).type,
      clipboard: null,
      copyText: '',
      upDataObj: {
        projectId: this.$route.query.projectId,
        unitId: this.$route.query.unitId,
        agentId: JSON.parse(sessionStorage.getItem('userInfo')).agentId,
        brokeId: JSON.parse(sessionStorage.getItem('userInfo')).brokeId,
        token: JSON.parse(sessionStorage.getItem('userInfo')).token,
        source: 'manager',
        userId: JSON.parse(sessionStorage.getItem('userInfo')).agentId,
      },
    }
  },
  mounted () {
    this.getSignPdiInfo()
  },
  methods: {
    getSignPdiInfo () {
      this.$Post(this.$api.getSignPdiInfo, { recordId: this.recordId }).then(
        (res) => {
          if (res.code == 0) {
            if (res.datas) {
              this.contractInfo = res.datas
              this.status = 1
              this.buyerList()
            } else {
              this.status = 0
            }
          }
        }
      )
    },
    buyerList () {
      this.loading = true
      this.$Post(this.$api.buyerList, { recordId: this.recordId }).then(
        (res) => {
          this.loading = false
          if (res.code == 0) {
            this.tableData = JSON.parse(res.datas.recipients).map((i) => {
              return {
                id: i.id,
                name: i.name,
                status: i.status,
                role: i.role,
                email: i.email,
              }
            })
            this.querySignStatus()
          }
        }
      )
    },
    sign () {
      this.loading = true
      this.$Post(this.$api.sign, {
        recordId: this.recordId,
        docId: this.docid,
      }).then((res) => {
        this.loading = false
        if (res.code == 0) {
          this.getSignPdiInfo()
        } else {
          this.$notify.error({
            title: 'error',
            message: res.msg,
          })
        }
      })
    },
    downloadFn (type) {
      if (type === 'template') {
        if (this.contractInfo.path) {
          window.open(this.serveUrl + this.contractInfo.path)
        }
      } else {
        this.loading = true
        let newWindow = window.open()
        newWindow.location.href = this.$addDownUrl(this.$api.downloadSign, {
          envelopeId: this.contractInfo.envelopeId,
        })
        this.loading = false
      }
    },

    buyerSign (row) {
      console.log(row)
      let data = {
        envelopeId: this.contractInfo.envelopeId,
        docId: this.docid,
      }

      if (row) {
        data.buyerId = row.id
      } else {
        data.buyerId = this.tableData[0].id
      }

      this.loading = true
      let newWindow = window.open()
      this.$Post(this.$api.buyerSign, data).then((res) => {
        this.loading = false
        if (res.code == 0) {
          newWindow.location.href = res.datas.url
          console.log(res.datas.url)
        } else {
          this.$notify.error({
            title: 'error',
            message: res.msg,
          })
        }
      })
    },
    downloadSignFile (row) {
      console.log(this.$api.downloadSignFile)
      let data = {
        envelopeId: this.contractInfo.envelopeId,
        docId: this.docid,
      }

      if (row) {
        data.buyerId = row.id
      } else {
        data.buyerId = this.tableData[0].id
      }

      this.loading = true
      let newWindow = window.open()
      this.$Post(this.$api.downloadSignFile, data).then((res) => {
        this.loading = false
        if (res.code == 0) {
          newWindow.location.href = res.datas
          console.log(res.datas)
        } else {
          this.$notify.error({
            title: 'error',
            message: res.msg,
          })
        }
      })
    },
    buyerSignByEmail (row) {
      let data = {
        buyerId: row.id,
        envelopeId: this.contractInfo.envelopeId,
        docId: this.docid,
      }
      this.loading = true
      this.$Post(this.$api.buyerSignByEmail, data).then((res) => {
        this.loading = false
        if (res.code == 0) {
          this.$notify({
            title: 'success',
            message: 'The signed message has been sent',
            type: 'success',
          })
        } else {
          this.$notify.error({
            title: 'error',
            message: res.msg,
          })
        }
      })
    },
    querySignStatus () {
      this.loading = true
      this.$Post(this.$api.querySignStatus, {
        envelopeId: this.contractInfo.envelopeId
      }).then(
        (res) => {
          this.loading = false
          if (res.code == 0) {
            switch (res.datas.status) {
              case 'completed':
              case 'faxpending':
              case 'autoresponded':
                this.isDisabled = false
                break

              default:
                this.isDisabled = true
                break
            }
          }
        }
      )
    },
    copyLink (row, event) {
      let data = {
        envelopeId: this.contractInfo.envelopeId,
        buyerId: row.id,
      }
      this.loading = true
      this.$Post(this.$api.buyerSign, data).then((res) => {
        this.loading = false
        if (res.code == 0) {
          this.copyText = res.datas.url

          this.$alert(
            'Warning: This is a DISPOSABLE URL. It will be INVALID once being used by browser for any use',
            'Succeed',
            {
              confirmButtonText: 'Confirm&Copy',
              confirmButtonClass: 'copyBtn',
              showCancelButton: true,
              cancelButtonText: 'Cancel',
              center: true,
              callback: (action) => { },
            }
          )

          this.copyFn()
        } else {
          this.$notify.error({
            title: 'error',
            message: res.msg,
          })
        }
      })
    },
    copyFn () {
      let _this = this
      this.clipboard = new ClipboardJS('.copyBtn', {
        text: () => {
          return _this.copyText
        },
      })
      this.clipboard.on('success', (e) => {
        this.clipboard.destroy()
      })
      this.clipboard.on('error', () => {
        this.clipboard.destroy()
      })
    },
    downloadFile (attachmentpath) {
      // window.open('https://img.singmap.com/upload/broke/template/Normanton%20Park-%20Annex%20C-G%20(Residential).pdf')
      window.open(this.serveUrl + attachmentpath)
    },
  },
}
</script>

<style lang="less">
.pdiTemplate {
  .pdiTemplate_text {
    margin-bottom: 50px;
    word-break: break-word;
    padding: 0 20px;
    font-weight: bold;
    font-size: 15px;
    line-height: 1.5;
  }
  .pdiFileImg {
    width: 100%;
    height: 100%;
    background: #ddd;
    border-radius: 5px;
    img {
      object-fit: contain;
    }
    .image-slot {
      width: 100%;
      height: 100%;
      line-height: 70px;
    }
  }
  .pdiFileImg_box {
    position: relative;
    width: 120px;
    height: 70px;
    margin: 0 auto;
    .el-icon-error {
      position: absolute;
      font-size: 25px;
      background: #fff;
      border-radius: 50%;
      color: red;
      right: 0;
      top: 0;
      z-index: 100;
      opacity: 0.2;
    }
    &:hover {
      .el-icon-error {
        opacity: 1;
      }
    }
  }
  .pdiTemplate_view {
    .initialize_pdi {
      text-align: center;
      .sign_btn {
        width: 300px;
        height: 100px;
      }
      .warning_info {
        margin-top: 60px;
        text-align: left;
        color: #ff6666;
        word-break: break-word;
        padding: 0 20px;
        line-height: 1.5;
      }
    }
    .complete_pdi {
      .box-card {
        margin-bottom: 15px;
        div {
          margin-bottom: 15px;
          &:last-child {
            margin: 0;
          }
        }
      }
      .Pdi_table {
        .el-table td,
        .el-table th {
          text-align: center;
        }
      }
      .pdi_btns {
        margin-top: 25px;
        text-align: center;
      }
    }
  }
  .fontChange .el-table__body .cell {
    font-size: 16px;
  }
}
</style>