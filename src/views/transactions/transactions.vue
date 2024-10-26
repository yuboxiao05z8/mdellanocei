<template>
  <div class="transactions_list_wrapper">
    <div class="transactions_list transactions_section">
      <el-row class="row_header">
        <el-col :span="24" class="col_text">
          {{$t('transactions.TransactionList')}}
        </el-col>
      </el-row>
      <el-row class="row_filter">
        <el-col :span="10">
          {{$t('transactions.Project')}}：
          <el-select size="mini" v-model="selectProject" @change="getActiveData(true)" value-key="projectId">
            <el-option v-for="(item,k) in projectLists" :label="item.projectName" :value="item" :key="k"></el-option>
          </el-select>
          <!-- <el-button size="mini">{{$t('transactions.BulkDocumentDownload')}}</el-button> -->
        </el-col>
        <el-col :span="14" class="col_button">
          <uploader fileId="transactionsFile" :maxSize="100" :uploadParam="uploadParam" @uploadAfter="uploadAfter" :url="$api.importTransaction" fileType=".xls,.xlsx" :btnText="{select:$t('transactions.SelectFile'),import:$t('transactions.Import')}"></uploader>
          <el-button size="mini" @click="exportData">{{$t('transactions.Export')}}</el-button>
          <el-button size="mini" @click="refreshData">{{$t('transactions.Refresh')}}</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="transactions_list_table transactions_section">
      <el-table :data="transactionsList" border style="width: 100%" :header-cell-style="{'background':'#f5f7fa'}" size="mini">
        <!-- <el-table-column type="selection" width="55">
        </el-table-column> -->
        <el-table-column :label="$t('transactions.SalesRep')" prop="agentName">
        </el-table-column>
        <el-table-column :label="$t('transactions.Unit')" prop="unitName">
        </el-table-column>
        <el-table-column :label="$t('transactions.Status')" prop="purchaseStatus">
        </el-table-column>
        <el-table-column :label="$t('transactions.BuyerName')" prop="buyerName">
        </el-table-column>
        <el-table-column :label="$t('transactions.TransactionPrice')" prop="transactionPrice">
        </el-table-column>
        <el-table-column :label="$t('transactions.Date')" prop="date">
        </el-table-column>
        <el-table-column :label="$t('transactions.Download')">
          <template slot-scope="scope">
            <el-button size="mini" plain @click="downloadFils(scope.row)">{{$t('transactions.Download')}}</el-button>
          </template>
        </el-table-column>
        <el-table-column :label="$t('transactions.Edit')">
          <template slot-scope="scope">
            <el-button size="mini" plain @click="edit(scope.row)">{{$t('transactions.Edit')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page_section" v-if="count">
        <el-pagination background small @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-sizes="[5,10,30,50,100]" :page-size="pageSize" layout="prev, pager, next,sizes,total" :total="count">
        </el-pagination>
      </div>
    </div>
    <!--edit transactions-->
    <el-dialog :title="$t('transactions.Edit')" :visible.sync="dialogVisible" width="900px" class="new_transactions_dialog">
      <el-row class="dialog_row_header">
        <el-col :span="12" class="col_text">
          {{editName}}
        </el-col>
        <el-col :span="12" class="col_button">
          <el-button size="mini" @click="editTransaction"> {{$t('update')}}</el-button>
          <el-button size="mini" @click="dialogVisible = false">{{$t('cancel')}}</el-button>
        </el-col>
      </el-row>
      <div class="dialog_form">
        <el-form :inline="true" size="mini" label-width="180px">
          <el-form-item :label="$t('transactions.TransactionPrice')">
            <el-input v-model="editInfo.transactionPrice"></el-input>
          </el-form-item>
          <el-form-item :label="$t('transactions.OriginalUnitPrice')">
            <el-input v-model="editInfo.originalUnitPrice"></el-input>
          </el-form-item>
          <el-form-item :label="$t('transactions.UnitPrice')">
            <el-input v-model="editInfo.unitPrice"></el-input>
          </el-form-item>
          <el-form-item :label="$t('transactions.Date')">
            <el-date-picker v-model="editInfo.reservedDate" type="date" value-format="yyyy-MM-dd" style="width:163px">
            </el-date-picker>
          </el-form-item>
          <el-form-item :label="$t('transactions.Discount')">
            <el-input v-model="editInfo.discount"></el-input>
          </el-form-item>
          <el-form-item :label="$t('transactions.DepositMode')">
            <el-select v-model="editInfo.method" style="width:163px">
              <el-option :label="$t('transactions.Cheque')" value="Cheque"></el-option>
              <el-option :label="$t('transactions.CreditCard')" value="Credit Card"></el-option>
              <el-option :label="$t('transactions.Cash')" value="Cash"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('transactions.Deposit')">
            <el-input v-model="editInfo.amount"></el-input>
          </el-form-item>
          <el-form-item :label="$t('transactions.Bank')">
            <el-input v-model="editInfo.bankName"></el-input>
          </el-form-item>
          <el-form-item :label="$t('transactions.DepositRefNum')">
            <el-input v-model="editInfo.chequeNo"></el-input>
          </el-form-item>
          <el-form-item :label="$t('transactions.Soldby')">
            <el-select v-model="editInfo.brokeName" style="width:163px">
              <el-option :label="item.brokeName" :value="item.brokeName" v-for="(item,k) in soldList" :key="k"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('transactions.PriceCode')">
            <el-select v-model="editInfo.priceCode" style="width:163px">
              <el-option :label="$t('units.Price1')" value="1"></el-option>
              <el-option :label="$t('units.Price2')" value="2"></el-option>
              <el-option :label="$t('units.Price3')" value="3"></el-option>
              <el-option :label="$t('units.Price4')" value="4"></el-option>
              <el-option :label="$t('units.Price5')" value="5"></el-option>
              <el-option :label="$t('units.Price6')" value="6"></el-option>
              <el-option :label="$t('units.Price7')" value="7"></el-option>
              <el-option :label="$t('units.Price8')" value="8"></el-option>
              <el-option :label="$t('units.Price9')" value="9"></el-option>
              <el-option :label="$t('units.Price10')" value="10"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('transactions.SPASignedDate')">
            <el-date-picker v-model="editInfo.spaSignedDate" type="date" value-format="yyyy-MM-dd" style="width:163px">
            </el-date-picker>
          </el-form-item>
          <template v-if="buyerList.length">
            <el-row v-for="(item,k) in buyerList" :key="k">
              <el-form-item :label="$t('transactions.Buyer')+ (k + 1) +$t('transactions.Name')">
                <el-input v-model="item.buyerName"></el-input>
              </el-form-item>
              <el-form-item :label="$t('transactions.Buyer')+ (k + 1) +$t('transactions.ID')">
                <el-input v-model="item.buyerId" readonly></el-input>
              </el-form-item>
              <el-form-item :label="$t('transactions.Buyer')+ (k + 1) +$t('transactions.Email')">
                <el-input v-model="item.buyerEmail"></el-input>
              </el-form-item>
              <el-form-item :label="$t('transactions.Buyer')+ (k + 1) +$t('transactions.Mobile')">
                <el-input v-model="item.buyerMobile"></el-input>
              </el-form-item>
              <el-form-item :label="$t('transactions.Address')">
                <el-input v-model="item.address"></el-input>
              </el-form-item>
            </el-row>
          </template>
          <el-row>
            <el-col :span="24">
              <el-form-item :label="$t('transactions.Comment')">
                <el-input type="textarea" :rows="4" style="width:520px" v-model="editInfo.comment"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item :label="$t('transactions.CoBroke')">
            <el-checkbox v-model="editInfo.coBroke" false-label="NO" true-label="YES"></el-checkbox>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { baseURL } from '@/InterfaceConfig/env'
import uploader from "@/components/uploader";
export default {
  components: {
    uploader
  },
  data() {
    return {
      uploadParam: [],
      currentPage: 1,
      pageSize: 5,
      count: 0,
      transactionsList: [],
      dialogVisible: false,
      projectLists: [],
      selectProject: "",
      editInfo: {},
      editName: "",
      soldList: [],
      buyerList: []
    };
  },
  mounted() {
    this.getProjectData();
  },
  methods: {
    downloadFils(row) {
      let urlSite = baseURL + this.$api.downLoadTransactionFile + `?id=${row.id}`
      window.location.href = urlSite
    },
    refreshData() {
      this.getActiveData();
    },
    edit(row) {
      this.queryEditInfo(row.id);
      this.editName = row.agentName;
      this.dialogVisible = true;
    },
    getProjectData() {
      this.$Geting(this.$api.queryProject, { pageSize: 10000, pageNo: 1 }).then(
        res => {
          if (res.code == 0) {
            this.projectLists = res.datas.lists;
          } else {
            this.$notify.error({
              title: "fail",
              message: res.msg
            });
            return false;
          }
        }
      );
    },
    getActiveData(isResetPage = false) {
      if (!this.selectProject) return;
      isResetPage && (this.currentPage = 1);
      this.$Geting(this.$api.queryTransaction, {
        projectId: this.selectProject.projectId,
        pageSize: this.pageSize,
        pageNo: this.currentPage
      }).then(res => {
        if (res.code == 0) {
          this.transactionsList = res.datas.lists;
          this.count = res.datas.count;
        } else {
          this.$notify.error({
            title: "fail",
            message: res.msg
          });
          return false;
        }
      });
    },
    exportData() {
      if (!this.selectProject) {
        this.$alertWarn(this.$t("interest.pleasechooseaproject"));
        return;
      } else {
        window.location.href = this.$addDownUrl(this.$api.exportTransaction, {
          projectId: this.selectProject.projectId,
          projectName: this.selectProject.projectName
        });
      }
    },
    uploadAfter() {
      this.getActiveData(true);
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getActiveData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getActiveData();
    },
    editTransaction() {
      for (let key in this.editInfo) {
        if (key == "buyerList" || key == "soldby") {
          delete this.editInfo[key];
        }
      }
      this.$Posting(this.$api.editTransaction, {
        transaction: JSON.stringify(this.editInfo),
        buyerArr: JSON.stringify(this.buyerList)
      }).then(res => {
        if (res.code == 0) {
          this.dialogVisible = false;
        } else {
          this.$notify.error({
            title: "fail",
            message: res.msg
          });
          return false;
        }
      });
    },
    queryEditInfo(id) {
      this.$Geting(this.$api.queryEditInfo, {
        id: id
      }).then(res => {
        if (res.code == 0) {
          this.editInfo = res.datas;
          this.soldList = res.datas.soldby;
          this.buyerList = res.datas.buyerList;
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
  watch: {
    selectProject(now) {
      if (now) {
        this.uploadParam = [{ name: "projectId", value: now.projectId }];
      }
    }
  }
};
</script>
<style lang="less">
.transactions_list_wrapper {
  background-color: #fff;
  height: 100%;
  position: relative;
  overflow: hidden;
  .transactions_section {
    padding: 0px 30px 15px;
    .row_header {
      border-bottom: 1px solid #dcdfe6;
    }
    .row_filter {
      border-bottom: 1px solid #dcdfe6;
    }
    &.transactions_list_table {
      padding-top: 15px;
      position: absolute;
      top: 120px;
      bottom: 0;
      left: 0;
      right: 0;
      overflow-y: auto;
    }
    &.transactions_list {
      padding-bottom: 0;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 60px;
    }
  }
  .row_header,
  .row_filter {
    height: 62px;
    padding: 15px 0;
    .col_text {
      padding: 4px 0;
    }
    .col_button {
      text-align: right;
    }
  }
  .page_section {
    text-align: center;
  }
  .new_transactions_dialog {
    .el-dialog {
      .el-dialog__body {
        padding-top: 0;
        padding-bottom: 0;
      }
    }
    .dialog_row_header {
      height: 62px;
      padding: 15px 0;
      border-top: 1px solid #dcdfe6;
      border-bottom: 1px solid #dcdfe6;
      .col_text {
        padding: 4px 0;
      }
      .col_button {
        text-align: right;
      }
    }
    .dialog_form {
      padding: 18px 0;
    }
  }
}
</style>






