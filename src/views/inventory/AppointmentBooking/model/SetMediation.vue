<template>
  <div class="SetMediation">
    <el-dialog
      center
      width="85%"
      title="Agency Project Appointment Management"
      :visible.sync="dialogVisible"
    >
      <div>
        <div>
          <el-row class="from_title">
            <el-col :span="3" v-for="(item, index) in weekData" :key="index">
              <div class="grid-content">{{item}}</div>
            </el-col>
          </el-row>
          <el-row class="from_content" v-for="(item, index) in agentList" :key="index">
            <el-col :span="3">
              <div class="grid-content">{{item.brokeName}}</div>
            </el-col>
            <el-col :span="3" v-for="(v, i) in 7" :key="i">
              <div class="grid-content">
                <el-input
                  v-model="agentList[index][`week${i+1}`]"
                  placeholder="Please enter content"
                ></el-input>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="onUpdate">Update</el-button>
      </div>
    </el-dialog>
  </div>
</template>


<script>
const weekObj = [
  'Agency',
  'Maximum Group/Hour (Mon)',
  'Maximum Group/Hour (Tues)',
  'Maximum Group/Hour (Wed)',
  'Maximum Group/Hour (Thur)',
  'Maximum Group/Hour (Fri)',
  'Maximum Group/Hour (Sat)',
  'Maximum Group/Hour (Sun)',
]
export default {
  props: {
    appointmentId: {
      type: String,
    },
  },
  data() {
    return {
      dialogVisible: false,
      weekData: weekObj,
      agentList: [],
    }
  },
  watch: {
    appointmentId(id) {
      this.queryAppointmentDetails(id)
    },
  },
  methods: {
    queryAppointmentDetails(id) {
      let data = {
        projectId: this.$route.query.id,
        appointmentId: id,
      }
      this.$Post(this.$api.queryAppointmentDetails, data).then((res) => {
        if (res.code == 0) {
          this.agentList = res.datas
        }
      })
    },
    onUpdate() {
      let data = {
        appointmentId: this.appointmentId,
        details: JSON.stringify(this.agentList),
        projectId: this.$route.query.id,
      }
      this.$Posting(this.$api.saveAppointmentDetails, data).then((res) => {
        if (res.code == 0) {
          this.dialogVisible = false
          this.$notify({
            title: 'Success',
            message: 'Submit Successfully!',
            type: 'success',
          })
        } else {
          this.$notify.error({
            title: 'Error',
            message: res.msg,
          })
        }
      })
    }
  }
}
</script>

<style lang="less">
.SetMediation {
  .from_title {
    .grid-content {
      text-align: center;
      border: 1px solid #ddd;
      padding: 5px 10px;
      box-sizing: border-box;
      height: 44px;
      border-left: 0;
      border-bottom: 0;
      word-break: break-word !important;
    }
    .el-col-3 {
      &:first-child {
        .grid-content {
          border-left: 1px solid #ddd;
        }
      }
    }
  }
  .from_content {
    .grid-content {
      width: 100%;
      line-height: 50px;
      padding: 0px 10px;
      box-sizing: border-box;
      border: 1px solid #ddd;
      border-bottom: 0;
      border-left: 0;
      text-align: center;
      word-break: break-word !important;
    }
    .el-col-3 {
      &:first-child {
        .grid-content {
          border-left: 1px solid #ddd;
        }
      }
    }
    &:last-child {
      .grid-content {
        border-bottom: 1px solid #ddd;
      }
    }
  }
}
</style>