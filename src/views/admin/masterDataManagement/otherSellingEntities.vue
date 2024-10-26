<template>
  <div class="selling_entities_wrapper">
    <div class="head">
      <el-row>
        <el-col :span="12" class="el_col_name">
          <div>
            <span>{{$t('otherSellingEntities.managerOtherSellingEntities')}}</span>
          </div>
        </el-col>
        <el-col :span="12" style="text-align:right">
          <el-button size="mini" :disabled="tableDataInit!==-1" @click="add">{{$t('otherSellingEntities.addSellingEntity')}}</el-button>
          <el-button size="mini" @click="refresh">{{$t('otherSellingEntities.refresh')}}</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="selling_entities_content">
      <el-table :data="brokeList" border style="width: 100%" :header-cell-style="{'background':'#f5f7fa'}" size="mini">
        <el-table-column :label="$t('otherSellingEntities.name')">
          <template slot-scope="scope">
            <el-input v-if="scope.$index === tableDataInit" v-model="name"></el-input>
            <div v-else>{{scope.row.companyName}}</div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('otherSellingEntities.delete')">
          <template slot-scope="scope">
            <el-button size="mini" plain :disabled="scope.$index === tableDataInit" @click="deleteData(scope.row)">{{$t('otherSellingEntities.delete')}}</el-button>
          </template>
        </el-table-column>
        <el-table-column :label="$t('otherSellingEntities.edit')">
          <template slot-scope="scope">
            <template v-if="scope.$index === tableDataInit">
              <el-button size="mini" plain @click="update(scope.row)">{{$t('update')}}</el-button>
              <el-button size="mini" plain @click="cancel(scope.row,scope.$index)">{{$t('cancel')}}</el-button>
            </template>
            <template v-else>
              <el-button size="mini" plain @click="edit(scope.row,scope.$index)">{{$t('otherSellingEntities.edit')}}</el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <div class="page_section" v-if="brokeNum">
        <el-pagination background small @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-sizes="[5,10,30,50,100]" :page-size="pageSize" layout="prev, pager, next,sizes,total" :total="brokeNum">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      currentPage: 1,
      pageSize: 5,
      brokeList: [],
      brokeNum: 0,
      tableDataInit: -1,
      name: ""
    };
  },
  mounted() {
    this.getListData();
  },
  methods: {
    refresh() {
      this.cancelAddData();
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
        this.$Geting(this.$api.deleteBrokeCompany, {
          companyId: row.companyId
        }).then(res => {
          if (res.code == 0) {
            this.$notify.success({
              title: this.$t("alert.alert_success_title"),
              message: this.$t("alert.alert_success_delete_title")
            });
            if (this.brokeList.length == 1 && this.currentPage !== 1) {
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
      this.$Posting(this.$api.saveBrokeCompany, {
        companyId: row.companyId,
        companyName: this.name
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
    add() {
      this.brokeList.unshift({});
      this.tableDataInit = 0;
    },
    edit(row, index) {
      if (!this.brokeList[0].companyName) {
        this.brokeList.shift();
        this.tableDataInit = index - 1;
      } else {
        this.tableDataInit = index;
      }
      this.name = row.companyName;
    },
    cancel(row, index) {
      if (index == 0) {
        if (row.companyName === undefined) {
          this.brokeList.shift();
        }
      }
      this.cancelAddData();
    },
    cancelAddData() {
      this.name = "";
      this.tableDataInit = -1;
    },
    //获取列表数据
    getListData() {
      this.$Geting(this.$api.queryBrokeCompany, {
        pageSize: this.pageSize,
        pageNo: this.currentPage
      }).then(res => {
        if (res.code == 0) {
          this.brokeList = res.datas.lists;
          this.brokeNum = res.datas.count;
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
.selling_entities_wrapper {
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
  .selling_entities_content {
    position: absolute;
    top: 62px;
    bottom: 0;
    width: 100%;
    overflow: auto;
    padding: 15px 30px;
  }
  .page_section {
    text-align: center;
  }
}
</style>

