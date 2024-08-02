<template>
  <div class="feedback">
    <div class="feedback_head">{{$t('Feedback')}}</div>
    <div class>
      <el-table
        :data="FeedbackList"
        border
        style="width: 100%"
        :header-cell-style="{'background':'#f5f7fa'}"
        size="mini"
      >
        <el-table-column :label="$t('FeedbackType')">
          <template slot-scope="scope">
            <div>{{scope.row.type}}</div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('content')">
          <template slot-scope="scope">
            <div style="color: #409eff;cursor: pointer;" @click="CheckContent(scope.row)" class="clickDiv">{{$t('ContentViewed')}}</div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('propounder')">
          <template slot-scope="scope">
            <div>{{scope.row.agentName}}</div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('time')" >
          <template slot-scope="scope">
            <div>{{$dateFormat(scope.row.feedbackTime)}}</div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('status')" >
          <template slot-scope="scope">
            <div v-if="scope.row.status == 0">{{$t('BeingProcessed')}}</div>
            <div v-if="scope.row.status == 1">{{$t('CCarryOff')}}</div>
            <div v-if="scope.row.status == 2">{{$t('noProcessing')}}</div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('Edit')">
          <template slot-scope="scope">
            <el-button size="mini" plain @click="updateFeedbackStatus(scope.row, 1)">{{$t('CCarryOff')}}</el-button>
            <el-button size="mini" plain @click="updateFeedbackStatus(scope.row,2)">{{$t('noProcessing')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page_section" v-if="calendarNum">
        <el-pagination
          background
          small
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-sizes="[5,10,30,50,100]"
          :page-size="pageSize"
          layout="prev, pager, next,sizes,total"
          :total="calendarNum"
        ></el-pagination>
      </div>
    </div>
    <el-dialog class="isContentShow" :title="$t('content')" :visible.sync="isContentShow" width="60%" >
      <div  v-html="contentText"></div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="isContentShow = false">OK</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "feedback",
  data() {
    return {
      calendarNum: 0,
      currentPage: 1,
      pageSize: 5,
      FeedbackList: [],
      isContentShow: false,
      contentText: ''
    };
  },
  mounted() {
    this.queryFeedback();
  },
  methods: {
    CheckContent(row) {
      this.isContentShow = true
      this.contentText = this.$base64ToContent(row.content)
    },
    handleClose() {},
    queryFeedback() {
      this.$Get(this.$api.queryFeedback, {
        pageNo: this.currentPage,
        pageSize: this.pageSize
      }).then(res => {
        if (res.code == 0) {
          this.calendarNum = res.datas.count;
          this.FeedbackList = res.datas.lists;
        }
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.queryFeedback();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.queryFeedback();
    },

    updateFeedbackStatus(row, status) {
      let agentId = JSON.parse(sessionStorage.getItem("userInfo")).agentId;
      let data = {
        status: status,
        feedbackId: row.id,
        userId: agentId,
        processContent: status
      };
      this.$Post(this.$api.updateFeedbackStatus, data).then(res => {
        if (res.code == 0) {
          this.$notify.success({
            title: this.$t("alert.alert_success_title"),
            message: res.msg
          });
          this.queryFeedback();
        } else {
          this.$notify.error({
            title: "fail",
            message: res.msg
          });
          return false;
        }
      });
    },
    editData(row) {}
  }
};
</script>

<style lang="less">
.feedback {
  height: 100%;
  background: #fff;
  padding: 10px;
  .feedback_head {
    padding: 15px;
    margin-bottom: 15px;
    border-bottom: 1px solid #ddd;
  }
  .page_section {
    text-align: center;
  }
  .clickDiv {
    color: #409eff;
    cursor: pointer;
  }
  .el-dialog__body{
    max-height: 400px;
    overflow-y: scroll;
    img{
      width: 100%;
    }
  }
  .el-dialog__footer,.el-dialog__header{
    text-align: center;
  }
}
</style>