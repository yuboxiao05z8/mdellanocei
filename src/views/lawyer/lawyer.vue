<template>
  <div class="lawyer-wrapper">
    <div class="lawyer-section" v-show="!showStatusList">
      <div class="project-select-wrap">
        <div class="project-select-label">项目选择:</div>
        <el-select v-model="projectId" @change='getProgressDetailsList' size="mini" placeholder="请选择1">
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
          <el-button class="stay-informed" @click='showStatusListClick()'>待通知</el-button>
          <el-button class="stay-payment" @click='showStatusListClick()'>待付款</el-button>
          <el-button class="overdue-payment" @click='showStatusListClick()'>超时未付款</el-button>
          <el-button class="receiving" @click='showStatusListClick()'>已收款</el-button>
          <el-button class="screen-all">全部</el-button>
        </div>

        <el-table :data="progressDetailList" border style="width: 100%; height: 600px">
          <el-table-column prop="building" label="楼栋" width="60">
          </el-table-column>
          <el-table-column prop="unitName" label="单位" width="60">
          </el-table-column>
          <el-table-column label="总售价格" width="130">
            <template slot-scope="scope">
              <div class="total-price-box">
                <p class="">售价:{{scope.row.transactionPrice}}</p>
                <p class="total-price-received">已收:{{scope.row.price1}}</p>
                <p class="total-price-receive">待收:{{scope.row.price2}}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="firstPhase" v-for="(payment, paymentIndex) in progressKeys">
            <template slot="header" slot-scope="scope">
              <span>{{payment.title}}</span>
              
              <el-tooltip class="item" effect="light" :content="payment.desc" placement="top">
                <i class="el-icon-info"></i>
              </el-tooltip>
            </template>
            <template slot-scope="scope">
              <div class="phase-box">
                <div
                  class="phase-wrap"
                  :class="{
                    'stay-informed': scope.row['status_' + payment.key] == 0,
                    'stay-payment': scope.row['status_' + payment.key] == 1,
                    'overdue-payment': scope.row['status_' + payment.key] == 2,
                    receiving: scope.row['status_' + payment.key] == 3,
                  }"
                >
                  <p class="phase-wrap-price">{{ scope.row['transactionPrice_' + payment.key] }}</p>
                  <p class="phase-wrap-status" v-if="scope.row['status_' + payment.key] === -1">
                    {{ statusMap[4] }}
                  </p>
                  <p class="phase-wrap-status" v-if="scope.row['status_' + payment.key] !== -1">
                    {{ statusMap[scope.row['status_' + payment.key]] }}
                  </p>
                </div>
                <div class="phase-operate-wrap">
                  <p class="phase-operate-detail" @click="showDetailClick()">
                    查看详情
                  </p>
                  <p class="phase-operate-update" @click="changeStatusClick()">
                    更改状态
                  </p>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 状态更新 -->
    <el-dialog
      title=""
      :visible.sync="changeStatusVisible"
      width="30%"
      :before-close="handleClose"
    >
      <div class="change-status-wrap">
        <p>
          <span>选择时间：</span>
          <el-date-picker
            v-model="value1"
            type="datetime"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </p>
        <p>
          <el-button type="primary">标记已通知</el-button>
        </p>
        <p>
          <el-button type="primary">标记已付款</el-button>
        </p>
        <p>
          <el-button type="primary">标记延期</el-button>
        </p>
      </div>
    </el-dialog>

    <!-- 查看详情 -->
    <el-dialog
      title=""
      :visible.sync="showDetailVisible"
      width="40%"
      :before-close="showDetailClose"
    >
      <div class="show-detail-wrap">
        <p class="detail-title">成交信息</p>
        <el-row>
          <el-col><span>单位名称：</span><span>#01-03</span></el-col>
          <el-col><span>楼栋名称：</span><span>block003</span></el-col>
        </el-row>
        <el-row>
          <el-col><span>售价：</span><span>$300,000.00</span></el-col>
          <el-col><span>成交时间：</span><span>02/02/2021</span></el-col>
        </el-row>
        <el-row>
          <el-col><span>主买家名称：</span><span>CC</span></el-col>
          <el-col
            ><span>买家邮箱：</span><span>ycc843092012@gmail.com</span></el-col
          >
        </el-row>
        <p class="detail-title">当前进度信息</p>
        <el-row>
          <el-col><span>进度名称：</span><span>第一期付款 15%</span></el-col>
          <el-col
            ><span>描述：</span
            ><span>a)取得认购协议书 5% <br />b)签订买卖合约 15%</span></el-col
          >
        </el-row>
        <el-row>
          <el-col><span>当前进度应支付：</span><span>$300,000.00</span></el-col>
          <el-col
            ><span>最晚支付时间： </span><span>04/05/2021 10:30</span></el-col
          >
        </el-row>

        <el-row>
          <div>
            <p class="progress-title">进度：</p>
            <el-timeline :reverse="false">
              <el-timeline-item
                v-for="(activity, index) in activities"
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
          <el-col> <el-button type="primary">状态更新</el-button></el-col>
        </el-row>
      </div>
    </el-dialog>

    <div class="show-status-wrap" v-show="showStatusList">
      <p class="back-btn" @click="backClick()">返回</p>
      <el-row class="row-header">
        <el-col :span="4" class="col-text"
          ><el-input
            v-model="statusSearch"
            size="mini"
            placeholder="单位，楼栋"
          />
        </el-col>
        <el-col :span="6" class="col-button">
          <span class='progress-status-title'>进度状态</span>
          <el-select v-model="statusValue" placeholder="进度状态">
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-table
    :data="tableData"
    style="width: 100%"
    border
    max-height="250">
    <el-table-column
      fixed
      prop="date"
      label="楼栋"
      width="90">
    </el-table-column>
    <el-table-column
      prop="name"
      label="单位"
      width="90">
    </el-table-column>
    <el-table-column
      prop="province"
      label="成交价"
      width="150">
    </el-table-column>
    <el-table-column
      prop="city"
      label="当前进度"
      width="120">
    </el-table-column>
    <el-table-column
      prop="address"
      label="当前进度应付款"
      width="300">
    </el-table-column>
    <el-table-column
      prop="zip"
      label="进度更新时间"
      width="120">
    </el-table-column>
    <el-table-column
      fixed="right"
      label="操作">
      <template slot-scope="scope">
        <el-button
          type="text"
          size="small">
          查看详情
        </el-button>
        <el-button
          type="text"
          size="small">
          状态更新
        </el-button>
      </template>
    </el-table-column>
  </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: 1,
      options: [
        {
          value: 1,
          label: 1,
        },
        {
          value: 2,
          label: 2,
        },
        {
          value: 3,
          label: 3,
        },
      ],
      tableData: [
        {
          date: '楼栋1',
          name: '#01-02',
          firstPhase: 1,
          price: '$100,000.00',
          status: '0',
          price1: '$100,000.00',
          status1: '2',
          price2: '$100,000.00',
          status2: '1',
          price3: '$100,000.00',
          status3: '3',
          price4: '$100,000.00',
          status4: '4',
        },
      ],
      statusClassMap: [
        'stay-informed',
        'stay-payment',
        'overdue-payment',
        'receiving',
        '',
      ],
      statusMap: ['待通知', '代付款', '超时未付款', '已收款', '未完成'],
      changeStatusVisible: false, //更改状态弹框
      showDetailVisible: false, //查看详情弹框
      value1: '',
      activities: [
        {
          content: '活动按期开始',
          timestamp: '2018-04-15',
          color: '#00D2C8',
        },
        {
          content: '通过审核',
          timestamp: '2018-04-13',
          color: '#00D2C8',
        },
        {
          content: '创建成功',
          timestamp: '2018-04-11',
          color: '#00D2C8',
        },
      ],
      statusSearch: '',
      statusOptions: [
        {
          value: 0,
          label: '待通知',
        },
      ],
      statusValue: 0,
      showStatusList: false, //点击状态切换表格
      projects: [], //项目列表
      projectId: '', //项目id
      progressDetailList: [], //建筑师进度列表
      progressKeys: [], //进度列表
    }
  },
  created() {
    this.getProjectList()
    this.getProgressKeys()
  },
  methods: {
    getProjectList(){
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
    getProgressDetailsList(){
      this.$Geting(this.$api.queryProgressDetailsList, {projectId: this.projectId, pageNo: 1, pageSize: 10})
      .then(res=>{
        console.log(res)
        this.progressDetailList = res.datas.lists
      })
    },
    
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
    changeStatusClick() {
      this.changeStatusVisible = true
    },
    showDetailClick() {
      this.showDetailVisible = true
    },
    showDetailClose() {
      this.showDetailVisible = false
    },
    handleClose() {
      this.changeStatusVisible = false
    },
    showStatusListClick(){
      this.showStatusList = true
    },
    backClick(){
      this.showStatusList = false
    }
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
      height: 752px;
      border: 1px solid rgba(187, 187, 187, 100);
      .screen-box {
        margin: 52px 20px 10px;
        height: 72px;
        border: 1px solid rgba(187, 187, 187, 100);
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
      }
      .progress-title {
        padding: 7px 0;
      }
    }
  }
  /deep/.show-status-wrap {
    .back-btn {
      cursor: pointer;;
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
    .row-header{
      font-size: 14px;
      line-height: 83px;
      height: 83px;border: 1px solid rgba(187, 187, 187, 100);
      .col-text{
        margin: 0 19px;
      }
      .col-button{
        display: flex;
        .progress-status-title{
          width: 60px;
        }
      }
    }
  }
}
</style>