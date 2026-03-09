<template>
  <div class="emailList">
    <div class="emailList_head_box">
      <div class="emailList_header">
        <el-button size="mini" type="info" class="btn el-icon-back" @click="goBack">{{$t('editMap.goBack')}}</el-button>
        <el-input style="width:200px;margin-right:20px" size="mini" placeholder="Name" v-model="username"></el-input>
        <el-input style="width:200px" size="mini" placeholder="Email" v-model="email"></el-input>
        <el-button size="mini" style="margin-left:20px" @click="getListData">{{$t('inventoryLists.Search')}}</el-button>
        <el-button size="mini" @click="reset">Clear</el-button>
        <el-button size="mini" @click="addEmployee" :disabled="isEdit">+ADD</el-button>
      </div>
    </div>
    <div class="emailList_tab">
      <el-table :data="emailList" border style="width: 100%" :header-cell-style="{'background':'#f5f7fa'}" size="mini">
        <el-table-column label="User Name">
          <template slot-scope="scope">
            <el-input v-if="scope.$index === tableDataInit" v-model="formData.personal"></el-input>
            <div v-else>{{scope.row.personal}}</div>
          </template>
        </el-table-column>
        <el-table-column label="Type">
          <template slot-scope="scope">
            <el-select v-model="formData.type" placeholder="select" v-if="scope.$index === tableDataInit">
              <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
            <div v-else>
              <el-select v-model="scope.row.type" disabled>
                <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Email">
          <template slot-scope="scope">
            <el-input v-if="scope.$index === tableDataInit" v-model="formData.email"></el-input>
            <div v-else>{{scope.row.email}}</div>
          </template>
        </el-table-column>
        <el-table-column width="250" label="Edit">
          <template slot-scope="scope">
            <template v-if="scope.$index === tableDataInit">
              <el-button size="mini" plain @click="update(scope.row)">Update</el-button>
              <el-button size="mini" plain @click="cancel(scope.row,scope.$index)">Cancel</el-button>
            </template>
            <template v-else>
              <el-button size="mini" plain @click="editData(scope.row,scope.$index)">Edit</el-button>
              <el-button size="mini" plain @click="deleteData(scope.row,scope.$index)">Delete</el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      username: '',
      emailList: [],
      email: '',
      editBrokeId: '',
      isEdit: false,
      typeList: [
        {
          value: 1,
          label: 'PAY'
        },
        {
          value: 2,
          label: 'Appointment'
        },
        {
          value: 3,
          label: 'Lawyer_Down_Transaction_File'
        }
      ],
      formData: {
        personal: '',
        email: '',
        type: ''
      },
      tableDataInit: -1,
      id: ''
    }
  },
  mounted () {
    this.editBrokeId = this.$route.query.editBrokeId
    this.getListData()
  },
  methods: {
    goBack () {
      this.$router.replace('/account/accountLists')
    },
    getListData () {
      this.$Get(this.$api.queryEmailReceiveByBrokeId, {
        editBrokeId: this.editBrokeId,
        username: this.username,
        email: this.email,
      }).then(res => {
        if (res.code == 0) {
          this.emailList = res.datas
        } else {
          this.$notify.error({
            title: 'fail',
            message: res.msg
          })
          return false
        }
      })
    },
    reset () {
      this.username = ''
      this.email = ''
      this.getListData()
    },
    addEmployee () {
      this.tableDataInit = 0
      this.emailList.unshift({});
    },
    editData (row, index) {
      console.log(this.emailList, row, index);
      if (!this.emailList[0].id) {
        this.emailList.shift();
        this.tableDataInit = index - 1;
      } else {
        this.tableDataInit = index;
      }
      this.formData.personal = row.personal
      this.formData.email = row.email
      this.formData.type = row.type
      this.id = row.id;
      this.isEdit = true
    },
    cancel (row, index) {
      if (index == 0 && row.id === undefined) {
        this.emailList.shift();
      }
      this.clearFormData()
      this.isEdit = false
    },
    clearFormData () {
      this.formData.personal = "";
      this.formData.email = "";
      this.formData.type = "";
      this.tableDataInit = -1;
    },
    deleteData (row, index) {
      this.$confirm(this.$t('deleteIt'), this.$t('alert.alert_command'), {
        confirmButtonText: this.$t('alert.sure'),
        cancelButtonText: this.$t('alert.cancel'),
        type: 'warning'
      })
        .then(() => {
          this.$Get(this.$api.deleteEmailReceive, {
            id: row.id,
          }).then(res => {
            if (res.code == 0) {
              this.emailList.splice(index, 1)
              this.$notify.success({
                message: 'success'
              })
            } else {
              this.$notify.error({
                title: 'fail',
                message: res.msg
              })
              return false
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
    update () {
      let data = { ...this.formData, editBrokeId: this.editBrokeId, id: this.isEdit ? this.id : '' }
      this.$Posting(this.$api.saveOrUpdateEmailReceive, data).then(res => {
        if (res.code == 0) {
          this.$notify.success({
            title: this.$t('alert.alert_success_title'),
            message: this.$t('alert.operate_success_title')
          })
          this.isEdit = false
          this.clearFormData()
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
.emailList {
  .el-icon-back {
    margin-right: 20px;
  }
  position: relative;
  height: 100%;
  overflow: hidden;
  .emailList_head_box {
    height: 75px;
  }
  .emailList_header {
    // margin: 15px 0;
    margin-bottom: 15px;
    padding: 15px;
    background-color: #fff;
  }
  .page_section {
    text-align: center;
    margin-top: 30px;
  }
  .emailList_tab {
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
