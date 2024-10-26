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
        v-for="route in permission_routes"
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
      type: Boolean
    }
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
    }
  },
  data() {
    return {
      routerObj: [],
      userInfo: JSON.parse(window.sessionStorage.getItem('userInfo') || '{}')
    }
  },

  mounted() {
    // console.log('获取到的', this.permission_routes)
  },
  methods: {
    handleOpen(val) {
      console.log(val)
    },
    handleClose(val) {
      console.log(val)
    }
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
    &::before{
      content: "";
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