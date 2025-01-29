<template>
  <div class="BuyersStatistics">
    <div class="head">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-button
            size="mini"
            type="info"
            class="btn el-icon-back"
            style="margin-right: 30px"
            @click="goBack"
            >{{ $t('editMap.goBack') }}</el-button
          >
        </el-col>
        <el-col :span="8">
          <div>Name: {{ $route.query.name }}</div>
        </el-col>

        <el-col :span="12" v-if="activePageName == 'default'">
          <uploader
            v-if="!isOpening"
            fileId="transactionsFile"
            :maxSize="100"
            :uploadParam="uploadParam"
            @uploadAfter="uploadAfter"
            :url="$api.importUnitInterest"
            fileType=".xls,.xlsx"
            :btnText="{
              select: 'Select Excel File',
              import: 'Import Using File',
            }"
          ></uploader>
          <el-button size="mini" @click="exportData">Excel Template</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="head">
      <div class="colDiv">
        <!-- <div class="inputDiv">
          <el-input
            size="mini"
            v-model="form.ballotNo"
            placeholder="InterestID"
          ></el-input>
        </div> -->

        <div class="inputDiv">
          <el-input
            size="mini"
            v-model="form.brokeName"
            placeholder="Agency"
          ></el-input>
        </div>

        <div class="inputDiv">
          <el-input
            size="mini"
            v-model="form.agentName"
            placeholder="Agent Name"
          ></el-input>
        </div>

        <div class="inputDiv">
          Building
          <el-select size="mini" v-model="form.building" @change="queryUnit">
            <el-option
              v-for="(item, index) in buildingData"
              :key="index"
              :label="item.buildName"
              :value="item.buildName"
            ></el-option>
          </el-select>
        </div>

        <div class="inputDiv">
          Unit
          <el-select size="mini" v-model="form.unitId">
            <el-option
              v-for="(item, index) in unitData"
              :key="index"
              :label="item.unitName"
              :value="item.unitId"
            ></el-option>
          </el-select>
        </div>

        <div class="inputDiv">
          <el-button size="mini" @click="searchFn">Search</el-button>
        </div>

        <div class="inputDiv">
          <el-button size="mini" @click="queryInterestDetail"
            >Add Buyer</el-button
          >
        </div>
      </div>
    </div>

    <div class="tab__list_center">
      <el-tabs
        class="pane_tabs_box"
        v-model="activePageName"
        type="border-card"
      >
        <el-tab-pane name="default" label="Buyer List">
          <BuyTabTemplate
            :tabList="tableData"
            :count="defaultCount"
            ref="defaultTemplate"
            @queryInterestDetail="queryInterestDetail"
            @handleCurrentChange="PagingPageNo"
            @Delete="Delete"
          />
        </el-tab-pane>
        <el-tab-pane name="repetition" label="Buyer Duplicates List">
          <el-tabs
            type="card"
            v-model="repeatType"
            @tab-click="repeatNavTabFn"
            class="repeatNavTab"
          >
            <el-tab-pane
              label="NRIC/Passport"
              name="nricPassport"
            ></el-tab-pane>
            <el-tab-pane label="Buyer Name" name="buyerName"></el-tab-pane>
            <el-tab-pane label="Cheque No." name="ChequeNo"></el-tab-pane>
          </el-tabs>
          <BuyTabTemplate
            :tabList="repetitionData"
            :count="RepeatCount"
            ref="RepeatTemplate"
            @queryInterestDetail="queryInterestDetail"
            @Delete="Delete"
            @handleCurrentChange="PagingPageNo"
            :bgColor="true"
          />
        </el-tab-pane>
      </el-tabs>
    </div>
    <buyers-from
      @etidEnd="etidEnd"
      :interestId="interestId"
      @AddSuccess="queryInterest"
      ref="buyers_from"
    />
  </div>
</template>

