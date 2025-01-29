<template>
  <div class="Purchaser sonBox">
    <div class="case">
      <div class="lfLable">Purchaser Datail</div>
      <div class="fromDiv">
        <div class="addTab">
          <el-table
            class="tab_div_con"
            :data="PurchaserObj.buyerList"
            style="width: 100%"
          >
            <el-table-column label="Name" prop="buyerName"></el-table-column>
            <el-table-column label="Customer Type" prop="customerType">
              <template slot-scope="scope">{{
                SellBlockData.CustomerTypeData[Number(scope.row.customerType)]
                  .name
              }}</template>
            </el-table-column>
            <el-table-column
              label="Nationality"
              prop="nationality"
            ></el-table-column>
            <el-table-column
              label="ID No."
              prop="nricPassport"
            ></el-table-column>
            <el-table-column label="Email" prop="buyerEmail"></el-table-column>
            <el-table-column
              label="Mobile"
              prop="buyerMobile"
            ></el-table-column>
            <el-table-column label="Action" width="200">
              <template slot="header" slot-scope="scope">
                <el-button
                  size="mini"
                  icon="el-icon-plus"
                  v-if="(!isOpening || developers == 2) && PurchaserObj.buyerList.length < 5"
                  @click="showDialog"
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
                  v-if="(!isOpening || developers == 2) && PurchaserObj.buyerList.length > 1"
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

      <!-- 住宅地址 -->
      <div class="lfLable">Residential Address</div>
      <div class="fromDiv">
        <el-form :model="PurchaserObj" label-width="150px">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="Country">
                <el-select
                  size="mini"
                  class="input_80"
                  v-model="PurchaserObj.buyerCountry"
                >
                  <el-option
                    v-for="(item, index) in SellBlockData.CitizenshipData"
                    :key="index"
                    :label="item"
                    :value="item"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Postal Code">
                <el-input
                  class="input_80"
                  size="mini"
                  v-model="PurchaserObj.buyerPostalCode"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Block">
                <el-input
                  class="input_80"
                  size="mini"
                  v-model="PurchaserObj.buyerBlock"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Unit">
                <el-input
                  class="input_80"
                  size="mini"
                  v-model="PurchaserObj.buyerUnit"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Street Name">
                <el-input
                  class="input_80"
                  size="mini"
                  v-model="PurchaserObj.buyerStreetName"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <div class="lfLable">Remark</div>
      <div class="fromDiv">
        <el-form :model="PurchaserObj" label-width="150px">
              <el-form-item label="Buyer Remark">
                <el-input
                  class="input_80"
                  size="mini"
                  type="textarea"
                  v-model="PurchaserObj.buyerRemark"
                ></el-input>
              </el-form-item>
        </el-form>
      </div>

      <!-- 邮寄地址 -->
      <div class="lfLable" style="width: 250px">
        Correspondent Address
        <el-button class="use_Residential_Address" size="mini" @click="copyAddress"
          >Use Residential Address</el-button
        >
      </div>
      <div class="fromDiv">
        <el-form :model="PurchaserObj" label-width="150px">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="Country">
                <el-select
                  size="mini"
                  class="input_80"
                  v-model="PurchaserObj.country"
                >
                  <el-option
                    v-for="(item, index) in SellBlockData.CitizenshipData"
                    :key="index"
                    :label="item"
                    :value="item"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Postal Code">
                <el-input
                  class="input_80"
                  size="mini"
                  v-model="PurchaserObj.postalCode"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Block">
                <el-input
                  class="input_80"
                  size="mini"
                  v-model="PurchaserObj.block"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Unit">
                <el-input
                  class="input_80"
                  size="mini"
                  v-model="PurchaserObj.unitNo"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Street Name">
                <el-input
                  class="input_80"
                  size="mini"
                  v-model="PurchaserObj.streetName"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <!-- 非兴趣买家 -->
      <el-dialog
        center
        title="Purchaser Details"
        :visible.sync="NoRecordShow"
        width="40%"
      >
        <div>
          <el-form
            ref="form"
            :rules="rules"
            :model="buyerForm"
            label-width="150px"
          >
            <el-form-item label="Name" prop="buyerName">
              <el-input
                size="mini"
                style="width: 100%"
                v-model="buyerForm.buyerName"
                :disabled="isOpening && developers !== 2"
              ></el-input>
            </el-form-item>
            <el-form-item label="Customer Type" prop="customerType">
              <el-select
                size="mini"
                style="width: 100%"
                v-model="buyerForm.customerType"
              >
                <el-option
                  v-for="(item, index) in SellBlockData.CustomerTypeData"
                  :key="index"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Date of Birth" prop="dateOfBirth">
              <el-date-picker
                value-format="yyyy-MM-dd"
                size="mini"
                type="date"
                v-model="buyerForm.dateOfBirth"
                style="width: 100%"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="Gender" prop="gender">
              <el-select
                size="mini"
                style="width: 100%"
                v-model="buyerForm.gender"
              >
                <el-option
                  v-for="(item, index) in SellBlockData.GenderData"
                  :key="index"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Area Code" prop="countryCallingCode">
              <el-select
                size="mini"
                style="width: 100%"
                v-model="buyerForm.countryCallingCode"
              >
                <el-option
                  v-for="(item, index) in SellBlockData.countryCallingCodeData"
                  :key="index"
                  :label="item.name"
                  :value="item.name"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Mobile" prop="buyerMobile">
              <el-input
                size="mini"
                style="width: 100%"
                v-model="buyerForm.buyerMobile"
              ></el-input>
            </el-form-item>
            <el-form-item label="Email" prop="buyerEmail">
              <el-input
                size="mini"
                style="width: 100%"
                v-model="buyerForm.buyerEmail"
              ></el-input>
            </el-form-item>
            <el-form-item label="Nationality" prop="nationality">
              <el-select
                size="mini"
                style="width: 100%"
                v-model="buyerForm.nationality"
                :disabled="isOpening && developers !== 2"
              >
                <el-option
                  v-for="(item, index) in SellBlockData.CitizenshipData"
                  :key="index"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="NRIC/Passport" prop="nricPassport">
              <el-input
                size="mini"
                style="width: 100%"
                v-model="buyerForm.nricPassport"
                :disabled="isOpening && developers !== 2"
              ></el-input>
            </el-form-item>
            <el-form-item label="Occupation">
              <el-input
                size="mini"
                style="width: 100%"
                v-model="buyerForm.occupation"
              ></el-input>
            </el-form-item>
            <el-form-item label="Residential">
              <el-select
                size="mini"
                style="width: 100%"
                v-model="buyerForm.residential"
              >
                <el-option
                  v-for="(item, index) in SellBlockData.residentialData"
                  :key="index"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="District">
              <el-select
                size="mini"
                style="width: 100%"
                v-model="buyerForm.district"
              >
                <el-option
                  v-for="(item, index) in SellBlockData.DistrictData"
                  :key="index"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="NoRecordShow = false">Cancel</el-button>
          <!-- <el-button type="primary" v-if="!isOpening" @click="addDataFn">Save & Add Next Purchaser</el-button> -->
          <el-button type="primary" @click="addDataFn('close')">Save</el-button>
        </div>
      </el-dialog>

      <!-- 兴趣买家 -->
      <el-dialog
        center
        title="INTRESTING ID"
        :visible.sync="onRecordShow"
        width="60%"
      >
        <div class="interesting">
          <div class="seekDiv">
            <el-select
              v-model="ActiveId"
              filterable
              remote
              placeholder="Please enter keywords"
              :remote-method="remoteMethod"
              :loading="seekLoading"
              style="width: 80%"
              @change="changeData"
            >
              <el-option
                v-for="(item, index) in CustomerData"
                :key="index"
                :label="item.buyerName"
                :value="item.interestId"
              >
                <div>
                  <el-row :gutter="20">
                    <el-col :span="6">{{ item.buyerName }}</el-col>
                    <el-col :span="6">{{ item.ballotNo }}</el-col>
                    <el-col :span="6">{{ item.buyerMobile }}</el-col>
                    <el-col :span="6">{{ item.country }}</el-col>
                  </el-row>
                </div>
              </el-option>
            </el-select>
          </div>
          <div class="seekContent">
            <BuyersDiv :BuyObj="optionObj"></BuyersDiv>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="onRecordShow = false">Cancel</el-button>
          <el-button type="primary" @click="addDataFn('ref')">Save</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import BuyersDiv from './module/BuyersDiv'
