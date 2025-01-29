<template>
  <div class="notification_wrapper">
    <div class="notification_tab">
      <el-tabs v-model="firstNavIndex" @tab-click="handleClick">
        <el-tab-pane :label="$t('notification.SendNotification')" name="1">
          <div class="send_notification">
            <el-form size="small" label-width="150px">
              <el-form-item :label="$t('notification.title')">
                <el-input v-model="sendForm.title" style="width:200px"></el-input>
              </el-form-item>
              <el-form-item :label="$t('notification.SendTime')">
                <el-radio-group v-model="sendForm.timeType">
                  <el-radio label="1">{{$t('notification.SendImmediately')}}</el-radio>
                  <el-radio label="2">
                    <el-date-picker v-model="sendForm.sendTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss">
                    </el-date-picker>
                  </el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item :label="$t('notification.SendScope')">
                <el-row class="send_scope_group">
                  <el-col>
                    <el-radio v-model="sendForm.scopeType" label="1">{{$t('notification.SendtoAll')}}</el-radio>
                  </el-col>
                  <el-col class="send_scope">
                    <el-radio v-model="sendForm.scopeType" label="2">{{$t('notification.SendtoTeam')}}</el-radio>
                    <span class="span">
                      <el-select v-model="sendForm.team">
                        <el-option v-for="(team,i) in teamList" :key="i" :label="team.teamName" :value="team.teamId"></el-option>
                      </el-select>
                    </span>
                  </el-col>
                  <el-col class="send_scope">
                    <el-radio v-model="sendForm.scopeType" label="3">{{$t('notification.SendtoProject')}}</el-radio>
                    <span class="span">
                      <el-select v-model="sendForm.project">
                        <el-option v-for="(project,k) in projectList" :key="k" :label="project.projectName" :value="project.projectId"></el-option>
                      </el-select>
                    </span>
                    <span class="span">{{$t('notification.Audience')}}
                      <el-select v-model="sendForm.audience">
                        <el-option label="All" value="3"></el-option>
                        <el-option label="External/Co-Broke Only" value="2"></el-option>
                        <el-option label="Internal User" value="1"></el-option>
                      </el-select>
                    </span>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item :label="$t('notification.Message')">
                <editor editorId="notificationMsg" uploadImageType="2" :value="sendForm.content" :setting="editorSetting" @show="editors" @on-upload-success="onEditorUploadComplete"></editor>
              </el-form-item>
            </el-form>
            <div class="btn">
              <el-button type="primary" @click="sendNotification">{{$t('notification.Send')}}</el-button>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="$t('notification.HistoryMessages')" name="2">
          <div class="history_message">
            <div class="tab">
              <el-row>
                <el-col :span="12" class="tab_col">
                  <div class="tab_div" :class="{'active':secondNavIndex == 1}" @click="changeIndex(1)">{{$t('notification.Announcements')}}</div>
                  <div class="tab_div" :class="{'active':secondNavIndex == 2}" @click="changeIndex(2)">{{$t('notification.Transactions')}}</div>
                </el-col>
                <el-col :span="12" class="btn_col">
                  <el-button size="small" @click="refresh">{{$t('Refresh')}}</el-button>
                </el-col>
              </el-row>
            </div>
            <div class="announcements" v-show="secondNavIndex == 1">
              <el-table size="mini" :data="announcementList" border style="width: 100%" size="mini" :header-cell-style="{'background':'#f5f7fa'}">
                <el-table-column prop="content" :label="$t('notification.Message')">
                  <template slot-scope="scope">
                    <div class="base64_title" @click="showContent(scope.row.content)">{{scope.row.title}}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="createTime" :label="$t('notification.ScheduledOn')">
                </el-table-column>
                <el-table-column prop="sendTeam" :label="$t('notification.SendTeam')">
                </el-table-column>
                <el-table-column prop="project" :label="$t('notification.Project')">
                </el-table-column>
                <el-table-column prop="audience" :label="$t('notification.Audience')">
                </el-table-column>
                <el-table-column :label="$t('notification.Status')">
                  <template slot-scope="scope">
                    <div v-if="scope.row.status == -1">Error</div>
                    <div v-else-if="scope.row.status == 1">{{$t('notification.Processed')}}</div>
                    <div v-else>{{$t('notification.Error')}}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="userName" :label="$t('notification.Sender')">
                </el-table-column>
                <el-table-column :label="$t('notification.Cancel')">
                  <template slot-scope="scope">
                    <el-button v-if="scope.row.isdel == 0" size="mini" @click="cancelMsg(scope.row.messageId)">{{$t('notification.Cancel')}}</el-button>
                    <el-button v-else disabled size="mini">{{$t('notification.Canceled')}}</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="page_section" v-if="announcementPage.count">
                <el-pagination background small @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="announcementPage.currentPage" :page-sizes="[5,10,30,50,100]" :page-size="announcementPage.pageSize" layout="prev, pager, next,sizes,total" :total="announcementPage.count">
                </el-pagination>
              </div>
            </div>
            <div class="transactions" v-show="secondNavIndex == 2">
              <el-table :data="transactionList" border style="width: 100%" size="mini" :header-cell-style="{'background':'#f5f7fa'}">
                <el-table-column :label="$t('notification.Message')">
                  <template slot-scope="scope">
                    <div class="base64_title">{{scope.row.content}}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="createTime" :label="$t('notification.ScheduledOn')">
                </el-table-column>
                <el-table-column :label="$t('notification.Status')">
                  <template slot-scope="scope">
                    <div v-if="scope.row.status == -1">Error</div>
                    <div v-else-if="scope.row.status == 1">{{$t('notification.Processed')}}</div>
                    <div v-else>{{$t('notification.Error')}}</div>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('notification.Cancel')">
                  <template slot-scope="scope">
                    <el-button v-if="scope.row.isdel == 0" size="mini" @click="cancelMsg(scope.row.messageId)">{{$t('notification.Cancel')}}</el-button>
                    <el-button v-else disabled size="mini">{{$t('notification.Canceled')}}</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="page_section" v-if="transactionPage.count">
                <el-pagination background small @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="transactionPage.currentPage" :page-sizes="[5,10,30,50,100]" :page-size="transactionPage.pageSize" layout="prev, pager, next,sizes,total" :total="transactionPage.count">
                </el-pagination>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog :title="$t('notification.Message')" :visible.sync="dialogVisible" width="900px" class="message_dialog">
        <div class="base64_content" v-if="base64Content" v-html="base64Content"></div>
        <div class="base64_no_data" v-else>{{$t('notification.noData')}}</div>
    </el-dialog>
  </div>
