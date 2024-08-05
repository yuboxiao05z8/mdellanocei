<template>
  <div class="units_wrapper">
    <div class="update_units units_section">
      <el-row class="row_header">
        <el-col :span="8" class="col_text">{{$t('units.updateUnits')}}</el-col>
        <el-col :span="16" class="col_button">
          <uploader
            fileId="unit"
            :maxSize="100"
            :uploadParam="uploadUnitParam"
            @uploadAfter="uploadUnitsAfter"
            :url="$api.importUnit"
            :selfNum="self"
            fileType=".xls,.xlsx"
            :btnText="{select:$t('units.selectFile'),import:$t('units.importUnitList')}"
          ></uploader>
          <el-button
            :disabled="self == 0"
            size="mini"
            @click="exportUnit"
          >{{$t('units.exportUnitList')}}</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="15">
          <el-alert :title="$t('units.updateUntilsCommand')" type="info" :closable="false"></el-alert>
        </el-col>
      </el-row>
      <div class="checkbox_one">
        <el-checkbox
          @change="changeCheckbox"
          v-model="isChecked"
        >{{$t('units.updatePurchaseStatusOfUnit')}}</el-checkbox>
      </div>
    </div>
    <div class="update_units_status units_section">
      <el-row class="row_header">
        <el-col :span="8" class="col_text">{{$t('units.updateUnitsStatus')}}</el-col>
        <el-col :span="16" class="col_button">
          <uploader
            fileId="unitTransaction"
            :maxSize="10"
            :uploadParam="uploadUnitTransactionParam"
            :url="$api.importUnitTransaction"
            fileType=".xls,.xlsx"
            :selfNum="onSelf"
            :btnText="{select:$t('units.selectFile'),import:$t('units.importUnitTransactionList')}"
          ></uploader>
          <el-button
            size="mini"
            @click="exportUnitTransaction"
            :disabled="onSelf == 0"
          >{{$t('units.exportUnitTransactionList')}}</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="15">
          <el-alert :title="$t('units.updateUnitsStatusCommand')" type="info" :closable="false"></el-alert>
        </el-col>
      </el-row>
    </div>
    <div class="unit_tab_content">
      <div class="unit_tab">
        <el-tabs v-model="activeTable" type="border-card">
          <el-tab-pane :label="$t('units.UnitList')" name="1">
            <div class="unit_list_header">
              <el-row>
                <el-col :span="12">
                  <div>{{$t('units.UnitList')}}</div>
                </el-col>
                <el-col :span="12">
                  <el-button size="mini" @click="DeleteAll">Delete All Unit</el-button>
                  <el-button size="mini" @click="refreshUnit">{{$t('Refresh')}}</el-button>
                </el-col>
              </el-row>
            </div>
            <el-table
              :data="unitList"
              :header-cell-style="{'background':'#f5f7fa'}"
              style="width: 100%"
              size="mini"
            >
              <el-table-column prop="unitName" :label="$t('units.Name')"></el-table-column>
              <el-table-column prop="purchaseStatus" :label="$t('units.Status')"></el-table-column>
              <el-table-column prop="price1" :label="$t('units.Price1')"></el-table-column>
              <el-table-column prop="price2" :label="$t('units.Price2')"></el-table-column>
              <el-table-column prop="price3" :label="$t('units.Price3')"></el-table-column>
              <el-table-column prop="price4" :label="$t('units.Price4')"></el-table-column>
              <el-table-column prop="price5" :label="$t('units.Price5')"></el-table-column>
              <el-table-column prop="area" :label="$t('units.Area')"></el-table-column>
              <el-table-column prop="type" :label="$t('units.Type')"></el-table-column>
              <el-table-column :label="$t('Delete')">
                <template slot-scope="scope">
                  <el-button
                    :disabled="self == 0"
                    size="mini"
                    @click="deleteUnit(scope.row)"
                  >{{$t('units.delete')}}</el-button>
                </template>
              </el-table-column>
              <el-table-column :label="$t('Edit')">
                <template slot-scope="scope">
                  <el-button
                    :disabled="self == 0"
                    size="mini"
                    @click="editUnit(scope.row)"
                  >{{$t('units.edit')}}</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="page_section">
              <el-pagination
                background
                small
                @size-change="handleUnitSizeChange"
                @current-change="handleUnitCurrentChange"
                :current-page.sync="unitPage.currentPage"
                :page-sizes="[5,10,30,50,100]"
                :page-size="unitPage.pageSize"
                layout="prev, pager, next,sizes,total"
                :total="unitPage.count"
              ></el-pagination>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="$t('units.UnitAccessList')" name="2">
            <div class="unit_list_header">
              <el-row>
                <el-col :span="12">
                  <div>{{$t('units.UnitAccessList')}}</div>
                </el-col>
                <el-col :span="12">
                  <el-button
                    size="mini"
                    :disabled="groupInit!==-1 || self==0"
                    @click="addGroup"
                  >{{$t('units.AddUnitAccess')}}</el-button>
                  <el-button size="mini" @click="refreshGroup">{{$t('Refresh')}}</el-button>
                </el-col>
              </el-row>
            </div>
            <div class="unit_access_list_table">
              <div class="table">
                <div class="thead">
                  <div class="th">{{$t('units.GroupName')}}</div>
                  <div class="th">{{$t('units.NonAccessStatus')}}</div>
                  <div class="th">{{$t('units.ShowSoldasSold')}}</div>
                  <div class="th">{{$t('units.ManageUnits')}}</div>
                  <div class="th">{{$t('Delete')}}</div>
                  <div class="th">{{$t('Edit')}}</div>
                </div>
                <div class="tbody">
                  <div class="tbody_item flex" v-for="(item,k) in unitAccessList">
                    <div class="tbody_item_left flex">
                      <div class="name">
                        <el-input size="mini" v-model="groupName" v-if="k==groupInit"></el-input>
                        <div v-else>{{item.group.groupName}}</div>
                      </div>
                    </div>
                    <div class="tbody_item_right">
                      <div class="right_item flex opration_column">
                        <div class="opration_column_children">
                          <el-select v-model="accessStatus" v-if="k == groupInit" size="mini">
                            <el-option :label="$t('units.Sold')" :value="1"></el-option>
                            <el-option :label="$t('units.Unavailable')" :value="2"></el-option>
                          </el-select>
                          <template v-else>
                            <span v-if="item.group.accessStatus == '1'">{{$t('units.Sold')}}</span>
                            <span v-else>{{$t('units.Unavailable')}}</span>
                          </template>
                        </div>
                        <div class="opration_column_children">
                          <el-checkbox
                            v-model="showSold"
                            v-if="k == groupInit"
                            :true-label="1"
                            :false-label="2"
                          ></el-checkbox>
                          <template v-else>
                            <i class="el-icon-check" v-if="item.group.showSold == '1'"></i>
                            <i class="el-icon-close" v-else></i>
                          </template>
                        </div>
                        <div class="opration_column_children">
                          <el-button
                            size="mini"
                            @click="manageUnits(item)"
                            :disabled="!item.group.groupId || self == 0"
                          >{{$t('units.ManageUnits')}}({{item.group.unitNum}})</el-button>
                        </div>
                        <div class="opration_column_children">
                          <el-button
                            size="mini"
                            :disabled="groupInit==k || self == 0"
                            @click="deleteGroup(item)"
                          >{{$t('units.delete')}}</el-button>
                        </div>
                        <div class="opration_column_children">
                          <template v-if="groupInit!==k">
                            <el-button
                              :disabled="self == 0"
                              size="mini"
                              @click="editGroup(item,k)"
                            >{{$t('units.edit')}}</el-button>
                          </template>
                          <template v-else>
                            <el-button
                              :disabled="self == 0"
                              size="mini"
                              @click="updateGroup(item)"
                            >{{$t('update')}}</el-button>
                            <el-button
                              :disabled="self == 0"
                              size="mini"
                              @click="cancelEditGroup(item,k)"
                            >{{$t('cancel')}}</el-button>
                          </template>
                        </div>
                      </div>
                      <div class="right_item flex add_column">
                        <div class="add">
                          <el-button
                            size="mini"
                            icon="el-icon-plus"
                            @click="addTeam(item,k)"
                            :disabled="!item.group.isAddTeam || self==0"
                          >{{$t('units.AddTeam')}}</el-button>
                        </div>
                      </div>
                      <div class="right_item flex data_column">
                        <div class="data_column_item flex" v-for="(team,i) in item.teams">
                          <div class="data_column_item_left flex">
                            <div class="team_name">
                              <el-select
                                v-if="!team.teamId"
                                size="mini"
                                v-model="item.group.selectTeamId"
                                @change="teamChange(item)"
                              >
                                <el-option
                                  v-for="teamVal in item.group.selectTeamList"
                                  :key="teamVal.teamId"
                                  :label="teamVal.teamName"
                                  :value="teamVal.teamId"
                                ></el-option>
                              </el-select>
                              <div v-else>{{team.teamName}}</div>
                            </div>
                            <div v-if="!team.teamId">
                              <el-button
                                size="mini"
                                @click="insertTeamToGroup(item)"
                                :disabled="self == 0"
                              >{{$t('units.Insert')}}</el-button>
                              <el-button
                                size="mini"
                                @click="cancelTeam(team,i,item)"
                                :disabled="self == 0"
                              >{{$t('cancel')}}</el-button>
                            </div>
                          </div>
                          <div class="data_column_item_right">
                            <el-button
                              size="mini"
                              @click="viewTeamMembers(item,team)"
                              :disabled="!team.teamId&&!item.group.selectTeamId || self == 0"
                            >{{$t('units.ViewTeamMembers')}}</el-button>
                            <el-button
                              size="mini"
                              :disabled="!team.teamId || self == 0"
                              @click="deleteTeam(team,item)"
                            >{{$t('units.DeleteTeam')}}</el-button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="noData" v-if="!unitAccessList.length">{{$t('units.noData')}}</div>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <!-- 编辑unit的价格 -->
    <el-dialog :title="$t('Edit')" :visible.sync="dialogOfPrice" width="900px">
      <div class="edit_price_content">
        <div class="header">
          <el-row>
            <el-col :span="12">
              <div class="name">{{priceDialogDetails.unitName}}</div>
            </el-col>
            <el-col :span="12">
              <div class="opration">
                <el-button size="mini" :disabled="self == 0" @click="updateUnit">{{$t('update')}}</el-button>
                <el-button
                  size="mini"
                  :disabled="self == 0"
                  @click="dialogOfPrice = false"
                >{{$t('cancel')}}</el-button>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="form">
          <el-form :inline="true" size="mini" label-width="80px">
            <el-row>
              <el-col :span="12">
                <el-form-item :label="$t('units.ListPrice')">
                  <el-input v-model.trim="priceDialogDetails.price1"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="$t('units.Price6')">
                  <el-input v-model.trim="priceDialogDetails.price6"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item :label="$t('units.NettPrice')">
                  <el-input v-model.trim="priceDialogDetails.price2"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="$t('units.Price7')">
                  <el-input v-model.trim="priceDialogDetails.price7"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item :label="$t('units.Price3')">
                  <el-input v-model.trim="priceDialogDetails.price3"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="$t('units.Price8')">
                  <el-input v-model.trim="priceDialogDetails.price8"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item :label="$t('units.Price4')">
                  <el-input v-model.trim="priceDialogDetails.price4"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="$t('units.Price9')">
                  <el-input v-model.trim="priceDialogDetails.price9"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item :label="$t('units.Price5')">
                  <el-input v-model.trim="priceDialogDetails.price5"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="$t('units.Price10')">
                  <el-input v-model.trim="priceDialogDetails.price10"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
    </el-dialog>
    <!-- 编辑unit的价格 -->
    <!-- 管理unit下面的组 -->
    <el-dialog
      :title="$t('units.ManageUnitsUnderGroup')"
      :visible.sync="dialogOfGroup"
      width="900px"
      @close="closeGroupDialog"
    >
      <div class="manage_group_content">
        <el-row>
          <el-col>
            <div class="header">
              <uploader
                ref="unitManageImport"
                fileId="unitManageImport"
                :maxSize="10"
                :uploadParam="importUnitGroupParam"
                :url="$api.importUnitGroup"
                fileType=".xls,.xlsx"
                :selfNum="self"
                :btnText="{select:$t('units.selectFile'),import:$t('units.Import')}"
                @uploadAfter="uploadManageUnitAfter"
              ></uploader>
              <el-button
                :disabled="self == 0"
                size="mini"
                @click="exportUnitManage"
              >{{$t('units.Export')}}</el-button>
              <el-button
                :disabled="self == 0"
                size="mini"
                @click="deleteGroupOfUnit('')"
              >{{$t('units.RemoveAll')}}</el-button>
              <el-button
                :disabled="self == 0"
                size="mini"
                @click="refreshManageUnit"
              >{{$t('Refresh')}}</el-button>
            </div>
          </el-col>
        </el-row>
        <el-row class="select_section_row">
          <el-col :span="2">
            <div class="select_name">{{$t('units.Unit')}}</div>
          </el-col>
          <el-col :span="18">
            <div class="select_div">
              <el-select size="mini" v-model="unitSelectId">
                <el-option
                  :value="item.unitId"
                  :label="item.unitName"
                  v-for="(item,k) in unitsSelectList"
                  :key="k"
                ></el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="select_btn">
              <el-button
                :disabled="self == 0"
                size="mini"
                @click="insertUnitGroupJoin"
              >{{$t('units.Insert')}}</el-button>
            </div>
          </el-col>
        </el-row>
        <div class="table_section">
          <el-table
            :data="unitsManageList"
            border
            :header-cell-style="{'background':'#f5f7fa'}"
            style="width: 100%"
            max-height="300"
            size="mini"
          >
            <el-table-column prop="unitName" :label="$t('units.UnitName')"></el-table-column>
            <el-table-column :label="$t('Delete')" width="180">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  :disabled="self == 0"
                  @click="deleteGroupOfUnit(scope.row.unitId)"
                >{{$t('units.delete')}}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="page_section" v-if="unitsManageList.length">
          <el-pagination
            background
            small
            @size-change="handleUnitManageSizeChange"
            @current-change="handleUnitManageCurrentChange"
            :current-page.sync="unitManagePage.currentPage"
            :page-sizes="[5,10,30,50,100]"
            :page-size="unitManagePage.pageSize"
            layout="prev, pager, next,sizes,total"
            :total="unitManagePage.count"
          ></el-pagination>
        </div>
      </div>
    </el-dialog>
    <!-- 管理unit下面的组 -->
    <!-- 查看team成员 -->
    <el-dialog
      :title="$t('units.TeamMembers')+ teamName"
      :visible.sync="dialogOfMember"
      width="900px"
    >
      <div class="view_member_section">
        <el-table
          :data="memberLists"
          border
          :header-cell-style="{'background':'#f5f7fa'}"
          style="width: 100%"
          size="mini"
        >
          <el-table-column prop="agentName" :label="$t('units.Name')"></el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <!-- 查看team成员 -->
  </div>
