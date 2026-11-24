<template>
  <div class="accounts_list_wrapper">
    <div class="accounts_list_wrapper_head">
      <div class="employeeList_header">
        <el-row>
          <el-col :span="12">
            <el-input style="width: 300px" size="mini" :placeholder="$t('accounts.findCompany')" v-model="searchName"></el-input>
            <el-button style="margin-left: 20px" size="mini" @click="searchData">{{ $t("inventoryLists.Search") }}</el-button>
          </el-col>
          <el-col :span="12" style="text-align: right">
            <el-button v-if="isAdmin == 0" size="mini" @click="addAccount">{{
              $t("accounts.AddAccount")
            }}</el-button>
            <el-button size="mini" @click="refresh">{{
              $t("Refresh")
            }}</el-button>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="accounts_list_table accounts_section">
      <el-table :data="userList" border style="width: 100%" :header-cell-style="{ background: '#f5f7fa' }" size="mini">
        <el-table-column :label="$t('accounts.companyName')">
          <template slot-scope="scope">
            <div>{{ scope.row.brokeName }}</div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('accounts.companyLogo')">
          <template slot-scope="scope">
            <img @click.stop="$imgPreview(serveUrl + scope.row.logo)" :src="serveUrl + scope.row.logo" alt />
          </template>
        </el-table-column>
        <el-table-column :label="$t('accounts.companyType')">
          <template slot-scope="scope">
            <div v-if="scope.row.type == 1">MixGo</div>
            <div v-if="scope.row.type == 2">{{ $t("accounts.Developer") }}</div>
            <div v-if="scope.row.type == 3">{{ $t("accounts.Agency") }}</div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('FileNum')">
          <template slot-scope="scope">
            <div>{{ scope.row.fileNum }}</div>
          </template>
        </el-table-column>
        <el-table-column label="Expiration Date">
          <template slot-scope="scope">
            <div>{{ $dateFormat(Number(scope.row.expirationDate)) }}</div>
          </template>
        </el-table-column>
        <el-table-column label="Theme Colors">
          <template slot-scope="scope">
            <div>{{ scope.row.color }}</div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('accounts.webSite')">
          <template slot-scope="scope">
            <div>{{ scope.row.website }}</div>
          </template>
        </el-table-column>

        <el-table-column fixed="right" width="370" :label="$t('userLists.edit')">
          <template slot-scope="scope">
            <template>
              <el-button v-if="isAdmin == 0" size="mini" plain @click="editData(scope.row)">{{ $t("transactions.Edit") }}</el-button>
              <el-button size="mini" plain @click="managementFn(scope.row, scope.$index)">{{ $t("accounts.EmployeeList") }}</el-button>
              <el-button size="mini" plain @click="emailSetFn(scope.row)">{{ $t("Email Set") }}</el-button>
              <el-button v-if="isAdmin == 0" size="mini" plain @click="deleteData(scope.row, scope.$index)">{{ $t("accounts.delete") }}</el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <div class="page_section" v-if="userNum">
        <el-pagination background small @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-sizes="[5, 10, 30, 50, 100]" :page-size="pageSize" layout="prev, pager, next,sizes,total" :total="userNum"></el-pagination>
      </div>
    </div>

    <!-- 表单 -->
    <el-dialog title="Edit Properties" :visible.sync="dialogVisible" width="70%" class="account_dialog">
      <el-form ref="form" :model="companyForm" label-width="150px">
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('accounts.companyName')">
              <el-input v-model="companyForm.brokeName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('accounts.companyType')">
              <el-select style="width: 100%" v-model="companyForm.type" :placeholder="$t('pleaseSelect')">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('accounts.webSite')">
              <el-input v-model="companyForm.website"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('accounts.facebookWebsit')">
              <el-input v-model="companyForm.facebookWebsit"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('FileNum')">
              <el-input v-model="companyForm.fileNum"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Theme Colors">
              <el-input v-model="companyForm.color"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="Expiration Date">
              <el-date-picker style="width: 100%" value-format="timestamp" v-model="companyForm.expirationDate" type="date" placeholder="Select Date"></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="Loan Calculator Url">
              <el-input v-model="companyForm.calcUrl"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="Abbreviation">
              <el-input v-model="companyForm.brokeAlias"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Country">
              <el-select v-model="companyForm.country" filterable style="width: 100%" allow-create default-first-option placeholder="Choose the country">
                <el-option v-for="item in CountryList" :key="item" :label="item" :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="LicenceNo">
              <el-input v-model="companyForm.licenceNo"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Show C">
              <el-switch v-model="companyForm.showc" active-value="1" inactive-value="0" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('accounts.companyLogo')">
              <uploaderImg :backData="companyForm.logo" :editBrokeId='companyForm.editBrokeId' :id="'calendayImg'" :mixLength="1" folder="brokeLogo" :maxSize="500"></uploaderImg>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item :label="$t('DeveloperInformation')">
              <editor editorId="commissionss" :value="detail" :setting="editorSetting" @show="editors" @on-upload-success="onEditorUploadComplete"></editor>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item>
          <el-button @click="dialogVisible = false">{{
            $t("cancel")
          }}</el-button>
          <el-button type="primary" @click="onSubmit">{{
            $t("update")
          }}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import uploaderImg from "@/components/uploaderImg.vue";
