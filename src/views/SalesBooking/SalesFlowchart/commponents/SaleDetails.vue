<template>
  <div class="SaleDetails sonBox">
    <div class="case">
      <div class="lfLable">Sale Details</div>
      <div class="fromDiv" v-if="show">
        <el-form ref="form" label-width="150px">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="List Price">
                <el-input
                  class="input_80"
                  size="mini"
                  disabled
                  v-model="updaObj.price"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Design Type">
                <el-input
                  class="input_80"
                  size="mini"
                  disabled
                  v-model="updaObj.floorPlan"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="List Price(PSM)">
                <el-input
                  class="input_80"
                  size="mini"
                  disabled
                  v-model="updaObj.sqm_price"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Area(SQM)">
                <el-input
                  class="input_80"
                  size="mini"
                  disabled
                  v-model="updaObj.sqm_area"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="List Price(PSF)">
                <el-input
                  class="input_80"
                  size="mini"
                  disabled
                  v-model="updaObj.sqf_price"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Area(SQF)">
                <el-input
                  size="mini"
                  class="input_80"
                  disabled
                  v-model="updaObj.sqf_area"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="Transacted Price" class="verifyFrom">
                <el-select
                  size="mini"
                  class="input_80"
                  v-model="SaleDetails.priceCode"
                >
                  <el-option
                    v-for="(item, index) in updaObj.priceList"
                    :key="index"
                    :label="`${item.key}: ${item.value}`"
                    :value="item.priceCode"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <div class="fromDiv">
        <el-form label-width="150px">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="System No.">
                <el-input
                  size="mini"
                  class="input_80"
                  disabled
                  v-model="updaObj.seqNo || defaultTxt"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Ballot Buyer">
                <el-checkbox
                  :disabled="
                    isAgentCompany == 3 && updaObj.purchaseStatus != 'AVAILABLE'
                  "
                  v-model="SaleDetails.interested"
                ></el-checkbox>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="Option Date" class="verifyFrom">
                <el-date-picker
                  size="mini"
                  type="date"
                  v-model="SaleDetails.transactionDate"
                  class="input_80"
                  value-format="yyyy-MM-dd"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Payment Scheme">
                <el-select
                  size="mini"
                  class="input_80"
                  v-model="SaleDetails.payment"
                >
                  <el-option
                    v-for="(item, index) in updaObj.paymentList || []"
                    :key="index"
                    :label="item.payName"
                    :value="item.payName"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="Adjustment Amount">
            <el-input-number
              :disabled="
                isAgentCompany == 3 && updaObj.purchaseStatus != 'AVAILABLE'
              "
              v-model="SaleDetails.adjustmentAmount"
            ></el-input-number>
          </el-form-item>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="Option Price">
                <el-input
                  disabled
                  size="mini"
                  class="input_80"
                  v-model="SaleDetails.transactionPrice"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
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
      show: false,
      SaleDetails: {
        priceCode: '',
        interested: '',
        transactionDate: '',
        payment: '',
        adjustmentAmount: '',
        transactionPrice: 0,
      },
      defaultTxt: 'New sale...booking in progress',
      isAgentCompany: JSON.parse(sessionStorage.getItem('userInfo')).type,
    }
  },
  watch: {
    updaObj(val) {
      if (val) {
        this.show = true
        let obj = JSON.parse(JSON.stringify(val))
        let takeArr = new Array()
        for (const key in JSON.parse(JSON.stringify(this.SaleDetails))) {
          takeArr.push(key)
        }

        this.SaleDetails = pick(obj, takeArr)
        // console.log('111',this.SaleDetails, val)
        this.SaleDetails.interested = Boolean(this.SaleDetails.interested)

        if (!this.SaleDetails.priceCode && val.priceList.length) {
          this.SaleDetails.priceCode = val.priceList[0].priceCode
        }
      }
    },
    'SaleDetails.adjustmentAmount'(val) {
      if (this.SaleDetails.priceCode) {
        this.selectPrice(this.SaleDetails.priceCode)
      }
    },
    'SaleDetails.priceCode'(val) {
      if (val) {
        this.selectPrice(val)
      }
    },
  },
  methods: {
    selectPrice(val) {
      let item = this.updaObj.priceList.find((item) => {
        return item.priceCode == val
      })

      this.SaleDetails.transactionPrice = parseFloat(getPrice(item.value))

      if (this.SaleDetails.adjustmentAmount) {
        this.SaleDetails.transactionPrice =
          this.SaleDetails.transactionPrice +
          parseFloat(this.SaleDetails.adjustmentAmount)
      }
    },
    isNextFn() {
      if (!this.SaleDetails.priceCode || !this.SaleDetails.transactionDate) {
        this.$notify.error({
          title: 'Error',
          message: 'Transacted Price and Option Date Can not be empty!',
        })
        return false
      } else {
        return { obj: this.SaleDetails, index: 0 }
      }
    },
  },
}
</script>

<style lang="less">
.fromDiv {
}
</style>