<template>
  <div class="InterestedIndex">
    <!-- <div class="head">
      <crumbs :crumbsData="crumbsData"></crumbs>
    </div>-->
    <div class="head">
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-input
              style="width: 300px;margin-right: 20px;"
              size="mini"
              v-model="seek"
              placeholder="Please enter the keywords"
            ></el-input>
            <el-button size="mini" @click="seekFn">Search</el-button>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple"></div>
        </el-col>
      </el-row>
    </div>
    <div class="InterestedIndex_tab">
      <el-table :header-cell-style="{'background':'#f5f7fa'}" :data="tableData" border>
        <el-table-column prop="projectName" label="Project Name"></el-table-column>
        <el-table-column label="Launch Date">
          <template slot-scope="scope">
            <div>{{$dateFormatNoTime(scope.row.launchDate)}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="num" label="EOI/ROI"></el-table-column>
        <el-table-column label="Edit">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row, 'UnitStatistics')" size="mini">Intention Unit</el-button>
            <el-button
              @click="handleClick(scope.row, 'BuyersStatistics')"
              size="mini"
            >Intention Buyers</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      class="page_section"
      :page-size="pageSize"
      style="text-align: center;"
      @current-change="changePage"
      background
      layout="prev, pager, next"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
import crumbs from './component/crumbs'
export default {
  components: { crumbs },
  data() {
    return {
      crumbsData: ['Unit Interest'],
      seek: '',
      tableData: [],
      total: 0,
      pageSize: 10,
      pageNo: 1
    }
  },
  mounted() {
    this.queryInterestList()
  },
  methods: {
    handleClick(row, url) {
      this.$router.push({
        path: '/interes/' + url,
        query: {
          id: row.projectId,
          name: row.projectName
        }
      })
    },
    changePage(val) {
      this.pageNo = val
      this.queryInterestList()
    },
    seekFn() {
      this.pageNo = 1
      this.queryInterestList()
    },
    queryInterestList() {
      let data = {
        pageSize: this.pageSize,
        pageNo: this.pageNo,
        projectName: this.seek
      }
      this.$Posting(this.$api.queryInterestList, data).then(res => {
        if (res.code == 0) {
          this.tableData = res.datas.lists
          this.total = res.datas.count
        }
      })
    }
  }
}
</script>

<style lang="less">
.InterestedIndex {
  .head {
    padding: 10px;
    background: #fff;
    margin-bottom: 15px;
  }
  .InterestedIndex_tab {
    padding: 10px;
    background: #fff;
  }
}
</style>