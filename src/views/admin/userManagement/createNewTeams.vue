<template>
  <div class="new_teams_wrapper">
    <div class="head">
      <el-row>
        <el-col :span="12" class="el_col_name">
          <div>
            <span>{{$t('teams.manageTeams')}}</span>
          </div>
        </el-col>
        <el-col :span="12" style="text-align:right">
          <el-button
            size="mini"
            @click="addTeam"
            :disabled="tableDataInit!==-1"
          >{{$t('createNewTeam.addTeam')}}</el-button>
          <el-button size="mini" @click="refresh">{{$t('createNewTeam.refresh')}}</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="teams_content">
      <div class="inventory_header">
        <el-input
          style="width:300px"
          size="mini"
          :placeholder="$t('teamName')"
          v-model="SearTeamName"
        ></el-input>
        <el-button size="mini" @click="searchData">{{$t('inventoryLists.Search')}}</el-button>
      </div>
      <el-table
        :data="teamList"
        border
        style="width: 100%"
        :header-cell-style="{'background':'#f5f7fa'}"
        size="mini"
      >
        <el-table-column :label="$t('teams.teamName')">
          <template slot-scope="scope">
            <el-input v-if="scope.$index === tableDataInit" v-model="teamName"></el-input>
            <div v-else>{{scope.row.teamName}}</div>
          </template>
        </el-table-column>
        <!-- <el-table-column :label="$t('teams.sellingEntity')">
          <template slot-scope="scope">
            <el-select v-if="scope.$index === tableDataInit"  v-model="sellingEntities" filterable placeholder="请选择">
              <el-option
                v-for="item in entitiesList"
                :key="item.companyName"
                :label="item.companyName"
                :value="item.companyName"
              ></el-option>
            </el-select>
            <div v-else>{{scope.row.sellingEntities}}</div>
          </template>
        </el-table-column>-->
        <!-- <el-table-column :label="$t('teams.isSensitive')">
          <template slot-scope="scope">
            <template v-if="scope.$index === tableDataInit">
              <el-checkbox v-model="isSensitive" :true-label="1" :false-label="0"></el-checkbox>
            </template>
            <template v-else>
              <i class="el-icon-check" v-if="scope.row.isSensitive == '1'"></i>
              <i class="el-icon-close" v-else></i>
            </template>
          </template>
        </el-table-column>-->
        <el-table-column :label="$t('teams.manageMembership')">
          <template slot-scope="scope">
            <el-button
              size="mini"
              plain
              @click="manageMembership(scope.row)"
              v-if="scope.row.teamId"
            >{{$t('teams.manageMembership')}}</el-button>
          </template>
        </el-table-column>
        <el-table-column :label="$t('teams.edit')">
          <template slot-scope="scope">
            <template v-if="scope.$index === tableDataInit">
              <el-button size="mini" plain @click="update(scope.row)">{{$t('update')}}</el-button>
              <el-button size="mini" plain @click="cancel(scope.row,scope.$index)">{{$t('cancel')}}</el-button>
            </template>
            <template v-else>
              <el-button
                size="mini"
                plain
                @click="edit(scope.row,scope.$index)"
              >{{$t('teams.edit')}}</el-button>
            </template>
          </template>
        </el-table-column>
        <el-table-column :label="$t('teams.delete')">
          <template slot-scope="scope">
            <el-button
              size="mini"
              plain
              @click="deleteData(scope.row)"
              :disabled="scope.$index === tableDataInit"
            >{{$t('teams.delete')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page_section" v-if="teamCount">
        <el-pagination
          background
          small
          @size-change="handleTeamSizeChange"
          @current-change="handleTeamCurrentChange"
          :current-page.sync="teamCurrentPage"
          :page-sizes="[5,10,30,50,100]"
          :page-size="teamPageSize"
          layout="prev, pager, next,sizes,total"
          :total="teamCount"
        ></el-pagination>
      </div>
    </div>
    <!-- Manager Membership -->
    <el-dialog
      :title="$t('teams.manageMembership')"
      :visible.sync="dialogVisible"
      width="900px"
      class="new_team_dialog"
      @close="closeDialog"
    >
      <el-row class="row_header">
        <el-col :span="24" class="col_button">
          <el-select size="mini" v-model="importType" @change="selectImport">
            <el-option label="email" value="email"></el-option>
            <el-option label="mobile" value="mobile"></el-option>
            <el-option label="regNum" value="regNum"></el-option>
          </el-select>
          <uploader
            ref="newTeamFile"
            fileId="newTeamFile"
            :maxSize="10"
            :uploadParam="uploadParam"
            @uploadAfter="uploadAfter"
            :url="$api.importTeamAgent"
            fileType=".xls,.xlsx"
            :btnText="{select:$t('createNewTeam.SelectFile'),import:$t('createNewTeam.Import')}"
          ></uploader>
          <el-button size="mini" @click="exportNewTeam">{{$t('createNewTeam.Export')}}</el-button>
          <el-button size="mini" @click="deleteAllMember">{{$t('createNewTeam.EmptyMembers')}}</el-button>
          <!-- <el-button size="mini">{{$t('teams.save')}}</el-button> -->
        </el-col>
      </el-row>
      <el-row class="row_header">
        <el-col :span="2" class="col_text">
          <div style="text-align:center">{{$t('teams.email')}}</div>
        </el-col>
        <el-col :span="17">
          <el-select
            v-model="selectValue"
            size="mini"
            style="width:100%"
            filterable
            remote
            :remote-method="remoteMethod"
            :loading="loading"
          >
            <ul class="select_title">
              <li>{{$t('teams.email')}}</li>
              <li>{{$t('teams.name')}}</li>
              <!-- <li>{{$t('teams.email')}}</li> -->
              <li>{{$t('teams.mobile')}}</li>
              <li>{{$t('teams.regNum')}}</li>
            </ul>
            <div class="el_select_div">
              <el-option
                v-for="item in selectLists"
                :key="item.agentId"
                :label="item.email"
                :value="item.agentId"
                class="table_option"
              >
                <div :title="item.email">{{ item.email }}</div>
                <div :title="item.agentName">{{ item.agentName }}</div>
                <!-- <div :title="item.email">{{ item.email }}</div> -->
                <div :title="item.mobile">{{ item.mobile }}</div>
                <div :title="item.regNum">{{ item.regNum }}</div>
              </el-option>
            </div>
          </el-select>
        </el-col>
        <el-col :span="5" class="col_button">
          <el-button size="mini" @click="addMember">{{$t('teams.addMemberToTeam')}}</el-button>
        </el-col>
      </el-row>
      <el-table
        :data="dialogList"
        border
        style="width: 100%"
        :header-cell-style="{'background':'#f5f7fa'}"
        size="mini"
      >
        <el-table-column prop="agentName" :label="$t('teams.name')"></el-table-column>
        <el-table-column prop="email" :label="$t('teams.email')"></el-table-column>
        <el-table-column prop="mobile" :label="$t('teams.mobile')"></el-table-column>
        <el-table-column prop="regNum" :label="$t('teams.regNum')"></el-table-column>
        <el-table-column :label="$t('teams.delete')">
          <template slot-scope="scope">
            <el-button size="mini" plain @click="deleteMember(scope.row)">{{$t('teams.delete')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page_section" v-if="dialogCount">
        <el-pagination
          background
          small
          @size-change="handleDialogSizeChange"
          @current-change="handleDialogCurrentChange"
          :current-page.sync="dialogCurrentPage"
          :page-sizes="[5,10,30,50,100]"
          :page-size="dialogPageSize"
          layout="prev, pager, next,sizes,total"
          :total="dialogCount"
        ></el-pagination>
      </div>
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
      teamList: [], //team列表
      loading: false,
      teamCurrentPage: 1, //team分页配置
      teamPageSize: 5, //team分页配置
      teamCount: 0, //team分页配置
      tableDataInit: -1, //表格的初始化index
      teamName: "", //team表格参数
      // sellingEntities: "",//team表格参数
      entitiesList: [], // 公司列表
      // isSensitive: 0,//team表格参数
      dialogVisible: false, //team表格参数
      dialogList: [], //team关联的成员列表
      dialogCurrentPage: 1, //成员分页配置
      dialogPageSize: 5, //成员分页配置
      dialogCount: 0, //成员分页配置
      selectLists: [], //下拉框数据
      selectValue: "", //下拉框选中数据
      teamId: "", //teamId
      importType: "email", //导入数据的默认选择
      uploadParam: [
        //导入数据的参数
        {
          name: "importType",
          value: "email"
        }
      ],
      SearTeamName: ""
    };
  },
  watch: {
    selectValue(val, odVal) {
      console.log(val, odVal);
    }
  },
  mounted() {
    this.getTeamLists();
    // this.queryBrokeCompany()
  },
  methods: {
    refresh() {
      //刷新team列表
      this.cancelAddData();
      this.getTeamLists();
    },
    // queryBrokeCompany() {
    //   this.$Get(this.$api.queryBrokeCompany, { pageSize: 1000, pageNo: 1 }).then(res => {
    //     if (res.code == 0) {
    //       this.entitiesList = res.datas.lists
    //       // console.log(this.entitiesList)
    //     }
    //   })
    // },
    searchData() {
      this.teamCurrentPage = 1;
      this.getTeamLists();
    },
    remoteMethod(query) {
      if(query !== "") {
        this.loading = true;
        this.getSelectData(query)
      } else {
        this.selectLists = []
      }
      console.log(query)
    },
    closeDialog() {
      //弹框关闭后重置表格和下拉框
      this.dialogList = [];
      this.dialogCurrentPage = 1;
      this.dialogPageSize = 5;
      this.dialogCount = 0;
      this.selectLists = [];
      this.selectValue = "";
      this.$refs.newTeamFile.removeFile();
      this.uploadParam = [
        {
          name: "importType",
          value: "email"
        }
      ];
      this.importType = "email";
    },
    exportNewTeam() {
      //导出team成员
      window.location.href = this.$addDownUrl(this.$api.exportTeamAgent, {
        teamId: this.teamId
      });
    },
    uploadAfter() {
      //文件上传完后的回调
      this.getDialogLists();
      // this.getSelectData();
    },
    deleteAllMember() {
      //删除team的所有成员
      this.$Geting(this.$api.deleteTeamsAgentAll, {
        teamId: this.teamId
      }).then(res => {
        if (res.code == 0) {
          this.$notify.success({
            title: this.$t("alert.alert_success_title"),
            message: this.$t("alert.alert_success_delete_title")
          });
          this.dialogCurrentPage = 1;
          this.dialogPageSize = 5;
          this.getDialogLists();
          // this.getSelectData();
        } else {
          this.$notify.error({
            title: this.$t("alert.fail"),
            message: this.$t("alert.alert_fail_delete_title")
          });
        }
      });
    },
    deleteMember(row) {
      //删除team的成员
      this.$Geting(this.$api.deleteTeamsAgent, {
        id: row.id
      }).then(res => {
        if (res.code == 0) {
          this.$notify.success({
            title: this.$t("alert.alert_success_title"),
            message: this.$t("alert.alert_success_delete_title")
          });
          if (this.dialogList.length == 1 && this.dialogCurrentPage !== 1) {
            this.dialogCurrentPage--;
          }
          this.getDialogLists();
          // this.getSelectData();
        } else {
          this.$notify.error({
            title: this.$t("alert.fail"),
            message: this.$t("alert.alert_fail_delete_title")
          });
        }
      });
    },
    addMember() {
      //添加成员
      if (this.selectValue == "") {
        return;
      } else {
      }
      this.$Posting(this.$api.saveTeamsAgent, {
        agentId: this.selectValue,
        teamId: this.teamId
      }).then(res => {
        if (res.code == 0) {
          this.$notify.success({
            title: this.$t("alert.alert_success_title"),
            message: this.$t("alert.operate_success_title")
          });
          this.selectValue = "";
          this.getDialogLists();
          // this.getSelectData();
        } else {
          this.$notify.error({
            title: "fail",
            message: res.msg
          });
          return false;
        }
      });
    },
    manageMembership(row) {
      //点击manageMembership按钮
      this.dialogVisible = true;
      this.teamId = row.teamId;
      this.uploadParam.push({
        name: "teamId",
        value: row.teamId
      });
      console.log(this.uploadParam);
      this.getDialogLists();
      // this.getSelectData();
    },
    selectImport() {
      //选择导入数据的类型
      this.uploadParam[0].value = this.importType;
    },
    deleteData(row) {
      //删除团队
      this.$confirm(
        this.$t("alert.alert_delete"),
        this.$t("alert.alert_command"),
        {
          confirmButtonText: this.$t("alert.sure"),
          cancelButtonText: this.$t("alert.cancel"),
          type: "warning"
        }
      ).then(() => {
        this.$Geting(this.$api.deleteTeam, {
          teamId: row.teamId
        }).then(res => {
          if (res.code == 0) {
            this.$notify.success({
              title: this.$t("alert.alert_success_title"),
              message: this.$t("alert.alert_success_delete_title")
            });
            if (this.teamList.length == 1 && this.teamCurrentPage !== 1) {
              this.teamCurrentPage--;
            }
            this.getTeamLists();
          } else {
            this.$notify.error({
              title: this.$t("alert.fail"),
              message: this.$t("alert.alert_fail_delete_title")
            });
          }
        });
      });
    },
    addTeam() {
      this.teamList.unshift({});
      this.tableDataInit = 0;
    },
    update(row) {
      //添加和编辑team
      this.$Posting(this.$api.saveTeam, {
        teamId: row.teamId,
        teamName: this.teamName
        // sellingEntities: this.sellingEntities,
        // isSensitive: this.isSensitive
      }).then(res => {
        if (res.code == 0) {
          this.$notify.success({
            title: this.$t("alert.alert_success_title"),
            message: this.$t("alert.operate_success_title")
          });
          this.cancelAddData();
          this.getTeamLists();
        } else {
          this.$notify.error({
            title: "fail",
            message: res.msg
          });
          return false;
        }
      });
    },
    edit(row, index) {
      if (!this.teamList[0].teamId) {
        this.teamList.shift();
        this.tableDataInit = index - 1;
      } else {
        this.tableDataInit = index;
      }
      this.teamName = row.teamName;
      // this.sellingEntities = row.sellingEntities;
      // this.isSensitive = row.isSensitive;
    },
    cancel(row, index) {
      if (index == 0) {
        if (row.teamId === undefined) {
          this.teamList.shift();
        }
      }
      this.cancelAddData();
    },
    cancelAddData() {
      this.teamName = "";
      // this.sellingEntities = "";
      // this.isSensitive = 0;
      this.tableDataInit = -1;
    },
    handleDialogSizeChange(val) {
      //弹窗内的分页
      this.dialogPageSize = val;
      this.getDialogLists();
    },
    handleDialogCurrentChange(val) {
      //弹窗内的分页
      this.dialogCurrentPage = val;
      this.getDialogLists();
    },
    handleTeamSizeChange(val) {
      //team分页
      this.teamPageSize = val;
      this.getTeamLists();
    },
    handleTeamCurrentChange(val) {
      //team分页
      this.teamCurrentPage = val;
      this.getTeamLists();
    },
    getTeamLists() {
      //查询团队
      this.$Geting(this.$api.queryTeams, {
        pageSize: this.teamPageSize,
        pageNo: this.teamCurrentPage,
        teamName: this.SearTeamName
      }).then(res => {
        if (res.code == 0) {
          this.teamList = res.datas.lists;
          this.teamCount = res.datas.count;
        } else {
          this.$notify.error({
            title: "fail",
            message: res.msg
          });
          return false;
        }
      });
    },
    getSelectData(query) {
      //根据用户名称查询用户列表
      this.$Geting(this.$api.getTeamsAgentByName, {
        teamId: this.teamId,
        agentName: query
      }).then(res => {
        if (res.code == 0) {
          this.selectLists = res.datas;
          this.loading = false
        } else {
          this.loading = false
          this.$notify.error({
            title: "fail",
            message: res.msg
          });
          return false;
        }
      });
    },
    getDialogLists() {
      //查询团队下所有用户
      this.$Geting(this.$api.queryTeamsAgentList, {
        teamId: this.teamId,
        pageSize: this.dialogPageSize,
        pageNo: this.dialogCurrentPage
      }).then(res => {
        if (res.code == 0) {
          this.dialogList = res.datas.lists;
          this.dialogCount = res.datas.count;
        } else {
          this.$notify.error({
            title: "fail",
            message: res.msg
          });
          return false;
        }
      });
    }
  }
};
</script>
<style lang="less">
.new_teams_wrapper {
  background-color: #fff;
  height: 100%;
  position: relative;
  overflow: hidden;
  .head {
    height: 62px;
    position: absolute;
    top: 0;
    width: 100%;
    border-bottom: 1px solid #dcdfe6;
    border-top: 1px solid #dcdfe6;
    padding: 15px 30px;
    .el_col_name {
      div {
        padding: 4px 0;
      }
    }
  }
  .teams_content {
    position: absolute;
    top: 62px;
    bottom: 0;
    width: 100%;
    overflow: auto;
    padding: 15px 30px;
    .inventory_header {
      margin-bottom: 15px;
    }
    .page_section {
      text-align: center;
    }
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
  }
}
.select_title {
  height: 34px !important;
  position: absolute;
  width: 100%;
  background-color: rgb(245, 247, 250);
  top: 0;
  z-index: 999;
  li {
    float: left;
    width: 25%;
    height: 100%;
    line-height: 34px;
    text-align: center;
    font-size: 14px;
    color: #606266;
  }
}
.el_select_div {
  padding: 10px;
  padding-top: 30px;
  div {
    float: left;
    width: 25%;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.table_option {
  padding: 0;
}
.new_team_dialog {
  .page_section {
    text-align: center;
  }
}
</style>