</template>
<script>
import uploader from "@/components/uploader";
export default {
  components: {
    uploader
  },
  data() {
    return {
      self: JSON.parse(sessionStorage.getItem("projectDesc")).self,
      onSelf: 1,
      dialogOfPrice: false, //编辑价格的弹窗
      dialogOfGroup: false, //编辑group里面的unit的弹窗
      dialogOfMember: false, //查看team成员的弹窗
      activeTable: "1", //tab的初始位置
      unitPage: {
        //unit列表的分页配置
        currentPage: 1,
        pageSize: 5,
        count: 0
      },
      unitManagePage: {
        //group里面的unit的分页配置
        currentPage: 1,
        pageSize: 5,
        count: 0
      },
      priceDialogDetails: {}, //编辑价格时的弹窗信息
      unitList: [], //unit列表数据
      unitAccessList: [], //unitAccessList的列表数据
      id: JSON.parse(sessionStorage.getItem("projectDesc") || "{}").id || "", //项目id
      isChecked: false, //上传文件时是否勾选上传条件
      uploadUnitParam: [
        //上传unit的数据
        {
          name: "projectId",
          value:
            JSON.parse(sessionStorage.getItem("projectDesc") || "{}").id || ""
        },
        {
          name: "updatePurchaseStatus",
          value: "NO"
        }
      ],
      uploadUnitTransactionParam: [
        //上传Units Status的数据
        {
          name: "projectId",
          value:
            JSON.parse(sessionStorage.getItem("projectDesc") || "{}").id || ""
        }
      ],
      importUnitGroupParam: [
        //上传group里面unit列表的数据
        {
          name: "projectId",
          value:
            JSON.parse(sessionStorage.getItem("projectDesc") || "{}").id || ""
        }
      ],
      groupInit: -1, //group列表的表格初始化位置（用于往判断那条数据显示编辑状态）
      groupName: "", //groupName
      accessStatus: 1, //accessStatus
      showSold: 2, //showSold
      selectTeamName: "", //下拉选择team时的名字
      memberLists: [], //team的成员数据
      teamName: "", //用于显示在弹窗上方的team名称
      unitsManageList: [], //group的unit弹窗内表格的数据
      unitsSelectList: [], //group的unit弹窗内下拉选择框的数据
      unitSelectId: "", //group的unit弹框选择框里面的id
      groupId: "" //用于弹窗里面获取groupId
    };
  },
  mounted() {
    if (this.id !== "") {
      this.getUnitListData();
      this.getUnitAccessListData();
    }
  },
  methods: {
    teamChange(item) {
      //当team选择框发生变化时获取其对应的名称显示在team弹框上方
      this.selectTeamName = item.group.selectTeamList.find(team => {
        if (team.teamId == item.group.selectTeamId) {
          return team;
        }
      }).teamName;
      // let arr = item.group.selectTeamList;
      // for (let i = 0; i < arr.length; i++) {
      //   if (arr[i].teamId == item.group.selectTeamId) {
      //     this.selectTeamName = arr[i].teamName;
      //   }
      // }
    },
    exportUnitManage() {
      //导出group关联的unit数据
      window.location.href = this.$addDownUrl(this.$api.exportUnitGroup, {
        groupId: this.groupId,
        projectId: this.id
      });
    },
    closeGroupDialog() {
      //当弹窗关闭时将上传组件的文件清除
      this.$refs.unitManageImport.removeFile();
      this.refreshGroup();
    },
    uploadManageUnitAfter() {
      //group的unit数据上传完毕后重新刷新数据
      this.getGroupUnderUnits(this.groupId, "query");
      this.getGroupUnderUnits(this.groupId, "add");
    },
    refreshManageUnit() {
      //group的unit数据刷新
      this.getGroupUnderUnits(this.groupId, "query");
    },
    deleteGroupOfUnit(unitId) {
      //删除group关联的unit数据 不传unitId表示全部删除
      let params = {
        groupId: this.groupId
      };
      unitId && (params.unitId = unitId);
      this.$Geting(this.$api.deleteUnitGroupJoin, params).then(res => {
        if (res.code == 0) {
          this.$notify.success({
            title: this.$t("alert.alert_success_title"),
            message: this.$t("alert.alert_success_delete_title")
          });
          this.unitSelectId = "";
          if (
            this.unitsManageList.length == 1 &&
            this.unitManagePage.currentPage !== 1
          ) {
            this.unitManagePage.currentPage--;
          }
          this.getGroupUnderUnits(this.groupId, "query");
          this.getGroupUnderUnits(this.groupId, "add");
        } else {
          this.$notify.error({
            title: this.$t("alert.fail"),
            message: this.$t("alert.alert_fail_delete_title")
          });
        }
      });
    },
    insertUnitGroupJoin() {
      //将unit关联到指定的group
      if (!this.unitSelectId) return;
      this.$Posting(this.$api.insertUnitGroupJoin, {
        groupId: this.groupId,
        unitIds: this.unitSelectId
      }).then(res => {
        if (res.code == 0) {
          this.$notify.success({
            title: this.$t("alert.alert_success_title"),
            message: this.$t("alert.operate_success_title")
          });
          this.unitSelectId = "";
          this.getGroupUnderUnits(this.groupId, "query");
          this.getGroupUnderUnits(this.groupId, "add");
        } else {
          this.$notify.error({
            title: "fail",
            message: res.msg
          });
          return false;
        }
      });
    },
    manageUnits(item) {
      //点击manage unit按钮时加载表格数据和select数据
      this.dialogOfGroup = true;
      this.groupId = item.group.groupId;
      this.importUnitGroupParam[1] = {
        name: "groupId",
        value: item.group.groupId
      };
      this.getGroupUnderUnits(item.group.groupId, "query");
      this.getGroupUnderUnits(item.group.groupId, "add");
    },
    handleUnitManageSizeChange(val) {
      //unit弹窗的分页方法
      this.unitManagePage.pageSize = val;
      this.unitManagePage.currentPage = 1;
      this.getGroupUnderUnits(this.groupId, "query");
    },
    handleUnitManageCurrentChange(val) {
      //unit弹窗的分页方法
      this.unitManagePage.currentPage = val;
      this.getGroupUnderUnits(this.groupId, "query");
    },
    viewTeamMembers(item, team) {
      //查看team下面的成员
      this.dialogOfMember = true;
      team.teamId
        ? (this.teamName = team.teamName)
        : (this.teamName = this.selectTeamName);
      let teamId = team.teamId || item.group.selectTeamId;
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
    deleteGroup(item) {
      //删除指定group
      this.$confirm(
        this.$t("alert.alert_delete"),
        this.$t("alert.alert_command"),
        {
          confirmButtonText: this.$t("alert.sure"),
          cancelButtonText: this.$t("alert.cancel"),
          type: "warning"
        }
      ).then(() => {
        this.$Geting(this.$api.deleteUnitGroup, {
          groupId: item.group.groupId
        }).then(res => {
          if (res.code == 0) {
            this.$notify.success({
              title: this.$t("alert.alert_success_title"),
              message: this.$t("alert.alert_success_delete_title")
            });
            this.refreshGroup();
          } else {
            this.$notify.error({
              title: this.$t("alert.fail"),
              message: this.$t("alert.alert_fail_delete_title")
            });
          }
        });
      });
    },
    refreshGroup() {
      //刷新group数据
      this.getUnitAccessListData();
      this.cancelGroupAddData();
    },
    updateGroup(item) {
      //修改或者添加group
      this.$Posting(this.$api.saveUnitGroup, {
        groupId: item.group.groupId,
        groupName: this.groupName,
        accessStatus: this.accessStatus,
        showSold: this.showSold,
        projectId: this.id
      }).then(res => {
        if (res.code == 0) {
          this.$notify.success({
            title: this.$t("alert.alert_success_title"),
            message: this.$t("alert.operate_success_title")
          });
          this.refreshGroup();
        } else {
          this.$notify.error({
            title: "fail",
            message: res.msg
          });
          return false;
        }
      });
    },
    DeleteAll() {
      this.$confirm(this.$t("alert.alert_delete"), "Delete All Unit?", {
        confirmButtonText: this.$t("alert.sure"),
        cancelButtonText: this.$t("alert.cancel"),
        type: "warning"
      }).then(() => {
        this.$Geting(this.$api.deleteAllUnit, {
          projectId: this.id
        }).then(res => {
          if (res.code == 0) {
            this.$notify.success({
              title: this.$t("alert.alert_success_title"),
              message: this.$t("alert.alert_success_delete_title")
            });
            this.getUnitListData();
          } else {
            this.$notify.error({
              title: this.$t("alert.fail"),
              message: this.$t("alert.alert_fail_delete_title")
            });
          }
        });
      });
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
        this.$Geting(this.$api.deleteUnitGroupTeam, {
          groupId: item.group.groupId,
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
    insertTeamToGroup(item) {
      //将指定team关联到指定的group
      let groupId = item.group.groupId || -1;
      this.$Posting(this.$api.insertUnitGroupTeam, {
        groupId: groupId,
        teamId: item.group.selectTeamId
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
    addTeam(item) {
      //添加team
      item.teams.unshift({});
      item.group.isAddTeam = false;
      item.group.selectTeamId = "";
      this.getSelectTeam(item);
    },
    cancelTeam(team, i, item) {
      //取消添加team
      //取消team
      if (i == 0) {
        if (team.teamId == undefined) {
          item.teams.shift();
        }
      }
      item.group.isAddTeam = true;
    },
    editGroup(item, k) {
      //编辑group时将对应数据赋值给表单控件
      this.groupInit = k;
      this.accessStatus = item.group.accessStatus;
      this.showSold = item.group.showSold;
      this.groupName = item.group.groupName;
    },
    cancelEditGroup(item, k) {
      //取消编辑group
      if (k == 0) {
        if (item.group.groupId == undefined) {
          this.unitAccessList.shift();
        }
      }
      this.cancelGroupAddData();
    },
    cancelGroupAddData() {
      //取消编辑group时需要重置的数据
      this.groupName = "";
      this.accessStatus = 1;
      this.showSold = 2;
      this.groupInit = -1;
    },
    addGroup() {
      //添加group时往表格最上面插一条数据
      this.unitAccessList.unshift({
        group: {
          accessStatus: 0,
          groupName: "",
          showSold: 0,
          unitNum: 0,
          isAddTeam: true,
          selectTeamList: [],
          selectTeamId: ""
        },
        teams: []
      });
      this.groupInit = 0;
    },
    refreshUnit() {
      //刷新unit list数据
      //刷新unit表格
      this.getUnitListData();
    },
    editUnit(row) {
      //编辑unit数据
      this.priceDialogDetails = Object.assign({}, row);
      this.dialogOfPrice = true;
    },
    updateUnit() {
      //更新单个unit的价格
      let params = {
        unitId: this.priceDialogDetails.unitId,
        price1: this.priceDialogDetails.price1,
        price2: this.priceDialogDetails.price2,
        price3: this.priceDialogDetails.price3,
        price4: this.priceDialogDetails.price4,
        price5: this.priceDialogDetails.price5,
        price6: this.priceDialogDetails.price6,
        price7: this.priceDialogDetails.price7,
        price8: this.priceDialogDetails.price8,
        price9: this.priceDialogDetails.price9,
        price10: this.priceDialogDetails.price10,
        projectId: this.id
      };
      this.$Posting(this.$api.editUnit, params).then(res => {
        if (res.code == 0) {
          this.dialogOfPrice = false;
          this.$notify.success({
            title: this.$t("alert.alert_success_title"),
            message: this.$t("alert.operate_success_title")
          });
          this.getUnitListData();
        } else {
          this.$notify.error({
            title: "fail",
            message: res.msg
          });
          return false;
        }
      });
    },
    uploadUnitsAfter() {
      //unit数据导入后的回调
      this.unitPage.currentPage = 1;
      this.getUnitListData();
    },
    handleUnitSizeChange(val) {
      //unit的分页方法
      this.unitPage.pageSize = val;
      this.unitPage.currentPage = 1;
      this.getUnitListData();
    },
    handleUnitCurrentChange(val) {
      //unit的分页方法
      this.unitPage.currentPage = val;
      this.getUnitListData();
    },
    deleteUnit(row) {
      //删除单个unit
      this.$confirm(
        this.$t("alert.alert_delete"),
        this.$t("alert.alert_command"),
        {
          confirmButtonText: this.$t("alert.sure"),
          cancelButtonText: this.$t("alert.cancel"),
          type: "warning"
        }
      ).then(() => {
        this.$Geting(this.$api.deleteUnit, {
          unitId: row.unitId,
          projectId: this.projectId
        }).then(res => {
          if (res.code == 0) {
            let self = this;
            if (self.unitList.length == 1 && self.unitPage.currentPage !== 1) {
              self.unitPage.currentPage--;
            }
            self.getUnitListData();
          } else {
            this.$notify.error({
              title: this.$t("alert.fail"),
              message: this.$t("alert.alert_fail_delete_title")
            });
          }
        });
      });
    },
    changeCheckbox() {
      //关于上传文件时的勾选条件
      if (this.isChecked) {
        this.uploadUnitParam[1].value = "YES";
      } else {
        this.uploadUnitParam[1].value = "NO";
      }
    },
    exportUnitTransaction() {
      //导出数据
      window.location.href = this.$addDownUrl(this.$api.exportUnitTransaction, {
        projectId: this.id
      });
    },
    exportUnit() {
      //导出数据
      window.location.href = this.$addDownUrl(this.$api.exportUnit, {
        projectId: this.id
      });
    },
    getUnitListData() {
      //获取unit列表数据
      this.$Geting(this.$api.queryUnitList, {
        projectId: this.id,
        pageSize: this.unitPage.pageSize,
        pageNo: this.unitPage.currentPage
      }).then(res => {
        if (res.code == 0) {
          this.unitList = res.datas.lists;
          this.unitPage.count = res.datas.count;
        } else {
          this.$notify.error({
            title: "fail",
            message: res.msg
          });
          return false;
        }
      });
    },
    getUnitAccessListData() {
      //获取unitAccess列表数据
      this.$Geting(this.$api.queryUnitGroupList, {
        projectId: this.id
      }).then(res => {
        if (res.code == 0) {
          let datas = res.datas;
          for (let i = 0; i < datas.length; i++) {
            datas[i].group.isAddTeam = true;
            datas[i].group.selectTeamList = [];
            datas[i].group.selectTeamId = "";
          }
          this.unitAccessList = datas;
        } else {
          this.$notify.error({
            title: "fail",
            message: res.msg
          });
          return false;
        }
      });
    },
    getSelectTeam(item, type = "add") {
      //获取group下面的team列表 add表示未添加的 query表示添加的
      let groupId = item.group.groupId || -1;
      this.$Geting(this.$api.queryUnitGroupTeam, {
        groupId: groupId,
        action: type
      }).then(res => {
        if (res.code == 0) {
          if (type == "add") {
            item.group.selectTeamList = res.datas;
          } else {
            item.teams = res.datas;
            item.group.isAddTeam = true;
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
    getGroupUnderUnits(groupId, type) {
      //获取group下的unit add表示未添加的 query表示添加的
      let params = {
        groupId: groupId,
        action: type,
        projectId: this.id
      };
      if (type == "query") {
        params.pageSize = this.unitManagePage.pageSize;
        params.pageNo = this.unitManagePage.currentPage;
      } else {
        params.pageSize = 10000;
        params.pageNo = 1;
      }
      this.$Geting(this.$api.queryUnitGroupJoin, params).then(res => {
        if (res.code == 0) {
          if (type == "query") {
            this.unitsManageList = res.datas.lists;
            this.unitManagePage.count = res.datas.count;
          } else {
            this.unitsSelectList = res.datas.lists;
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
.units_wrapper {
  .flex {
    display: -webkit-box; /* Chrome 4+, Safari 3.1, iOS Safari 3.2+ */
    display: -moz-box; /* Firefox 17- */
    display: -webkit-flex; /* Chrome 21+, Safari 6.1+, iOS Safari 7+, Opera 15/16 */
    display: -moz-flex; /* Firefox 18+ */
    display: -ms-flexbox; /* IE 10 */
    display: flex; /* Chrome 29+, Firefox 22+, IE 11+, Opera 12.1/17/18, Android 4.4+ */
  }
  background-color: #fff;
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  overflow: hidden;
  overflow-y: auto;
  .units_section {
    padding: 0px 30px 15px;
    border-bottom: 1px solid #dcdfe6;
    border-top: 1px solid #dcdfe6;
    &.update_units_status {
      border-top: none;
    }
  }
  .row_header {
    height: 40px;
    padding: 5px 0;
    .col_text {
      padding: 4px 0;
    }
    .col_button {
      text-align: right;
    }
  }
  .checkbox_one {
    padding: 5px 0 0 30px;
  }
  .unit_tab_content {
    padding: 0 30px;
    .unit_tab {
      margin: 5px 0;
    }
  }
  .page_section {
    text-align: center;
    .el-pagination {
      margin-top: 15px !important;
    }
  }
  .unit_list_header {
    padding-bottom: 5px;
    .el-col {
      &:first-child {
        text-align: left;
      }
      text-align: right;
    }
  }
  .unit_access_list_table {
    .noData {
      padding: 20px;
      text-align: center;
      border: 1px solid #ebeef5;
      border-bottom: none;
    }
    .table {
      position: relative;
      // height: 300px;
      font-size: 12px;
      color: #909399;
      .thead {
        background: rgb(245, 247, 250);
        color: #909399;
        &::after {
          content: "";
          display: table;
          clear: both;
        }
        .th {
          float: left;
          width: 16.66%;
          text-align: center;
          font-size: 12px;
          font-weight: 600;
          padding: 10px 0;
        }
      }
      .tbody {
        // position: absolute;
        // left: 0;
        // right: 0;
        // max-height: 264px;
        border-bottom: 1px solid #ebeef5;
        // overflow-y: auto;
        .tbody_item {
          border-bottom: 1px solid #ebeef5;
          &:last-child {
            border: none;
          }
          .tbody_item_left {
            width: 16.66%;
            border: 1px solid #ebeef5;
            border-top: none;
            border-bottom: none;
            justify-content: center;
            align-items: center;
          }
          .tbody_item_right {
            width: 80%;
            .right_item {
              align-items: center;
              flex-wrap: wrap;
              & > div {
                width: 100%;
                border-right: 1px solid #ebeef5;
                padding: 0;
                border-bottom: 1px solid #ebeef5;
                &:last-child {
                  border-bottom: none;
                }
              }
              &.opration_column {
                text-align: center;
                .opration_column_children {
                  width: 25%;
                  height: 50px;
                  line-height: 50px;
                }
              }
              &.add_column {
                background: rgb(245, 247, 250);
                .add {
                  padding: 4px 0;
                }
                .el-button {
                  &:first-child {
                    margin-left: 20px;
                  }
                }
              }
              &.data_column {
                .data_column_item {
                  padding: 10px 0;
                  & > div {
                    width: 50%;
                    padding: 0 10px;
                  }
                  .data_column_item_left {
                    align-items: center;
                    & > div {
                      width: 50%;
                      &.team_name {
                        color: #000;
                      }
                    }
                  }
                  .data_column_item_right {
                    text-align: right;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  .edit_price_content {
    .header {
      padding-bottom: 15px;
      border-bottom: 1px solid #dcdfe6;
      .name {
        color: #000;
        font-weight: 600;
      }
      .opration {
        text-align: right;
      }
    }
    .form {
      padding: 15px 15px 0 15px;
    }
  }
  .manage_group_content {
    .header {
      text-align: right;
    }
    .select_section_row {
      padding: 10px 0;
      .select_name {
        color: #000;
        text-align: center;
      }
      .select_div {
        .el-select {
          width: 100%;
        }
      }
      .select_btn {
        text-align: center;
      }
    }
  }
}
</style>

