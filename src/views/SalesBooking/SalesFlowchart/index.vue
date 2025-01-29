<template>
  <div class="SalesFlowchart">
    <div class="head">
      <el-row :gutter="20">
        <el-col :span="3">
          <el-button
            size="mini"
            type="info"
            class="btn el-icon-back"
            style="margin-right: 30px"
            @click="goBack"
            >{{ $t('editMap.goBack') }}</el-button
          >
        </el-col>
        <el-col :span="6">
          <div
            style="
              line-height: 28px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            "
          >
            {{ query.projectName }} : {{ query.unitName }}
          </div>
        </el-col>
        <el-col :span="15">
          <div class="ballotNo" v-if="updaObj.ballotNo">Ballot No. {{updaObj.ballotNo}}</div>
          <div class="keepTime" v-if="query.countDown && isOutTime && updaObj.purchaseStatus == 'AVAILABLE'">
            <span class="el-icon-time"></span>
            <span
              style="
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                width: 90%;
              "
            >
              Your booking will expire in
              <b>{{ time.minutes }}</b> mins <b>{{ time.seconds }}</b> second.
              Re-entry is required upon time expiry.
            </span>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="head">
      <el-steps :active="stepsActive" align-center finish-status="success">
        <el-step title="Sale & Incentive"></el-step>
        <el-step title="Payment Details"></el-step>
        <el-step title="Purchaser"></el-step>
        <el-step title="Staff & Agent"></el-step>
        <el-step title="Summary"></el-step>
        <el-step title="Document Printing"></el-step>
      </el-steps>
    </div>
    <div class="SalesContent">
      <el-container class="outboard">
        <el-main class="outboard_box_view">
          <keep-alive>
            <component
              ref="componRef"
              :interested="interested"
              :variate="variate"
              :updaObj="updaObj"
              :is="sonView"
              :SummaryData="SummaryData"
              :documentObj="documentObj"
            ></component>
          </keep-alive>
        </el-main>
        <el-footer class="outboard_box_btn">
          <el-button
            type="primary"
            v-if="stepsActive > 0 && stepsActive < 5"
            @click="nextFn('back')"
            >Previous</el-button
          >
          <el-button
            type="primary"
            v-if="stepsActive < 4"
            @click="nextFn('next')"
            >Next</el-button
          >
          <el-button
            type="primary"
            v-if="
              stepsActive == 4 &&
              (query.type == 'AVAILABLE' || query.type == 'RESERVED')
            "
            @click="soldFn(3)"
            >Sold</el-button
          >
          <el-button
            type="primary"
            :disabled="isDisabled"
            v-if="
              stepsActive == 4 &&
              (query.type == 'SOLD' || query.type == 'RESERVED')
            "
            @click="soldFn(10)"
            >Update</el-button
          >
          <el-button type="primary" @click="goBack" v-if="stepsActive == 5"
            >Finish</el-button
          >
        </el-footer>
      </el-container>
    </div>
  </div>
</template>

<script>
import {
  Agent,
  Document,
  Payment,
  Purchaser,
  SaleDetails,
  Summary,
} from './commponents'

/*
  顺序
  [SaleDetails,Payment,Purchaser,Agent,Summary,Document]
 */

