<template>
  <div class="beaconStation">
    <el-row>
      <el-col :span="12">
        <div class="foldDiv">
          <i @click="OpenNavigation('off')" v-if="isPackUp" class="el-icon-s-unfold"></i>
          <i @click="OpenNavigation('on')" v-else class="el-icon-s-fold"></i>
        </div>
        <div class="lfStation">
          <el-breadcrumb separator="/">
            <transition-group name="breadcrumb">
              <el-breadcrumb-item v-for="(item, index) in levelList" :key="item.path">
                <a
                  v-if="item.path == isIndex"
                  @click.prevent="handleLink(item)"
                >{{ item.meta.title }}</a>
                <span v-else class="no-redirect">{{ item.meta.title }}</span>
              </el-breadcrumb-item>
            </transition-group>
          </el-breadcrumb>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="rtStation">
          <div class="fullMian optionDiv">
            <img
              v-if="!isFull"
              @click="full('on')"
              src="../../../assets/images/icon/amplification.png"
              alt
            />
            <img v-else @click="full('off')" src="../../../assets/images/icon/shrink.png" alt />
          </div>
          <el-dropdown class="optionDiv" trigger="click">
            <div class="personalCenter">
              <el-avatar class="faceImg" :src="require('../../../assets/images/icon/face.png')"></el-avatar>
              <span class="userName">{{userInfo.userName}}</span>
              <i class="el-icon-arrow-down el-icon--right"></i>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="ChangePwd">Change Password</el-dropdown-item>
              <el-dropdown-item @click.native="logOut">Log Out</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  data() {
    return {
      isPackUp: false,
      levelList: null,
      isIndex: '/dashboard',
      isFull: false,
      userInfo: JSON.parse(sessionStorage.getItem('userInfo'))
    }
  },
  watch: {
    $route(route) {
      // 如果转到重定向页面，不要更新面包屑
      if (route.path.startsWith('/redirect/')) {
        return
      }
      this.getBreadcrumb()
    }
  },
  created() {
    this.getBreadcrumb()
  },
  methods: {
    /*
      获取所有的router对象 
     */
    ...mapActions({ clearRoutes: 'permission/clearRoutes' }),
    getBreadcrumb() {
      let matched = this.$route.matched.filter(
        item => item.meta && item.meta.title
      )
      const first = matched[0]


      if (!this.isDashboard(first)) {
        matched = [{ path: '/dashboard', meta: { title: 'Dashboard' } }].concat(
          matched
        )
      }

      this.levelList = matched.filter(
        item => item.meta && item.meta.title && item.meta.breadcrumb !== false
      )
    },
    /* 
       检查是否首页
     */
    isDashboard(route) {
      const name = route && route.name
      if (!name) {
        return false
      }
      return name.trim().toLocaleLowerCase() === 'Dashboard'.toLocaleLowerCase()
    },
    /*
      跳转 
     */
    handleLink(item) {
      const { redirect, path } = item
      if (redirect) {
        this.$router.push(redirect)
        return
      }
      this.$router.push(path)
    },

    /*
      侧边栏激活 
     */
    OpenNavigation(type) {
      switch (type) {
        case 'off':
          this.isPackUp = false
          break

        default:
          this.isPackUp = true
          break
      }
      this.$emit('toggleClick', type)
    },

    logOut() {
      this.$confirm('Are you sure to log out?', 'Alert', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(() => {
          sessionStorage.clear()
          this.clearRoutes()
          this.$message({
            type: 'success',
            message: 'log out!'
          })
          this.$router.replace({ path: '/login' })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: 'Cancel'
          })
        })
    },

    ChangePwd() {
      this.$router.push('/changePassword')
    },
    /*
      全屏 
     */
    full(type) {
      switch (type) {
        case 'on':
          //W3C
          if (document.body.requestFullscreen) {
            document.body.requestFullscreen()
          }
          //FireFox
          else if (document.body.mozRequestFullScreen) {
            document.body.mozRequestFullScreen()
          }
          //Chrome等
          else if (document.body.webkitRequestFullScreen) {
            document.body.webkitRequestFullScreen()
          }
          //IE11
          else if (document.body.msRequestFullscreen) {
            document.body.msRequestFullscreen()
          }
          this.isFull = true
          break

        default:
          if (document.exitFullscreen) {
            document.exitFullscreen()
          } else if (document.msExitFullscreen) {
            document.msExitFullscreen()
          } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen()
          } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen()
          } else {
            window.parent.showTopBottom()
          }
          this.isFull = false
          break
      }
    }
  }
}
</script>

<style lang="less">
.beaconStation {
  padding: 0 20px;
  height: 50px;
  line-height: 50px;
  .el-col {
    height: 50px;
    position: relative;
  }
  .foldDiv {
    display: inline-block;
    position: absolute;
    top: 0;
    i {
      font-size: 22px;
      margin-top: 15px;
      cursor: pointer;
    }
  }
  .lfStation {
    display: inline-block;
    padding-left: 50px;
    height: 100%;
    .el-breadcrumb {
      height: 100%;
      line-height: 50px;
    }
    .no-redirect {
      color: #97a8be;
      cursor: text;
    }
    // line-height: 50px;
  }
  @media (max-width: 900px) {
    // .lfStation {
    //   display: none;
    // }
  }
  .rtStation {
    // text-align: right;
    float: right;
    display: flex;

    .personalCenter {
      cursor: pointer;
      height: 100%;
      .faceImg {
        width: 35px;
        height: 35px;
        margin-top: 7px;
        border-right: 5px;
        float: left;
      }
      .userName {
        float: left;
        margin: 0 5px;
        font-weight: 600;
      }
      .el-icon-arrow-down{
        clear: both;
      }
    }
    .optionDiv {
      height: 50px;
    }
    .fullMian {
      margin-right: 20px;
      img {
        cursor: pointer;
        margin-top: 12px;
        width: 25px;
        height: 25px;
      }
    }
  }
}
</style>