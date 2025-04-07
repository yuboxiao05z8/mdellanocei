<template>
  <div class="architect_wrapper">
    <div class="architect_section">
      <el-row class="row_header">
        <el-col :span="22" class="col_text"
          ><span>{{$t('architect.project')}}：</span>
          <el-select @change="selectProject" size="mini" v-model="projectId">
            <el-option
              v-for="(item, index) in projects"
              :key="index"
              :label="item.projectName"
              :value="item.projectId"
            ></el-option> </el-select
        ></el-col>
        <el-col :span="2" class="col_button">
          <el-button size="mini" @click="createProgress()">{{$t('architect.addCompletionStatus')}} </el-button>
        </el-col>
      </el-row>
      <div class='progress_table_title'>{{$t('architect.recordUpdate')}}</div>
      <el-table :data="progressList" border height="600" ref='progressListTable' style="width: 100%;">
        <el-table-column prop="building" :label="$t('architect.building')"> </el-table-column>
        <el-table-column prop="unitNo" :label="$t('architect.unit')">
        </el-table-column>
        <el-table-column  :label="$t('architect.informStatus')" width="150"> 
          <template slot-scope="scope">
            <span v-if="scope.row.status == 1">{{$t('architect.pendingNotification')}}</span>
            <span v-else-if="scope.row.status == 2">{{$t('architect.notified')}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="title" :label="$t('architect.statusProgress')" width="220"> </el-table-column>
        <el-table-column :label="$t('architect.updateDate')"> 
          
          <template slot-scope="scope">
            <div>{{ $dateFormat(Number(scope.row.createTime)) }}</div>
          </template>
        </el-table-column>
        <el-table-column width="240" :label="$t('architect.file')">
          <template slot-scope="scope">
            <a v-if="scope.row.path" :href="hostUrl + scope.row.path" target="_blank">{{hostUrl + scope.row.path}}</a>
          </template>
        </el-table-column>
        <el-table-column :label="$t('architect.edit')" width="200">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status != 2" @click="updateProgress(scope.row)" size="mini"
              >{{$t('architect.edit')}}</el-button
            >
            <el-button v-if="scope.row.status != 2 && userRoleAccess['Confirm_Progressive_Status']>1" size="mini" @click="updateStatus(scope.row)"
              >{{$t('architect.informLawyer')}}</el-button
            >
          </template>
        </el-table-column>
      </el-table>
        <div class="page_section" v-if="total">
          <el-pagination
            background
            small
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPageNo"
            :page-sizes="[5, 10, 30, 50, 100]"
            :page-size="pageSize"
            layout="prev, pager, next,sizes,total"
            :total="total"
          ></el-pagination>
        </div>
    </div>
    <el-dialog :title="creatTitle" :visible.sync="dialogFormVisible" width="867px">
      <el-form :model="form">
        <el-form-item :label="$t('architect.statusProgress')" :label-width="formLabelWidth">
          <el-select
            @change="selectProgressKey"
            size="mini"
            v-model="progressKey"
            :placeholder="$t('architect.kindlySelect')"
          >
            <el-option
              v-for="item in progressKeys"
              :key="item.key"
              :label="item.title"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('architect.statusDescription')" :label-width="formLabelWidth">
          <ul class="progress_desc_list">
            <li v-for="(desc, index) in progressDesc">{{desc}}</li>
          </ul>
        </el-form-item>
        <el-form-item :label="$t('architect.selectionUpdate')" :label-width="formLabelWidth">
          <el-tabs
            v-model="activeName"
            type="card"
            @tab-click="handleClick"
            class="scope-wrap"
          >
            <el-tab-pane
              v-for="(building, buildingIndex) in scopeList"
              :label="building.building"
              :name="building.name"
              :key="buildingIndex"
            >
            <div v-for="(unit, unitIndex) in building.unitList">
              <el-checkbox
                v-model="unit.checked"
                v-show="unit.ischeck !== -1"
                :key="unitIndex"
                >{{ unit.unitName }}</el-checkbox
              ></div>
              
            </el-tab-pane>
          </el-tabs>
        </el-form-item>
        <el-form-item :label="$t('architect.completionCertificate')" :label-width="formLabelWidth">
          <uploader
            :maxSize="300"
            :isDisabled="true"
            :fileId="'architect1'"
            :uploadParam="uploadModelParam"
            @uploadAfter="uploadModelAfter"
            :url="$api.uploadFile"
            fileType="*"
            :btnText="{ import: $t('architect.uploadFile') }"
            :showType="1"
          ></uploader>
          <p v-if="logoUrl"><a :href="hostUrl + logoUrl" target="_blank" rel="noopener noreferrer">{{hostUrl + logoUrl}}</a></p>
          <p v-else>{{$t('architect.documentNotSelected')}}</p>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitUpload">{{$t('architect.update')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import uploader from '@/components/uploader' 
export default {
  components: {
    uploader,
  },
  data() {
    return {
      progressList: [], //项目进度列表
      dialogFormVisible: false,
      formLabelWidth: '180px',
      form: {
        name: '',
      },
      activeName: 'index0',
      scopeList: [],
      uploadModelParam: [
        {
          name: 'projectId',
          value:
            JSON.parse(sessionStorage.getItem('projectDesc') || '{}').id || '',
        },
        {
          name: 'type',
          value: 'progressImage',
        },
      ],
      currentPageNo: 1,
      pageSize: 10,
      projects: [], //项目列表
      projectId: '', //选择项目的id
      progressKey: '',//选择的进度key
      progressKeys: [], //进度下拉列表
      selectProgress: {}, //选中的进度
      progressDesc: [], //选中的进度说明
      hostUrl: sessionStorage.getItem("serveUrl") || "",
      logoUrl: '',
      total: 0,//项目进度列表数量
      id: '', //编辑所需id
      creatTitle: '', //创建弹框的标题
      userRoleAccess: {}, //用户权限
    }
  },
  created() {
    this.getProjectList()
    this.getProgressKeys()
  },
  methods: {
    async getUnitRoleAccess(){
      let projectId = this.projectId
      let agentId = JSON.parse(sessionStorage.getItem('userInfo') || '{}').agentId
      this.$Post(this.$api.getUnitRoleAccess, {
        projectId: projectId,
        agentId: agentId,
      }).then((res) => {
        if (res.code == 0) {
          this.userRoleAccess = res.datas
        }
      })
    },
    async getQueryProgressList() {
      await this.getUnitRoleAccess()
      this.$Geting(this.$api.queryProgressList, {
        pageNo: this.currentPageNo,
        pageSize: this.pageSize,
        projectId: this.projectId,
      }).then((res) => {
        if (res.code == 0) {
          this.progressList = res.datas.lists
          this.total = res.datas.count
          this.$refs.progressListTable.doLayout()
        } else {
          this.$notify.error({
            title: this.$t('alert.fail'),
            message: this.$t('alert.alert_fail_delete_title'),
          })
        }
      })
    },
    //获取项目列表
    getProjectList() {
      this.$Geting(this.$api.queryProject, { pageSize: 10000, pageNo: 1 }).then(
        (res) => {
          if (res.code == 0) {
            this.projects = res.datas.lists
            this.projectId = res.datas.lists[0].projectId
            this.getQueryProgressList()
          } else {
            this.$notify.error({
              title: 'fail',
              message: res.msg,
            })
            return false
          }
        }
      )
    },
    getProgressKeys() {
      this.$Geting(this.$api.queryProgressKey).then((res) => {
        if (res.code == 0) {
          this.progressKeys = res.datas
          // this.progressKey = res.datas[0].key
          // this.selectProgressKey(this.progressKey)
        } else {
          this.$notify.error({
            title: 'fail',
            message: res.msg,
          })
          return false
        }
      })
    },
    createProgress() {
      this.dialogFormVisible = true
      this.resetCreat()
    },
    selectProject(val) {
      this.projectId = val
      this.getQueryProgressList()
    },
    selectProgressKey(val) {
      this.selectProgress = this.progressKeys.filter((item) => {
        return item.key === val
      })[0]
      this.progressDesc = this.selectProgress.desc.split(',')
      this.getProgressUnit()
    },
    getProgressUnit(){
      let param = {
        projectId: this.projectId, 
        key: this.progressKey
      }
      if(this.id){
        param.id = this.id
      }
      this.$Geting(this.$api.queryProgressUnit, param).then((res) => {
        if (res.code == 0) {
          res.datas.forEach((scope, scopeIndex)=>{
            scope.name = 'index' + scopeIndex
            scope.unitList.forEach((unit, unitIndex)=>{
              unit.checked = unit.ischeck=='1'?true:false
            })
          })
          this.scopeList = res.datas
        } else {
          this.$notify.error({
            title: 'fail',
            message: res.msg,
          })
          return false
        }
      })
    },
    handleClick(tab, event) {
      this.dialogFormVisible = true
      console.log(tab, event)
    },
    resetCreat(){
      this.progressKey = ''
      this.logoUrl = ''
      this.id = ''
      this.creatTitle = this.$t('architect.addCompletionStatus')
      this.progressDesc = []
      this.scopeList = []
    },
    // 创建进度提交
    submitUpload() {
      let buildList = []
      let unitNo = []
      let unitIdList = []
      this.scopeList.forEach((scope, scopeindex)=>{
        let building = scope.building
        scope.unitList.forEach((unit, unitIndex)=>{
          if(unit.checked){
            if(!buildList.includes(building)){
              buildList.push(building)
            }
            unitNo.push(unit.unitName)
            unitIdList.push(unit.unitId)
          }
        })
      })
      let param = {
        key: this.progressKey,
        projectId: this.projectId,
        status: 1,
        path: this.logoUrl,
        unitNo: unitNo.join(','),
        building: buildList.join(','),
        unitId: unitIdList.join(',')
      }
      if(this.id){
        param.id = this.id
      }
      this.$Posting(this.$api.saveProgress, param).then(res => {
        if (res.code == 0) {
          console.log(res)
          this.getQueryProgressList()
          this.dialogFormVisible = false
        } else {
          this.$notify.error({
            title: "fail",
            message: res.msg
          });
          return false;
        }
      });
      // 
    },
    //编辑进度
    updateProgress(row){
      this.progressKey = row.key
      this.logoUrl = row.path
      this.id = row.id
      this.creatTitle = this.$t('architect.edit')
      this.selectProgressKey(row.key)
      // this.getProgressUnit()
      this.dialogFormVisible = true
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    updateStatus(row) {
      this.$confirm(this.$t("architect.notifyingLawyer"), this.$t("architect.tip"), {
        confirmButtonText: this.$t("architect.confirm"),
        cancelButtonText: this.$t("architect.cancel"),
        type: 'warning',
      })
        .then(() => {
          let params = {
            id: row.id,
            status: 2
          }
          this.$Posting(this.$api.updateProgressStatus, params).then(res=>{
            if (res.code == 0) {
              this.getQueryProgressList()
            } else {
              this.$notify.error({
                title: "fail",
                message: res.msg
              });
              return false;
            }
          })
        })
        .catch(() => {
        })
    },
    uploadModelAfter(data) {
      this.logoUrl = data.filePath;
      console.log(data, "123");
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getQueryProgressList()
    },
    handleCurrentChange(val) {
      this.currentPageNo = val
      this.getQueryProgressList()
    },
  },
}
</script>

<style lang='less' scoped>
.architect_wrapper {
  background-color: #fff;
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  .architect_section {
    padding: 0px 30px 15px;
    &.general_lists {
      border-top: 1px solid #dcdfe6;
      position: absolute;
      top: 120px;
      bottom: 0;
      right: 0;
      left: 0;
      overflow-y: auto;
    }
    &.import_general {
      height: 120px;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
    }
    .row_header {
      margin-top: 58px;
      .col_text {
        margin-bottom: 10px;
        font-size: 14px;
      }
    }
    .progress_table_title{
      margin: 10px 0;
      font-size: 14px;
    }
  }
  /deep/.scope-wrap {
    width: 640px;
    .el-tabs__header {
      margin: 0;
    }
    .el-tab-pane {
      border: 1px solid #e4e7ed;
      border-top: none;
      padding: 0 15px;
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      .el-checkbox {
        flex: 0 0 64px;
        margin: 0;
        padding: 0 7px;
      }
    }
    .el-tabs__content{
      overflow: auto;
      height: 240px;
    }
  }
  .dialog-footer {
    text-align: center;
  }
  .progress_desc_list {
    list-style-type: none;
    line-height: 20px;
  }
}
</style>