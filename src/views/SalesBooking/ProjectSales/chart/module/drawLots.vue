<template>
  <div class="drawLots_page">
    <div class="drawLots_head">
      <div class="drawLots_info" v-if="alignmentList.length">
        <el-alert
          :closable="false"
          v-if="ballotNum"
          :title="`Current Queue No.： ${ballotNum}`"
          type="error"
          :description="`Ballot No.： ${ballotNo}`"
        >
        </el-alert>
      </div>
      <div class="drawLots_btn">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-menu"
              @click="triggerSon('ThinkingBoxDom')"
              >Thinking Box List</el-button
            >
          </el-col>
          <el-col :span="8">
            <el-button
              :disabled="isDevelopers != 2 || !alignmentList.length"
              type="danger"
              @click="alterStatus"
              >Next/TB</el-button
            >
          </el-col>
          <el-col :span="8">
            <el-button
              type="primary"
              size="mini"
              @click="triggerSon('BookingQueueDom')"
              >Booking Queue List<i class="el-icon-menu el-icon--right"></i
            ></el-button>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="drawLots_body">
      <div class="alignment">
        <el-divider>Queue List</el-divider>
        <div class="alignment_tab">
          <el-table
            size="mini"
            :cell-style="{ textAlign: 'center' }"
            :data="alignmentList"
            border
            :row-class-name="tableRowClassName"
          >
            <el-table-column prop="ballotNum" label="No." width="120">
              <template slot-scope="scope">
                <div>
                  <span style="margin-right: 10px">{{
                    scope.row.ballotNum
                  }}</span>
                  <!-- <b v-if="scope.row.buyStatus == 4">Ready Okay</b> -->
                  <b class="statusB" v-if="scope.row.buyStatus == 5" style="color: red"
                    >TB Ready</b
                  >
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="ballotNo" label="Ballot No.">
            </el-table-column>
            <el-table-column prop="brokeName" label="Agency Agent">
            </el-table-column>
            <el-table-column prop="agentName" label="Agent"> </el-table-column>
            <el-table-column prop="mobile" label="Contact"> </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="alignment">
        <el-divider>Sales Summary</el-divider>
        <div class="alignment_tab">
          <el-table
            :cell-style="{ textAlign: 'center' }"
            :data="brokeList"
            stripe
            border
            size="mini"
          >
            <el-table-column prop="brokeName" label="Company">
            </el-table-column>
            <el-table-column prop="num" label="Amount"> </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <ThinkingBoxList
      @receiveFn="receiveFn"
      :projectId="projectId"
      ref="ThinkingBoxDom"
    />
    <BookingQueueList
      @receiveFn="receiveFn"
      :projectId="projectId"
      ref="BookingQueueDom"
    />
  </div>
</template>

<script>
import ThinkingBoxList from './ThinkingBoxList'
import BookingQueueList from './BookingQueueList'
export default {
  components: { ThinkingBoxList, BookingQueueList },
  props: ['projectId'],
  data() {
    return {
      brokeList: [],
      alignmentList: [],
      ballotNum: '',
      ballotNo: '',
      isMarkSold: 0,
      isDevelopers: JSON.parse(sessionStorage.getItem('userInfo')).type,
    }
  },
  mounted() {
    this.queryProjectSalesByBroke()
    this.queryInterestQueue()
    this.getUnitRoleAccess()
  },
  methods: {
    tableRowClassName({row, rowIndex}) {
      if(row.buyStatus == 5) {
        return 'warning-row';
      }
    },
    async queryProjectSalesByBroke() {
      let res = await this.$Post(this.$api.queryProjectSalesByBroke, {
        projectId: this.projectId,
      })
      if (res.code == 0) {
        this.brokeList = res.datas
      }
    },
    async queryInterestQueue() {
      let data = {
        pageNo: 1,
        pageSize: 10,
        projectId: this.projectId,
        type: 'queue',
      }

      let res = await this.$Post(this.$api.queryInterestQueue, data)
      if (res.code == 0) {
        this.alignmentList = res.datas.lists
        if (this.alignmentList.length) {
          this.ballotNum = this.alignmentList[0].ballotNum
          this.ballotNo = this.alignmentList[0].ballotNo
          this.$emit('getInterestId', this.alignmentList[0].interestId)
        }
      }
    },
    receiveFn() {
      this.queryInterestQueue()
    },
    triggerSon(type) {
      // 全部买家
      this.$refs[type].show = true
      this.$refs[type].queryInterestQueue()
    },
    alterStatus() {
      if (this.alignmentList.length) {
        let obj = {
          interestId: this.alignmentList[0].interestId,
          buyStatus: 3,
        }
        this.$Posting(this.$api.nextBuyer, obj).then((res) => {
          if (res.code == 0) {
            this.queryInterestQueue()
            this.$notify({
              title: 'Success',
              // message: '这是一条成功的提示消息',
              type: 'success',
            })
          } else {
            this.$notify.error({
              title: 'Error',
              message: res.msg,
            })
          }
        })
      }
    },
    getUnitRoleAccess() {
      this.$Post(this.$api.getUnitRoleAccess, {
        projectId: this.projectId,
      }).then((res) => {
        if (res.code == 0) {
          this.isMarkSold = res.datas.Mark_Sold
        }
      })
    },
  },
}
</script>

<style lang="less">
.drawLots_page {
  height: 100%;
  min-width: 500px;
  .drawLots_head {
    padding: 10px;
    text-align: center;
    background: #fff;
    margin-bottom: 15px;
    .drawLots_info {
      margin-bottom: 10px;

      .el-alert__content {
        margin: 0 auto;
        .el-alert__title,
        .el-alert__description {
          font-size: 15px;
          font-weight: bold;
        }
      }
    }
    .drawLots_btn {
      height: 40px;
      line-height: 40px;
    }
  }
  .drawLots_body {
    margin-top: 15px;
    height: calc(100% - 146px);
    box-sizing: border-box;
    background: #fff;
    padding: 10px;
    overflow-y: auto;
    .alignment_tab {
      .el-table {
        .cell {
          text-align: center;
        }
        
        .warning-row{
          // background: oldlace;
          .statusB{
            font-size: 12px;
            font-weight: 100;
          }
          .cell{
            color: #FF6666;
          }
        }
      }
    }
  }
}
</style>