export default {
  components: {
    Agent,
    Document,
    Payment,
    Purchaser,
    SaleDetails,
    Summary,
  },
  data() {
    return {
      query: this.$route.query,
      time: {
        minutes: '',
        seconds: '',
      },
      stepsActive: 0,
      sonView: 'SaleDetails',
      updaObj: {},
      childObj: [],
      variate: '', // 付款页面参数
      interested: '', // 买家页面参数
      SummaryData: [], // 总结页面
      isDisabled: false,
      documentObj: '', // 文档页面数据
      isOutTime: true,
      setIn: null,
      Edit_Price_jurisdiction: null,
    }
  },
  mounted() {
    this.getTransaction()
    this.bookingUnit(1)
    // this.getUnitRoleAccess()
    console.log('query流程', this.query)
  },
  methods: {
    // 获取修改价格权限，暂不处理
    getUnitRoleAccess() {
      this.$Post(this.$api.getUnitRoleAccess, {
        projectId: this.query.projectId,
      }).then((res) => {
        if (res.code == 0) {
          let { Edit_Unit_Price } = res.datas
          console.log(Edit_Unit_Price)
        }
      })
    },
    goBack() {
      switch (this.query.link) {
        case '/SalesBooking/ProjectSales/SalesChart':
          this.$router.replace({
            path: this.query.link,
            query: { id: this.query.projectId },
          })
          break

        case '/SalesBooking/viewDetails':
          let querys = {
            ...this.query,
            Status: this.query.type,
            link: this.query.superiorLink
              ? this.query.superiorLink
              : '/SalesBooking/TransactionList',
          }
          this.$router.replace({
            path: this.query.link,
            query: { ...querys },
          })
          break
        case '/SalesBooking/TransactionList':
          this.$router.replace({
            path: this.query.link
          })
          break
      }
    },
    bookingUnit(type) {
      let data = {
        projectId: this.query.projectId,
        unitId: this.query.unitId,
        status: type,
      }
      this.$Post(this.$api.bookingUnit, data)
    },
    nextFn(type) {
      let data = [
        'SaleDetails',
        'Payment',
        'Purchaser',
        'Agent',
        'Summary',
        'Document',
      ]
      switch (type) {
        case 'back':
          this.stepsActive--
          break

        default:
          let childData = this.$refs.componRef.isNextFn()
          if (childData) {
            this.childObj[childData.index] = childData.obj
            switch (childData.index) {
              case 0:
                this.variate = childData.obj.transactionPrice
                this.interested = Number(this.childObj[0].interested)
                break
              case 3:
                this.SummaryData = this.childObj
                console.log('处理完成', this.SummaryData)
                break
              default:
                break
            }
            this.stepsActive++
          }
          break
      }
      this.sonView = data[this.stepsActive]
    },
    soldFn(type) {
      this.isDisabled = true
      this.$confirm('To submit?', 'Alert', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning',
      })
        .then(() => {
          if (this.childObj.length == 4) {
            let arr = [].concat(...this.childObj)
            let obj = Object.assign(...arr)
            let newObj = JSON.parse(JSON.stringify(obj))
            if (obj.buyerList.length) {
              newObj.buyerList = JSON.stringify(obj.buyerList)
            }
            if (obj.buyerPaymentList.length) {
              newObj.buyerPaymentList = JSON.stringify(obj.buyerPaymentList)
            }
            newObj.interested = Number(obj.interested)
            this.$Posting(this.$api.addTransaction, {
              ...newObj,
              type: type,
              unitId: this.query.unitId,
              projectId: this.query.projectId,
            })
              .then((res) => {
                this.isDisabled = false
                if (res.code == 0) {
                  this.sonView = 'Document'
                  this.stepsActive = 5
                  this.documentObj = {
                    OptionDate: newObj.transactionDate,
                    SystemNo: res.datas.seqNo,
                    recordId: res.datas.recordId,
                    Status: res.datas.purchaseStatus,
                  }
                  this.$notify({
                    title: 'Success',
                    message: 'Submit Successfully',
                    type: 'success',
                  })
                  window.clearTimeout(this.setIn)
                  this.isOutTime = false
                } else {
                  this.$notify.error({
                    title: 'Error',
                    message: res.msg,
                  })
                }
              })
              .catch(() => {
                this.$notify.error({
                  title: 'Error',
                  message: 'server error ',
                })
              })
            console.log('处理的', newObj)
          }
        })
        .catch(() => {
          this.isDisabled = false
          this.$message({
            type: 'info',
            message: 'Cancel',
          })
        })
    },
    getTransaction() {
      let data = {
        projectId: this.query.projectId,
        unitId: this.query.unitId,
      }
      this.$Posting(this.$api.getTransaction, data).then((res) => {
        if (res.code == 0) {
          this.updaObj = res.datas
          if (this.query.countDown) {
            this.CountDown(parseInt(this.query.countDown))
          }
        }
      })
    },
    CountDown(time) {
      let self = this
      let maxtime = time * 60
      function subtraction() {
        if (maxtime >= 0) {
          self.time.minutes = Math.floor(maxtime / 60)
          self.time.seconds = Math.floor(maxtime % 60)

          --maxtime
        } else {
          self.goBack()
          window.clearTimeout(this.setIn)
        }
      }
      this.setIn = window.setInterval(subtraction, 1000)
    },
  },
  beforeDestroy() {
    window.clearTimeout(this.setIn)
    this.bookingUnit(2)
  },
}
</script>

<style lang="less">
.SalesFlowchart {
  height: 100%;
  .head {
    background: #fff;
    padding: 10px;
    margin-bottom: 15px;
    .keepTime {
      background: #fcf8e3;
      padding: 5px 10px;
      &::before {
        content: '';
        display: inline-block;
        clear: both;
      }
      span {
        float: left;
        color: #ff6666;
        font-size: 14px;
        &.el-icon-time {
          font-size: 20px;
          margin-right: 10px;
        }
        b {
          color: green;
          margin: 0 10px;
          font-size: 16px;
        }
      }
    }
    .ballotNo{
      padding: 5px 10px;
      color: #F56C6C;
    }
    .el-step__title.is-process,
    .el-step__head.is-process {
      color: #409eff;
      border-color: #409eff;
    }
  }
  .SalesContent {
    background: #fff;
    height: calc(100% - 155px);
    .outboard {
      height: 100%;
      position: relative;
      .sonBox {
        height: 100%;
        box-sizing: border-box;
        overflow-y: auto;
        .el-input.is-disabled .el-input__inner {
          color: #000;
        }
        .fromDiv {
          padding: 15px;
          border-bottom: 1px solid #ddd;
          &:last-child {
            border-bottom: 0;
          }
          .verifyFrom {
            .el-form-item__label {
              position: relative;
              &::before {
                content: '*';
                color: red;
              }
            }
          }
        }
        .lfLable {
          width: 150px;
          height: 40px;
          line-height: 40px;
          background: #9ea7b4;
          color: #fff;
          position: relative;
          text-align: center;
          margin-top: 20px;
          &::before {
            content: '';
            position: absolute;
            right: -40px;
            top: 0;
            width: 0;
            height: 0;
            border: 20px solid transparent;
            border-left-color: #9ea7b4;
          }
        }
      }

      .outboard_box_view {
        padding: 0;
        // height: calc(100% - 60px) ;
        position: absolute;
        bottom: 60px;
        top: 0;
        left: 0;
        right: 0;
      }
      .outboard_box_btn {
        line-height: 60px;
        text-align: center;
        background: #fff;
        box-shadow: 0 0 5px #ddd;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        button {
          margin: 0 20px;
          width: 200px;
        }
      }
    }
  }
}
</style>