<template>
  <div class="appoint_list_wrapper">
    <div class="inventory_header">
      <el-row>
        <el-col :span="8">
          <el-button
            size="mini"
            type="info"
            class="btn el-icon-back"
            style="margin-right: 30px;"
            @click="goBack"
          >{{$t('editMap.goBack')}}</el-button>
        </el-col>
        <el-col :span="16" style="text-align:right">
          <el-button size="mini" @click="exportExcel">Export Excel</el-button>
          <el-button size="mini" @click="toBooking">{{$t('Appointment["Appointment Settings"]')}}</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="appoint_list_table">
      <p class="table_title">{{$t('Appointment["Appointment User List"]')}}</p>
      
      <el-form :inline="true" size="mini">
        <el-form-item>
          <el-input v-model="agentName" :placeholder="$t('Appointment.Appointmeng-Agent')"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="brokeName" :placeholder="$t('Appointment.Appointmeng-Broke')"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="regNum" :placeholder="$t('Appointment.Appointmeng-RegNum')"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="buyerName" :placeholder="$t('Appointment.Buyer-Name')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('Appointment.Appointment Date')">
          <el-date-picker
            v-model="appointmentTime"
            type="daterange"
            :start-placeholder="$t('Appointment.Start Date')"
            :end-placeholder="$t('Appointment.End Date')"
            value-format="yyyy/MM/dd"
            :default-time="['00:00:00', '23:59:59']">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button @click="searchFun">{{$t('userLists.search')}}</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="appointList" border style="width: 100%" max-height="600" :header-cell-style="{'background':'#f5f7fa'}" size="mini">
        <el-table-column :label="$t('Appointment.Appointment Date')">
          <template slot-scope="scope">
            <div>{{$dateFormatNoTime(scope.row.appointmentTime)}}</div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('Appointment.User-Name')" prop="buyerName">
        </el-table-column>
        <el-table-column :label="$t('Appointment.Appointment-Mobile')">
          <template slot-scope="scope">
            <div>{{scope.row.buyers?JSON.parse(scope.row.buyers)[0].mobile:""}}</div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('Appointment.Appointment-Status')">
          <template slot-scope="scope">
            <div>{{scope.row.status===1?$t('Appointment.Appointmeng-Reserved'):scope.row.status===2?$t('Appointment.Visited'):$t('Appointment.Canceled')}}</div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('Appointment.Pax')" prop="pax">
        </el-table-column>
        <el-table-column :label="$t('Appointment.Company')" prop="brokeName">
        </el-table-column>
        <el-table-column :label="$t('Appointment.Appointmeng-Agent')" prop="agentName">
        </el-table-column>
        <el-table-column :label="$t('Appointment.Duration')">
          <template slot-scope="scope">
            <div>{{scope.row.time + '-' + scope.row.time2}}</div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('Appointment.Edit')">
          <template slot-scope="scope">
            <el-button
              size="mini"
              plain
              @click="updateAppointmentStatus(scope.row.status, scope.row.logId)"
            >{{$t('Appointment.Status Updating')}}</el-button>
            <el-button
              size="mini"
              plain
              v-if="scope.row.status==3"
              @click="deleteAppointmentLog(scope.row.logId)"
            >{{$t('Appointment.Delete')}}</el-button>
          </template>
        </el-table-column>

      </el-table>
      <div class="page_section" v-if="listNum">
        <el-pagination
          background
          small
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="pageNo"
          :page-sizes="[5,10,30,50,100]"
          :page-size="pageSize"
          layout="prev, pager, next,sizes,total"
          :total="listNum"
        ></el-pagination>
      </div>
    </div>
    <el-dialog
      :title="$t('Appointment.Status Updating')"
      :visible.sync="centerDialogVisible"
      width="30%"
      center>
      <div class="demo-input-suffix">
        <p class="pagesize-title">{{$t('Appointment.Selete Status')}}：</p>
        <el-select v-model="status" :placeholder="$t('Appointment.Selete')">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">{{$t('architect.cancel')}}</el-button>
        <el-button type="primary" @click="confirm">{{$t('alert.sure')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default { 
  data(){
    return {
      appointList: [],
      projectId: "",
      brokeName: "",
      agentName: "",
      regNum: "",
      appointmentTime: "",
      buyerName: "",
      pageNo:1, 
      pageSize: 10,
      listNum: 2,
      centerDialogVisible:false,
      options: [
        {
          value: '1',
          label: this.$t('Appointment.Appointmeng-Reserved')
        },
        {
          value: '2',
          label: this.$t('Appointment.Visited')
        },
        {
          value: '3',
          label: this.$t('Appointment.Canceled')
        }
      ],
      status: "",
      lodId: ""
    }
  },
  mounted(){
    this.projectId = this.$route.query.id
    this.queryAppointmentLogList()
  },
  methods: {
    //导出数据
    async exportExcel() {
      window.location.href = await this.$addDownUrl(
        this.$api.exportAppointment,
        {
          projectId: this.$route.query.id,
        }
      )
    },
    goBack() {
      this.$router.replace('/inventory/inventoryList')
    },
    queryAppointmentLogList(){
      let param = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        projectId: this.projectId,
        brokeName: this.brokeName,
        buyerName: this.buyerName,
        agentName: this.agentName,
        regNum: this.regNum
      }
      if(this.appointmentTime&&this.appointmentTime.length>0){
        param.startTime = this.appointmentTime[0]
        param.endTime = this.appointmentTime[1]
      }
      this.$Geting(this.$api.queryAppointmentLogList, param)
      .then(res=>{
        if(res.code==='0'){
          this.appointList = res.datas.lists
          this.listNum = res.datas.count
        }
      })
    },
    searchFun(){
      this.queryAppointmentLogList()
    },
    toBooking(){
      this.$router.push({
        path: '/inventory/booking',
        query: {
          id: this.projectId,
          name: this.$route.query.name
        },
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.queryAppointmentLogList()
    },
    handleCurrentChange(val) {
      this.pageNo = val
      this.queryAppointmentLogList()
    },
    updateAppointmentStatus(status, id){
      this.lodId = id;
      // this.status = status
      this.centerDialogVisible = true
    },
    confirm(){
      this.$Post(this.$api.updateAppointmentStatus, {
        logId: this.lodId,
        status: this.status
      })
      .then(res=>{
        if(res.code === '0'){
          this.centerDialogVisible = false
          this.status = ""
          this.lodId = ""
          this.queryAppointmentLogList()
          this.$message({
            type: 'success',
            message: 'SUCCESS!'
          });
        }
      })
    },
    deleteAppointmentLog(id){
      this.$confirm(this.$t('Are you sure to delete it'), this.$t('floorPlans.title'), {
          confirmButtonText: this.$t('alert.sure'),
          cancelButtonText: this.$t('alert.cancel'),
          type: 'warning'
        }).then(() => {
          this.$Geting(this.$api.deleteAppointmentLog, {logId:id})
          .then(res=>{
            if(res.code==='0'){
              this.queryAppointmentLogList()
              this.$message({
                type: 'success',
                message: this.$t('alert.alert_success_delete_title')
              });
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: 'Cancel'
          });          
        });
    }
  }
}
</script>
<style lang="less" scoped>
.appoint_list_wrapper {
  background-color: #fff;
  .inventory_header {
    margin: 15px 0;
    margin-top: 0;
    padding: 15px;
    background-color: #fff;
  }
  .appoint_list_table{
    padding: 20px;
    .table_title{
      margin-bottom: 10px;
    }
    .page_section {
      margin-top: 30px;
      text-align: center;
    }
  }
  .demo-input-suffix{
    display: flex;
    align-items: center;
  }
}
</style>