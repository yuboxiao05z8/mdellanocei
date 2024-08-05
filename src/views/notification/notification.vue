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
                    <el-date-picker
                      v-model="sendForm.sendTime"
                      type="datetime"
                      value-format="yyyy-MM-dd HH:mm:ss"
                    ></el-date-picker>
                  </el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item :label="$t('notification.SendScope')">
                <el-row class="send_scope_group">
                  <el-col>
                    <el-radio
                      v-model="sendForm.scopeType"
                      label="1"
                    >{{$t('notification.SendtoAll')}}</el-radio>
                  </el-col>
                  <el-col class="send_scope">
                    <el-radio
                      v-model="sendForm.scopeType"
                      label="2"
                    >{{$t('notification.SendtoTeam')}}</el-radio>
                    <span class="span">
                      <el-select v-model="sendForm.team">
                        <el-option
                          v-for="(team,i) in teamList"
                          :key="i"
                          :label="team.teamName"
                          :value="team.teamId"
                        ></el-option>
                      </el-select>
                    </span>
                  </el-col>
                  <el-col class="send_scope">
                    <el-radio
                      v-model="sendForm.scopeType"
                      label="3"
                    >{{$t('notification.SendtoProject')}}</el-radio>
                    <span class="span">
                      <el-select v-model="sendForm.project">
                        <el-option
                          v-for="(project,k) in projectList"
                          :key="k"
                          :label="project.projectName"
                          :value="project.projectId"
                        ></el-option>
                      </el-select>
                    </span>
                    <span class="span">
                      {{$t('notification.Audience')}}
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
                <editor
                  editorId="notificationMessage"
                  :value="sendForm.content"
                  :setting="editorSetting"
                  @show="editors"
                  @on-upload-success="onEditorUploadComplete"
                ></editor>
                <!-- <el-input type="textarea" v-model.trim="sendForm.content" style="width:340px" :rows="4"></el-input> -->
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
                  <div
                    class="tab_div"
                    :class="{'active':secondNavIndex == 1}"
                    @click="changeIndex(1)"
                  >{{$t('notification.Announcements')}}</div>
                  <div
                    class="tab_div"
                    :class="{'active':secondNavIndex == 2}"
                    @click="changeIndex(2)"
                  >{{$t('notification.Transactions')}}</div>
                </el-col>
                <el-col :span="12" class="btn_col">
                  <el-button size="small" @click="refresh">{{$t('Refresh')}}</el-button>
                </el-col>
              </el-row>
            </div>
            <div class="announcements" v-show="secondNavIndex == 1">
              <el-table
                :data="announcementList"
                border
                style="width: 100%"
                size="mini"
                :header-cell-style="{'background':'#f5f7fa'}"
              >
                <el-table-column prop="content" :label="$t('notification.Message')">
                  <template slot-scope="scope">
                    <div
                      class="base64_title"
                      @click="showContent(scope.row.content)"
                    >{{scope.row.title}}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="createTime" :label="$t('notification.ScheduledOn')"></el-table-column>
                <el-table-column prop="sendTeam" :label="$t('notification.SendTeam')"></el-table-column>
                <el-table-column prop="project" :label="$t('notification.Project')"></el-table-column>
                <el-table-column prop="audience" :label="$t('notification.Audience')"></el-table-column>
                <el-table-column :label="$t('notification.Status')">
                  <template slot-scope="scope">
                    <div v-if="scope.row.status == -1">Error</div>
                    <div v-else-if="scope.row.status == 1">{{$t('notification.Processed')}}</div>
                    <div v-else>{{$t('notification.Error')}}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="userName" :label="$t('notification.Sender')"></el-table-column>
                <el-table-column :label="$t('notification.Cancel')">
                  <template slot-scope="scope">
                    <el-button
                      v-if="scope.row.isdel == 0"
                      size="mini"
                      @click="cancelMsg(scope.row.messageId)"
                    >{{$t('notification.Cancel')}}</el-button>
                    <el-button v-else disabled size="mini">{{$t('notification.Canceled')}}</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="page_section" v-if="announcementPage.count">
                <el-pagination
                  background
                  small
                  @size-change="handleAnnounceSizeChange"
                  @current-change="handleAnnounceCurrentChange"
                  :current-page.sync="announcementPage.currentPage"
                  :page-sizes="[5,10,30,50,100]"
                  :page-size="announcementPage.pageSize"
                  layout="prev, pager, next,sizes,total"
                  :total="announcementPage.count"
                ></el-pagination>
              </div>
            </div>
            <div class="transactions" v-show="secondNavIndex == 2">
              <el-table
                :data="transactionList"
                border
                style="width: 100%"
                size="mini"
                :header-cell-style="{'background':'#f5f7fa'}"
              >
                <el-table-column :label="$t('notification.Message')">
                  <template slot-scope="scope">
                    <div class="base64_title">{{scope.row.title}}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="createTime" :label="$t('notification.ScheduledOn')"></el-table-column>
                <el-table-column :label="$t('notification.Status')">
                  <template slot-scope="scope">
                    <div v-if="scope.row.status == -1">Error</div>
                    <div v-else-if="scope.row.status == 1">{{$t('notification.Processed')}}</div>
                    <div v-else>{{$t('notification.Error')}}</div>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('notification.Cancel')">
                  <template slot-scope="scope">
                    <el-button
                      v-if="scope.row.isdel == 0"
                      size="mini"
                      @click="cancelMsg(scope.row.messageId)"
                    >{{$t('notification.Cancel')}}</el-button>
                    <el-button v-else disabled size="mini">{{$t('notification.Canceled')}}</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="page_section" v-if="transactionPage.count">
                <el-pagination
                  background
                  small
                  @size-change="handleTransactionSizeChange"
                  @current-change="handleTransactionCurrentChange"
                  :current-page.sync="transactionPage.currentPage"
                  :page-sizes="[5,10,30,50,100]"
                  :page-size="transactionPage.pageSize"
                  layout="prev, pager, next,sizes,total"
                  :total="transactionPage.count"
                ></el-pagination>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog
      :title="$t('notification.Message')"
      :visible.sync="dialogVisible"
      width="900px"
      class="message_dialog"
    >
      <div class="base64_content" v-if="base64Content">
        <div v-html="base64Content"></div>
      </div>
      <div class="base64_no_data" v-else>{{$t('notification.noData')}}</div>
    </el-dialog>
  </div>
