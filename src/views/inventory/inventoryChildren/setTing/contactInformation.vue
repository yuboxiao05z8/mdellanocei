<template>
  <div class="contactInformation">
    <div class="contactInformation_head">
      <!-- <el-row>
        <el-col :span="3" style="text-align:center">External Commission</el-col>
        <el-col :span="4">
          <el-input placeholder="placeholder" v-model="ExternalCommission"></el-input>
        </el-col>
        <el-col :span="6" style="text-align:left">
          <el-button
            size="mini"
            style="margin-left: 10px"
            @click="saveSetting"
          >{{$t('settings.update')}}</el-button>
        </el-col>
      </el-row>-->

      <div class="divBox">
        <span>External Commission</span>
        <div>
          <el-input placeholder="placeholder" v-model="ExternalCommission"></el-input>
        </div>
      </div>

      <div class="divBox">
        <span>Internal Agent</span>
        <div>
          <el-input placeholder="placeholder" v-model="internalCommission"></el-input>
        </div>
      </div>

      <div class="divBox">
        <span>Internal Agent Proportion</span>
        <div>
          <el-input type="number" placeholder="placeholder" v-model="internalCommissionNum"></el-input>
        </div>
      </div>

      <div class="divBox">
        <span>Direct Comm Proportion</span>
        <div>
          <el-input type="number" placeholder="placeholder" v-model="commissionNum"></el-input>
        </div>
        <div>
          <el-button
            size="mini"
            style="margin-left: 10px"
            @click="saveSetting"
          >{{$t('settings.update')}}</el-button>
        </div>
      </div>

      <div class="divBox">
        <span>Commission description</span>
      </div>
      <div style="padding-left: 15px;">
        <editor
          editorId="contactinfoOne"
          :value="commissionDesc"
          :setting="editorSetting"
          @show="editors"
          @on-upload-success="onEditorUploadComplete"
        ></editor>
      </div>

      <div class="add_main_image image_section">
        <el-row class="row_header">
          <el-col :span="8" class="col_text">Add Tagger Img</el-col>
          <el-col :span="16" class="col_button">
            <el-button size="mini" @click="deleteContactImage">Delete Tagger Img</el-button>
            <uploader
              fileId="mainImageFile"
              :maxSize="10"
              :uploadParam="uploadMainParam"
              :url="$api.uploadContactImage"
              @uploadAfter="uploadMainImageAfter"
              fileType=".jpg,.jpeg,.png,.gif"
              :btnText="{select:$t('image.selectFile'),import:'Add Tagger Img'}"
            ></uploader>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="15">
            <!-- <p class="Purl" v-if="contactImage">
              {{hostUrl+contactImage}}
            </p> -->
            <img v-if="contactImage" style="width:65px"  @click.stop="$imgPreview(hostUrl + contactImage)" :src="hostUrl+contactImage" alt="">

            <el-alert
              title="Add the Tagger Image in .jpg or .jpeg or .png or .gif formats"
              type="info"
              :closable="false"
            ></el-alert>
          </el-col>
        </el-row>
      </div>

      <!-- <el-row>
        <el-col :span="3" style="text-align:center">Internal Agent</el-col>
        <el-col :span="4">
          <el-input placeholder="placeholder" v-model="internalCommission"></el-input>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="3" style="text-align:center">Proportion</el-col>
        <el-col :span="4">
          <el-input placeholder="placeholder" v-model="internalCommissionNum"></el-input>
        </el-col>
      </el-row>-->
    </div>
    <div class="UserList">
      <div class="uploaderUser">
        <el-button @click="deleteAllProjectContact">Delete All</el-button>
        <el-button @click="exportProjectContacts">Export Contact</el-button>

        <uploader
          fileId="floorFile"
          :maxSize="10"
          :uploadParam="uploadParam"
          :url="$api.importProjectContact"
          @uploadAfter="uploadwaterAfter"
          fileType=".xls,.xlsx"
          :btnText="{select:$t('floorPlans.selectFile'),import:$t('floorPlans.importFloorPlan')}"
        ></uploader>
        <el-button @click="AddedIndividually" :disabled="tableDataInit !== -1 ">Added individually</el-button>
      </div>
      <el-table
        :data="tableLists"
        border
        style="width: 100%"
        :header-cell-style="{'background':'#f5f7fa'}"
        size="mini"
      >
        <el-table-column :label="$t('ContactName')">
          <template slot-scope="scope">
            <!-- <el-input v-if="scope.$index === tableDataInit" v-model="form.agentName"></el-input> -->
            <div>{{scope.row.agentName}}</div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('ContactEmail')">
          <template slot-scope="scope">
            <el-input v-if="scope.$index === tableDataInit" v-model="form.email"></el-input>
            <div v-else>{{scope.row.email}}</div>
          </template>
        </el-table-column>
        <el-table-column label="regNum">
          <template slot-scope="scope">
            <el-input v-if="scope.$index === tableDataInit" v-model="form.regNum"></el-input>
            <div>{{scope.row.regNum}}</div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('contactNumber')">
          <template slot-scope="scope">
            <!-- <el-input v-if="scope.$index === tableDataInit" v-model="form.mobile"></el-input> -->
            <div>{{scope.row.mobile}}</div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('userRole')">
          <template slot-scope="scope">
            <!-- <el-input v-if="scope.$index === tableDataInit" v-model="form.type"></el-input> -->
            <el-select
              v-model="form.type"
              placeholder="placeholder"
              v-if="scope.$index === tableDataInit"
            >
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <div v-else>{{scope.row.type}}</div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('Delete')">
          <template slot-scope="scope">
            <template v-if="scope.$index === tableDataInit">
              <el-button size="mini" plain @click="updata()">update</el-button>
              <el-button size="mini" plain @click="cancel(scope.row,scope.$index)">{{$t('cancel')}}</el-button>
            </template>
            <template v-else>
              <el-button size="mini" plain @click="deleteData(scope.row.contactId)">{{$t('Delete')}}</el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <div class="page_section" v-if="ContactNum">
        <el-pagination
          background
          small
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="pageNo"
          :page-sizes="[5,10,30,50,100]"
          :page-size="pageSize"
          layout="prev, pager, next,sizes,total"
          :total="ContactNum"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import editor from "@/components/editor";
