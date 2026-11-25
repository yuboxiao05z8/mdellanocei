<template>
  <div class="groupManage">
    <div class="head">
      <el-row :gutter="20">
        <el-col :span="24">
          <div class="grid-content bg-purple">
            <el-input style="width: 200px;margin-right: 20px;" size="mini" v-model="form.name" placeholder="name">
            </el-input>
            <span style="font-size: 14px;color: #606266;">Group: </span>
            <el-select style="width: 200px;margin-right: 20px;" clearable v-model="form.type" placeholder="select" size="mini">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
            <el-button size="mini" @click="getListData">Search</el-button>
            <el-button size="mini" @click="reset">Clear</el-button>
            <el-button size="mini" @click="addEdit('add')">+ADD</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="groupManage_tab">
      <el-table size="mini" :header-cell-style="{'background':'#f5f7fa'}" :data="tableData" border max-height="600">
        <el-table-column prop="fileName" label="File Name"></el-table-column>
        <el-table-column prop="url" label="URL">
          <template slot-scope="scope">
            <p>{{serveUrl+scope.row.url}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="APP Group"></el-table-column>
        <el-table-column prop="groupName" label="Group"></el-table-column>
        <el-table-column label="Update Time">
          <template slot-scope="scope">
            <div>{{$dateFormatNoTime(scope.row.createTime)}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="agentName" label="Update User"></el-table-column>
        <el-table-column label="File Sorting">
          <template slot-scope="scope">
            <el-button type="text" @click="topClick(scope.row.fileId,scope.row.type)">置顶</el-button>
          </template>
        </el-table-column>
        <el-table-column label="Edit" width="170">
          <template slot-scope="scope">
            <el-button size="mini" @click="addEdit('edit',scope.row)">Edit</el-button>
            <el-button size="mini" @click="fileDelete(scope.row.fileId)">Delete</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page_section" v-if="total">
      <el-pagination background small @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="form.pageNo" :page-sizes="[5,10,30,50,100]" :page-size="form.pageSize" layout="prev, pager, next,sizes,total" :total="total"></el-pagination>
    </div>
    <addEditFile :show="show" :type="type" @cancel="show = false" :editData='editData' @loadData="getListData">
    </addEditFile>
  </div>
</template>
<script>
import addEditFile from "./component/addEditFile.vue"
export default {
  components: {
    addEditFile
  },
  data () {
    return {
      serveUrl: sessionStorage.getItem('serveUrl'),
      tableData: [],
      total: 0,
      options: [
        {
          value: 'Professional Tips',
          label: 'Professional Tips'
        },
        {
          value: 'Land Bid',
          label: 'Land Bid'
        },
        {
          value: 'Market Analysis',
          label: 'Market Analysis'
        }
      ],
      form: {
        pageSize: 10,
        pageNo: 1,
        name: '',
        type: ''
      },
      show: false,
      type: '',
      editData: {}
    }
  },
  mounted () {
    this.getListData()
  },
  methods: {
    getListData () {
      this.$Get(this.$api.queryFileListPage, this.form).then(res => {
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
    addEdit (type, data) {
      this.show = true
      this.type = type
      if (type === 'edit') {
        this.editData = {
          fileId: data.fileId,
          type: data.type,
          fileName: data.fileName,
          url: data.url
        }
      }
    },
    topClick (fileId, type) {
      this.$Get(this.$api.setTop, { fileId: fileId, type: type }).then(res => {
        if (res.code == 0) {
          this.$message.success('置顶成功');
          this.getListData()
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
            this.$message.success('删除成功');
            this.getListData()
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