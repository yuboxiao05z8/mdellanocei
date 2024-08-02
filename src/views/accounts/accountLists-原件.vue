<template>
  <div class="accounts_list_wrapper">
    <div class="accounts_list accounts_section">
      <el-row class="row_header">
        <el-col :span="6" class="col_text">
          {{$t('accounts.ManageAccounts')}}
        </el-col>
        <el-col :span="18" class="col_button">
          <el-button size="mini" @click="addAccount" :disabled="tableDataInit!==-1">{{$t('accounts.AddAccount')}}
          </el-button>
          <el-button size="mini" @click="refresh">{{$t('Refresh')}}
          </el-button>
        </el-col>
      </el-row>
    </div>
    <div class="accounts_list_table accounts_section">
      <el-table :data="userList" border style="width: 100%" :header-cell-style="{'background':'#f5f7fa'}" size="mini">
        <el-table-column :label="$t('accounts.UserName')">
          <template slot-scope="scope">
            <el-input size="mini" v-if="scope.$index === tableDataInit" v-model.trim="userName"></el-input>
            <div v-else>{{scope.row.userName}}</div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('accounts.Agency')">
          <template slot-scope="scope">
            <el-checkbox v-model="isAgency" v-if="scope.$index === tableDataInit" @change="changeIsAgency"></el-checkbox>
            <template v-else>
              <i class="el-icon-check" v-if="scope.row.type == '3'"></i>
              <i class="el-icon-close" v-else></i>
            </template>
          </template>
        </el-table-column>
        <el-table-column :label="$t('accounts.Developer')">
          <template slot-scope="scope">
            <el-checkbox v-model="isDeveloper" v-if="scope.$index === tableDataInit" @change="changeIsDeveloper"></el-checkbox>
            <template v-else>
              <i class="el-icon-check" v-if="scope.row.type == '2'"></i>
              <i class="el-icon-close" v-else></i>
            </template>
          </template>
        </el-table-column>
        <el-table-column :label="$t('accounts.ResetPassword')">
          <template slot-scope="scope">
            <el-button size="mini" plain :disabled="scope.$index === tableDataInit" @click="sendEmail(scope.row)">{{$t('userLists.emailWelcome')}}</el-button>
          </template>
        </el-table-column>
        <el-table-column :label="$t('accounts.ManageProperty')">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" plain @click="manageProject(scope.row)" v-if="scope.$index === tableDataInit">Edit Properties</el-button>
            <div v-else>{{scope.row.projectName}}</div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('accounts.ManageName')">
          <template slot-scope="scope">
            <el-input size="mini" v-if="scope.$index === tableDataInit" v-model.trim="manageName"></el-input>
            <div v-else>{{scope.row.brokeName}}</div>
          </template>
        </el-table-column>
         <el-table-column :label="$t('FileNum')">
          <template slot-scope="scope">
            <el-input size="mini" v-if="scope.$index === tableDataInit" v-model.trim="fileNum"></el-input>
            <div v-else>{{scope.row.fileNum}}</div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('Delete')">
          <template slot-scope="scope">
            <el-button size="mini" plain :disabled="scope.$index === tableDataInit" @click="deleteData(scope.row)">{{$t('accounts.delete')}}</el-button>
          </template>
        </el-table-column>
        <el-table-column :label="$t('userLists.edit')" width="160">
          <template slot-scope="scope">
            <template v-if="scope.$index === tableDataInit">
              <el-button size="mini" plain @click="update(scope.row)">{{$t('update')}}</el-button>
              <el-button size="mini" plain @click="cancel(scope.row,scope.$index)">{{$t('cancel')}}</el-button>
            </template>
            <template v-else>
              <el-button size="mini" plain @click="edit(scope.row,scope.$index)">{{$t('userLists.edit')}}</el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <div class="page_section" v-if="userNum">
        <el-pagination background small @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-sizes="[5,10,30,50,100]" :page-size="pageSize" layout="prev, pager, next,sizes,total" :total="userNum">
        </el-pagination>
      </div>
    </div>
    <el-dialog title="Edit Properties" :visible.sync="dialogVisible" width="900px" class="account_dialog">
      <el-row class="row_header">
        <el-col :span="12" class="col_text">
         {{$t('accounts.ManageProperties')}}
        </el-col>
        <el-col :span="12" class="col_button">
          <el-button size="mini" @click="updateProjectName">{{$t('teams.save')}}</el-button>
        </el-col>
      </el-row>
      <el-form :inline="true" size="mini">
        <el-row>
          <el-col :span="24">
            <el-form-item class="selling_entity">
              <div class="el_checkbox_group">
                <el-checkbox v-for="(v,k) in projectList" :key="k" :checked="v.delProjectId!==''" @change="changeProject(v)">{{v.projectName}}</el-checkbox>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      userList: [],
      currentPage: 1,
      pageSize: 5,
      userNum: 0,
      tableDataInit: -1,
      userName: "",
      isAgency: false,
      isDeveloper: false,
      manageName: "",
      fileNum:0,
      projectList: [],
      checkedProject: [],
      cancelCheckedProject: [],
      dialogVisible: false,
      editBrokeId: ""
    };
  },
  mounted() {
    this.getListData();
  },
  methods: {
    deleteData(row) {
      this.$confirm(
        this.$t("alert.alert_delete"),
        this.$t("alert.alert_command"),
        {
          confirmButtonText: this.$t("alert.sure"),
          cancelButtonText: this.$t("alert.cancel"),
          type: "warning"
        }
      ).then(() => {
        this.$Geting(this.$api.deleteBrokeSysuser, {
          editUserId: row.userId,
          editBrokeId:row.brokeId
        }).then(res => {
          if (res.code == 0) {
            this.$notify.success({
              title: this.$t("alert.alert_success_title"),
              message: this.$t("alert.alert_success_delete_title")
            });
            if (this.userList.length == 1 && this.currentPage !== 1) {
              this.currentPage--;
            }
            this.getListData();
          } else {
            this.$notify.error({
              title: this.$t("alert.fail"),
              message: this.$t("alert.alert_fail_delete_title")
            });
          }
        });
      });
    },
    changeProject(v) {
      //勾选项目发生改变
      if (v.isCheck == "0") {
        //选中
        v.isCheck = "1";
      } else {
        //取消选中
        v.isCheck = "0";
      }
      if (v.isCheck == "0") {
        //未选中时
        if (v.delProjectId) {
          //之前被选中
          this.cancelCheckedProject.push(v.delProjectId);
        } else {
          //之前未被选中
          let index = this.checkedProject.indexOf(v.addProjectId);
          if (index !== -1) {
            this.checkedProject.splice(index, 1);
          }
        }
      } else {
        //选中时
        if (v.delProjectId) {
          //之前被选中
          let index = this.cancelCheckedProject.indexOf(v.delProjectId);
          if (index !== -1) {
            this.cancelCheckedProject.splice(index, 1);
          }
        } else {
          //之前未被选中
          this.checkedProject.push(v.addProjectId);
        }
      }
      // console.log("qx", this.cancelCheckedProject);
      // console.log("tj", this.checkedProject);
    },
    updateProjectName() {
      //更新账号的项目权限
      let addProjectIds = this.checkedProject.join();
      let delProjectIds = this.cancelCheckedProject.join();
      this.$Geting(this.$api.editProperties, {
        editBrokeId: this.editBrokeId,
        addProjectIds: addProjectIds,
        delProjectIds: delProjectIds
      }).then(res => {
        if (res.code == 0) {
          this.dialogVisible = false;
          this.$notify.success({
            title: this.$t("alert.alert_success_title"),
            message: this.$t("alert.operate_success_title")
          });
          this.getListData();
        } else {
          this.$notify.error({
            title: "fail",
            message: res.msg
          });
          return false;
        }
      });
    },
    manageProject(row) {
      //管理账号下面的项目权限
      this.dialogVisible = true;
      this.projectList = [];
      this.checkedProject = [];
      this.cancelCheckedProject = [];
      this.editBrokeId = row.brokeId;
      this.$Geting(this.$api.getProject, {
        editBrokeId: row.brokeId
      }).then(res => {
        if (res.code == 0) {
          this.projectList = res.datas;
        } else {
          this.$notify.error({
            title: "fail",
            message: res.msg
          });
          return false;
        }
      });
    },
    changeIsAgency() {
      //经纪公司和开发商联动
      this.isAgency && (this.isDeveloper = false);
    },
    changeIsDeveloper() {
      //经纪公司和开发商联动
      this.isDeveloper && (this.isAgency = false);
    },
    refresh() {
      //刷新
      this.cancelAddData();
      this.getListData();
    },
    addAccount() {
      //添加账号
      this.userList.unshift({});
      this.tableDataInit = 0;
    },
    sendEmail(row) {
      this.$Posting(this.$api.sendMail, {
        editUsreId: row.userId
      }).then(res => {
        if (res.code == 0) {
          this.$notify.success({
            title: this.$t("alert.alert_success_title"),
            message: this.$t("alert.operate_success_title")
          });
        } else {
          this.$notify.error({
            title: "fail",
            message: res.msg
          });
          return false;
        }
      });
    },

    handleSizeChange(val) {
      this.pageSize = val;
      this.getListData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getListData();
    },
    refresh() {
      this.getListData();
    },
    edit(row, index) {
      // console.log(row)
      this.tableDataInit = index;
      this.userName = row.userName;
      if (row.type == 2) {
        this.isDeveloper = true;
        this.isAgency = false
      } else if (row.type == 3) {
        this.isAgency = true;
        this.isDeveloper = false
      } else {
        this.isDeveloper = false;
        this.isAgency = false;
      }
      this.manageName = row.brokeName;
      this.fileNum = row.fileNum;
    },
    cancel(row, index) {
      if (index == 0) {
        if (row.userId === undefined) {
          this.userList.shift();
        }
      }
      this.cancelAddData();
    },
    cancelAddData() {
      this.userName = "";
      this.isAgency = false;
      this.isDeveloper = false;
      this.manageName = "";
      this.fileNum = 0;
      this.tableDataInit = -1;
    },
    update(row) {
      let type = 1;
      if (this.isAgency) {
        type = 3;
      } else if (this.isDeveloper) {
        type = 2;
      }
      this.$Posting(this.$api.saveBroke, {
        editBrokeId: row.brokeId,
        editUsreId: row.userId,
        userName: this.userName,
        type: type,
        brokeName: this.manageName,
        fileNum:this.fileNum
      }).then(res => {
        if (res.code == 0) {
          this.$notify.success({
            title: this.$t("alert.alert_success_title"),
            message: this.$t("alert.operate_success_title")
          });
          this.getListData();
        } else {
          this.$notify.error({
            title: "fail",
            message: res.msg
          });
          return false;
        }
      });
    },
    //获取列表数据
    getListData() {
      this.cancel();
      this.$Geting(this.$api.queryBroke, {
        pageSize: this.pageSize,
        pageNo: this.currentPage
      }).then(res => {
        if (res.code == 0) {
          this.userList = res.datas.lists;
          this.userNum = res.datas.count;
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
.accounts_list_wrapper {
  background-color: #fff;
  height: 100%;
  position: relative;
  overflow: hidden;
  .accounts_section {
    padding: 0px 30px 15px;
    &.accounts_list_table {
      border-top: 1px solid #dcdfe6;
      padding-top: 15px;
      position: absolute;
      top: 60px;
      bottom: 0;
      left: 0;
      right: 0;
      overflow-y: auto;
    }
    &.accounts_list {
      padding-bottom: 0;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 60px;
    }
  }
  .row_header {
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
.account_dialog {
  .row_header {
    height: 62px;
    padding: 15px 0;
    border-top: 1px solid #dcdfe6;
    border-bottom: 1px solid #dcdfe6;
    .col_text {
      padding: 4px 0;
    }
    .col_button {
      text-align: right;
    }
  }
  .el-dialog__body {
    padding: 10px 20px;
  }
  .selling_entity {
    display: block !important;
    .el-form-item__content {
      padding: 10px 0;
      display: block !important;
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
  }
}
</style>




