<template>
  <div class="teams_wrapper">
    <div class="head">
      <el-row class="head_el_row">
        <el-col :span="24">
          <div>
            <span>{{$t('teams.manageTeams')}}</span>
          </div>
        </el-col>
      </el-row>
      <el-row class="head_el_row tab_el_row">
        <el-col>
          <div class="tab_div" :class="{'tab_div_active':navIndex == 1}" @click="changeIndex(1)">{{$t('teams.defaultTeam')}}({{defaultTeam.agentNum}})</div>
          <div class="tab_div" :class="{'tab_div_active':navIndex == 2}" @click="changeIndex(2)">{{$t('teams.icTeam')}}({{icTeam.agentNum}})</div>
        </el-col>
      </el-row>
      <el-row v-if="navIndex == 2" style="padding:5px 0">
        <el-col style="text-align:right">
          <el-select size="mini" v-model="icTeam.importValue" @change="selectImport">
            <el-option label="email" value="email"></el-option>
            <el-option label="mobile" value="mobile"></el-option>
            <el-option label="regNum" value="regNum"></el-option>
          </el-select>
          <uploader fileId="teamIcFile" :maxSize="10" :uploadParam="icTeam.uploadParam" @uploadAfter="uploadAfter" :url="$api.importTeamIC" fileType=".xls,.xlsx" :btnText="{select:$t('inventoryLists.selectExcelFile'),import:$t('teams.importFromExcel')}"></uploader>
          <el-button size="mini" @click="exportIcTeam"> {{$t('teams.exporttoExcel')}}
          </el-button>
          <el-button size="mini" @click="refreshIcTeam">{{$t('teams.refresh')}}</el-button>
        </el-col>
      </el-row>
      <el-row v-else style="padding:5px 0">
        <el-col style="text-align:right">
          <el-button size="mini" @click="refreshDefaultTeam">{{$t('teams.refresh')}}</el-button>
          <el-button size="mini" @click="exportDefaultTeam"> {{$t('teams.exporttoExcel')}}
          </el-button>
        </el-col>
      </el-row>

    </div>
    <div class="teams_content">
      <!-- IC Team -->
      <div class="default_teams" v-if="navIndex == 2">
        <el-row class="row_header default_row_header">
          <el-col :span="2" class="col_text">
            <div style="text-align:center">{{$t('teams.name')}}</div>
          </el-col>
          <el-col :span="15">
            <el-select v-model="icTeam.agentModel" size="mini" style="width:100%" placeholder="" filterable>
              <ul class="teams_select_title">
                <li>{{$t('teams.name')}}</li>
                <li>{{$t('teams.ic')}}</li>
                <li>{{$t('teams.email')}}</li>
                <li>{{$t('teams.mobile')}}</li>
                <li>{{$t('teams.regNum')}}</li>
              </ul>
              <div class="el_select_div">
                <el-option v-for="item in icTeam.agentNoCheckList" :key="item.agentId" :label="item.agentName" :value="item.agentId" class="table_option">
                  <div :title="item.agentName">{{ item.agentName }}</div>
                  <div>
                    <i class="el-icon-check" v-if=" item.agentGroup == 'YES'"></i>
                    <i class="el-icon-close" v-else></i>
                  </div>
                  <div :title="item.email">{{ item.email }}</div>
                  <div :title="item.mobile">{{ item.mobile }}</div>
                  <div :title="item.regNum">{{ item.regNum }}</div>
                </el-option>
              </div>
            </el-select>
          </el-col>
          <el-col :span="7" class="col_button">
            <el-button size="mini" @click="addBroke">{{$t('teams.addMemberToTeam')}}</el-button>
            <!-- <el-button size="mini">{{$t('teams.editSellingEntity')}}</el-button> -->
          </el-col>
        </el-row>
        <el-table :data="icTeam.agentList" border style="width: 100%" :header-cell-style="{'background':'#f5f7fa'}" size="mini" key="table1">
          <el-table-column prop="agentName" :label="$t('teams.name')">
          </el-table-column>
          <el-table-column prop="mobile" :label="$t('teams.mobile')">
          </el-table-column>
          <el-table-column prop="email" :label="$t('teams.email')">
          </el-table-column>
          <el-table-column prop="regNum" :label="$t('teams.regNumber')">
          </el-table-column>
          <el-table-column :label="$t('teams.active')">
            <template slot-scope="scope">
              <i class="el-icon-check" v-if="scope.row.active == 'YES'"></i>
              <i class="el-icon-close" v-else></i>
            </template>
          </el-table-column>
          <el-table-column :label="$t('teams.expirationDate')">
            <template slot-scope="scope">
              <div>{{scope.row.expirationDate}}</div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('teams.delete')">
            <template slot-scope="scope">
              <el-button size="mini" plain @click="deleteIcData(scope.row)">{{$t('teams.delete')}}</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="SellingEntity" :label="$t('teams.sellingEntity')">
          </el-table-column>
          <el-table-column :label="$t('teams.edit')">
            <template slot-scope="scope">
              <el-button size="mini" plain @click="icTeamEdit(scope.row)">{{$t('teams.edit')}}</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="page_section" v-if="icTeam.agentNum">
          <el-pagination background small @size-change="handleIcSizeChange" @current-change="handleIcCurrentChange" :current-page.sync="icTeam.currentPage" :page-sizes="[5,10,30,50,100]" :page-size="icTeam.pageSize" layout="prev, pager, next,sizes,total" :total="icTeam.agentNum">
          </el-pagination>
        </div>
      </div>
      <!-- Agent / Default Team  -->
      <div class="ic_teams" v-else>
        <el-row>
          <el-form :inline="true" size="mini">
            <el-form-item :label="$t('teams.name')">
              <el-input v-model="defaultTeam.filterForm.agentName"></el-input>
            </el-form-item>
            <el-form-item :label="$t('teams.email')">
              <el-input v-model="defaultTeam.filterForm.email"></el-input>
            </el-form-item>
            <el-form-item :label="$t('teams.regNum')">
              <el-input v-model="defaultTeam.filterForm.regNum"></el-input>
            </el-form-item>
            <el-form-item :label="$t('teams.active')">
              <el-select size="mini" v-model="defaultTeam.filterForm.isActive">
                <el-option label="YES" value="YES"></el-option>
                <el-option label="NO" value="NO"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('teams.isAgent')">
              <el-select size="mini" v-model="defaultTeam.filterForm.isAgent">
                <el-option label="YES" value="YES"></el-option>
                <el-option label="NO" value="NO"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button @click="searchFun">{{$t('teams.search')}}</el-button>
            </el-form-item>
            <el-form-item>
              <el-button @click="clearFun">{{$t('teams.clear')}}</el-button>
            </el-form-item>
            <el-form-item v-if="!defaultTeam.isEdit">
              <el-button @click="edit">{{$t('teams.editAgentStatus')}}</el-button>
            </el-form-item>
            <el-form-item v-if="defaultTeam.isEdit">
              <el-button @click="update">{{$t('update')}}</el-button>
            </el-form-item>
            <el-form-item v-if="defaultTeam.isEdit">
              <el-button @click="cancel">{{$t('cancel')}}</el-button>
            </el-form-item>
          </el-form>
        </el-row>
        <el-table ref="multipleTable" :data="defaultTeam.agentList" border style="width: 100%" :header-cell-style="{'background':'#f5f7fa'}" size="mini" key="table2" @selection-change="handleSelectionChange">
          <el-table-column prop="agentName" :label="$t('teams.name')">
          </el-table-column>
          <el-table-column prop="mobile" :label="$t('teams.mobile')">
          </el-table-column>
          <el-table-column prop="email" :label="$t('teams.email')">
          </el-table-column>
          <el-table-column prop="regNum" :label="$t('teams.regNumber')">
          </el-table-column>
          <el-table-column :label="$t('teams.active')">
            <template slot-scope="scope">
              <i class="el-icon-check" v-if="scope.row.active == 'YES'"></i>
              <i class="el-icon-close" v-else></i>
            </template>
          </el-table-column>
          <el-table-column :label="$t('teams.expirationDate')">
            <template slot-scope="scope">
              <div>{{$dateFormatNoTime(scope.row.expirationDate)}}</div>
            </template>
          </el-table-column>
          <el-table-column type="selection" v-if="defaultTeam.isEdit" width="200" key="selection">
          </el-table-column>
          <el-table-column :label="$t('teams.isAgent')" v-else key="isAgent" width="200">
            <template slot-scope="scope">
              <i class="el-icon-check" v-if="scope.row.agentGroup == 'YES'"></i>
              <i class="el-icon-close" v-else></i>
            </template>
          </el-table-column>
        </el-table>
        <div class="page_section" v-if="defaultTeam.agentNum">
          <el-pagination background small @size-change="handleDefaultSizeChange" @current-change="handleDefaultCurrentChange" :current-page.sync="defaultTeam.currentPage" :page-sizes="[5,10,30,50,100]" :page-size="defaultTeam.pageSize" layout="prev, pager, next,sizes,total" :total="defaultTeam.agentNum">
          </el-pagination>
        </div>
      </div>
    </div>
    <el-dialog :title="$t('teams.edit')" :visible.sync="icTeam.dialogVisible" width="900px" class="teams_dialog">
      <el-row class="row_header">
        <el-col :span="12" class="col_text">
          {{$t('teams.manageSellingEntity')}}
        </el-col>
        <el-col :span="12" class="col_button">
          <el-button size="mini" @click="updateIcAgentProject">{{$t('teams.save')}}</el-button>
        </el-col>
      </el-row>
      <el-form :inline="true" size="mini">
        <el-row class="row_header">
          <el-col :span="24">
            <el-form-item :label="$t('teams.name')">
              <div style="font-weight:600">{{icTeam.dialogItem.agentName}}</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item :label="$t('teams.sellingEntity')" class="selling_entity">
              <el-checkbox-group class="el_checkbox_group" v-model="icTeam.checkedProject">
                <el-checkbox v-for="(v,k) in  icTeam.projectList" :key="k" :label="v.projectId">{{v.projectName}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
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
      defaultTeam: {
        agentList: [],
        currentPage: 1,
        pageSize: 5,
        agentNum: 0,
        isEdit: false,
        searchKey: {},
        filterForm: {
          agentName: "",
          email: "",
          regNum: "",
          isActive: "",
          isAgent: ""
        },
        selectedAgent: [],
        noSelectedAgent: []
      },
      icTeam: {
        uploadParam: [
          {
            name: "importType",
            value: "email"
          }
        ],
        importValue: "email",
        // agentName: "",
        dialogVisible: false,
        agentModel: "",
        agentNoCheckList: [],
        agentList: [],
        currentPage: 1,
        pageSize: 5,
        agentNum: 0,
        dialogItem: {},
        projectList: [],
        checkedProject: []
      },
      navIndex: 1
    };
  },
  mounted() {
    //default
    this.getTeamDefaultBrokeAgentList();
    //ic
    this.getTeamIcBrokeAgent();
    this.getTeamIcBrokeAgentList();
    this.getProjectList();
  },
  methods: {
    changeIndex(index) {
      this.navIndex = index;
    },
    // icTeam方法开始
    deleteIcData(row) {
      // console.log(row);
      this.$confirm(
        this.$t("alert.alert_delete"),
        this.$t("alert.alert_command"),
        {
          confirmButtonText: this.$t("alert.sure"),
          cancelButtonText: this.$t("alert.cancel"),
          type: "warning"
        }
      ).then(() => {
        this.$Geting(this.$api.deleteAgentProject, {
          agentId: row.agentId
        }).then(res => {
          if (res.code == 0) {
            this.$notify.success({
              title: this.$t("alert.alert_success_title"),
              message: this.$t("alert.alert_success_delete_title")
            });
            if (
              this.icTeam.agentList.length == 1 &&
              this.icTeam.currentPage !== 1
            ) {
              this.icTeam.currentPage--;
            }
            this.getTeamIcBrokeAgent();
            this.getTeamIcBrokeAgentList();
          } else {
            this.$notify.error({
              title: this.$t("alert.fail"),
              message: this.$t("alert.alert_fail_delete_title")
            });
          }
        });
      });
    },
    refreshIcTeam() {
      this.getTeamIcBrokeAgent();
      this.getTeamIcBrokeAgentList();
    },
    handleIcSizeChange(val) {
      this.icTeam.pageSize = val;
      this.getTeamIcBrokeAgentList();
    },
    handleIcCurrentChange(val) {
      this.icTeam.currentPage = val;
      this.getTeamIcBrokeAgentList();
    },
    uploadAfter() {
      this.icTeam.pageNo = 1;
      this.icTeam.agentModel = "";
      this.getTeamIcBrokeAgent();
      this.getTeamIcBrokeAgentList();
    },
    selectImport() {
      this.icTeam.uploadParam[0].value = this.icTeam.importValue;
    },
    icTeamEdit(row) {
      this.icTeam.dialogItem = row;
      this.icTeam.checkedProject = [];
      if (row.SellingEntity) {
        let checkedProjectName = row.SellingEntity.split("/");
        this.icTeam.checkedProject = this.icTeam.projectList.map(item => {
          if (checkedProjectName.indexOf(item.projectName) !== -1) {
            return item.projectId;
          }
        });
      }
      this.icTeam.dialogVisible = true;
    },
    //查询team ic可添加经纪人列表
    getTeamIcBrokeAgent() {
      this.$Geting(this.$api.queryTeamIcBrokeAgent, {
        // agentName: this.icTeam.agentName,
        pageNo: 1,
        pageSize: 10000
      }).then(res => {
        if (res.code == 0) {
          this.icTeam.agentNoCheckList = res.datas.lists;
        } else {
          this.$notify.error({
            title: "fail",
            message: res.msg
          });
          return false;
        }
      });
    },
    getTeamIcBrokeAgentList() {
      //查询team ic经纪人列表
      this.$Geting(this.$api.queryTeamIcBrokeAgentList, {
        pageNo: this.icTeam.currentPage,
        pageSize: this.icTeam.pageSize
      }).then(res => {
        if (res.code == 0) {
          this.icTeam.agentList = res.datas.lists;
          this.icTeam.agentNum = res.datas.count;
        } else {
          this.$notify.error({
            title: "fail",
            message: res.msg
          });
          return false;
        }
      });
    },
    //获取项目列表数据
    getProjectList() {
      this.$Geting(this.$api.queryProject, { pageSize: 10000, pageNo: 1 }).then(
        res => {
          if (res.code == 0) {
            this.icTeam.projectList = res.datas.lists;
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
    //添加经纪人
    addBroke() {
      if (this.icTeam.agentModel == "") {
        return;
      } else {
      }
      this.$Posting(this.$api.insertAgentProject, {
        agentId: this.icTeam.agentModel
      }).then(res => {
        if (res.code == 0) {
          this.$notify.success({
            title: this.$t("alert.alert_success_title"),
            message: this.$t("alert.operate_success_title")
          });
          this.icTeam.agentModel = "";
          this.getTeamIcBrokeAgent();
          this.getTeamIcBrokeAgentList();
        } else {
          this.$notify.error({
            title: "fail",
            message: res.msg
          });
          return false;
        }
      });
    },
    //team ic 更新经纪人关联项目
    updateIcAgentProject() {
      let projectName = this.icTeam.checkedProject.join();
      this.$Posting(this.$api.updateAgentProject, {
        agentId: this.icTeam.dialogItem.agentId,
        projectName: projectName
      }).then(res => {
        if (res.code == 0) {
          this.icTeam.dialogVisible = false;
          this.$notify.success({
            title: this.$t("alert.alert_success_title"),
            message: this.$t("alert.operate_success_title")
          });
          this.getTeamIcBrokeAgentList();
        } else {
          this.$notify.error({
            title: "fail",
            message: res.msg
          });
          return false;
        }
      });
    },
    exportIcTeam() {
      window.location.href = this.$addDownUrl(this.$api.exportICTeam);
    },
    //icTeam 方法结束

    // defaultTeam方法开始
    getTeamDefaultBrokeAgentList() {
      this.defaultTeam.isEdit = false;
      this.$Geting(this.$api.queryBrokeAgent, {
        pageNo: this.defaultTeam.currentPage,
        pageSize: this.defaultTeam.pageSize,
        agentName: this.defaultTeam.searchKey.agentName,
        email: this.defaultTeam.searchKey.email,
        regNum: this.defaultTeam.searchKey.regNum,
        active: this.defaultTeam.searchKey.isActive,
        agentGroup: this.defaultTeam.searchKey.isAgent
      }).then(res => {
        if (res.code == 0) {
          this.defaultTeam.agentList = res.datas.lists;
          this.defaultTeam.agentNum = res.datas.count;
        } else {
          this.$notify.error({
            title: "fail",
            message: res.msg
          });
          return false;
        }
      });
    },
    handleDefaultSizeChange(val) {
      this.defaultTeam.pageSize = val;
      this.getTeamDefaultBrokeAgentList();
    },
    handleDefaultCurrentChange(val) {
      this.defaultTeam.currentPage = val;
      this.getTeamDefaultBrokeAgentList();
    },
    searchFun() {
      let self = this;
      this.defaultTeam.currentPage = 1;
      this.defaultTeam.searchKey = Object.assign(
        {},
        self.defaultTeam.filterForm
      );
      this.getTeamDefaultBrokeAgentList();
    },
    clearFun() {
      let self = this;
      this.defaultTeam.filterForm.agentName = "";
      this.defaultTeam.filterForm.email = "";
      this.defaultTeam.filterForm.regNum = "";
      this.defaultTeam.filterForm.isActive = "";
      this.defaultTeam.filterForm.isAgent = "";
      this.defaultTeam.searchKey = Object.assign(
        {},
        self.defaultTeam.filterForm
      );
    },
    refreshDefaultTeam() {
      this.getTeamDefaultBrokeAgentList();
    },
    edit() {
      let allData = this.defaultTeam.agentList;
      for (let i = 0; i < allData.length; i++) {
        if (allData[i].agentGroup == "YES") {
          this.defaultTeam.selectedAgent.push(allData[i]);
          this.$refs.multipleTable.toggleRowSelection(allData[i], true);
        } else {
          this.defaultTeam.noSelectedAgent.push(allData[i]);
        }
      }
      this.defaultTeam.isEdit = true;
    },
    cancel() {
      this.defaultTeam.isEdit = false;
    },
    handleSelectionChange(val) {
      let allData = this.defaultTeam.agentList.concat();
      this.defaultTeam.selectedAgent = val;
      if (val.length) {
        let flug = true;
        for (let i = 0; i < allData.length; flug && i++) {
          for (let j = 0; j < val.length; j++) {
            if (allData[i].agentId == val[j].agentId) {
              allData.splice(i, 1);
              flug = false;
              break;
            } else {
              flug = true;
            }
          }
        }
      }
      this.defaultTeam.noSelectedAgent = allData;
    },
    update() {
      // console.log(this.selectedData);
      // console.log(this.noSelectedData);
      this.$Posting(this.$api.updateBrokeAgentGroupStatus, {
        isAgentGroupId: this.selectedData.join(),
        noAgentGroupId: this.noSelectedData.join()
      }).then(res => {
        if (res.code == 0) {
          this.$notify.success({
            title: this.$t("alert.alert_success_title"),
            message: this.$t("alert.operate_success_title")
          });
          this.getTeamDefaultBrokeAgentList();
        } else {
          this.$notify.error({
            title: "fail",
            message: res.msg
          });
          return false;
        }
      });
    },
    exportDefaultTeam() {
      window.location.href = this.$addDownUrl(this.$api.exportUsers, {
        type: "team"
      });
    }
    // defaultTeam方法结束
  },
  computed: {
    selectedData() {
      let selectData = this.defaultTeam.selectedAgent;
      let newSelectData = [];
      for (let i = 0; i < selectData.length; i++) {
        newSelectData.push(selectData[i].agentId);
      }
      return newSelectData;
    },
    noSelectedData() {
      let noSelectData = this.defaultTeam.noSelectedAgent;
      let newNoSelectData = [];
      for (let i = 0; i < noSelectData.length; i++) {
        newNoSelectData.push(noSelectData[i].agentId);
      }
      return newNoSelectData;
    }
  },
  watch: {
    "defaultTeam.isEdit": function(now, old) {
      if (!now) {
        // console.log("关闭");
        this.defaultTeam.selectedAgent = [];
        this.defaultTeam.noSelectedAgent = [];
        this.$refs.multipleTable.clearSelection();
      }
    }
  }
};
</script>
<style lang="less">
.teams_wrapper {
  background-color: #fff;
  height: 100%;
  position: relative;
  overflow: hidden;
  .head {
    height: 155px;
    position: absolute;
    top: 0;
    width: 100%;
    border-bottom: 1px solid #dcdfe6;
    border-top: 1px solid #dcdfe6;
    padding: 15px 30px;
    .head_el_row {
      height: 47px;
      line-height: 47px;
      &.tab_el_row {
        .tab_div {
          float: left;
          height: 35px;
          line-height: 35px;
          margin-top: 6px;
          width: 50%;
          color: #909399;
          background-color: #f5f7fa;
          text-align: center;
          cursor: pointer;
          border: 1px solid #dcdfe6;
          border-radius: 2px;
          &:last-child {
            border-left: none;
          }
          &.tab_div_active {
            background-color: #fff;
            color: #151c22;
          }
        }
      }
    }
  }
  .teams_content {
    position: absolute;
    top: 155px;
    bottom: 0;
    width: 100%;
    overflow: auto;
    padding: 15px 30px;
  }
  .row_header {
    height: 62px;
    padding: 15px 0;
    border-top: 1px solid #dcdfe6;
    .col_text {
      padding: 4px 0;
    }
    .col_button {
      text-align: right;
    }
    &.default_row_header {
      height: auto;
      padding: 0;
      padding-bottom: 15px;
      border: none;
    }
  }
  .page_section {
    text-align: center;
  }
}
.teams_select_title {
  height: 34px !important;
  position: absolute;
  width: 100%;
  background-color: rgb(245, 247, 250);
  top: 0;
  z-index: 999;
  list-style: none;
  li {
    float: left;
    width: 20%;
    height: 100%;
    line-height: 34px;
    text-align: center;
    font-size: 14px;
    color: #606266;
    // list-style: none;
  }
}
.el_checkbox_group {
  .el-checkbox {
    margin: 0;
    width: 24%;
    margin-right: 1%;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
th .el-checkbox::before {
  content: "Is Agent";
  display: inline-block;
  color: #909399;
  font-size: 12px;
  margin-right: 3px;
  font-weight: 600;
}
.table_option {
  padding: 0;
}
.el_select_div {
  padding-top: 30px;
  div {
    float: left;
    width: 20%;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.teams_dialog {
  .selling_entity {
    display: block !important;
    .el-form-item__content {
      display: block !important;
    }
  }
}
</style>


