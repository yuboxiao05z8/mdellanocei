<template>
  <div class="building_wrapper">
    <div class="head">
      <el-row>
        <el-col :span="12" class="el_col_name">
          <div>
            <span>{{$t('buildingPhases.buildingName')}}({{buildingNum}})</span>
          </div>
        </el-col>
        <el-col :span="12" style="text-align:right">
          <el-button size="mini" @click="add" :disabled="tableDataInit!==-1 || self == 0">{{$t('buildingPhases.addBuilding')}}</el-button>
          <el-button size="mini" @click="refresh">{{$t('buildingPhases.refresh')}}</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="building_content">
      <el-table :data="buildingList" border style="width: 100%" :header-cell-style="{'background':'#f5f7fa'}" size="mini">
        <el-table-column :label="$t('buildingPhases.name')">
          <template slot-scope="scope">
            <el-input v-if="scope.$index === tableDataInit" v-model="buildName"></el-input>
            <div v-else>{{scope.row.buildName}}</div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('buildingPhases.delete')">
          <template slot-scope="scope">
            <el-button  size="mini" plain :disabled="scope.$index === tableDataInit || self == 0" @click="deleteData(scope.row)">{{$t('buildingPhases.delete')}}</el-button>
          </template>
        </el-table-column>
        <el-table-column :label="$t('buildingPhases.edit')">
          <template slot-scope="scope">
            <template v-if="scope.$index === tableDataInit">
              <el-button :disabled="self == 0" size="mini" plain @click="update(scope.row)">{{$t('update')}}</el-button>
              <el-button size="mini" plain @click="cancel(scope.row,scope.$index)">{{$t('cancel')}}</el-button>
            </template>
            <template v-else>
              <el-button :disabled="self == 0" size="mini" plain @click="edit(scope.row,scope.$index)">{{$t('buildingPhases.edit')}}</el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      buildingList: [],
      tableDataInit: -1,
      buildName: "",
      id: JSON.parse(sessionStorage.getItem("projectDesc") || "{}").id || "",
      buildingNum: 0,
      self: JSON.parse(sessionStorage.getItem("projectDesc") || "{}").self || "",
    };
  },
  mounted() {
    if (this.id !== "") {
      this.getListData();
    }
  },
  methods: {
    refresh() {
      this.cancelAddData();
      this.getListData();
    },
    add() {
      this.buildingList.unshift({});
      this.tableDataInit = 0;
    },
    edit(row, index) {
      this.tableDataInit = index;
      this.buildName = row.buildName;
    },
    cancel(row, index) {
      if (index == 0) {
        if (row.buildName === undefined) {
          this.buildingList.shift();
        }
      }
      this.cancelAddData();
    },
    cancelAddData() {
      this.buildName = "";
      this.tableDataInit = -1;
    },
    update(row) {
      if (this.buildName) {
        this.updateBuilding(row.buildId || "");
      }
    },
    //获取列表数据
    getListData() {
      this.$Geting(this.$api.queryBuilding, {
        projectId: this.id,
        pageSize: 10000,
        pageNo: 1
      }).then(res => {
        if (res.code == 0) {
          this.buildingList = res.datas.lists;
          this.buildingNum = res.datas.count;
        } else {
          this.$notify.error({
            title: "fail",
            message: res.msg
          });
          return false;
        }
      });
    },
    updateBuilding(buildingId) {
      this.$Posting(this.$api.saveBuilding, {
        projectId: this.id,
        buildName: this.buildName,
        buildId: buildingId
      }).then(res => {
        if (res.code == 0) {
          this.$notify.success({
            title: this.$t('alert.alert_success_title'),
            message: this.$t('alert.operate_success_title')
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
    deleteData(row) {
      this.$confirm(this.$t('alert.alert_delete'), this.$t('alert.alert_command'), {
        confirmButtonText: this.$t('alert.sure'),
        cancelButtonText: this.$t('alert.cancel'),
        type: "warning"
      }).then(() => {
        this.$Posting(this.$api.deleteBuilding, {
          buildId: row.buildId
        }).then(res => {
          if (res.code == 0) {
            this.$notify.success({
              title: this.$t('alert.alert_success_title'),
              message: this.$t('alert.alert_success_delete_title')
            });
            this.getListData();
          } else {
            this.$notify.error({
              title: this.$t('alert.fail'),
              message: this.$t('alert.alert_fail_delete_title')
            });
          }
        });
      });
    }
  }
};
</script>
<style lang="less">
.building_wrapper {
  background-color: #fff;
  height: 100%;
  position: relative;
  overflow: hidden;
  .head {
    height: 62px;
    position: absolute;
    top: 0;
    width: 100%;
    border-bottom: 1px solid #dcdfe6;
    border-top: 1px solid #dcdfe6;
    padding: 15px 30px;
    .el_col_name {
      div {
        padding: 4px 0;
      }
    }
  }
  .building_content {
    position: absolute;
    top: 62px;
    bottom: 0;
    width: 100%;
    overflow: auto;
    padding: 15px 30px;
  }
}
</style>

