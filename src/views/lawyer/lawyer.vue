<template>
  <div class="lawyer-wrapper">
    <div class="lawyer-section" v-show="!showStatusList">
      <div class="project-select-wrap">
        <div class="project-select-label">项目选择:</div>
        <el-select
          v-model="projectId"
          @change="getProgressDetailsList"
          size="mini"
          placeholder="请选择1"
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
          <!-- [ '未完成', '已收款', '代付款', '延期付款', '待通知', '超时未付款'] -->
          <el-button class="stay-informed" @click="showStatusListClick(4)"
            >待通知 {{progressCount.num4}}</el-button
          >
          <el-button class="stay-payment" @click="showStatusListClick(2)"
            >待付款 {{progressCount.num2}}</el-button
          >
          <el-button class="overdue-payment" @click="showStatusListClick(5)"
            >超时未付款 {{progressCount.num5}}</el-button
          >
          <el-button class="receiving" @click="showStatusListClick(1)"
            >已收款 {{progressCount.num1}}</el-button
          >
          <el-button class="deferred-payment" @click="showStatusListClick(3)"
            >延期收款 {{progressCount.num3}}</el-button
          >
          <el-button class="screen-all">全部</el-button>
        </div>

        <el-table
          :data="progressDetailList"
          border
          style=""
        >
          <el-table-column prop="building" label="楼栋" width="60">
          </el-table-column>
          <el-table-column prop="unitName" label="单位" width="60">
          </el-table-column>
          <el-table-column label="总售价格" width="130">
            <template slot-scope="scope">
              <div class="total-price-box">
                <p class="">售价:{{ scope.row.transactionPrice1 }}</p>
                <p class="total-price-received">已收:{{ scope.row.price2 }}</p>
                <p class="total-price-receive">待收:{{ scope.row.price1 }}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="firstPhase"
            v-for="(payment, paymentIndex) in progressKeys"
          >
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
                <div class="phase-operate-wrap">
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
                    查看详情
                  </p>
                  <p class="phase-operate-update" @click="changeStatusClick(payment, scope.row,scope.row['transactionPrice_' + payment.key])">
                    更改状态
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
          <span>选择时间：</span>
          <el-date-picker
            v-model="changeProgressStatuParam.time"
            type="date"
            value-format='yyyy-MM-dd'
            placeholder="选择日期">
          </el-date-picker>
          </el-date-picker>
        </p>
        <p>
          <el-button type="primary" @click='updateProgressDetails(2)'>标记已通知</el-button>
        </p>
        <p>
          <el-button type="primary" @click='updateProgressDetails(1)'>标记已付款</el-button>
        </p>
        <p>
          <el-button type="primary" @click='updateProgressDetails(3)'>标记延期</el-button>
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
        <p class="detail-title">成交信息</p>
        <el-row>
          <el-col
            ><span>单位名称：</span
            ><span>{{ progressDetail.unitName }}</span></el-col
          >
          <el-col
            ><span>楼栋名称：</span
            ><span>{{ progressDetail.building }}</span></el-col
          >
        </el-row>
        <el-row>
          <el-col
            ><span>售价：</span
            ><span>{{ progressDetail.transactionPrice1 }}</span></el-col
          >
          <el-col
            ><span>成交时间：</span
            ><span>{{
              $dateFormat(Number(progressDetail.transactionDate))
            }}</span></el-col
          >
        </el-row>
        <el-row>
          <el-col
            ><span>主买家名称：</span><span>{{ buyer.buyerName }}</span></el-col
          >
          <el-col
            ><span>买家邮箱：</span><span>{{ buyer.buyerEmail }}</span></el-col
          >
        </el-row>
        <p class="detail-title">当前进度信息</p>
        <el-row>
          <el-col
            ><span>进度名称：</span
            ><span>{{ progressDetail.title }}</span></el-col
          >
          <el-col
            ><span class="detail-desc-title">描述：</span>
            <div>
              <p v-for="(tip, index) in paymentDesc">{{ tip }}</p>
            </div></el-col
          >
        </el-row>
        <el-row>
          <el-col
            ><span>当前进度应支付：</span
            ><span>{{ progressDetail.priceNow }}</span></el-col
          >
          <el-col
            ><span>最晚支付时间： </span><span>{{paymentTime}}</span></el-col
          >
        </el-row>

        <el-row>
          <div>
            <p class="progress-title">进度：</p>
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
          <el-col> <el-button type="primary" @click="changeStatusClick(progressDetail, progressDetail)">状态更新</el-button></el-col>
        </el-row>
      </div>
    </el-dialog>

    <div class="show-status-wrap" v-show="showStatusList">
      <p class="back-btn" @click="backClick()">返回</p>
      <el-row class="row-header">
        <el-col :span="4" class="col-text"
          ><el-input
            v-model="searchProgress.building"
            size="mini"
            placeholder="楼栋"
          />
        </el-col>
        <el-col :span="4" class="col-text"
          ><el-input
            v-model="searchProgress.unitName"
            size="mini"
            placeholder="单位"
          />
        </el-col>
        <el-col :span="6" class="col-button">
          <span class="progress-status-title">进度状态</span>
          <el-select v-model="searchProgress.status" size="mini" placeholder="进度状态">
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
          <el-button size="mini" @click='searchProgressList()'>查询</el-button>
        </el-col>
      </el-row>
      <el-table :data="progressDetailPageList" style="width: 100%;height: 800px" border>
        <el-table-column fixed prop="building" label="楼栋" width="90">
        </el-table-column>
        <el-table-column prop="unitName" label="单位" width="90"> </el-table-column>
        <el-table-column prop="transactionPrice" label="成交价" width="150">
        </el-table-column>
        <el-table-column prop="city" label="当前进度" width="120">
        </el-table-column>
        <el-table-column prop="address" label="当前进度应付款" width="300">
        </el-table-column>
        <el-table-column prop="transactionDate" label="进度更新时间" width="120">
          <template slot-scope="scope">
            <span>{{$dateFormat(Number(scope.row.transactionDate))}}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small"> 查看详情 </el-button>
            <el-button type="text" size="small"> 状态更新 </el-button>
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
    return {
      progressDetailPageList: [],
      statusMap: [ '未完成', '已收款', '代付款', '延期付款', '待通知', '超时未付款'],
      changeStatusVisible: false, //更改状态弹框
      showDetailVisible: false, //查看详情弹框
      value1: '',
      progressTimeLine: [
        {
          content: '活动按期开始',
          timestamp: '2018-04-15',
          color: '#00D2C8',
        },
      ],
      statusOptions: [
        {
          value: 1,
          label: '已收款',
        },
        {
          value: 2,
          label: '代付款',
        },
        {
          value: 3,
          label: '延期付款',
        },
        {
          value: 4,
          label: '待通知',
        },
        {
          value: 5,
          label: '超时未付款',
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
      }
    }
  },
  created() {
    this.getProjectList()
    this.getProgressKeys()
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
            this.getCount()
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
    //获取律师列表
    getProgressDetailsList() {
      this.$Geting(this.$api.queryProgressDetailsList, {
        projectId: this.projectId,
        pageNo: this.progressDetailListCurrentPage,
        pageSize: this.progressDetailListPageSize,
      }).then((res) => {
        console.log(res)
        this.progressDetailListTotal = res.datas.count
        this.progressDetailList = res.datas.lists
      })
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
    getCount(){
      this.$Geting(this.$api.queryProgressDetailsByCount, {projectId: this.projectId})
      .then(res=>{
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
    changeStatusClick(payment, row, price) {
      let changeProgressStatuParam = {
        key: payment.key,
        projectId: this.projectId,
        unitId: row.unitId,
        time: '',
        status: '',
        price: row.transactionPrice * row['proportion_' + payment.key],
        progressId: row.progressId
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
        console.log(res)
        this.buyer = res.datas.buyer
        if (res.datas.details.length > 0) {
          this.progressTimeLine = []
          res.datas.details.forEach((detail, index)=>{
            let content = ''
            if(detail.status == 2){
              content = '通知付款 时间' + this.$dateFormat(Number(detail.time))
            }else if(detail.status == 1){
              content = '已付款 付款时间' + this.$dateFormat(Number(detail.time))
            }else if(detail.status == 3){
              content = '申请延期到' + this.$dateFormat(Number(detail.time))
            }else{
              content = '进度更新'
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
              content: '进度未更新',
              timestamp: '',
              color: '#9EA7B4',
            },
          ]
        }
      })
      this.showDetailVisible = true
    },
    updateProgressDetails(status) {
      if (!this.changeProgressStatuParam.time) {
        this.$notify.error({
          title: 'fail',
          message: '请选择时间',
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
      this.searchProgress.status = status
      this.searchProgressList()
    },
    backClick() {
      this.showStatusList = false
    },
    //律师搜索单位列表
    searchProgressList(){
      let param = Object.assign(this.searchProgress)
      param.projectId = this.projectId
      param.pageNo = this.searchProgressTotalCurrentPage
      param.pageSize = this.searchProgressTotalPageSize
      this.$Geting(this.$api.queryProgressDetailsPage, param)
      .then(res=>{
        if (res.code == 0) {
          this.progressDetailPageList = res.datas.lists
          this.searchProgressTotal = res.datas.count
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
      this.getProgressDetailsList()
    },
    handleCurrentChangeSearch(val) {
      this.searchProgressTotalCurrentPage = val
      this.getProgressDetailsList()
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
      height: 738px;
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
          width: 155px;
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
        .deferred-payment{
          background:#358AD2;
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
      .phase-box:hover .phase-operate-wrap {
        display: block;
      }
      .phase-box:hover .phase-wrap {
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
      .deferred-payment{
        background:#358AD2;
      }

      .total-price-box {
        p {
          font-size: 14px;
          height: 40px;
          line-height: 40px;
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
          width: 40px;
          word-break: keep-all;
        }
      }
      .progress-title {
        padding: 30px 0 10px;
      }
      .el-timeline-item__content,.el-timeline-item__timestamp{
        color: #101010;
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
          width: 60px;
        }
      }
    }
  }
}
</style>