<template>
  <div class="plan_wrapper">
    <div class="stack_plans plans_section">
      <el-row class="row_header">
        <el-col :span="8" class="col_text">{{$t('plan.stackPlans')}}</el-col>
        <el-col :span="16" class="col_button">
          <uploader
            fileId="planFile"
            :maxSize="50"
            :uploadParam="uploadParam"
            @uploadAfter="uploadPlanAfter"
            :url="$api.uploadSitePlan"
            fileType=".png,.jpg,.zip"
            :selfNum="self"
            :btnText="{select:$t('plan.selectFile'),import:$t('plan.addPlanImage')}"
          ></uploader>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="15">
          <el-alert :title="$t('plan.addPlanImageCommand')" type="info" :closable="false"></el-alert>
        </el-col>
      </el-row>
    </div>
    <div class="create_plan plans_section">
      <div class="server_alert">
        <el-alert v-for="(v,k) in serverAlert" :key="k" :title="v" type="error" :closable="false"></el-alert>
      </div>
      <div class="el-btn-div">
        <el-button size="mini" :disabled="self == 0" @click="createSitePlan('siteplan')">{{$t('plan.createSitePlan')}}</el-button>
        <el-button
          size="mini"
          @click="createSitePlan('mobilechart')"
          :disabled="self == 0"
        >{{$t('plan.createMobileChart')}}</el-button>
        <el-button size="mini" :disabled="self == 0" @click="createSitePlan('chart')">{{$t('plan.createChart')}}</el-button>
        <el-button size="mini" :disabled="self == 0" @click="setAllDirections('img')">{{$t('plan.surroundings')}}</el-button>
        <el-button size="mini" :disabled="self == 0" @click="setAllDirections('planeimg')">{{$t('plan.AddStorey')}}</el-button>
      </div>
    </div>
    <div class="plan_lists plans_section">
      <el-row class="row_header">
        <el-col :span="12" class="col_text">
          <div>{{$t('plan.stackPlan')}} ({{planNum}})</div>
        </el-col>
        <el-col :span="12" class="col_button">
          <el-button size="mini" @click="refresh">{{$t('plan.refresh')}}</el-button>
        </el-col>
      </el-row>
      <el-table
        :data="planList"
        border
        style="width: 100%"
        :header-cell-style="{'background':'#f5f7fa'}"
        size="mini"
      >
        <el-table-column :label="$t('plan.name')">
          <template slot-scope="scope">
            <el-input v-if="scope.$index === tableDataInit" v-model="name"></el-input>
            <div v-else>{{scope.row.sitePlanName}}</div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('plan.showinMobile')">
          <template slot-scope="scope">
            <el-checkbox
              v-model="showInMobile"
              v-if="scope.$index === tableDataInit"
              :true-label="'YES'"
              :false-label="'NO'"
            ></el-checkbox>
            <div v-else>
              <i class="el-icon-check" v-if="scope.row.showInMobile == 'YES'"></i>
              <i class="el-icon-close" v-else></i>
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column :label="$t('plan.accessLimit')">
          <template slot-scope="scope">
            <el-checkbox v-model="accessLimit" v-if="scope.$index === tableDataInit" :true-label="'yes'" :false-label="'no'"></el-checkbox>
            <div v-else>
              <i class="el-icon-check" v-if="scope.row.accessLimit == 'yes'"></i>
              <i class="el-icon-close" v-else></i>
            </div>
          </template>
        </el-table-column>-->
        <el-table-column :label="$t('plan.showInterest')">
          <template slot-scope="scope">
            <el-checkbox
              v-model="showInterest"
              v-if="scope.$index === tableDataInit"
              :true-label="'yes'"
              :false-label="'no'"
            ></el-checkbox>
            <div v-else>
              <i class="el-icon-check" v-if="scope.row.showInterest == 'yes'"></i>
              <i class="el-icon-close" v-else></i>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('plan.editMapping')">
          <template slot-scope="scope">
            <el-button
              size="mini"
              v-if="scope.row.type!=='table'"
              plain
              :disabled="scope.$index === tableDataInit || self == 0"
              @click="toEditMap(scope.row)"
            >{{$t('plan.editMapping')}}</el-button>
          </template>
        </el-table-column>
        <el-table-column :label="$t('plan.delete')">
          <template slot-scope="scope">
            <el-button
              size="mini"
              plain
              :disabled="scope.$index === tableDataInit || self == 0"
              @click="deleteData(scope.row)"
            >{{$t('plan.delete')}}</el-button>
          </template>
        </el-table-column>
        <el-table-column :label="$t('plan.edit')">
          <template slot-scope="scope">
            <template v-if="scope.$index === tableDataInit">
              <el-button size="mini" :disabled="self == 0" plain @click="update(scope.row)">{{$t('update')}}</el-button>
              <el-button size="mini" :disabled="self == 0" plain @click="cancel(scope.row, scope.$index)">{{$t('cancel')}}</el-button>
            </template>
            <template v-else>
              <el-button size="mini" :disabled="self == 0" plain @click="edit(scope.row,scope.$index)">{{$t('plan.edit')}}</el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
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
      planList: [],
      planNum: 0,
      serverAlert: [],
      tableDataInit: -1,
      name: "",
      showInMobile: "no",
      // accessLimit: "no",
      showInterest: "no",
      self: JSON.parse(sessionStorage.getItem("projectDesc")).self,
      id: JSON.parse(sessionStorage.getItem("projectDesc") || "{}").id || "",
      uploadParam: [
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
    }
  },
  methods: {
    toEditMap(row) {
      let params = {
        id: row.sitePlanId,
        type: row.type,
        name: row.sitePlanName
      };
      console.log(row)
      if (row.type == "building") {
        params.buildingName = row.buildingId;
      }
      this.$router.push({ path: "/Inventory/inventoryChildren/editMap", query: params });
    },
    uploadPlanAfter(data) {
      this.serverAlert = [];
      if (!data.length) {
        this.getListData();
      }
    },
    refresh() {
      this.cancel();
      this.getListData();
    },
    createSitePlan(type = "") {
      this.serverAlert = [];
      this.$Posting(this.$api.createSitePlan, {
        projectId: this.id,
        type: type
      }).then(res => {
        if (res.code == 0) {
          this.serverAlert = res.datas;
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
    setAllDirections(typeString) {
      // 设置东南西北图片
      let data = {
        sitePlanName: "",
        showInMobile: "no",
        showInterest: "no",
        type: typeString
      };
      this.planList.unshift(data);
      this.edit(data, 0);
      // console.log('1111111')
    },
    edit(row, index) {
      this.tableDataInit = index;
      this.name = row.sitePlanName;
      this.showInMobile = row.showInMobile;
      // this.accessLimit = row.accessLimit;
      this.showInterest = row.showInterest;
      // console.log('编辑',  index)
    },
    cancel(row, index) {
      this.tableDataInit = -1;
      this.getListData();
    },
    //获取列表数据
    getListData() {
      this.$Geting(this.$api.querySitePlan, {
        projectId: this.id
      }).then(res => {
        if (res.code == 0) {
          this.planList = res.datas.lists;
          this.planNum = res.datas.count;
        } else {
          this.$notify.error({
            title: "fail",
            message: res.msg
          });
          return false;
        }
      });
    },
    update(row) {
      // console.log(row);
      this.$Posting(this.$api.updateSitePlan, {
        projectId: this.id,
        sitePlanId: row.sitePlanId,
        sitePlanName: this.name,
        showInMobile: this.showInMobile,
        showInterest: this.showInterest,
        type: row.type
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
        this.$Geting(this.$api.deleteSitePlan, {
          sitePlanId: row.sitePlanId
        }).then(res => {
          if (res.code == 0) {
            this.$notify.success({
              title: this.$t("alert.alert_success_title"),
              message: this.$t("alert.alert_success_delete_title")
            });
            this.cancel();
            this.getListData();
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
.plan_wrapper {
  background-color: #fff;
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  overflow: auto;
  .plans_section {
    padding: 0px 30px 15px;
    border-top: 1px solid #dcdfe6;
    &.create_plan {
      padding-top: 15px;
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
  .server_alert {
    width: 400px;
    .el-alert {
      margin-bottom: 10px;
      padding: 5px 17px;
    }
  }
}
</style>
