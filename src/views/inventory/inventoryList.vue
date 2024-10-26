<template>
  <div class="inventory_list_wrapper">
    <div class="inventory_header">
      <el-row>
        <el-col :span="8">
          <span
            style="padding:8px 0;margin-right:15px"
          >{{$t('inventoryLists.manageProperties')}} ({{projectNum}})</span>
          <el-button size="mini" @click="getListData">{{$t('inventoryLists.refresh')}}</el-button>
        </el-col>
        <el-col :span="8">
          <uploader
            v-if="userInfo.accountType != 2"
            fileId="projectFileRelation"
            :maxSize="10"
            @uploadAfter="uploadAfterRelation"
            :url="$api.importProjectRelation"
            fileType=".xls,.xlsx"
            :btnText="{select:$t('inventoryLists.selectExcelFile'),import:'Import Relation'}"
          ></uploader>
        </el-col>
        <el-col :span="8" style="text-align:right">
          <uploader
            fileId="projectFile"
            v-if="userInfo.accountType != 2"
            :maxSize="10"
            @uploadAfter="uploadAfter"
            :url="$api.importProject"
            fileType=".xls,.xlsx"
            :btnText="{select:$t('inventoryLists.selectExcelFile'),import:$t('inventoryLists.importUsingFile')}"
          ></uploader>
          <el-button size="mini" @click="exportExcel">{{$t('inventoryLists.excelTemplate')}}</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="inventory_header">
      <el-input
        style="width:300px"
        size="mini"
        :placeholder="$t('inventoryLists.projectName')"
        v-model="searchName"
      ></el-input>
      
      <el-form v-if="userInfo.accountType != 2" ref="form" style="display: inline-block;margin:0 20px"  label-width="80px">
        <el-form-item size="mini" label="Allocated">
          <el-select v-model="allocated" placeholder="Allocated">
            <el-option label="ALL" value="ALL"></el-option>
            <el-option label="YES" value="YES"></el-option>
            <el-option label="NO" value="NO"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-button size="mini" @click="searchData">{{$t('inventoryLists.Search')}}</el-button>
    </div>
    <div class="inventory_list_table">
      <el-table :data="projectList" border style="width: 100%" size="mini">
        <el-table-column width="200" prop="projectName" :label="$t('inventoryLists.name')"></el-table-column>
        <el-table-column
          width="200"
          prop="propertyGroup"
          :label="$t('inventoryLists.propertyGroup')"
        ></el-table-column>
        <el-table-column width="200" prop="country" :label="$t('inventoryLists.country')"></el-table-column>
        <el-table-column width="200" prop="location" :label="$t('inventoryLists.location')"></el-table-column>
        <el-table-column width="200" prop="projectType" :label="$t('inventoryLists.type')"></el-table-column>
        <el-table-column width="200" label="Launch Date">
          <template slot-scope="scope">
            <div>{{$dateFormatNoTime(scope.row.launchDate)}}</div>
          </template>
        </el-table-column>
        <el-table-column width="200" label="Completion/TOP Date">
          <template slot-scope="scope">
            <div>{{$dateFormatNoTime(scope.row.completionDate)}}</div>
          </template>
        </el-table-column>
        <!-- <el-table-column width="200" prop="unitsNum" :label="$t('inventoryLists.numberOfUnits')"></el-table-column> -->
        <el-table-column width="100" :label="$t('inventoryLists.mobileSync')">
          <template slot-scope="scope">
            <i class="el-icon-check" v-if="scope.row.mobileSync == 'YES'"></i>
            <i class="el-icon-close" v-else></i>
          </template>
        </el-table-column>

        <el-table-column width="100" :label="$t('Allocated')" v-if="userInfo.accountType != 2">
          <template slot-scope="scope">
            <i class="el-icon-check" v-if="scope.row.self == 1"></i>
            <i class="el-icon-close" v-else></i>
          </template>
        </el-table-column>

        <el-table-column :label="$t('inventoryLists.edit')" fixed="right" width="400">
          <template slot-scope="scope">
            <el-button size="mini" plain @click="edit(scope.row)">{{$t('inventoryLists.edit')}}</el-button>
            <el-button
              :disabled="scope.row.self == 0 || userInfo.accountType == 2"
              size="mini"
              plain
              @click="rename(scope.row,'1')"
            >{{$t('inventoryLists.Rename')}}</el-button>
            <el-button
              size="mini"
              plain
              @click="rename(scope.row,'2')"
            >{{$t('inventoryLists.ModifyGroup')}}</el-button>
            <el-button
              size="mini"
              plain
              @click="syncFn(scope.row,'YES')"
              v-if="scope.row.self == 0 && scope.row.syncUnit == 'NO' && userInfo.isAdmin == 0"
            >{{$t('Sync')}}</el-button>
            <el-button
              size="mini"
              plain
              v-if="scope.row.self == 0 && scope.row.syncUnit == 'YES' && userInfo.isAdmin == 0"
              @click="syncFn(scope.row,'NO')"
            >{{$t('not Sync')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page_section" v-if="projectNum">
        <el-pagination
          background
          small
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-sizes="[5,10,30,50,100]"
          :page-size="pageSize"
          layout="prev, pager, next,sizes,total"
          :total="projectNum"
        ></el-pagination>
      </div>
    </div>
    <el-dialog :title="rTitle" :visible.sync="dialogVisible" width="500px">
      <el-input size="small" v-model="inputVal"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateName" size="small">{{$t('update')}}</el-button>
        <el-button @click="dialogVisible = false" size="small">{{$t('cancel')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import uploader from '@/components/uploader'
export default {
  components: {
    uploader
  },
  data() {
    return {
      projectList: [],
      currentPage: 1,
      pageSize: 10,
      projectNum: 0,
      dialogVisible: false,
      inputVal: '',
      projectId: '',
      searchName: '',
      rTitle: '',
      userInfo: JSON.parse(sessionStorage.getItem('userInfo')),
      allocated: ''
    }
  },
  mounted() {
    this.getListData()
  },
  methods: {
    searchData() {
      this.currentPage = 1
      this.getListData()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getListData()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getListData()
    },
    uploadAfter() {
      this.getListData()
    },
    uploadAfterRelation() {
      this.getListData()
    },
    rename(row, type) {
      switch (type) {
        case '1':
          this.inputVal = row.projectName
          this.rTitle = this.$t('inventoryLists.Rename')
          break

        default:
          this.rTitle = this.$t('inventoryLists.ModifyGroup')
          this.inputVal = row.propertyGroup
          break
      }
      this.dialogVisible = true
      this.projectId = row.projectId
    },
    updateName() {
      let api = ''
      let data = {}
      switch (this.rTitle) {
        case this.$t('inventoryLists.Rename'):
          api = this.$api.updateProjectName
          data = {
            projectId: this.projectId,
            projectName: this.inputVal
          }
          break

        default:
          api = this.$api.updatePropertyGroup
          data = {
            projectId: this.projectId,
            propertyGroup: this.inputVal
          }
          break
      }
      this.$Posting(api, data).then(res => {
        if (res.code == 0) {
          this.$notify.success({
            title: this.$t('alert.alert_success_title'),
            message: this.$t('alert.operate_success_title')
          })
          this.dialogVisible = false
          this.getListData()
        } else {
          this.$notify.error({
            title: 'fail',
            message: res.msg
          })
          return false
        }
      })
    },
    //获取列表数据
    getListData() {
      this.$Geting(this.$api.queryProject, {
        pageSize: this.pageSize,
        pageNo: this.currentPage,
        projectName: this.searchName,
        allocated: this.allocated == 'ALL'? '' : this.allocated
      }).then(res => {
        if (res.code == 0) {
          this.projectList = res.datas.lists
          this.projectNum = res.datas.count
        } else {
          this.$notify.error({
            title: 'fail',
            message: res.msg
          })
          return false
        }
      })
    },
    //导出数据
    exportExcel() {
      window.location.href = this.$addDownUrl(this.$api.exportProject)
    },
    edit(row) {
      //编辑表格
      this.$router.push({
        path: '/inventory/inventoryChildren',
        // query: {
        //   id: row.projectId,
        //   name: row.projectName,
        //   self: row.self
        // }
      })
      let projectDesc = JSON.stringify({
        name: row.projectName,
        id: row.projectId,
        self: row.self
      })
      sessionStorage.setItem('projectDesc', projectDesc)
    },
    syncFn(row, type) {
      let text = this.$t('Are you sure to abandon synchronization')
      if (type == 'YES') {
        text = this.$t('Are you sure you want to synchronize')
      }
      this.$confirm(text, 'Alert', {
        confirmButtonText: 'Ok',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(() => {
          this.$Post(this.$api.syncUnit, {
            projectId: row.projectId,
            sync: type
          }).then(res => {
            if (res.code == 0) {
              this.$message({
                type: 'success',
                message: res.msg
              })
              this.getListData()
            } else {
              this.$message({
                type: 'info',
                message: res.msg
              })
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: 'error!'
          })
        })
    }
  }
}
</script>
<style lang='less'>
.inventory_list_wrapper {
  .inventory_header {
    margin: 15px 0;
    margin-top: 0;
    padding: 15px;
    background-color: #fff;
  }
  .page_section {
    margin-top: 30px;
    text-align: center;
  }
}
</style>


