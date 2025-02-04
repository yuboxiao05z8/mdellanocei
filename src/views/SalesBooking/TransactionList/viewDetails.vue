<template>
  <div class="viewDetails">
    <div class="head">
      <el-row :gutter="20">
        <el-col :span="3">
          <el-button
            size="mini"
            type="info"
            class="btn el-icon-back"
            style="margin-right: 30px"
            @click="goBack"
            >{{ $t('editMap.goBack') }}</el-button
          >
        </el-col>
        <el-col :span="18">
          <div style="line-height: 28px">
            <span>{{ query.Status }}：</span>
            <span>{{ query.projectName }} -</span>
            <span>{{ query.unitName }}</span>
            <span class="ballotNo" v-if="detailsObj.ballotNo"
              >Ballot No. {{ detailsObj.ballotNo }}</span
            >
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="viewDetails_content">
      <div class="sonBox">
        <div class="fromDiv">
          <div class="lfLable">Sale Details</div>
          <div class="tabBox">
            <row-tab :forArr="SaleObj"></row-tab>
          </div>
        </div>
        <div class="fromDiv">
          <div class="lfLable">Unit Details</div>
          <div class="tabBox">
            <row-tab :spanNum="12" :forArr="UnitObj"></row-tab>
          </div>
        </div>
        <div class="fromDiv">
          <div class="lfLable" style="width: 250px">
            Date & Miscellaneous Details
          </div>
          <div class="tabBox">
            <row-tab :spanNum="24" :forArr="DateObj"></row-tab>
          </div>
        </div>
        <div class="fromDiv">
          <div class="lfLable" style="width: 200px">Purchaser</div>
          <div class="AgentDiv_content" v-if="detailsObj.buyerList">
            <BuyersDiv :BuyObj="detailsObj.buyerList"></BuyersDiv>
          </div>
        </div>

        <div class="fromDiv">
          <div class="lfLable" style="width: 200px">Payment Received</div>
          <div class="AgentDiv_content" v-if="detailsObj.buyerPaymentList">
            <el-table
              border
              :data="detailsObj.buyerPaymentList"
              style="width: 100%"
            >
              <el-table-column
                prop="method"
                label="payment  Mode"
              ></el-table-column>
              <el-table-column prop="bankName" label="Bank"></el-table-column>
              <el-table-column
                prop="chequeNo"
                label="Cheque No."
              ></el-table-column>

              <el-table-column label="Cheque Date">
                <template slot-scope="scope">{{
                  $dateFormatNoTime(scope.row.chequeBankDate)
                }}</template>
              </el-table-column>
              <el-table-column prop="amount" label="Amount"></el-table-column>
              <el-table-column label="Payment Reference">
                <template slot-scope="scope">
                  <div class="payerImg_div" v-if="scope.row.payerImg">
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

        <div class="fromDiv">
          <div class="lfLable" style="width: 200px">Correspondent Address</div>
          <div class="AgentDiv_content" v-if="detailsObj.buyerList">
            <row-tab :forArr="mailingAddressObj"></row-tab>
          </div>
        </div>

        <div class="fromDiv">
          <div class="lfLable" style="width: 200px">Staff & Agent</div>
          <div class="AgentDiv_content" v-if="dynamicData.Agent">
            <div
              class="AgentDiv"
              :key="index"
              v-for="(item, index) in dynamicData.Agent"
              v-if="dynamicData.Agent"
            >
              <h1>{{ item.text }}</h1>
              <div>
                <row-tab
                  :key="index"
                  :spanNum="12"
                  :forArr="item.obj"
                ></row-tab>
              </div>
            </div>
          </div>
        </div>

        <div class="fromDiv">
          <div class="lfLable" style="width: 200px">
            Success Booking of Unit
          </div>

          <DocumentTemplate :documentObj="detailsObj" location="viewDetails" />
        </div>

        <div class="viewDetails_content_btn">
          <!-- <el-button type="primary" @click="getData('PDI')">PDI</el-button> -->
          <!-- <el-button type="primary" @click="getData('Payment')"
            >Payment Received</el-button
          >
          <el-button type="primary" @click="getData('Purchaser')"
            >Purchaser</el-button
          >
          <el-button type="primary" @click="getData('Agent')"
            >Staff & Agent</el-button
          > -->
          <el-button type="primary" @click="getData('Modify')"
            >Modify</el-button
          >
        </div>
      </div>
    </div>
    <el-dialog
      class="viewDetails_Popup"
      :title="dynamicData.title"
      :visible.sync="dialogVisible"
      width="60%"
    >
      <div>
        <div v-if="dynamicData.title == 'Payment Received'">
          <el-table
            border
            v-if="dynamicData.payment"
            :data="dynamicData.payment"
            style="width: 100%"
          >
            <el-table-column
              prop="method"
              label="payment  Mode"
            ></el-table-column>
            <el-table-column prop="bankName" label="Bank"></el-table-column>
            <el-table-column
              prop="chequeNo"
              label="Cheque No."
            ></el-table-column>

            <el-table-column label="Cheque Date">
              <template slot-scope="scope">{{
                $dateFormatNoTime(scope.row.chequeBankDate)
              }}</template>
            </el-table-column>
            <el-table-column prop="amount" label="Amount"></el-table-column>
          </el-table>
        </div>
        <div v-if="dynamicData.title == 'Purchaser'">
          <div class="AgentDiv">
            <div class="AgentDiv_content" v-if="dynamicData.Purchaser">
              <BuyersDiv :BuyObj="dynamicData.Purchaser"></BuyersDiv>
            </div>
          </div>
        </div>
        <div v-if="dynamicData.title == 'Staff & Agent'">
          <div
            class="AgentDiv"
            :key="index"
            v-for="(item, index) in dynamicData.Agent"
            v-if="dynamicData.Agent"
          >
            <h1>{{ item.text }}</h1>
            <div class="AgentDiv_content">
              <row-tab :key="index" :spanNum="12" :forArr="item.obj"></row-tab>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { pick, getPrice } from '@/utils/validate'
