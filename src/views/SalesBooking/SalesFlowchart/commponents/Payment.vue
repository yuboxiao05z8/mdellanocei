<template>
  <div class="Payment sonBox">
    <div class="case">
      <div class="lfLable">Payment Details</div>
      <div class="fromDiv">
        <div class="addTab">
          <el-table
            class="tab_div_con"
            :data="Payment.buyerPaymentList"
            style="width: 100%"
          >
            <el-table-column
              label="Payment Mode"
              prop="method"
            ></el-table-column>
            <el-table-column label="Bank" prop="bankName"></el-table-column>
            <el-table-column
              label="Cheque No."
              prop="chequeNo"
            ></el-table-column>
            <el-table-column label="Cheque Date">
              <template slot-scope="scope">
                <div>{{ $dateFormatNoTime(scope.row.chequeBankDate) }}</div>
              </template>
            </el-table-column>
            <el-table-column label="Amount" prop="amount"></el-table-column>
            <el-table-column label="Payment Reference">
              <template slot-scope="scope">
                <div class="pryerImg" v-if="scope.row.payerImg">
                  <img @click.stop="$imgPreview(hostUrl + scope.row.payerImg)" :src="hostUrl+scope.row.payerImg" alt="">
                </div>
              </template>
            </el-table-column>
            <el-table-column label="Action">
              <template slot="header" slot-scope="scope">
                <el-button
                  size="mini"
                  icon="el-icon-plus"
                  @click="addShow = true"
                  >ADD</el-button
                >
              </template>
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  @click="editFn(scope.$index, scope.row)"
                  >EDIT</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row)"
                  >DELETE</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="conclusion">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form label-width="150px">
              <el-form-item label="Payment Remarks">
                <el-input
                  v-model="Payment.otherRemarks"
                  style="width: 100%"
                  :autosize="{ minRows: 6, maxRows: 6 }"
                  type="textarea"
                ></el-input>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="12">
            <div class="conclusionText">
              <div class="line">
                <span class="lf">
                  (Booking Fee：
                  <span>{{ reserveObj.earnest }}</span
                  >)
                </span>
                <span class="rt"></span>
              </div>
              <div class="line">
                <span class="lf">Booking Fee Required</span>
                <span class="rt">{{ reserveObj.earnest }}</span>
              </div>

              <div class="line">
                <span class="lf">Booking Fee Received</span>
                <span class="rt">{{ reserveObj.Received }}</span>
              </div>
              <div class="line">
                <span class="lf">Difference</span>
                <span class="rt Difference">{{ reserveObj.Difference }}</span>
              </div>
              <div class="line">
                <span class="lf">Excess Payment Raceived</span>
                <span class="rt Excess">{{ reserveObj.Excess }}</span>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>

    <el-dialog
      center
      title="Payment Details"
      :visible.sync="addShow"
      width="40%"
      @closed="form = {amount: roundNum(variate * 0.05)}; payerImg = []"
    >
      <div>
        <el-form
          :model="form"
          :rules="rules"
          ref="PaymentForm"
          label-width="200px"
        >
          <el-form-item label="Payment Mode" prop="method">
            <el-select
              style="width: 100%"
              v-model="form.method"
              @change="getMethodType"
            >
              <el-option label="Cheque" value="Cheque"></el-option>
              <el-option label="Cash" value="Cash"></el-option>
              <el-option
                label="Cashier Order"
                value="Cashier Order"
              ></el-option>
              <el-option
                label="Bank Transfer"
                value="Bank Transfer"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Bank" prop="bankName">
            <el-select style="width: 100%" v-model="form.bankName">
              <el-option
                v-for="(item, index) in bankData"
                :key="index"
                :label="item.bankName"
                :value="item.bankName"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item
            v-if="form.method == 'Cheque'"
            label="Cheque Book A/C No."
            prop="chequeBookNum"
          >
            <el-input
              style="width: 100%"
              v-model="form.chequeBookNum"
            ></el-input>
          </el-form-item> -->
          <el-form-item
            v-if="form.method !== 'Cash'"
            label="Cheque No./Transfer Ref."
            prop="chequeNo"
          >
            <el-input style="width: 100%" v-model="form.chequeNo"></el-input>
          </el-form-item>
          <el-form-item
            v-if="form.method == 'Cheque'"
            label="Cheque Date"
            prop="chequeBankDate"
          >
            <el-date-picker
              style="width: 100%"
              v-model="form.chequeBankDate"
              type="date"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="Amount" prop="amount">
            <el-input-number v-model="form.amount" :min="0"></el-input-number>
          </el-form-item>
          <el-form-item label="Payment Reference">
            <uploaderImg
              :backData="payerImg"
              :id="'payerImg'"
              :mixLength="1"
              :maxSize="2000"
              folder="transactionImg"
            ></uploaderImg>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addShow = false">Cancel</el-button>
        <el-button type="primary" @click="addDataFn">Ok</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import uploaderImg from '@/components/uploaderImg.vue'
