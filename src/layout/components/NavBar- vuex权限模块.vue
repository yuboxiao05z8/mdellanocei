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
import { mapGetters } from 'vuex'
import SidebarItem from './sidebar/SidebarItem'
export default {
  components: { SidebarItem },
  props: {
    isCollapse: {
      type: Boolean,
    },
  },
  computed: {
    ...mapGetters(['permission_routes']),
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // 根据route匹配活动的导航
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    different_routes() {
      // 区分用户属性 ['MixGo','Developers','Agency']
      let type = JSON.parse(sessionStorage.getItem('userInfo') || '{}').type, classify, routeObj
      switch (type) {
        case 1:
          classify = 'MixGo'
          break
        case 2:
          classify = 'Developers'
          break
        case 3:
          classify = 'Agency'
          break
      }
      routeObj = filterAsyncRoutes(this.permission_routes, [classify])
      return routeObj
    },
  },
  data() {
    return {
      routerObj: [],
      userInfo: JSON.parse(window.sessionStorage.getItem('userInfo') || '{}'),
    }
  },
}

function hasPermission(roles, route) {
  if (route.type && route.type) {
    return roles.some((role) => route.type.includes(role))
  } else {
    return true
  }
}

function filterAsyncRoutes(routes, roles) {
  const res = []
  routes.forEach((route) => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })
  return res
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