import editor from "@/components/editor";
import tinymce from "tinymce/tinymce";
export default {
  components: {
    uploaderImg,
    editor,
  },
  data () {
    return {
      tableDataInit: -1,
      userList: [],
      currentPage: 1,
      pageSize: 5,
      userNum: 0,
      dialogVisible: false,
      companyForm: {
        brokeName: "",
        fileNum: "",
        website: "",
        type: "",
        logo: [],
        expirationDate: "",
        color: "",
        editBrokeId: "",
        calcUrl: "",
        country: "",
        brokeAlias: "",
        licenceNo: "",
        showc: '0'
      },
      detail: "",
      editorArr: [], //获取数据时富文本编辑器的图片数组
      updateEditorArr: [], //提交时富文本编辑器里面的图片数组
      editorSetting: {
        // 配置富文本编辑器高
        height: 120,
        width: 900,
      },
      options: [
        {
          value: "1",
          label: "MixGo",
        },
        {
          value: "2",
          label: this.$t("accounts.Developer"),
        },
        {
          value: "3",
          label: this.$t("accounts.Agency"),
        },
      ],
      searchName: "",
      serveUrl: sessionStorage.getItem("serveUrl"),
      isAdmin: JSON.parse(window.sessionStorage.getItem("userInfo")).isAdmin,
      CountryList: ["Singapore", "Malaysia", "Cambodia", "Australia", "UK", "Thailand"],
    };
  },
  mounted () {
    this.getListData();
  },
  methods: {
    addAccount () {
      if (tinymce.editors[0]) {
        tinymce.editors[0].setContent("");
      }
      this.companyForm = {
        brokeName: "",
        fileNum: "",
        website: "",
        type: "",
        logo: [],
        editBrokeId: "",
        expirationDate: "",
        color: "",
        detail: "",
        calcUrl: "",
        country: "",
        brokeAlias: "",
        licenceNo: "",
        showc: '0'
      };
      this.dialogVisible = true;
    },
    editors (obj) {
      // editor组件传过来的值赋给content
      this.detail = obj.content;
    },
    onEditorUploadComplete (json) {
      // 处理上传图片后返回数据，添加img标签到编辑框内
      json[1](this.serveUrl + json[0].filePath);
    },
    //保存前先读取服务端返回的富文本编辑器里面的内容，晒选出图片存在缓存中
    beforeSaveGetInitEdit () {
      console.log(arguments, "22222");
      for (let i = 0; i < arguments.length; i++) {
        this.editorArr = this.editorArr.concat(
          this.$changeHtmlStr(arguments[i])
        );
      }
    },
    //保存前获取编辑后的富文本编辑器的内容
    beforeSaveGetEdit () {
      for (let i = 0; i < arguments.length; i++) {
        this.updateEditorArr = this.updateEditorArr.concat(
          this.$changeHtmlStr(arguments[i])
        );
      }
    },
    //提交之前进行图片的检测
    beforeSaveCheckImage () {
      let editorImg =
        JSON.parse(window.sessionStorage.getItem("editorImg")) || [];
      this.beforeSaveGetEdit(this.detail);

      let allEditorArr = [...editorImg, ...this.editorArr]; //将缓存里面的图片和获取的富文本编辑器的图片进行整合
      allEditorArr.length &&
        window.sessionStorage.setItem(
          "editorImg",
          JSON.stringify(allEditorArr)
        ); //点击时将之前富文本编辑器里面的图片进行缓存
      this.$changeSession(this.updateEditorArr);
    },
    refresh () {
      this.getListData();
    },
    handleSizeChange (val) {
      this.pageSize = val;
      this.getListData();
    },
    handleCurrentChange (val) {
      this.currentPage = val;
      this.getListData();
    },
    getListData () {
      this.$Geting(this.$api.queryBroke, {
        pageSize: this.pageSize,
        pageNo: this.currentPage,
        content: this.searchName,
      }).then((res) => {
        if (res.code == 0) {
          this.userList = res.datas.lists;
          this.userNum = res.datas.count;
        } else {
          this.$notify.error({
            title: "fail",
            message: res.msg,
          });
          return false;
        }
      });
    },
    searchData () {
      this.currentPage = 1;
      this.getListData();
    },
    editData (row) {
      // 编辑
      console.log(row);
      this.companyForm = {
        brokeName: row.brokeName,
        fileNum: row.fileNum,
        website: row.website,
        type: row.type.toString(),
        logo: [
          {
            url: row.logo,
            src: this.serveUrl + row.logo,
          },
        ],
        expirationDate: row.expirationDate,
        color: row.color,
        editBrokeId: row.brokeId,
        facebookWebsit: row.facebookWebsit,
        calcUrl: row.calcUrl,
        country: row.country,
        brokeAlias: row.brokeAlias,
        licenceNo: row.licenceNo,
        showc: row.showc + ''
      };
      if (!this.CountryList.includes(row.country) && row.country) {
        this.CountryList.push(row.country);
      }

      this.detail = "";
      this.detail = this.$base64ToContent(row.detail);
      if (tinymce.editors[0]) {
        tinymce.editors[0].setContent(this.detail);
      }

      this.dialogVisible = true;
    },
    managementFn (row) {
      // 管理公司
      let data = {
        editBrokeId: row.brokeId,
      };
      this.$router.replace({ path: "/account/employeeList", query: data });
    },
    emailSetFn (row) {
      // 邮箱设置
      let data = {
        editBrokeId: row.brokeId,
      };
      this.$router.replace({ path: "/account/emailSet", query: data });
    },
    deleteData (row) {
      // 删除公司
      // console.log(row)
      this.$confirm(this.$t("deleteIt"), this.$t("alert.alert_command"), {
        confirmButtonText: this.$t("alert.sure"),
        cancelButtonText: this.$t("alert.cancel"),
        type: "warning",
      })
        .then(() => {
          this.$Get(this.$api.deleteBroke, { editBrokeId: row.brokeId }).then(
            (res) => {
              if (res.code == 0) {
                this.$message({
                  type: "success",
                  message: this.$t("alert.alert_success_delete_title"),
                });
                this.getListData();
              } else {
                this.$notify.error({
                  title: "fail",
                  message: res.msg,
                });
              }
            }
          );
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("cancel"),
          });
        });
    },
    onSubmit () {
      // 提交
      let data = { ...this.companyForm };
      data.logo = this.companyForm.logo[0].url;
      data.detail = this.$contentToBase64(this.detail);
      this.$Post(this.$api.saveBroke, data).then((res) => {
        if (res.code == 0) {
          this.$notify.success({
            title: this.$t("alert.alert_success_title"),
            message: this.$t("alert.operate_success_title"),
          });
          this.beforeSaveCheckImage();
          this.dialogVisible = false;
          this.getListData();
        } else {
          this.$notify.error({
            title: "fail",
            message: res.msg,
          });
        }
      });
    },
    beforeDestroy () {
      this.$deleteImg();
    },
  },
};
</script>

