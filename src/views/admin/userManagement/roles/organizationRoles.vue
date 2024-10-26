<template>
  <div class="organization_section">
    <div class="row_header">
      <el-button size="small" :disabled="roleInit!==-1" @click="addRole">{{$t('role.AddNewRole')}}</el-button>
      <el-button size="small" @click="refreshRole">{{$t('Refresh')}}</el-button>
      </el-row>
    </div>
    <div class="roles_content">
      <div class="roles_table">
        <div class="table">
          <div class="thead">
            <div class="th">{{$t('role.RoleName')}}</div>
            <div class="th">{{$t('role.EditPermissions')}}</div>
            <div class="th">{{$t('role.Copy')}}</div>
            <div class="th">{{$t('Edit')}}</div>
            <div class="th">{{$t('Delete')}}</div>
          </div>
          <div class="tbody">
            <div class="tbody_item flex" v-for="(item,k) in roleLists">
              <div class="tbody_item_left flex">
                <div class="name">
                  <el-input size="mini" v-model="roleName" v-if="k==roleInit"></el-input>
                  <div v-else>{{item.role.roleName}}</div>
                </div>
              </div>
              <div class="tbody_item_right">
                <div class="right_item flex opration_column">
                  <div class="opration_column_children">
                    <el-button size="mini" @click="getPermissionLists(item)" :disabled="!item.role.roleId">{{$t('role.EditPermissions')}}</el-button>
                  </div>
                  <div class="opration_column_children">
                    <el-button size="mini" :disabled="roleInit==k" @click="copyRole(item)">{{$t('role.Copy')}}</el-button>
                  </div>
                  <div class="opration_column_children">
                    <template v-if="roleInit!==k">
                      <el-button size="mini" @click="editRole(item,k)">{{$t('units.edit')}}</el-button>
                    </template>
                    <template v-else>
                      <el-button size="mini" @click="updateRole(item)">{{$t('update')}}</el-button>
                      <el-button size="mini" @click="cancelEditRole(item,k)">{{$t('cancel')}}</el-button>
                    </template>
                  </div>
                  <div class="opration_column_children">
                    <template>
                      <el-button size="mini" :disabled="roleInit==k" @click="deleteRole(item)">{{$t('units.delete')}}</el-button>
                    </template>
                  </div>
                </div>
                <div class="right_item flex add_column">
                  <div class="add ">
                    <el-button size="mini" icon="el-icon-plus" @click="addTeam(item,k)" :disabled="!item.role.isAddTeam">{{$t('units.AddTeam')}}</el-button>
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
        <el-tabs type="border-card">
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
      roleName: "",
      teamName: "",
      dialogOfMember: false,
      memberLists: [], //team的成员数据
      permissionList: [], //权限列表
      roleId: "",
      copyId: "",
      pageType: "2", //Organization Roles
      selectRoleName: ""
    };
  },
  mounted() {
    this.getRolesListData();
  },
  methods: {
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
    viewTeamMembers(item, team) {

      //查看team下面的成员
      this.dialogOfMember = true;
      team.teamId
        ? (this.teamName = team.teamName)
        : (this.teamName = item.role.selectTeam.teamName);
        // console.log(item)
      let teamId = team.teamId || item.role.selectTeam.teamId
      this.$Geting(this.$api.queryTeamsAgentList, {
        teamId: teamId,
        pageSize: 10000,
        pageNo: 1
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
    copyRole(item) {
      //复制role
      if (this.roleLists[0].role.roleId == undefined) {
        this.roleLists.shift();
      }
      this.addRole();
      this.copyId = item.role.roleId;
      // console.log(this.copyId);
    },
    refreshRole() {
      //刷新列表
      this.getRolesListData();
      this.roleName = "";
      this.roleInit = -1;
    },
    updateRole(item) {
      //修改或者添加role
      let params = {
        roleName: this.roleName,
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
    addRole() {
      //添加role时往表格最上面插一条数据
      this.roleLists.unshift({
        role: {
          roleName: "",
          isAddTeam: true,
          selectTeamList: [],
          selectTeam: ""
        },
        teams: []
      });
      this.roleInit = 0;
      this.copyId = ""; //清空copyId以免新增时调copy接口
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
          teamId: team.teamId
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
    editRole(item, k) {
      //编辑role时将对应数据赋值给表单控件
      if (!this.roleLists[0].role.roleId) {
        this.roleLists.shift();
        this.roleInit = k - 1;
      } else {
        this.roleInit = k;
      }
      this.roleName = item.role.roleName;
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
    },
    getRolesListData() {
      this.$Geting(this.$api.queryRoleList, {
        type: this.pageType
      }).then(res => {
        if (res.code == 0) {
          let datas = res.datas;
          for (let i = 0; i < datas.length; i++) {
            datas[i].role.isAddTeam = true;
            datas[i].role.selectTeamList = [];
            datas[i].role.selectTeam = "";
          }
          this.roleLists = datas;
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
        teamId:  item.role.selectTeam.teamId
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
        action: type
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



