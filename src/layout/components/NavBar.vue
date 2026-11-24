<template>
  <div class="app-navbar">
    <div class="logoText" v-if="!isCollapse">{{userInfo.brokeName}}</div>
    <el-menu
      :default-active="activeMenu"
      class="el-menu-vertical"
      background-color="#545c64"
      :collapse="isCollapse"
      :collapse-transition="false"
      text-color="#ddd"
    >
      <sidebar-item
        v-for="route in different_routes"
        :key="route.path"
        :item="route"
        :base-path="route.path"
      />
    </el-menu>
  </div>
</template>

<script>
import SidebarItem from './sidebar/SidebarItem'
export default {
  components: { SidebarItem },
  props: {
    isCollapse: {
      type: Boolean,
    },
  },
  computed: {
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // 根据route匹配活动的导航
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
  },
  data() {
    return {
      routerObj: [],
      userInfo: JSON.parse(window.sessionStorage.getItem('userInfo') || '{}'),
      different_routes: [],
    }
  },
  created() {
    this.queryUserMenu()
  },
  methods: {
    queryUserMenu() {
      this.$Post(this.$api.queryUserMenu).then((res) => {
        if (res.code == 0) {
          this.different_routes = res.datas

          if (res.datas.length) {
            this.setActiveOne(res.datas)
          }
          
        }
      })
    },
    setActiveOne(objs) {
      let link = []
      let isLogin = sessionStorage.getItem('logInSign')

      forEachLinkFn(objs, link)

      if (isLogin) {
        if (link.join(',') != this.activeMenu) {
          // console.log('不同', link.join(','), this.activeMenu)
          this.$router.replace(link.join(','))
        }
        sessionStorage.removeItem('logInSign')
        // console.log('相同', link.join(','), this.activeMenu)
      }

      // console.log('进入方法', link.join(','), this.activeMenu)
    }
  },
}

/*
 * arr 数组
 * 获取第一个Link
 */
function forEachLinkFn(arr, str) {
  let obj = arr[0]
  if (!obj.childMenus) {
    str.push(obj.link)
  } else {
    forEachLinkFn(obj.childMenus, str)
  }
}
</script>

<style lang="less">
.app-navbar {
  height: 100%;
  .logoText {
    height: 55px;
    line-height: 55px;
    padding: 0 10px;
    color: #fff;
    font-weight: 600;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    position: relative;
    &::before {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 1px;
      background: #909399;
    }
  }
  .el-menu-vertical {
    height: calc(100% - 56px);
    overflow: auto;
  }
  .el-menu {
    border-right: 0;
  }
}
.Collapse {
  .el-submenu__title {
    span {
      display: none;
    }
    .el-icon-arrow-right {
      display: none;
    }
  }
}
</style>