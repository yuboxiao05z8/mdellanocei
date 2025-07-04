<template>
  <div class="ThinkingBoxList">
    <el-dialog @close="closeFn" width="80%" title="Booking Queue List" :visible.sync="show">
      <div class="ThinkingBoxList_body">
        <div class="ThinkingBoxList_head">
          <el-input style="width: 200px; margin-right: 20px" size="mini" placeholder="Line No." v-model="ballotNum">
          </el-input>
          <el-input style="width: 200px" size="mini" placeholder="Ballot No. " v-model="ballotNo"></el-input>
          <el-button style="margin-left: 20px" size="mini" @click="searchData">Search</el-button>
          <el-button size="mini" @click="exportTable">Export</el-button>
        </div>
        <div class="alignment_tab">
          <el-table size="mini" :cell-style="{ textAlign: 'center' }" :data="list" stripe border>
            <el-table-column prop="ballotNum" label="No."> </el-table-column>
            <el-table-column prop="ballotNo" label="Ballot No.">
            </el-table-column>
            <el-table-column prop="brokeName" label="Agency Agent">
            </el-table-column>
            <el-table-column prop="agentName" label="Agent"> </el-table-column>
            <el-table-column prop="mobile" label="Contact">
            </el-table-column>
            <el-table-column prop="buyerName" label="Buyer"> </el-table-column>
            <el-table-column prop="buyUnitName" label="Unit(Booked)">
            </el-table-column>
            <el-table-column label="Status">
              <template slot-scope="scope">
                <span v-if="scope.row.buyStatus == 1">Sold</span>
                <span v-if="scope.row.buyStatus == 2">Reserved</span>
                <span v-if="scope.row.buyStatus == 3">TB</span>
                <span v-if="scope.row.buyStatus == 4">Ready Okay</span>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="chaperonIc" label="Chaperone IC">
            </el-table-column> -->
            <el-table-column prop="buyTime" label="Time Stamp">
            </el-table-column>
            <!-- <el-table-column label="Edit">
              <template slot-scope="scope" v-if="accountType == 2 || brokeId == scope.row.brokeId">
                <el-button
                  size="mini"
                  v-if="scope.row.buyStatus == 4 "
                  @click="setStatus(scope.row, 3)"
                  >TB</el-button
                >
                <el-button
                  size="mini"
                  v-if="scope.row.buyStatus == 3"
                  @click="setStatus(scope.row, 4)"
                  >Ready Okay</el-button
                >
              </template>
            </el-table-column> -->
          </el-table>
          <el-pagination class="page_section" :page-size="pageSize" style="text-align: center"
            @current-change="changePage" background layout="prev, pager, next" :total="total"></el-pagination>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: ['projectId'],
  data () {
    return {
      show: false,
      list: [],
      pageNo: 1,
      pageSize: 10,
      total: 0,
      ballotNum: '',
      ballotNo: '',
      accountType: JSON.parse(sessionStorage.getItem('userInfo')).type,
      brokeId: JSON.parse(sessionStorage.getItem('userInfo')).brokeId
    }
  },
  methods: {
    exportTable () {
      //导出
      window.location.href = this.$addDownUrl(this.$api.exportInterestQueue, {
        // brokeId: this.brokeId,
        projectId: this.projectId,
      });
    },
    closeFn () {
      this.$emit('receiveFn')
    },
    async queryInterestQueue () {
      let data = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        projectId: this.projectId,
        ballotNum: this.ballotNum,
        ballotNo: this.ballotNo
      }

      let res = await this.$Post(this.$api.queryInterestQueue, data)
      if (res.code == 0) {
        this.list = res.datas.lists
        this.total = res.datas.count
      }
    },
    changePage (val) {
      this.pageNo = val
      this.queryInterestQueue()
    },
    setStatus (row, type) {
      let obj = {
        interestId: row.interestId,
        buyStatus: type,
      }
      this.$Posting(this.$api.nextBuyer, obj).then((res) => {
        if (res.code == 0) {
          this.queryInterestQueue()
          this.$notify({
            title: 'Success',
            type: 'success',
          })
        } else {
          this.$notify.error({
            title: 'Error',
            message: res.msg,
          })
        }
      })
    },
    searchData () {
      this.pageNo = 1
      this.queryInterestQueue()
    },
  },
}
</script>

<style lang="less">
.ThinkingBoxList {
  .el-dialog__header {
    text-align: center;
  }
  .ThinkingBoxList_body {
    .ThinkingBoxList_head {
      margin-bottom: 15px;
    }
    .alignment_tab {
      .el-table {
        .cell {
          text-align: center;
        }
      }
    }
  }
}
</style>