</template>
<script>
import editor from "@/components/editor";
import tinymce from "tinymce/tinymce";
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
      editorSetting: {
        // 配置富文本编辑器高
        height: 120,
        width: 900
      },
      editorArr: [], //获取数据时富文本编辑器的图片数组
      updateEditorArr: [], //提交时富文本编辑器里面的图片数组
      teamList: [],
      projectList: [],
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
      base64Content: ""
    };
  },
  mounted() {
    this.getProjectData();
    this.getTeamData();
  },
  methods: {
    editors(obj) {
      this.sendForm.content = obj.content;
      console.log("符文布", this.sendForm.content);
    },
    onEditorUploadComplete(json) {
      json[1](this.hostUrl + json[0].filePath);
    },
    showContent(content) {
      this.dialogVisible = true;
      if (content) {
        this.base64Content = this.$base64ToContent(content);
        // cons

        // console.log( this.base64Content, content)
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
    handleAnnounceSizeChange(val) {
      this.announcementPage.pageSize = val;
      this.getListsData(1);
    },
    handleAnnounceCurrentChange(val) {
      this.announcementPage.currentPage = val;
      this.getListsData(1);
    },
    handleTransactionSizeChange(val) {
      this.transactionPage.pageSize = val;
      this.getListsData(0);
    },
    handleTransactionCurrentChange(val) {
      this.transactionPage.currentPage = val;
      this.getListsData(0);
    },
    removeHTMLTag(str) {
      str = str.replace(/<\/?[^>]*>/g, ""); //去除HTML tag
      // str = str.replace(/[ | ]*\n/g, "\n"); //去除行尾空白
      //str = str.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
      // str = str.replace(/ /gi, ""); //去掉
      return str;
    },
    escape2Html(str) {
      let arrEntities = { lt: "<", gt: ">", nbsp: " ", amp: "&", quot: '"' };
      return str.replace(/&(lt|gt|nbsp|amp|quot);/gi, function(all, t) {
        return arrEntities[t];
      });
    },
    sendNotification() {
      let params = {
        pushTime: "",
        isCustom: "",
        team: "",
        project: "",
        audience: "",
        title: this.sendForm.title,
        content: this.sendForm.content,
        intro: ""
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
      if (this.sendForm.content) {
        let str = this.removeHTMLTag(this.sendForm.content);
        let npStr = this.escape2Html(str);
        if(npStr.length > 41) {
         params.intro = npStr.slice(0, 40)
        } else {
          params.intro = npStr
        }
      }
      params.content = this.$contentToBase64(this.sendForm.content);
      this.$Posting(this.$api.insertPushLog, params).then(res => {
        if (res.code == 0) {
          this.beforeSaveCheckImage();
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
    //保存前先读取服务端返回的富文本编辑器里面的内容，晒选出图片存在缓存中
    beforeSaveGetInitEdit() {
      console.log(arguments, "2321223");
      for (let i = 0; i < arguments.length; i++) {
        this.editorArr = this.editorArr.concat(
          this.$changeHtmlStr(arguments[i])
        );
      }
    },
    //保存前获取编辑后的富文本编辑器的内容
    beforeSaveGetEdit() {
      for (let i = 0; i < arguments.length; i++) {
        this.updateEditorArr = this.updateEditorArr.concat(
          this.$changeHtmlStr(arguments[i])
        );
      }
    },
    //提交之前进行图片的检测
    beforeSaveCheckImage() {
      let editorImg =
        JSON.parse(window.sessionStorage.getItem("editorImg")) || [];
      this.beforeSaveGetEdit(this.sendForm.content);

      let allEditorArr = [...editorImg, ...this.editorArr]; //将缓存里面的图片和获取的富文本编辑器的图片进行整合
      allEditorArr.length &&
        window.sessionStorage.setItem(
          "editorImg",
          JSON.stringify(allEditorArr)
        ); //点击时将之前富文本编辑器里面的图片进行缓存
      this.$changeSession(this.updateEditorArr);
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
      padding: 18px 0;
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
    border-top: 1px solid #ebeef5;
    overflow: auto;
    .base64_no_data {
      text-align: center;
    }
    .base64_content {
      img {
        max-width: 100%;
      }
    }
  }
}
</style>


