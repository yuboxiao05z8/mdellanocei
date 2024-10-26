<template>
  <div class="edit_map">
    <!-- <h1 class="hint_site">
      {{$t('editMap.currentPage')}}: {{$t('editMap.inventory')}} > {{$t('editMap.plans')}} > {{$t('editMap.editMapping')}}
      <el-button
        size="mini"
        type="info"
        class="btn el-icon-back"
        @click="goBack"
      >{{$t('editMap.goBack')}}</el-button>
    </h1>-->
    <div class="project_title">
      <el-row>
        <el-col :span="8">
          <el-button
            size="mini"
            type="info"
            class="btn el-icon-back"
            @click="goBack"
          >{{$t('editMap.goBack')}}</el-button>
        </el-col>
        <el-col :span="8" class="project_name">
          {{projectName}}: {{$route.query.name}}
        </el-col>
        <el-col :span="8" style="text-align:right">
          <el-button @click="upGraphicsInfoData" size="mini">{{$t('editMap.saveAllChanges')}}</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="top_form">
      <el-row>
        <el-col :span="12">
          <el-radio-group v-model="drawType">
            <el-radio :label="'rect'">{{$t('editMap.drawRect')}}</el-radio>
            <el-radio :label="'circle'">{{$t('editMap.drawCircle')}}</el-radio>
            <el-radio :label="'triangle'">{{$t('editMap.drawTriangle')}}</el-radio>
          </el-radio-group>
          <el-button
            size="mini"
            @click="createGraphicsBtn"
            style="margin-left:10px;"
          >{{$t('editMap.generatingGraphics')}}</el-button>
        </el-col>
        <el-col :span="12" style=" text-align: right;">
          <el-button @click="Copy" size="mini">{{$t('editMap.copySharp')}}</el-button>
          <el-button @click="Paste" size="mini">{{$t('editMap.pasteSharp')}}</el-button>
          <el-button @click="del" size="mini">{{$t('editMap.eraseSelectedSharp')}}</el-button>
          <el-button @click="AllDel" size="mini">{{$t('editMap.clearAll')}}</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="map_section">
      <canvas id="canvas"></canvas>
    </div>
    <div class="bottom_form">
      <el-form :inline="true" size="mini">
        <el-row>
          <el-col :span="13">
            <el-form-item :label="$t('editMap.startingX')">
              <el-input class="width_80px" v-model="graphicsInfo.startX" readonly></el-input>
            </el-form-item>
            <el-form-item :label="$t('editMap.startingY')">
              <el-input class="width_80px" v-model="graphicsInfo.startY" readonly></el-input>
            </el-form-item>
            <el-form-item :label="$t('editMap.width')">
              <el-input class="width_80px" v-model="graphicsInfo.width" readonly></el-input>
            </el-form-item>
            <el-form-item :label="$t('editMap.height')">
              <el-input class="width_80px" v-model="graphicsInfo.height" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" style=" text-align: right;">
            <el-form-item :label="$t('editMap.sharpName')" v-if="isShowBuilding||isShowUnit">
              <el-select
                v-model="building"
                @change="getUnitList(building)"
                filterable
                placeholder="Select Building"
                v-if="isShowBuilding"
              >
                <el-option
                  v-for="(v,k) in buildingList"
                  :key="k"
                  :label="v.sitePlanName"
                  :value="v.buildId"
                ></el-option>
              </el-select>
              <el-select v-model="unit" placeholder="Select Unit" filterable v-if="isShowUnit">
                <el-option v-for="(v,k) in unitLits" :key="k" :label="v.unitName" :value="v.unitId"></el-option>
              </el-select>
            </el-form-item>
            <el-button @click="SetUrl" size="mini">{{$t('editMap.save')}}</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      projectName:
        JSON.parse(sessionStorage.getItem('projectDesc') || '{}').name || '',
      id: JSON.parse(sessionStorage.getItem('projectDesc') || '{}').id || '',
      drawType: 'rect',
      graphicsInfo: {},
      building: '',
      unit: '',
      isSave: false,
      params: null,
      isShowBuilding: false, //是否展示building选择框
      isShowUnit: false, //是否展示unit选择框,
      buildingList: [],
      unitLits: [],
      infoData: {},
      RectArr: [],
      CircleArr: [],
      TriangleArr: [],
      RectNum: -1,
      CircleNum: -1,
      TriangleNum: -1,
      oldBuildingID: '',
      oldUnitID: ''
    }
  },
  mounted() {
    this.params = this.$route.query
    this.judgeShowBuildingAndUnit()
    this.getUnitInfoData()
    // console.log('测试',this.params)
  },
  methods: {
    goBack() {
      this.$router.replace('/Inventory/inventoryChildren/plan')
      // if (this.isSave) {
      //   this.$router.replace("/home/plan.html");
      // } else {
      //   this.$confirm(
      //     "数据未保存，是否继续退出页面?",
      //     this.$t("alert.alert_command"),
      //     {
      //       confirmButtonText: this.$t("alert.sure"),
      //       cancelButtonText: this.$t("alert.cancel"),
      //       type: "warning"
      //     }
      //   ).then(() => {
      //     this.$router.replace("/home/plan.html");
      //   });
      // }
    },
    getUnitInfoData() {
      this.$Get(this.$api.querySitePlanDetail, {
        sitePlanId: this.params.id
      }).then(res => {
        if (res.code == 0) {
          this.infoData = res.datas
          this.drawCanvas(this.infoData)
        } else {
          this.$notify.error({
            title: 'fail',
            message: res.msg
          })
          return false
        }
      })
    },
    drawCanvas(data) {
      let self = this,
        url = sessionStorage.getItem('serveUrl')
      if (data) {
        let imgs = url + data.img
        self.canvas = new fabric.Canvas('canvas', {
          width: parseInt(data.imgWidth),
          height: parseInt(data.imgHeight),
          selection: false
        })
        fabric.Image.fromURL(imgs, function(oImg) {
          // 背景
          oImg.set({
            width: self.canvas.width,
            height: self.canvas.height,
            originX: 'left',
            originY: 'top'
          })
          self.canvas.setBackgroundImage(
            oImg,
            self.canvas.renderAll.bind(self.canvas)
          )
        })
        if (data.content) {
          let infoData = JSON.parse(data.content)
          for (let i = 0; i < infoData.length; i++) {
            self.addShape(infoData[i].type, infoData[i])
          }
          // console.log("222222", infoData);
        }
      }
    },
    createGraphicsBtn() {
      this.addShape(this.drawType)
    },
    addShape(type, objType) {
      // 创建图形
      let self = this,
        num,
        commonData = {}
      if (!objType) {
        // 是创建
        commonData = {
          left: 50,
          top: 20,
          width: 50,
          height: 50,
          fill: 'rgba(220,20,60,0.4)',
          lockRotation: true,
          transparentCorners: false,
          hasRotatingPoint: false,
          hasBorders: false,
          cornerColor: 'blue',
          cornerStyle: 'circle'
        }
      } else {
        // 是读取
        commonData = {
          left: parseFloat(objType.left),
          top: parseFloat(objType.top),
          width: parseFloat(objType.width),
          height: parseFloat(objType.height),
          ulrSite: objType.ulrSite,
          name: objType.name,
          fill: objType.fill,
          lockRotation: true,
          transparentCorners: false,
          hasRotatingPoint: false,
          hasBorders: false,
          cornerColor: 'blue',
          cornerStyle: 'circle'
        }
        if (objType.radius) {
          // 如果是圆形数据
          commonData.radius = parseFloat(objType.radius)
          commonData.scaleY = parseFloat(objType.scaleY)
          commonData.scaleX = parseFloat(objType.scaleX)
        }
        if (objType.buildingID !== '') {
          commonData.buildingID = objType.buildingID
        }
        if (objType.unitID !== '') {
          commonData.unitID = objType.unitID
        }
        if (objType.sitePlanID !== '') {
          commonData.sitePlanID = objType.sitePlanID
        }
        if (objType.sitePlanName !== '') {
          commonData.sitePlanName = objType.sitePlanName
        }
      }
      switch (type) {
        case 'rect': // 方形
          self.RectNum++
          num = self.RectNum
          self.RectArr[num] = new fabric.Rect(commonData)
          if (!self.RectArr[num].name) {
            self.RectArr[num].name = 'Rect' + num
          }
          self.canvas.add(self.RectArr[num])
          self.addOnSelected(self.RectArr[num])
          break
        case 'circle': // 圆形
          self.CircleNum++
          num = self.CircleNum
          if (!commonData.radius) {
            commonData.radius = 30
          }
          self.CircleArr[num] = new fabric.Circle(commonData)
          if (!self.CircleArr[num].name) {
            self.CircleArr[num].name = 'Circle' + num
          }
          self.canvas.add(self.CircleArr[num])
          self.addOnSelected(self.CircleArr[num])
          break
        case 'triangle': // 三角
          self.TriangleNum++
          num = self.TriangleNum
          self.TriangleArr[num] = new fabric.Triangle(commonData)
          if (!self.TriangleArr[num].name) {
            self.TriangleArr[num].name = 'Triangle' + num
          }
          self.canvas.add(self.TriangleArr[num])
          self.addOnSelected(self.TriangleArr[num])
          break
      }
    },
    addOnSelected(obj) {
      // 绑定事件
      let _this = this
      obj.on('selected', function() {
        let self = this
        _this.graphicsInfo = {
          // 获取必要参数
          width: (self.scaleX * self.width).toFixed(0),
          height: (self.scaleY * self.height).toFixed(0),
          startY: self.top.toFixed(0),
          startX: self.left.toFixed(0),
          buildingID: self.buildingID,
          sitePlanID: self.sitePlanID,
          unitID: self.unitID
        }
        console.log(_this.graphicsInfo, '点击')
        if (self.buildingID !== '' && _this.$route.query.type !== 'building') {
          if (self.buildingID) {
            _this.building = self.buildingID
            _this.getUnitList(self.buildingID)
            _this.oldBuildingID = self.buildingID
          } else {
            _this.building = _this.oldBuildingID
            _this.getUnitList(_this.building)
          }
          console.log(self.buildingID, '漏洞')
        } else if (self.buildingID === undefined) {
          _this.building = ''
        }
        if (self.sitePlanName) {
          _this.graphicsInfo.sitePlanName = self.sitePlanName
        }
        if (self.unitID) {
          _this.unit = self.unitID
          _this.oldUnitID = self.unitID
        } else if (self.unitID === undefined) {
          console.log(self.unitID, 'unitID')
          _this.unit = _this.oldUnitID
        }
        // console.log(_this.graphicsInfo,obj);
      })
    },
    SetUrl() {
      // 设置URL
      if (!this.canvas.getActiveObject()) {
        this.$notify.error({
          title: 'fail',
          message: this.$t('editMap.noChooseGraphics')
        })
        return
      } else {
        if (this.building !== '') {
          let sitePlanID, sitePlanName
          for (let i = 0; i < this.buildingList.length; i++) {
            if (this.buildingList[i].buildId === this.building) {
              sitePlanID = this.buildingList[i].sitePlanId
              sitePlanName = this.buildingList[i].sitePlanName
            }
          }
          // console.log('111', sitePlanID, sitePlanName)
          this.canvas.getActiveObject().buildingID = this.building
          this.canvas.getActiveObject().sitePlanID = sitePlanID
          this.canvas.getActiveObject().sitePlanName = sitePlanName
        }

        if (this.unit !== '') {
          // console.log('222', this.unit)
          this.canvas.getActiveObject().unitID = this.unit
        } else {
          this.canvas.getActiveObject().unitID = ''
        }
      }
      // console.log(this.canvas.getActiveObject())
    },
    Copy() {
      // 复制
      if (!this.canvas.getActiveObject()) {
        this.$notify.error({
          title: 'fail',
          message: this.$t('editMap.noChooseGraphics')
        })
        return
      }
      this.canvas.getActiveObject().clone(cloned => {
        this._clipboard = cloned
      })
      // console.log(this.canvas.getActiveObject());
    },
    Paste() {
      // 粘贴
      let self = this
      if (!self._clipboard) {
        this.$notify.error({
          title: 'fail',
          message: this.$t('editMap.chooseCopy')
        })
        return
      }
      self._clipboard.clone(clonedObj => {
        self.canvas.discardActiveObject()
        clonedObj.set({
          left: clonedObj.left + 10,
          top: clonedObj.top + 10,
          evented: true,
          lockRotation: true,
          transparentCorners: false,
          hasRotatingPoint: false,
          hasBorders: false,
          cornerColor: 'blue',
          cornerStyle: 'circle'
        })
        if (clonedObj.type === 'activeSelection') {
          clonedObj.canvas = self.canvas
          clonedObj.forEachObject(obj => {
            self.canvas.add(obj)
          })
          clonedObj.setCoords()
        } else {
          switch (clonedObj.type) {
            case 'rect':
              self.RectNum++
              clonedObj.name = 'Rect' + self.RectNum
              self.RectArr[self.RectNum] = clonedObj
              self.addOnSelected(self.RectArr[self.RectNum]) // 添加监听方法
              break
            case 'circle':
              self.CircleNum++
              clonedObj.name = 'Circle' + self.CircleNum
              self.CircleArr[self.CircleNum] = clonedObj
              self.addOnSelected(self.CircleArr[self.CircleNum])
              break
            case 'triangle':
              self.TriangleNum++
              clonedObj.name = 'Triangle' + self.TriangleNum
              self.TriangleArr[self.TriangleNum] = clonedObj
              self.addOnSelected(self.TriangleArr[self.TriangleNum])
              break
          }
          self.canvas.add(clonedObj)
        }
        self._clipboard.top += 10
        self._clipboard.left += 10
        self.canvas.setActiveObject(clonedObj)
        self.canvas.requestRenderAll()
      })
    },
    del() {
      // 删除
      if (!this.canvas.getActiveObject()) {
        this.$notify.error({
          title: 'fail',
          message: this.$t('editMap.noChooseGraphics')
        })
        return
      }
      let el = this.canvas.getActiveObject()
      this.canvas.remove(el)
    },
    AllDel() {
      let self = this
      this.$confirm(
        this.$t('alert.alert_delete'),
        this.$t('alert.alert_command'),
        {
          confirmButtonText: this.$t('alert.sure'),
          cancelButtonText: this.$t('alert.cancel'),
          type: 'warning'
        }
      ).then(() => {
        let arr = self.canvas.getObjects()
        for (let i = 0; i < arr.length; i++) {
          self.canvas.remove(arr[i])
        }
      })
    },
    upGraphicsInfoData() {
      // 获取所有元素属性
      let data = this.canvas.getObjects(),
        arr = []
      for (let i = 0; i < data.length; i++) {
        arr[i] = {
          width: (data[i].scaleX * data[i].width).toFixed(0),
          height: (data[i].scaleY * data[i].height).toFixed(0),
          left: data[i].left.toFixed(0),
          top: data[i].top.toFixed(0),
          // angle: data[i].angle.toFixed(2),
          name: data[i].name,
          fill: data[i].fill,
          type: data[i].type
        }
        if (data[i].buildingID !== '') {
          arr[i].buildingID = data[i].buildingID
        }
        if (data[i].sitePlanID !== '') {
          arr[i].sitePlanID = data[i].sitePlanID
        }
        if (data[i].unitID !== '') {
          arr[i].unitID = data[i].unitID
        }
        if (data[i].sitePlanName !== '') {
          arr[i].sitePlanName = data[i].sitePlanName
        }
        if (data[i].radius) {
          arr[i].radius = data[i].radius.toFixed(2)
          arr[i].scaleY = data[i].scaleY.toFixed(2)
          arr[i].scaleX = data[i].scaleX.toFixed(2)
        }
      }
      // console.log(arr);
      this.$Posting(this.$api.updateSiteContent, {
        sitePlanId: this.params.id,
        content: JSON.stringify(arr)
      }).then(res => {
        if (res.code == 0) {
          this.$notify.success({
            title: this.$t('alert.alert_success_title'),
            message: this.$t('alert.operate_success_title')
          })
          this.isSave = true
        } else {
          this.$notify.error({
            title: 'fail',
            message: 'fail'
          })
          return false
        }
      })
    },
    judgeShowBuildingAndUnit() {
      // console.log(this.params);
      switch (this.params.type) {
        case 'siteplan':
          this.isShowBuilding = true
          this.getBuildingList()
          break
        case 'planeimg':
        case 'allbuilding':
          this.isShowBuilding = true
          this.isShowUnit = true
          this.getBuildingList()
          break
        case 'building':
          this.isShowUnit = true
          this.getUnitList(this.params.buildingName)
          break
      }
    },
    getUnitList(building) {
      //获取户型
      this.unit = ''
      if (this.params.type == 'siteplan') {
        return
      }
      // console.log('123',this.unit)
      if (!building) {
        this.unitLits = []
        return
      }
      this.$Get(this.$api.queryUnit, {
        projectId: this.id,
        building: building
      }).then(res => {
        if (res.code == 0) {
          this.unitLits = res.datas
          // console.log(this.unitLits);
        } else {
          this.$notify.error({
            title: 'fail',
            message: res.msg
          })
          return false
        }
      })
    },
    getBuildingList() {
      //获取楼盘
      this.$Get(this.$api.queryBuildingSitePlan, {
        projectId: this.id,
        pageSize: 10000,
        pageNo: 1
      }).then(res => {
        if (res.code == 0) {
          this.buildingList = res.datas
        } else {
          this.$notify.error({
            title: 'fail',
            message: res.msg
          })
          return false
        }
      })
    }
  }
}
</script>
<style lang="less">
.edit_map {
  min-height: 100%;
  background-color: #fff;
  .hint_site {
    border-bottom: 15px solid #f0f2f5;
    padding: 10px 5px;
    .btn {
      margin-left: 20px;
    }
  }
  .project_title {
    height: 60px;
    padding: 15px 30px;
    border-bottom: 1px solid #dcdfe6;
    border-top: 1px solid #dcdfe6;
    .project_name {
      font-weight: 200;
      line-height: 25px;
    }
  }
  .top_form {
    padding: 15px 30px;
  }
  .map_section {
    height: 500px;
    border: 1px solid #dcdfe6;
    margin: 0 15px;
    overflow: scroll;
    padding: 20px 0;
  }
  .bottom_form {
    padding: 15px 30px;
    .width_80px {
      width: 70px;
    }
  }
}
</style>


