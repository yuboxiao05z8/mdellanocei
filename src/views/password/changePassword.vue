<template>
  <div class="password_wrapper">
    <div class="password_form">
      <el-form class='demo-ruleForm' size="small" label-position="top">
        <div class="form_section">
          <el-form-item label="Old Password">
            <el-input class='form_input_375' v-model="oldPass" type="password" placeholder="Password length should not be less than 6"></el-input>
          </el-form-item>
          <el-form-item label="New Password">
            <el-input class='form_input_375' v-model="newPass" type="password" placeholder="Password length should not be less than 6"></el-input>
          </el-form-item>
          <el-form-item label="Confirm New Password">
            <el-input class='form_input_375' v-model="confirmPass" type="password" placeholder="Password length should not be less than 6"></el-input>
          </el-form-item>
        </div>
        <div class="submit_form">
          <el-button type="primary" size="medium" @click='submitForm'>Change Password</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  data() {
    return {
      oldPass: "",
      newPass: "",
      confirmPass: ""
    };
  },
  methods: {
    ...mapActions({ clearRoutes: 'permission/clearRoutes' }),
    //修改密码
    submitForm() {
      if (!this.oldPass || this.oldPass.length < 6) {
        this.$alertWarn("The old password format is incorrect");
      } else if (!this.newPass || this.newPass.length < 6) {
        this.$alertWarn("The new password format is incorrect");
      } else if (this.confirmPass !== this.newPass) {
        this.$alertWarn("Two inconsistent passwords");
      } else {
        this.$Geting(this.$api.ChangePassword, {
          oldPassword: this.oldPass,
          newPassword: this.newPass
        }).then(res => {
          if (res.code == 0) {
            this.$notify.success({
              title: this.$t("alert.alert_success_title"),
              message: this.$t("alert.operate_success_title")
            })
            sessionStorage.clear()
            this.clearRoutes()
            this.$router.replace({ path: '/login' })
          } else {
            this.$notify.error({
              title: this.$t("alert.fail"),
              message: this.$t("alert.operate_fail_title")
            });
          }
        });
      }
    }
  }
};
</script>
<style lang="less" scoped>
.password_wrapper {
  .password_header {
    margin: 15px 0;
    padding: 15px;
    background-color: #fff;
  }
  .form_section {
    padding: 18px 0 1px 20px;
    background-color: #fff;
    margin-bottom: 2px;
    .form_input_375 {
      width: 375px;
    }
  }
  .submit_form {
    background-color: #fff;
    padding: 20px;
  }
}
</style>


