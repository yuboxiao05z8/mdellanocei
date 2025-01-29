<template>
  <div class="unitList_page">
    <div class="addTab">
      <el-table size="mini" class="tab_div_con" :data="unitList" style="width: 100%">
        <el-table-column label="Unit Name" prop="unitName"></el-table-column>
        <el-table-column label="Lowest Price($)" prop="priceTo"></el-table-column>
        <el-table-column label="Highest Price($)" prop="priceFrom"></el-table-column>
        <el-table-column label="Action" width="180">
          <template slot="header" slot-scope="scope">
            <el-button
              size="mini"
              icon="el-icon-plus"
              v-if="unitList.length < 5"
              @click="showDialog"
              >ADD</el-button
            >
          </template>
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="editFn(scope.$index, scope.row)"
              >EDIT</el-button
            >
            <el-button
              v-if="unitList.length > 1"
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              >DELETE</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      center
      title="Add or edit intention units"
      :visible.sync="show"
      width="40%"
      append-to-body
      @closed="closedForm"
    >
      <div>
        <el-form
          ref="form_unit"
          :rules="rules"
          :model="form"
          label-width="150px"
        >
          <el-form-item label="Unit Name" prop="unitName">
            <el-input
              size="mini"
              style="width: 100%"
              v-model="form.unitName"
            ></el-input>
          </el-form-item>
          <el-form-item label="Lowest Price($)">
            <el-input
              size="mini"
              style="width: 100%"
              type="Number"
              v-model="form.priceTo"
            ></el-input>
          </el-form-item>
          <el-form-item label="Highest Price($)">
            <el-input
              size="mini"
              style="width: 100%"
              type="Number"
              v-model="form.priceFrom"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="show = false">Cancel</el-button>
        <el-button type="primary" @click="addDataFn('close')">Save</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      show: false,
      form: {},
      editIndex: undefined,
      rules: {
        unitName: [
          {
            required: true,
            message: 'Please fill in the fields',
            trigger: 'blur',
          },
        ],
        priceTo: [
          {
            required: true,
            message: 'Please fill in the fields',
            trigger: 'blur',
          },
        ],
        priceFrom: [
          {
            required: true,
            message: 'Please fill in the fields',
            trigger: 'blur',
          },
        ],
      },
      unitList: [],
      ensure: false,
    }
  },
  watch: {
    list(val) {
      this.unitList = JSON.parse(JSON.stringify(val))
    },
  },
  methods: {
    showDialog() {
      this.show = true
    },
    editFn(index, row) {
      this.form = row
      this.show = true
      this.editIndex = index
    },
    addDataFn() {
      this.$refs['form_unit'].validate(async (valid) => {
        if (valid) {
          let unitObj = await this.queryUnit(this.form.unitName)
          if (typeof unitObj !== 'object') {
            return false
          }
          let data = { ...this.form, ...unitObj }

          if (typeof this.editIndex === 'number') {
            this.$set(this.unitList, this.editIndex, data)
          } else {
            let findindex = this.unitList.findIndex(
              (i) => i.unitId == data.unitId
            )
            if (findindex !== -1) {
              this.$notify.error({
                title: 'Error',
                message: 'This unit has already been added',
              })
              return false
            }
            this.unitList.push(data)
          }
          this.show = false
        } else {
          return false
        }
      })
    },
    async queryUnit(name) {
      let data = {
        projectId: this.$route.query.id,
        unitName: name,
      }
      let res = await this.$Post(this.$api.queryUnit, data)
      if (res.code == 0) {
        if (res.datas.length) {
          return res.datas[0]
        } else {
          this.$notify.error({
            title: 'Error',
            message: "I didn't find this unit",
          })
        }
      }
    },
    handleDelete(index, row) {
      this.$confirm('Are you sure to delete it?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning',
      })
        .then(() => {
          this.unitList.splice(index, 1)
          this.$message({
            type: 'success',
            message: 'deleted successfully!',
          })
        })
        .catch()
      
    },
    closedForm() {
      this.form = {}
      this.editIndex = undefined
    },
  },
}
</script>

<style lang="less">
.unitList_page {
  .addTab {
    border: 1px solid #ddd;
  }
}
</style>