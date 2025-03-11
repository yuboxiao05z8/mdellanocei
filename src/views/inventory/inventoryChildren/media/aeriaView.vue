<template>
  <div class="aeria_view_wrapper">
    <div class="aeria_view_list aeria_view">
      <el-row class="row_header">
        <el-col :span="12" class="col_text">
          <div>{{$t('ivt.ivtList')}}({{ivtNum}})</div>
        </el-col>
        <el-col :span="12" class="col_button">
          <el-button size="mini" :disabled="tableDataInit!==-1" @click="add">{{$t('ivt.addIvt')}}</el-button>
          <el-button size="mini" @click="refresh">{{$t('ivt.refresh')}}</el-button>
        </el-col>
      </el-row>
      <el-table
        :data="ivtList"
        border
        style="width: 100%"
        :header-cell-style="{'background':'#f5f7fa'}"
        size="mini"
      >
        <el-table-column :label="$t('ivt.title')">
          <template slot-scope="scope">
            <el-input v-if="scope.$index === tableDataInit" v-model="title"></el-input>
            <div v-else>{{scope.row.title}}</div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('ivt.backgroundImage')">
          <template slot-scope="scope">
            <div v-if="scope.row.url">
              <!-- {{hostUrl+scope.row.url}} -->
          <img style="width:65px" @click.stop="$imgPreview(hostUrl + scope.row.url)" :src="hostUrl+scope.row.url" alt="">

            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('ivt.ivtUrl')">
          <template slot-scope="scope">
            <el-input v-if="scope.$index === tableDataInit" v-model="link"></el-input>
            <div v-else>{{scope.row.link}}</div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('ivt.uploadIvt')">
          <template slot-scope="scope">
            <uploader
              :isDisabled="(scope.$index === tableDataInit)"
              :fileId="'ivt'+scope.row.id"
              :uploadParam="uploadModelParam"
              @uploadAfter="uploadModelAfter"
              :url="$api.uploadFile"
              fileType="image/*"
              :selfNum="scope.row.self"
              :btnText="{import:$t('upLoad')}"
              :showType="1"
            ></uploader>
          </template>
        </el-table-column>
        <el-table-column :label="$t('ivt.delete')">
          <template slot-scope="scope">
            <el-button
              size="mini"
              plain
              :disabled="scope.$index === tableDataInit || scope.row.self == 0"
              @click="deleteData(scope.row)"
            >{{$t('ivt.delete')}}</el-button>
          </template>
        </el-table-column>
        <el-table-column :label="$t('ivt.edit')">
          <template slot-scope="scope">
            <template v-if="scope.$index === tableDataInit">
              <el-button :disabled="scope.row.self == 0" size="mini" plain @click="update(scope.row)">{{$t('update')}}</el-button>
              <el-button :disabled="scope.row.self == 0" size="mini" plain @click="cancel(scope.row,scope.$index)">{{$t('cancel')}}</el-button>
            </template>
            <template v-else>
              <el-button :disabled="scope.row.self == 0" size="mini" plain @click="edit(scope.row,scope.$index)">{{$t('ivt.edit')}}</el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <div class="page_section" v-if="ivtNum">
        <el-pagination
          background
          small
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-sizes="[5,10,30,50,100]"
          :page-size="pageSize"
          layout="prev, pager, next,sizes,total"
          :total="ivtNum"
        ></el-pagination>
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
      ivtList: [],
      currentPage: 1,
      pageSize: 5,
      ivtNum: 0,
      tableDataInit: -1,
      id: JSON.parse(sessionStorage.getItem("projectDesc") || "{}").id || "",
      hostUrl: sessionStorage.getItem("serveUrl") || "",
      title: "",
      url: "",
      link: "",
      uploadModelParam: [
        {
          name: "projectId",
          value:
            JSON.parse(sessionStorage.getItem("projectDesc") || "{}").id || ""
        },
        {
          name: "type",
          value: "projectFileToIVT"
        }
      ]
    };
  },
  mounted() {
    if (this.id !== "") {
      this.getListData();
    }
  },
  methods: {
    handleSizeChange(val) {
      this.cancelAddData();
      this.pageSize = val;
      this.getListData();
    },
    handleCurrentChange(val) {
      this.cancelAddData();
      this.currentPage = val;
      this.getListData();
    },
    uploadModelAfter(datas) {
      this.ivtList[this.tableDataInit].url = datas.filePath;
      this.url = datas.filePath;
    },
    refresh() {
      this.cancelAddData();
      this.getListData();
    },
    //获取列表数据
    getListData() {
      this.$Geting(this.$api.queryProjectMedia, {
        projectId: this.id,
        type: "IVT",
        pageSize: this.pageSize,
        pageNo: this.currentPage
      }).then(res => {
        if (res.code == 0) {
          this.ivtList = res.datas.lists;
          this.ivtNum = res.datas.count;
        } else {
          this.$notify.error({
            title: "fail",
            message: res.msg
          });
          return false;
        }
      });
    },
    add() {
      this.ivtList.unshift({
        url: ""
      });
      this.tableDataInit = 0;
    },
    edit(row, index) {
      this.tableDataInit = index;
      this.title = row.title;
      this.url = row.url;
      this.link = row.link;
    },
    cancel(row, index) {
      if (index == 0) {
        if (row.id == undefined) {
          this.ivtList.shift();
        }
      }
      this.cancelAddData();
    },
    cancelAddData() {
      this.title = "";
      this.url = "";
      this.link = "";
      this.tableDataInit = -1;
    },
    update(row) {
      if (this.title) {
        this.updateIvt(row.id || "");
      }
    },
    updateIvt(id) {
      this.$Posting(this.$api.saveProjectMediaIVT, {
        projectId: this.id,
        title: this.title,
        url: this.url,
        link: this.link,
        type: "IVT",
        id: id
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
        this.$Geting(this.$api.deleteProjectMediaIVT, {
          id: row.id,
          url: row.url
        }).then(res => {
          if (res.code == 0) {
            this.$notify.success({
              title: this.$t("alert.alert_success_title"),
              message: this.$t("alert.alert_success_delete_title")
            });
            if (this.ivtList.length == 1 && this.currentPage !== 1) {
              this.currentPage--;
            }
            this.refresh();
          } else {
            this.$notify.error({
              title: this.$t("alert.fail"),
              message: this.$t("alert.alert_fail_delete_title")
            });
          }
        });
      });
    }
  }
};
</script>
<style lang="less">
.aeria_view_wrapper {
  background-color: #fff;
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  overflow: auto;
  .aeria_view {
    padding: 0px 30px 15px;
    border-top: 1px solid #dcdfe6;
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