import uploader from "@/components/uploader";
import tinymce from "tinymce/tinymce";
export default {
  name: "contactInformation",
  components: {
    uploader,
    editor
  },
  data() {
    return {
      contactImage: "",
      uploadParam: [
        {
          name: "projectId",
          value:
            JSON.parse(sessionStorage.getItem("projectDesc") || "{}").id || ""
        }
      ],
      uploadMainParam: [
        {
          name: "projectId",
          value:
            JSON.parse(sessionStorage.getItem("projectDesc") || "{}").id || ""
        }
      ],
      projectId:
        JSON.parse(sessionStorage.getItem("projectDesc") || "{}").id || "",
      ExternalCommission: "",
      internalCommissionNum: "",
      internalCommission: "",
      commissionNum: "",
      tableLists: [],
      pageNo: 1,
      pageSize: 10,
      ContactNum: 0,
      tableDataInit: -1,
      hostUrl: sessionStorage.getItem("serveUrl") || "",
      form: {
        email: "",
        type: ""
      },
      typeOptions: [
        {
          value: "Marketing",
          label: "Marketing"
        },
        {
          value: "Project IC",
          label: "Project IC"
        },
        {
          value: "Tagger",
          label: "Tagger"
        },
        {
          value: "DD",
          label: "DD"
        }
      ],
      editorSetting: {
        // 配置富文本编辑器高
        height: 120,
        width: 800
      },
      commissionDesc: "",
      editorArr: [], //获取数据时富文本编辑器的图片数组
      updateEditorArr: [], //提交时富文本编辑器里面的图片数组
      ContactData: {}
    };
  },
  mounted() {
    this.queryProjectContact();
    this.$nextTick(() => {
      this.queryCommission();
    });
  },
  methods: {
    deleteAllProjectContact() {
      this.$confirm(
        this.$t("alert.alert_delete"),
        this.$t("alert.alert_command"),
        {
          confirmButtonText: this.$t("alert.sure"),
          cancelButtonText: this.$t("alert.cancel"),
          type: "warning"
        }
      ).then(() => {
        this.$Geting(this.$api.deleteAllProjectContact, {
          projectId: this.projectId
        }).then(res => {
          if (res.code == 0) {
            this.$notify.success({
              title: this.$t("alert.alert_success_title"),
              message: this.$t("alert.alert_success_delete_title")
            });
            
            this.queryProjectContact();
          } else {
            this.$notify.error({
              title: this.$t("alert.fail"),
              message: this.$t("alert.alert_fail_delete_title")
            });
          }
        });
      });
    },
    exportProjectContacts() {
      window.location.href = this.$addDownUrl(this.$api.exportProjectContacts, {
        projectId: this.projectId
      });
    },
    uploadMainImageAfter() {
      //主图上传成功后
      this.queryCommission();
    },
    editors(obj) {
      this.commissionDesc = obj.content;
      // console.log("符文布", this.commissionDesc);
    },
    onEditorUploadComplete(json) {
      json[1](this.hostUrl + json[0].filePath);
    },
    AddedIndividually() {
      this.tableLists.unshift({});
      this.tableDataInit = 0;
    },
    //保存前先读取服务端返回的富文本编辑器里面的内容，晒选出图片存在缓存中
    beforeSaveGetInitEdit() {
      // console.log(arguments, "2321223");
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
      this.beforeSaveGetEdit(this.commissionDesc);

      let allEditorArr = [...editorImg, ...this.editorArr]; //将缓存里面的图片和获取的富文本编辑器的图片进行整合
      allEditorArr.length &&
        window.sessionStorage.setItem(
          "editorImg",
          JSON.stringify(allEditorArr)
        ); //点击时将之前富文本编辑器里面的图片进行缓存
      this.$changeSession(this.updateEditorArr);
    },
    updata() {
      let data = {
        projectId: this.projectId,
        type: this.form.type,
        email: this.form.email,
        regNum: this.form.regNum
      };
      this.$Post(this.$api.saveProjectContact, data).then(res => {
        if (res.code == 0) {
          this.$notify.success({
            title: this.$t("alert.alert_success_title"),
            message: res.msg
          });
          this.cancelAddData();
          this.queryProjectContact();
        } else {
          this.$notify.error({
            title: this.$t("alert.fail"),
            message: res.msg
          });
        }
      });
    },
    cancel() {
      this.tableLists.shift();
      this.cancelAddData();
    },
    cancelAddData() {
      this.form = {
        email: "",
        type: ""
      };
      this.tableDataInit = -1;
    },
    deleteContactImage() {
      this.$Get(this.$api.deleteContactImage, {id: this.ContactData.id}).then(res => {
        if(res.code == 0) {
          this.$notify.success({
            title: this.$t("alert.alert_success_title"),
            message: res.msg
          });
          this.contactImage = ''
        } else {
          this.$notify.error({
            title: this.$t("alert.fail"),
            message: res.msg
          });
        }
      })
    },
    queryCommission() {
      this.$Get(this.$api.queryCommission, { projectId: this.projectId }).then(
        res => {
          if (res.code == 0) {
            // console.log(res)
            this.ContactData = res.datas
            this.ExternalCommission = res.datas.externalCommission;
            this.internalCommission = res.datas.internalCommission;
            this.internalCommissionNum = res.datas.internalCommissionNum;
            this.commissionNum = res.datas.commissionNum;
            this.contactImage = res.datas.contactImage;
            this.commissionDesc = this.$base64ToContent(
              res.datas.commissionDesc
            );
            console.log(res)
            // this.beforeSaveGetInitEdit(this.commissionDesc)
            if (tinymce.editors[0]) {
              tinymce.editors[0].setContent(this.commissionDesc);
            }
            // console.log(this.commissionDesc);
          }
        }
      );
    },
    saveSetting() {
      // if (this.ExternalCommission == "" || this.internalCommission == "" || this.internalCommissionNum == "") {
      //   return false;
      // }
      this.$Post(this.$api.updateExternalCommission, {
        projectId: this.projectId,
        externalCommission: this.ExternalCommission,
        internalCommission: this.internalCommission,
        internalCommissionNum: this.internalCommissionNum,
        commissionNum: this.commissionNum,
        commissionDesc: this.$contentToBase64(this.commissionDesc)
      }).then(res => {
        if (res.code == 0) {
          this.beforeSaveCheckImage();
          this.queryCommission();
          this.$notify.success({
            title: this.$t("alert.alert_success_title"),
            message: res.msg
          });
        } else {
          this.$notify.error({
            title: this.$t("alert.fail"),
            message: res.msg
          });
        }
      });
    },
    uploadwaterAfter() {
      this.queryProjectContact();
    },
    queryProjectContact() {
      this.$Get(this.$api.queryProjectContact, {
        projectId: this.projectId,
        pageNo: this.pageNo,
        pageSize: this.pageSize
      }).then(res => {
        if (res.code == 0) {
          this.tableLists = res.datas.lists;
          this.ContactNum = res.datas.count;
        }
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.queryProjectContact();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.queryProjectContact();
    },
    deleteData(id) {
      this.$Get(this.$api.deleteProjectContact, { contactId: id }).then(res => {
        if (res.code == 0) {
          this.queryProjectContact();
          this.$notify.success({
            title: this.$t("alert.alert_success_title"),
            message: res.msg
          });
        } else {
          this.$notify.error({
            title: this.$t("alert.fail"),
            message: res.msg
          });
        }
      });
      this.tableDataInit = -1;
    }
  },
  beforeDestroy() {
    this.$deleteImg();
  }
};
</script>

<style lang="less">
.contactInformation {
  height: 100%;
  width: 100%;
  background: #fff;
  border-top: 1px solid #ddd;
  overflow-y: scroll;
  .contactInformation_head {
    .el-row {
      height: 50px;
      line-height: 50px;
      padding: 0 15px;
    }
    padding: 10px 0;
    .divBox {
      margin-bottom: 10px;
      padding: 5px 15px;
      span {
        // margin-right: 15px;
        width: 200px;
        display: inline-block;
      }
      div {
        display: inline-block;
        margin-left: 15px;
      }
    }
    .image_section {
      // padding: 0px 30px 15px;
      border-top: 1px solid #dcdfe6;
      p {
        font-size: 14px;
        word-wrap: break-word;
        word-break: break-all;
        margin-bottom: 10px;
        line-height: 1;
      }
    }
    // text-align: center;
    // border-bottom: 1px solid #ddd;
  }
  .UserList {
    padding: 15px;
    .uploaderUser {
      text-align: right;
      margin-bottom: 15px;
      button {
        padding: 7px 15px;
        color: #606266;
        font-size: 14px;
      }
    }
    .page_section {
      text-align: center;
    }
  }
}
</style>