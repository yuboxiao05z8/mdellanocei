<template>
  <div class="BuyresFrom_page">
    <el-dialog
      title="Add/Edit Buyer"
      :visible.sync="show"
      custom-class="BuyresFrom_dialog"
      width="70%"
      @closed="closedForm"
    >
      <div class="dialog_box">
        <div v-if="show">
          <el-form
            ref="form"
            :rules="rulesObj"
            :model="form"
            label-width="170px"
          >
            <h5 style="color: red" v-if="form.loa">LOA: {{ form.loa }}</h5>
            <div class="case">
              <p class="case_head">Basic Information</p>
              <div class="case_div">
                <el-row :gutter="20">
                  <el-col :span="12"
                    ><el-form-item label="Project Name">
                      <el-input
                        style="width: 200px"
                        size="mini"
                        disabled
                        v-model="form.projectName"
                      ></el-input> </el-form-item
                  ></el-col>
                  <el-col :span="12"
                    ><el-form-item label="Developer Name">
                      <el-input
                        style="width: 200px"
                        size="mini"
                        disabled
                        v-model="form.createUserName"
                      ></el-input> </el-form-item
                  ></el-col>
                  <el-col :span="12"
                    ><el-form-item label="Ballot Number" prop="ballotNo">
                      <el-input
                        @change="findBallotNo"
                        style="width: 200px"
                        size="mini"
                        v-model="form.ballotNo"
                      ></el-input> </el-form-item
                  ></el-col>
                  <el-col :span="12"
                    ><el-form-item label="Time created">
                      <el-date-picker
                        disabled
                        size="mini"
                        type="date"
                        v-model="form.createTime"
                        style="width: 200px"
                      ></el-date-picker> </el-form-item
                  ></el-col>
                </el-row>
              </div>
            </div>
            <div class="case">
              <p class="case_head">Sales Agent/Person Information</p>
              <div class="case_div">
                <div style="padding-left: 100px; margin-bottom: 15px">
                  <el-input
                    style="width: 300px"
                    size="mini"
                    v-model="regNum"
                    placeholder="CEA # Or Email to find it"
                  ></el-input>
                  <el-button
                    style="margin-left: 15px"
                    @click="getAgenData"
                    size="mini"
                    >Find</el-button
                  >
                </div>
                <el-row :gutter="20">
                  <el-col :span="12"
                    ><el-form-item label="CEA #" prop="regNum">
                      <el-input
                        style="width: 200px"
                        size="mini"
                        disabled
                        v-model="form.regNum"
                      ></el-input> </el-form-item
                  ></el-col>
                  <el-col :span="12"
                    ><el-form-item label="Email" prop="agentEmail">
                      <el-input
                        style="width: 200px"
                        size="mini"
                        disabled
                        v-model="form.agentEmail"
                      ></el-input> </el-form-item
                  ></el-col>
                  <el-col :span="12"
                    ><el-form-item label="Company Name" prop="brokeName">
                      <el-input
                        style="width: 200px"
                        size="mini"
                        v-model="form.brokeName"
                        disabled
                      ></el-input> </el-form-item
                  ></el-col>
                  <el-col :span="12"
                    ><el-form-item label="Agency Name" prop="agentName">
                      <el-input
                        style="width: 200px"
                        size="mini"
                        disabled
                        v-model="form.agentName"
                      ></el-input> </el-form-item
                  ></el-col>
                </el-row>
              </div>
            </div>
            <div class="case">
              <p class="case_head">Payment mode</p>
              <div class="case_div">
                <el-row :gutter="20">
                  <el-col :span="12"
                    ><el-form-item label="Payment Method" prop="buyMethod">
                      <el-select
                        style="width: 200px"
                        size="mini"
                        v-model="form.buyMethod"
                        @change="getMethodType"
                      >
                        <el-option
                          v-for="(item, index) in MethodList"
                          :key="index"
                          :label="item"
                          :value="item"
                        ></el-option>
                      </el-select> </el-form-item
                  ></el-col>
                  <el-col :span="12"
                    ><el-form-item label="Bank" prop="bankName">
                      <el-select
                        size="mini"
                        style="width: 200px"
                        v-model="form.bankName"
                      >
                        <el-option
                          v-for="(item, index) in bankData"
                          :key="index"
                          :label="item.bankName"
                          :value="item.bankName"
                        ></el-option>
                      </el-select> </el-form-item
                  ></el-col>
                  <el-col :span="12" v-if="form.buyMethod == 'Cheque'"
                    ><el-form-item label="Cheque No." prop="chequeNum">
                      <el-input
                        style="width: 200px"
                        @change="findChequeNum"
                        size="mini"
                        v-model="form.chequeNum"
                      ></el-input> </el-form-item
                  ></el-col>
                  <el-col :span="12" v-if="form.buyMethod == 'Cheque'"
                    ><el-form-item
                      label="Cheque Book A/C No."
                      prop="chequeBookNum"
                    >
                      <el-input
                        style="width: 200px"
                        @change="findChequeBookNum"
                        size="mini"
                        v-model="form.chequeBookNum"
                      ></el-input> </el-form-item
                  ></el-col>
                  <el-col :span="12" v-if="form.buyMethod == 'Cheque'"
                    ><el-form-item label="Cheque Date" prop="chequeBankDate">
                      <el-date-picker
                        size="mini"
                        type="date"
                        v-model="form.chequeBankDate"
                        style="width: 200px"
                        value-format="timestamp"
                      ></el-date-picker> </el-form-item
                  ></el-col>
                </el-row>
              </div>
            </div>
            <div class="case">
              <p class="case_head">Registration/Expression of Interest</p>
              <div class="case_div">
                <buyer-list ref="buyer_list" :list="buyerList" />
              </div>
            </div>
            <div class="case">
              <p class="case_head">Choice unit</p>
              <div class="case_div">
                <unit-list ref="unit_list" :list="unitList" />
              </div>
            </div>
          </el-form>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="show = false">Cancel</el-button>
        <el-button type="primary" @click="addDataFn">Save</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import BuyerList from './buyerList'
