<template>
  <div class="sales-record-wrap">
    <div class="search-wrap">
      <el-row class="">
        <el-col :span="10">
          {{$t('transactions.Project')}}：
          <el-select size="mini" v-model="selectProject" @change="getActiveData(true)" value-key="projectId">
            <el-option v-for="(item,k) in projectLists" :label="item.projectName" :value="item" :key="k"></el-option>
          </el-select>
          <!-- <el-button size="mini">{{$t('transactions.BulkDocumentDownload')}}</el-button> -->
        </el-col>
      </el-row>
      <el-row class="sales-record-status-wrap">
        <div class="sales-record-status" :class="{'active':searchStatus=='ALL'}" @click="getActiveData(true, 'ALL')"><span>ALL {{num["ALL"]}}</span></div>
        <div class="sales-record-status" :class="{'active':searchStatus=='PDI PENDING'}" @click="getActiveData(true, 'PDI PENDING')"><span class="status-point pdi"></span> <span>PDI PENDING {{num["PDI PENDING"]}}</span></div>
        <div class="sales-record-status" :class="{'active':searchStatus=='OTP PENDING'}" @click="getActiveData(true, 'OTP PENDING')"><span class="status-point otp"></span> <span>OTP PENDING {{num["OTP PENDING"]}}</span></div>
        <div class="sales-record-status" :class="{'active':searchStatus=='COMPLETED'}" @click="getActiveData(true, 'COMPLETED')"><span class="status-point complete"></span> <span>COMPLETED {{num["COMPLETED"]}}</span> </div>
      </el-row>
      <el-row class="screen-wrap">
        <el-col :span="10" class="search-box">
          <el-input size="mini" v-model="searchBuilding" placeholder="Building"></el-input>
          <el-input size="mini" v-model="searchUnit" placeholder="Unit Name"></el-input>
          <el-button size="mini" @click="getActiveData(true, searchStatus)">{{$t('search')}}</el-button>
          <el-button size="mini" @click="getActiveData(true, searchStatus)">{{$t('Refresh')}}</el-button>
        </el-col>
        <!-- <el-col :span="14" class="export-box">
          <el-button size="mini" @click="exportData">{{$t('Export Excel')}}</el-button>
        </el-col> -->
      </el-row>
    </div>
    <div class="table-wrap">
      <el-table
        :data="transactionList"
        style="width: 100%"
        height="520"
        border
        :default-sort = "{prop: 'date', order: 'descending'}"
        >
        <el-table-column
          prop="building"
          label="BLK"
          width="180">
        </el-table-column>
        <el-table-column
          prop="unitName"
          label="UNIT"
          width="180">
        </el-table-column>
        <el-table-column
          prop="transactionStatus"
          sortable
          label="Contract Status">
          <template slot-scope="scope">
            <div v-if="scope.row.transactionStatus=='PDI PENDING'" class="sales-record-status"><span class="status-point pdi"></span> <span>PDI PENDING</span></div>
            <div v-if="scope.row.transactionStatus=='OTP PENDING'" class="sales-record-status"><span class="status-point otp"></span> <span>OTP PENDING</span></div>
            <div v-if="scope.row.transactionStatus=='COMPLETED'" class="sales-record-status"><span class="status-point complete"></span> <span>COMPLETED</span> </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="transactionPrice"
          label="Price">
        </el-table-column>
        <el-table-column
          label="Trade Date">
          <template slot-scope="scope">
            <div>{{$dateFormatNoTime(scope.row.transactionDate)}}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="brokeName"
          label="AGENCY">
        </el-table-column>
        <el-table-column
          prop="agentName"
          label="Agent">
        </el-table-column>
        <el-table-column
          sortable
          label="UPDATE">
          <template slot-scope="scope">
            <div>{{$dateFormat(scope.row.updateTime)}}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="ACTION">
          <template slot-scope="scope">
            <div>
              <el-button class="show-sales-record" @click="handleClick(scope.row)" size="mini">View</el-button>
              <el-dropdown trigger="click" @command="handleCommand">
                <span class="el-dropdown-link">
                  Status<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-if="scope.row.transactionStatus != 'PDI PENDING'" :command="beforeHandleCommand(scope, 'PDI PENDING')">PDI PENDING</el-dropdown-item>
                  <el-dropdown-item v-if="scope.row.transactionStatus != 'OTP PENDING'" :command="beforeHandleCommand(scope, 'PDI SIGNED')">PDI SIGNED</el-dropdown-item>
                  <el-dropdown-item v-if="scope.row.transactionStatus != 'COMPLETED'" :command="beforeHandleCommand(scope, 'COMPLETED')">COMPLETED</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="page_section" v-if="count">
        <el-pagination background small @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSize" layout="prev, pager, next,total" :total="count">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return {
      selectProject: {},
      projectLists: [],
      searchBuilding: "",
      searchUnit: "",
      currentPage: 1,
      pageSize: 10,
      count: 0,
      transactionList: [],
      searchStatus: "",
      num: {

      }
    }
  },
  created(){

  },
  mounted(){
    this.getProjectData()
  },
  methods: {
    getProjectData() {
      let projectId = ""
      if(this.$route.query.id){
        projectId = this.$route.query.id
      }
      this.$Geting(this.$api.queryProject, { pageSize: 10000, pageNo: 1 }).then(
        res => {
          if (res.code == 0) {
            this.projectLists = res.datas.lists;
            if(projectId){
              this.selectProject = res.datas.lists.filter(item=>{
                return item.projectId == projectId
              })[0]
              this.getActiveData()
            }
          } else {
            this.$notify.error({
              title: "fail",
              message: res.msg
            });
            return false;
          }
        }
      );
    },
    getSales(){
      this.$Geting(this.$api.queryTransactionStatusSales, {projectId: this.selectProject.projectId})
      .then(res=>{
        console.log(res)
        if(res.code == 0){
          this.num = res.datas
        }
      })
    },
    exportData(){},
    
    getActiveData(isResetPage = false, transactionStatus) {
      if (!this.selectProject) return;
      this.searchStatus = transactionStatus;
      if(isResetPage)this.currentPage = 1;
      this.$Geting(this.$api.queryTransactionList, {
        projectId: this.selectProject.projectId,
        pageSize: this.pageSize,
        pageNo: this.currentPage,
        unitName: this.searchUnit,
        building: this.searchBuilding,
        transactionStatus: this.searchStatus
      }).then(res => {
        if (res.code == 0) {
          this.transactionList = res.datas.lists;
          this.count = res.datas.count;
          this.getSales()
        } else {
          this.$notify.error({
            title: "fail",
            message: res.msg
          });
          return false;
        }
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getActiveData(false, this.searchStatus);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getActiveData(false, this.searchStatus);
    },
    handleCommand(command){
      let data = {
        projectId: this.selectProject.projectId,
        transactionStatus: command.command,
        unitId: command.scope.row.unitId
      }
      this.$Geting(this.$api.updateTransactionStatus, data)
      .then(res=>{
        if(res.code == 0){
          this.getActiveData(true, this.searchStatus)
        }
      })
    },
    beforeHandleCommand(scope, command){
      return {
        "scope": scope,
        "command": command
      }
    },
    handleClick(row){
      let status = row.purchaseStatus
      this.$router.push({
        path: '/SalesBooking/viewDetails',
        query: {
          projectName: this.selectProject.projectName,
          // recordId: row.recordId,
          unitName: row.unitName,
          unitId: row.unitId,
          projectId: this.selectProject.projectId,
          Status: status,
          link: '/SalesBooking/salesRecord',
          cooperate: this.selectProject.cooperate
        }
      })
    }
  }

}
</script>

 <style lang="less" scoped>
  .sales-record-wrap{
    background-color: #fff;
    height: 100%;
    position: relative;
    overflow: hidden;
    .search-wrap{
      padding: 15px 30px;
      .sales-record-status-wrap{
        display: flex;
        .sales-record-status{
          width: 200px;
          height: 50px;
          line-height: 50px;
          border: 1px solid rgba(187, 187, 187, 100);
          text-align: center;
          font-size: 14px;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          .status-point{
            display: inline-block;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            margin-right: 8px;
          }
          .pdi{
            background: #F9AD03;
          }
          .otp{
            background: #F44144;
          }
          .complete{
            background: #00D2C8;
          }
        }
        .sales-record-status + .sales-record-status{
          border-left: none;
        }
        .active{
          background: #f2f2f2;
          color: #409EFF;
        }
      }
      .el-row{
        margin-bottom: 20px;
      }
      .screen-wrap{
        .search-box{
          display: flex;
          .el-input{
            margin-right: 35px;
          }
        }
        .export-box{
          text-align: right;
        }
      }
    }
    /deep/.table-wrap{
      padding: 15px 30px;
      .el-table{
        .el-table__header {
          th{
            background: #f2f2f2;
          }
        }
        .status-point{
          display: inline-block;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          margin-right: 8px;
        }
        .pdi{
          background: #F9AD03;
        }
        .otp{
          background: #F44144;
        }
        .complete{
          background: #00D2C8;
        }
        .show-sales-record{
          margin-right: 10px;
        }
      }
    }
  }
</style>