import RowTab from './commponents/RowTab'
import BuyersDiv from '../SalesFlowchart/commponents/module/BuyersDiv'
import DocumentTemplate from '../SalesFlowchart/commponents/Document'
export default {
  components: { RowTab, BuyersDiv, DocumentTemplate },
  data() {
    return {
      query: this.$route.query,
      detailsObj: {},
      SaleObj: [],
      DateObj: [],
      UnitObj: [],
      hostUrl: sessionStorage.getItem('serveUrl'),
      dynamicData: {},
      dialogVisible: false,
      recordId: '',
      mailingAddressObj: []
    }
  },
  mounted() {
    this.getTransaction()
  },
  methods: {
    goBack() {
      if (this.query.link == '/SalesBooking/ProjectSales/SalesChart') {
        this.$router.replace({
          path: this.query.link,
          query: { id: this.query.projectId },
        })
      } else {
        this.$router.replace({
          path: this.query.link,
        })
      }
    },
    getTransaction() {
      this.$Posting(this.$api.getTransaction, this.query).then((res) => {
        if (res.code == 0) {
          let obj = res.datas
          this.detailsObj = res.datas
          this.SaleObj = [
            {
              type: 'Block',
              value: obj.buyerBlock,
            },
            {
              type: 'Sales Status',
              value: this.query.Status,
            },
            {
              type: 'Unit No.',
              value: obj.buyerUnit,
            },
            {
              type: 'System No.',
              value: obj.seqNo,
            },
            {
              type: 'OTP No.',
              value: obj.otp,
            },
            {
              type: 'Interested Paty Transaction',
              value: obj.interested ? 'YES' : 'NO',
            },
            {
              type: 'Payment Scheme',
              value: obj.payment,
            },
          ]
          this.UnitObj = [
            {
              type: 'Design Type',
              value: obj.floorPlan,
            },
            {
              type: 'List Price',
              value: `$ ${getPrice(obj.price)}`,
            },
            {
              type: 'List Price(PSM)',
              value: `$ ${getPrice(obj.sqm_price)}`,
            },
            {
              type: 'List Price(PSF)',
              value: `$ ${getPrice(obj.sqf_price)}`,
            },
            {
              type: 'Area(SQM)',
              value: obj.sqm_area,
            },
            {
              type: 'Area(SQF)',
              value: obj.sqf_area,
            },
            {
              type: 'Selling Price',
              value: `$ ${obj.transactionPrice || '0'}`,
            },

            {
              type: 'Selling Price(PSM)',
              value: `$ ${this.roundNum(obj.transactionPrice / obj.sqm_area)}`,
            },

            {
              type: 'Selling Price(PSF)',
              value: `$ ${this.roundNum(obj.transactionPrice / obj.sqf_area)}`,
            },

            {
              type: 'Standard Discount %',
              value: ` ${
                !!obj.transactionPrice && !!Number(getPrice(obj.price))
                  ? this.roundNum(obj.transactionPrice / getPrice(obj.price))
                  : 0
              }`,
            },

            {
              type: 'Selling Price Adjustemt',
              value: obj.adjustmentAmount,
            },
          ]

          this.DateObj = [
            {
              type: 'Option Date',
              value: obj.operateTime,
            },
            {
              type: 'Fixed Completion Due Date',
              value: this.$dateFormatNoTime(obj.completionDate),
            },
            {
              type: 'Option Remarks',
              value: obj.otherRemarks,
            },
          ]

          this.mailingAddressObj = [
            {
              type: 'Country',
              value: obj.country
            },
            {
              type: 'Postal Code',
              value: obj.postalCode
            },
            {
              type: 'Block',
              value: obj.block
            },
            {
              type: '# Unit',
              value: obj.unitNo
            },
            {
              type: 'Street Name',
              value: obj.streetName
            },
          ]
          this.recordId = this.detailsObj.recordId || ''
          this.getData('Agent')
        }
      })
    },
    roundNum(num) {
      return Math.round(num * 100) / 100
    },
    getData(type) {
      switch (type) {
        case 'Modify':
          let querys = {
            unitId: this.query.unitId,
            projectId: this.query.projectId,
            unitName: this.query.unitName,
            projectName: this.query.projectName,
            type: this.query.Status,
            link: '/SalesBooking/viewDetails',
          }

          if (this.query.link == '/SalesBooking/ProjectSales/SalesChart') {
            querys.superiorLink = this.query.link
          }
          if (this.query.link == '/SalesBooking/ProjectSales/PDIList') {
            querys.superiorLink = this.query.link
          }
          this.$router.push({
            path: '/SalesBooking/SalesFlowchart',
            query: {
              ...querys,
            },
          })
          break

        default:
          switch (type) {
            case 'Payment':
              this.dynamicData.title = 'Payment Received'
              this.dynamicData.payment = this.detailsObj.buyerPaymentList
              break
            case 'Purchaser':
              this.dynamicData.title = 'Purchaser'
              this.dynamicData.Purchaser = this.detailsObj.buyerList
              break
            case 'Agent':
              this.dynamicData.title = 'Staff & Agent'
              this.dynamicData.Agent = [
                {
                  text: 'Agent Details',
                  obj: [
                    {
                      type: 'Appointed Agency',
                      value: this.detailsObj.buyBrokeName,
                    },
                    {
                      type: 'Agent Name',
                      value: this.detailsObj.agentName,
                    },
                    {
                      type: 'CEA License No.',
                      value: this.detailsObj.regNum,
                    },
                    {
                      type: 'Tel No',
                      value: this.detailsObj.agentContact,
                    },
                    {
                      type: 'Commission(%)',
                      value: this.detailsObj.commission,
                    },
                    {
                      type: 'Remarks',
                      value: this.detailsObj.comment,
                    },
                  ],
                },
                {
                  text: 'Tagger',
                  obj: [
                    {
                      type: 'Appointed Agency',
                      value: this.detailsObj.taggerBuyBrokeName,
                    },
                    {
                      type: 'Agent Name',
                      value: this.detailsObj.taggerAgentName,
                    },
                    {
                      type: 'CEA License No.',
                      value: this.detailsObj.taggerRegNum,
                    },
                    {
                      type: 'Tel No',
                      value: this.detailsObj.taggerAgentContact,
                    },
                    {
                      type: 'Commission(%)',
                      value: this.detailsObj.taggerCommission,
                    },
                    {
                      type: 'Remarks',
                      value: this.detailsObj.taggerComment,
                    },
                  ],
                },
                {
                  text: 'Internal-CoBroke',
                  obj: [
                    {
                      type: 'Appointed Agency',
                      value: this.detailsObj.internalBuyBrokeName,
                    },
                    {
                      type: 'Agent Name',
                      value: this.detailsObj.internalAgentName,
                    },
                    {
                      type: 'CEA License No.',
                      value: this.detailsObj.internalRegNum,
                    },
                    {
                      type: 'Tel No',
                      value: this.detailsObj.internalAgentContact,
                    },
                    {
                      type: 'Commission(%)',
                      value: this.detailsObj.internalCommission,
                    },
                    {
                      type: 'Remarks',
                      value: this.detailsObj.internalComment,
                    },
                  ],
                },
                {
                  text: 'Referral',
                  obj: [
                    {
                      type: 'Referral Name',
                      value: this.detailsObj.referralName,
                    },
                    {
                      type: 'Agent Name',
                      value: this.detailsObj.referralAgency,
                    },
                    {
                      type: 'Mobile',
                      value: this.detailsObj.referralMobile,
                    },
                    {
                      type: 'Remarks',
                      value: this.detailsObj.referralRemark,
                    },
                  ],
                },
              ]
              break
          }
          // this.dialogVisible = true
          break
      }
    },
  },
}
</script>

