<template>
  <div class="vedios_wrapper">
    <div class="import_vedio vedio_section">
      <el-row class="row_header">
        <el-col :span="8" class="col_text">{{$t('vedio.importVideos')}}</el-col>
        <el-col :span="16" class="col_button">
          <uploader fileId="videoFile" :maxSize="100" :uploadParam="uploadParam" @uploadAfter="uploadImagefter" :url="$api.uploadProjectMedia" fileType=".mp4" :btnText="{select:$t('vedio.selectFile'),import:$t('vedio.addVideos')}"></uploader>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="15">
          <el-alert :title="$t('vedio.importVideosCommand')" type="info" :closable="false"></el-alert>
        </el-col>
      </el-row>
    </div>
    <div class="vedio_lists vedio_section">
      <el-row class="row_header">
        <el-col :span="12" class="col_text">
          <div>{{$t('vedio.videoList')}} ({{videoNum}})</div>
        </el-col>
        <el-col :span="12" class="col_button">
          <el-button size="mini" @click="add" :disabled="tableDataInit!==-1">{{$t('vedio.addVideoWithUrl')}}</el-button>
          <el-button size="mini" @click="refresh">{{$t('vedio.refresh')}}</el-button>
        </el-col>
      </el-row>
      <el-table :data="videoList" border style="width: 100%" :header-cell-style="{'background':'#f5f7fa'}" size="mini">
        <el-table-column :label="$t('vedio.title')">
          <template slot-scope="scope">
            <el-input v-if="scope.$index === tableDataInit" v-model="title"></el-input>
            <div v-else>{{scope.row.title}}</div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('vedio.url')">
          <template slot-scope="scope">
            <el-input v-if="scope.$index === tableDataInit" v-model="url"></el-input>
            <div v-else>
              <div v-if="scope.row.url">
                <p v-if="sliceFn(scope.row.url)">{{hostUrl+scope.row.url}}</p>
                <p v-else>
                  {{scope.row.url}}
                </p>

              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="showIndex">
          <template slot-scope="scope">
            <el-input v-if="scope.$index === tableDataInit" v-model="showIndex"></el-input>
            <div v-else>{{scope.row.showIndex}}</div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('VideoMainPhoto')">
          <template slot-scope="scope">
            <el-input v-if="scope.$index === tableDataInit" v-model="logoUrl"></el-input>
            <div v-else>
              <div v-if="scope.row.logoUrl">
                <p v-if="sliceFn(scope.row.logoUrl)">
                  <img style="width:65px" @click.stop="$imgPreview($urlEncode(hostUrl + scope.row.logoUrl))" :src="$urlEncode(hostUrl+scope.row.logoUrl)" alt="">
                </p>
                <p v-else>
                  {{scope.row.logoUrl}}
                </p>

              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('vedio.description')">
          <template slot-scope="scope">
            <el-input v-if="scope.$index === tableDataInit" v-model="description"></el-input>
            <div v-else>{{scope.row.description}}</div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('UploadCover')" width="120">
          <template slot-scope="scope">
            <uploader :isDisabled="Boolean(scope.$index==tableDataInit&&scope.row.id)" :fileId="'documentTable'+scope.row.id" :maxSize="100" :uploadParam="uploadTableParam" @uploadAfter="uploadTableAfter" :url="$api.uploadFile" fileType=".jpg,.jpeg,.png,.gif" :btnText="{import: $t('UploadCover')}" :showType="1"></uploader>
          </template>
        </el-table-column>
        <el-table-column :label="$t('vedio.delete')">
          <template slot-scope="scope">
            <el-button size="mini" plain :disabled="scope.$index === tableDataInit || scope.row.self == 0" @click="deleteData(scope.row)">{{$t('vedio.delete')}}</el-button>
          </template>
        </el-table-column>
        <el-table-column :label="$t('vedio.edit')">
          <template slot-scope="scope">
            <template v-if="scope.$index === tableDataInit">
              <el-button size="mini" :disabled="scope.row.self == 0" plain @click="update(scope.row)">{{$t('update')}}</el-button>
              <el-button size="mini" :disabled="scope.row.self == 0" plain @click="cancel(scope.row,scope.$index)">{{$t('cancel')}}</el-button>
            </template>
            <template v-else>
              <el-button size="mini" :disabled="scope.row.self == 0" plain @click="edit(scope.row,scope.$index)">{{$t('vedio.edit')}}</el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <div class="page_section" v-if="videoNum">
        <el-pagination background small @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-sizes="[5,10,30,50,100]" :page-size="pageSize" layout="prev, pager, next,sizes,total" :total="videoNum"></el-pagination>
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
      videoList: [],
      videoNum: 0,
      tableDataInit: -1,
      title: "",
      url: "",
      logoUrl: "",
      description: "",
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
          value: "Video"
        }
      ],
      uploadTableParam: [
        {
          name: "projectId",
          value:
            JSON.parse(sessionStorage.getItem("projectDesc") || "{}").id || ""
        },
        { name: "type", value: "projectFileToVideoLogo" }
      ]
    };
  },
  mounted () {
    if (this.id !== "") {
      this.getListData();
    }
  },
  methods: {
    uploadTableAfter (data) {
      this.logoUrl = this.hostUrl + data.filePath;
      console.log(data, "123");
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
            if (this.videoList.length == 1 && this.currentPage !== 1) {
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
    refresh () {
      this.cancelAddData();
      this.getListData();
    },
    update (row) {
      // console.log(row);
      this.$Posting(this.$api.saveProjectMedia, {
        projectId: this.id,
        id: row.id,
        title: this.title,
        url: this.url,
        description: this.description,
        logoUrl: this.logoUrl,
        showIndex: this.showIndex ? this.showIndex * 1 : 1,
        type: "Video"
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
    uploadImagefter () {
      this.cancelAddData();
      this.currentPage = 1;
      this.getListData();
    },
    add () {
      this.cancelAddData();
      this.videoList.unshift({});
      this.tableDataInit = 0;
    },
    edit (row, index) {
      this.tableDataInit = index;
      this.title = row.title;
      this.url = row.url
      this.logoUrl = row.logoUrl
      this.showIndex = row.showIndex
      // this.sliceFn(row.url) ? this.url = this.hostUrl + row.url : this.url = row.url
      // this.sliceFn(row.logoUrl) ? this.logoUrl = this.hostUrl + row.logoUrl: this.logoUrl = row.logoUrl;
      this.uploadTableParam[1].brokeId = row.brokeId;
      this.description = row.description;
    },
    sliceFn (str) {
      let isShow = true;
      if (str.indexOf("http://") != -1 || str.indexOf("https://") != -1 || !str) {
        isShow = false;
      }
      return isShow;
    },
    cancel (row, index) {
      if (index == 0) {
        if (row.id === undefined) {
          this.videoList.shift();
        }
      }
      this.cancelAddData();
    },
    cancelAddData () {
      this.title = "";
      this.url = "";
      this.logoUrl = "";
      this.showIndex = "";
      this.description = "";
      this.tableDataInit = -1;
      // console.log('清楚',this.title = "",  this.url = "",this.logoUrl,  this.description)
    },
    //获取列表数据
    getListData () {
      this.$Geting(this.$api.queryProjectMedia, {
        projectId: this.id,
        type: "Video",
        pageSize: this.pageSize,
        pageNo: this.currentPage
      }).then(res => {
        if (res.code == 0) {
          this.videoList = res.datas.lists;
          this.videoNum = res.datas.count;
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
.vedios_wrapper {
  background-color: #fff;
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  overflow: auto;
  .vedio_section {
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