import UnitList from './unitList'
import { setRulesData } from '@/utils/validate'
export default {
  components: { BuyerList, UnitList },
  props: {
    interestId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      show: false,
      form: {},
      buyerList: [],
      unitList: [],
      bankData: [],
      MethodList: ['Cheque', 'Cash', 'Cashier Order', 'Bank Transfer'],
      regNum: '',
    }
  },
  computed: {
    rulesObj() {
      return this.getRules()
    },
  },
  watch: {
    interestId(val) {
      if (val) {
        this.queryInterestDetail()
      }
    },
  },
  mounted() {
    this.queryBankList()
    this.getRules()
  },
  methods: {
    addDataFn() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (
            this.$refs.buyer_list.buyerList.length &&
            this.$refs.unit_list.unitList.length
          ) {
            let data = {
              interest: JSON.stringify({
                ...this.form,
                projectId: this.$route.query.id,
              }),
              buyers: JSON.stringify(this.$refs.buyer_list.buyerList),
              units: JSON.stringify(this.$refs.unit_list.unitList),
            }
            this.saveInterestDetail(data)
          } else {
            this.$notify.error({
              title: 'Error',
              message: 'Buyer/Unit details cannot be empty',
            })
          }
        } else {
          return false
        }
      })
    },
    saveInterestDetail(data) {
      this.$Posting(this.$api.saveInterestDetail, data).then((res) => {
        if (res.code == 0) {
          this.$notify({
            title: 'success',
            message: 'submit successfully',
            type: 'success',
          })
          this.$emit('AddSuccess')
          this.show = false
        } else {
          this.$notify.error({
            title: 'Error',
            message: res.msg,
          })
        }
      })
    },
    queryInterestDetail() {
      this.$Posting(this.$api.queryInterestDetail, {
        interestId: this.interestId,
      }).then((res) => {
        if (res.code == 0) {
          this.form = res.datas.interest
          this.buyerList = res.datas.buyers
          this.unitList = res.datas.units
        } else {
          this.$notify.error({
            title: 'Error',
            message: res.msg,
          })
        }
      })
    },
    closedForm() {
      this.form = {}
      this.buyerList = []
      this.unitList = []
      this.$emit('etidEnd')
    },
    async queryBankList() {
      let data = {
        pageNo: 1,
        pageSize: 9999,
        projectId: this.$route.query.id || '',
      }
      let res = await this.$Post(this.$api.queryBankList, data)
      if (res.code == 0) {
        this.bankData = res.datas.lists
      }
    },
    getMethodType() {
      if (this.form.chequeNum) this.form.chequeNum = ''
      if (this.form.chequeBookNum) this.form.chequeBookNum = ''
      if (this.form.chequeBankDate) this.form.chequeBankDate = ''
    },
    getRules() {
      let blurArr = [
        'ballotNo',
        'regNum',
        'agentEmail',
        'chequeNum',
        'chequeBookNum',
        'brokeName',
        'agentName',
      ]
      let ChangeArr = ['bankName', 'buyMethod', 'chequeBankDate']
      return {
        ...setRulesData('blur', blurArr),
        ...setRulesData('change', ChangeArr),
      }
    },
    getAgenData() {
      let userInfo = JSON.parse(sessionStorage.getItem('userInfo')) || {}

      let data = {
        buyBrokeId: userInfo.brokeId,
        regNum: this.regNum,
      }

      this.$Post(this.$api.queryAgentByRegNum, data).then((res) => {
        if (res.code == 0) {
          if (res.datas) {
            this.setAgentInfo(res.datas)
          } else {
            this.setAgentInfo()
          }
        } else {
          this.$notify.error({
            title: 'Error',
            message: res.msg,
          })
        }
      })
    },
    setAgentInfo(data) {
      if (data) {
        this.$set(this.form, 'agentEmail', data.email)
        this.$set(this.form, 'regNum', data.regNum)
        this.form.agentName = data.agentName
        this.form.brokeName = data.brokeName
        this.form.brokeId = data.brokeId
        this.form.agentId = data.agentId
      } else {
        this.$set(this.form, 'agentEmail', '')
        this.$set(this.form, 'regNum', '')
        this.form.agentName = ''
        this.form.brokeName = ''
        this.form.brokeId = ''
        this.form.agentId = ''

        this.$notify.error({
          title: 'Error',
          message: 'CEA #/Postal code cannot found',
        })
      }
    },
    async validateInterestInfo(parameters, text) {
      let data = {
        interestId: this.form.interestId || '',
        projectId: this.$route.query.id,
        ...parameters,
      }
      let res = await this.$Post(this.$api.validateInterestInfo, data)
      if (res.code == -1) {
        this.warningFn(`${text}- (${res.datas.join(' / ')})`)
      }
    },
    findChequeNum(val) {
      this.validateInterestInfo(
        { chequeNum: val },
        'Duplicate Alert - Cheque Number'
      )
    },
    findChequeBookNum(val) {
      this.validateInterestInfo(
        { chequeBookNum: val },
        'Duplicate Alert - Cheque Book Number'
      )
    },
    findBallotNo(val) {
      this.validateInterestInfo(
        { ballotNo: val },
        'Duplicate Alert - Ballot Number'
      )
    },
    warningFn(text) {
      this.$notify({
        title: 'Warning',
        message: text,
        duration: 0,
        type: 'warning',
      })
    },
  },
}
</script>

<style lang="less">
.BuyresFrom_page {
  .BuyresFrom_dialog {
    .el-dialog__header,
    .dialog-footer {
      text-align: center;
    }
    .dialog_box {
      height: 550px;
      overflow-y: scroll;
      padding: 10px;
      .case {
        margin-top: 20px;
        .case_div {
          border: 1px solid #ddd;
          padding: 15px;
          .el-table th > .cell {
            text-align: center;
          }
          .el-table .cell {
            text-align: center;
          }
        }
        .case_head {
          margin-bottom: 15px;
        }
      }
    }
  }
}
</style>