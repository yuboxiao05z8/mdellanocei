<template>
  <div class="networkAgencies_section">
    <div class="project_permission_header">
      <el-row>
        <el-col :span="4" class="col_text">
          {{$t('role.NetworkRole')}}
        </el-col>
        <el-col :span="20">
          <el-select size="mini" v-model="selectRole" value-key="role">
            <el-option :label="item.role.roleName" :value="item" :key="k" v-for="(item,k) in selectRoleLists"></el-option>
          </el-select>
          <el-button size="small" @click="getPermissionLists(selectRole)">{{$t('role.viewPermissions')}}</el-button>
          <el-button size="small" @click="updateRole">{{$t('update')}}</el-button>
          <el-button size="small" @click="deleteDefault(selectRole)">{{$t('userLists.clear')}}</el-button>
        </el-col>
      </el-row>
    </div>
    <el-dialog :title="$t('role.viewPermissions')" :visible.sync="dialogVisible" width="900px" class="roles_dialog">
      <el-row class="dialog_header">
        <el-col :span="24" class="col_text">
          {{$t('role.Role')}}： {{selectRoleName}}
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
                  <customBtn :isChange="val.status" :btnConfig="val" :isPointer="false"></customBtn>
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
      dialogVisible: false,
      roleLists: [],
      pageType: "3", //Organization Roles
      selectRoleLists: [], //default roleList
      selectRole: "", //default selectRole
      selectRoleName: "",
      permissionList: "",
      tabVal: "0",
      id: JSON.parse(sessionStorage.getItem("projectDesc") || "{}").id || ""
    };
  },
  mounted() {
    this.getRolesListData();
  },
  methods: {
    deleteDefault(data) {
      //删除默认权限
      if (!data) {
        return;
      }
      this.$Posting(this.$api.deletePermission, {
        roleId: data.role.roleId,
        permission: this.pageType,
        projectId: this.id,
         defaultRole:2
      }).then(res => {
        if (res.code == 0) {
          this.$notify.success({
            title: this.$t("alert.alert_success_title"),
            message: this.$t("alert.alert_success_delete_title")
          });
          this.selectRole = "";
        } else {
          this.$notify.error({
            title: this.$t("alert.fail"),
            message: this.$t("alert.alert_fail_delete_title")
          });
        }
      });
    },
    getPermissionLists(item) {
      //获取role的权限列表
      if (!item) {
        return;
      }
      this.selectRoleName = item.role.roleName;
      this.dialogVisible = true;
      this.tabVal = "0";
      this.$Geting(this.$api.queryRoleAccess, {
        roleId: item.role.roleId,
        catetory: "1",
        projectId: this.id
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
    updateRole() {
      if (!this.selectRole) return;
      this.$Posting(this.$api.savePermission, {
        permission: this.pageType,
        roleId: this.selectRole.role.roleId,
        projectId: this.id
      }).then(res => {
        if (res.code == 0) {
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
    },
    getRolesListData() {
      this.$Posting(this.$api.queryPermissionList, {
        permission: this.pageType,
        action: "action",
        projectId: this.id,
        defaultRole: 2
      }).then(res => {
        if (res.code == 0) {
          let datas = res.datas;
          this.selectRoleLists = datas.role;
          if (datas.defaultRole) {
            for (let i = 0; i < datas.role.length; i++) {
              if (datas.role[i].role.roleId == datas.defaultRole.roleId) {
                // console.log(datas.role[i].role.roleId);
                this.selectRole = datas.role[i];
              }
            }
          }
        } else {
          this.$notify.error({
            title: "fail",
            message: res.msg
          });
          return false;
        }
      });
    }
  }
};
</script>
<style lang="less">
</style>


