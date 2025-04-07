<template>
  <div class="Summary sonBox">
    <div class="fromDiv">
      <el-form :model="SummaryForm" label-width="200px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Selling Price Adjustment">
              <el-input
                disabled
                class="input_80"
                size="mini"
                v-model="SummaryForm.adjustmentAmount"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Booking Fee Required">
              <el-input
                disabled
                class="input_80"
                size="mini"
                v-model="SummaryForm.earnest"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Option Price">
              <el-input
                disabled
                class="input_80"
                size="mini"
                v-model="SummaryForm.transactionPrice"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Booking Fee Received">
              <el-input
                disabled
                class="input_80"
                size="mini"
                v-model="SummaryForm.Received"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Excess Payment Received">
              <el-input
                disabled
                class="input_80"
                size="mini"
                v-model="SummaryForm.Excess"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div class="lfLable">Payment Details</div>
    <div class="fromDiv">
      <div class="addTab">
        <el-table
          class="tab_div_con"
          :data="SummaryForm.buyerPaymentList"
          style="width: 100%"
        >
          <el-table-column label="Payment Mode" prop="method"></el-table-column>
          <el-table-column label="Bank" prop="bankName"></el-table-column>
          <el-table-column label="Cheque No." prop="chequeNo"></el-table-column>
          <el-table-column label="Cheque Date">
            <template slot-scope="scope">
              <div>
                {{ $dateFormatNoTime(scope.row.chequeBankDate) }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="Amount" prop="amount"></el-table-column>
          <el-table-column label="Payment Reference">
            <template slot-scope="scope">
              <div class="tab_Img" v-if="scope.row.payerImg">
                <img
                  @click.stop="$imgPreview(hostUrl + scope.row.payerImg)"
                  :src="hostUrl + scope.row.payerImg"
                  alt=""
                />
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <div class="lfLable">Purchaser Datail</div>
    <div class="fromDiv">
      <div class="addTab">
        <el-table
          class="tab_div_con"
          :data="SummaryForm.buyerList"
          style="width: 100%"
        >
          <el-table-column label="Name" prop="buyerName"></el-table-column>
          <el-table-column label="Customer Type" prop="customerType">
            <template slot-scope="scope">
              <span v-if="scope.row.customerType == 0">Individual</span>
              <span v-if="scope.row.customerType == 1">Corporate</span>
            </template>
          </el-table-column>
          <el-table-column
            label="Nationality"
            prop="nationality"
          ></el-table-column>
          <el-table-column label="ID No." prop="nricPassport"></el-table-column>
          <el-table-column label="Email" prop="buyerEmail"></el-table-column>
          <el-table-column label="Mobile" prop="buyerMobile"></el-table-column>
          <el-table-column label="ID/Passport Photo" width="200">
            <template slot-scope="scope">
              <div class="tab_Img" v-if="scope.row.nricPassportImg">
                <img
                  v-for="(item, index) in scope.row.nricPassportImg.split(',')"
                  :key="index"
                  @click.stop="$imgPreview(hostUrl + item)"
                  :src="hostUrl + item"
                  alt=""
                />
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <div class="lfLable" style="width: 250px">Correspondent Address</div>
    <div class="fromDiv">
      <el-form :model="SummaryForm" label-width="150px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Country">
              <el-input
                disabled
                class="input_80"
                size="mini"
                v-model="SummaryForm.country"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Postal Code">
              <el-input
                disabled
                class="input_80"
                size="mini"
                v-model="SummaryForm.postalCode"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Block">
              <el-input
                disabled
                class="input_80"
                size="mini"
                v-model="SummaryForm.block"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="# Unit">
              <el-input
                disabled
                class="input_80"
                size="mini"
                v-model="SummaryForm.unitNo"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Street Name">
              <el-input
                disabled
                class="input_80"
                size="mini"
                v-model="SummaryForm.streetName"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    
      <div class="lfLable" v-if="SummaryForm.facilityList!== undefined&&SummaryForm.facilityList.length>0">Optional Add-on</div>
      <div class="fromDiv" v-if="SummaryForm.facilityList!== undefined&&SummaryForm.facilityList.length>0">
        <div class="facility-box" v-for="(facilityItem, facilityIndex) in SummaryForm.facilityList" :key="facilityIndex">
          <span class='facility-title'>{{facilityItem.name}}</span>
          <el-input
            disabled
            size="mini"
            v-model="facilityItem.value1"
          ></el-input>
        </div>
      </div>
  </div>
</template>

<script>
export default {
  props: {
    SummaryData: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      SummaryForm: {},
      tableData: [],
      hostUrl: sessionStorage.getItem('serveUrl'),
    }
  },
  mounted(){
    
  },
  activated() {
    let arr = [].concat(...this.SummaryData)
    this.SummaryForm = Object.assign({}, ...arr)
    console.log(this.SummaryForm)
    // console.log('编辑',this.SummaryForm)
  },
}
</script>

<style lang="less">
.Summary {
  .addTab {
    padding: 20px;
    .tab_div_con {
      border: 1px solid #ddd;
    }
    .tab_Img {
      img {
        width: 80px;
        height: 60px;
        background: #ddd;
        border-radius: 5px;
        object-fit: contain;
        margin: 0 5px;
      }
    }
  }
}
</style>

<style lang="less" scoped>
  .fromDiv{
    /deep/.facility-box{
      display: flex;
      margin-bottom: 10px;
      .facility-title{
        width: 150px;
        text-align: right;
        padding-right: 12px;
        line-height: 28px;font-size: 14px;color: #606266;font-weight: 700;
      }
      .el-input{
        width: 370px;
      }
    }
  }
</style>