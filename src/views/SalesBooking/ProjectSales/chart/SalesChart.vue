<template>
  <div class="SalesChart" :class="{ show_drawLots: launchStatus }">
    <div class="SalesChart_box">
      <div class="head">
        <el-form :inline="true" :model="form" class="demo-form-inline">
          <el-form-item label="Project">
            <el-select
              @change="getUnitFilter"
              size="mini"
              v-model="form.projectId"
            >
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
            <el-select
              size="mini"
              @change="queryTableList"
              v-model="form.building"
            >
              <el-option
                v-for="(item, index) in buildings"
                :key="index"
                :label="item.key"
                :value="item.key"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button size="mini" @click="refreshFn">refresh</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="head" v-if="JSON.stringify(tabObj) != '{}'">
        <el-row :gutter="20">
          <el-col :span="4">
            <div class="statusDiv ALL" @click="seekStatus('ALL')">
              <h1>ALL</h1>
              <p>{{ tabObj.unitStat.all_num }}</p>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="statusDiv AVAILABLE" @click="seekStatus('AVAILABLE')">
              <h1>Available</h1>
              <p>{{ tabObj.unitStat.available_num }}</p>
            </div>
          </el-col>
          <el-col :span="4">
            <div
              class="statusDiv InPROGRESS"
              @click="seekStatus('IN PROGRESS')"
            >
              <h1>In Progress</h1>
              <p>{{ tabObj.unitStat.progress_num }}</p>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="statusDiv RESERVED" @click="seekStatus('RESERVED')">
              <h1>Reserved</h1>
              <p>{{ tabObj.unitStat.released_num }}</p>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="statusDiv SOLD" @click="seekStatus('SOLD')">
              <h1>Sold</h1>
              <p>{{ tabObj.unitStat.sold_num }}</p>
            </div>
          </el-col>
          <el-col :span="4">
            <div
              class="statusDiv NOTRELEASED"
              @click="seekStatus('NOT RELEASED')"
            >
              <h1>Not Released</h1>
              <p>{{ tabObj.unitStat.not_released_num }}</p>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="tab_content">
        <div class="noData" v-if="!form.projectId">
          Please select an project !
        </div>
        <div class="tabBox" v-else>
          <div class="horizontalScale">
            <div
              class="Scale"
              v-for="(item, index) in tabObj.stack"
              :key="index"
            >
              {{ item }}
            </div>
          </div>
          <div
            class="verticalScale"
            v-for="(item, index) in tabObj.floor"
            :key="index"
          >
            <div class="leftScale">
              <div class="ScaleBox">{{ item.key }}</div>
            </div>
            <div class="units" v-for="(unit, index) in item.value">
              <div
                class="unitBox"
                :class="{
                  SOLD: unit.purchaseStatus == 'SOLD',
                  AVAILABLE: unit.purchaseStatus == 'AVAILABLE',
                  PENDINGRESERVED: unit.purchaseStatus == 'PENDING RESERVED',
                  RESERVED: unit.purchaseStatus == 'RESERVED',
                  SPASIGN: unit.purchaseStatus == 'SPA SIGN',
                  SPASTAMP: unit.purchaseStatus == 'SPA STAMP',
                  REQUESTCANCEL: unit.purchaseStatus == 'REQUEST CANCEL',
                  NOTRELEASED: unit.purchaseStatus == 'NOT RELEASED',
                  InPROGRESS: unit.purchaseStatus == 'IN PROGRESS',
                }"
                v-if="
                  (unit.bedrooms == form.roomType || form.roomType == 'ALL') &&
                  (unit.purchaseStatus == form.Status || form.Status == 'ALL')
                "
              >
                <div class="coreUnitBox" @click="showPopup(unit)">
                  <div class="flixDiv">
                    <h1>{{ unit.unitName }}</h1>
                    <p>{{ unit.area }}sqft</p>
                    <p v-if="unit.psf">{{ unit.psf }}psf</p>
                    <p>{{ unit.price }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="drawLots_box" v-if="launchStatus">
      <draw-lots
        @getInterestId="getInterestId"
        ref="drawDom"
        :projectId="form.projectId"
      />
    </div>
    <SalesPopup
      ref="popup"
      @refreshFn="refreshFn"
      :unitObj="unitObj"
      :interestId="interestId"
    ></SalesPopup>
  </div>
</template>

<script>
import SalesPopup from './module/SalesPopup'
import drawLots from './module/drawLots'
import { socketLink } from '@/InterfaceConfig/env'

let socket 

export default {
  components: { SalesPopup, drawLots },
  data() {
    return {
      form: {
        projectId: '',
        building: '',
        roomType: 'ALL',
        Status: 'ALL',
      },
      bedrooms: [],
      buildings: [],
      projects: [],
      tabObj: {},
      unitObj: {},
      launchStatus: 0, // 是否显示抽签系统
      interestId: '',
      userInfo: JSON.parse(sessionStorage.getItem('userInfo')) || {}
    }
  },
  mounted() {
    if (this.$route.query.id) {
      this.form.projectId = this.$route.query.id
      this.getUnitFilter()
    }
    socket = new WebSocket(`${socketLink}/Queue/${this.userInfo.userId}/${this.userInfo.token}`)
    this.$nextTick(() => {
      let self = this
      console.log('==> 创建socket <==')
      socket.onmessage = function (event) {
        self.socketMessage(event.data)
      }
    })

    this.queryProjectSalesList()
  },
  methods: {
    socketMessage(event) {
      if (this.form.projectId == event) {
        console.log('==> socket和项目匹配，触发刷新 <==')
        this.refreshFn()
      }
      console.log(`进入socket方法', 发来ID: ${event}, 项目ID：${this.form.projectId}`)
    },
    queryProjectSalesList() {
      let data = {
        pageSize: 9999,
        pageNo: 1,
      }
      this.$Posting(this.$api.queryProjectSalesList, data).then((res) => {
        if (res.code == 0) {
          this.projects = res.datas.lists
        }
      })
    },
    getUnitFilter() {
      this.bedrooms = []
      this.buildings = []
      this.$Post(this.$api.getUnitFilter, {
        projectId: this.form.projectId,
      }).then((res) => {
        if (res.code == 0) {
          this.bedrooms = [{ key: 'ALL' }, ...res.datas.bedrooms]
          this.buildings = res.datas.building
          this.form.building = this.buildings[0].key || ''
          this.queryProjectSet(this.form.projectId)
          this.refreshFn()
        }
      })
    },
    queryTableList() {
      let data = {
        projectId: this.form.projectId,
        building: this.form.building,
      }
      this.statusObj = []
      this.$Posting(this.$api.queryTableList, data).then((res) => {
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
      this.interestId = ''
      if (this.$refs.drawDom) {
        this.$refs.drawDom.queryInterestQueue()
        this.$refs.drawDom.queryProjectSalesByBroke()
        this.$refs.drawDom.getUnitRoleAccess()
      }
    },
    showPopup(unit) {
      if (unit.purchaseStatus) {
        this.unitObj = unit
        this.$refs.popup.show = true
      }
    },
    getInterestId(val) {
      // console.log('收到了交易ID', val)
      this.interestId = val
    },
    async queryProjectSet(id) {
      let res = await this.$Get(this.$api.queryProjectSet, { projectId: id })
      if (res.code == 0) {
        this.launchStatus = res.datas.projectSet.launchStatus
      }
    },
  },
  destroyed() {
    socket.close()
    console.log('==> 关闭连接前 <==', socket)
    socket = null
    console.log('==> socket连接已经关闭 <==', socket)
  },
}

window.onbeforeunload = function () {
  if (socket) {
    socket.close()
  }
}
</script>

<style lang="less">
.SalesChart {
  height: 100%;
  .SalesChart_box {
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
        overflow-y: auto;
        overflow-x: auto;
        .horizontalScale {
          white-space: nowrap;
          padding-left: 50px;
          .Scale {
            display: inline-block;
            width: 100px;
            text-align: center;
            border-right: 1px solid #f4f4f4;
            border-bottom: 1px solid #f4f4f4;
            padding: 5px;
            box-sizing: border-box;
          }
        }
        .verticalScale {
          white-space: nowrap;
          height: 80px;
          font-size: 0;
          .leftScale {
            width: 50px;
            height: 80px;
            line-height: 80px;
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
            width: 100px;
            height: 80px;
            text-align: center;
            line-height: 80px;
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
              h1,
              p {
                font-size: 12px;
              }
              h2 {
                margin-bottom: 5px;
                font-size: 14px;
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
  &.show_drawLots {
    display: flex;
    .SalesChart_box {
      min-width: 780px;
      width: 59.5%;
      margin-right: 1%;
      .demo-form-inline {
        .el-select--mini {
          width: 120px;
        }
      }
    }
    .drawLots_box {
      width: 39.5%;
      min-width: 400px;
      overflow-x: auto;
    }
  }
}
</style>