<template>
  <div class="allotNav">
    <div class="allotNav_nav_bar">Management of navigation</div>
    <div class="allotNav_tab">
      <el-table border :data="tableData" style="width: 100%">
        <el-table-column label="Type" prop="name"></el-table-column>
        <el-table-column label="Edit">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.row)">Edit</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <select-nav ref="SelectNav" type="brokeType" :receiveObj="sendObj" />
  </div>
</template>

<script>
import SelectNav from '@/views/navigation/module/selectNav'
export default {
  components: { SelectNav },
  data() {
    return {
      tableData: [
        {
          name: 'agency',
          type: '3',
        },
        {
          name: 'developers',
          type: '2',
        },
      ],
      sendObj: {},
    }
  },
  methods: {
    handleEdit(row) {
      this.$refs.SelectNav.dialogVisible = true
      this.sendObj = {
        brokeType: row.type,
      }
    },
  },
}
</script>

<style lang="less">
.allotNav {
  width: 100%;
  height: 100%;
  background: #fff;
  .allotNav_nav_bar {
    padding: 20px;
    border-bottom: 1px solid #ddd;
  }
  .allotNav_tab {
    padding: 20px;
  }
}
</style>