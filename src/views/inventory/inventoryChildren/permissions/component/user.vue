<template>
  <div class="user_section">
    <div class="project_permission_header">
      <el-row>
        <el-col :span="4" class="col_text">
          {{$t('role.DefaultRole')}}
        </el-col>
        <el-col :span="20">
          <el-select size="mini" v-model="selectRole" value-key="role">
            <el-option :label="item.role.roleName" :value="item" :key="k" v-for="(item,k) in selectRoleLists"></el-option>
          </el-select>
          <el-button size="small" @click="getPermissionLists(selectRole)">{{$t('role.viewPermissions')}}</el-button>
          <el-button size="small" @click="updateRole(1)">{{$t('update')}}</el-button>
          <el-button size="small" @click="deleteDefault(selectRole)">{{$t('userLists.clear')}}</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="project_permission_header" style="margin-top:15px">
      <el-row>
        <el-col :span="4" class="col_text">
          {{$t('role.InternalRoles')}}
        </el-col>
        <el-col :span="20">
          <el-button size="small" :disabled="roleInit!==-1" @click="addRole">{{$t('role.AddNewRole')}}</el-button>
          <el-button size="small" @click="refreshRole">{{$t('Refresh')}}</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="roles_content">
      <div class="roles_table">
        <div class="table">
          <div class="thead">
            <div class="th">{{$t('role.RoleName')}}</div>
            <div class="th">{{$t('role.EditPermissions')}}</div>
            <div class="th"> {{$t('role.Operation')}}</div>
          </div>
          <div class="tbody">
            <div class="tbody_item flex" v-for="(item,k) in roleLists">
              <div class="tbody_item_left flex">
                <div class="name">
                  <el-select size="mini" v-model="selectTableRole" v-if="k==roleInit" value-key="role">
                    <el-option :label="item.role.roleName" :value="item" :key="k" v-for="(item,k) in selectTableRoleList"></el-option>
                  </el-select>
                  <div v-else>{{item.role.roleName}}</div>
                </div>
              </div>
              <div class="tbody_item_right">
                <div class="right_item flex opration_column">
                  <div class="opration_column_children">
                    <el-button size="mini" @click="getPermissionLists(item)" :disabled="!item.role.roleId&&!selectTableRole">{{$t('role.viewPermissions')}}</el-button>
                  </div>
                  <div class="opration_column_children">
                    <template v-if="roleInit==k">
                      <el-button size="mini" @click="updateRole(2)">{{$t('update')}}</el-button>
                      <el-button size="mini" @click="cancelEditRole">{{$t('cancel')}}</el-button>
                    </template>
                    <template v-else>
                      <el-button size="mini" @click="deleteRole(item)">{{$t('units.delete')}}</el-button>
                    </template>
                  </div>
                </div>
                <div class="right_item flex add_column">
                  <div class="add ">
                    <el-button size="mini" icon="el-icon-plus" @click="addTeam(item,k)" :disabled="!item.role.isAddTeam||roleInit==k">{{$t('units.AddTeam')}}</el-button>
                  </div>
                </div>
                <div class="right_item flex data_column">
                  <div class="data_column_item flex" v-for="(team,i) in item.teams">
                    <div class="data_column_item_left flex">
                      <div class="team_name">
                        <el-select v-if="!team.teamId" size="mini" v-model="item.role.selectTeam" value-key="teamId">
                          <el-option v-for="teamVal in item.role.selectTeamList" :key="teamVal.teamId" :label="teamVal.teamName" :value="teamVal"></el-option>
                        </el-select>
                        <div v-else>{{team.teamName}}</div>
                      </div>
                      <div v-if="!team.teamId">
                        <el-button size="mini" @click="insertTeamToRole(item)">{{$t('units.Insert')}}</el-button>
                        <el-button size="mini" @click="cancelTeam(team,i,item)">{{$t('cancel')}}</el-button>
                      </div>
                    </div>
                    <div class="data_column_item_right">
                      <el-button size="mini" @click="viewTeamMembers(item,team)" :disabled="!team.teamId&&!item.role.selectTeam">{{$t('units.ViewTeamMembers')}}</el-button>
                      <el-button size="mini" :disabled="!team.teamId" @click="deleteTeam(team,item)">{{$t('units.DeleteTeam')}}</el-button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="noData" v-if="!roleLists.length">{{$t('units.noData')}}</div>
        </div>
      </div>
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
    <el-dialog :title="$t('units.TeamMembers')+ teamName" :visible.sync="dialogOfMember" width="900px">
      <div class="view_member_section">
        <el-table :data="memberLists" border :header-cell-style="{'background':'#f5f7fa'}" style="width: 100%" size="mini">
          <el-table-column prop="agentName" :label="$t('units.Name')">
          </el-table-column>
        </el-table>
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
      roleInit: -1,
      teamName: "",
      dialogOfMember: false,
      memberLists: [], //team的成员数据
      permissionList: [], //权限列表
      pageType: "1", //Organization Roles
      selectRoleName: "",
      tabVal: "0",
      selectRoleLists: [], //default roleList
      selectRole: "", //default selectRole
      selectTableRole: "", //table selectRole
      selectTableRoleList: [], //table select roleList
      id: JSON.parse(sessionStorage.getItem("projectDesc") || "{}").id || ""
    };
  },
  mounted() {
    this.getRolesListData("query");
    this.getRolesListData("action");
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
        defaultRole:1
      }).then(res => {
        if (res.code == 0) {
          this.$notify.success({
            title: this.$t("alert.alert_success_title"),
            message: this.$t("alert.alert_success_delete_title")
          });
          this.selectRole = ""
        } else {
          this.$notify.error({
            title: this.$t("alert.fail"),
            message: this.$t("alert.alert_fail_delete_title")
          });
        }
      });
    },
    getPermissionLists(item) {
      // console.log(item);
      //获取role的权限列表
      if (!item) {
        return;
      }
      if (!item.role.roleId) {
        item = this.selectTableRole;
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
    viewTeamMembers(item, team) {
      //查看team下面的成员
      this.dialogOfMember = true;
      team.teamId
        ? (this.teamName = team.teamName)
        : (this.teamName = item.role.selectTeam.teamName);
      let teamId = team.teamId || item.role.selectTeam.teamId;
      this.$Geting(this.$api.queryTeamsAgentList, {
        teamId: teamId,
        pageSize: 10000,
        pageNo: 1,
        projectId: this.id
      }).then(res => {
        if (res.code == 0) {
          this.memberLists = res.datas.lists;
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
      this.selectTableRole = "";
      this.roleInit = -1;
      this.getRolesListData("query");
    },
    updateRole(type) {
      let params = {
        permission: this.pageType,
        projectId: this.id
      };
      let api;
      if (type == 1) {
        //type为1表示修改default
        if (!this.selectRole) return;
        params.roleId = this.selectRole.role.roleId;
        api = this.$api.saveDefaultPermission;
      } else {
        // 2则表示添加表格数据
        if (!this.selectTableRole) return;
        params.roleId = this.selectTableRole.role.roleId;
        api = this.$api.savePermission;
      }
      this.$Posting(api, params).then(res => {
        if (res.code == 0) {
          this.$notify.success({
            title: this.$t("alert.alert_success_title"),
            message: this.$t("alert.operate_success_title")
          });
          if (type == 2) {
            this.refreshRole();
          }
        } else {
          this.$notify.error({
            title: "fail",
            message: res.msg
          });
          return false;
        }
      });
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
        this.$Posting(this.$api.deletePermission, {
          roleId: item.role.roleId,
          permission: this.pageType,
          projectId: this.id,
          defaultRole:2
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
    addRole() {
      //添加role时往表格最上面插一条数据
      this.roleLists.unshift({
        role: {
          isAddTeam: true,
          selectTeamList: [],
          selectTeam: ""
        },
        teams: []
      });
      this.roleInit = 0;
      this.selectTableRole = "";
      this.getRolesListData("add");
    },
    deleteTeam(team, item) {
      //删除team
      this.$confirm(
        this.$t("alert.alert_delete"),
        this.$t("alert.alert_command"),
        {
          confirmButtonText: this.$t("alert.sure"),
          cancelButtonText: this.$t("alert.cancel"),
          type: "warning"
        }
      ).then(() => {
        this.$Geting(this.$api.deleteRoleTeam, {
          roleId: item.role.roleId,
          teamId: team.teamId,
          projectId: this.id
        }).then(res => {
          if (res.code == 0) {
            this.$notify.success({
              title: this.$t("alert.alert_success_title"),
              message: this.$t("alert.alert_success_delete_title")
            });
            this.getSelectTeam(item, "query");
          } else {
            this.$notify.error({
              title: this.$t("alert.fail"),
              message: this.$t("alert.alert_fail_delete_title")
            });
          }
        });
      });
    },
    cancelEditRole() {
      //取消编辑role
      this.roleLists.shift();
      this.selectTableRole = "";
      this.roleInit = -1;
    },
    getRolesListData(action) {
      let obj = {
        permission: this.pageType,
        action: action,
        projectId: this.id,
        defaultRole: 1
      };
      if (action == "query" || action == "add") obj.defaultRole = 2;
      this.$Posting(this.$api.queryPermissionList, obj).then(res => {
        if (res.code == 0) {
          let datas = res.datas;
          if (action == "query") {
            for (let i = 0; i < datas.role.length; i++) {
              datas.role[i].role.isAddTeam = true;
              datas.role[i].role.selectTeamList = [];
              datas.role[i].role.selectTeam = "";
            }
            this.roleLists = datas.role;
          } else if (action == "action") {
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
            this.selectTableRoleList = datas.role;
          }
        } else {
          this.$notify.error({
            title: "fail",
            message: res.msg
          });
          return false;
        }
      });
    },
    addTeam(item) {
      //添加team
      item.teams.unshift({});
      item.role.isAddTeam = false;
      item.role.selectTeam = "";
      this.getSelectTeam(item);
    },
    insertTeamToRole(item) {
      //将指定team关联到指定的roles
      let roleId = item.role.roleId || -1;
      this.$Posting(this.$api.saveRoleTeam, {
        roleId: roleId,
        teamId: item.role.selectTeam.teamId,
        projectId: this.id
      }).then(res => {
        if (res.code == 0) {
          this.$notify.success({
            title: this.$t("alert.alert_success_title"),
            message: this.$t("alert.operate_success_title")
          });
          this.getSelectTeam(item, "query");
        } else {
          this.$notify.error({
            title: "fail",
            message: res.msg
          });
          return false;
        }
      });
    },
    cancelTeam(team, i, item) {
      //取消添加team
      //取消team
      if (i == 0) {
        if (team.teamId == undefined) {
          item.teams.shift();
        }
      }
      item.role.isAddTeam = true;
    },
    getSelectTeam(item, type = "add") {
      //获取role下面的team列表 add表示未添加的 query表示添加的
      let roleId = item.role.roleId || -1;
      this.$Geting(this.$api.queryRoleTeam, {
        roleId: roleId,
        action: type,
        projectId: this.id
      }).then(res => {
        if (res.code == 0) {
          if (type == "add") {
            item.role.selectTeamList = res.datas;
          } else {
            item.teams = res.datas;
            item.role.isAddTeam = true;
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


