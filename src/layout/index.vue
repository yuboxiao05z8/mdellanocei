<template>
  <div class="app-wrapper">
    <el-container class="app-wrapper-box">
      <el-aside class="asideBox" :class="isCollapse?'Collapse': ''" >
        <nav-bar :isCollapse="isCollapse"></nav-bar>
      </el-aside>
      <el-container class="mainContent" style="position: relative;">
        <el-header class="headerBox" height="55px">
          <beacon-station @toggleClick="toggleClick"></beacon-station>
          <!-- <crumbs-station></crumbs-station> -->
        </el-header>
        <el-main class="mainBox">
          <index-main></index-main>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { IndexMain, NavBar, beaconStation, crumbsStation } from './components'
export default {
  components: { NavBar, IndexMain, beaconStation, crumbsStation },
  data() {
    return {
      isCollapse: false
    }
  },
  mounted() {
  },
  methods: {
    toggleClick(type) {
      switch (type) {
        case 'on':
          this.isCollapse = true
          break;
      
        default:
          this.isCollapse = false
          break;
      }
    }
  },
}
</script>

<style lang="less">
.app-wrapper {
  height: 100%;
  .asideBox,
  .mainBox,
  .app-wrapper-box {
    height: 100%;
  }
  .mainContent{
    // min-width: 1000px;
    overflow-x: auto;
  }
  .asideBox {
    width: 230px !important;
    transition: all linear 0.2s;
    background: #545c64;
    overflow-x: hidden;
    &.Collapse{
      width: 65px !important;
    }
  }
  .headerBox {
    padding: 0;
    background: #fff;
    min-width: 1000px;
  }
  .mainBox {
    padding: 15px;
    background: #f4f4f4;
    position: absolute;
    top: 55px;
    left: 0;
    bottom: 0;
    right: 0;
    height: auto;
    min-width: 1000px;
  }
}
</style>