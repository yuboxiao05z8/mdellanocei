<template>
  <div class="Agent sonBox">
    <div class="case">
      <el-form ref="form" :model="AgentForm" label-width="150px">
        <div class="lfLable">Main Agent Details</div>
        <div class="fromDiv">
          <el-form-item label="Appointed Agency">
            <el-select
              size="mini"
              class="input_300px"
              @change="selectAgenBroke"
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
          <el-row>
            <el-col :span="12"
              ><el-form-item label="CEA License No.">
                <el-input
                  @change="getAgenFn"
                  v-model="AgentForm.regNum"
                  size="mini"
                  class="input_300px"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12"
              ><el-form-item label="Agent Name">
                <el-input
                  disabled
                  class="input_300px"
                  size="mini"
                  v-model="AgentForm.agentName"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="Tel No">
                <el-input
                  disabled
                  class="input_300px"
                  size="mini"
                  v-model="AgentForm.agentContact"
                ></el-input> </el-form-item
            ></el-col>
            <el-col :span="12"
              ><el-form-item label="Commission (%)">
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
            </el-col>
          </el-row>

          <el-form-item label="Remarks">
            <el-input
              style="width: 100%"
              v-model="AgentForm.comment"
              :autosize="{ minRows: 4, maxRows: 4 }"
              type="textarea"
            ></el-input>
          </el-form-item>
        </div>

        <div class="lfLable">Tagger</div>
        <div class="fromDiv">
    
          <el-form-item label="Appointed Agency">
            <el-select
              size="mini"
              class="input_300px"
              @change="selectTaggerBroke"
              v-model="AgentForm.taggerBuyBrokeId"
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
          <el-row>
            <el-col :span="12"
              ><el-form-item label="CEA License No.">
                <el-input
                  @change="getTaggerFn"
                  v-model="AgentForm.taggerRegNum"
                  size="mini"
                  class="input_300px"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12"
              ><el-form-item label="Agent Name">
                <el-input
                  disabled
                  class="input_300px"
                  size="mini"
                  v-model="AgentForm.taggerAgentName"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="Tel No">
                <el-input
                  disabled
                  class="input_300px"
                  size="mini"
                  v-model="AgentForm.taggerAgentContact"
                ></el-input> </el-form-item
            ></el-col>
            <el-col :span="12"
              ><el-form-item label="Commission (%)">
                <el-input-number
                  size="mini"
                  v-model="AgentForm.taggerCommission"
                  :disabled="
                    accountType == 3 && updaObj.purchaseStatus != 'AVAILABLE'
                  "
                  :min="0"
                  :max="100"
                ></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="Remarks">
            <el-input
              style="width: 100%"
              v-model="AgentForm.taggerComment"
              :autosize="{ minRows: 4, maxRows: 4 }"
              type="textarea"
            ></el-input>
          </el-form-item>
        </div>

        <div class="lfLable">Internal-CoBroke</div>
        <div class="fromDiv">
          <el-form-item label="Appointed Agency">
            <el-select
              size="mini"
              class="input_300px"
              @change="selectInternalBroke"
              v-model="AgentForm.internalBuyBrokeId"
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
          <el-row>
            <el-col :span="12"
              ><el-form-item label="CEA License No.">
                <el-input
                  @change="getInternalFn"
                  v-model="AgentForm.internalRegNum"
                  size="mini"
                  class="input_300px"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12"
              ><el-form-item label="Agent Name">
                <el-input
                  disabled
                  class="input_300px"
                  size="mini"
                  v-model="AgentForm.internalAgentName"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="Tel No">
                <el-input
                  disabled
                  class="input_300px"
                  size="mini"
                  v-model="AgentForm.internalAgentContact"
                ></el-input> </el-form-item
            ></el-col>
            <el-col :span="12"
              ><el-form-item label="Commission (%)">
                <el-input-number
                  size="mini"
                  v-model="AgentForm.internalCommission"
                  :disabled="
                    accountType == 3 && updaObj.purchaseStatus != 'AVAILABLE'
                  "
                  :min="0"
                  :max="100"
                ></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="Remarks">
            <el-input
              style="width: 100%"
              v-model="AgentForm.internalComment"
              :autosize="{ minRows: 4, maxRows: 4 }"
              type="textarea"
            ></el-input>
          </el-form-item>
        </div>

        <div class="lfLable">Referral</div>
        <div class="fromDiv">
          <el-row>
            <el-col :span="8">
              <el-form-item label="Agency Name">
                <el-input
                  class="input_300px"
                  size="mini"
                  v-model="AgentForm.referralAgency"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Agent Name">
                <el-input
                  class="input_300px"
                  size="mini"
                  v-model="AgentForm.referralName"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Mobile">
                <el-input
                  class="input_300px"
                  size="mini"
                  v-model="AgentForm.referralMobile"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="Remarks">
            <el-input
              style="width: 100%"
              v-model="AgentForm.referralRemark"
              :autosize="{ minRows: 4, maxRows: 4 }"
              type="textarea"
            ></el-input>
          </el-form-item>
        </div>
      </el-form>
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
        referralMobile: '',
        referralAgency: '',
        taggerRegNum: '',
        taggerBuyBrokeId: '',
        taggerComment: '',
        taggerCommission: '',
        internalRegNum: '',
        internalBuyBrokeId: '',
        internalComment: '',
        internalCommission: '',
        taggerAgentName: '',
        taggerAgentContact: '',
        internalAgentName: '',
        internalAgentContact: '',
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
      console.log('333', this.AgentForm)
      if (!this.AgentForm.buyBrokeId) {
        this.AgentForm.buyBrokeId = this.brokeId
      }
      if (!this.AgentForm.taggerBuyBrokeId) {
        this.AgentForm.taggerBuyBrokeId = this.brokeId
      }
      if (!this.AgentForm.internalBuyBrokeId) {
        this.AgentForm.internalBuyBrokeId = this.brokeId
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
    selectAgenBroke() {
      if(this.AgentForm.regNum) {
        this.AgentForm.regNum = ''
      }
      
      // this.AgentForm.agentName = ''
      // this.AgentForm.agentContact = ''
      console.log('selectAgenBroke')
    },
    selectTaggerBroke() {
      if(this.AgentForm.taggerRegNum) {
        this.AgentForm.taggerRegNum = ''
      }
      
      // this.AgentForm.taggerAgentName = ''
      // this.AgentForm.taggerAgentContact = ''
      console.log('selectTaggerBroke')
    },
    selectInternalBroke() {
      if(this.AgentForm.internalRegNum) {
        this.AgentForm.internalRegNum = ''
      }
      // this.AgentForm.internalAgentId = ''
      // this.AgentForm.internalAgentName = ''
      // this.AgentForm.internalAgentContact = ''
      console.log('selectInternalBroke')
    },
    async getAgenFn(val) {
      let obj = await this.getAgenData(val, this.AgentForm.buyBrokeId)

      if (!obj) {
        this.AgentForm.agentName = ''
        this.AgentForm.agentContact = ''
      } else {
        this.AgentForm.agentName = obj.agentName
        this.AgentForm.agentContact = obj.mobile
      }
    },
    async getTaggerFn(val) {
      let obj = await this.getAgenData(val, this.AgentForm.taggerBuyBrokeId)

      if (!obj) {
        this.AgentForm.taggerAgentName = ''
        this.AgentForm.taggerAgentContact = ''
      } else {
        this.AgentForm.taggerAgentName = obj.agentName
        this.AgentForm.taggerAgentContact = obj.mobile
      }
      console.log('getTaggerFn', val)
    },
    async getInternalFn(val) {
      let obj = await this.getAgenData(val, this.AgentForm.internalBuyBrokeId)

      if (!obj) {
        this.AgentForm.internalAgentName = ''
        this.AgentForm.internalAgentContact = ''
      } else {
        this.AgentForm.internalAgentName = obj.agentName
        this.AgentForm.internalAgentContact = obj.mobile
      }
      console.log('getInternalFn', val)
    },
    async getAgenData(regNum, buyBrokeId) {
      if (buyBrokeId) {
        let data = {
          buyBrokeId: buyBrokeId,
          regNum: regNum,
        }
        let obj = await this.$Post(this.$api.queryAgentByRegNum, data)
        if (obj.datas) {
          return obj.datas
        } else {
          this.$notify.error({
            title: 'Error',
            message: 'CEA License No.  not found, please re-enter',
          })
          return false
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
      } else if (!this.AgentForm.agentName) {
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
  .input_300px {
    .el-input__inner {
      width: 300px;
    }
  }
}
</style>