import SellBlockData from './SellBlockData.json'
import { pick, getPrice, setRulesData } from '@/utils/validate'
export default {
  components: { BuyersDiv },
  props: {
    updaObj: {
      type: Object,
    },
    interested: {
      type: Number,
      default: 0,
    },
  },
  watch: {
    interested(val) {
      this.type = val
      this.PurchaserObj.buyerList = []
      console.log(this.type, '是否为兴趣买家, 0 不是，1是')
    },
  },
  data() {
    return {
      isOpening: false,
      onRecordShow: false,
      NoRecordShow: false,
      tableData: [],
      buyerForm: {
        customerType: '',
        dateOfBirth: '',
        gender: '',
        countryCallingCode: '',
        buyerMobile: '',
        buyerEmail: '',
        nationality: '',
        nricPassport: '',
        occupation: '',
        residential: '',
        district: '',
        buyerName: '',
      },
      type: this.interested,
      ActiveId: '',
      optionObj: [],
      seekLoading: false,
      SellBlockData: SellBlockData,
      CustomerData: [],
      PurchaserObj: {
        buyerList: [],
        buyerCountry: '',
        buyerBlock: '',
        buyerUnit: '',
        buyerPostalCode: '',
        buyerStreetName: '',
        country: '',
        block: '',
        postalCode: '',
        streetName: '',
        unitNo: '',
        buyerRemark: ''
      },
      editIndex: undefined,
      developers: JSON.parse(sessionStorage.getItem('userInfo')).type
    }
  },
  computed: {
    rules() {
      let blurArr = [
        'buyerName',
        'buyerMobile',
        'buyerEmail',
        'nationality',
        'nricPassport',
      ]
      let changeArr = [
        'customerType',
        'dateOfBirth',
        'gender',
        'countryCallingCode',
      ]
      return {
        ...setRulesData('blur', blurArr),
        ...setRulesData('change', changeArr),
      }
    },
  },
  mounted() {
    this.selectCustomer()
    if (this.updaObj) {
      let obj = JSON.parse(JSON.stringify(this.updaObj))
      let takeArr = new Array()
      for (const key in JSON.parse(JSON.stringify(this.PurchaserObj))) {
        takeArr.push(key)
      }
      let beforeObj = pick(obj, takeArr)
      this.PurchaserObj = beforeObj
      if (beforeObj.buyerList && beforeObj.buyerList.length) {
        this.PurchaserObj.buyerList = beforeObj.buyerList
      } else {
        this.PurchaserObj.buyerList = new Array()
      }
    }
    this.queryProjectSet()
  },
  methods: {
    queryProjectSet() {
      this.$Get(this.$api.queryProjectSet, {
        projectId: this.$route.query.projectId,
      }).then((res) => {
        if (res.code == 0) {
          this.isOpening = res.datas.projectSet.launchStatus
          console.log('是否开盘状态', this.isOpening)
        }
      })
    },
    handleDelete(index, row) {
      this.PurchaserObj.buyerList.splice(index, 1)
    },
    resetFromFn() {
      this.buyerForm = {
        customerType: '',
        dateOfBirth: '',
        gender: '',
        countryCallingCode: '',
        buyerMobile: '',
        buyerEmail: '',
        nationality: '',
        nricPassport: '',
        occupation: '',
        residential: '',
        district: '',
        buyerName: '',
      }
    },
    addDataFn(type) {
      switch (type) {
        case 'ref':
          this.$notify({
            title: 'Success',
            message: 'Success!',
            type: 'success',
          })
          this.PurchaserObj.buyerList = this.optionObj
          this.onRecordShow = false
          break

        default:
          this.$refs.form.validate((valid) => {
            if (valid) {
              this.$notify({
                title: 'Success',
                message: 'Success!',
                type: 'success',
              })

              if (this.editIndex != undefined) {
                this.PurchaserObj.buyerList[this.editIndex] = this.buyerForm
                this.editIndex = undefined
              } else {
                this.PurchaserObj.buyerList.push(this.buyerForm)
              }

              if (type == 'close') {
                this.NoRecordShow = false
              }
            } else {
              return false
            }
          })

          break
      }
    },
    editFn(index, row) {
      this.buyerForm = row
      this.NoRecordShow = true
      this.editIndex = index
    },
    changeData(val) {
      this.getRelationBuyer(val)
    },
    getRelationBuyer(val) {
      let obj = this.CustomerData.find((item) => {
        return item.interestId == val
      })
      let data = {
        interestId: obj.interestId,
        unitBuyId: obj.unitBuyId,
      }
      this.$Post(this.$api.getRelationBuyer, data).then((res) => {
        if (res.code == 0) {
          this.optionObj = res.datas
        }
      })
    },
    remoteMethod(query) {
      this.selectCustomer(query)
    },
    showDialog() {
      this.editIndex = undefined
      this.resetFromFn()
      switch (this.type) {
        case 1:
          this.onRecordShow = true
          break

        default:
          this.NoRecordShow = true
          break
      }
    },
    selectCustomer(query) {
      this.$Post(this.$api.selectCustomer, {
        projectId: this.$route.query.projectId,
        content: query,
      }).then((res) => {
        if (res.code == 0) {
          this.CustomerData = res.datas
        }
      })
    },
    isNextFn() {
      if (!this.PurchaserObj.buyerList.length) {
        this.$notify.error({
          title: 'Error',
          message: `Please fill in the buyer's information`,
        })
        return false
      }
      return { obj: this.PurchaserObj, index: 2 }
    },
    copyAddress() {
      this.PurchaserObj.country = this.PurchaserObj.buyerCountry
      this.PurchaserObj.postalCode = this.PurchaserObj.buyerPostalCode
      this.PurchaserObj.block = this.PurchaserObj.buyerBlock
      this.PurchaserObj.unitNo = this.PurchaserObj.buyerUnit
      this.PurchaserObj.streetName = this.PurchaserObj.buyerStreetName
    }
  },
}
</script>

<style lang="less">
.Purchaser {
  .lfLable {
    .use_Residential_Address {
      position: absolute;
      left: 300px;
      top: 10px;
    }
  }
  .addTab {
    padding: 20px;
    .tab_div_con {
      border: 1px solid #ddd;
    }
  }
  .case {
    .el-form-item {
      margin-bottom: 10px;
    }
  }
  .seekDiv {
    text-align: center;
  }
  .interesting {
    .seekContent {
      height: 400px;
      overflow-y: scroll;
      padding: 15px;
    }
  }
}
</style>