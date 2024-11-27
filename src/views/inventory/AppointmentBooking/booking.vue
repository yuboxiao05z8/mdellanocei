<template>
  <div class="AppointmentBooking">
    <div class="AppointmentBooking_head">
      <div class="project_title">
        <el-button
          size="mini"
          type="info"
          class="btn el-icon-back"
          style="margin-right: 30px;"
          @click="goBack"
        >{{$t('editMap.goBack')}}</el-button>
        <span>{{$t('navTop.propertiesDetails')}}</span>
        <span class="project_name">Appointment Booking: {{linkInfo.name}}</span>
        <el-button size="mini" @click="addBooking" class="addBooking">Add Time</el-button>
      </div>
    </div>
    <div class="AppointmentBooking_content">
      <div class="table_div">
        <el-table height="100%" border :data="tableData" class="table_div_content">
          <el-table-column label="Appointment time">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.time }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Maximum Group/Hour" prop="maxGroup"></el-table-column>
          <el-table-column label="Maximum Pax/Group" prop="maxNum"></el-table-column>
          <el-table-column label="Appointment start time" prop="startTime"></el-table-column>
          <el-table-column label="End of appointmen" prop="endTime"></el-table-column>
          <el-table-column label="Agency Project Appointment Management">
            <template slot-scope="scope">
              <el-button size="mini" @click="EditMediationFn(scope.row.appointmentId)">To Manage</el-button>
            </template>
          </el-table-column>
          <el-table-column label="Edit">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleEdit(scope.row)">Edit</el-button>
              <el-button size="mini" @click="handleDelete(scope.row.appointmentId)">Delete</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <compile-booking :activeItem="activeItem" @UpSucceed="queryAppointmentList" ref="compile" />
    <set-mediation :appointmentId="activeId" ref="SetMediation"></set-mediation>
  </div>
</template>

<script>
import CompileBooking from './model/CompileBooking'
import SetMediation from './model/SetMediation'
export default {
  components: { CompileBooking, SetMediation },
  data() {
    return {
      linkInfo: this.$route.query,
      tableData: [],
      activeItem: {},
      activeId: '',
    }
  },
  mounted() {
    this.queryAppointmentList()
  },
  methods: {
    queryAppointmentList() {
      this.$Posting(this.$api.queryAppointmentList, {
        projectId: this.linkInfo.id,
      }).then((res) => {
        if (res.code == 0) {
          this.tableData = res.datas
        }
      })
    },
    handleDelete(id) {
      this.$confirm(
        this.$t('alert.alert_delete'),
        this.$t('alert.alert_command'),
        {
          confirmButtonText: this.$t('alert.sure'),
          cancelButtonText: this.$t('alert.cancel'),
          type: 'warning',
        }
      )
        .then(() => {
          this.$Post(this.$api.deleteAppointment, { appointmentId: id }).then(
            (res) => {
              if (res.code == 0) {
                this.$notify.success({
                  title: this.$t('alert.alert_success_title'),
                  message: this.$t('alert.alert_success_delete_title'),
                })
                this.queryAppointmentList()
              } else {
                this.$notify.error({
                  title: this.$t('alert.fail'),
                  message: res.msg,
                })
              }
            }
          )
        })
        .catch(() => {
          this.$notify.info({
            title: 'Message',
            message: 'Canceled',
          })
        })
    },
    addBooking() {
      this.activeItem = {
        appointmentId: '',
        endTime: '',
        maxGroup: '',
        maxNum: '',
        projectId: '',
        startTime: '',
        time: '',
      }
      this.$refs.compile.dialogVisible = true
    },
    goBack() {
      this.$router.replace('/inventory/inventoryList')
    },
    handleEdit(row) {
      this.$refs.compile.dialogVisible = true
      this.activeItem = row
    },
    EditMediationFn(id) {
      this.activeId = id
      this.$refs.SetMediation.dialogVisible = true
    },
  },
}
</script>

<style lang="less">
.AppointmentBooking {
  height: 100%;

  .AppointmentBooking_head {
    .project_title {
      padding: 15px 30px;

      background-color: #fff;
      .project_name {
        font-weight: 200;
        font-size: 16px;
      }
      .addBooking {
        float: right;
      }
    }
    margin-bottom: 15px;
  }

  .AppointmentBooking_content {
    height: calc(100% - 80px);
    .table_div {
      height: 100%;
      .cell {
        word-break: break-word;
      }
    }
  }
}
</style>