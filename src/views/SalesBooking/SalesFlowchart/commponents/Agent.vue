<template>
  <div class="Agent sonBox">
    <div class="case">
      <div class="lfLable">Agent Details</div>
      <div class="fromDiv">
        <el-form ref="form" :model="AgentForm" label-width="150px">
          <el-form-item label="Appointed Agency">
            <el-select
              size="mini"
              class="input_300px"
              @change="selectBroke"
              v-model="AgentForm.buyBrokeId"
              :disabled="accountType == 3"
            >
              <el-option
                v-for="(item, index) in updaObj.projectBrokeList"
                :key="index"
                :label="item.brokeName"
                :value="item.brokeId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="CEA License No.">
            <el-input
              @change="getAgenData"
              v-model="AgentForm.regNum"
              size="mini"
              class="input_300px"
            ></el-input>
          </el-form-item>
          <el-form-item label="Agent Name">
            <el-input
              disabled
              class="input_300px"
              size="mini"
              v-model="AgentForm.agentName"
            ></el-input>
          </el-form-item>
          <el-form-item label="Tel No">
            <el-input
              disabled
              class="input_300px"
              size="mini"
              v-model="AgentForm.agentContact"
            ></el-input>
          </el-form-item>
          <el-form-item label="Commission (%)">
            <el-input-number
              size="mini"
              v-model="AgentForm.commission"
              :disabled="
                accountType == 3 && updaObj.purchaseStatus != 'AVAILABLE'
              "
              :min="0"
              :max="100"
            ></el-input-number>
          </el-form-item>

          <el-form-item label="Remarks">
            <el-input
              style="width: 100%"
              v-model="AgentForm.comment"
              :autosize="{ minRows: 4, maxRows: 4 }"
              type="textarea"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>

      <div class="lfLable">Referral</div>
      <div class="fromDiv">
        <el-form ref="form" :model="AgentForm" label-width="150px">
          <el-form-item label="Referral Name">
            <el-input
              class="input_300px"
              size="mini"
              v-model="AgentForm.referralName"
            ></el-input>
          </el-form-item>

          <el-form-item label="Remarks">
            <el-input
              style="width: 100%"
              v-model="AgentForm.referralRemark"
              :autosize="{ minRows: 4, maxRows: 4 }"
              type="textarea"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { pick, getPrice } from '@/utils/validate'
export default {
  props: {
    updaObj: {
      type: Object,
    },
  },
  data() {
    return {
      AgentForm: {
        buyBrokeId: '',
        regNum: '',
        agentName: '',
        agentContact: '',
        commission: '',
        comment: '',
        referralName: '',
        referralRemark: '',
      },
      accountType: JSON.parse(sessionStorage.getItem('userInfo')).type,
      brokeId: JSON.parse(sessionStorage.getItem('userInfo')).brokeId,
    }
  },
  mounted() {
    this.getBroke()
    if (this.updaObj) {
      let obj = JSON.parse(JSON.stringify(this.updaObj))
      let takeArr = new Array()
      for (const key in JSON.parse(JSON.stringify(this.AgentForm))) {
        takeArr.push(key)
      }
      let beforeObj = pick(obj, takeArr)
      this.AgentForm = beforeObj
      if (!this.AgentForm.buyBrokeId) {
        this.AgentForm.buyBrokeId = this.brokeId
      }
    }
  },
  methods: {
    getBroke() {
      this.$Post(this.$api.queryBrokeByProjectId, {
        projectId: this.$route.query.projectId,
      }).then((res) => {
        if (res.code == 0) {
          this.brokeData = res.datas
        }
      })
    },
    selectBroke(val) {
      this.AgentForm.regNum = ''
    },
    async getAgenData(val) {
      if (this.AgentForm.buyBrokeId) {
        let data = {
          buyBrokeId: this.AgentForm.buyBrokeId,
          regNum: val,
        }
        let obj = await this.$Post(this.$api.queryAgentByRegNum, data)
        if (obj.datas) {
          this.AgentForm.agentName = obj.datas.agentName
          this.AgentForm.agentContact = obj.datas.mobile
        } else {
          this.AgentForm.agentName = ''
          this.AgentForm.agentContact = ''
          this.$notify.error({
            title: 'Error',
            message: 'CEA License No.  not found, please re-enter',
          })
        }
      }
    },
    isNextFn() {
      if (!this.AgentForm.buyBrokeId || !this.AgentForm.regNum) {
        this.$notify.error({
          title: 'Error',
          message: 'Appointed Agency and CEA License No. cannot be empty',
        })
        return false
      } else if(!this.AgentForm.agentName) {
        this.$notify.error({
          title: 'Error',
          message: 'CEA License No.  not found, please re-enter',
        })
        return false
      } else {
        return { obj: this.AgentForm, index: 3 }
      }
    },
  },
}
</script>

<style lang="less">
.Agent {
}
</style>