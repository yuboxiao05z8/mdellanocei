<template>
  <div class="SalesPopup">
    <el-dialog :visible.sync="show" width="60%">
      <div class="titleSlot" slot="title">
        <span>{{ title }}</span>
        <span
          class="statusSpan"
          :class="{
            SOLD: status == 'SOLD',
            AVAILABLE: status == 'AVAILABLE',
            PENDINGRESERVED: status == 'PENDING RESERVED',
            RESERVED: status == 'RESERVED',
            SPASIGN: status == 'SPA SIGN',
            SPASTAMP: status == 'SPA STAMP',
            REQUESTCANCEL: status == 'REQUEST CANCEL',
            NOTRELEASED: status == 'NOT RELEASED',
            InPROGRESS: status == 'IN PROGRESS',
          }"
          >{{ status }}</span
        >
        <span class="ballotNo" v-if="unitData.ballotNo"
          >Ballot No. {{ unitData.ballotNo }}</span
        >
      </div>
      <div class="bodySlot">
        <el-row :gutter="20" v-if="tabList.length">
          <el-col
            v-for="(item, index) in tabList"
            :key="index"
            :span="12"
            class="rowBox"
          >
            <span>{{ item.key }}</span>
            <span class="text">{{ item.value }}</span>
          </el-col>
        </el-row>
      </div>
      <div slot="footer" class="footerSlot">
        <div v-if="status == 'AVAILABLE' && (!unitData.cooperate || isAgentCompany == 2)">
          <el-button v-if="AccessData.Mark_Sold == 1" @click="BookUnitFn"
            >Book Unit</el-button
          >
          <el-button
            @click="StatusPartitive(3, 'Mark sold')"
            v-if="AccessData.Mark_Sold == 1"
            >Mark sold</el-button
          >
          <el-button
            @click="StatusPartitive(2, 'Reserved')"
            v-if="AccessData.Mark_Reserved == 1"
            >Reserved</el-button
          >
          <el-button
            @click="StatusPartitive(1, 'Not Released')"
            v-if="AccessData.Set_Not_Release == 1"
            >Not Released</el-button
          >
        </div>
        <div v-if="status == 'RESERVED'">
          <el-button
            @click="StatusPartitive(4, 'Cancel Reserved')"
            v-if="AccessData.Cancel_Reserved == 1"
            >Cancel Reserved</el-button
          >
          <el-button v-if="AccessData.Mark_Sold == 1" @click="GoPdiFn"
            >PDI</el-button
          >
          <el-button v-if="AccessData.Mark_Sold == 1" @click="BookUnitFn"
            >Book unit</el-button
          >
        </div>
        <div v-if="status == 'NOT RELEASED'">
          <el-button
            @click="StatusPartitive(8, 'Released')"
            v-if="AccessData.Release == 1"
            >Released</el-button
          >
        </div>
        <div v-if="status == 'IN PROGRESS'">
          <el-button v-if="AccessData.Mark_Sold == 1" @click="BookUnitFn"
            >Book Unit</el-button
          >
        </div>
        <div v-if="status == 'SOLD'">
          <el-button v-if="AccessData.Mark_Sold == 1" @click="GoPdiFn"
            >PDI</el-button
          >
          <el-button v-if="AccessData.Mark_Sold == 1" @click="BookUnitFn"
            >Book unit</el-button
          >
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    unitObj: {
      type: Object,
      default: {},
    },
    interestId: {
      type: String,
    },
  },
  watch: {
    unitObj(val) {
      this.getUnitAccess()
      this.getUnitInfo()
    },
    interestId(val) {
      // console.log('买家ID', val)
    },
  },
  data() {
    return {
      show: false,
      title: '',
      status: '',
      tabList: [],
      unitData: {},
      AccessData: {},
      isAgentCompany: JSON.parse(sessionStorage.getItem('userInfo')).type,
    }
  },
  mounted() {},
  methods: {
    getUnitAccess() {
      let data = {
        unitId: this.unitObj.unitId,
        projectId: this.unitObj.projectId,
      }
      this.$Post(this.$api.getUnitAccess, data).then((res) => {
        if (res.code == 0) {
          this.AccessData = res.datas
        }
      })
    },
    getUnitInfo() {
      let data = {
        unitId: this.unitObj.unitId,
        projectId: this.unitObj.projectId,
      }
      this.tabList = []
      this.$Post(this.$api.getUnitInfo, data).then((res) => {
        if (res.code == 0) {
          this.unitData = res.datas
          this.title = `UNIT：${res.datas.unitName}`
          this.status = res.datas.purchaseStatus
          this.tabList = res.datas.lists
        }
      })
    },
    BookUnitFn() {
      if (
        this.unitData.purchaseStatus == 'IN PROGRESS' &&
        !this.AccessData.Mark_Sold
      ) {
        this.$notify.error({
          title: 'Error',
          message: 'The unit is in progress',
        })
        return false
      }
      this.$router.push({
        path: '/SalesBooking/SalesFlowchart',
        query: {
          unitId: this.unitObj.unitId,
          projectId: this.unitObj.projectId,
          unitName: this.unitData.unitName,
          projectName: this.unitData.projectName,
          type: this.unitObj.purchaseStatus,
          link: '/SalesBooking/ProjectSales/SalesChart',
          countDown: this.unitData.bookTime,
        },
      })
      this.show = false
    },
    GoPdiFn() {
      this.$router.push({
        path: '/SalesBooking/viewDetails',
        query: {
          projectName: this.unitData.projectName,
          unitName: this.unitData.unitName,
          unitId: this.unitObj.unitId,
          projectId: this.unitObj.projectId,
          Status: 'RESERVED',
          link: '/SalesBooking/ProjectSales/SalesChart',
        },
      })
    },
    StatusPartitive(type, text) {
      this.$confirm(`Change the state to ${text}?`, text, {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning',
      })
        .then(() => {
          let data = {
            unitId: this.unitObj.unitId,
            projectId: this.unitObj.projectId,
            type: type,
          }
          if (type == 3 || type == 2) {
            data.interestId = this.interestId
          }
          this.$Posting(this.$api.addTransaction, data).then((res) => {
            if (res.code == 0) {
              this.$message({
                type: 'success',
                message: 'Change the success!',
              })
              // this.$emit('refreshFn')
              this.show = false
            } else {
              this.$message({
                type: 'info',
                message: res.msg,
              })
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: 'Canceled',
          })
        })
    },
  },
}
</script>

<style lang="less">
.SalesPopup {
  .titleSlot {
    &::before {
      content: '';
      display: inline-block;
      clear: both;
    }
    span {
      float: left;
    }
    .statusSpan {
      padding: 2px 10px;
      color: #fff;
      margin-left: 15px;
      border-radius: 30px;
      font-size: 12px;
      font-weight: 600;
    }
    .ballotNo {
      color: #f56c6c;
      font-size: 14px;
      margin-left: 15px;
    }
  }

  .bodySlot {
    .rowBox {
      margin-bottom: 15px;
      span {
        float: left;
        width: 40%;
        &.text {
          color: #000;
          width: 60%;
        }
      }
      &::before {
        content: '';
        display: inline-block;
        clear: both;
      }
    }
  }
  .footerSlot {
    text-align: center;
  }
}
</style>