<template>
  <div class="floor_plan_wrapper">
    <div class="update_floor_plan floor_plan">
      <el-row class="row_header">
        <el-col :span="8" class="col_text">{{$t('floorPlans.updateFloorPlan')}}</el-col>
        <el-col :span="16" class="col_button">
          <uploader
            fileId="floorFile"
            :maxSize="10"
            :uploadParam="uploadParam"
            @uploadAfter="uploadExceAfter"
            :url="$api.importFloorPlan"
            fileType=".xls,.xlsx"
            :selfNum="self"
            :btnText="{select:$t('floorPlans.selectFile'),import:$t('floorPlans.importFloorPlan')}"
          ></uploader>
          <el-button :disabled="self == 0" size="mini" @click="exportExcel">{{$t('floorPlans.exportFloorPlantoExcel')}}</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="15">
          <el-alert :title="$t('floorPlans.updateFloorPlanCommand')" type="info" :closable="false"></el-alert>
        </el-col>
      </el-row>
    </div>
    <div class="floor_plan_image floor_plan">
      <el-row class="row_header">
        <el-col :span="8" class="col_text">{{$t('floorPlans.importFloorPlanImages')}}</el-col>
        <el-col :span="16" class="col_button">
          <uploader
            fileId="floorImage"
            :maxSize="50"
            :selfNum="self"
            :uploadParam="uploadParam"
            @uploadAfter="uploadImgAfter"
            :url="$api.importFloorPlanImg"
            fileType=".jpg,.png,.zip"
            :btnText="{select:$t('floorPlans.selectFile'),import:$t('floorPlans.addFloorPlanImages')}"
          ></uploader>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="15">
          <el-alert
            :title="$t('floorPlans.importFloorPlanImagesCommand')"
            type="info"
            :closable="false"
          ></el-alert>
        </el-col>
      </el-row>
    </div>
    <div class="floor_plan_list floor_plan">
      <el-row class="row_header">
        <el-col :span="12" class="col_text">
          <div>{{$t('floorPlans.floorPlanList')}}({{floorNum}})</div>
        </el-col>
        <el-col :span="12" class="col_button">
          <el-button
            size="mini"
            :disabled="tableDataInit!==-1 || self == 0"
            @click="add"
          >{{$t('floorPlans.addFloorPlan')}}</el-button>
          <el-button size="mini" :disabled="self == 0" @click="downFloorPlan">{{$t('floorPlans.downFloorPlan')}}</el-button>
          <el-button size="mini" @click="refresh">{{$t('floorPlans.refresh')}}</el-button>
        </el-col>
      </el-row>
      <el-table
        :data="floorList"
        border
        style="width: 100%"
        :header-cell-style="{'background':'#f5f7fa'}"
        size="mini"
      >
        <el-table-column :label="$t('floorPlans.name')">
          <template slot-scope="scope">
            <el-input v-if="scope.$index === tableDataInit" v-model.trim="floorName"></el-input>
            <div v-else>{{scope.row.floorPlanName}}</div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('floorPlans.type')">
          <template slot-scope="scope">
            <el-input v-if="scope.$index === tableDataInit" v-model.trim="floortype"></el-input>
            <div v-else>{{scope.row.floorPlanType}}</div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('floorPlans.imgUrl')">
          <template slot-scope="scope">
            <div v-if="scope.row.img">{{hostUrl+scope.row.img}}</div>
          </template>
        </el-table-column>
        <el-table-column label="720°">
          <template slot-scope="scope">
            <el-input v-if="scope.$index === tableDataInit" v-model.trim="ivt"></el-input>
            <div v-else>{{scope.row.ivt}}</div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('floorPlans.3dModelUrl')">
          <template slot-scope="scope">
            <div v-if="scope.row.modelPath">
              {{hostUrl+scope.row.modelPath}}
              <span
                class="el-icon-delete close_ljt"
                @click="deleteModel(scope.row)"
              ></span>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('floorPlans.upload3dModel')">
          <template slot-scope="scope">
            <uploader
              v-if="scope.row.floorPlanId"
              :isDisabled="(scope.$index === tableDataInit&&!scope.row.modelPath)"
              :fileId="'floorModel'+scope.row.floorPlanId"
              :maxSize="300"
              :uploadParam="uploadModelParam"
              @uploadAfter="uploadModelAfter"
              :url="$api.uploadFloorPlan3D"
              fileType=".zip"
              :btnText="{import:$t('upLoad')}"
              :showType="1"
              :selfNum="self"
            ></uploader>
            <template v-if="scope.row.modelPath">
              <el-button
                size="mini"
                plain
                @click="put3d(scope.row,'1','0')"
                v-if="scope.row.status3d==1"
                :disabled="self == 0"
              >{{$t('floorPlans.PutOff')}}</el-button>
              <el-button
                size="mini"
                plain
                @click="put3d(scope.row,'1','1')"
                :disabled="self == 0"
                v-else
              >{{$t('floorPlans.PutOn')}}</el-button>
            </template>
          </template>
        </el-table-column>
        <!-- <el-table-column :label="$t('floorPlans.Edit2DModel')">
          <template slot-scope="scope">
            <el-button size="mini" plain>{{$t('floorPlans.edit')}}</el-button>
            <el-button size="mini" plain @click="put3d(scope.row,'0','0')" v-if="scope.row.status2d==1">{{$t('floorPlans.PutOff')}}</el-button>
            <el-button size="mini" plain @click="put3d(scope.row,'0','1')" v-else-if="scope.row.status2d==0">{{$t('floorPlans.PutOn')}}</el-button>
          </template>
        </el-table-column>-->
        <el-table-column :label="$t('floorPlans.delete')">
          <template slot-scope="scope">
            <el-button
              size="mini"
              plain
              :disabled="scope.$index === tableDataInit || self == 0"
              @click="deleteData(scope.row)"
            >{{$t('floorPlans.delete')}}</el-button>
          </template>
        </el-table-column>
        <el-table-column :label="$t('floorPlans.edit')">
          <template slot-scope="scope">
            <template v-if="scope.$index === tableDataInit">
              <el-button size="mini" :disabled="self == 0" plain @click="update(scope.row)">{{$t('update')}}</el-button>
              <el-button size="mini" :disabled="self == 0" plain @click="cancel(scope.row,scope.$index)">{{$t('cancel')}}</el-button>
            </template>
            <template v-else>
              <el-button
                size="mini"
                plain
                @click="edit(scope.row,scope.$index)"
                :disabled="self == 0"
              >{{$t('floorPlans.edit')}}</el-button>
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
      floorList: [],
      floorNum: 0,
      tableDataInit: -1,
      id: JSON.parse(sessionStorage.getItem("projectDesc") || "{}").id || "",
      hostUrl: sessionStorage.getItem("serveUrl") || "",
      self: JSON.parse(sessionStorage.getItem("projectDesc")).self,
      floorName: "",
      floortype: "",
      ivt: "",
      uploadParam: [
        {
          name: "projectId",
          value:
            JSON.parse(sessionStorage.getItem("projectDesc") || "{}").id || ""
        }
      ],
      uploadModelParam: [
        {
          name: "projectId",
          value:
            JSON.parse(sessionStorage.getItem("projectDesc") || "{}").id || ""
        },
        {
          name: "floorPlanId",
          value: ""
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
    downFloorPlan() {
      //下载Floor Plan
      window.location.href = this.$addDownUrl(this.$api.downFloorPlan, {
        projectId: this.id
      });
    },
    put3d(row, type, isOn) {
      this.$Geting(this.$api.putOffOn, {
        floorPlanId: row.floorPlanId,
        type: type,
        status: isOn
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
    deleteModel(row) {
      this.$Geting(this.$api.deleteFloorPlanModel, {
        floorPlanId: row.floorPlanId
      }).then(res => {
        if (res.code == 0) {
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
    uploadModelAfter() {
      this.refresh();
    },
    exportExcel() {
      window.location.href = this.$addDownUrl(this.$api.exportFloorPlan, {
        projectId: this.id
      });
    },
    refresh() {
      this.cancelAddData();
      this.getListData();
    },
    uploadExceAfter() {
      this.refresh();
    },
    uploadImgAfter() {
      this.refresh();
    },
    //获取列表数据
    getListData() {
      this.$Geting(this.$api.queryFloorPlan, {
        projectId: this.id,
        pageSize: 10000,
        pageNo: 1
      }).then(res => {
        if (res.code == 0) {
          this.floorList = res.datas.lists;
          this.floorNum = res.datas.count;
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
      this.floorList.unshift({});
      this.tableDataInit = 0;
      this.uploadModelParam[1].value = "";
    },
    edit(row, index) {
      this.tableDataInit = index;
      this.floorName = row.floorPlanName;
      this.floortype = row.floorPlanType;
      this.ivt = row.ivt
      this.uploadModelParam[1].value = row.floorPlanId;
    },
    cancel(row, index) {
      if (index == 0) {
        if (row.floorPlanName === undefined) {
          this.floorList.shift();
        }
      }
      this.cancelAddData();
    },
    cancelAddData() {
      this.floorName = "";
      this.floortype = "";
      this.ivt = ""
      this.tableDataInit = -1;
    },
    update(row) {
      if (this.floorName && this.floortype) {
        this.updatefloor(row.floorPlanId || "");
      }
    },
    updatefloor(floorPlanId) {
      this.$Posting(this.$api.saveFloorPlan, {
        projectId: this.id,
        floorPlanName: this.floorName,
        floorPlanType: this.floortype,
        ivt: this.ivt,
        floorPlanId: floorPlanId
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
        this.$Posting(this.$api.deleteFloorPlan, {
          floorPlanId: row.floorPlanId
        }).then(res => {
          if (res.code == 0) {
            this.deleteFile(row);
            this.$notify.success({
              title: this.$t("alert.alert_success_title"),
              message: this.$t("alert.alert_success_delete_title")
            });
            this.refresh();
          } else {
            this.$notify.error({
              title: this.$t("alert.fail"),
              message: this.$t("alert.alert_fail_delete_title")
            });
          }
        });
      });
    },
    deleteFile(row) {
      if (row.img) {
        this.$Get(this.$api.deleteFile, { path: row.img });
      }
      if (row.modelPath) {
        this.$Get(this.$api.deleteFloorPlanModel, {
          floorPanId: row.floorPlanId
        });
      }
    }
  }
};
</script>
<style lang="less">
.floor_plan_wrapper {
  background-color: #fff;
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  overflow: auto;
  .floor_plan {
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
  .close_ljt {
    cursor: pointer;
    font-size: 16px;
    margin-left: 5px;
    position: relative;
    top: 2px;
  }
}
</style>

