<template>
  <div class="schedule">
    <div class="head">
      <el-row :gutter="20">
        <el-col :span="24">
          <div class="grid-content bg-purple">
            <el-input style="width: 200px;margin-right: 20px" size="mini" v-model="form.title" placeholder="title">
            </el-input>
            <span style="font-size: 14px;color: #606266;">time: </span>
            <el-date-picker style="width: 200px;margin-right: 20px;" value-format="yyyy-MM-dd" format="dd-MMM-yyyy" type="date" v-model="form.calendarTime"></el-date-picker>
            <el-button size="mini" @click="getListData">Search</el-button>
            <el-button size="mini" @click="reset">Clear</el-button>
            <el-button size="mini" @click="addEdit('add')">+ADD</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="schedule_tab">
      <el-table size="mini" :header-cell-style="{'background':'#f5f7fa'}" :data="tableData" border max-height="600">
        <el-table-column prop="title" label="Title"></el-table-column>
        <el-table-column prop="type" label="Types">
        </el-table-column>
        <el-table-column label="Event Date">
          <template slot-scope="scope">
            <div>{{$dateFormatNoTime(scope.row.createTime)}}</div>
          </template>
        </el-table-column>
        <el-table-column label="Update Time">
          <template slot-scope="scope">
            <div>{{$dateFormatNoTime(scope.row.createTime)}}</div>
          </template>
        </el-table-column>
        <el-table-column label="Edit" width="170">
          <template slot-scope="scope">
            <el-button size="mini" @click="addEdit('edit',scope.row)">Edit</el-button>
            <el-button size="mini" @click="scheduleDelete(scope.row.calendarId)">Delete</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page_section" v-if="total">
      <el-pagination background small @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="form.pageNo" :page-sizes="[5,10,30,50,100]" :page-size="form.pageSize" layout="prev, pager, next,sizes,total" :total="total"></el-pagination>
    </div>
    <addEditSchedule :show="show" :type="type" @cancel="show = false" :editData='editData' @loadData="getListData"></addEditSchedule>
  </div>
</template>
<script>
import addEditSchedule from "./component/addEditSchedule.vue"
export default {
  components: {
    addEditSchedule
  },
  data () {
    return {
      tableData: [],
      total: 0,
      form: {
        pageSize: 10,
        pageNo: 1,
        title: '',
        calendarTime: ''
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
      this.$Get(this.$api.queryPNDCalendarList, this.form).then(res => {
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
      this.form.title = ''
      this.form.calendarTime = ''
      this.getListData()
    },
    addEdit (type, data) {
      this.show = true
      this.type = type
      if (type === 'edit') {
        this.editData = {
          calendarId: data.calendarId,
          type: data.type,
          title: data.title,
          venue: data.venue,
          picture: data.picture,
          description: data.description,
          calendarTime: data.calendarTime
        }
      }
    },
    scheduleDelete (calendarId) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$Get(this.$api.deletePNDCalendarById, { calendarId: calendarId }).then(res => {
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
}
</style>