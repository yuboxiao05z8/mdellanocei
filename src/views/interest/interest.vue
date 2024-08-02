<template>
  <div class="interest_list_wrapper">
    <div class="interest_list interest_section">
      <el-row class="row_header">
        <el-col :span="24" class="col_text">
          {{$t('interest.UnitInterest')}}
        </el-col>
      </el-row>
      <el-row class="row_filter" v-if="navIndex == 1">
        <el-col :span="6">
          {{$t('transactions.Project')}}：
          <el-select size="mini" v-model="active.selectProject" @change="getActiveData(0,active.selectProject,true)" value-key="projectId">
            <el-option v-for="(item,k) in projectLists" :label="item.projectName" :value="item" :key="k"></el-option>
          </el-select>
        </el-col>
        <el-col :span="18" class="col_button">
          <uploader fileId="interestFile" :maxSize="100" :uploadParam="active.uploadParam" @uploadAfter="uploadAfter" :url="$api.importUnitInterest" fileType=".xls,.xlsx" :btnText="{select:$t('transactions.SelectFile'),import:$t('transactions.Import')}"></uploader>
          <el-button size="mini" @click="refresh">{{$t('transactions.Refresh')}}</el-button>
          <el-button size="mini" @click="exportData">{{$t('transactions.Export')}}</el-button>
          <el-checkbox style="margin:0 10px" v-model="active.highlight" :false-label="0" :true-label="1">{{$t('interest.HighlightDuplicateData')}}</el-checkbox>
        </el-col>
      </el-row>
      <el-row class="row_filter" v-if="navIndex == 2">
        <el-col :span="6">
          {{$t('transactions.Project')}}：
          <el-select size="mini" v-model="inactive.selectProject" @change="getActiveData(1,inactive.selectProject,true)" value-key="projectId">
            <el-option v-for="(item,k) in projectLists" :label="item.projectName" :value="item" :key="k"></el-option>
          </el-select>
        </el-col>
        <el-col :span="18" class="col_button">
          <uploader fileId="userFile" :maxSize="100" :uploadParam="inactive.uploadParam" @uploadAfter="uploadAfter" :url="$api.importUnitInterest" fileType=".xls,.xlsx" :btnText="{select:$t('transactions.SelectFile'),import:$t('transactions.Import')}"></uploader>
          <el-button size="mini" @click="refresh">{{$t('transactions.Refresh')}}</el-button>
          <el-button size="mini" @click="exportData">{{$t('transactions.Export')}}</el-button>
          <el-checkbox style="margin:0 10px" v-model="inactive.highlight" :false-label="0" :true-label="1">{{$t('interest.HighlightDuplicateData')}}</el-checkbox>
        </el-col>
      </el-row>
      <div class="tab">
        <el-row>
          <el-col :span="24" class="tab_col">
            <div class="tab_div" :class="{'active':navIndex == 1}" @click="changeNav(1)">{{$t('interest.ActiveInterests')}}</div>
            <div class="tab_div" :class="{'active':navIndex == 2}" @click="changeNav(2)">{{$t('interest.InactiveInterests')}}</div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="interest_list_table interest_section" v-if="navIndex == 1">
      <el-table :data="active.tableLists" border style="width: 100%" :header-cell-style="{'background':'#f5f7fa'}" size="mini">
        <el-table-column :label="$t('interest.Agent')" prop="agentName">
        </el-table-column>
        <el-table-column :label="$t('interest.Unit')" prop="unitName">
        </el-table-column>
        <el-table-column :label="$t('interest.Expires')" prop="interestExpirationTime">
        </el-table-column>
        <el-table-column :label="$t('interest.Action')">
          <template slot-scope="scope">
            <div v-if="scope.row.action==0">{{$t('interest.Unregistered')}}</div>
            <div v-else class="unregister" @click="updateAction(scope.row.interestUnitId)">{{$t('interest.Unregister')}}</div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('Delete')">
          <template slot-scope="scope">
            <el-button size="mini" plain @click="deleteData(scope.row.interestId)">{{$t('Delete')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page_section" v-if="active.count">
        <el-pagination background small @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="active.currentPage" :page-sizes="[5,10,30,50,100]" :page-size="active.pageSize" layout="prev, pager, next,sizes,total" :total="active.count">
        </el-pagination>
      </div>
    </div>
    <div class="interest_list_table interest_section" v-if="navIndex == 2">
      <el-table :data="inactive.tableLists" border style="width: 100%" :header-cell-style="{'background':'#f5f7fa'}" size="mini">
        <el-table-column :label="$t('interest.Agent')" prop="agentName">
        </el-table-column>
        <el-table-column :label="$t('interest.Unit')" prop="unitName">
        </el-table-column>
        <el-table-column :label="$t('interest.Expires')" prop="interestExpirationTime">
        </el-table-column>
        <el-table-column :label="$t('Delete')">
          <template slot-scope="scope">
            <el-button size="mini" plain @click="deleteData(scope.row.interestId)">{{$t('Delete')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page_section" v-if="inactive.count">
        <el-pagination background small @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="inactive.currentPage" :page-sizes="[5,10,30,50,100]" :page-size="inactive.pageSize" layout="prev, pager, next,sizes,total" :total="inactive.count">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import uploader from "@/components/uploader";
export default {
  components: {
    uploader
  },
  data() {
    return {
      active: {
        uploadParam: [],
        highlight: 0,
        tableLists: [],
        currentPage: 1,
        pageSize: 5,
        count: 0,
        selectProject: ""
      },
      inactive: {
        uploadParam: [],
        highlight: 0,
        tableLists: [],
        currentPage: 1,
        pageSize: 5,
        count: 0,
        selectProject: ""
      },
      navIndex: 1,
      projectLists: []
    };
  },
  mounted() {
    this.getProjectData();
  },
  methods: {
    changeNav(index) {
      this.navIndex = index;
    },
    exportData() {
      let params = {};
      if (this.navIndex == 1) {
        if (!this.active.selectProject) {
          this.$alertWarn(this.$t("interest.pleasechooseaproject"));
          return;
        } else {
          params = {
            projectId: this.active.selectProject.projectId,
            projectName: this.active.selectProject.projectName,
            islaunch: 0,
            isCheck: this.active.highlight
          };
        }
      } else {
        if (!this.inactive.selectProject) {
          this.$alertWarn(this.$t("interest.pleasechooseaproject"));
          return;
        } else {
          params = {
            projectId: this.inactive.selectProject.projectId,
            projectName: this.inactive.selectProject.projectName,
            islaunch: 1,
            isCheck: this.inactive.highlight
          };
        }
      }
      window.location.href = this.$addDownUrl(
        this.$api.exportUnitInterest,
        params
      );
    },
    refresh() {
      if (this.navIndex == 1) {
        this.getActiveData(0, this.active.selectProject);
      } else {
        this.getActiveData(1, this.inactive.selectProject);
      }
    },
    deleteData(id) {
      this.$confirm(
        this.$t("alert.alert_delete"),
        this.$t("alert.alert_command"),
        {
          confirmButtonText: this.$t("alert.sure"),
          cancelButtonText: this.$t("alert.cancel"),
          type: "warning"
        }
      ).then(() => {
        this.$Geting(this.$api.delUnitInterest, {
          interestId: id
        }).then(res => {
          if (res.code == 0) {
            this.$notify.success({
              title: this.$t("alert.alert_success_title"),
              message: this.$t("alert.alert_success_delete_title")
            });
            if (this.navIndex == 1) {
              if (
                this.active.tableLists.length == 1 &&
                this.active.currentPage !== 1
              ) {
                this.active.currentPage--;
              }
              this.getActiveData(0, this.active.selectProject);
            } else {
              if (
                this.inactive.tableLists.length == 1 &&
                this.inactive.currentPage !== 1
              ) {
                this.inactive.currentPage--;
              }
              this.getActiveData(1, this.inactive.selectProject);
            }
          } else {
            this.$notify.error({
              title: this.$t("alert.fail"),
              message: this.$t("alert.alert_fail_delete_title")
            });
          }
        });
      });
    },
    updateAction(id) {
      this.$Geting(this.$api.updateAction, { interestUnitId: id }).then(res => {
        if (res.code == 0) {
          this.$notify.success({
            title: this.$t("alert.alert_success_title"),
            message: this.$t("alert.operate_success_title")
          });
          this.getActiveData(0, this.active.selectProject);
        } else {
          this.$notify.error({
            title: "fail",
            message: res.msg
          });
          return false;
        }
      });
    },
    uploadAfter() {
      if (this.navIndex == 1) {
        this.active.currentPage = 1;
        this.getActiveData(0, this.active.selectProject);
      } else {
        this.inactive.currentPage = 1;
        this.getActiveData(1, this.inactive.selectProject);
      }
    },
    handleSizeChange(val) {
      if (this.navIndex == 1) {
        this.active.pageSize = val;
        this.getActiveData(0, this.active.selectProject);
      } else {
        this.inactive.pageSize = val;
        this.getActiveData(1, this.inactive.selectProject);
      }
    },
    handleCurrentChange(val) {
      if (this.navIndex == 1) {
        this.active.currentPage = val;
        this.getActiveData(0, this.active.selectProject);
      } else {
        this.inactive.currentPage = val;
        this.getActiveData(1, this.inactive.selectProject);
      }
    },
    getProjectData() {
      this.$Geting(this.$api.queryProject, { pageSize: 10000, pageNo: 1 }).then(
        res => {
          if (res.code == 0) {
            this.projectLists = res.datas.lists;
          } else {
            this.$notify.error({
              title: "fail",
              message: res.msg
            });
            return false;
          }
        }
      );
    },
    getActiveData(type, project, isResetPage = false) {
      let params = {
        islaunch: type,
        projectId: project.projectId
      };
      if (type == 1) {
        //inactive
        if (!this.inactive.selectProject) return;
        isResetPage && (this.inactive.currentPage = 1);
        params.pageSize = this.inactive.pageSize;
        params.pageNo = this.inactive.currentPage;
      } else {
        //active
        if (!this.active.selectProject) return;
        isResetPage && (this.active.currentPage = 1);
        params.pageSize = this.active.pageSize;
        params.pageNo = this.active.currentPage;
      }
      this.$Geting(this.$api.queryInterest, params).then(res => {
        if (res.code == 0) {
          if (type == 0) {
            this.active.tableLists = res.datas.lists;
            this.active.count = res.datas.count;
          } else {
            this.inactive.tableLists = res.datas.lists;
            this.inactive.count = res.datas.count;
          }
        } else {
          this.$notify.error({
            title: "fail",
            message: res.msg
          });
          return false;
        }
      });
    }
  },
  watch: {
    "active.selectProject"(now) {
      if (now) {
        this.active.uploadParam = [
          { name: "projectId", value: now.projectId },
          { name: "projectName", value: now.projectName }
        ];
      }
    },
    "inactive.selectProject"(now) {
      if (now) {
        this.inactive.uploadParam = [
          { name: "projectId", value: now.projectId },
          { name: "projectName", value: now.projectName }
        ];
      }
    }
  }
};
</script>
<style lang="less">
.interest_list_wrapper {
  background-color: #fff;
  height: 100%;
  position: relative;
  overflow: hidden;
  .interest_section {
    padding: 0px 30px 15px;
    .row_header {
      border-bottom: 1px solid #dcdfe6;
    }
    .row_filter {
      border-bottom: 1px solid #dcdfe6;
    }
    .tab {
      padding: 15px 0;
      border-bottom: 1px solid #dcdfe6;
      background-color: #fff;
      .tab_col {
        .tab_div {
          float: left;
          height: 32px;
          line-height: 32px;
          width: 250px;
          text-align: center;
          border: 1px solid #dcdfe6;
          cursor: pointer;
          border-radius: 2px;
          color: #909399;
          background-color: #f5f7fa;
          &.active {
            background-color: #fff;
            color: #151c22;
          }
        }
      }
    }
    &.interest_list_table {
      padding-top: 15px;
      position: absolute;
      top: 190px;
      bottom: 0;
      left: 0;
      right: 0;
      overflow-y: auto;
      .unregister {
        text-decoration: underline;
        cursor: pointer;
      }
    }
    &.interest_list {
      padding-bottom: 0;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 60px;
    }
  }
  .row_header,
  .row_filter {
    height: 62px;
    padding: 15px 0;
    .col_text {
      padding: 4px 0;
    }
    .col_button {
      text-align: right;
    }
  }
  .page_section {
    text-align: center;
  }
}
</style>






