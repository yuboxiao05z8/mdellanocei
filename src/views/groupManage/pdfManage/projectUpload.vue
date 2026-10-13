<template>
  <div class="schedule">
    <div class="head">
      <el-row :gutter="20">
        <el-col :span="24">
          <div class="grid-content bg-purple">
            <el-input style="width: 200px;margin-right: 20px" size="mini" v-model="form.projectName" placeholder="Pro Name">
            </el-input>
            <el-select v-model="form.pdfType" style="width: 200px;margin-right: 20px" placeholder="TYPE" clearable="">
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
    <div class="schedule_tab">
      <el-table size="mini" :header-cell-style="{'background':'#f5f7fa'}" :data="tableData" border max-height="600">
        <el-table-column prop="projectName" label="Pro Name">
        </el-table-column>
        <el-table-column prop="pdfType" label="TYPE">
          <template>
            <div>
              facilities
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="logo" label="Image" width="180">
          <template slot-scope="scope">
            <img class="Photo_Service" @click.stop="$imgPreview(serveUrl+scope.row.logo)" :src="serveUrl+scope.row.logo" alt />
          </template>
        </el-table-column>
        <el-table-column label="Edit" width="170">
          <template slot-scope="scope">
            <el-button size="mini" @click="addEdit('edit',scope.row)">Edit</el-button>
            <el-button size="mini" @click="scheduleDelete(scope.row.pdfId)">Delete</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page_section" v-if="total">
      <el-pagination background small @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="form.pageNo" :page-sizes="[5,10,30,50,100]" :page-size="form.pageSize" layout="prev, pager, next,sizes,total" :total="total"></el-pagination>
    </div>
    <projectAddEdit :show="show" :type="type" @cancel="show = false" :editData='editData' @loadData="getListData"></projectAddEdit>
  </div>
</template>
<script>
import projectAddEdit from "./component/projectAddEdit.vue"
export default {
  components: {
    projectAddEdit
  },
  data () {
    return {
      serveUrl: sessionStorage.getItem('serveUrl'),
      tableData: [],
      options: [
        {
          label: 'facilities',
          value: 1
        }
      ],
      total: 0,
      form: {
        pageSize: 10,
        pageNo: 1,
        projectName: '',
        pdfType: ''
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
      this.$Get(this.$api.queryPndProjectList, this.form).then(res => {
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
      this.form.projectName = ''
      this.form.pdfType = ''
      this.getListData()
    },
    addEdit (type, data) {
      this.show = true
      this.type = type
      if (type === 'edit') {
        this.editData = {
          pdfId: data.pdfId,
          projectId: data.projectId,
          projectName: data.projectName,
          logo: data.logo,
          pdfType: data.pdfType
        }
      }
    },
    scheduleDelete (pdfId) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$Get(this.$api.deletePndProject, { pdfId: pdfId }).then(res => {
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
<style lang="less" scoped>
.schedule {
  /deep/.el-input__inner {
    height: 28px;
    line-height: 28px;
  }
  /deep/.el-input__icon {
    line-height: 28px;
  }
  .head {
    padding: 10px;
    background: #fff;
    margin-bottom: 15px;
  }
  .schedule_tab {
    padding: 10px;
    background: #fff;
  }
  .Photo_Service {
    width: 130px;
    height: 70px;
    background: #999;
    object-fit: contain;
    border-radius: 5px;
  }
}
</style>