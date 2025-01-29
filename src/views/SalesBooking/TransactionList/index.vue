<template>
  <div class="TransactionList">
    <div class="head">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-input
            style="width:300px;margin-right: 15px;"
            class="seekInput"
            size="mini"
            v-model="from.projectName"
            placeholder="Project Name"
          ></el-input>
          <el-button class="seekBtn" size="mini" @click="Search">Search</el-button>
        </el-col>
        <el-col :span="12">
          Sales Status
          <el-select style="margin-left:10px;" size="mini" v-model="from.status" @change="Search">
            <el-option
              v-for="(item, index) in statusData"
              :key="index"
              :label="item.text"
              :value="item.type"
            ></el-option>
          </el-select>
        </el-col>
      </el-row>
    </div>
    <div class="tabDiv">
      <el-table
        border
        :header-cell-style="{'background':'#f5f7fa'}"
        :data="tableData"
        style="width: 100%; max-height: 600px"
        size="mini"
      >
        <el-table-column label="System No.">
          <template slot-scope="scope">
            <div class="seqNoBtn" @click="goDetails(scope.row)">{{scope.row.seqNo}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="projectName" label="Project Name"></el-table-column>
        <el-table-column prop="building" label="Block"></el-table-column>
        <el-table-column prop="unitName" label="Unit No."></el-table-column>
        <el-table-column prop="status" label="Sales Status">
          <template slot-scope="scope">
            <div>
              <span v-if="scope.row.status == 1">SOLD</span>
              <span v-if="scope.row.status == 2">RESERVED</span>
              <span v-if="scope.row.status == 3">ABORT</span>
              <span v-if="scope.row.status == 4">OPTION</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Option Date">
          <template slot-scope="scope">
            <div>{{$dateFormatNoTime(scope.row.transactionDate)}}</div>
          </template>
        </el-table-column>
        <el-table-column label="Date Created">
          <template slot-scope="scope">
            <div>{{$dateFormatNoTime(scope.row.createTime)}}</div>
          </template>
        </el-table-column>
        <el-table-column label="Edit" width="300px">
          <template slot-scope="scope">
            <div v-if="scope.row.status == 2">
              <el-button
                size="mini"
                @click="StatusPartitive(scope.row, 3, 'Cancel Reserved')"
              >Cancel Reserved</el-button>
              <el-button size="mini" @click="BookUnitFn(scope.row)">Approve Unit</el-button>
            </div>
            <div v-if="scope.row.status == 1">
              <el-button size="mini" @click="StatusPartitive(scope.row, 3, 'Terminate')">Terminate</el-button>
              <el-button size="mini" @click="StatusPartitive(scope.row, 4, 'Option')">Option</el-button>
            </div>
            <div v-if="scope.row.status == 4">
              <el-button size="mini" @click="StatusPartitive(scope.row, 3, 'Terminate')">Terminate</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-pagination
      class="page_section"
      @current-change="changePage"
      background
      :page-size="from.pageSize"
      layout="prev, pager, next"
      :total="from.count"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      from: {
        projectName: '',
        status: '',
        pageNo: 1,
        pageSize: 12,
        count: 0
      },
      tableData: [],
      statusData: [
        { text: 'ALL', type: '' },
        { text: 'SOLD', type: 1 },
        { text: 'RESERVED', type: 2 },
        { text: 'ABORT', type: 3 },
        { text: 'OPTION', type: 4 }
      ]
    }
  },
  mounted() {
    this.queryTransactionLogList()
  },
  methods: {
    queryTransactionLogList() {
      this.$Posting(this.$api.queryTransactionLogList, this.from).then(res => {
        if (res.code == 0) {
          this.from.count = res.datas.count
          this.tableData = res.datas.lists
        }
      })
    },
    changePage(val) {
      this.from.pageNo = val
      this.queryTransactionLogList()
    },
    Search() {
      this.from.pageNo = 1
      this.queryTransactionLogList()
    },
    goDetails(row) {
      let status = ''
      switch (row.status) {
        case 1:
          status = 'SOLD'
          break

        case 2:
          status = 'RESERVED'
          break
        case 3:
          status = 'APPROVE'
          break
        case 4:
          status = 'OPTION'
          break
      }
      this.$router.push({
        path: '/SalesBooking/viewDetails',
        query: {
          projectName: row.projectName,
          // recordId: row.recordId,
          unitName: row.unitName,
          unitId: row.unitId,
          projectId: row.projectId,
          Status: status,
          link: '/SalesBooking/TransactionList'
        }
      })
    },
    BookUnitFn(row) {
      this.$router.push({
        path: '/SalesBooking/SalesFlowchart',
        query: {
          unitId: row.unitId,
          projectId: row.projectId,
          unitName: row.unitName,
          projectName: row.projectName,
          type: 'RESERVED',
          link: '/SalesBooking/TransactionList'
        }
      })
    },
    StatusPartitive(row, type, text) {
      console.log(row)
      this.$confirm(`Change the state to ${text}?`, text, {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(() => {
          let data = {
            unitId: row.unitId,
            projectId: row.projectId,
            status: type,
            recordId: row.recordId
          }
          this.$Posting(this.$api.updateTransactionLogStatus, data).then(res => {
            if (res.code == 0) {
              this.$message({
                type: 'success',
                message: 'Change the success!'
              })
              this.queryTransactionLogList()
            } else {
              this.$message({
                type: 'info',
                message: res.msg
              })
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: 'Canceled'
          })
        })
    }
  }
}
</script>

<style lang="less">
.TransactionList {
  .head {
    padding: 10px;
    background: #fff;
    margin-bottom: 15px;
  }
  .tabDiv {
    padding: 10px;
    background: #fff;
    .seqNoBtn {
      cursor: pointer;
      color: #409eff;
    }
  }
}
</style>