<style lang="less">
.viewDetails {
  height: 100%;
  .viewDetails_Popup {
    .el-dialog__header {
      text-align: center;
    }
  }
  .head {
    background: #fff;
    padding: 10px;
    margin-bottom: 15px;
    .ballotNo {
      color: #f56c6c;
      margin-left: 15px;
    }
  }
  .viewDetails_content {
    background: #fff;
    padding: 10px;
    height: calc(100% - 60px);
    .sonBox {
      width: 100%;
      overflow-y: scroll;
      height: 100%;
      box-sizing: border-box;
      .el-input.is-disabled .el-input__inner {
        color: #000;
      }
      .fromDiv {
        padding: 15px;
        border-bottom: 1px solid #ddd;
        &:last-child {
          border-bottom: 0;
        }
        .lfLable {
          width: 150px;
          height: 40px;
          line-height: 40px;
          background: #9ea7b4;
          color: #fff;
          position: relative;
          text-align: center;
          margin-top: 20px;
          &::before {
            content: '';
            position: absolute;
            right: -40px;
            top: 0;
            width: 0;
            height: 0;
            border: 20px solid transparent;
            border-left-color: #9ea7b4;
          }
        }
        .tabBox {
          &.Document_content_div {
            padding: 20px 30px !important;
          }
          .Document_content_div_tab {
            border: 1px solid #f4f4f4;
            .el-icon-circle-close {
              color: crimson;
            }
            .image-slot {
              width: 100%;
              height: 100%;
              line-height: 60px;
              background: #f4f4f4;
            }
            .img_div {
              width: 100px;
              height: 80px;
              background: #999;
              border-radius: 5px;
              &:last-child {
                margin-left: 20px;
              }
              img {
                object-fit: contain;
              }
            }
          }
        }
      }
    }
    .viewDetails_content_btn {
      margin: 30px 0;
      text-align: center;
    }
    .AgentDiv_content {
      padding: 15px;
    }
  }
  .payerImg_div {
    img {
      width: 90px;
      height: 60px;
      border-radius: 5px;
      background: #ddd;
      object-fit: contain;
    }
  }
  .AgentDiv {
    border: 1px solid #f4f4f4;
    h1 {
      padding: 10px;
      background: #f4f4f4;
    }
    .AgentDiv_content {
      padding: 10px;
    }
  }
}
</style>