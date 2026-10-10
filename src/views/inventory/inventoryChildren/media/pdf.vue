<template>
  <div class="pdfs_wrapper">
    <div class="import_pdf pdf_section">
      <el-row class="row_header">
        <el-col :span="8" class="col_text">{{$t('pdf.importPDFs')}}</el-col>
        <el-col :span="16" class="col_button">
          <uploader fileId="pdfFile" :maxSize="100" :uploadParam="uploadParam" @uploadAfter="uploadPdfAfter" :url="$api.uploadProjectMedia" fileType=".pdf,.zip" :btnText="{select:$t('pdf.selectFile'),import:$t('pdf.addPDFs')}"></uploader>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="15">
          <el-alert :title="$t('pdf.importPDFsCommand')" type="info" :closable="false"></el-alert>
        </el-col>
      </el-row>
    </div>
    <div class="pdf_lists pdf_section">
      <el-row class="row_header">
        <el-col :span="12" class="col_text">
          <div>{{$t('pdf.pdfList')}} ({{pdfsNum}})</div>
        </el-col>
        <el-col :span="12" class="col_button">
          <el-button size="mini" @click="add" :disabled="tableDataInit!==-1">{{$t('pdf.addPDFWithUrl')}}</el-button>
          <el-button size="mini" @click="refresh">{{$t('pdf.refresh')}}</el-button>
        </el-col>
      </el-row>
      <el-table :data="pdfList" border style="width: 100%" :header-cell-style="{'background':'#f5f7fa'}" size="mini">
        <el-table-column :label="$t('pdf.title')">
          <template slot-scope="scope">
            <el-input v-if="scope.$index === tableDataInit" v-model="title"></el-input>
            <div v-else>{{scope.row.title}}</div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('pdf.isSensitive')">
          <template slot-scope="scope">
            <el-checkbox v-model="isSensitive" v-if="scope.$index === tableDataInit" :true-label="0" :false-label="1"></el-checkbox>
            <div v-else>
              <i class="el-icon-check" v-if="scope.row.sensitive == 0"></i>
              <i class="el-icon-close" v-else></i>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('pdf.restrictEmail')">
          <template slot-scope="scope">
            <el-checkbox v-model="restrictEmail" v-if="scope.$index === tableDataInit" :true-label="0" :false-label="1"></el-checkbox>
            <div v-else>
              <i class="el-icon-check" v-if="scope.row.restrictEmail == 0"></i>
              <i class="el-icon-close" v-else></i>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('image.url')">
          <template slot-scope="scope">
            <el-input v-if="scope.$index === tableDataInit" v-model="url"></el-input>
            <div v-else>{{$urlEncode(hostUrl+scope.row.url)}}</div>
          </template>
        </el-table-column>
        <el-table-column label="showIndex">
          <template slot-scope="scope">
            <el-input v-if="scope.$index === tableDataInit" v-model="showIndex"></el-input>
            <div v-else>{{scope.row.showIndex}}</div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('pdf.description')">
          <template slot-scope="scope">
            <el-input v-if="scope.$index === tableDataInit" v-model="description"></el-input>
            <div v-else>{{scope.row.description}}</div>
          </template>
        </el-table-column>

        <el-table-column label="language">
          <template slot-scope="scope">
            <el-select v-if="scope.$index === tableDataInit" v-model="language" placeholder="please select">
              <el-option v-for="item in LangOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <div v-else>{{scope.row.lang}}</div>
          </template>
        </el-table-column>

        <el-table-column :label="$t('pdf.group')">
          <template slot-scope="scope">
            <el-input v-if="scope.$index === tableDataInit" v-model="group"></el-input>
            <div v-else>{{scope.row.groupName}}</div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('pdf.delete')" width="100px">
          <template slot-scope="scope">
            <el-button size="mini" plain :disabled="scope.$index === tableDataInit || scope.row.self == 0" @click="deleteData(scope.row)">{{$t('pdf.delete')}}</el-button>
          </template>
        </el-table-column>
        <el-table-column :label="$t('pdf.edit')" width="170px">
          <template slot-scope="scope">
            <template v-if="scope.$index === tableDataInit">
              <el-button :disabled="scope.row.self == 0" size="mini" plain @click="update(scope.row)">{{$t('update')}}</el-button>
              <el-button :disabled="scope.row.self == 0" size="mini" plain @click="cancel(scope.row,scope.$index)">{{$t('cancel')}}</el-button>
            </template>
            <template v-else>
              <el-button :disabled="scope.row.self == 0" size="mini" plain @click="edit(scope.row,scope.$index)">{{$t('pdf.edit')}}</el-button>
            </template>
            <el-button :disabled="scope.row.self == 0" size="mini" plain @click="mainClick(scope.row)" v-if="scope.row.pndType!=1&&scope.row.type==2">Main PDF</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page_section" v-if="pdfsNum">
        <el-pagination background small @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-sizes="[5,10,30,50,100]" :page-size="pageSize" layout="prev, pager, next,sizes,total" :total="pdfsNum"></el-pagination>
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
  data () {
    return {
      currentPage: 1,
      pageSize: 5,
      pdfList: [],
      pdfsNum: 0,
      tableDataInit: -1,
      title: "",
      isSensitive: 1,
      url: "",
      group: "",
      restrictEmail: 1,
      description: "",
      language: "",
      showIndex: "",
      hostUrl: sessionStorage.getItem("serveUrl") || "",
      id: JSON.parse(sessionStorage.getItem("projectDesc") || "{}").id || "",
      uploadParam: [
        {
          name: "projectId",
          value:
            JSON.parse(sessionStorage.getItem("projectDesc") || "{}").id || ""
        },
        {
          name: "type",
          value: "PDF"
        }
      ],
      LangOptions: [
        {
          value: "zh",
          label: "zh"
        },
        {
          value: "en",
          label: "en"
        },
        {
          value: "cb",
          label: "cb"
        },
        {
          value: "vi",
          label: "vi"
        }
      ]
    };
  },
  mounted () {
    if (this.id !== "") {
      this.getListData();
    }
  },
  methods: {
    mainClick (row) {
      this.$Get(this.$api.updatePdfType, {
        id: row.id,
        projectId: row.projectId
      }).then(res => {
        if (res.code == 0) {
          this.$message.success('设置成功')
          this.getListData();
        }
      })
    },
    refresh () {
      this.cancelAddData();
      this.getListData();
    },
    deleteData (row) {
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
        this.$Geting(this.$api.deleteProjectMedia, {
          id: row.id
        }).then(res => {
          if (res.code == 0) {
            this.$deleteFile(this.hostUrl + row.url);
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
    update (row) {
      // console.log(row);
      this.$Posting(this.$api.saveProjectMedia, {
        projectId: this.id,
        id: row.id,
        title: this.title,
        url: this.url,
        description: this.description,
        showIndex: this.showIndex ? this.showIndex * 1 : 1,
        type: "PDF",
        groupName: this.group,
        restrictEmail: this.restrictEmail,
        sensitive: this.isSensitive,
        lang: this.language
      }).then(res => {
        if (res.code == 0) {
          this.$notify.success({
            title: this.$t("alert.alert_success_title"),
            message: this.$t("alert.operate_success_title")
          });
          this.cancelAddData();
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
    handleSizeChange (val) {
      this.cancelAddData();
      this.pageSize = val;
      this.getListData();
    },
    handleCurrentChange (val) {
      this.cancelAddData();
      this.currentPage = val;
      this.getListData();
    },
    uploadPdfAfter () {
      this.cancelAddData();
      this.currentPage = 1;
      this.getListData();
    },
    add () {
      this.pdfList.unshift({});
      this.tableDataInit = 0;
    },
    edit (row, index) {
      this.tableDataInit = index;
      this.title = row.title;
      this.url = this.hostUrl + row.url;
      this.isSensitive = row.sensitive;
      this.restrictEmail = row.restrictEmail;
      this.description = row.description;
      this.showIndex = row.showIndex;
      this.group = row.groupName;
      this.language = row.lang
    },
    cancel (row, index) {
      if (index == 0) {
        if (row.id === undefined) {
          this.pdfList.shift();
        }
      }
      this.cancelAddData();
    },
    cancelAddData () {
      this.title = "";
      this.isSensitive = 1;
      this.restrictEmail = 1;
      this.description = "";
      this.url = "";
      this.showIndex = "";
      this.tableDataInit = -1;
      this.group = "";
      this.language = ""
    },
    //获取列表数据
    getListData () {
      this.$Geting(this.$api.queryProjectMedia, {
        projectId: this.id,
        type: "PDF",
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
.pdfs_wrapper {
  background-color: #fff;
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  overflow: auto;
  .pdf_section {
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

