<template>
  <div class="PriceChange">
    <el-dialog title="Edit Price" fullscreen :visible.sync="outerVisible">
      <div class="Conten">
        <h1 class="head">Name: {{projectDesc.name}}</h1>
        <div class="fromDiv">
          <el-form ref="form" :rules="rules" :model="form" label-width="150px">
            <el-row :gutter="20">
              <el-col :span="12">
                <div class="grid-content bg-purple">
                  <el-form-item prop="purchaseStatus" label="Unit Status">
                    <el-select v-model="form.purchaseStatus">
                      <el-option
                        v-for="(item, index) in selectData.StatusData"
                        :key="index"
                        :label="item.key"
                        :value="item.key"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content bg-purple">
                  <el-form-item prop="block" label="Unit Block">
                    <el-select v-model="form.block">
                      <el-option
                        v-for="(item, index) in selectData.building"
                        :key="index"
                        :label="item.key"
                        :value="item.key"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <div class="grid-content bg-purple">
                  <el-form-item prop="floor" label="Unit  Floor">
                    <el-select v-model="form.floor">
                      <el-option
                        v-for="(item, index) in selectData.floor"
                        :key="index"
                        :label="item.key"
                        :value="item.key"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content bg-purple">
                  <el-form-item prop="stack" label="Unit Stack">
                    <el-select v-model="form.stack">
                      <el-option
                        v-for="(item, index) in selectData.stack"
                        :key="index"
                        :label="item.key"
                        :value="item.key"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <div class="grid-content bg-purple">
                  <el-form-item prop="type" label="Unit  Type">
                    <el-select v-model="form.unitType">
                      <el-option
                        v-for="(item, index) in selectData.type"
                        :key="index"
                        :label="item.key"
                        :value="item.key"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content bg-purple">
                  <el-form-item prop="bedrooms" label="Bedroom Type">
                    <el-select v-model="form.bedrooms">
                      <el-option
                        v-for="(item, index) in selectData.bedrooms"
                        :key="index"
                        :label="item.key"
                        :value="item.key"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
            <div class="fromDiv">
              <el-form-item prop="priceBaseLabel" label="Price Base">
                <el-select v-model="form.priceBaseLabel">
                  <el-option
                    v-for="(item, index) in selectData.price"
                    :key="index"
                    :label="item.value"
                    :value="item"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="Discount" prop="updateType">
                <el-radio-group v-model="form.updateType" @change="DiscountTypeSelectFn">
                  <el-radio :label="1">%折扣</el-radio>
                  <el-radio :label="2">固定金额</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-row :gutter="20">
                <el-col :span="12">
                  <div class="grid-content bg-purple" v-if="form.updateType == 1">
                    <el-form-item label="%">
                      <el-input-number
                        v-model="form.updateValue"
                        controls-position="right"
                        :step="0.1"
                        :min="-100"
                        :max="100"
                      ></el-input-number>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="grid-content bg-purple">
                    <el-form-item label="$" v-if="form.updateType == 2">
                      <el-input-number v-model="form.updateValue" controls-position="right"></el-input-number>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>
              <el-form-item prop="newPriceLabel" label="New Price">
                <el-select v-model="form.newPriceLabel">
                  <el-option
                    v-for="(item, index) in selectData.price"
                    :key="index"
                    :label="item.value"
                    :value="item"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-form>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="outerVisible = false">Cancel</el-button>
        <el-button type="primary" @click="verifyFn">Update</el-button>
      </div>

      <el-dialog width="70%" title="Update" :visible.sync="innerVisible" append-to-body>
        <div class="head" style="margin-bottom: 20px">
          TYPE:
          <span v-if="form.updateType == 1">Discount: {{form.updateValue}}%</span>
          <span v-if="form.updateType == 2">fixed Amount: {{form.updateValue}}</span>
        </div>
        <div class="tabar" v-if="conversion">
          <el-table :data="unitTab" height="400" border style="width: 100%">
            <el-table-column prop="unitName" label="Name"></el-table-column>
            <el-table-column prop="purchaseStatus" label="Status"></el-table-column>
            <el-table-column label="Price Base">
              <template slot-scope="scope">
                <div>${{scope.row[conversion.priceBase]}}</div>
              </template>
            </el-table-column>
            <el-table-column :label="`${conversion.newPrice}(Before)`">
              <template slot-scope="scope">
                <div>${{scope.row[conversion.newPrice]}}</div>
              </template>
            </el-table-column>
            <el-table-column :label="`${conversion.newPrice}(After)`">
              <template slot-scope="scope">
                <div>${{arithmeticalDiscount(scope.row[conversion.newPrice])}}</div>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            style="margin-top: 20px;text-align: center;"
            :page-size="pageSize"
            @current-change="handleCurrentChange"
            background
            layout="prev, pager, next"
            :total="total"
          ></el-pagination>
        </div>
        <div slot="footer" style="text-align: center;" class="dialog-footer" >
          <el-button @click="innerVisible = false">Cancel</el-button>
          <el-button type="primary" @click="updateFn">Update</el-button>
        </div>
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
import rules from './rules'
export default {
  data() {
    return {
      outerVisible: false,
      innerVisible: false,
      projectDesc: JSON.parse(sessionStorage.getItem('projectDesc')),
      form: {
        updateValue: ''
      },
      selectData: {
        StatusData: [
          { key: 'ALL' },
          { key: 'AVAILABLE' },
          { key: 'SOLD' },
          { key: 'RESERVED' },
          { key: 'UNAVAILLABLE' }
        ]
      },
      rules: rules,
      conversion: null,
      pageNo: 1,
      pageSize: 10,
      unitTab: [],
      total: 0
    }
  },
  mounted() {
    this.getUnitFilter()
  },
  methods: {
    DiscountTypeSelectFn(val) {
      this.form.updateValue = ''
    },
    getUnitFilter() {
      let data = {
        projectId: this.projectDesc.id
      }
      this.$Post(this.$api.getUnitFilter, data).then(res => {
        if (res.code == 0) {
          let obj = JSON.parse(JSON.stringify(res.datas))
          for (const key in obj) {
            if (key != 'price') {
              obj[key].unshift({ key: 'ALL' })
            } else {
            }
          }

          this.selectData = { ...this.selectData, ...obj }
        }
      })
    },
    verifyFn() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (!this.form.updateValue) {
            this.$message.error('Please fill in the discount limit')
            return false
          } else if (
            this.form.priceBaseLabel.key == this.form.newPriceLabel.key
          ) {
            this.$message.error(
              'The value of the Price Base and the New Price cannot be the same'
            )
            return false
          }
          let data = JSON.parse(JSON.stringify(this.form))
          data.priceBaseLabel = this.form.priceBaseLabel.value
          data.priceBase = this.form.priceBaseLabel.key
          data.newPriceLabel = this.form.newPriceLabel.value
          data.newPrice = this.form.newPriceLabel.key

          for (const key in data) {
            if (data[key] == 'ALL') {
              data[key] = ''
            }
          }

          this.conversion = data
          this.queryUnits()
        } else {
          return false
        }
      })
    },
    queryUnits() {
      let Obj = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        projectId: this.projectDesc.id
      }
      this.$Post(this.$api.queryUpdateUnit, {
        ...this.conversion,
        ...Obj
      }).then(res => {
        if (res.code == 0) {
          if (!res.datas.count) {
            this.$message.error('No available units were found')
            return false
          }
          this.unitTab = res.datas.lists
          this.innerVisible = true
          this.total = res.datas.count
        }
      })
    },
    updateFn() {
      this.$Posting(this.$api.updateUnitPrice, {...this.conversion,projectId: this.projectDesc.id}).then(res => {
        if (res.code == 0) {
          this.$notify({
            title: 'Success',
            message: 'Success',
            type: 'success'
          })
          this.innerVisible = false
          this.outerVisible = false
          this.$emit('priceAdjustment')
        } else {
          this.$notify.error({
            title: 'Error',
            message: res.msg
          })
        }
      })
    },
    handleCurrentChange(val) {
      this.pageNo = val
      this.queryUnits()
    },
    arithmeticalDiscount(money) {
      let type = this.conversion.updateType // 1 百分比 2 固定金额
      let updateValue = parseFloat(this.conversion.updateValue)
      let num = 0
      let price = parseFloat(money)
      switch (type) {
        case 1:
          let multiplyingPower = Math.abs(updateValue) / 100
          if (updateValue > 0) {
            num = price * multiplyingPower + price
          } else {
            num = price - price * multiplyingPower
          }
          break

        case 2:
          num = price + updateValue
          break
      }
      return Math.floor(num * 100) / 100 
    }
  }
}
</script>

<style lang="less">
.PriceChange {
  .el-dialog__body {
    padding: 5px 0;
  }
  .el-dialog__header,
  .dialog-footer {
    text-align: center;
  }
  .Conten {
    padding: 0;
    .head {
      padding: 10px 20px;
      border-bottom: 1px solid #f4f4f4;
      font-size: 16px;
      text-align: center;
      color: #000;
    }
    .fromDiv {
      width: 800px;
      margin: 0 auto;
      padding: 20px 0;
      border-top: 1px solid #f4f4f4;
    }
  }
}
</style>