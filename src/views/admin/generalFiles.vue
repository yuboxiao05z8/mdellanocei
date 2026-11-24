<template>
  <div class="general_files_wrapper">
    <div class="import_general general_section">
      <el-row class="row_header">
        <el-col :span="8" class="col_text">
          {{$t('generalFiles.importGeneralPDFs')}}
        </el-col>
        <el-col :span="16" class="col_button">
          <uploader fileId="pdfFile" :maxSize="100" @uploadAfter="uploadPdfAfter" :url="$api.uploadGeneralFile" fileType=".pdf,.zip" :btnText="{select:$t('generalFiles.selectFile'),import:$t('generalFiles.uploadPDFs')}"></uploader>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="15">
          <el-alert :title="$t('generalFiles.importPdfsCommand')" type="info" :closable="false">
          </el-alert>
        </el-col>
      </el-row>
    </div>
    <div class="general_lists general_section">
      <el-row class="row_header">
        <el-col :span="12" class="col_text">
          <div>{{$t('generalFiles.pdfList')}}({{pdfsNum}})</div>
        </el-col>
        <el-col :span="12" class="col_button">
          <el-button size="mini" @click="refresh">{{$t('generalFiles.refresh')}}
          </el-button>
        </el-col>
      </el-row>
      <el-table :data="pdfList" border style="width: 100%" :header-cell-style="{'background':'#f5f7fa'}" size="mini">
        <el-table-column :label="$t('generalFiles.title')">
          <template slot-scope="scope">
            <el-input v-if="scope.$index === tableDataInit" v-model="title"></el-input>
            <div v-else>{{scope.row.title}}</div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('generalFiles.url')">
          <template slot-scope="scope">
            <div>{{hostUrl+scope.row.url}}</div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('generalFiles.description')">
          <template slot-scope="scope">
            <el-input v-if="scope.$index === tableDataInit" v-model="description"></el-input>
            <div v-else>{{scope.row.description}}</div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('pdf.group')">
          <template slot-scope="scope">
            <el-input v-if="scope.$index === tableDataInit" v-model="group"></el-input>
            <div v-else>{{scope.row.groupName}}</div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('generalFiles.delete')">
          <template slot-scope="scope">
            <el-button size="mini" plain :disabled="scope.$index === tableDataInit" @click="deleteData(scope.row)">{{$t('generalFiles.delete')}}</el-button>
          </template>
        </el-table-column>
        <el-table-column :label="$t('generalFiles.edit')">
          <template slot-scope="scope">
            <template v-if="scope.$index === tableDataInit">
              <el-button size="mini" plain @click="update(scope.row)">{{$t('update')}}</el-button>
              <el-button size="mini" plain @click="cancel(scope.row,scope.$index)">{{$t('cancel')}}</el-button>
            </template>
            <template v-else>
              <el-button size="mini" plain @click="edit(scope.row,scope.$index)">{{$t('generalFiles.edit')}}</el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <div class="page_section" v-if="pdfsNum">
        <el-pagination background small @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-sizes="[5,10,30,50,100]" :page-size="pageSize" layout="prev, pager, next,sizes,total" :total="pdfsNum">
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
      currentPage: 1,
      pageSize: 5,
      pdfList: [],
      pdfsNum: 0,
      tableDataInit: -1,
      title: "",
      description: "",
      group: "",
      hostUrl: sessionStorage.getItem("serveUrl") || ""
    };
  },
  mounted() {
    if (this.id !== "") {
      this.getListData();
    }
  },
  methods: {
    refresh() {
      this.cancel();
      this.getListData();
    },
    deleteData(row) {
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
        this.$Geting(this.$api.deleteGeneralFile, {
          id: row.id
        }).then(res => {
          if (res.code == 0) {
            this.$notify.success({
              title: this.$t("alert.alert_success_title"),
              message: this.$t("alert.alert_success_delete_title")
            });
            if (this.pdfList.length == 1 && this.currentPage !== 1) {
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
    update(row) {
      this.$Post(this.$api.updateGeneralFile, {
        id: row.id,
        title: this.title,
        url: `${this.hostUrl}${row.url}`,
        description: this.description,
        groupName: this.group
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
    uploadPdfAfter() {
      this.cancel();
      this.currentPage = 1;
      this.getListData();
    },
    edit(row, index) {
      this.tableDataInit = index;
      this.title = row.title;
      this.description = row.description;
      this.group = row.groupName;
    },
    cancel(row, index) {
      this.tableDataInit = -1;
    },
    //获取列表数据
    getListData() {
      this.$Geting(this.$api.queryGeneralFile, {
        pageSize: this.pageSize,
        pageNo: this.currentPage
      }).then(res => {
        if (res.code == 0) {
          this.pdfList = res.datas.lists;
          this.pdfsNum = res.datas.count;
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
.general_files_wrapper {
  background-color: #fff;
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  .general_section {
    padding: 0px 30px 15px;
    &.general_lists {
      border-top: 1px solid #dcdfe6;
      position: absolute;
      top: 120px;
      bottom: 0;
      right: 0;
      left: 0;
      overflow-y: auto;
    }
    &.import_general {
      height: 120px;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
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


