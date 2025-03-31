<template>
  <div class="architect_wrapper">
    <div class="architect_section">
      <el-row class="row_header">
        <el-col :span="22" class="col_text"
          ><span>选择项目：</span>
          <el-select @change="selectProject" size="mini" v-model="projectId">
            <el-option
              v-for="(item, index) in projects"
              :key="index"
              :label="item.projectName"
              :value="item.projectId"
            ></el-option> </el-select
        ></el-col>
        <el-col :span="2" class="col_button">
          <el-button size="mini" @click="createProgress()">创建进度 </el-button>
        </el-col>
      </el-row>
      <div>更新记录</div>
      <el-table :data="progressList" border style="width: 100%; height: 600px">
        <el-table-column prop="building" label="楼栋" width="90"> </el-table-column>
        <el-table-column prop="unitNo" label="单位" width="180">
        </el-table-column>
        <el-table-column  label="通知状态"> 
          <template slot-scope="scope">
            <span v-if="scope.row.status == 1">待通知</span>
            <span v-else-if="scope.row.status == 2">已通知</span>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="进度"> </el-table-column>
        <el-table-column label="更新时间"> 
          
          <template slot-scope="scope">
            <div>{{ $dateFormat(Number(scope.row.createTime)) }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="path" width="240" label="文件">
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status != 2" @click="updateProgress(scope.row)" type="text" size="mini"
              >编辑</el-button
            >
            <el-button v-if="scope.row.status != 2" type="text" size="mini" @click="updateStatus(scope.row)"
              >通知律师</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPageNo"
          :page-size="100"
          layout="total, prev, pager, next"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
    <el-dialog title="创建进度" :visible.sync="dialogFormVisible" width="867px">
      <el-form :model="form">
        <el-form-item label="进度" :label-width="formLabelWidth">
          <el-select
            @change="selectProgressKey"
            size="mini"
            v-model="progressKey"
            placeholder="请选择"
          >
            <el-option
              v-for="item in progressKeys"
              :key="item.key"
              :label="item.title"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="进度描述" :label-width="formLabelWidth">
          <ul class="progress_desc_list">
            <li v-for="(desc, index) in progressDesc">{{desc}}</li>
          </ul>
        </el-form-item>
        <el-form-item label="更新范围" :label-width="formLabelWidth">
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
              <el-checkbox
                v-for="(unit, unitIndex) in building.unitList"
                v-model="unit.checked"
                :key="unitIndex"
                >{{ unit.unitName }}</el-checkbox
              >
            </el-tab-pane>
          </el-tabs>
        </el-form-item>
        <el-form-item label="进度证明" :label-width="formLabelWidth">
          <uploader
            :maxSize="300"
            :isDisabled="true"
            :fileId="'architect1'"
            :uploadParam="uploadModelParam"
            @uploadAfter="uploadModelAfter"
            :url="$api.uploadFile"
            fileType="*"
            :btnText="{ import: '上传文件' }"
            :showType="1"
          ></uploader>
          <p>{{logoUrl}}</p>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitUpload">提交</el-button>
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
      formLabelWidth: '120px',
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
    }
  },
  created() {
    this.getProjectList()
    this.getProgressKeys()
  },
  methods: {
    getQueryProgressList() {
      this.$Geting(this.$api.queryProgressList, {
        pageNo: this.currentPageNo,
        pageSize: 10,
        projectId: this.projectId,
      }).then((res) => {
        if (res.code == 0) {
          this.progressList = res.datas.lists
          this.total = res.datas.count
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
      this.$Geting(this.$api.queryProgressUnit, {projectId: this.projectId, key: this.progressKey}).then((res) => {
        if (res.code == 0) {
          res.datas.forEach((scope, scopeIndex)=>{
            scope.name = 'index' + scopeIndex
            scope.unitList.forEach((unit, unitIndex)=>{
              unit.checked = unit.ischeck=='0'?false:true
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
      this.$confirm('通知律师后、当前内容将不能更改、请谨慎操作 ！！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
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
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    uploadModelAfter(data) {
      this.logoUrl = data.filePath;
      console.log(data, "123");
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
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
        margin-bottom: 20px;
      }
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