<style lang="less">
.accounts_list_wrapper {
  .accounts_list_wrapper_head {
    background-color: #f4f4f4;
    height: 75px;
  }
  background-color: #fff;
  height: 100%;
  position: relative;
  overflow: hidden;
  .employeeList_header {
    // margin: 15px 0;
    margin-bottom: 15px;
    padding: 15px;
    background-color: #fff;
  }
  .accounts_section {
    padding: 0px 30px 15px;
    .el-table .cell img {
      width: 40px;
      height: 40px !important;
    }
    &.accounts_list_table {
      // border-top: 1px solid #dcdfe6;
      padding-top: 15px;
      position: absolute;
      top: 75px;
      bottom: 0;
      left: 0;
      right: 0;
      overflow-y: auto;
    }
    &.accounts_list {
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
    margin-top: 30px;
  }
}
.account_dialog {
  .row_header {
    height: 62px;
    padding: 15px 0;
    border-top: 1px solid #dcdfe6;
    border-bottom: 1px solid #dcdfe6;
    .col_text {
      padding: 4px 0;
    }
    .col_button {
      text-align: right;
    }
  }
  .el-dialog__body {
    padding: 10px 20px;
  }
  .selling_entity {
    display: block !important;
    .el-form-item__content {
      padding: 10px 0;
      display: block !important;
    }
    .el_checkbox_group {
      .el-checkbox {
        margin: 0;
        width: 24%;
        margin-right: 1%;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>
