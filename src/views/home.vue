<template lang="html">
  <div id="home" class="home">
    <!-- 主容器 -->
    <el-container class="home_conter">
      <!-- 左侧导航 -->
      <el-aside class="home_conter_nav" width="230px">
        <div class="home_conter_nav_conter">
          <div class="nav_portrait">
            <div class="logo">
              <img v-if="!user.brokeLogo" src="https://img.alicdn.com/tfs/TB13UQpnYGYBuNjy0FoXXciBFXa-242-134.png" width="40">
              <img v-if="user.brokeLogo" :src="serveUrl+user.brokeLogo" width="40">
              <!-- <span class="site-name">MIX GO</span> -->
            </div>
          </div>
          <nav-menu></nav-menu>
        </div>
      </el-aside>
      <!-- 右侧内容 -->
      <el-container class="home_conter_by">
        <!-- 内容头 -->
        <el-header>
          <div class="home_head clearfix">
            <div class="home_head_text">
              {{user.brokeName}} Background Management
            </div>
            <div class="home_head_info">
              <el-dropdown class="clearfix" @command="handleCommand" trigger="click">
                <div class="home_head_info_conter clearfix">
                  <span class="log_head_img">
                  <!-- <img :src="userpic" alt=""> -->
                  </span>
                  <span class="el-dropdown-link">
                    {{user.userName}}<i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                </div>
                <el-dropdown-menu style="margin-top:0" slot="dropdown" >
                  <el-dropdown-item command="b">{{$t('change_password')}}</el-dropdown-item>
                 <el-dropdown-item command="退出">{{$t('login.loginout')}}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
        </el-header>
        <!-- 内容容器 -->
        <el-main>
           <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  components: {
    NavMenu: () => import("@/components/NavMenu.vue") // 左侧导航组件
  },
  data() {
    return {
      // userName:
      //   JSON.parse(window.sessionStorage.getItem("userInfo") || "{}")
      //     .userName || "",
      // brokeName:
      //   JSON.parse(window.sessionStorage.getItem("userInfo") || "{}")
      //     .brokeName || ""
      user: JSON.parse(window.sessionStorage.getItem("userInfo") || "{}"),
      serveUrl: sessionStorage.getItem("serveUrl")
      // userpic: JSON.parse(window.sessionStorage.getItem("userInfo")).pic
      //   ? JSON.parse(window.sessionStorage.getItem("userInfo")).pic
      //   : require("../images/log_head.jpg")
    };
  },
  mounted() {},
  methods: {
    ...mapMutations(["changeSite"]),
    handleCommand(command) {
      if (command === "退出") {
        this.$router.replace({
          name: "login",
          params: {
            isOut: "yes"
          }
        });
        window.sessionStorage.removeItem("Site");
        window.sessionStorage.removeItem("userInfo");
        window.sessionStorage.removeItem("serveUrl");
      } else if (command == "b") {
        this.$router.replace("/home/changePassword.html");
      }
    }
  }
};
</script>

<style lang="less"  scoped>
.home,
.home_conter {
  height: 100%;
}
.home_conter {
  position: relative;
  min-width: 1200px;
  .el-submenu__title i {
    color: #fff;
  }
  .home_conter_nav {
    height: 100%;
    background-color: #002140;
    .nav_portrait {
      .logo {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 64px;
        line-height: 64px;
        background: #00142a;
        color: #fff;
        text-align: center;
        font-size: 20px;
        font-weight: 600;
        overflow: hidden;
        img {
          width: 50px;
          max-height: 50px;
        }
      }
      .site-name {
        margin-left: 10px;
      }
    }
    .el-menu {
      border-right: 0;
      .el-submenu__title i {
        color: #fff;
      }
    }
  }
  .home_conter_by {
    height: 100%;
    position: relative;
    min-width: 1250px;
    .el-header {
      background: #fff;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
      .home_head {
        height: 100%;
        padding-right: 100px;
        .home_head_text {
          float: left;
          height: 100%;
          line-height: 60px;
          font-size: 20px;
          font-weight: 600;
          color: #188fff;
        }
        .home_head_info {
          float: right;
          height: 100%;
          .el-dropdown {
            position: relative;
            .home_head_info_conter {
              cursor: pointer;
              span {
                height: 100%;
                line-height: 60px;
                float: left;
                padding-left: 10px;
                color: #000;
              }
              .log_head_img {
                img {
                  width: 40px;
                  height: 40px;
                  margin-top: 10px;
                  border-radius: 5px;
                }
              }
            }
          }
        }
      }
    }
    .el-main {
      background: #f0f2f5;
      position: absolute;
      top: 62px;
      bottom: 0;
      width: 100%;
      padding: 15px;
    }
  }
}
</style>
