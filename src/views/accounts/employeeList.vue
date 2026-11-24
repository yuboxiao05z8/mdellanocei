<template>
  <div class="employeeList">
    <div class="employeeList_head_box">
      <!-- <div class="employeeList_header">
        <el-row>
          <el-col :span="8">
            <span style="padding:8px 0;margin-right:15px">{{$t('IDManagement')}}</span>
          </el-col>
          <el-col :span="16" style="text-align:right">
            <el-button size="mini" @click="getListData">{{$t('inventoryLists.refresh')}}</el-button>
            <el-button
              v-if="isAdmin == 0 || isAdmin == 2"
              size="mini"
              @click="addEmployee"
            >{{$t('addId')}}</el-button>
          </el-col>
        </el-row>
      </div>-->
      <div class="employeeList_header">
        <el-row>
          <el-col :span="5">
            <el-button
              size="mini"
              type="info"
              class="btn el-icon-back"
              @click="goBack"
            >{{$t('editMap.goBack')}}</el-button>
          </el-col>
          <el-col :span="11">
            <el-input
              style="width:300px"
              size="mini"
              :placeholder="$t('name')"
              v-model="searchName"
            ></el-input>
            <el-button size="mini" style="margin-left:20px" @click="searchData">{{$t('inventoryLists.Search')}}</el-button>
          </el-col>
          <el-col :span="8" style="text-align:right">
            <el-button size="mini" @click="getListData">{{$t('inventoryLists.refresh')}}</el-button>
            <el-button
              v-if="isAdmin == 0 || isAdmin == 2"
              size="mini"
              @click="addEmployee"
            >{{$t('addId')}}</el-button>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="employeeList_tab">
      <el-table
        :data="employeeList"
        border
        style="width: 100%"
        :header-cell-style="{'background':'#f5f7fa'}"
        size="mini"
      >
        <el-table-column :label="$t('name')">
          <template slot-scope="scope">
            <div>{{scope.row.agentName}}</div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('AccountStatus')">
          <template slot-scope="scope">
            <div v-if="scope.row.active == 'YES'">{{$t('on')}}</div>
            <div v-if="scope.row.active == 'NO'">{{$t('off')}}</div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('Mobile')">
          <template slot-scope="scope">
            <div>{{scope.row.mobile}}</div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('Email')">
          <template slot-scope="scope">
            <div>{{scope.row.email}}</div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('newUser.MultiTerminal')">
          <template slot-scope="scope">
            <div v-if="scope.row.accountType == 3">{{$t('MultiterminalLogin')}}</div>
            <div v-if="scope.row.accountType == 2">{{$t('ManagementSystem')}}</div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('newUser.ExpireDate')">
          <template slot-scope="scope">
            <div>{{$dateFormat(scope.row.expirationDate)}}</div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('userLists.edit')">
          <template slot-scope="scope">
            <template>
              <el-button size="mini" plain @click="editData(scope.row)">{{$t('transactions.Edit')}}</el-button>
              <el-button
                size="mini"
                plain
                @click="deleteData(scope.row,scope.$index)"
              >{{$t('accounts.delete')}}</el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <div class="page_section" v-if="employeeNum">
        <el-pagination
          background
          small
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-sizes="[5,10,30,50,100]"
          :page-size="pageSize"
          layout="prev, pager, next,sizes,total"
          :total="employeeNum"
        ></el-pagination>
      </div>
    </div>
    <el-dialog
      title="Edit Properties"
      :visible.sync="dialogVisible"
      width="600px"
      class="account_dialog"
    >
      <el-form ref="form" :model="employeeForm" label-width="150px" label-position="left">
        <el-form-item :label="$t('name')">
          <el-input v-model="employeeForm.userName"></el-input>
        </el-form-item>
        <el-form-item :label="$t('AccountStatus')">
          <el-select v-model="employeeForm.status" :placeholder="$t('pleaseSelect')">
            <el-option
              v-for="item in statusList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Right Control">
          <el-select v-model="employeeForm.isAdmin" :placeholder="$t('pleaseSelect')">
            <el-option
              v-for="item in powerList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('newUser.MultiTerminal')">
          <el-select v-model="employeeForm.accountType" :placeholder="$t('pleaseSelect')">
            <el-option
              v-for="item in accountTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('newUser.ExpireDate')">
          <el-date-picker
            v-model="employeeForm.expirationDate"
            type="date"
            value-format="timestamp"
            format="dd-MMM-yyyy"
            class="input_width_250px"
          ></el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('Email')">
          <el-input v-model="employeeForm.email"></el-input>
        </el-form-item>
        <el-form-item :label="$t('Mobile')">
          <el-input v-model="employeeForm.mobile"></el-input>
        </el-form-item>
        <el-form-item :label="$t('Password')">
          <el-input type="password" v-model="employeeForm.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="dialogVisible = false">{{$t('cancel')}}</el-button>
          <el-button type="primary" @click="onSubmit">{{$t('update')}}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchName: '',
      employeeList: [],
      pageSize: 5,
      currentPage: 1,
      employeeNum: 0,
      dialogVisible: false,
      employeeForm: {
        userName: '',
        status: '',
        email: '',
        mobile: '',
        password: '',
        editUserId: '',
        isAdmin: '',
        accountType: '',
        expirationDate: ''
      },
      accountTypeList: [
        {
          value: 3,
          label: this.$t('MultiterminalLogin')
        },
        {
          value: 2,
          label: this.$t('ManagementSystem')
        }
      ],
      powerList: [
        {
          value: '2',
          label: this.$t('Administrator')
        },
        {
          value: '1',
          label: this.$t('NormalUser')
        }
      ],
      statusList: [
        {
          value: 'YES',
          label: this.$t('on')
        },
        {
          value: 'NO',
          label: this.$t('off')
        }
      ],
      editBrokeId: '',
      isAdmin: JSON.parse(window.sessionStorage.getItem('userInfo')).isAdmin,
      isEdit: false,
      oldRow: {}
    }
  },
  mounted() {
    this.editBrokeId = this.$route.query.editBrokeId
    this.getListData()
  },
  methods: {
    goBack() {
      this.$router.replace('/account/accountLists')
    },
    getListData() {
      this.$Get(this.$api.querySysUserByBrokeId, {
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        editBrokeId: this.editBrokeId,
        content: this.searchName
      }).then(res => {
        if (res.code == 0) {
          this.employeeList = res.datas.lists
          this.employeeNum = res.datas.count
        } else {
          this.$notify.error({
            title: 'fail',
            message: res.msg
          })
          return false
        }
      })
    },
    addEmployee() {
      this.employeeForm = {
        userName: '',
        status: '',
        email: '',
        mobile: '',
        password: '',
        editUserId: '',
        isAdmin: '',
        accountType: '',
        expirationDate: ''
      }
      this.dialogVisible = true
    },
    editData(row) {
      this.oldRow = row
      this.employeeForm = {
        userName: row.agentName,
        status: row.active,
        email: row.email,
        mobile: row.mobile,
        password: row.password,
        editUserId: row.agentId,
        accountType: row.accountType,
        expirationDate: row.expirationDate,
        isAdmin: row.isAdmin.toString()
      }
      this.isEdit = true
      this.dialogVisible = true
    },
    deleteData(row) {
      this.$confirm(this.$t('deleteIt'), this.$t('alert.alert_command'), {
        confirmButtonText: this.$t('alert.sure'),
        cancelButtonText: this.$t('alert.cancel'),
        type: 'warning'
      })
        .then(() => {
          this.$Get(this.$api.deleteBrokeSysuser, {
            editUserId: row.agentId
          }).then(res => {
            if (res.code == 0) {
              this.$message({
                type: 'success',
                message: this.$t('alert.alert_success_delete_title')
              })
              this.getListData()
            } else {
              this.$notify.error({
                title: 'fail',
                message: res.msg
              })
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('cancel')
          })
        })
    },
    searchData() {
      this.currentPage = 1
      this.getListData()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getListData()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getListData()
    },
    onSubmit() {
      let data = { ...this.employeeForm, editBrokeId: this.editBrokeId }
      if (!this.isEdit) {
        data.password = this.$md5(this.employeeForm.password)
      } else {
        if (this.oldRow.password) {
          if (this.oldRow.password !== this.employeeForm.password) {
            data.password = this.$md5(this.employeeForm.password)
          }
        }
      }
      this.$Post(this.$api.addBrokeSysUser, data).then(res => {
        if (res.code == 0) {
          this.$notify.success({
            title: this.$t('alert.alert_success_title'),
            message: this.$t('alert.operate_success_title')
          })
          this.dialogVisible = false
          this.isEdit = false
          this.oldRow = {}
          this.getListData()
        } else {
          this.$notify.error({
            title: 'fail',
            message: res.msg
          })
        }
      })
    }
  }
}
</script>

<style lang="less">
.employeeList {
  position: relative;
  height: 100%;
  overflow: hidden;
  .employeeList_head_box {
    height: 75px;
  }
  .employeeList_header {
    // margin: 15px 0;
    margin-bottom: 15px;
    padding: 15px;
    background-color: #fff;
  }
  .page_section {
    text-align: center;
    margin-top: 30px;
  }
  .employeeList_tab {
    position: absolute;
    top: 75px;
    bottom: 0;
    left: 0;
    right: 0;
    overflow-y: scroll;
    padding: 15px 30px;
    background: #fff;
  }
}
</style>
