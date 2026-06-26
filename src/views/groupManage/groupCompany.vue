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
        <el-table-column prop="companyName" label="Name"></el-table-column>
        <el-table-column prop="companyLogo" label="LOGO" width="180">
          <template slot-scope="scope">
            <img class="Photo_Service" @click.stop="$imgPreview(serveUrl+scope.row.companyLogo)" :src="serveUrl+scope.row.companyLogo" alt />
          </template>
        </el-table-column>
        <el-table-column prop="description" label="account"></el-table-column>
        <el-table-column prop="companyUrl" label="URL"></el-table-column>
        <el-table-column prop="companyAddress" label="Addressed"></el-table-column>
        <el-table-column prop="type" label="APP Group"></el-table-column>
        <el-table-column label="Update Time">
          <template slot-scope="scope">
            <div>{{$dateFormatNoTime(scope.row.createTime)}}</div>
          </template>
        </el-table-column>
        <el-table-column label="File Sorting">
          <template slot-scope="scope">
            <el-popover placement="right" width="300" trigger="click">
              <el-table :data="gridData">
                <el-table-column property="contactName" label="Name"></el-table-column>
                <el-table-column property="contactMobile" label="Mobile"></el-table-column>
              </el-table>
              <el-button size="mini" slot="reference" @click="getGridData(scope.row.companyId)">View</el-button>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="Edit" width="170">
          <template slot-scope="scope">
            <el-button size="mini" @click="addEdit('edit',scope.row)">Edit</el-button>
            <el-button size="mini" @click="fileDelete(scope.row.companyId)">Delete</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page_section" v-if="total">
      <el-pagination background small @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="form.pageNo" :page-sizes="[5,10,30,50,100]" :page-size="form.pageSize" layout="prev, pager, next,sizes,total" :total="total"></el-pagination>
    </div>
    <addEditCompany :show="show" :type="type" @cancel="show = false" :editData='editData' @loadData="getListData">
    </addEditCompany>
  </div>
</template>
<script>
import addEditCompany from "./component/addEditCompany.vue"
export default {
  components: {
    addEditCompany
  },
  data () {
    return {
      tableData: [],
      total: 0,
      serveUrl: sessionStorage.getItem('serveUrl'),
      show: false,
      gridData: [],
      options: [
        {
          value: 'Bankers',
          label: 'Bankers'
        },
        {
          value: 'Lawyers',
          label: 'Lawyers'
        },
        {
          value: 'Interior',
          label: 'Interior'
        },
        {
          value: 'Martgage Broker',
          label: 'Martgage Broker'
        },
        {
          value: 'Handyan & moves',
          label: 'Handyan & moves'
        },
        {
          value: 'Web',
          label: 'Web'
        }
      ],
      type: '',
      editData: {},
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
      this.$Get(this.$api.queryCompanyList, this.form).then(res => {
        if (res.code == 0) {
          this.tableData = res.datas.lists
          this.total = res.datas.count
        }
      })
    },
    addEdit (type, data) {
      this.show = true
      this.type = type
      if (type === 'edit') {
        this.editData = {
          companyId: data.companyId,
          companyAddress: data.companyAddress,
          companyLogo: data.companyLogo,
          companyContent: data.companyContent,
          companyName: data.companyName,
          companyUrl: data.companyUrl,
          description: data.description,
          type: data.type,
          companyContact: []
        }
      }
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
    fileDelete (companyId) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$Get(this.$api.deleteCompany, { companyId: companyId }).then(res => {
          if (res.code == 0) {
            this.$message.success('删除成功');
            this.getListData()
          }
        })
      }).catch(() => { });
    },
    getGridData (id) {
      this.$Get(this.$api.queryCompanyContactList, { companyId: id }).then(res => {
        if (res.code == 0) this.gridData = res.datas
        else this.gridData = []
      })
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
    .Photo_Service {
      width: 130px;
      height: 70px;
      background: #999;
      object-fit: contain;
      border-radius: 5px;
    }
  }
}
</style>