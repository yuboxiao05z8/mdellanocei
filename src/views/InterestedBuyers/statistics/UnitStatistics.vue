<template>
  <div class="UnitStatistics">
    <!-- <div class="head">
      <crumbs :crumbsData="crumbsData"></crumbs>
    </div>-->
    <div class="head">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-button
            size="mini"
            type="info"
            class="btn el-icon-back"
            style="margin-right: 30px;"
            @click="goBack"
          >{{$t('editMap.goBack')}}</el-button>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple">Name: {{$route.query.name}}</div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            Building
            <el-select size="mini" @change="queryTableList" v-model="Building">
              <el-option
                v-for="(item,index) in buildingData"
                :key="index"
                :label="item.key"
                :value="item.key"
              ></el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <el-switch v-model="isShow" active-text="Show Details" inactive-text="Not Displayed"></el-switch>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="tab">
      <div class="horizontalScale">
        <div class="Scale" v-for="(item, index) in obj.stack" :key="index">{{item}}</div>
      </div>
      <div class="verticalScale" v-for="(item, index) in obj.floor" :key="index">
        <div class="leftScale">
          <div class="ScaleBox">{{item.key}}</div>
        </div>
        <div class="units" v-for="(unit, index) in item.value">
          <div
            class="unitBox"
            :class="{'SOLD':(unit.purchaseStatus == 'SOLD'),
                  'AVAILABLE':(unit.purchaseStatus == 'AVAILABLE'),
                  'PENDINGRESERVED':(unit.purchaseStatus == 'PENDING RESERVED'),
                  'RESERVED':(unit.purchaseStatus == 'RESERVED'),
                  'SPASIGN':(unit.purchaseStatus == 'SPA SIGN'),
                  'SPASTAMP':(unit.purchaseStatus == 'SPA STAMP'),
                  'REQUESTCANCEL':(unit.purchaseStatus == 'REQUEST CANCEL'),
                  'NOTRELEASED':(unit.purchaseStatus == 'NOT RELEASED')
                  }"
          >
            <div class="coreUnitBox">
              <div v-if="!isShow" class="flixDiv">
                <h2 v-if="unit.brokeList">
                  {{
                  sum(unit.brokeList)
                  }}
                </h2>
                <h1>{{unit.unitName}}</h1>
              </div>
              <div v-else class="flixDiv">
                <h3
                  v-for="(item, index) in sortFn(unit.brokeList)"
                  :key="index"
                >{{item.brokeName}}: {{item.num}}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import crumbs from '../component/crumbs'
export default {
  components: { crumbs },
  data() {
    return {
      crumbsData: ['Potential Clients', 'Intended Unit Statistics'],
      Building: '',
      isShow: false,
      buildingData: [],
      obj: {}
    }
  },
  mounted() {
    this.getUnitFilter()
  },
  methods: {
    goBack() {
      this.$router.replace('/Interes/InterestedBuyers')
    },
    getUnitFilter() {
      this.$Post(this.$api.getUnitFilter, {
        projectId: this.$route.query.id
      }).then(res => {
        if (res.code == 0) {
          this.buildingData = res.datas.building

          if (this.buildingData.length) {
            this.Building = this.buildingData[0].key
            this.queryTableList(this.buildingData[0].key)
          }
        }
      })
    },
    async queryTableList(type) {
      let data = {
        projectId: this.$route.query.id,
        building: type
      }
      let arr = await this.$Posting(this.$api.queryTableList, data).catch(
        err => {
          console.log(err)
        }
      )
      if (arr.code == 0) {
        this.obj = arr.datas
      }
    },
    sum(arr) {
      let nums = arr.map(i => {
        return i.num
      })
      return eval(nums.join('+'))
    },
    sortFn(arr) {
      if (!arr) {
        return []
      }

      let objArr = JSON.parse(JSON.stringify(arr))
      let retObj = []

      objArr.sort(sortNumber('num'))

      function sortNumber(property) {
        return function(a, b) {
          let aVal = parseInt(a[property])
          let bVal = parseInt(b[property])
          return bVal - aVal
        }
      }

      if (objArr.length > 3) {
        let sum = 0
        objArr.slice(3).map(i => {
          sum += parseInt(i.num)
        })

        retObj = [...objArr.slice(0, 3), { brokeName: 'Others', num: sum }]
      } else {
        retObj = objArr
      }

      return retObj
    }
  }
}
</script>

<style lang="less">
.UnitStatistics {
  .head {
    padding: 10px;
    background: #fff;
    margin-bottom: 15px;
    .el-row {
      line-height: 30px;
    }
  }
  .tab {
    background: #fff;
    padding: 10px;
    width: 100%;
    height: 700px;
    overflow-y: scroll;
    overflow-x: scroll;
    .horizontalScale {
      white-space: nowrap;
      padding-left: 50px;
      .Scale {
        display: inline-block;
        width: 150px;
        text-align: center;
        border-right: 1px solid #f4f4f4;
        border-bottom: 1px solid #f4f4f4;
        padding: 5px;
        box-sizing: border-box;
      }
    }
    .verticalScale {
      white-space: nowrap;
      height: 120px;
      font-size: 0;
      .leftScale {
        width: 50px;
        height: 120px;
        line-height: 120px;
        text-align: center;
        border-bottom: 1px solid #f4f4f4;
        border-right: 1px solid #f4f4f4;
        display: inline-block;
        box-sizing: border-box;
        position: relative;
        font-size: 14px;
        .ScaleBox {
          position: absolute;
          left: 0;
          right: 0;
          width: 100%;
          height: 100%;
        }
      }
      .units {
        width: 150px;
        height: 120px;
        text-align: center;
        line-height: 120px;
        border-bottom: 1px solid #f4f4f4;
        border-right: 1px solid #f4f4f4;
        display: inline-block;
        box-sizing: border-box;
        position: relative;
        font-size: 14px;
        .unitBox {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          &.AVAILABLE {
            background-color: forestgreen;
          }
          &.SOLD {
            background-color: #f4b0c7;
          }
          &.PENDINGRESERVED {
            background-color: #e8e858;
          }
          &.RESERVED {
            background-color: #ff9900;
          }
          &.SPASIGN {
            background-color: #00ccff;
          }
          &.SPASTAMP {
            background-color: #0033ff;
          }
          &.REQUESTCANCEL {
            background-color: #6600cc;
          }
          &.NOTRELEASED {
            background-color: rgba(102, 102, 102, 1);
          }
        }
      }
      .coreUnitBox {
        display: flex;
        height: 100%;
        width: 100%;
        align-items: center;
        .flixDiv {
          line-height: 1;
          width: 100%;
          h2 {
            margin-bottom: 5px;
            font-size: 16px;
          }
          h3 {
            font-size: 12px;
            margin-bottom: 5px;
          }
        }
      }
    }
    .verticalBox {
      white-space: nowrap;
      display: inline-block;
      .verticalUnits {
        // width: 1;
      }
    }
  }
}
</style>