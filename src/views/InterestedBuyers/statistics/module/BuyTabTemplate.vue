<template>
  <div class="BuyTabTemplate" :class="{ repeatClass: bgColor }">
    <el-table
      size="mini"
      row-class-name="repeatRow"
      :data="tabList"
      border
      max-height="500"
    >
      <el-table-column
        prop="ballotNo"
        label="Ballot Number"
        width="180"
      ></el-table-column>
      <el-table-column
        prop="brokeName"
        label="Agency"
        width="180"
      ></el-table-column>

      <el-table-column
        prop="buyerName"
        label="Buyer Name"
        width="180"
      ></el-table-column>
      <el-table-column
        prop="chequeNum"
        label="Cheque No"
        width="180"
      ></el-table-column>

      <el-table-column
        prop="buyerMobile"
        label="Mobile"
        width="180"
      ></el-table-column>
      <el-table-column
        prop="buyerEmail"
        label="Email"
        width="180"
      ></el-table-column>
      <el-table-column
        prop="building"
        label="Building"
        width="180"
      ></el-table-column>
      <el-table-column
        prop="unitName"
        label="Unit Name"
        width="180"
      ></el-table-column>
      <el-table-column
        prop="agentName"
        label="Agent Name"
        width="180"
      ></el-table-column>
      <el-table-column label="Creation Time" width="180">
        <template slot-scope="scope">
          <div>{{ $dateFormatNoTime(scope.row.createTime) }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="notes" label="Notes" width="300"></el-table-column>
      <el-table-column fixed="right" width="300" :label="$t('userLists.edit')">
        <template slot-scope="scope">
          <el-button size="mini" plain @click="queryInterestDetail(scope.row)"
            >Buyers Preview</el-button
          >
          <el-button size="mini" plain @click="Delete(scope.row)"
            >Delete</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="margin-top: 20px; text-align: center"
      :page-size="pageSize"
      @current-change="handleCurrentChange"
      background
      :current-page="pageNo"
      layout="prev, pager, next"
      :total="count"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  props: ['tabList', 'count', 'bgColor'],
  data() {
    return {
      pageSize: 10,
      pageNo: 1,
    }
  },
  methods: {
    handleCurrentChange(val) {
      this.pageNo = val
      this.$emit('handleCurrentChange', val)
    },
    queryInterestDetail(row) {
      this.$emit('queryInterestDetail', row)
    },
    Delete(row) {
      this.$emit('Delete', row)
    },
  },
}
</script>

<style lang="less">
.repeatClass {
  .el-table .repeatRow {
    background: oldlace;
    .cell {
      color: red;
    }
  }
}
</style>