import { pick, getPrice, setRulesData } from '@/utils/validate'
export default {
  components: {uploaderImg},
  props: {
    updaObj: {
      type: Object,
    },
    variate: {
      type: Number,
    },
  },
  data() {
    return {
      tableData: [],
      addShow: false,
      form: {
        method: '',
        bankName: '',
        chequeNo: '',
        chequeBookNum: '',
        chequeBankDate: '',
        amount: this.roundNum(this.variate * 0.05),
      },
      Payment: {
        buyerPaymentList: [],
        otherRemarks: '',
      },
      reserveObj: {
        earnest: this.roundNum(this.variate * 0.05),
        Received: 0,
        Difference: 0,
        Excess: 0,
      },
      bankData: [],
      editIndex: null,
      payerImg: [],
      hostUrl: sessionStorage.getItem('serveUrl')
    }
  },
  computed: {
    rules() {
      let blurArr = ['chequeBookNum', 'chequeNo', 'chequeBankDate', 'amount']
      let changeArr = ['method', 'bankName']
      return {
        ...setRulesData('blur', blurArr),
        ...setRulesData('change', changeArr),
      }
    },
  },
  watch: {
    variate(val) {
      if (val) {
        this.reserveObj.earnest = this.roundNum(val * 0.05)
      }
    },
  },
  mounted() {
    this.queryBankList()
    if (this.updaObj) {
      let obj = JSON.parse(JSON.stringify(this.updaObj))
      let takeArr = new Array()
      for (const key in JSON.parse(JSON.stringify(this.Payment))) {
        takeArr.push(key)
      }
      let beforeObj = pick(obj, takeArr)
      this.Payment = beforeObj
      if (beforeObj.buyerPaymentList && beforeObj.buyerPaymentList.length) {
        this.Payment.buyerPaymentList = beforeObj.buyerPaymentList
        this.calculateFn(this.Payment.buyerPaymentList)
      } else {
        this.Payment.buyerPaymentList = new Array()
      }
    }
  },
  methods: {
    getMethodType(type) {
      if (type == 'Cheque') {
        this.form.chequeBankDate = this.$dateFormatNoTime(new Date())
      } else {
        this.form.chequeNo = ''
        this.form.chequeBookNum = ''
        this.form.chequeBankDate = ''
      }
    },
    handleDelete(index, row) {
      this.Payment.buyerPaymentList.splice(index, 1)
      this.calculateFn(this.Payment.buyerPaymentList)
    },
    editFn(index, row) {
      this.editIndex = index
      this.addShow = true
      if (row.chequeBankDate) {
        row.chequeBankDate = this.$dateFormatNoTime(new Date())
      }
      if(row.payerImg) {
        this.payerImg = row.payerImg.split(',').map(i => {
          return {
            url: i,
            src: this.hostUrl + i
          }
        })
      }
      this.form = row
    },
    calculateFn(arr) {
      let totalPrice = 0,
        earnest = this.roundNum(this.reserveObj.earnest)
      this.reserveObj.Received = this.roundNum(
        arr.reduce(
          (totalPrice, item) => totalPrice + parseFloat(item.amount),
          0
        )
      )
      if (this.reserveObj.Received > earnest) {
        this.reserveObj.Excess = this.roundNum(
          this.reserveObj.Received - earnest
        )
        this.reserveObj.Difference = 0
      } else {
        this.reserveObj.Difference = this.roundNum(
          earnest - this.reserveObj.Received
        )
        this.reserveObj.Excess = 0
      }
    },
    addDataFn() {
      this.$refs['PaymentForm'].validate((valid) => {
        if (valid) {
          console.log(this.form)
          this.addShow = false
          

          if (this.payerImg.length) {
                this.form.payerImg = this.payerImg
                  .map((i) => {
                    return i.url
                  })
                  .join(',')
              }
          if (typeof this.editIndex == 'number') {
            this.Payment.buyerPaymentList[this.editIndex] = this.form
            this.editIndex = null
          } else {
            this.Payment.buyerPaymentList.push(this.form)
          }
          console.log(this.Payment.buyerPaymentList, this.form)
          this.calculateFn(this.Payment.buyerPaymentList)
          this.form = {
            amount: this.roundNum(this.variate * 0.05),
          }
        } else {
          return false
        }
      })
    },
    roundNum(num) {
      let NewNumber = Math.round(num * 1000) / 1000
      let retNum = this.returnFloat(Math.ceil(NewNumber * 100) / 100)
      return retNum
    },

    returnFloat(valueNum) {
      let value = Math.round(parseFloat(valueNum) * 100) / 100
      let s = value.toString().split('.')
      if (s.length == 1) {
        value = value.toString() + '.00'
        return value
      }
      if (s.length > 1) {
        if (s[1].length < 2) {
          value = value.toString() + '0'
        }
        return value
      }

      return value
    },

    queryBankList() {
      let data = {
        pageNo: 1,
        pageSize: 9999,
        projectId: this.$route.query.projectId || '',
      }
      this.$Post(this.$api.queryBankList, data).then((res) => {
        if (res.code == 0) {
          this.bankData = res.datas.lists
        }
      })
    },
    isNextFn() {
      let earnest = this.reserveObj.earnest,
        Received = this.reserveObj.Received
      if (earnest > Received) {
        this.$notify.error({
          title: 'Error',
          message: 'The deposit is insufficient, please pay your deposit',
        })
        return false
      } else {
        return { obj: { ...this.Payment, ...this.reserveObj }, index: 1 }
      }
    },
  },
}
</script>

<style lang="less">
.Payment {
  .addTab {
    padding: 20px;
    .tab_div_con {
      border: 1px solid #ddd;
    }
  }
  .pryerImg{
    img {
      width: 80px;
      margin: 0 5px;
      height: 50px;
      border-radius: 5px;
      object-fit: contain;
      background: #ddd;
    }
  }
  .conclusion {
    padding: 20px;
    .line {
      margin-bottom: 5px;
      &::before {
        content: '';
        display: inline-block;
        clear: both;
      }
      .lf {
        float: left;
        width: 60%;
        color: #666;
        text-align: right;
      }
      .rt {
        float: left;
        padding-left: 15px;
        width: 40%;
        color: #000;
        &.Difference {
          color: #ff6666;
        }
        &.Excess {
          color: green;
        }
      }
    }
  }
}
</style>