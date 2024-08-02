<template>
  <div class="inventory_child_wrapper">
    <div class="child_header">
      <div class="project_title">
        <span>{{$t('navTop.propertiesDetails')}}</span>
        <span class="project_name">{{projectName}}</span>
      </div>
      <el-menu class="el-menu-demo" mode="horizontal" :default-active="$route.path" active-text-color="#409EFF" @select="selectPage">
        <el-menu-item index="/home/detail.html">{{$t('navTop.detail')}}</el-menu-item>
        <el-menu-item index="/home/buildingPhases.html">{{$t('navTop.buildingPhases')}}</el-menu-item>
        <el-menu-item index="/home/floorPlans.html">{{$t('navTop.floorPlans')}}</el-menu-item>
        <el-menu-item index="/home/units.html">{{$t('navTop.untils')}}</el-menu-item>
        <el-menu-item index="/home/plan.html">{{$t('navTop.siteStackPlans')}}</el-menu-item>
        <el-submenu index="media">
          <template slot="title">{{$t('navTop.media')}}</template>
          <el-menu-item index="/home/image.html">{{$t('navTop.image')}}</el-menu-item>
          <el-menu-item index="/home/pdf.html">{{$t('navTop.pdf')}}</el-menu-item>
          <el-menu-item index="/home/video.html">{{$t('navTop.video')}}</el-menu-item>
          <el-menu-item index="/home/aeriaView.html">{{$t('navTop.aeriaView')}}</el-menu-item>
        </el-submenu>
        <!-- <el-menu-item index="/home/email.html">{{$t('navTop.email')}}</el-menu-item> -->
        <el-submenu index="settings">
          <template slot="title">{{$t('navTop.settings')}}</template>
          <el-menu-item index="/home/GeneralSettings.html">{{$t('navTop.GeneralSettings')}}</el-menu-item>
          <el-menu-item index="/home/commission.html">{{$t('navTop.SalesPromotion')}}</el-menu-item>
          <el-menu-item index="/home/contactInformation.html">{{$t('contactInformation')}}</el-menu-item>
          <el-menu-item index="/home/CustomSettings.html">{{$t('CustomSettings')}}</el-menu-item>
        </el-submenu>
        <!-- <el-menu-item index="/home/settings.html">{{$t('navTop.settings')}}</el-menu-item> -->
        <el-menu-item index="/home/permissions.html">{{$t('navTop.permissions')}}</el-menu-item>
        <el-menu-item index="/home/documentGeneration.html">{{$t('navTop.documentGeneration')}}</el-menu-item>
      </el-menu>
    </div>
    <div class="child_content">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      projectName:
        JSON.parse(sessionStorage.getItem("projectDesc") || "{}").name || "",
      isToPath: ""
    };
  },
  methods: {
    selectPage(val) {
      this.$router.replace(val);
      console.log('123',val)
    }
  },
  beforeRouteLeave(to, from, next) {
    if (to.path !== "/home/editMap.html" && to.path !== "/") {
      sessionStorage.getItem("projectDesc") &&
        sessionStorage.removeItem("projectDesc");
    }
    next();
  }
};
</script>

<style lang="less">
.inventory_child_wrapper {
  height: 100%;
  position: relative;
  .child_header {
    position: absolute;
    top: 0;
    width: 100%;
    .project_title {
      height: 60px;
      padding: 15px 30px;
      border-bottom: 1px solid #dcdfe6;
      border-top: 1px solid #dcdfe6;
      background-color: #fff;
      .project_name {
        font-weight: 200;
        font-size: 16px;
      }
    }
    .el-menu {
      .el-menu-item,
      .el-submenu {
        width: 9.5%;
        text-align: center;
        &:last-child {
          width: 14.5%;
        }
      }
      .el-submenu {
        .el-submenu__title i {
          color: #909399 !important;
        }
        .el-menu-item {
          text-align: center;
        }
      }
    }
  }
  .child_content {
    position: absolute;
    top: 120px;
    width: 100%;
    bottom: 0;
  }
}
</style>

