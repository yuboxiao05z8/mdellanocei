<template>
  <div class="lottery-wrap" id="lottery-content">
    <div class="setting-box">
      <p class="el-icon-s-tools" @click="setPageSize()"></p>
      <img v-if="full==='on'" src="../../assets/images/icon/amplification.png" alt="" @click="fullScreen('off')">
      <img v-else src="../../assets/images/icon/shrink.png" alt="" @click="fullScreen('on')">
    </div>
    <div class="lottery-left">
      <div class="lotterying-list">
        <div class="lottery-card" v-for="(item, index) in drawList" :key="index">
          <div class="pageContent" :class="ifShow[index] ? 'screen-left' : 'screen-right'">
            <p class="buyer-number">No.{{item.ballotNum}}</p>
            <p class="buyer-name">{{item.buyerName}}</p>
            <p class="buyer-agent">{{item.brokeName}}</p>
            <p class="buyer-loa">{{item.loa}}</p>
          </div>
          <div class="pageContent cardBack" :class="!ifShow[index] ? 'screen-left' : 'screen-right'" :show="ifShow[index]">
          </div>
        </div>
      </div>
      <p class="lottery-title">抽取记录</p>
      <div class="lotteryed-list"> 
        <el-table
          :data="tableData"
          style="width: 100%">
          <el-table-column
            label="Queue No."
            prop="ballotNum"
            width="180">
          </el-table-column>
          <el-table-column
            prop="loa"
            label="LOA"
            width="180">
          </el-table-column>
          <el-table-column
            prop="brokeName"
            label="Buyer Name">
          </el-table-column>
          <el-table-column
            prop="building"
            label="Agency">
          </el-table-column>
          <el-table-column
            prop="agentName"
            label="Agent Name">
          </el-table-column>
          <el-table-column
            label="Time"> 
            <template slot-scope="scope">
              <span>{{$dateFormat(scope.row.createTime)}}</span>
            </template>
          </el-table-column>
        </el-table>
        <p class="show-more" @click="queryMore()">
          查看更多...
        </p>
      </div>
    </div>
    <div class="lottery-right">
      <p class="right-title">{{projectBean.projectName}} 选房顺序抽取</p>
      <div class="project-box">
        <img :src="imgUrl + projectBean.mainImage" alt="">
        <p class="project-time">
          <span>开盘时间:</span>
          <span>{{$dateFormatNoTime(projectBean.launchDate)}}</span>
        </p>
        <p class="project-agent">
          <span>开发商:</span>
          <span>{{projectBean.developer}}</span>
        </p>
      </div>
      <div class="count-box">
        <div class="total">
          <p>{{drawCount.num}}</p>
          <p>总人数</p>
        </div>
        <div class="to-lottery">
          <p>{{drawCount.no_draw_num}}</p>
          <p>待抽取</p>
        </div>
        <div class="lotteryed">
          <p>{{drawCount.draw_num}}</p>
          <p>已抽取</p>
        </div>
      </div>
      <p class="start-lottery" :class="{'nolottery':drawCount.no_draw_num<=0}" @click="drawInterestBuyer">
        开始抽取
      </p>
      <div class="switch-box">
        <span>自动抽取: </span>
        <el-switch
          v-model="value1"
          active-color="#13ce66"
          >
        </el-switch>
      </div>
    </div>
    <el-dialog
      title="设置"
      :visible.sync="centerDialogVisible"
      width="30%"
      center>
      <div class="demo-input-suffix">
        <p class="pagesize-title">一次抽取人数</p>
        <el-input
          type="number"
          size="mini"
          v-model="value"
          max="5"
          min="1">
        </el-input>
        <p class="pagesize-title">个(最大5个、最少1个)</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableData: [],
      value1: false,
      pageSize: 5,
      value: 5,
      projectId: "",
      ifShow: [false, false, false, false, false],
      isReset: false,
      projectBean: {},
      drawCount: {},
      imgUrl: "",
      centerDialogVisible: false,
      drawList: [{}, {}, {}, {}, {}],
      timer: null,
      full: 'on'
    }
  },
  mounted(){
    this.projectId = this.$route.query.id
    this.imgUrl = sessionStorage.getItem('serveUrl')
    this.queryDrawInfo()
    this.queryInterest()
  },
  methods: {
    /**
     * 抽到的买家列表
     */
    drawInterestBuyer(){
      let self = this
      clearInterval(self.timer)
      if(this.drawCount.no_draw_num>0){
        this.$PostHasSign(this.$api.drawInterestBuyer, {
          pageSize: this.pageSize,
          projectId: this.projectId
        })
        .then(res=>{
          if(res.code==='0'){
            this.drawList = res.datas
            this.startLottery()
          }
        })
      }else{
        clearInterval(self.timer)
      }
      if(self.value1){
        self.timer = setInterval(()=>{
          self.drawInterestBuyer()
        }, 5000)
      }else{
        clearInterval(self.timer)
      }
    },
    /**
     * 获取项目信息
     */
    queryDrawInfo(){
      let self = this
      this.$GetHasSign(self.$api.queryDrawInfo, {
        projectId:self.projectId
      })
      .then(res=>{
        if(res.code==='0'){
          if(res.datas.draw.length>0)self.drawCount = res.datas.draw[0];
          if(self.drawCount.no_draw_num<=5&&self.drawCountno_draw_num>0){
            self.pageSize = self.drawCountno_draw_num
          }else if(self.drawCountno_draw_num<=0){
            clearInterval(this.timer)
          }
          self.projectBean = res.datas.projectBean
        }
      })
    },
    /**
     * 翻牌
     */
    startLottery(){
      let self = this
      if(this.isReset){
        this.reset()
        setTimeout(()=>{
          for(let i=0; i<self.pageSize; i++){
            setTimeout(()=>{
              self.$set(self.ifShow, i, true)
            }, 600*i)
          }
        }, 1000)
      }else{
        for(let i=0; i<self.pageSize; i++){
          setTimeout(()=>{
            self.$set(self.ifShow, i, true)
          }, 600*i)
        }
      }
      this.isReset = true
      this.queryDrawInfo()
      this.queryInterest()
    },
    /**
     * 重置牌
     */
    reset(){
      let self = this
      for(let i=0; i<self.pageSize; i++){
          self.$set(self.ifShow, i, false)
      }
    },
    setPageSize(){
      this.centerDialogVisible = true
    },
    /**
     * 已经抽中的买家列表
     */
    queryInterest() {
      let data = {
        pageNo: 1,
        pageSize: 5,
        projectId: this.$route.query.id,
        drawStatus: 'YES'
      }
      this.$Posting(this.$api.queryInterest, data).then((res) => {
        if (res.code == 0) {
          this.tableData = res.datas.lists
        }
      })
    },
    indexMethod(index){
      return this.tableData.length-index
    },
    confirm(){
      let self = this
      this.pageSize = this.value;
      this.drawList = []
      for(let i=0; i<this.pageSize; i++){
        this.drawList.push({})
        self.$set(self.ifShow, i, false)
      }
      this.centerDialogVisible = false
    },
    queryMore(){
      this.$router.go(-1)
    },
    fullScreen(full){
      this.full=full
      if(full==='off'){
        var element = document.getElementById("lottery-content");
        var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;
        requestMethod.call(element);
      }else{
        var elem = document;
        if (elem.webkitCancelFullScreen) {
        elem.webkitCancelFullScreen();
        } else if (elem.mozCancelFullScreen) {
        elemd.mozCancelFullScreen();
        } else if (elem.cancelFullScreen) {
        elem.cancelFullScreen();
        } else if (elem.exitFullscreen) {
        elem.exitFullscreen();
        } else {
        //浏览器不支持全屏API或已被禁用
        };
      }
    }
  }
}
</script>
<style lang="less" scoped>
.lottery-wrap{
  display: flex;
  width: 100%;
  height: 100%;
  background: #fff;
  overflow: auto;
  position: relative;
  justify-content: center;
  align-items: center;
  .setting-box{
    position: absolute;
    top: 10px;
    right: 10px;
    display: flex;
    .el-icon-s-tools::before{
      font-size: 24px;
    }
    img{
      margin-left: 20px;
      width: 24px;
      cursor: pointer;
    }
  }
  .lottery-left{
    .lotterying-list{
      width: 900px;
      height: 270px;
      border: 2px dashed rgba(0, 210, 200, 100);
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: space-around;
      .lottery-card{
        width: 159px;
        height: 220px;
        text-align: center;
        font-size: 18px;
        font-family: SourceHanSansSC-regular; 
        position: relative;
        transform-style: preserve-3d;
        .pageContent{
          border-radius: 15px;
          background-color: rgba(255, 255, 255, 100);
          box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.4);
          width: 100%;
          height: 100%;
          overflow: hidden;
          display: block;
          position: absolute; 
          transition: all 0.6s linear;
          backface-visibility: hidden;  
        }
        .cardBack{
          background: #f2898b;
        }
        .screen-left{
          transform:  rotate(0);
        }
        .screen-right {
          transform:  rotateY(180deg);
        }
        .buyer-number{
          color: rgba(215, 100, 102, 100);
          margin-top: 38px;
        }
        .buyer-name{
          height: 27px;
          color: rgba(4, 30, 66, 100);
          margin-top: 22px;
          font-weight: 600;
        }
        .buyer-agent{
          color: rgba(215, 100, 102, 100);
          font-size: 14px;
          height: 20px;
          line-height: 20px;
        }
        .buyer-loa{
          height: 24px;
          color: rgba(215, 100, 102, 100);
          font-size: 16px;
        }
      }
    }
    .lottery-title{
      height: 20px;
      color: rgba(16, 16, 16, 100);
      font-size: 14px;
      margin: 44px 0px 13px;
    }
    .lotteryed-list{
      width: 881px;
      border-radius: 15px;
      text-align: center;
      box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.4);
      padding: 13px 17px;
      background: #fff;
      .show-more{
        height: 30px;
        line-height: 30px;
        width: 100px;
        margin: 0 auto;
        color: rgba(0, 210, 200, 100);
        cursor: pointer;
      }
    }
  }
  .lottery-right{
    width: 400px;
    margin-left: 100px;
    .right-title{
      height: 29px;
      color: rgba(4, 30, 66, 100);
      font-size: 20px;
      font-family: Arial-bold;
      text-align: center;
      margin-bottom: 53px;
    }
    .project-box{
      width: 381px;
      height: 287px;
      border-radius: 15px;
      box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.4);
      overflow: hidden;
      color: rgba(16, 16, 16, 100);
      font-size: 14px;
      font-family: Arial-regular;
      img{
        width: 100%;
        height: 193px;
      }
      .project-time{
        height: 16px;
        margin-top: 11px;
        text-indent: 16px;
      }
      .project-agent{
        height: 16px;
        margin-top: 5px;
        text-indent: 16px;
      }
    }
    .count-box{
      margin: 67px 0px;
      width: 381px;
      height: 126px;
      border-radius: 15px;
      box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.4);
      display: flex;
      justify-content: space-around;
      align-items: center;
      div{
        p{
          text-align: center;
          height: 27px;
          color: rgba(0, 210, 200, 100);
          font-size: 18px;
        }
      }
      .to-lottery{
        p{
          color: rgba(249, 173, 3, 88);
        }
      }
      .lotteryed{
        p{
          color: rgba(164, 164, 164, 96);
        }
      }
    }
    .start-lottery{
      width: 381px;
      height: 138px;
      border-radius: 15px;
      background-color: rgba(242, 137, 139, 100);
      color: rgba(255, 255, 255, 100);
      font-size: 28px;
      box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.4);
      font-family: Microsoft Yahei;
      line-height: 138px;
      text-align: center;
      cursor: pointer;
    }
    .nolottery{
      background: #ccc;
    }
    .switch-box{
      margin-top: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .demo-input-suffix{
    display: flex;
    align-items: center;
    justify-content: center;
    .pagesize-title{
      height: 20px;
      color: rgba(0, 0, 0, 0.65);
      font-size: 14px;
      text-align: left;
      font-family: PingFangSC-regular;
    }
    .el-input{
      width: 100px;
      margin: 0px 10px;
    }
  }
}
</style>