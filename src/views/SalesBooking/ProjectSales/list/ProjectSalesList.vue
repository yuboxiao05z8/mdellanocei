<template>
  <div class="ProjectSalesList">
    <div class="head">
      <el-input class="seekInput" size="mini" v-model="seek" placeholder="Project Name"></el-input>
      <el-button class="seekBtn" size="mini" @click="SearchFn">Search</el-button>
    </div>

    <div class="ProjectSalesList_tab">
      <el-table size="mini" border :header-cell-style="{'background':'#f5f7fa'}" border :data="tableData" style="width: 100%">
        <el-table-column prop="projectName" label="Project Name"></el-table-column>
        <el-table-column prop="location" label="Location"></el-table-column>
        <el-table-column prop="availNum" label="Available"></el-table-column>
        <el-table-column prop="soldNum" label="Sold"></el-table-column>
        <el-table-column label="Edit">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.row)">Sales Chart</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-pagination class="page_section" @current-change="changePage" background :page-size="pageSize" layout="prev, pager, next" :total="count"></el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      seek: '',
      tableData: [],
      pageSize: 10,
      pageNo: 1,
      count: 0
    }
  },
  mounted() {
    this.queryProjectSalesList()
  },
  methods: {
    handleEdit(row) {
      this.$router.push({
        path: '/SalesBooking/ProjectSales/SalesChart',
        query: {
          id: row.projectId
        }
      })
    },
    changePage(val) {
      this.pageNo = val
      this.queryProjectSalesList()
    },
    queryProjectSalesList() {
      let data = {
        pageSize: this.pageSize,
        pageNo: this.pageNo,
        projectName: this.seek
      }
      this.$Posting(this.$api.queryProjectSalesList, data).then(res => {
        if (res.code == 0) {
          this.tableData = res.datas.lists
          this.count = res.datas.count
        }
      })
    },
    SearchFn() {
      this.pageNo = 1
      this.queryProjectSalesList()
    }
  }
}
</script>

<style lang="less">
.ProjectSalesList {
  .head {
    padding: 10px;
    background: #fff;
    margin-bottom: 15px;
  }
  .ProjectSalesList_tab{
    padding: 10px;
    background: #fff;
  }
}
</style>