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
          <el-button size="mini" @click="exportExcel">{{$t('inventoryLists.excelTemplate')}}</el-button>
          <el-button size="mini" @click="toBooking">预约管理</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="appoint_list_table">
      <p class="table_title">预约用户列表</p>
      
      <el-form :inline="true" size="small">
        <el-form-item>
          <el-input v-model="brokeName" placeholder="中介公司"></el-input>
        </el-form-item>
        
        <el-form-item>
          <el-input v-model="buyerName" placeholder="参与用户"></el-input>
        </el-form-item>
        <el-form-item label="报名时间">
          <el-date-picker
            v-model="appointmentTime"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy/MM/dd"
            :default-time="['00:00:00', '23:59:59']">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button @click="searchFun">{{$t('userLists.search')}}</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="appointList" border style="width: 100%" max-height="600" :header-cell-style="{'background':'#f5f7fa'}" size="mini">
        <el-table-column label="报名时间">
          <template slot-scope="scope">
            <div>{{$dateFormatNoTime(scope.row.appointmentTime)}}</div>
          </template>
        </el-table-column>
        <el-table-column label="用户名称" prop="buyerName">
        </el-table-column>
        <el-table-column label="电话">
          <template slot-scope="scope">
            <div>{{scope.row.buyers?JSON.parse(scope.row.buyers)[0].mobile:""}}</div>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <div>{{scope.row.status===1?"已报名":scope.row.status===2?"已预约":"已取消"}}</div>
          </template>
        </el-table-column>
        <el-table-column label="参与人数" prop="pax">
        </el-table-column>
        <el-table-column label="报名公司" prop="brokeName">
        </el-table-column>
        <el-table-column label="中介" prop="agentName">
        </el-table-column>
        <el-table-column label="参与时间">
          <template slot-scope="scope">
            <div>{{scope.row.time + '-' + scope.row.time2}}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              plain
              @click="updateAppointmentStatus(scope.row.status, scope.row.logId)"
            >状态</el-button>
            <el-button
              size="mini"
              plain
              v-if="scope.row.status==3"
              @click="deleteAppointmentLog(scope.row.logId)"
            >删除</el-button>
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
      title="变更状态"
      :visible.sync="centerDialogVisible"
      width="30%"
      center>
      <div class="demo-input-suffix">
        <p class="pagesize-title">选择状态：</p>
        <el-select v-model="status" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default { //queryAppointmentLogList
  data(){
    return {
      appointList: [],
      projectId: "",
      brokeName: "",
      appointmentTime: "",
      buyerName: "",
      pageNo:1, 
      pageSize: 10,
      listNum: 2,
      centerDialogVisible:false,
      options: [
        {
          value: '1',
          label: '预约'
        },
        {
          value: '2',
          label: '已到访'
        },
        {
          value: '3',
          label: '取消'
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
    exportExcel() {
      window.location.href = this.$addDownUrl(this.$api.exportProject)
    },
    goBack() {
      this.$router.replace('/inventory/inventoryList')
    },
    queryAppointmentLogList(){
      let param = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        projectId: this.projectId,
        _brokeId: this.brokeName,
        buyerName: this.buyerName
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
            message: '变更成功!'
          });
        }
      })
    },
    deleteAppointmentLog(id){
      this.$confirm('是否删除该条预约记录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$Geting(this.$api.deleteAppointmentLog, {logId:id})
          .then(res=>{
            if(res.code==='0'){
              this.queryAppointmentLogList()
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
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