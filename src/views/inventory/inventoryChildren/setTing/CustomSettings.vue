<template>
  <div class="CustomSettings">
    <div class="CustomInformationFields">
      <h1 class="text">
        {{$t('edit.customInformationFields')}}
        <el-button class="addBtn" @click="AddFieldsFn">{{$t('AddFields')}}</el-button>
      </h1>
      <div class="CustomInformationFields-Tab">
        <el-table border :data="customInformationFieldsTab" style="width: 100%">
          <el-table-column :label="$t('CustomInfoLabel')" prop="label"></el-table-column>
          <el-table-column :label="$t('CustomInfoValue')" prop="value"></el-table-column>
          <el-table-column :label="$t('Edit')">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">{{$t('Edit')}}</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)"
              >{{$t('Delete')}}</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-dialog :title="$t('addEditFields')" center :visible.sync="dialogVisible" width="40%">
          <div>
            <el-form label-position="left" label-width="200px" :model="form">
              <el-form-item :label="$t('CustomInfoLabel')">
                <el-input v-model="form.label"></el-input>
              </el-form-item>
              <el-form-item :label="$t('CustomInfoValue')">
                <el-input v-model="form.value"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="updataFn">{{$t('update')}}</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      customInformationFieldsTab: [],
      id: JSON.parse(sessionStorage.getItem("projectDesc") || "{}").id || "",
      dialogVisible: false,
      form: {
        label: "",
        value: "",
        id: ""
      }
    };
  },
  mounted() {
    this.queryProjectCustom();
  },
  methods: {
    queryProjectCustom() {
      this.$Geting(this.$api.queryProjectCustom, { projectId: this.id }).then(
        res => {
          if (res.code == 0) {
            this.customInformationFieldsTab = res.datas;
          }
        }
      );
    },
    handleEdit(index, item) {
      this.form = {
        label: item.label,
        value: item.value,
        id: item.id
      };
      this.dialogVisible = true;
    },
    handleDelete(index, item) {
      this.$confirm(
        this.$t("alert.alert_delete"),
        this.$t("alert.alert_command"),
        {
          confirmButtonText: this.$t("alert.sure"),
          cancelButtonText: this.$t("alert.cancel"),
          type: "warning"
        }
      )
        .then(() => {
          this.$Geting(this.$api.deleteProjectCustom, { id: item.id }).then(
            res => {
              if (res.code == 0) {
                this.$message({
                  type: "success",
                  message: this.$t("alert.alert_success_delete_title")
                });
                this.queryProjectCustom()
              } else {
                this.$notify.error({
                  title: "fail",
                  message: res.msg
                });
              }
            }
          );
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("cancel")
          });
        });
    },
    AddFieldsFn() {
      this.form = {
        label: "",
        value: "",
        id: ""
      };
      this.dialogVisible = true;
    },
    updataFn() {
      if (!this.form.label && !this.form.value) {
        this.$notify.error({
          title: "fail",
          message: "Fill Out the Form"
        });
        return false;
      } else {
        let data = {
          ...this.form,
          projectId: this.id
        };
        this.$Posting(this.$api.saveProjectCustom, data).then(res => {
          if (res.code == 0) {
            this.dialogVisible = false;
            this.$notify({
              title: "success",
              message: res.msg,
              type: "success"
            });
            this.queryProjectCustom();
          }
        });
      }
    }
  }
};
</script>

<style lang="less">
.CustomSettings {
  width: 100%;
  height: 100%;
  background: #ffff;
  padding: 10px;
  .CustomInformationFields {
    padding: 10px;
    border: 1px solid #f4f4f4;
    .text {
      height: 50px;
      line-height: 50px;
      background: #f4f4f4;
      padding: 0 10px;
      margin-bottom: 15px;
      .addBtn {
        float: right;
        margin-top: 5px;
      }
    }
    .CustomInformationFields-Tab {
    }
  }
}
</style>