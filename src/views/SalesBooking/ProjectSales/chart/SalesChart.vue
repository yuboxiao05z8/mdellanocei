<template>
  <div class="SalesChart">
    <div class="head">
      <el-form :inline="true" :model="form" class="demo-form-inline">
        <el-form-item label="Project">
          <el-select @change="getUnitFilter" size="mini" v-model="form.projectId">
            <el-option
              v-for="(item, index) in projects"
              :key="index"
              :label="item.projectName"
              :value="item.projectId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="No.Bedroom">
          <el-select size="mini" v-model="form.roomType">
            <el-option
              v-for="(item, index) in bedrooms"
              :key="index"
              :label="item.key"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Building">
          <el-select size="mini" @change="queryTableList" v-model="form.building">
            <el-option
              v-for="(item, index) in buildings"
              :key="index"
              :label="item.key"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item></el-form-item>
      </el-form>
    </div>
    <div class="head" v-if="JSON.stringify(tabObj) != '{}'">
      <el-row :gutter="20">
        <el-col :span="4">
          <div class="statusDiv ALL" @click="seekStatus('ALL')">
            <h1>ALL</h1>
            <p>{{tabObj.unitStat.all_num}}</p>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="statusDiv AVAILABLE" @click="seekStatus('AVAILABLE')">
            <h1>Available</h1>
            <p>{{tabObj.unitStat.available_num}}</p>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="statusDiv InPROGRESS" @click="seekStatus('IN PROGRESS')">
            <h1>In Progress</h1>
            <p>{{tabObj.unitStat.progress_num}}</p>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="statusDiv RESERVED" @click="seekStatus('RESERVED')">
            <h1>Reserved</h1>
            <p>{{tabObj.unitStat.released_num}}</p>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="statusDiv SOLD" @click="seekStatus('SOLD')">
            <h1>Sold</h1>
            <p>{{tabObj.unitStat.sold_num}}</p>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="statusDiv NOTRELEASED" @click="seekStatus('NOT RELEASED')">
            <h1>Not Released</h1>
            <p>{{tabObj.unitStat.not_released_num}}</p>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="tab_content">
      <div class="noData" v-if="!form.projectId">Please select an project !</div>
      <div class="tabBox" v-else>
        <div class="horizontalScale">
          <div class="Scale" v-for="(item, index) in tabObj.stack" :key="index">{{item}}</div>
        </div>
        <div class="verticalScale" v-for="(item, index) in tabObj.floor" :key="index">
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
                  'NOTRELEASED':(unit.purchaseStatus == 'NOT RELEASED'),
                  'InPROGRESS': (unit.purchaseStatus == 'IN PROGRESS')
                  }"
              v-if="(unit.bedrooms == form.roomType || form.roomType == 'ALL') && (
                  unit.purchaseStatus == form.Status || form.Status == 'ALL'
                )"
            >
              <div class="coreUnitBox" @click="showPopup(unit)">
                <div class="flixDiv">
                  <h1>{{unit.unitName}}</h1>
                  <p>{{unit.area}}sqft</p>
                  <p v-if="unit.psf">{{unit.psf}}psf</p>
                  <p>{{unit.price}}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <SalesPopup ref="popup" @refreshFn="refreshFn" :unitObj="unitObj"></SalesPopup>
  </div>
</template>

<script>
import SalesPopup from '../../components/SalesPopup'
export default {
  components: { SalesPopup },
  data() {
    return {
      form: {
        projectId: '',
        building: '',
        roomType: 'ALL',
        Status: 'ALL'
      },
      bedrooms: [],
      buildings: [],
      projects: [],
      tabObj: {},
      unitObj: {}
    }
  },
  mounted() {
    if (this.$route.query.id) {
      this.form.projectId = this.$route.query.id
      this.getUnitFilter()
    }
    this.queryProjectSalesList()
  },
  methods: {
    queryProjectSalesList() {
      let data = {
        pageSize: 9999,
        pageNo: 1
      }
      this.$Posting(this.$api.queryProjectSalesList, data).then(res => {
        if (res.code == 0) {
          this.projects = res.datas.lists
        }
      })
    },
    getUnitFilter() {
      this.bedrooms = []
      this.buildings = []
      this.$Post(this.$api.getUnitFilter, {
        projectId: this.form.projectId
      }).then(res => {
        if (res.code == 0) {
          this.bedrooms = [{ key: 'ALL' }, ...res.datas.bedrooms]
          this.buildings = res.datas.building
          this.form.building = this.buildings[0].key || ''
          this.queryTableList()
        }
      })
    },
    queryTableList() {
      let data = {
        projectId: this.form.projectId,
        building: this.form.building
      }
      this.statusObj = []
      this.$Posting(this.$api.queryTableList, data).then(res => {
        if (res.code == 0) {
          this.tabObj = res.datas
        }
      })
    },
    seekStatus(type) {
      this.form.Status = type
    },
    refreshFn() {
      this.queryTableList()
    },
    showPopup(unit) {
      if (unit.purchaseStatus) {
        this.unitObj = unit
        this.$refs.popup.show = true
      }
    }
  }
}
</script>

<style lang="less">
.SalesChart {
  height: 100%;
  .head {
    padding: 10px;
    background: #fff;
    margin-bottom: 15px;
    .el-form-item {
      margin-bottom: 0;
      margin-right: 20px;
    }
    .statusDiv {
      text-align: center;
      cursor: pointer;
      padding: 8px;
      border-radius: 5px;
      color: #fff;
    }
    .el-col-2 {
      &::before {
        content: '1';
        opacity: 0;
      }
    }
  }
  .tab_content {
    width: 100%;
    height: calc(100% - 160px);
    background: #fff;
    .tabBox {
      background: #fff;
      padding: 10px;
      width: 100%;
      height: 100%;
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
            color: #fff;
          }
        }
        .coreUnitBox {
          display: flex;
          height: 100%;
          width: 100%;
          cursor: pointer;
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
    .noData {
      text-align: center;
      padding-top: 50px;
    }
  }
}
</style>