<script>
import { baseURL } from '@/InterfaceConfig/env'
import uploader from '@/components/uploader'
import BuyersFrom from '../component/BuyersFrom'
import BuyTabTemplate from './module/BuyTabTemplate'
export default {
  components: { uploader, BuyersFrom, BuyTabTemplate },
  data() {
    return {
      uploadParam: [],
      form: {},
      buildingData: [],
      tableData: [],
      defaultPageObj: {
        pageSize: 10,
        pageNo: 1,
      },
      defaultCount: 1,
      InterestDetai: {},
      unitData: [],
      interestId: '',
      isOpening: false,

      activePageName: 'default',
      repetitionData: [],
      repeatType: 'nricPassport', // buyerName, ChequeNo
      RepeatPageObj: {
        pageSize: 10,
        pageNo: 1,
      },
      RepeatCount: 0,
    }
  },
  provide() {
    return {
      porjectInfo: this,
    }
  },
  mounted() {
    this.uploadParam = [
      { name: 'projectId', value: this.$route.query.id },
      { name: 'projectName', value: this.$route.query.name },
    ]

    this.queryInterest()
    this.getUnitFilter()
    this.queryProjectSet()
    this.queryRepeatBuyers()
  },
  methods: {
    goBack() {
      this.$router.replace('/Interes/InterestedBuyers')
    },
    uploadAfter() {
      this.queryInterest()
    },
    Delete(row) {
      this.$confirm('Are you sure to delete it?', 'Warn', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning',
      })
        .then(() => {
          this.$Post(this.$api.delUnitInterest, {
            interestId: row.interestId,
          }).then((res) => {
            if (res.code == 0) {
              this.queryInterest()
              this.queryRepeatBuyers()

              this.$notify({
                title: 'Success',
                message: res.msg,
                type: 'success',
              })
            } else {
              this.$notify.error({
                title: 'Error',
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
    exportData() {
      let params = {
        projectId: this.$route.query.id,
        projectName: this.$route.query.name,
        islaunch: 1,
        isCheck: 0,
      }
      window.location.href = this.$addDownUrl(
        this.$api.exportUnitInterest,
        params
      )
    },
    searchFn() {
      switch (this.activePageName) {
        case 'default':
          this.defaultPageObj.pageNo = 1
          this.$refs.defaultTemplate.pageNo = 1
          console.log(this.$refs.defaultTemplate.pageNo, '222')
          this.queryInterest()
          break

        case 'repetition':
          this.RepeatPageObj.pageNo = 1
          this.$refs.RepeatTemplate.pageNo = 1
          this.queryRepeatBuyers()
          break
      }
    },
    queryInterest() {
      let from = JSON.parse(JSON.stringify(this.form))
      // if (this.form.building) {
      //   let obj = this.buildingData.filter((item) => item.buildId == this.form.building)
      //   from.building = obj[0].buildName
      // }

      let data = {
        pageNo: this.defaultPageObj.pageNo,
        pageSize: this.defaultPageObj.pageSize,
        projectId: this.$route.query.id,
        ...from,
      }

      this.$Posting(this.$api.queryInterest, data).then((res) => {
        if (res.code == 0) {
          this.defaultCount = res.datas.count
          this.tableData = res.datas.lists
        }
      })
    },
    PagingPageNo(val) {
      switch (this.activePageName) {
        case 'default':
          this.defaultPageObj.pageNo = val
          this.queryInterest()
          break

        case 'repetition':
          this.RepeatPageObj.pageNo = val
          this.queryRepeatBuyers()

          break
      }
    },
    queryUnit(name) {
      let obj = this.buildingData.filter((item) => item.buildName == name)
    
      let data = {
        projectId: this.$route.query.id,
        building: obj[0].buildId,
      }
      this.$Post(this.$api.queryUnit, data).then((res) => {
        if (res.code == 0) {
          this.unitData = res.datas
        }
      })
    },
    getUnitFilter() {
      this.$Post(this.$api.queryBuilding, {
        projectId: this.$route.query.id,
        pageSize: 999,
        pageNo: 1,
      }).then((res) => {
        if (res.code == 0) {
          this.buildingData = res.datas.lists
        }
      })
    },
    queryInterestDetail(row) {
      this.$refs.buyers_from.show = true
      let { interestId, interestUnitId } = row
      if (interestId) {
        this.interestId = interestId
      }
      this.$refs.buyers_from.form = { ...this.getCreateInfo() }
    },
    getCreateInfo() {
      let info = JSON.parse(sessionStorage.getItem('userInfo')) || {}
      return {
        projectName: this.$route.query.name,
        createUserName: info.agentName,
      }
    },
    etidEnd() {
      this.interestId = ''
    },
    queryProjectSet() {
      this.$Get(this.$api.queryProjectSet, {
        projectId: this.$route.query.id,
      }).then((res) => {
        if (res.code == 0) {
          this.isOpening = res.datas.projectSet.launchStatus
          console.log('是否开盘状态', this.isOpening)
        }
      })
    },
    
    repeatNavTabFn() {
      this.RepeatPageObj.pageNo = 1
      this.$refs.RepeatTemplate.pageNo = 1
      this.queryRepeatBuyers()
    },
    queryRepeatBuyers() {
      let api = this.$api.queryRepeatBuyer
      let from = JSON.parse(JSON.stringify(this.form))
      // if (this.form.building) {
      //   let obj = this.buildingData.filter((item) => item.buildId == this.form.building)
      //   from.building = obj[0].buildName
      // }
      let data = {
        pageNo: this.RepeatPageObj.pageNo,
        pageSize: this.RepeatPageObj.pageSize,
        projectId: this.$route.query.id,
        ...from,
        repeatType: this.repeatType,
      }

      if (this.repeatType == 'ChequeNo') {
        api = this.$api.queryRepeatChequeNum
      }
      this.$Posting(api, data).then((res) => {
        if (res.code == 0) {
          this.repetitionData = res.datas.lists
          this.RepeatCount = res.datas.count
        }
      })
    },
  },
}
</script>

<style lang="less">
.BuyersStatistics {
  height: 100%;
  .head {
    padding: 10px;
    background: #fff;
    margin-bottom: 15px;
    .colDiv {
      .inputDiv {
        display: inline-block;
        margin-right: 15px;
      }
    }
    .el-row {
      line-height: 30px;
    }
  }
  .tab__list_center {
    height: calc(100% - 130px);
    .pane_tabs_box {
      height: 100%;
    }
    .repeatNavTab {
      .el-tabs__content {
        display: none;
      }
    }
  }

  .buyDialog {
    height: 500px;
    overflow-y: scroll;
    .buyBox {
      border: 1px solid #f4f4f4;
      margin-bottom: 20px;
      &.Agencies {
        background: #f4f4f4;
        padding: 10px;
      }
      .el-row {
        margin-bottom: 10px;
        &.el-row:last-child {
          margin-bottom: 0;
        }
      }
      .deepen {
        background: #e6e5e5;
        padding: 5px;
        &.littleShallow {
          background: #f4f4f4;
        }
      }
      .top {
        background: #e6e5e5;
        padding: 10px;
      }
      .boy {
        padding: 10px;
        p {
          padding: 5px 0;
        }
      }
    }
  }
}
</style>