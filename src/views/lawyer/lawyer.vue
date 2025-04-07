<template>
  <div class="lawyer-wrapper">
    <div class="lawyer-section" v-show="!showStatusList">
      <div class="project-select-wrap">
        <div class="project-select-label">{{$t('lawyer.project')}}：</div>
        <el-select
          v-model="projectId"
          @change="getProgressDetailsList"
          size="mini"
          :placeholder="$t('lawyer.kindlySelect')"
        >
          <el-option
            v-for="item in projects"
            :key="item.projectId"
            :label="item.projectName"
            :value="item.projectId"
          ></el-option>
        </el-select>
      </div>
      <div class="perject-table-wrap">
        <div class="screen-box">
          <!-- [ '未完成', '已收款', '待付款', '延期付款', '待通知', '超时未付款'] -->
          <el-button class="stay-informed" @click="showStatusListClick(4)"
            >{{$t('lawyer.pendingNotification')}} {{progressCount.num4}}</el-button
          >
          <el-button class="stay-payment" @click="showStatusListClick(2)"
            >{{$t("lawyer.pendingPaymentReceivable")}} {{progressCount.num2}}</el-button
          >
          <el-button class="overdue-payment" @click="showStatusListClick(5)"
            >{{$t("lawyer.latePaymentAlert")}} {{progressCount.num5}}</el-button
          >
          <el-button class="receiving" @click="showStatusListClick(1)"
            >{{$t("lawyer.paymentReceive")}} {{progressCount.num1}}</el-button
          >
          <el-button class="deferred-payment" @click="showStatusListClick(3)"
            >{{$t("lawyer.paymentDeferment")}} {{progressCount.num3}}</el-button
          >
          <el-button class="screen-all" @click="showStatusListClick(0)">{{$t("lawyer.all")}}</el-button>
        </div>

        <el-table :data="progressDetailList" ref='showDetailTable' border height="580" style="width: 100%">
          <el-table-column prop="building" :label="$t('lawyer.building')" fixed width="90">
          </el-table-column>
          <el-table-column prop="unitName" :label="$t('lawyer.unit')" fixed width="90">
          </el-table-column>
          <el-table-column :label="$t('lawyer.paymentInformation')" fixed width="220">
            <template slot-scope="scope">
              <div class="total-price-box">
                <p class="">{{$t("lawyer.transactedPrice")}}:{{ scope.row.transactionPrice1 }}</p>
                <p class="total-price-received">{{$t("lawyer.paymentReceive")}}:{{ scope.row.price2 }}</p>
                <p class="total-price-receive">{{$t("lawyer.pending")}}:{{ scope.row.price1 }}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="firstPhase"
            width="240"
            v-for="(payment, paymentIndex) in progressKeys">
            <template slot="header" slot-scope="scope">
              <span>{{ payment.title }}</span>

              <el-tooltip class="item" effect="light" placement="top">
                <div slot="content">
                  <p v-for="(tip, index) in payment.desc.split(',')">
                    {{ tip }}
                  </p>
                </div>
                <i class="el-icon-info"></i>
              </el-tooltip>
            </template>
            <template slot-scope="scope">
              <div class="phase-box">
                <div
                  class="phase-wrap"
                  :class="{
                    'receiving': scope.row['status_' + payment.key] == 1,
                    'stay-payment': scope.row['status_' + payment.key] == 2,
                    'deferred-payment': scope.row['status_' + payment.key] == 3,
                    'stay-informed': scope.row['status_' + payment.key] == 4,
                    'overdue-payment': scope.row['status_' + payment.key] == 5,
                    'phase-wrap-show': scope.row['status_' + payment.key] != -1
                  }"
                >
                  <p class="phase-wrap-price">
                    {{ scope.row['transactionPrice_' + payment.key] }}
                  </p>
                  <p
                    class="phase-wrap-status"
                    v-if="scope.row['status_' + payment.key] === -1"
                  >
                    {{ statusMap[0] }}
                  </p>
                  <p
                    class="phase-wrap-status"
                    v-if="scope.row['status_' + payment.key] !== -1"
                  >
                    {{ statusMap[scope.row['status_' + payment.key]] }}
                  </p>
                </div>
                <div class='phase-operate-wrap' :class="{'phase-operate-wrap-show': scope.row['status_' + payment.key] != -1}">
                  <p
                    class="phase-operate-detail"
                    @click="
                      showDetailClick(
                        payment,
                        scope.row,
                        scope.row['transactionPrice_' + payment.key]
                      )
                    "
                  >
                    {{$t('lawyer.viewDetails')}}
                  </p>
                  <p class="phase-operate-update" @click="changeStatusClick(payment, scope.row, scope.row.transactionPrice * scope.row['proportion_' + payment.key], scope.row['status_' + payment.key])">
                    {{$t('lawyer.updateStatus')}}
                  </p>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--  v-if="progressDetailListTotal" -->
        <div class="page_section" v-if="progressDetailListTotal">
          <el-pagination
            background
            small
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="progressDetailListCurrentPage"
            :page-sizes="[5, 10, 30, 50, 100]"
            :page-size="progressDetailListPageSize"
            layout="prev, pager, next,sizes,total"
            :total="progressDetailListTotal"
          ></el-pagination>
        </div>
    </div>

    <!-- 状态更新 -->
    <el-dialog
      title=""
      :visible.sync="changeStatusVisible"
      width="530px"
      :before-close="handleClose"
    >
      <div class="change-status-wrap">
        <p>
          <span>{{$t('lawyer.selectDate')}}：</span>
          <el-date-picker
            v-model="changeProgressStatuParam.time"
            type="date"
            value-format='yyyy-MM-dd'
            :placeholder="$t('lawyer.selectDate')">
          </el-date-picker>
          </el-date-picker>
        </p>
        <p v-if="statusNow == 4 && userRoleAccess && userRoleAccess['Mark_Notify']>1">
          <el-button type="primary" @click='updateProgressDetails(2)'>{{$t('lawyer.markNotify')}}</el-button>
        </p>
        <p v-if="userRoleAccess && userRoleAccess['Mark_Payment_Receive']>1">
          <el-button type="primary" @click='updateProgressDetails(1)'>{{$t('lawyer.markPaymentReceive')}}</el-button>
        </p>
        <p v-if="statusNow != 1 && userRoleAccess && userRoleAccess['Deferement_Request']>1">
          <el-button type="primary" @click='updateProgressDetails(3)'>{{$t('lawyer.markPaymentDeferement')}}</el-button>
        </p>
      </div>
    </el-dialog>

    <!-- 查看详情 -->
    <el-dialog
      title=""
      :visible.sync="showDetailVisible"
      width="800px"
      :before-close="showDetailClose"
    >
      <div class="show-detail-wrap">
        <p class="detail-title">{{$t('lawyer.saleDetails')}}</p>
        <el-row>
          <el-col
            ><span class="detail-desc-title">{{$t('lawyer.unit')}}：</span
            ><span>{{ progressDetail.unitName }}</span></el-col
          >
          <el-col
            ><span class="detail-desc-title">{{$t('lawyer.building')}}：</span
            ><span>{{ progressDetail.building }}</span></el-col
          >
        </el-row>
        <el-row>
          <el-col
            ><span class="detail-desc-title">{{$t('lawyer.transactedPrice')}}：</span
            ><span>{{ progressDetail.transactionPrice1}}</span></el-col
          >
          <el-col
            ><span class="detail-desc-title">{{$t('lawyer.transactedDate')}}：</span
            ><span >{{
              $dateFormatNoTime(Number(progressDetail.transactionDate))
            }}</span></el-col
          >
        </el-row>
        <el-row>
          <el-col
            ><span class="detail-desc-title">{{$t('lawyer.mainBuyer')}}：</span><span>{{ buyer.buyerName }}</span></el-col
          >
          <el-col
            ><span class="detail-desc-title">{{$t('lawyer.mainBuyerEmail')}}：</span><span>{{ buyer.buyerEmail }}</span></el-col
          >
        </el-row>
        <p class="detail-title">{{$t('lawyer.currentStatusInformation')}}</p>
        <el-row>
          <el-col class="all_width"
            ><span class="detail-desc-title">{{$t('lawyer.progressiveStatus')}}：</span
            ><span>{{ progressDetail.title }}</span></el-col
          >
        </el-row>
        <el-row> 
          <el-col class="all_width"
            ><span class="detail-desc-title">{{$t('lawyer.progressiveDescription')}}：</span>
            <div>
              <p v-for="(tip, index) in paymentDesc">{{ tip }}</p>
            </div></el-col
          >
        </el-row>
        <el-row>
          <el-col class="all_width"
            ><span class="detail-desc-title">{{$t('lawyer.currentPaymentAmount')}}：</span
            ><span >{{ progressDetail.priceNow }}</span></el-col
          >
        </el-row>
        <el-row>
          <el-col class="all_width"
            ><span class="detail-desc-title">{{$t('lawyer.paymentDueDate')}}： </span>
            <span>{{$dateFormatNoTime(Number(paymentTime))}}</span></el-col
          >
        </el-row>

        <el-row>
          <el-col class="all_width" v-if="progressDetail.path"><span class="detail-desc-title">{{$t('lawyer.certificateofCompletion')}}：</span><a :href="hostUrl + progressDetail.path" target="_blank">{{hostUrl + progressDetail.path}}</a></el-col>
        </el-row>
        <el-row>
          <div class="progress-wrap">
            <p class="progress-title detail-desc-title">{{$t('lawyer.statusProgress')}}：</p>
            <el-timeline :reverse="false">
              <el-timeline-item
                v-for="(activity, index) in progressTimeLine"
                :key="index"
                :color="activity.color"
                :timestamp="activity.content"
              >
                {{ activity.timestamp }}
              </el-timeline-item>
            </el-timeline>
          </div>
        </el-row>
        <el-row>
          <el-col> <el-button type="primary" @click="changeStatusClick(progressDetail, progressDetail, progressDetail.transactionPrice * progressDetail['proportion_' + progressDetail.key], progressDetail['status_' + progressDetail.key])">{{$t('lawyer.statusUpdate')}}</el-button></el-col>
        </el-row>
      </div>
    </el-dialog>

    <div class="show-status-wrap" v-show="showStatusList">
      <p class="back-btn" @click="backClick()">{{$t('lawyer.goBack')}}</p>
      <el-row class="row-header">
        <el-col :span="4" class="col-text"
          ><el-input
            v-model="searchProgress.building"
            size="mini"
            :placeholder="$t('lawyer.building')"
          />
        </el-col>
        <el-col :span="4" class="col-text"
          ><el-input
            v-model="searchProgress.unitName"
            size="mini"
            :placeholder="$t('lawyer.unit')"
          />
        </el-col>
        <el-col :span="6" class="col-button">
          <span class="progress-status-title">{{$t('lawyer.progressiveStatus')}}</span>
          <el-select v-model="searchProgress.status" size="mini" :placeholder="$t('lawyer.progressiveStatus')">
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="4" class="col-text"
          >
          <el-button size="mini" @click='searchProgressList()'>{{$t('lawyer.search')}}</el-button>
          <el-button size="mini" @click='reset()'>{{$t('lawyer.reset')}}</el-button>
        </el-col>
      </el-row>
      <el-table :data="progressDetailPageList" ref="progressListPage" height="570" style="width: 100%;" border>
        <el-table-column fixed prop="building" :label="$t('lawyer.building')">
        </el-table-column>
        <el-table-column prop="unitName" :label="$t('lawyer.unit')"> </el-table-column>
        <el-table-column prop="transactionPrice1" :label="$t('lawyer.transactedPrice')">
        </el-table-column>
        <el-table-column prop="title" :label="$t('lawyer.currentStatus')">
        </el-table-column>
        <el-table-column prop="price" :label="$t('lawyer.currentStatusPaymentAmount')">
        </el-table-column>
        <el-table-column prop="transactionDate" :label="$t('lawyer.updateDate')">
          <template slot-scope="scope">
            <span>{{$dateFormatNoTime(Number(scope.row.createTime))}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('lawyer.edit')" width="240">
          <template slot-scope="scope">
            <el-button size="mini" @click='showDetailByPageClick(scope.row)'> {{$t('lawyer.viewDetails')}} </el-button>
            <el-button size="mini" @click="changeStatusByPageClick(scope.row)"> {{$t('lawyer.updateStatus')}} </el-button>
          </template>
        </el-table-column>
      </el-table>
      
        <div class="page_section" v-if="searchProgressTotal">
          <el-pagination
            background
            small
            @size-change="handleSizeChangeSearch"
            @current-change="handleCurrentChangeSearch"
            :current-page.sync="searchProgressTotalCurrentPage"
            :page-sizes="[5, 10, 30, 50, 100]"
            :page-size="searchProgressTotalPageSize"
            layout="prev, pager, next,sizes,total"
            :total="searchProgressTotal"
          ></el-pagination>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    let self = this
    return {
      progressDetailPageList: [],
      statusMap: [
        self.$t('lawyer.pendingCompletion'),
        self.$t('lawyer.paymentReceive'),
        self.$t('lawyer.pendingPaymentReceivable'),
        self.$t('lawyer.paymentDeferment'),
        self.$t('lawyer.pendingNotification'),
        self.$t('lawyer.latePaymentAlert'),
      ],
      changeStatusVisible: false, //更改状态弹框
      statusNow: 0, //更改进度状态的当前状态
      showDetailVisible: false, //查看详情弹框
      hostUrl: sessionStorage.getItem("serveUrl") || "",
      value1: '',
      progressTimeLine: [],
      statusOptions: [
        {
          value: 1,
          label: self.$t('lawyer.paymentReceive'),
        },
        {
          value: 2,
          label: self.$t('lawyer.pendingPaymentReceivable'),
        },
        {
          value: 3,
          label: self.$t('lawyer.paymentDeferment'),
        },
        {
          value: 4,
          label: self.$t('lawyer.pendingNotification'),
        },
        {
          value: 5,
          label: self.$t('lawyer.latePaymentAlert'),
        },
      ],
      statusValue: 0,
      showStatusList: false, //点击状态切换表格
      projects: [], //项目列表
      projectId: '', //项目id
      progressDetailList: [], //建筑师进度列表
      progressDetailListTotal: 0, //建筑师进度列表数量
      progressDetailListCurrentPage: 1, //建筑师进度列表当前页
      progressDetailListPageSize: 10, //建筑师进度列表每页数量
      searchProgressTotal: 0, //搜索单位列表数量
      searchProgressTotalCurrentPage: 1, //搜索单位列表当前页
      searchProgressTotalPageSize: 10, //搜索单位列表每页数量
      progressKeys: [], //进度列表
      progressKey: {}, //查看详情当前进度
      progressDetail: {}, //进度详情
      paymentDesc: [], //进度说明详情
      buyer: {}, //进度详情买家信息
      paymentTime: '', //最晚支付时间
      changeProgressStatuParam: {}, //更改当前进度状态参数
      progressCount: {}, //各种状态对应的数量
      searchProgress: {
        building: '',
        unitName: '',
        status: '',
      },
      userRoleAccess: {}, //用户权限
    }
  },
  created() {
    this.getProjectList()
    this.getProgressKeys()
  },
  mounted(){

  },
  methods: {
    //获取项目列表
    getProjectList() {
      this.$Geting(this.$api.queryProject, { pageSize: 10000, pageNo: 1 }).then(
        (res) => {
          if (res.code == 0) {
            this.projects = res.datas.lists
            this.projectId = res.datas.lists[0].projectId
            this.getProgressDetailsList()
          } else {
            this.$notify.error({
              title: 'fail',
              message: res.msg,
            })
            return false
          }
        }
      )
    },
    //获取用户权限
    async getUnitRoleAccess(){
      let projectId = this.projectId
      let agentId = JSON.parse(sessionStorage.getItem('userInfo') || '{}').agentId
      this.$Post(this.$api.getUnitRoleAccess, {
        projectId: projectId,
        agentId: agentId,
      }).then((res) => {
        if (res.code == 0) {
          this.userRoleAccess = res.datas
        }
      })
    },
    //获取律师列表
    async getProgressDetailsList() {
      await this.getUnitRoleAccess()
      this.$Geting(this.$api.queryProgressDetailsList, {
        projectId: this.projectId,
        pageNo: this.progressDetailListCurrentPage,
        pageSize: this.progressDetailListPageSize,
      }).then((res) => {
        this.progressDetailListTotal = res.datas.count
        this.progressDetailList = res.datas.lists
        this.$refs.showDetailTable.doLayout()
      })
      this.getCount()
    },
    //获取进度下拉列表
    getProgressKeys() {
      this.$Geting(this.$api.queryProgressKey).then((res) => {
        if (res.code == 0) {
          this.progressKeys = res.datas
          // this.progressKey = res.datas[0].key
          // this.selectProgressKey(this.progressKey)
        } else {
          this.$notify.error({
            title: 'fail',
            message: res.msg,
          })
          return false
        }
      })
    },
    getCount() {
      this.$Geting(this.$api.queryProgressDetailsByCount, {
        projectId: this.projectId,
      }).then((res) => {
        if (res.code == 0) {
          this.progressCount = res.datas
        } else {
          this.$notify.error({
            title: 'fail',
            message: res.msg,
          })
          return false
        }
      })
    },
    changeStatusClick(payment, row, price , status) {
      this.statusNow = status
      let changeProgressStatuParam = {
        key: payment.key,
        projectId: this.projectId,
        unitId: row.unitId,
        time: '',
        status: '',
        price: price,
        progressId: row.progressId,
      }
      this.changeProgressStatuParam = changeProgressStatuParam
      this.changeStatusVisible = true
    },
    //查看详情
    showDetailClick(payment, row, price) {
      this.progressDetail = Object.assign(row)
      this.progressDetail.title = payment.title
      this.progressDetail.key = payment.key
      this.progressDetail.priceNow = price
      this.paymentDesc = payment.desc.split(',')
      this.$Geting(this.$api.queryProgressDetails, {
        projectId: this.projectId,
        key: payment.key,
        unitId: row.unitId,
      }).then((res) => {
        this.buyer = res.datas.buyer
        this.paymentTime = res.datas.time
        if (res.datas.details.length > 0) {
          this.progressTimeLine = []
          res.datas.details.forEach((detail, index) => {
            let content = ''
            if (detail.status == 2) {
              content =
                this.$t('lawyer.informBuyerPaymentDate') + this.$dateFormatNoTime(Number(detail.time))
            } else if (detail.status == 1) {
              content =
                this.$t('lawyer.paymentReceiveDate')  + this.$dateFormatNoTime(Number(detail.time))
            } else if (detail.status == 3) {
              content =
                this.$t('lawyer.requestPaymentDeferment') + this.$dateFormatNoTime(Number(detail.time))
            } else {
              content = this.$t('lawyer.statusUpdate')
            }
            this.progressTimeLine.push({
              content: content,
              timestamp: this.$dateFormat(Number(detail.createTime)),
              color: '#00D2C8',
            })
          })
        } else {
          this.paymentTime = ''
          this.progressTimeLine = [
            {
              content: this.$t('lawyer.progressiveStatusNotUpdated'),
              timestamp: '',
              color: '#9EA7B4',
            },
          ]
        }
      })
      this.showDetailVisible = true
    },
    //单位列表搜索页查看详情
    showDetailByPageClick(row) {
      let detailByPage = row
      let progressKeys = this.progressKeys
      this.progressKey = progressKeys.filter((item) => {
        return item.key == detailByPage.key
      })[0]
      this.showDetailClick(this.progressKey, row, row.price)
    },
    //单位列表搜索页更新状态
    changeStatusByPageClick(row) {
      console.log(row)
      let detailByPage = row
      let progressKeys = this.progressKeys
      this.progressKey = progressKeys.filter((item) => {
        return item.key == detailByPage.key
      })[0]
      this.changeStatusClick(
        this.progressKey,
        row,
        row.proportion * row.transactionPrice
      )
    },
    updateProgressDetails(status) {
      if (!this.changeProgressStatuParam.time) {
        this.$notify.error({
          title: 'fail',
          message: this.$t('lawyer.selectDate'),
        })
        return false
      }
      this.changeProgressStatuParam.status = status
      let param = this.changeProgressStatuParam
      this.$Posting(this.$api.saveProgressDetails, param).then((res) => {
        console.log(res)
        if (res.code == 0) {
          this.changeStatusVisible = false
          this.showDetailVisible = false
          this.getProgressDetailsList()
        } else {
          this.$notify.error({
            title: 'fail',
            message: res.msg,
          })
          return false
        }
      })
    },
    showDetailClose() {
      this.showDetailVisible = false
    },
    handleClose() {
      this.changeStatusVisible = false
    },
    showStatusListClick(status) {
      this.showStatusList = true
      this.searchProgress.status = status === 0 ? '' : status
      this.searchProgressList()
    },
    //重置
    reset() {
      this.searchProgress = {
        building: '',
        unitName: '',
        status: '',
      }
    },
    backClick() {
      this.showStatusList = false
    },
    //律师搜索单位列表
    searchProgressList() {
      let param = Object.assign(this.searchProgress)
      param.projectId = this.projectId
      param.pageNo = this.searchProgressTotalCurrentPage
      param.pageSize = this.searchProgressTotalPageSize
      this.$Geting(this.$api.queryProgressDetailsPage, param).then((res) => {
        if (res.code == 0) {
          this.progressDetailPageList = res.datas.lists
          this.searchProgressTotal = res.datas.count
          this.$refs.progressListPage.doLayout()
        } else {
          this.$notify.error({
            title: 'fail',
            message: res.msg,
          })
          return false
        }
      })
    },
    handleSizeChange(val) {
      this.progressDetailListPageSize = val
      this.getProgressDetailsList()
    },
    handleCurrentChange(val) {
      this.progressDetailListCurrentPage = val
      this.getProgressDetailsList()
    },
    handleSizeChangeSearch(val) {
      this.searchProgressTotalPageSize = val
      this.searchProgressList()
    },
    handleCurrentChangeSearch(val) {
      this.searchProgressTotalCurrentPage = val
      this.searchProgressList()
    },
  },
}
</script>