</template>
<script>
import editor from "@/components/editor";
export default {
  components: {
    editor
  },
  data() {
    return {
      hostUrl: sessionStorage.getItem("serveUrl") || "",
      firstNavIndex: "1",
      secondNavIndex: 1,
      sendTimeType: "",
      sendForm: {
        timeType: "",
        sendTime: "",
        scopeType: "",
        team: "",
        project: "",
        audience: "All",
        content: "",
        title: ""
      },
      teamList: [],
      projectList: [],
      editorSetting: {
        // 配置富文本编辑器高
        height: 250,
        width: 900
      },
      announcementList: [],
      announcementPage: {
        currentPage: 1,
        pageSize: 10,
        count: 0
      },
      transactionList: [],
      transactionPage: {
        currentPage: 1,
        pageSize: 10,
        count: 0
      },
      dialogVisible: false,
      base64Content:""
    };
  },
  mounted() {
    this.getProjectData();
    this.getTeamData();
  },
  methods: {
    showContent(content) {
      this.dialogVisible = true;
      if(content){
        this.base64Content = this.$base64ToContent(content)
      }
    },
    cancelMsg(id) {
      this.$Geting(this.$api.cancelMessage, {
        messageId: id
      }).then(res => {
        if (res.code == 0) {
          this.$notify.success({
            title: this.$t("alert.alert_success_title"),
            message: this.$t("alert.operate_success_title")
          });
          this.refresh();
        } else {
          this.$notify.error({
            title: "fail",
            message: res.msg
          });
          return false;
        }
      });
    },
    handleSizeChange() {},
    handleCurrentChange() {},
    sendNotification() {
      let params = {
        pushTime: "",
        isCustom: "",
        content: "",
        team: "",
        project: "",
        audience: "",
        title: this.sendForm.title
      };
      if (this.sendForm.timeType == 2) {
        params.pushTime = this.sendForm.sendTime;
      }
      if (this.sendForm.scopeType == 1) {
        params.isCustom = 0;
      } else if (this.sendForm.scopeType == 2) {
        params.isCustom = 1;
        params.team = this.sendForm.team;
      } else if (this.sendForm.scopeType == 3) {
        params.isCustom = 1;
        params.project = this.sendForm.project;
        params.audience = this.sendForm.audience;
      }
      params.content = this.$contentToBase64(this.sendForm.content);
      this.$Posting(this.$api.insertPushLog, params).then(res => {
        if (res.code === "0") {
          if (window.sessionStorage.getItem("editorImg")) {
            window.sessionStorage.removeItem("editorImg");
          }
          this.$notify.success({
            title: this.$t("alert.alert_success_title"),
            message: this.$t("alert.operate_success_title")
          });
        } else {
          this.$notify.error({
            title: this.$t("alert.fail"),
            message: this.$t("alert.operate_fail_title")
          });
        }
      });
    },
    changeIndex(index) {
      this.secondNavIndex = index;
      // console.log(index);
    },
    refresh() {
      if (this.secondNavIndex == 2) {
        this.getListsData(0);
      } else {
        this.getListsData(1);
      }
    },
    handleClick() {
      if (this.firstNavIndex == 2) {
        this.getListsData(1);
        this.getListsData(0);
      }
    },
    editors(obj) {
      // editor组件传过来的值赋给content
      this.sendForm.content = obj.content;
    },
    onEditorUploadComplete(json) {
      // 处理上传图片后返回数据，添加img标签到编辑框内
      json[1](this.hostUrl + json[0].filePath);
    },
    getListsData(type) {
      let params;
      if (type == 1) {
        //Announcements
        params = {
          type: 1,
          pageSize: this.announcementPage.pageSize,
          pageNo: this.announcementPage.currentPage
        };
      } else {
        //Transactions
        params = {
          type: 0,
          pageSize: this.transactionPage.pageSize,
          pageNo: this.transactionPage.currentPage
        };
      }
      this.$Geting(this.$api.queryPushLogList, params).then(res => {
        if (res.code == 0) {
          if (type == 1) {
            this.announcementList = res.datas.lists;
            this.announcementPage.count = res.datas.count;
          } else {
            this.transactionList = res.datas.lists;
            this.transactionPage.count = res.datas.count;
          }
        } else {
          this.$notify.error({
            title: "fail",
            message: res.msg
          });
          return false;
        }
      });
    },
    getTeamData() {
      this.$Geting(this.$api.queryTeams, {
        pageSize: 10000,
        pageNo: 1
      }).then(res => {
        if (res.code == 0) {
          this.teamList = res.datas.lists;
        } else {
          this.$notify.error({
            title: "fail",
            message: res.msg
          });
          return false;
        }
      });
    },
    getProjectData() {
      this.$Geting(this.$api.queryProject, {
        pageSize: 10000,
        pageNo: 1
      }).then(res => {
        if (res.code == 0) {
          this.projectList = res.datas.lists;
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
  beforeDestroy() {
    this.$deleteImg();
  }
};
</script>
<style lang="less">
.notification_wrapper {
  background-color: #fff;
  height: 100%;
  position: relative;
  overflow: hidden;
  .base64_title {
    width: 90%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
    text-decoration: underline;
  }
  .notification_tab {
    height: 60px;
    padding: 0 15px;
    .el-tabs__content {
      position: absolute;
      top: 60px;
      left: 0;
      right: 0;
      bottom: 0;
    }
    .el-tabs__item {
      height: 60px;
      line-height: 60px;
    }
    .send_notification {
      padding: 20px;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      overflow: auto;
      .send_scope_group {
        .el-radio__label {
          display: inline-block;
          width: 110px;
        }
        .send_scope {
          margin-bottom: 10px;
          .span {
            margin: 0 10px;
          }
        }
      }
      .btn {
        padding: 15px;
        border-top: 1px solid #dcdfe6;
      }
    }
  }
  .history_message {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 18px;
    padding-top: 0;
    z-index: 0;
    .tab {
      padding: 10px 0;
      border-bottom: 1px solid #dcdfe6;
      background-color: #fff;
      .tab_col {
        .tab_div {
          float: left;
          height: 32px;
          line-height: 32px;
          width: 150px;
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
      .btn_col {
        text-align: right;
      }
    }
    .announcements,
    .transactions {
      position: absolute;
      top: 53px;
      left: 0;
      right: 0;
      bottom: 0;
      overflow: auto;
      padding: 18px;
      z-index: -1;
      .page_section {
        text-align: center;
      }
    }
  }
}
.message_dialog {
  .el-dialog__body {
    height: 400px;
    border-top:1px solid #ebeef5;
    overflow: auto;
    .base64_no_data{
      text-align: center;
    }
  }
}
</style>


