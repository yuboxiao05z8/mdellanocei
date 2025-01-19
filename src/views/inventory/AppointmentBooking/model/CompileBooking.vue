<template>
  <div class="CompileBooking">
    <el-dialog  
      center
      width="60%"
      title="Edit/Add"
      :visible.sync="dialogVisible"
    >
      <div v-if="dialogVisible">
        <el-form ref="form" :rules="rules" :model="form" label-width="200px">
          <el-form-item label="Appointment Time" prop="time">
            <el-time-select
              placeholder="start time"
              v-model="form.time"
              :picker-options="{
                start: '07:00',
                step: '00:15',
                end: '22: 45',
              }"
            >
            </el-time-select> To
            <el-time-select
              placeholder="end time"
              v-model="form.time2"
              :picker-options="{
                start: '07:15',
                step: '00:15',
                end: '23:00',
                minTime: form.time
              }"
            >
            </el-time-select>
          </el-form-item>
          <el-form-item label="Maximum Group/Hour" prop="maxGroup">
            <el-input
              type="Number"
              class="input_300px"
              v-model="form.maxGroup"
            ></el-input>
          </el-form-item>
          <el-form-item label="Maximum Pax/Group" prop="maxNum">
            <el-input
              type="Number"
              class="input_300px"
              v-model="form.maxNum"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="Appointable Date"
            class="pickerItem"
            prop="pickerTiem"
          >
            <el-date-picker
              class="input_80"
              v-model="form.pickerTiem"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="To"
              start-placeholder="start date"
              end-placeholder="end date"
              value-format="yyyy/MM/dd"
            ></el-date-picker>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="onUpdate">Update</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

export default {
  props: {
    activeItem: {
      type: Object,
    },
  },
  data() {
    return {
      dialogVisible: false,
      form: {},
      rules: {
        time: [
          {
            required: true,
            message: 'Please enter the form field',
            trigger: 'change',
          },
        ],
        time2: [
          {
            required: true,
            message: 'Please enter the form field',
            trigger: 'change',
          },
        ],
        maxGroup: [
          {
            required: true,
            message: 'Please enter the form field',
            trigger: 'blur',
          },
        ],
        maxNum: [
          {
            required: true,
            message: 'Please enter the form field',
            trigger: 'blur',
          },
        ],
        pickerTiem: [
          {
            required: true,
            message: 'Please enter the form field',
            trigger: 'change',
          },
        ],
      },
    }
  },
  watch: {
    activeItem(item) {
      let hour = parseInt(item.time.split(":")[0])
      let minute = item.time.split(":")[1]
      this.form = {
        pickerTiem: [item.startTime, item.endTime],
        time: item.time,
        time2:  item.time2 || '',
        maxGroup: item.maxGroup,
        maxNum: item.maxNum,
        appointmentId: item.appointmentId,
      }
    },
  },
  methods: {
    onUpdate() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let data = {
            startTime: this.form.pickerTiem[0],
            endTime: this.form.pickerTiem[1],
            time: this.form.time,
            time2: this.form.time2,
            maxGroup: this.form.maxGroup,
            maxNum: this.form.maxNum,
            projectId: this.$route.query.id,
            appointmentId: this.form.appointmentId || '',
          }
          // console.log('222',data)
          this.$Posting(this.$api.saveAppointment, data).then((res) => {
            if (res.code == 0) {
              this.$emit('UpSucceed')
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
        } else {
          return false
        }
      })
    },
  },
}
</script>

<style lang="less">
.CompileBooking {
  .pickerItem {
    .el-date-editor .el-range-separator {
      width: 50px;
    }
  }
}
</style>