<style lang='less' scoped>
.lawyer-wrapper {
  ul {
    padding: 0;
  }
  background-color: #fff;
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  .lawyer-section {
    padding: 0px 30px 15px;
    .project-select-wrap {
      display: flex;
      margin: 10px 0;
      align-items: center;
      .project-select-label {
        margin-right: 20px;
      }
    }
    /deep/.perject-table-wrap {
      width: 100%;
      // border: 1px solid rgba(187, 187, 187, 100);
      .screen-box {
        margin: 52px 20px 10px;
        height: 72px;
        // border: 1px solid rgba(187, 187, 187, 100);
        display: flex;
        align-items: center;
        padding-left: 30px;
        .el-button {
          font-size: 14px;
          border: none;
          color: #fff;
          width: 235px;
          height: 40px;
        }
        .stay-informed {
          background: #dfd41a;
        }
        .stay-payment {
          background: #f9ad03;
        }
        .overdue-payment {
          background: #f44144;
        }
        .receiving {
          background: #00d2c8;
        }
        .deferred-payment {
          background: #358ad2;
        }
        .screen-all {
          color: rgba(16, 16, 16, 100);
          border: 1px solid rgba(187, 187, 187, 100);
        }
      }
      .el-table {
        td {
          padding: 0;
          .cell {
            padding: 0;
          }
        }
        .el-table__fixed {
          height:auto !important; 
          bottom:17px !important;  
        }
      }
      .phase-wrap {
        width: 100%;
        background: #9ea7b4;
        height: 120px;
        color: rgba(255, 255, 255, 100);
        overflow: hidden;
        p {
          height: 20px;
          line-height: 20px;
        }
        .phase-wrap-price {
          margin: 50px 0 30px;
        }
      }
      .phase-operate-wrap {
        display: none;
        background: rgba(130, 41, 42, 64);
        height: 120px;
        color: rgba(255, 255, 255, 100);
        overflow: hidden;
        padding: 7px 0;
        p {
          height: 30px;
          width: 110px;
          background-color: rgba(19, 177, 230, 100);
          line-height: 30px;
          border-radius: 10px;
          text-align: center;
          margin: 15px auto;
          cursor: pointer;
        }
      }
      .phase-box:hover .phase-operate-wrap-show {
        display: block;
      }
      .phase-box:hover .phase-wrap-show {
        display: none;
      }
      .stay-informed {
        background: #dfd41a;
      }
      .stay-payment {
        background: #f9ad03;
      }
      .overdue-payment {
        background: #f44144;
      }
      .receiving {
        background: #00d2c8;
      }
      .deferred-payment {
        background: #358ad2;
      }

      .total-price-box {
        p {
          font-size: 14px;
          height: 40px;
          line-height: 40px;
          width: 100%;
          padding: 0 5px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .total-price-receive {
          color: rgba(244, 65, 68, 90);
          border-top: 1px solid #ebeef5;
        }
        .total-price-received {
          color: rgba(0, 210, 200, 100);
          border-top: 1px solid #ebeef5;
        }
      }
    }
  }
  /deep/.change-status-wrap {
    display: flex;
    height: 300px;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    .el-button {
      width: 400px;
      height: 40px;
      border-radius: 20px;
    }
  }
  /deep/.show-detail-wrap {
    .detail-title {
      margin: 16px 0;
      font-size: 18px;
      background: #9ea7b4;
      height: 30px;
      color: #fff;
      line-height: 30px;
      width: 140px;
      text-indent: 10px;
    }
    .el-row {
      display: flex;
      padding-left: 60px;
      .el-col {
        width: 40%;
        padding: 7px 0;
        display: flex;
        .detail-desc-title {
          font-weight: 700;
          word-break: initial;
        }
      }
      .all_width{
        width: 90%;
      }
      .progress-wrap{
        .progress-title {
          padding: 30px 0 10px;
        }
        .detail-desc-title {
          font-weight: 700;
          word-break: initial;
        }
        .el-timeline{
          width: 400px;
          height: 224px;
          overflow: auto;
        }
        .el-timeline-item__content,
        .el-timeline-item__timestamp {
          color: #101010;
        }
      }
    }
  }
  /deep/.show-status-wrap {
    .back-btn {
      cursor: pointer;
      width: 80px;
      margin: 30px 0 30px 10px;
      height: 30px;
      line-height: 30px;
      border-radius: 4px;
      color: rgba(16, 16, 16, 100);
      font-size: 14px;
      text-align: center;
      border: 1px solid rgba(187, 187, 187, 100);
    }
    .row-header {
      font-size: 14px;
      line-height: 83px;
      height: 83px;
      // border: 1px solid rgba(187, 187, 187, 100);
      .col-text {
        margin: 0 19px;
      }
      .col-button {
        display: flex;
        .progress-status-title {
          width: 160px;
        }
      }
    }
  }
}
</style>