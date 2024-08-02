<template>
  <div class="commission">
    <el-tabs type="border-card" class="tabContent">
      <el-tab-pane class="segmentationDiv" :label="$t('settings.commission')">
        <div class="commission_tab_content">
          <div class="commission_tab_head">
            <span class="commission_tab_head_span">{{$t('commission.deadCommission')}}</span>
            <div class="commission_tab_head_btn">
              <el-button
                size="mini"
                @click="addBrokeLists"
                :disabled="isUpdataDisabled || self == 0"
              >{{$t('settings.addOtherSellingEntity')}}</el-button>
              <el-button
                :disabled="self == 0"
                size="mini"
                @click="refresh"
              >{{$t('settings.refresh')}}</el-button>
            </div>
          </div>

          <div class="commission_tab_body">
            <el-table
              :data="brokeOfProjectList"
              border
              style="width: 100%"
              :header-cell-style="{'background':'#f5f7fa'}"
              size="mini"
              height="400"
            >
              <el-table-column :label="$t('settings.name')">
                <template slot-scope="scope">
                  <el-select
                    v-if="scope.$index === tableDataInit && isEdit"
                    v-model="editBrokeId"
                    filterable
                    :placeholder="$t('commission.pleaseSelect')"
                  >
                    <el-option
                      v-for="item in noBrokeOfProjectList"
                      :key="item.brokeId"
                      :label="item.brokeName"
                      :value="item.brokeId"
                    ></el-option>
                  </el-select>
                  <div v-else>{{scope.row.brokeName}}</div>
                </template>
              </el-table-column>
              <el-table-column :label="$t('settings.commission')">
                <template slot-scope="scope">
                  <el-input v-if="scope.$index === tableDataInit" v-model.trim="defaultCommission"></el-input>
                  <div v-else>{{scope.row.defaultCommission}}</div>
                </template>
              </el-table-column>
              <!-- <el-table-column label="Proportion">
                <template slot-scope="scope">
                  <el-input type="Number" v-if="scope.$index === tableDataInit" v-model.trim="commissionNum"></el-input>
                  <div v-else>{{scope.row.commissionNum}}</div>
                </template>
              </el-table-column> -->
              <el-table-column :label="$t('settings.setting')">
                <template slot-scope="scope">
                  <template v-if="scope.$index === tableDataInit">
                    <el-button
                      size="mini"
                      :disabled="self == 0"
                      plain
                      @click="update(scope.row)"
                    >{{$t('update')}}</el-button>
                    <el-button
                      size="mini"
                      plain
                      :disabled="self == 0"
                      @click="cancel(scope.row,scope.$index)"
                    >{{$t('cancel')}}</el-button>
                  </template>
                  <template v-else>
                    <el-button
                      size="mini"
                      plain
                      :disabled="self == 0"
                      @click="edit(scope.row,scope.$index)"
                    >{{$t('otherSellingEntities.edit')}}</el-button>
                    <el-button
                      size="mini"
                      plain
                      :disabled="self == 0"
                      @click="deleteData(scope.row)"
                    >{{$t('otherSellingEntities.delete')}}</el-button>
                  </template>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="commission_tab_content">
          <div class="commission_tab_head">
            <span class="commission_tab_head_span">{{$t('commission.timingCommission')}}</span>
          </div>
          <div class="commission_tab_input">
            <el-row>
              <el-col :span="8">
                <span>{{$t('commission.commissionRate')}}</span>
                <el-input class v-model="TimingOfCommission"></el-input>
              </el-col>
              <el-col :span="16">
                <span>{{$t('commission.selectionTime')}}</span>
                <el-date-picker
                  style="width:70%"
                  v-model="settingTime"
                  unlink-panels
                  type="daterange"
                  range-separator="to"
                  value-format="timestamp"
                  :start-placeholder="$t('commission.startTime')"
                  :end-placeholder="$t('commission.endTime')"
                ></el-date-picker>
              </el-col>
            </el-row>
          </div>
          <div>
            <el-table
              ref="multipleTable"
              :data="brokeOfProjectList"
              tooltip-effect="dark"
              border
              style="width: 100%"
              class="TimingOfCommissionTab"
              :header-cell-style="{'background':'#f5f7fa'}"
              size="mini"
              height="400"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection"></el-table-column>
              <el-table-column :label="$t('commission.company')">
                <template slot-scope="scope">{{ scope.row.brokeName }}</template>
              </el-table-column>
            </el-table>
            <div class="commissionBomBtn" style="margin-top: 20px">
              <el-button
                :disabled="self == 0"
                @click="updateTimingOfCommission()"
              >{{$t('commission.updata')}}</el-button>
            </div>
          </div>
        </div>
      </el-tab-pane>

      <!-- 折扣 -->
      <el-tab-pane class="segmentationDiv paddingSegmentationDiv" :label="$t('settings.discount')">
        <div class="commission_tab_head">
          <span class="commission_tab_head_span">{{$t('settings.discount')}}</span>
          <div class="commission_tab_head_btn">
            <el-button
              size="mini"
              @click="addDiscount"
              :disabled="isDiscountDisabled || self == 0"
            >{{$t('discount.AddDiscount')}}</el-button>
            <el-button
              :disabled="self == 0"
              size="mini"
              @click="discountRefresh"
            >{{$t('settings.refresh')}}</el-button>
          </div>
          <div>
            <el-table
              :data="ProjectDiscountList"
              border
              style="width: 100%"
              :header-cell-style="{'background':'#f5f7fa'}"
              size="mini"
            >
              <el-table-column :label="$t('discount.discountName')">
                <template slot-scope="scope">
                  <el-input v-if="scope.$index === discountIndex" v-model.trim="discountName"></el-input>
                  <div v-else>{{scope.row.discountName}}</div>
                </template>
              </el-table-column>
              <el-table-column :label="$t('discount.describe')">
                <template slot-scope="scope">
                  <el-input v-if="scope.$index === discountIndex" v-model.trim="discountDescribe"></el-input>
                  <div v-else>{{scope.row.remark}}</div>
                </template>
              </el-table-column>
              <el-table-column :label="$t('discount.Absolute')">
                <template slot-scope="scope">
                  <el-input v-if="scope.$index === discountIndex" v-model.trim="discount"></el-input>
                  <div v-else>{{scope.row.discount}}</div>
                </template>
              </el-table-column>
              <el-table-column width="450" :label="$t('discount.startAndEndDate')">
                <template slot-scope="scope">
                  <el-date-picker
                    style="width:100%"
                    v-if="scope.$index === discountIndex"
                    v-model="discountDate"
                    type="daterange"
                    range-separator="To"
                    unlink-panels
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :start-placeholder="$t('commission.startTime')"
                    :end-placeholder="$t('commission.endTime')"
                  ></el-date-picker>
                  <div v-else>{{scope.row.startDate}}~{{scope.row.endDate}}</div>
                </template>
              </el-table-column>
              <el-table-column :label="$t('discount.setting')">
                <template slot-scope="scope">
                  <template v-if="scope.$index === discountIndex">
                    <el-button
                      :disabled="self == 0"
                      size="mini"
                      plain
                      @click="discountUpdate(scope.row)"
                    >{{$t('update')}}</el-button>
                    <el-button
                      size="mini"
                      plain
                      :disabled="self == 0"
                      @click="discountCancel(scope.row,scope.$index)"
                    >{{$t('cancel')}}</el-button>
                  </template>
                  <template v-else>
                    <el-button
                      size="mini"
                      plain
                      :disabled="self == 0"
                      @click="discountEdit(scope.row,scope.$index)"
                    >{{$t('otherSellingEntities.edit')}}</el-button>
                    <el-button
                      size="mini"
                      plain
                      :disabled="self == 0"
                      @click="discountDeleteData(scope.row)"
                    >{{$t('otherSellingEntities.delete')}}</el-button>
                  </template>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-tab-pane>

      <!-- 付款 -->
      <el-tab-pane class="segmentationDiv paddingSegmentationDiv" :label="$t('settings.payment')">
        <div class="commission_tab_head">
          <span class="commission_tab_head_span">{{$t('settings.payment')}}</span>
          <div class="commission_tab_head_btn">
            <el-button
              size="mini"
              @click="addPay"
              :disabled="isPayDisabled || self == 0"
            >{{$t('discount.addPaymentMethod')}}</el-button>
            <el-button size="mini" @click="PayRefresh">{{$t('settings.refresh')}}</el-button>
          </div>
          <div>
            <el-table
              :data="paymentMethodList"
              border
              style="width: 100%"
              :header-cell-style="{'background':'#f5f7fa'}"
              size="mini"
            >
              <el-table-column :label="$t('discount.discountName')">
                <template slot-scope="scope">
                  <el-input v-if="scope.$index === payIndex" v-model.trim="payName"></el-input>
                  <div v-else>{{scope.row.payName}}</div>
                </template>
              </el-table-column>
              <el-table-column :label="$t('discount.describe')">
                <template slot-scope="scope">
                  <el-input v-if="scope.$index === payIndex" v-model.trim="remark"></el-input>
                  <div v-else>{{scope.row.remark}}</div>
                </template>
              </el-table-column>
              <el-table-column width="450" :label="$t('discount.startAndEndDate')">
                <template slot-scope="scope">
                  <el-date-picker
                    style="width:100%"
                    v-if="scope.$index === payIndex"
                    v-model="payDate"
                    type="daterange"
                    range-separator="To"
                    unlink-panels
                    value-format="timestamp"
                    :start-placeholder="$t('commission.startTime')"
                    :end-placeholder="$t('commission.endTime')"
                  ></el-date-picker>
                  <div
                    v-else
                  >{{$dateFormat(scope.row.startTime)}}~{{$dateFormat(scope.row.endTime)}}</div>
                </template>
              </el-table-column>
              <el-table-column :label="$t('discount.setting')">
                <template slot-scope="scope">
                  <template v-if="scope.$index === payIndex">
                    <el-button
                      size="mini"
                      :disabled="self == 0"
                      plain
                      @click="payUpdate(scope.row)"
                    >{{$t('update')}}</el-button>
                    <el-button
                      size="mini"
                      plain
                      :disabled="self == 0"
                      @click="payCancel(scope.row,scope.$index)"
                    >{{$t('cancel')}}</el-button>
                  </template>
                  <template v-else>
                    <el-button
                      size="mini"
                      plain
                      :disabled="self == 0"
                      @click="payEdit(scope.row,scope.$index)"
                    >{{$t('otherSellingEntities.edit')}}</el-button>
                    <el-button
                      size="mini"
                      plain
                      :disabled="self == 0"
                      @click="payDeleteData(scope.row)"
                    >{{$t('otherSellingEntities.delete')}}</el-button>
                  </template>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { cpus } from "os";
