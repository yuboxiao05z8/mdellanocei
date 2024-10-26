<template>
  <div class="new_user_wrapper">
    <div class="head">
      <el-row>
        <el-col :span="24" class="el_col_name">
          <div>
            <span>{{$t('newUser.CreateNewUser')}}</span>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="add_user_content">
      <el-form :model="ruleForm" :rules="rules" label-width="200px" size="small" ref="accountForm">
        <el-form-item :label="$t('newUser.Name')" prop="agentName">
          <el-input v-model="ruleForm.agentName" class="input_width_250px"></el-input>
        </el-form-item>
        <el-form-item :label="$t('newUser.Email')" prop="email">
          <el-input v-model="ruleForm.email" class="input_width_250px"></el-input>
        </el-form-item>
        <el-form-item :label="$t('newUser.Mobile')" prop="mobile">
          <el-input v-model="ruleForm.mobile" class="input_width_250px"></el-input>
        </el-form-item>
        <el-form-item :label="$t('newUser.RefistrationNumber')" prop="refistrationNumber">
          <el-input v-model="ruleForm.refistrationNumber" class="input_width_250px"></el-input>
        </el-form-item>
        <el-form-item :label="$t('newUser.DefaultTeam')" prop="teamId">
          <el-select v-model="ruleForm.teamId" class="input_width_250px">
            <el-option v-for="(v,k) in teamList" :label="v.teamName" :value="v.teamId" :key="k"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('newUser.MultiTerminal')" prop="accountType">
          <el-select v-model="ruleForm.accountType" class="input_width_250px">
            <el-option v-for="(v,k) in accountTypeList" :label="v.name" :value="v.id" :key="k"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('newUser.ExpireDate')">
          <el-row>
            <el-col>
              <el-radio v-model="timeSelect" label="1">{{$t('newUser.SetNumberofMonths')}}</el-radio>
              <el-input v-model="ruleForm.month" class="input_width_250px"></el-input>
            </el-col>
            <el-col class="date_select_day">
              <el-radio v-model="timeSelect" label="2">{{$t('newUser.SetDate')}}</el-radio>
              <el-date-picker
                v-model="ruleForm.date"
                type="date"
                value-format="timestamp"
                format="dd-MMM-yyyy"
                class="input_width_250px"
              ></el-date-picker>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item :label="$t('newUser.SendWelcomeEmail')">
          <el-checkbox v-model="ruleForm.sendEmail" :true-label="'YES'" :false-label="'NO'"></el-checkbox>
        </el-form-item>
        <el-form-item class="btn_form_item">
          <el-button
            type="primary"
            @click="createAccount('accountForm')"
          >{{$t('newUser.CreateAccount')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      ruleForm: {
        agentName: "",
        email: "",
        mobile: "",
        refistrationNumber: "",
        teamId: "",
        month: "",
        date: "",
        sendEmail: "NO",
        accountType: ""
      },
      accountTypeList: [
        {
          name: this.$t('mobileTerminal'),
          id: '1'
        },
        {
          name: this.$t('MultiterminalLogin'),
          id: '3'
        },
      ],
      timeSelect: "",
      teamList: [],
      rules: {
        agentName: [
          {
            required: true,
            message: this.$t("newUser.validateName"),
            trigger: "blur"
          }
        ],
        email: [
          {
            required: true,
            message: this.$t("newUser.validateEmail"),
            trigger: "blur"
          }
        ],
        mobile: [
          {
            required: true,
            message: this.$t("newUser.validatePhone"),
            trigger: "blur"
          }
        ],
        teamId: [
          {
            required: true,
            message: this.$t("newUser.validateTeam"),
            trigger: "blur"
          }
        ],
        accountType: [
          {
            required: true,
            message: this.$t("newUser.validateMulti"),
            trigger: "blur"
          }
        ],
      }
    };
  },
  mounted() {
    this.getDefaultItem();
  },
  methods: {
    createAccount(formName) {
      // console.log(this.ruleForm.date);
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = Object.assign({}, this.ruleForm);
          if (this.timeSelect == "1") {
            params.date = "";
          } else if (this.timeSelect == "2") {
            params.month = "";
          } else {
            params.date = "";
            params.month = "";
          }
          this.$Posting(this.$api.createAccount, params).then(res => {
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
        } else {
          return false;
        }
      });
    },
    getDefaultItem() {
      this.$Geting(this.$api.queryTeamsAll).then(res => {
        if (res.code == 0) {
          this.teamList = res.datas.lists;
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
.new_user_wrapper {
  background-color: #fff;
  height: 100%;
  position: relative;
  overflow: hidden;
  .head {
    height: 62px;
    position: absolute;
    top: 0;
    width: 100%;
    border-bottom: 1px solid #dcdfe6;
    border-top: 1px solid #dcdfe6;
    padding: 15px 30px;
    .el_col_name {
      div {
        padding: 4px 0;
      }
    }
  }
  .add_user_content {
    position: absolute;
    top: 62px;
    bottom: 0;
    left: 0;
    overflow: auto;
    padding: 15px 30px;
    .input_width_250px {
      width: 250px;
    }
    .el-radio__label {
      width: 200px;
      display: inline-block;
    }
    .date_select_day {
      margin-top: 20px;
    }
    .btn_form_item {
      border-top: 1px solid #dcdfe6;
      padding: 20px 0;
    }
  }
}
</style>



