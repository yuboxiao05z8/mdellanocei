<template>
  <div class="user_list_wrapper">
    <div class="user_list user_section">
      <el-row class="row_header">
        <el-col :span="6" class="col_text">{{$t('userLists.userList')}}</el-col>
        <el-col :span="18" class="col_button">
          <uploader
            fileId="userFile"
            :maxSize="100"
            :uploadParam="uploadParam"
            @uploadAfter="uploadUserAfter"
            :url="$api.importUsers"
            fileType=".xls,.xlsx"
            :btnText="{select:$t('userLists.selectFile'),import:$t('userLists.createMultipleAccounts')}"
          ></uploader>
          <el-button size="mini" @click="downloadTemplate">{{$t('userLists.downloadTemplate')}}</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="user_list_table user_section">
      <el-row>
        <el-form :inline="true" size="mini">
          <el-form-item :label="$t('userLists.name')">
            <el-input v-model="filterForm.name"></el-input>
          </el-form-item>
          <el-form-item :label="$t('userLists.email')">
            <el-input v-model="filterForm.email"></el-input>
          </el-form-item>
          <el-form-item :label="$t('userLists.regNum')">
            <el-input v-model="filterForm.regNum"></el-input>
          </el-form-item>
          <el-form-item :label="$t('userLists.mobile')">
            <el-input v-model="filterForm.mobile"></el-input>
          </el-form-item>
          <el-form-item :label="$t('userLists.active')">
            <el-select v-model="filterForm.active">
              <el-option value="YES" label="YES"></el-option>
              <el-option value="NO" label="NO"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button @click="searchFun">{{$t('userLists.search')}}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button @click="clearFun">{{$t('userLists.clear')}}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button @click="refresh">{{$t('userLists.refresh')}}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button @click="exportUser">{{$t('userLists.exporttoExcel')}}</el-button>
          </el-form-item>
        </el-form>
      </el-row>
      <el-table
        :data="userList"
        border
        style="width: 100%"
        :header-cell-style="{'background':'#f5f7fa'}"
        size="mini"
      >
        <el-table-column width="150" :label="$t('userLists.name')">
          <template slot-scope="scope">
            <el-input v-if="scope.$index === tableDataInit" v-model="name"></el-input>
            <div v-else>{{scope.row.agentName}}</div>
          </template>
        </el-table-column>
        <el-table-column width="150" :label="$t('userLists.mobile')">
          <template slot-scope="scope">
            <el-input v-if="scope.$index === tableDataInit" v-model="mobile"></el-input>
            <div v-else>{{scope.row.mobile}}</div>
          </template>
        </el-table-column>
        <el-table-column width="150" :label="$t('userLists.email')">
          <template slot-scope="scope">
            <el-input v-if="scope.$index === tableDataInit" v-model="email"></el-input>
            <div v-else>{{scope.row.email}}</div>
          </template>
        </el-table-column>
        <el-table-column width="150" :label="$t('userLists.regNumer')">
          <template slot-scope="scope">
            <el-input v-if="scope.$index === tableDataInit" v-model="regNumer"></el-input>
            <div v-else>{{scope.row.regNum}}</div>
          </template>
        </el-table-column>
        <el-table-column width="150" :label="$t('userLists.active')">
          <template slot-scope="scope">
            <el-checkbox
              v-model="active"
              v-if="scope.$index === tableDataInit"
              :true-label="'YES'"
              :false-label="'NO'"
            ></el-checkbox>
            <div v-else>
              <i class="el-icon-check" v-if="scope.row.active == 'YES'"></i>
              <i class="el-icon-close" v-else></i>
            </div>
          </template>
        </el-table-column>
        <el-table-column width="150" :label="$t('newUser.MultiTerminal')">
          <template slot-scope="scope">
            <el-checkbox
              v-model="accountType"
              v-if="scope.$index === tableDataInit"
              :true-label="3"
              :false-label="1"
            ></el-checkbox>
            <div v-else>
              <i class="el-icon-check" v-if="scope.row.accountType == 3"></i>
              <i class="el-icon-close" v-else></i>
            </div>
          </template>
        </el-table-column>
        <el-table-column width="150" :label="$t('userLists.password')">
          <template slot-scope="scope">
            <el-input v-if="scope.$index === tableDataInit" v-model="password"></el-input>
            <div v-else>
              <div v-if="scope.row.password">********</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column width="150" :label="$t('userLists.expirationDate')">
          <template slot-scope="scope">
            <el-date-picker
              type="date"
              value-format="timestamp"
              v-if="scope.$index === tableDataInit"
              v-model="expirationDate"
            ></el-date-picker>
            <div v-else>{{$dateFormatNoTime(scope.row.expirationDate)}}</div>
          </template>
        </el-table-column>
        <el-table-column width="150" :label="$t('Lastlogontime')">
          <template slot-scope="scope">
            <div>{{$dateFormatNoTime(scope.row.lastLoginTime)}}</div>
          </template>
        </el-table-column>
        <el-table-column width="150" :label="$t('accounts.ResetPassword')">
          <template slot-scope="scope">
            <el-button
              size="mini"
              plain
              :disabled="scope.$index === tableDataInit"
              @click="sendEmail(scope.row)"
            >{{$t('userLists.emailWelcome')}}</el-button>
          </template>
        </el-table-column>
        <el-table-column fixed="right" width="250" :label="$t('userLists.edit')">
          <template slot-scope="scope">
            <template v-if="scope.$index === tableDataInit">
              <el-button size="mini" plain @click="update(scope.row)">{{$t('update')}}</el-button>
              <el-button size="mini" plain @click="cancel">{{$t('cancel')}}</el-button>
            </template>
            <template v-else>
              <el-button
                size="mini"
                plain
                @click="edit(scope.row,scope.$index)"
              >{{$t('userLists.edit')}}</el-button>
              <el-button
                size="mini"
                plain
                @click="editTeams(scope.row,scope.$index)"
              >{{$t('userLists.Teams')}}</el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <div class="page_section" v-if="userNum">
        <el-pagination
          background
          small
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-sizes="[5,10,30,50,100]"
          :page-size="pageSize"
          layout="prev, pager, next,sizes,total"
          :total="userNum"
        ></el-pagination>
      </div>
      <el-dialog title="Modification Teams" :visible.sync="dialogVisible" width="70%">
        <div class>
          <el-table
            :data="TeamsData"
            border
            style="width: 100%"
            :header-cell-style="{'background':'#f5f7fa'}"
            size="mini"
          >
            <el-table-column :label="$t('userLists.Teams')">
              <template slot-scope="scope">{{scope.row.teamName}}</template>
            </el-table-column>

            <el-table-column :label="$t('userLists.edit')">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.row)"
                >Delete</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-dialog>
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
      uploadParam: [],
      filterForm: {
        name: "",
        email: "",
        regNum: "",
        active: "",
        mobile: ""
      },
      searchKey: {},
      userList: [],
      currentPage: 1,
      pageSize: 5,
      userNum: 0,
      tableDataInit: -1,
      name: "",
      mobile: "",
      email: "",
      regNumer: "",
      active: "no",
      password: "",
      expirationDate: "",
      accountType: "",
      dialogVisible: false,
      TeamsData: [],
      agentId: ""
    };
  },
  mounted() {
    this.getListData();
  },
  methods: {
    sendEmail(row) {
      this.$Posting(this.$api.sendWelcomeMail, {
        agentId: row.agentId
      }).then(res => {
        if (res.code == 0) {
          this.$notify.success({
            title: this.$t("alert.alert_success_title"),
            message: this.$t("alert.operate_success_title")
          });
          this.cancel();
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
    exportUser() {
      window.location.href = this.$addDownUrl(this.$api.exportUsers, {
        type: "users"
      });
    },
    downloadTemplate() {
      window.location.href = this.$addDownUrl(this.$api.downloadAgentTemplate);
    },
    uploadUserAfter() {
      this.cancel();
      this.currentPage = 1;
      this.clearFun();
      this.getListData();
    },
    handleSizeChange(val) {
      this.cancel();
      this.pageSize = val;
      this.getListData();
    },
    handleCurrentChange(val) {
      this.cancel();
      this.currentPage = val;
      this.getListData();
    },
    searchFun() {
      // console.log(this.searchKey);
      let self = this;
      this.currentPage = 1;
      this.cancel();
      this.searchKey = Object.assign({}, self.filterForm);
      this.getListData();
    },
    clearFun() {
      let self = this;
      this.filterForm.name = "";
      this.filterForm.email = "";
      this.filterForm.regNum = "";
      this.filterForm.active = "";
      this.filterForm.mobile = "";
      this.searchKey = Object.assign({}, self.filterForm);
    },
    refresh() {
      this.cancel();
      this.getListData();
    },
    edit(row, index) {
      this.tableDataInit = index;
      this.name = row.agentName;
      this.mobile = row.mobile;
      this.email = row.email;
      this.regNumer = row.regNum;
      this.active = row.active;
      this.mobile = row.mobile;
      this.password = row.password;
      this.expirationDate = row.expirationDate;
      this.accountType = row.accountType;
    },
    editTeams(row, index) {
      this.agentId = row.agentId;
      this.dialogVisible = true;
      this.queryTeams(row.agentId)
    },
    queryTeams(agentId) {
      this.$Get(this.$api.queryTeams, {
        agentId: agentId,
        pageSize: 999,
        pageNo: 1
      }).then(res => {
        if (res.code == 0) {
          this.TeamsData = res.datas.lists;
        }
      });
    },
    handleDelete(row) {
      console.log(row)
      this.$confirm(
        this.$t("alert.alert_delete"),
        this.$t("alert.alert_command"),
        {
          confirmButtonText: this.$t("alert.sure"),
          cancelButtonText: this.$t("alert.cancel"),
          type: "warning"
        }
      ).then(() => {
        this.$Geting(this.$api.deleteTeamsAgentAll, {
          agentId: this.agentId,
          teamId: row.teamId
        }).then(res => {
          if (res.code == 0) {
            this.$notify.success({
              title: this.$t("alert.alert_success_title"),
              message: this.$t("alert.alert_success_delete_title")
            });
            this.queryTeams(this.agentId);
          } else {
            this.$notify.error({
              title: this.$t("alert.fail"),
              message: this.$t("alert.alert_fail_delete_title")
            });
          }
        });
      });
    },
    cancel(row, index) {
      this.tableDataInit = -1;
    },
    update(row) {
      this.$Posting(this.$api.updateBrokeAgent, {
        agentId: row.agentId,
        agentName: this.name,
        email: this.email,
        active: this.active,
        password: this.password,
        mobile: this.mobile,
        regNum: this.regNumer,
        expirationDate: this.expirationDate,
        accountType: this.accountType
      }).then(res => {
        if (res.code == 0) {
          
          this.$notify.success({
            title: this.$t("alert.alert_success_title"),
            message: this.$t("alert.operate_success_title")
          });
          this.cancel();
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
      this.$Geting(this.$api.queryBrokeAgent, {
        pageSize: this.pageSize,
        pageNo: this.currentPage,
        agentName: this.searchKey.name,
        email: this.searchKey.email,
        regNum: this.searchKey.regNum,
        mobile: this.searchKey.mobile,
        active: this.searchKey.active
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
.user_list_wrapper {
  background-color: #fff;
  height: 100%;
  position: relative;
  overflow: hidden;
  .user_section {
    padding: 0px 30px 15px;
    &.user_list_table {
      border-top: 1px solid #dcdfe6;
      padding-top: 15px;
      position: absolute;
      top: 60px;
      bottom: 0;
      left: 0;
      right: 0;
      overflow-y: auto;
    }
    &.user_list {
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
</style>