export default {
  data() {
    return {
      id: JSON.parse(sessionStorage.getItem("projectDesc") || "{}").id || "",
      self: JSON.parse(sessionStorage.getItem("projectDesc")).self,
      tableDataInit: -1,
      brokeList: [], //经纪公司列表
      noBrokeOfProjectList: [], // 未关联经纪公司
      brokeOfProjectList: [], //项目关联的经纪公司列表
      checkedBrokes: [], //选中的经纪公司
      brokeOfProjectNum: 0,
      editBrokeId: "",
      defaultCommission: "",
      commissionListId: "",
      isEdit: false,
      isUpdataDisabled: false,
      TimingOfCommission: "",
      settingTime: [],
      multipleSelection: [],

      // 折扣
      ProjectDiscountList: [], // 折扣列表
      discountIndex: -1,
      discount: "", // 折扣
      discountName: "", // 折扣名字
      discountDescribe: "", // 折扣描述
      discountDate: [], // 折扣时间
      discountId: "", // 折扣编辑ID
      isDiscountDisabled: false,
      // commissionNum: "",

      // 付款
      paymentMethodList: [], // 付款方式列表
      payIndex: -1,
      payId: "",
      payName: "",
      remark: "",
      payDate: [],
      isPayDisabled: false
    };
  },
  mounted() {
    if (this.id) {
      this.getProjectOfBrokeLists("query");
      this.getProjectOfBrokeLists("add");
      this.queryProjectDiscount();
      this.queryPayment();
    }
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    updateTimingOfCommission() {
      if (this.TimingOfCommission == "") {
        this.$notify.error({
          title: "fail",
          message: this.$t("commission.RegularCommission")
        });
        return;
      }
      if (this.settingTime.length < 2) {
        this.$notify.error({
          title: "fail",
          message: this.$t("commission.PleaseSelectTheTime")
        });
        return;
      }
      if (this.multipleSelection.length < 1) {
        this.$notify.error({
          title: "fail",
          message: this.$t("commission.PleaseSelectCompany")
        });
        return;
      }
      let startDate = this.settingTime[0];
      let endDate = this.settingTime[1];
      let editBrokeIds = [];
      editBrokeIds = this.multipleSelection.map(item => {
        return item.brokeId;
      });
      let data = {
        editBrokeIds: editBrokeIds.join(","),
        projectId: this.id,
        timingCommission: this.TimingOfCommission,
        startDate: startDate,
        endDate: endDate
      };
      this.$Post(this.$api.saveTimingCommission, data).then(res => {
        if (res.code == 0) {
          this.getProjectOfBrokeLists("query");
          this.$notify.success({
            title: this.$t("alert.alert_success_title"),
            message: this.$t("commission.setupCompleted")
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
    addBrokeLists() {
      // 添加关联公司设计佣金
      this.isEdit = true;
      this.isUpdataDisabled = true;
      this.brokeOfProjectList.unshift({});
      this.tableDataInit = 0;
    },
    cancel() {
      this.tableDataInit = -1;
    },
    edit(row, index) {
      this.isEdit = false;
      this.editBrokeId = row.brokeId;
      console.log(row, "1232");
      this.defaultCommission = row.defaultCommission;
      // this.commissionNum = row.commissionNum
      if (row.id) {
        this.commissionListId = row.id;
      }
      this.tableDataInit = index;
    },
    update() {
      this.$Posting(this.$api.saveProjectCompany, {
        projectId: this.id,
        editBrokeId: this.editBrokeId,
        defaultCommission: this.defaultCommission,
        // commissionNum: this.commissionNum,
        id: this.commissionListId
      }).then(res => {
        if (res.code == 0) {
          this.$notify.success({
            title: this.$t("alert.alert_success_title"),
            message: this.$t("alert.operate_success_title")
          });
          this.tableDataInit = -1;
          this.getProjectOfBrokeLists("query");
          this.getProjectOfBrokeLists("add");
          this.isUpdataDisabled = false;
          this.editBrokeId = "";
          this.defaultCommission = "";
          this.commissionListId = "";
          // this.commissionNum  = ''
        } else {
          this.$notify.error({
            title: "fail",
            message: res.msg
          });
          return false;
        }
      });
    },
    getProjectOfBrokeLists(type) {
      //查询项目下经纪公司列表
      let _this = this;
      this.$Posting(this.$api.queryProjectCompany, {
        projectId: this.id,
        action: type,
        pageNo: 1,
        pageSize: 10000
      }).then(res => {
        if (res.code == 0) {
          if (type == "query") {
            this.brokeOfProjectList = res.datas.lists;
            this.brokeOfProjectNum = res.datas.count;
            let activeList = res.datas.lists.filter(
              item => item.timingCommission !== ""
            );
            this.$nextTick(function() {
              activeList.forEach(row => {
                _this.$refs.multipleTable.toggleRowSelection(row);
              });
            });
            if (this.brokeOfProjectList.length > 0) {
              if (
                this.brokeOfProjectList[0].timingCommission &&
                this.brokeOfProjectList[0].startDate &&
                this.brokeOfProjectList[0].endDate
              ) {
                this.TimingOfCommission = this.brokeOfProjectList[0].timingCommission;
                this.settingTime = [
                  this.brokeOfProjectList[0].startDate,
                  this.brokeOfProjectList[0].endDate
                ];
              }
            }
          } else {
            this.noBrokeOfProjectList = res.datas.lists;
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
    deleteData(row) {
      //删除
      console.log(row);
      this.$confirm(
        this.$t("alert.alert_delete"),
        this.$t("alert.alert_command"),
        {
          confirmButtonText: this.$t("alert.sure"),
          cancelButtonText: this.$t("alert.cancel"),
          type: "warning"
        }
      ).then(() => {
        this.$Posting(this.$api.deleteProjectCompany, {
          id: row.id,
          projectId: this.id
          // editBrokeId: row.brokeId
        }).then(res => {
          if (res.code == 0) {
            this.$notify.success({
              title: this.$t("alert.alert_success_title"),
              message: this.$t("alert.alert_success_delete_title")
            });
            this.cancel();
            this.getProjectOfBrokeLists("query");
            this.getProjectOfBrokeLists("add");
          } else {
            this.$notify.error({
              title: this.$t("alert.fail"),
              message: this.$t("alert.alert_fail_delete_title")
            });
          }
        });
      });
    },
    refresh() {
      this.tableDataInit = -1;
      this.checkedBrokes = [];
      this.isUpdataDisabled = false;
      this.editBrokeId = "";
      this.defaultCommission = "";
      // this.commissionNum = ""
      this.commissionListId = "";
      this.getProjectOfBrokeLists("query");
      this.getProjectOfBrokeLists("add");
    },

    // 折扣方法 //
    discountRefresh() {
      // 刷新
      this.discount = "";
      this.discountName = "";
      this.discountDate = [];
      this.discountId = "";
      this.discountDescribe = "";
      this.isDiscountDisabled = false;
      this.queryProjectDiscount();
    },
    queryProjectDiscount() {
      // 折扣列表
      this.$Geting(this.$api.queryProjectDiscount, {
        projectId: this.id,
        pageNo: 1,
        pageSize: 1000
      }).then(res => {
        if (res.code == 0) {
          this.ProjectDiscountList = res.datas.lists;
        }
      });
    },
    addDiscount() {
      // 添加
      this.isDiscountDisabled = true;
      this.ProjectDiscountList.unshift({});
      this.discountIndex = 0;
    },
    discountUpdate(row) {
      // 保存
      let data = {
        projectId: this.id,
        discount: this.discount,
        id: this.discountId,
        discountName: this.discountName,
        remark: this.discountDescribe,
        startDate: this.discountDate[0],
        endDate: this.discountDate[1]
      };
      this.$Post(this.$api.saveProjectDiscount, data).then(res => {
        if (res.code == 0) {
          this.queryProjectDiscount();
          this.discountCancel();
          this.discount = "";
          this.discountName = "";
          this.discountDate = [];
          this.discountId = "";
          this.discountDescribe = "";
          this.isDiscountDisabled = false;
          this.$notify.success({
            title: this.$t("alert.alert_success_title"),
            message: this.$t("alert.alert_success_title")
          });
        } else {
          this.$notify.error({
            title: this.$t("alert.fail"),
            message: res.msg
          });
        }
      });
    },
    discountCancel() {
      // 取消
      this.discountIndex = -1;
    },
    discountEdit(row, index) {
      // 编辑
      this.discount = row.discount;
      this.discountName = row.discountName;
      this.discountDate = [row.startDate, row.endDate];
      if (row.id) {
        this.discountId = row.id;
      }
      this.discountDescribe = row.remark;
      this.discountIndex = index;
    },
    discountDeleteData(row) {
      // 删除
      this.$Get(this.$api.deleteProjectDiscount, {
        projectId: this.id,
        id: row.id
      }).then(res => {
        if (res.code == 0) {
          this.$notify.success({
            title: this.$t("alert.alert_success_title"),
            message: this.$t("alert.alert_success_delete_title")
          });
          this.queryProjectDiscount();
        } else {
          this.$notify.error({
            title: this.$t("alert.fail"),
            message: res.msg
          });
        }
      });
    },

    // 付款方式
    PayRefresh() {
      this.payId = "";
      this.payName = "";
      this.payDate = [];
      this.remark = "";
      this.isPayDisabled = false;
      this.queryPayment();
    },
    queryPayment() {
      this.$Geting(this.$api.queryPayment, { projectId: this.id }).then(res => {
        if (res.code == 0) {
          this.paymentMethodList = res.datas.lists;
          console.log(this.paymentMethodList);
        }
      });
    },
    addPay() {
      this.isPayDisabled = true;
      this.paymentMethodList.unshift({});
      this.payIndex = 0;
    },
    payUpdate() {
      let data = {
        projectId: this.id,
        payId: this.payId,
        startTime: this.payDate[0],
        endTime: this.payDate[1],
        remark: this.remark,
        payName: this.payName
      };
      this.$Post(this.$api.savePayment, data).then(res => {
        if (res.code == 0) {
          this.queryPayment();
          this.payCancel();
          (this.payId = ""),
            (this.payDate = []),
            (this.remark = ""),
            (this.payName = "");
          this.isPayDisabled = false;
          this.$notify.success({
            title: this.$t("alert.alert_success_title"),
            message: this.$t("alert.alert_success_title")
          });
        } else {
          this.$notify.error({
            title: this.$t("alert.fail"),
            message: res.msg
          });
        }
      });
    },
    payCancel() {
      this.payIndex = -1;
    },
    payEdit(row, index) {
      this.remark = row.remark;
      this.payName = row.payName;
      this.payDate = [row.startTime, row.endTime];
      if (row.payId) {
        this.payId = row.payId;
      }
      this.payIndex = index;
    },
    payDeleteData(row) {
      this.$Post(this.$api.deletePayment, { payId: row.payId }).then(res => {
        if (res.code == 0) {
          this.$notify.success({
            title: this.$t("alert.alert_success_title"),
            message: this.$t("alert.alert_success_delete_title")
          });
          this.queryPayment();
        } else {
          this.$notify.error({
            title: this.$t("alert.fail"),
            message: res.msg
          });
        }
      });
    }
  }
};
</script>

<style lang="less">
.commission {
  height: 100%;
  position: relative;
  .TimingOfCommissionTab {
    th .el-checkbox:before {
      content: "";
    }
  }
  .el-tabs--border-card {
    box-shadow: none;
  }
  .tabContent {
    height: 100%;
    .el-tabs__content {
      padding: 0;
      position: absolute;
      top: 40px;
      overflow: hidden;
      bottom: 0;
      left: 0;
      right: 0;
      .segmentationDiv {
        height: 100%;
        width: 100%;
        overflow-y: scroll;
      }
      .paddingSegmentationDiv {
        padding: 20px;
        padding-top: 0;
        .el-date-editor .el-range-separator {
          width: 10%;
        }
        .commission_tab_head {
          height: 50px;
          line-height: 50px;
          .commission_tab_head_span {
            float: left;
          }
          .commission_tab_head_btn {
            float: right;
          }
        }
      }
      .el-tab-pane {
        .commission_tab_content {
          margin: 20px;
          position: relative;
          padding: 15px;
          border: 1px solid #ddd;
          .commission_tab_head {
            height: 50px;
            line-height: 50px;
            .commission_tab_head_span {
              float: left;
            }
            .commission_tab_head_btn {
              float: right;
            }
          }
          .commission_tab_input {
            .el-input {
              width: 60%;
            }
            margin-bottom: 15px;
          }
          .commission_tab_body {
            width: 100%;
          }
          .commissionBomBtn {
            text-align: center;
          }
        }
      }
    }
  }
}
</style>