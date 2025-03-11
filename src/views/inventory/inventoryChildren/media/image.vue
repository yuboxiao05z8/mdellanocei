<template>
  <div class="images_wrapper">
    <div class="import_image image_section">
      <el-row class="row_header">
        <el-col :span="8" class="col_text">{{$t('image.importImages')}}</el-col>
        <el-col :span="16" class="col_button">
          <uploader
            fileId="imageFile"
            :maxSize="50"
            :uploadParam="uploadParam"
            @uploadAfter="uploadProjectImageAfter"
            :url="$api.uploadProjectMedia"
            fileType=".jpg,.jpeg,.png,.gif,.zip"
            :btnText="{select:$t('image.selectFile'),import:$t('image.addImages')}"
          ></uploader>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="15">
          <el-alert :title="$t('image.importImagesCommand')" type="info" :closable="false"></el-alert>
        </el-col>
      </el-row>
    </div>
    <div class="add_main_image image_section">
      <el-row class="row_header">
        <el-col :span="8" class="col_text">{{$t('image.addtheMainImage')}}</el-col>
        <el-col :span="16" class="col_button">
          <!-- <el-button size="mini"> {{$t('image.selectFile')}}</el-button>
          <el-button size="mini"> {{$t('image.addMainImage')}}
          </el-button>-->
          <uploader
            fileId="mainImageFile"
            :maxSize="10"
            :uploadParam="uploadMainParam"
            :url="$api.uploadProjectMainImg"
            @uploadAfter="uploadMainImageAfter"
            :selfNum="self"
            fileType=".jpg,.jpeg,.png,.gif"
            :btnText="{select:$t('image.selectFile'),import:$t('image.addMainImage')}"
          ></uploader>
          <!-- <el-button size="mini" @click="exportImage"> {{$t('image.downloadMainImage')}}
          </el-button>-->
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="15">
          <!-- <p class="Purl" v-if="mainImage">{{hostUrl+mainImage}}</p> -->
          <img style="width:65px" @click.stop="$imgPreview(hostUrl + mainImage)" :src="hostUrl+mainImage" alt="">
          <el-alert :title="$t('image.addtheMainImageCommand')" type="info" :closable="false"></el-alert>
        </el-col>
      </el-row>
    </div>

    <div class="add_main_image image_section">
      <el-row class="row_header">
        <el-col :span="8" class="col_text">{{$t('addInvitations')}}</el-col>
        <el-col :span="16" class="col_button">
          <!-- <el-button size="mini"> {{$t('image.selectFile')}}</el-button>
          <el-button size="mini"> {{$t('image.addMainImage')}}
          </el-button>-->
          <uploader
            fileId="addInvitationsFile"
            :maxSize="10"
            :uploadParam="uploadMainParam"
            :url="$api.uploadInviteImg"
            @uploadAfter="InvitationsParamAfter"
            fileType=".jpg,.jpeg,.png,.gif"
            :btnText="{select:$t('image.selectFile'),import:$t('addInvitations')}"
          ></uploader>
          <!-- <el-button size="mini" @click="exportImage"> {{$t('image.downloadMainImage')}}
          </el-button>-->
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="15">
          <!-- <p class="Purl" v-if="InvitationsImg">{{hostUrl+InvitationsImg}}</p> -->
          <img style="width:65px" @click.stop="$imgPreview(hostUrl + InvitationsImg)" :src="hostUrl+InvitationsImg" alt="">
          <el-alert :title="$t('addInvitationCommand')" type="info" :closable="false"></el-alert>
        </el-col>
      </el-row>
    </div>

    <div class="images_lists image_section">
      <el-row class="row_header">
        <el-col :span="12" class="col_text">
          <div>{{$t('image.imageList')}} ({{imageNum}})</div>
        </el-col>
        <el-col :span="12" class="col_button">
          <el-button
            size="mini"
            @click="add"
            :disabled="tableDataInit!==-1"
          >{{$t('image.addImageWithUrl')}}</el-button>
          <el-button size="mini" @click="refresh">{{$t('image.refresh')}}</el-button>
        </el-col>
      </el-row>
      <el-table
        :data="imageList"
        border
        style="width: 100%"
        :header-cell-style="{'background':'#f5f7fa'}"
        size="mini"
      >
        <el-table-column :label="$t('image.title')">
          <template slot-scope="scope">
            <el-input v-if="scope.$index === tableDataInit" v-model="title"></el-input>
            <div v-else>{{scope.row.title}}</div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('image.url')">
          <template slot-scope="scope">
            <el-input v-if="scope.$index === tableDataInit" v-model="url"></el-input>
            <!-- <div v-else>{{hostUrl+scope.row.url}}</div> -->
            <img v-else style="width:45px" @click.stop="$imgPreview(hostUrl + scope.row.url)" :src="hostUrl +scope.row.url" alt="">
          </template>
        </el-table-column>
        <el-table-column :label="$t('image.group')">
          <template slot-scope="scope">
            <el-input v-if="scope.$index === tableDataInit" v-model="group"></el-input>
            <div v-else>{{scope.row.groupName}}</div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('image.delete')">
          <template slot-scope="scope">
            <el-button
              size="mini"
              plain
              :disabled="scope.$index === tableDataInit || scope.row.self == 0"
              @click="deleteData(scope.row)"
            >{{$t('image.delete')}}</el-button>
          </template>
        </el-table-column>
        <el-table-column :label="$t('image.edit')">
          <template slot-scope="scope">
            <template v-if="scope.$index === tableDataInit">
              <el-button
                :disabled="scope.row.self == 0"
                size="mini"
                plain
                @click="update(scope.row)"
              >{{$t('update')}}</el-button>
              <el-button
                :disabled="scope.row.self == 0"
                size="mini"
                plain
                @click="cancel(scope.row,scope.$index)"
              >{{$t('cancel')}}</el-button>
            </template>
            <template v-else>
              <el-button
                :disabled="scope.row.self == 0"
                size="mini"
                plain
                @click="edit(scope.row,scope.$index)"
              >{{$t('image.edit')}}</el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <div class="page_section" v-if="imageNum">
        <el-pagination
          background
          small
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-sizes="[5,10,30,50,100]"
          :page-size="pageSize"
          layout="prev, pager, next,sizes,total"
          :total="imageNum"
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
      currentPage: 1,
      pageSize: 5,
      imageList: [],
      imageNum: 0,
      tableDataInit: -1,
      title: "",
      url: "",
      mainImage: "",
      group: "",
      hostUrl: sessionStorage.getItem("serveUrl") || "",
      self:
        JSON.parse(sessionStorage.getItem("projectDesc") || "{}").self,
      id: JSON.parse(sessionStorage.getItem("projectDesc") || "{}").id || "",
      InvitationsImg: "",
      uploadParam: [
        {
          name: "projectId",
          value:
            JSON.parse(sessionStorage.getItem("projectDesc") || "{}").id || ""
        },
        {
          name: "type",
          value: "Image"
        }
      ],
      uploadMainParam: [
        {
          name: "projectId",
          value:
            JSON.parse(sessionStorage.getItem("projectDesc") || "{}").id || ""
        }
      ]
    };
  },
  mounted() {
    if (this.id !== "") {
      this.getListData();
      this.getMainImage();
      this.getInvitationsImg()
    }
  },
  methods: {
    exportImage() {
      if (!this.mainImage) {
        this.$alertWarn(this.$t("image.imagenotexist"));
      } else {
        console.log(this.mainImage);
        // window.location.href = this.$addDownUrl(this.$api.downloadMainImg, {
        //   filepath: this.mainImage
        // });
      }
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
        this.$Geting(this.$api.deleteProjectMedia, {
          id: row.id
        }).then(res => {
          if (res.code == 0) {
            this.$deleteFile(this.hostUrl + row.url);
            this.$notify.success({
              title: this.$t("alert.alert_success_title"),
              message: this.$t("alert.alert_success_delete_title")
            });
            if (this.imageList.length == 1 && this.currentPage !== 1) {
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
      // console.log(row);
      this.$Posting(this.$api.saveProjectMedia, {
        projectId: this.id,
        id: row.id,
        title: this.title,
        url: this.url,
        type: "Image",
        groupName: this.group
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
    uploadProjectImageAfter() {
      this.cancelAddData();
      this.currentPage = 1;
      this.getListData();
    },
    add() {
      this.imageList.unshift({});
      this.tableDataInit = 0;
    },
    edit(row, index) {
      this.tableDataInit = index;
      this.title = row.title;
      this.url = this.hostUrl + row.url;
      this.group = row.groupName;
    },
    cancel(row, index) {
      if (index == 0) {
        if (row.title === undefined) {
          this.imageList.shift();
        }
      }
      this.cancelAddData();
    },
    cancelAddData() {
      this.title = "";
      this.url = "";
      this.group = "";
      this.tableDataInit = -1;
    },
    refresh() {
      this.cancelAddData();
      this.getListData();
    },
    //获取列表数据
    getListData() {
      this.$Geting(this.$api.queryProjectMedia, {
        projectId: this.id,
        type: "Image",
        pageSize: this.pageSize,
        pageNo: this.currentPage
      }).then(res => {
        if (res.code == 0) {
          this.imageList = res.datas.lists;
          this.imageNum = res.datas.count;
        } else {
          this.$notify.error({
            title: "fail",
            message: res.msg
          });
          return false;
        }
      });
    },
    //查询main image
    getMainImage() {
      this.$Geting(this.$api.queryProjectMainimg, {
        projectId: this.id
      }).then(res => {
        if (res.code == 0) {
          this.mainImage = res.datas;
        } else {
          this.$notify.error({
            title: "fail",
            message: res.msg
          });
          return false;
        }
      });
    },
    InvitationsParamAfter() {
      this.getInvitationsImg()
    },
    getInvitationsImg() {
      this.$Geting(this.$api.queryCommission, {
        projectId: this.id
      }).then(res => {
        if (res.code == 0) {
          this.InvitationsImg = res.datas.inviteImg;
          console.log(this.InvitationsImg, '222')
        } else {
          this.$notify.error({
            title: "fail",
            message: res.msg
          });
          return false;
        }
      });
    },
    uploadMainImageAfter() {
      //主图上传成功后
      this.getMainImage();
    }
  }
};
</script>
<style lang="less">
.images_wrapper {
  background-color: #fff;
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  overflow: auto;
  .image_section {
    padding: 0px 30px 15px;
    border-top: 1px solid #dcdfe6;
    p {
      font-size: 14px;
      word-wrap: break-word;
      word-break: break-all;
      margin-bottom: 10px;
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

