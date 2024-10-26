<template>
  <div class="BuyersStatistics">
    <!-- <div class="head">
      <crumbs :crumbsData="crumbsData"></crumbs>
    </div> -->
    <div class="head">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-button
            size="mini"
            type="info"
            class="btn el-icon-back"
            style="margin-right: 30px;"
            @click="goBack"
          >{{$t('editMap.goBack')}}</el-button>
        </el-col>
        <el-col :span="8">
          <div>Name: {{$route.query.name}}</div>
        </el-col>
        <el-col :span="12">
          <uploader
            fileId="transactionsFile"
            :maxSize="100"
            :uploadParam="uploadParam"
            @uploadAfter="uploadAfter"
            :url="$api.importUnitInterest"
            fileType=".xls,.xlsx"
            :btnText="{select:'Select Excel File',import:'Import Using File'}"
          ></uploader>
          <el-button size="mini" @click="exportData">Excel Template</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="head">
      <div class="colDiv">
        <div class="inputDiv">
          <el-input size="mini" v-model="form.ballotNo" placeholder="InterestID"></el-input>
        </div>

        <div class="inputDiv">
          <el-input size="mini" v-model="form.brokeName" placeholder="Agency"></el-input>
        </div>

        <div class="inputDiv">
          <el-input size="mini" v-model="form.agentName" placeholder="Agent Name"></el-input>
        </div>

        <div class="inputDiv">
          Building
          <el-select size="mini" v-model="form.building" @change="queryUnit">
            <el-option
              v-for="(item,index) in buildingData"
              :key="index"
              :label="item.buildName"
              :value="item.buildId"
            ></el-option>
          </el-select>
        </div>

        <div class="inputDiv">
          Unit
          <el-select size="mini" v-model="form.unitId">
            <el-option
              v-for="(item,index) in unitData"
              :key="index"
              :label="item.unitName"
              :value="item.unitId"
            ></el-option>
          </el-select>
        </div>

        <div class="inputDiv">
          <el-button size="mini" @click="searchFn">Search</el-button>
        </div>
      </div>
    </div>

    <div class="tab">
      <el-table height="600px" :data="tableData" border style="width: 100%">
        <el-table-column prop="brokeName" label="Agency" width="180"></el-table-column>
        <el-table-column prop="interestId" label="InterestID" width="180"></el-table-column>
        <el-table-column prop="chequeNum" label="Cheque No" width="180"></el-table-column>
        <el-table-column prop="buyerName" label="Buyer Name" width="180"></el-table-column>
        <el-table-column prop="buyerMobile" label="Mobile" width="180"></el-table-column>
        <el-table-column prop="buyerEmail" label="Email" width="180"></el-table-column>
        <el-table-column prop="building" label="Building" width="180"></el-table-column>
        <el-table-column prop="unitName" label="Unit Name" width="180"></el-table-column>
        <el-table-column prop="agentName" label="Agent Name" width="180"></el-table-column>
        <el-table-column label="Creation Time" width="180">
          <template slot-scope="scope">
            <div>{{$dateFormatNoTime(scope.row.createTime)}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="notes" label="Notes" width="300"></el-table-column>
        <el-table-column fixed="right" width="300" :label="$t('userLists.edit')">
          <template slot-scope="scope">
            <el-button size="mini" plain @click="queryInterestDetail(scope.row)">Buyers Preview</el-button>
            <el-button size="mini" plain @click="Delete(scope.row)">Delete</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="margin-top: 20px;text-align: center;"
        :page-size="pageSize"
        @current-change="handleCurrentChange"
        background
        layout="prev, pager, next"
        :total="count"
      ></el-pagination>
    </div>
    <el-dialog
      v-if="JSON.stringify(InterestDetai) != '{}'"
      :title="`InterestID:${InterestDetai.interest.interestId}`"
      :visible.sync="dialogVisible"
      width="70%"
    >
      <div class="buyDialog">
        <div class="Agencies buyBox">
          <el-row :gutter="20">
            <el-col :span="8">Agencies：{{InterestDetai.interest.brokeName}}</el-col>
            <el-col :span="8">Created By：{{InterestDetai.interest.agentName}}</el-col>
            <el-col :span="8">Created On：{{$dateFormatNoTime(InterestDetai.interest.createTime)}}</el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">Project：{{InterestDetai.interest.projectName}}</el-col>
            <el-col :span="8">Agent Email：{{InterestDetai.interest.agentEmail}}</el-col>
          </el-row>
          <div class="deepen">
            <el-row :gutter="20">
              <el-col :span="8">Agent Name：{{InterestDetai.interest.agentName}}</el-col>
              <el-col :span="8">Agent Mobile No：{{InterestDetai.interest.agentMobile}}</el-col>
              <el-col :span="8">Agent CEA：{{InterestDetai.interest.ballotNo}}</el-col>
            </el-row>
          </div>
        </div>
        <div class="buyBox">
          <h1 class="top">General</h1>
          <div class="boy">
            <p>Ballot No: {{InterestDetai.interest.ballotNo}}</p>
            <p>Cheque Num：{{InterestDetai.interest.chequeNum}}</p>
            <p>Bank Name：{{InterestDetai.interest.bankName}}</p>
            <div class="deepen littleShallow">Notes：{{InterestDetai.interest.notes}}</div>
          </div>
        </div>
        <div class="buyBox" v-for="(items, buyersKey) in InterestDetai.buyers" :key="items.buyerId">
          <h1 class="top">Buyers {{buyersKey + 1}}</h1>
          <div class="boy">
            <el-row :gutter="20">
              <el-col :span="8">Name：{{items.buyerName}}</el-col>
              <el-col :span="8">Area Code：{{items.countryCallingCode}}</el-col>
              <el-col :span="8">Mobile：{{items.buyerMobile}}</el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8">Email：{{items.buyerEmail}}</el-col>
              <el-col :span="8">Nationality：{{items.nationality}}</el-col>
              <el-col :span="8">NRIC /Passport：{{items.nricPassport}}</el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8">Unit：{{items.unitNo}}</el-col>
              <el-col :span="8">BLOCK：{{items.block}}</el-col>
              <el-col :span="8">Street Name：{{items.streetName}}</el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8">Postal Code：{{items.postalCode}}</el-col>
              <el-col :span="8">Country：{{items.country}}</el-col>
            </el-row>
          </div>
        </div>

        <div class="buyBox" v-for="(item, UnitKey) in InterestDetai.units" :key="UnitKey">
          <h1 class="top">Unit {{UnitKey + 1}}</h1>
          <div class="boy">
            <p>project Unit：{{item.unitName}}</p>
            <p>Price From：${{item.priceFrom}}</p>
            <p>Price To：${{item.priceTo}}</p>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { baseURL } from '@/InterfaceConfig/env'
import uploader from '@/components/uploader'
import crumbs from '../component/crumbs'
export default {
  components: { crumbs, uploader },
  data() {
    return {
      crumbsData: ['Potential Clients', 'Intention Buyers Statistics'],
      uploadParam: [],
      form: {},
      buildingData: [],
      tableData: [],
      pageSize: 10,
      pageNo: 1,
      count: 1,
      InterestDetai: {},
      dialogVisible: false,
      unitData: []
    }
  },
  mounted() {
    this.uploadParam = [
      { name: 'projectId', value: this.$route.query.id },
      { name: 'projectName', value: this.$route.query.name }
    ]

    this.queryInterest()
    this.getUnitFilter()
  },
  methods: {
    goBack() {
      this.$router.replace('/Interes/InterestedBuyers')
    },
    getUnitFilter() {
      this.$Post(this.$api.queryBuilding, {
        projectId: this.$route.query.id,
        pageSize: 999,
        pageNo: 1
      }).then(res => {
        if (res.code == 0) {
          this.buildingData = res.datas.lists
        }
      })
    },
    uploadAfter() {
      this.queryInterest()
    },
    Delete(row) {
      this.$confirm('Are you sure to delete it?', 'Warn', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(() => {
          this.$Post(this.$api.delUnitInterest, {
            interestId: row.interestId
          }).then(res => {
            if (res.code == 0) {
              this.queryInterest()
              this.$notify({
                title: 'Success',
                message: res.msg,
                type: 'success'
              })
            } else {
              this.$notify.error({
                title: 'Error',
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
    },
    exportData() {
      let params = {
        projectId: this.$route.query.id,
        projectName: this.$route.query.name,
        islaunch: 1,
        isCheck: 0
      }
      window.location.href = this.$addDownUrl(
        this.$api.exportUnitInterest,
        params
      )
    },
    searchFn() {
      this.pageNo = 1
      this.queryInterest()
    },
    queryInterest() {
      // if(this.form.)
      let from = JSON.parse(JSON.stringify(this.form))
      if(this.form.building) {
        let obj = this.buildingData.filter(item => item.buildId)
        from.building = obj[0].buildName
        console.log(from)
      }
      console.log(this.buildingData)
      let data = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        projectId: this.$route.query.id,
        ...from
      }
      console.log(this.form)
      this.$Posting(this.$api.queryInterest, data).then(res => {
        if (res.code == 0) {
          this.count = res.datas.count
          this.tableData = res.datas.lists
        }
      })
    },
    handleCurrentChange(val) {
      this.pageNo = val
      this.queryInterest()
    },
    queryUnit(name) {
      let data = {
        projectId: this.$route.query.id,
        building: name
      }
      this.$Post(this.$api.queryUnit, data).then(res => {
        if (res.code == 0) {
          this.unitData = res.datas
        }
      })
    },
    queryInterestDetail(row) {
      this.$Posting(this.$api.queryInterestDetail, {
        interestId: row.interestId
      }).then(res => {
        if (res.code == 0) {
          this.InterestDetai = res.datas
          this.dialogVisible = true
        } else {
          this.$notify.error({
            title: 'Error',
            message: res.msg
          })
        }
      })
    }
  }
}
</script>

<style lang="less">
.BuyersStatistics {
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
    .el-row{
      line-height: 30px;
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