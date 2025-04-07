<template>
  <div id="login" @keyup.enter="goToHome('formInline')">
    <el-container>
      <el-header class="clearfix">
        <div class="div_1200" style=" background: #409eff;">
          <div class="log">{{ $t("login.title") }}</div>

          <div class="nav_head">
            <span @click="toWebsite">{{ $t("login.website") }}</span>
            <span @click="appDown">{{ $t("login.app") }}</span>
          </div>
        </div>
      </el-header>
      <el-main class="login_body clearfix">
        <div class="div_1200">
          <div class="publicity_img"></div>
          <div class="login_form">
            <el-form ref="formInline" :rules="rules" :model="formInline" class="demo-form-inline">
              <el-form-item prop="user">
                <el-input
                  :placeholder="$t('login.input_phone')"
                  type="text"
                  v-model="formInline.user"
                >
                  <i slot="prefix" class="el-input__icon el-icon-search log_id"></i>
                </el-input>
              </el-form-item>
              <el-form-item prop="pwd">
                <el-input
                  :placeholder="$t('login.input_passwords')"
                  type="password"
                  v-model="formInline.pwd"
                >
                  <i slot="prefix" class="el-input__icon el-icon-search log_passwod"></i>
                </el-input>
              </el-form-item>
            </el-form>
            <el-button
              class="logBtn"
              size="medium"
              type="primary"
              @click="goToHome('formInline')"
            >{{ $t("login.login") }}</el-button>
          </div>
        </div>
      </el-main>
      <el-footer style="height:100px;">
        <div class="div_1200 clearfix" style=" background: #409eff;">
          <div class="footer_lf">
            <h1>{{$t('footer.mixgo')}}</h1>
            <p>{{$t('footer.desc1')}}</p>
            <p>{{$t('footer.desc2')}}</p>
            <p>{{$t('footer.desc3')}}</p>
          </div>
          <!-- <div class="footer_rt">
            <h1>F</h1>
            <p>{{$t('footer.desc4')}}</p>
          </div>-->
        </div>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'login',
  data() {
    return {
      formInline: {
        user: '',
        pwd: ''
      },
      rules: {
        user: [
          {
            required: true,
            message: this.$t('login.verificate_phone'),
            trigger: 'blur'
          }
        ],
        pwd: [
          {
            required: true,
            message: this.$t('login.verificate_pass'),
            trigger: 'blur'
          }
        ]
      }
    }
  },
  mounted() {},
  methods: {
    goToHome(formName) {
      let selt = this
      this.$refs[formName].validate(valid => {
        if (valid) {
          let userInfo = JSON.parse(window.sessionStorage.getItem('userInfo') || '{}')
          userInfo.email = selt.formInline.user
          userInfo.source = 'manager'
          userInfo.password = selt.formInline.pwd
          let str = ''
          for (const key in selt.$objKeySort(userInfo)) {
            str += selt.$objKeySort(userInfo)[key]
          }
          console.log(str + 'c1d65f3667324592a071ebec5038f38c')
          let signature = this.$md5(str + 'c1d65f3667324592a071ebec5038f38c')
          this.$Post(this.$api.login, {
            email: this.formInline.user,
            password: this.formInline.pwd,
            signature: signature
          }).then(res => {
            if (res.code === '0') {
              let userInfo = res
              sessionStorage.setItem('userInfo', JSON.stringify(userInfo.datas))
              sessionStorage.setItem('serveUrl', res.url)
              sessionStorage.setItem('logInSign', '1')
              this.$router.push('/dashboard')
            } else {
              this.$notify.error({
                title: 'fail',
                message: res.msg
              })
            }
          })
        } else {
          this.$notify.error({
            title: 'fail',
            message: this.$t('login.verificate_account_pass')
          })
          return false
        }
      })
    },
    toWebsite() {
      window.open('http://www.mixgo.com')
    },
    appDown() {
      window.open('https://itunes.apple.com/cn/app/id1174747257?mt=8')
    }
  }
}
</script>

<style lang="less" >
#login {
  height: 100%;
  min-height: 500px;
  position: relative;
  .logBtn {
    margin-top: 50px;
    width: 100%;
  }
  input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0px 1000px white inset;
  }
}
.div_1200 {
  width: 1200px;
  height: 100%;
  margin: 0 auto;
  position: relative;
}
.login_body {
  position: absolute;
  top: 60px;
  bottom: 100px;
  background: url(../../assets/images/img/log_bg.jpg) no-repeat 0 0;
  background-size: cover;
  width: 100%;
  min-width: 1220px;
  overflow: hidden;
  .publicity_img {
    position: absolute;
    top: 50%;
    margin-top: -150px;
    width: 600px;
    height: 300px;
    background: url(../../assets/images/img/bgImg.png) no-repeat 0 0;
    background-size: 100% 100%;
  }
  .login_form {
    width: 300px;
    height: 400px;
    background: #fff;
    border-radius: 20px;
    position: absolute;
    top: 50%;
    margin-top: -200px;
    right: 100px;
    padding: 50px 20px;
    .el-form-item {
      width: 100%;
      margin-right: 0;
      margin-bottom: 30px;
      .log_id {
        background: url(../../assets/images/icon/id_icon.png) no-repeat 2px 10px;
        background-size: 18px 18px;
        color: #fff;
      }
      .log_passwod {
        background: url(../../assets/images/icon/passwod_icon.png) no-repeat 2px
          10px;
        background-size: 18px 18px;
        color: #fff;
      }
      .log_passwod::before,
      .log_id::before {
        opacity: 0;
      }
      .el-form-item__content {
        width: 100%;
        button {
          width: 100%;
        }
      }
    }
    .form_btn {
      // margin-bottom: 50px;
    }
  }
  .forget_pass {
    float: right;
    padding: 0;
    height: 20px;
    line-height: 20px;
  }
}
.el-header {
  background: #409eff;
  line-height: 60px;
  position: absolute;
  top: 0;
  width: 100%;
}
.el-footer {
  background: #409eff;
  color: #fff;
  // line-height: 60px;
  // text-align: center;
  position: absolute;
  bottom: 0;
  width: 100%;
  .footer_lf {
    float: left;
  }
  .footer_lf,
  .footer_rt {
    margin-top: 10px;
    h1 {
      font-size: 20px;
      color: #fff;
    }
    p {
      font-size: 14px;
      color: #ddd;
    }
  }
  .footer_rt {
    float: right;
  }
}
.log,
.nav_head {
  float: right;
  color: #fff;
}
.log {
  float: left;
  font-size: 22px;
  font-weight: 600;
}
.nav_head {
  span {
    margin-left: 50px;
    cursor: pointer;
  }
}
</style>
