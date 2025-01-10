<template>
  <div class="apponint_setting_vue">
    <div class="setting_content">
      <el-row :gutter="10">
        <el-col :span="6">
          <h4>Export booking form:</h4>
        </el-col>
        <el-col :span="18">
          <el-button size="mini" @click="exportExcel">Export Excel</el-button>
        </el-col>
      </el-row>
    </div>

    <div class="setting_content">
      <el-row :gutter="10">
        <el-col :span="6">
          <h4>Form Control:</h4>
        </el-col>
        <el-col :span="12">
          <div class="checkbox-group">
            <el-checkbox v-model="nameRequired" label="Name"></el-checkbox>
            <el-checkbox v-model="cardRequired" label="NRIC/ID"></el-checkbox>
            <el-checkbox v-model="mobileRequired" label="Mobile"></el-checkbox>
          </div>
        </el-col>
        <el-col :span="6">
          <el-button size="mini" @click="setCheckboxUpdate">Update</el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      nameRequired: false,
      cardRequired: false,
      mobileRequired: false,
    }
  },
  mounted() {
    this.queryAppointmentSet()
  },
  methods: {
    queryAppointmentSet() {
      this.$Post(this.$api.queryAppointmentSet, {
        projectId: this.$route.query.id,
      }).then((res) => {
        if (res.code == 0) {
          if (res.datas) {
            this.nameRequired = !!res.datas.nameRequired
            this.cardRequired = !!res.datas.cardRequired
            this.mobileRequired = !!res.datas.mobileRequired
          }
        }
      })
    },
    setCheckboxUpdate() {
      let data = {
        nameRequired: Number(this.nameRequired),
        cardRequired: Number(this.cardRequired),
        mobileRequired: Number(this.mobileRequired),
        projectId: this.$route.query.id,
      }
      this.$Posting(this.$api.saveAppointmentSet, data).then((res) => {
        if (res.code == 0) {
          this.$notify({
            title: 'Success',
            message: 'SET OK!',
            type: 'success',
          })
          this.queryAppointmentSet()
        } else {
          this.$notify.error({
            title: 'Error',
            message: res.msg,
          })
        }
      })
    },
    async exportExcel() {
      window.location.href = await this.$addDownUrl(this.$api.exportAppointment, {
        projectId: this.$route.query.id,
      })
    },
  },
}
</script>


<style lang="less">
.apponint_setting_vue {
  .setting_content {
    h4,
    .checkbox-group {
      height: 28px;
      line-height: 28px;
    }
    border: 1px solid #f4f4f4;
    padding: 15px;
    margin-bottom: 15px;
  }
}
</style>