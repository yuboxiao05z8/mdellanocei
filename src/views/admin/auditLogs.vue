<template>
  <div class="audit_logs_wrapper">
    <div class="head">
      <el-row>
        <el-col :span="12" class="el_col_name">
          <div>
            <span>{{$t('auditLogs.auditlogs')}}</span>
          </div>
        </el-col>
        <el-col :span="12" style="text-align:right">
          <el-button size="mini" @click="getListData">{{$t('auditLogs.refresh')}}</el-button>
          <el-button size="mini" @click="exportAudit">{{$t('auditLogs.export')}}</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="selling_entities_content">
      <el-table :data="autoList" border style="width: 100%" :header-cell-style="{'background':'#f5f7fa'}" size="mini">
        <el-table-column :label="$t('auditLogs.time')" prop="opTime1">
        </el-table-column>
        <el-table-column :label="$t('auditLogs.user')" prop="user">
        </el-table-column>
        <el-table-column :label="$t('auditLogs.propertyName')" prop="projectName">
        </el-table-column>
        <el-table-column :label="$t('auditLogs.UnitName')" prop="unitName">
        </el-table-column>
        <el-table-column :label="$t('auditLogs.Source')" prop="source">
        </el-table-column>
        <el-table-column :label="$t('auditLogs.opeartion')" prop="remark">
        </el-table-column>
        <el-table-column :label="$t('auditLogs.Details')" prop="detail">
        </el-table-column>
      </el-table>
      <div class="page_section" v-if="count">
        <el-pagination background small @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-sizes="[5,10,30,50,100]" :page-size="pageSize" layout="prev, pager, next,sizes,total" :total="count">
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
      autoList: [],
      count: 0,
      tableDataInit: -1,
      name: ""
    };
  },
  mounted() {
    this.getListData();
  },
  methods: {
    exportAudit() {
      window.location.href = this.$addDownUrl(this.$api.exportOperationLogs);
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getListData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getListData();
    },
    //获取列表数据
    getListData() {
      this.$Geting(this.$api.queryOperationLog, {
        pageSize: this.pageSize,
        pageNo: this.currentPage
      }).then(res => {
        if (res.code == 0) {
          this.autoList = res.datas.lists;
          this.count = res.datas.count;
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
.audit_logs_wrapper {
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

