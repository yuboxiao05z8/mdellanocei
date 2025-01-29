<template>
  <div class="pdiTemplate" v-loading="loading">
    <div class="pdiTemplate_text">
      Property Details Information (PDI) documents: This is a set of all the
      floor plans, rules and regulations, offered items and other documents
      relating to your unit.
    </div>
    <div class="pdiTemplate_view">
      <div class="initialize_pdi" v-if="!status">
        <el-button type="primary" @click="sign">Creation PDI</el-button>
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
            <el-button
              style="margin-left: 20px"
              size="mini"
              type="primary"
              @click="downloadFn('template')"
              >PDI Template Download</el-button
            >
          </div>
          <div>PDI Reference No. : {{ contractInfo.code }}</div>
          <div>
            PDI Generation Date:
            {{ $dateFormatNoTime(contractInfo.createTime) }}
          </div>
        </el-card>
        <el-card shadow="never" class="Pdi_table">
          <el-table :data="tableData" size="mini">
            <el-table-column label="Buyer Name" prop="name"> </el-table-column>
            <el-table-column label="Signature Status">
              <template slot-scope="scope">
                <el-button
                  v-if="
                    scope.row.status == 'signed' ||
                    scope.row.status == 'completed' ||
                    scope.row.status == 'faxpending'
                  "
                  type="success"
                  size="mini"
                  round
                  >{{ scope.row.status }}</el-button
                >
                <el-button v-else type="danger" size="mini" round>{{
                  scope.row.status
                }}</el-button>
              </template>
            </el-table-column>
            <el-table-column label="Edit" width="300">
              <template slot="header" slot-scope="scope">
                <el-button size="mini" @click="buyerList"
                  >Refresh Status Signature</el-button
                >
              </template>
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  @click="buyerSign(scope.row)"
                  >Preview Signature</el-button
                >
                <el-button
                  size="mini"
                  type="primary"
                  @click="buyerSignByEmail(scope.row)"
                  >Email Signature</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-card>

        <div class="pdi_btns">
          <el-button
            style="margin-right: 30px"
            type="primary"
            @click="buyerSign()"
            :disabled="isDisabled"
            >Signed PDI Download</el-button
          >
          <el-button type="danger" v-if="developers == 2" @click="sign">Regenerate PDI</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['recordId'],
  data() {
    return {
      status: 1,
      tableData: [],
      contractInfo: {},
      serveUrl: sessionStorage.getItem('serveUrl'),
      list: [],
      loading: false,
      isDisabled: false,
      developers: JSON.parse(sessionStorage.getItem('userInfo')).type
    }
  },
  mounted() {
    this.getSignPdiInfo()
  },
  methods: {
    getSignPdiInfo() {
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
    buyerList() {
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
    sign() {
      this.loading = true
      this.$Post(this.$api.sign, { recordId: this.recordId }).then((res) => {
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
    downloadFn(type) {
      if (type === 'template') {
        if (this.contractInfo.path) {
          window.open(this.serveUrl + this.contractInfo.path)
        }
      } else {
        this.loading = true
        let newWindow = window.open()
        newWindow.location.href = this.$addDownUrl(this.$api.downloadSign, {
          recordId: this.recordId,
        })
        this.loading = false
      }
    },

    buyerSign(row) {
      let data = {
        recordId: this.recordId,
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
        } else {
          this.$notify.error({
            title: 'error',
            message: res.msg,
          })
        }
      })
    },
    buyerSignByEmail(row) {
      let data = {
        buyerId: row.id,
        recordId: this.recordId,
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
    querySignStatus() {
      this.loading = true
      this.$Post(this.$api.querySignStatus, { recordId: this.recordId }).then(
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
  .pdiTemplate_view {
    .initialize_pdi {
      text-align: center;
      button {
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
}
</style>