<template>
  <div class="groupManage">
    <!-- <div class="head">
      <crumbs :crumbsData="crumbsData"></crumbs>
    </div>-->
    <div class="head">
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-input style="width: 300px;margin-right: 20px;" size="mini" v-model="seek"
              placeholder="Please enter the keywords"></el-input>
            <el-button size="mini" @click="getListData">Search</el-button>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple"></div>
        </el-col>
      </el-row>
    </div>
    <div class="groupManage_tab">
      <el-table size="mini" :header-cell-style="{'background':'#f5f7fa'}" :data="tableData" border>
        <el-table-column prop="projectName" label="Project Name"></el-table-column>
        <el-table-column label="Launch Date">
          <template slot-scope="scope">
            <div>{{$dateFormatNoTime(scope.row.launchDate)}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="num" label="EOI/ROI"></el-table-column>
        <el-table-column label="Edit">
          <template slot-scope="scope">
            <el-button size="mini">Interested Unit</el-button>
            <el-button size="mini">Register EOI</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page_section" v-if="total">
      <el-pagination background small @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page.sync="pageNo" :page-sizes="[5,10,30,50,100]" :page-size="pageSize"
        layout="prev, pager, next,sizes,total" :total="total"></el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      tableData: [],
      total: 0,
      pageSize: 10,
      pageNo: 1
    }
  },
  mounted () {

  },
  methods: {
    getListData () {

    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getListData()
    },
    handleCurrentChange (val) {
      this.pageNo = val
      this.getListData()
    },
  }
}
</script>
<style lang="less">
.groupManage {
  .head {
    padding: 10px;
    background: #fff;
    margin-bottom: 15px;
  }
  .groupManage_tab {
    padding: 10px;
    background: #fff;
  }
}
</style>