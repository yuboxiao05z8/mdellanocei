<template>
  <div class="groupManage">
    <!-- <div class="head">
      <crumbs :crumbsData="crumbsData"></crumbs>
    </div>-->
    <div class="head">
      <el-row :gutter="20">
        <el-col :span="24">
          <div class="grid-content bg-purple">
            <el-input style="width: 200px;margin-right: 20px;" size="mini" v-model="form.name" placeholder="name">
            </el-input>
            <span style="font-size: 14px;color: #606266;">Group: </span>
            <el-select style="width: 200px;margin-right: 20px;" clearable v-model="form.type" placeholder="select"
              size="mini">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
            <el-button size="mini" @click="getListData">Search</el-button>
            <el-button size="mini" @click="reset">Clear</el-button>
            <el-button size="mini" @click="getListData">+ADD</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="groupManage_tab">
      <el-table size="mini" :header-cell-style="{'background':'#f5f7fa'}" :data="tableData" border>
        <el-table-column prop="fileName" label="File Name"></el-table-column>
        <el-table-column prop="fileName" label="URL"></el-table-column>
        <el-table-column prop="fileName" label="APP Group"></el-table-column>
        <el-table-column label="Update Time">
          <template slot-scope="scope">
            <div>{{$dateFormatNoTime(scope.row.launchDate)}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="fileName" label="Update User"></el-table-column>
        <el-table-column label="File Sorting">
          <template slot-scope="scope">
            <el-button type="text" @click="topClick(scope.row.fileId,scope.row.type)">置顶</el-button>
          </template>
        </el-table-column>
        <el-table-column label="Edit">
          <template slot-scope="scope">
            <el-button size="mini">Edit</el-button>
            <el-button size="mini" @click="fileDelete(scope.row.fileId)">Delete</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page_section" v-if="total">
      <el-pagination background small @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page.sync="form.pageNo" :page-sizes="[5,10,30,50,100]" :page-size="form.pageSize"
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
      options: [
        {
          value: 'object Handling',
          label: 'object Handling'
        },
        {
          value: 'Land Bid',
          label: 'Land Bid'
        },
        {
          value: 'Branding Awareness',
          label: 'Branding Awareness'
        },
        {
          value: 'report',
          label: 'report'
        }
      ],
      form: {
        pageSize: 10,
        pageNo: 1,
        name: '',
        type: ''
      }
    }
  },
  mounted () {
    this.getListData()
  },
  methods: {
    getListData () {
      this.$Get(this.$api.queryFileList, this.form).then(res => {
        if (res.code == 0) {
          this.tableData = res.datas.lists
          this.total = res.datas.count
        }
      })
    },
    handleSizeChange (val) {
      this.form.pageSize = val
      this.getListData()
    },
    handleCurrentChange (val) {
      this.form.pageNo = val
      this.getListData()
    },
    reset () {
      this.form.name = ''
      this.form.type = ''
      this.getListData()
    },
    topClick (fileId, type) {
      this.$Get(this.$api.setTop, { fileId: fileId, type: type }).then(res => {
        if (res.code == 0) {
          this.$message({
            message: '置顶成功',
            type: 'success'
          });
          this.tableData()
        }
      })
    },
    fileDelete (fileId) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$Get(this.$api.pndDeleteFile, { fileId: fileId }).then(res => {
          if (res.code == 0) {

          }
        })
      }).catch(() => { });
    }
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