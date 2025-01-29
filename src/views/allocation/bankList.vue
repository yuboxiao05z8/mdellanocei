<template>
  <div class="bankList">
    <div class="head">
      <el-row>
        <el-col :span="12" class="el_col_name">
          <div>Payer Bank</div>
        </el-col>
        <el-col :span="12" style="text-align:right">
          <el-button size="mini" @click="saveTemplate">Add New Role</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="bankTab">
      <el-table size="mini" :header-cell-style="{'background':'#f5f7fa'}" border :data="tableData" style="width: 100%">
        <el-table-column label="Payer Bank Code" prop="bankCode"></el-table-column>
        <el-table-column label="Payer Bank  Description" prop="bankName"></el-table-column>
        <el-table-column label="Edit">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.row)">Edit</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row)">Delete</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      style="margin-top: 20px;text-align: center;"
      :page-size="pageSize"
      @current-change="handleCurrentChange"
      background
      layout="prev, pager, next"
      :total="count"
    ></el-pagination>
    <el-dialog center title="Edit" :visible.sync="dialogVisible" width="40%">
      <div>
        <el-form
          ref="ruleForm"
          :rules="rules"
          :model="form"
          label-width="200px"
          class="demo-form-inline"
        >
          <el-form-item prop="bankCode" label="Payer Bank Code">
            <el-input v-model="form.bankCode" placeholder="Payer Bank Code"></el-input>
          </el-form-item>
          <el-form-item prop="bankName" label="Payer Bank  Description">
            <el-input v-model="form.bankName" placeholder="Payer Bank Description"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="Update">Update</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      dialogVisible: false,
      form: {
        bankName: '',
        bankCode: ''
      },
      rules: {
        bankName: [
          {
            required: true,
            message: 'Please fill in the fields',
            trigger: 'blur'
          }
        ],
        bankCode: [
          {
            required: true,
            message: 'Please fill in the fields',
            trigger: 'blur'
          }
        ]
      },
      pageNo: 1,
      pageSize: 10,
      count: 0
    }
  },
  mounted() {
    this.queryBankList()
  },
  methods: {
    saveTemplate() {
      this.form = {
        bankName: '',
        bankCode: ''
      }
      this.dialogVisible = true
    },
    handleEdit(row) {
      this.form = {
        bankName: row.bankName,
        bankCode: row.bankCode,
        bankId: row.bankId
      }
      this.dialogVisible = true
    },
    handleDelete(row) {
      this.$confirm('Are you sure to delete it?', 'Alert', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(() => {
          this.$Posting(this.$api.deleteBank, { bankId: row.bankId }).then(
            res => {
              if (res.code == 0) {
                this.$notify({
                  title: 'Success',
                  message: 'Success!',
                  type: 'success'
                })
                this.queryBankList()
              } else {
                this.$notify.error({
                  title: 'Error',
                  message: res.msg
                })
              }
            }
          )
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: 'Cancel'
          })
        })
    },
    Update() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          this.$Posting(this.$api.saveBank, this.form).then(res => {
            if (res.code == 0) {
              this.queryBankList()
              this.$notify({
                title: 'Success',
                message: 'Success!',
                type: 'success'
              })
              this.dialogVisible = false
            } else {
              this.$notify.error({
                title: 'Error',
                message: res.msg
              })
            }
          })
        } else {
          return false
        }
      })
    },
    handleCurrentChange(val) {
      this.pageNo = val
      this.queryBankList()
    },
    queryBankList() {
      let data = {
        pageNo: this.pageNo,
        pageSize: this.pageSize
      }
      this.$Posting(this.$api.queryBankList, data).then(res => {
        if (res.code == 0) {
          this.tableData = res.datas.lists
          this.count = res.datas.count
        }
      })
    }
  }
}
</script>

<style lang="less">
.bankList {
  .head {
    background: #fff;
    height: 62px;
    top: 0;
    width: 100%;
    padding: 15px 30px;
    .el_col_name {
      div {
        padding: 4px 0;
      }
    }
  }
  .bankTab {
    background: #fff;
    margin-top: 20px;
    padding: 10px;
  }
}
</style>