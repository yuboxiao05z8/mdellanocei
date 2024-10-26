<template>
  <div class="property_section">
    <div class="row_header">
      <el-button size="small" :disabled="roleInit!==-1" @click="addRole">{{$t('role.AddNewRole')}}</el-button>
      <el-button size="small" @click="refreshRole">{{$t('Refresh')}}</el-button>
      </el-row>
    </div>
    <div class="roles_content">
      <el-table :data="roleLists" border style="width: 100%" :header-cell-style="{'background':'#f5f7fa'}" size="mini">
        <el-table-column :label="$t('role.RoleName')">
          <template slot-scope="scope">
            <el-input size="mini" v-model="roleName" v-if="scope.$index==roleInit"></el-input>
            <div v-else>{{scope.row.role.roleName}}</div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('role.Category')">
          <template slot-scope="scope">
            <template v-if="scope.$index==roleInit">
              <el-select v-model="category" size="mini">
                <el-option label="Internal" :value="1"></el-option>
                <el-option label="Appointed External" :value="2"></el-option>
                <el-option label="Network" :value="3"></el-option>
                <el-option label="Prospects" :value="4"></el-option>
                <el-option label="Buyers" :value="5"></el-option>
              </el-select>
            </template>
            <div v-else>{{scope.row.role.category | changeSelectShow}} </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('role.EditPermissions')">
          <template slot-scope="scope">
            <el-button size="mini" @click="getPermissionLists(scope.row)" :disabled="!scope.row.role.roleId">{{$t('role.EditPermissions')}}</el-button>
          </template>
        </el-table-column>
        <el-table-column :label="$t('role.Copy')">
          <template slot-scope="scope">
            <el-button size="mini" :disabled="roleInit==scope.$index" @click="copyRole(scope.row)">{{$t('role.Copy')}}</el-button>
          </template>
        </el-table-column>
        <el-table-column :label="$t('units.edit')">
          <template slot-scope="scope">
            <template v-if="roleInit!==scope.$index">
              <el-button size="mini" @click="editRole(scope.row,scope.$index)">{{$t('units.edit')}}</el-button>
            </template>
            <template v-else>
              <el-button size="mini" @click="updateRole(scope.row)">{{$t('update')}}</el-button>
              <el-button size="mini" @click="cancelEditRole(scope.row,scope.$index)">{{$t('cancel')}}</el-button>
            </template>
          </template>
        </el-table-column>
        <el-table-column :label="$t('units.delete')">
          <template slot-scope="scope">
            <el-button size="mini" :disabled="roleInit==scope.$index" @click="deleteRole(scope.row)">{{$t('units.delete')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="$t('role.EditPermissions')" :visible.sync="dialogVisible" width="900px" class="roles_dialog">
      <el-row class="dialog_header">
        <el-col :span="12" class="col_text">
          {{$t('role.Role')}}： {{selectRoleName}}
        </el-col>
        <el-col :span="12" class="col_button">
          <el-button size="mini" @click="updatePermission">{{$t('update')}}</el-button>
          <el-button size="mini" @click="dialogVisible = false">{{$t('cancel')}}</el-button>
        </el-col>
      </el-row>
      <el-row class="permissions_command">
        <el-col :span="8">
          <customBtn :isPointer="false" :btnConfig="{type:-1}"></customBtn>
          <span>{{$t('role.None')}}</span>
        </el-col>
        <el-col :span="8">
          <customBtn :btnConfig="{type:2}" :isPointer="false"></customBtn>
          <span>{{$t('role.Individual')}}</span>
        </el-col>
        <el-col :span="8">
          <customBtn :btnConfig="{type:3}" :isPointer="false"></customBtn>
          <span>{{$t('role.Organization')}}</span>
        </el-col>
      </el-row>
      <div class="permissions_tab">
        <el-tabs type="border-card" v-model="tabVal">
          <el-tab-pane v-for="(item,k) in permissionList" :key="k" :label="item.groupName">
            <div class="car_tab_div">
              <el-row class="permissions_single" v-for="(val,i) in item.accessList" :key="i">
                <el-col :span="2" class="permissions_single_left">
                  <customBtn :isChange="val.status" :btnConfig="val"></customBtn>
                </el-col>
                <el-col :span="22" class="permissions_single_right">{{val.accessName}}</el-col>
              </el-row>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import customBtn from "@/components/customBtn";
export default {
  components: { customBtn },
  data() {
    return {
      roleInit: -1,
      category: "",
      roleName: "",
      roleLists: [],
      copyId: "",
      permissionList: [], //权限列表
      dialogVisible: false,
      roleId: "",
      pageType: "1", //Property Roles
      selectRoleName: "",
      tabVal: "0"
    };
  },
  mounted() {
    this.getRolesListData();
  },
  methods: {
    copyRole(item) {
      //复制role
      if (this.roleLists[0].role.roleId == undefined) {
        this.roleLists.shift();
      }
      this.addRole();
      this.copyId = item.role.roleId;
    },
    updatePermission() {
      //更新权限
      let permissionArr = [];
      let permissionList = this.permissionList;
      for (let i = 0; i < permissionList.length; i++) {
        let accessList = permissionList[i].accessList;
        for (let j = 0; j < accessList.length; j++) {
          if (accessList[j].type !== -1) {
            permissionArr.push({
              accessId: accessList[j].accessId,
              type: accessList[j].type
            });
          }
        }
      }
      if (permissionArr.length) {
        this.$Posting(this.$api.saveRoleAccess, {
          roleId: this.roleId,
          access: JSON.stringify(permissionArr)
        }).then(res => {
          if (res.code == 0) {
            this.dialogVisible = false;
            this.$notify.success({
              title: this.$t("alert.alert_success_title"),
              message: this.$t("alert.operate_success_title")
            });
          } else {
            this.$notify.error({
              title: "fail",
              message: res.msg
            });
            return false;
          }
        });
      }
    },
    getPermissionLists(item) {
      //获取role的权限列表
      this.roleId = item.role.roleId;
      this.selectRoleName = item.role.roleName;
      this.dialogVisible = true;
      this.tabVal = "0";
      this.$Geting(this.$api.queryRoleAccess, {
        roleId: item.role.roleId,
        catetory: this.pageType
      }).then(res => {
        if (res.code == 0) {
          this.permissionList = res.datas;
        } else {
          this.$notify.error({
            title: "fail",
            message: res.msg
          });
          return false;
        }
      });
    },
    addRole() {
      this.roleLists.unshift({
        role: {
          roleName: "",
          category: ""
        }
      });
      this.roleInit = 0;
      this.copyId = ""; //清空copyId以免新增时调copy接口
    },
    deleteRole(item) {
      //删除指定role
      this.$confirm(
        this.$t("alert.alert_delete"),
        this.$t("alert.alert_command"),
        {
          confirmButtonText: this.$t("alert.sure"),
          cancelButtonText: this.$t("alert.cancel"),
          type: "warning"
        }
      ).then(() => {
        this.$Geting(this.$api.deleteRole, {
          roleId: item.role.roleId
        }).then(res => {
          if (res.code == 0) {
            this.$notify.success({
              title: this.$t("alert.alert_success_title"),
              message: this.$t("alert.alert_success_delete_title")
            });
            this.refreshRole();
          } else {
            this.$notify.error({
              title: this.$t("alert.fail"),
              message: this.$t("alert.alert_fail_delete_title")
            });
          }
        });
      });
    },
    updateRole(item) {
      //修改或者添加role
      let params = {
        roleName: this.roleName,
        category: this.category,
        type: this.pageType
      };
      let api;
      if (this.copyId) {
        params.copyRoleId = this.copyId;
        api = this.$api.copyRole;
      } else {
        params.roleId = item.role.roleId;
        api = this.$api.saveRole;
      }
      this.$Posting(api, params).then(res => {
        if (res.code == 0) {
          this.$notify.success({
            title: this.$t("alert.alert_success_title"),
            message: this.$t("alert.operate_success_title")
          });
          this.refreshRole();
        } else {
          this.$notify.error({
            title: "fail",
            message: res.msg
          });
          return false;
        }
      });
    },
    refreshRole() {
      //刷新列表
      this.getRolesListData();
      this.roleName = "";
      this.roleInit = -1;
      this.category = "";
    },
    editRole(item, k) {
      //编辑role时将对应数据赋值给表单控件
      if (!this.roleLists[0].role.roleId) {
        this.roleLists.shift();
        this.roleInit = k - 1;
      } else {
        this.roleInit = k;
      }
      this.roleName = item.role.roleName;
      this.category = item.role.category;
      this.copyId = ""; //清空copyId以免修改时调copy接口
    },
    cancelEditRole(item, k) {
      //取消编辑role
      if (k == 0) {
        if (item.role.roleId == undefined) {
          this.roleLists.shift();
        }
      }
      this.roleName = "";
      this.roleInit = -1;
      this.category = "";
    },
    getRolesListData() {
      this.$Geting(this.$api.queryRoleList, {
        type: this.pageType
      }).then(res => {
        if (res.code == 0) {
          this.roleLists = res.datas;
        } else {
          this.$notify.error({
            title: "fail",
            message: res.msg
          });
          return false;
        }
      });
    }
  },
  filters: {
    changeSelectShow(val) {
      let str = "";
      switch (val) {
        case 1:
          str = "Internal";
          break;
        case 2:
          str = "Appointed External";
          break;
        case 3:
          str = "Network";
          break;
        case 4:
          str = "Prospects";
          break;
        case 5:
          str = "Buyers";
          break;
        default:
          str = "";
          break;
      }
      return str;
    }
  }
};
</script>
<style lang="less">
</style>


