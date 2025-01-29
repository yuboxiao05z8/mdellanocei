<template>
  <div class="PdiList_page">
    <div class="head">
      <el-form :inline="true" :model="form" class="demo-form-inline">
        <el-form-item label="Signature Status">
          <el-select size="mini" v-model="form.pdiStatus">
            <el-option
              v-for="(item, index) in statusList"
              :key="index"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input
            size="mini"
            v-model="form.unitName"
            placeholder="Unit Name"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            size="mini"
            v-model="form.brokeName"
            placeholder="Broke Name"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-input
            size="mini"
            v-model="form.agentName"
            placeholder="Agent"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button size="mini" @click="searchFn">Search</el-button>
        </el-form-item>

        <el-form-item>
          <el-button size="mini" @click="refreshFn">refresh</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content_tab">
      <div class="tab__list_center">
        <el-table
          :header-cell-style="{ background: '#f5f7fa' }"
          max-height="600"
          :data="tabList"
          border
          size="mini"
        >
          <el-table-column prop="brokeName" label="Time Passed">
            <template slot-scope="scope">
              <div>{{ calculateTime(scope.row.createTime) }}</div>
            </template>
          </el-table-column>
          <el-table-column label="Creation Time">
            <template slot-scope="scope">
              <div>{{ $dateFormatNoTime(scope.row.createTime) }}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="pdiStatus"
            label="Signature Status"
          ></el-table-column>
          <el-table-column prop="code" label="LOA"></el-table-column>
          <el-table-column prop="unitName" label="unitName"></el-table-column>
          <el-table-column prop="agentName" label="Agent"></el-table-column>
          <el-table-column prop="email" label="Agent Email"></el-table-column>

          <el-table-column width="250" :label="$t('userLists.edit')">
            <template slot-scope="scope">
              <!-- <el-button
                size="mini"
                plain
                @click="GoDetails(scope.row)"
                >详情</el-button
              > -->
              <el-button
                v-if="scope.row.purchaseStatus == 'RESERVED'"
                size="mini"
                plain
                @click="CancelReservedFn(scope.row)"
                >Cancel Reserved</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="margin-top: 20px; text-align: center"
          :page-size="pageObj.pageSize"
          @current-change="handleCurrentChange"
          background
          layout="prev, pager, next"
          :total="count"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>



<script>
import { TimeDifference } from '@/utils/validate.js'
export default {
  data() {
    return {
      form: {
        pdiStatus: 'All',
        unitName: '',
        brokeName: '',
        agentName: '',
      },
      projects: [],
      tabList: [],
      count: 1,
      pageObj: {
        pageNo: 1,
        pageSize: 8,
      },
      statusList: [
        'All',
        'created',
        'sent',
        'delivered',
        'signed',
        'declined',
        'completed',
        // 'faxpending',
        // 'autoresponded',
      ],
    }
  },
  mounted() {
    this.querySignPdiList()
  },
  methods: {
    refreshFn() {
      this.form = {
        pdiStatus: 'All',
        unitName: '',
        brokeName: '',
        agentName: '',
      }
      this.querySignPdiList()
    },
    handleCurrentChange(val) {
      this.pageObj.pageNo = val
      this.querySignPdiList()
    },
    searchFn() {
      this.pageObj.pageNo = 1
      this.querySignPdiList()
    },
    querySignPdiList() {
      let data = {
        ...this.pageObj,
        ...this.form,
      }
      if (data.pdiStatus == 'All') data.pdiStatus = ''
      this.$Posting(this.$api.querySignPdiList, data).then((res) => {
        if (res.code == 0) {
          this.tabList = res.datas.lists
          this.count = res.datas.count
        }
      })
    },
    CancelReservedFn(row) {
      this.$confirm(`Change the state to Cancel Reserved?`, 'Cancel Reserved', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning',
      })
        .then(() => {
          let data = {
            unitId: row.unitId,
            projectId: row.projectId,
            type: 4,
            recordId: row.recordId,
          }
          this.$Posting(this.$api.addTransaction, data).then((res) => {
            if (res.code == 0) {
              this.$notify({
                title: 'success',
                message: 'Cancel Reserved!',
                type: 'success',
              })
              this.querySignPdiList()
            } else {
              this.$message({
                type: 'info',
                message: res.msg,
              })
            }
          })
        })
        .catch(() => {})
    },
    GoDetails(row) {
      this.$router.push({
        path: '/SalesBooking/viewDetails',
        query: {
          projectName: row.projectName,
          unitName: row.unitName,
          unitId: row.unitId,
          projectId: row.projectId,
          Status: status,
          link: '/SalesBooking/ProjectSales/PDIList',
        },
      })
    },
    calculateTime(time) {
      return TimeDifference(time)
    },
  },
}
</script>

<style lang="less">
.PdiList_page {
  height: 100%;
  .head {
    padding: 10px;
    background: #fff;
    margin-bottom: 15px;
    .el-form-item {
      margin-bottom: 0;
      margin-right: 20px;
    }
  }
  .content_tab {
    width: 100%;
    height: calc(100% - 76px);
    background: #fff;
    padding: 10px;
  }
}
</style>