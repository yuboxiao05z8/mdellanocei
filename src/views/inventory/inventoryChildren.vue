<template>
  <div class="inventory_child_wrapper">
    <div class="child_header">
      <div class="project_title">
        <el-button
          size="mini"
          type="info"
          class="btn el-icon-back"
          style="margin-right: 30px;"
          @click="goBack"
        >{{$t('editMap.goBack')}}</el-button>
        <span>{{$t('navTop.propertiesDetails')}}</span>
        <span class="project_name">{{projectName}}</span>
      </div>
      <el-menu
        class="el-menu-demo"
        mode="horizontal"
        :default-active="actinveInde"
        active-text-color="#409EFF"
        router
        @select="selectPage"
      >
        <el-menu-item index="/Inventory/inventoryChildren/detail">{{$t('navTop.detail')}}</el-menu-item>
        <el-menu-item
          index="/Inventory/inventoryChildren/buildingPhases"
        >{{$t('navTop.buildingPhases')}}</el-menu-item>
        <el-menu-item index="/Inventory/inventoryChildren/floorPlans">{{$t('navTop.floorPlans')}}</el-menu-item>
        <el-menu-item index="/Inventory/inventoryChildren/units">{{$t('navTop.untils')}}</el-menu-item>
        <el-menu-item index="/Inventory/inventoryChildren/plan">{{$t('navTop.siteStackPlans')}}</el-menu-item>
        <el-submenu index="media">
          <template slot="title">{{$t('navTop.media')}}</template>
          <el-menu-item index="/Inventory/inventoryChildren/image">{{$t('navTop.image')}}</el-menu-item>
          <el-menu-item index="/Inventory/inventoryChildren/pdf">{{$t('navTop.pdf')}}</el-menu-item>
          <el-menu-item index="/Inventory/inventoryChildren/video">{{$t('navTop.video')}}</el-menu-item>
          <el-menu-item index="/Inventory/inventoryChildren/aeriaView">{{$t('navTop.aeriaView')}}</el-menu-item>
        </el-submenu>
        <!-- <el-menu-item index="/Inventory/inventoryChildren/email">{{$t('navTop.email')}}</el-menu-item> -->
        <el-submenu index="settings">
          <template slot="title">{{$t('navTop.settings')}}</template>
          <el-menu-item
            index="/Inventory/inventoryChildren/GeneralSettings"
          >{{$t('navTop.GeneralSettings')}}</el-menu-item>
          <el-menu-item
            index="/Inventory/inventoryChildren/commission"
          >{{$t('navTop.SalesPromotion')}}</el-menu-item>
          <el-menu-item
            index="/Inventory/inventoryChildren/contactInformation"
          >{{$t('contactInformation')}}</el-menu-item>
          <el-menu-item index="/Inventory/inventoryChildren/CustomSettings">{{$t('CustomSettings')}}</el-menu-item>
        </el-submenu>
        <!-- <el-menu-item index="/Inventory/inventoryChildren/settings">{{$t('navTop.settings')}}</el-menu-item> -->
        <el-menu-item index="/Inventory/inventoryChildren/permissions">{{$t('navTop.permissions')}}</el-menu-item>
        <el-menu-item
          index="/Inventory/inventoryChildren/documentGeneration"
        >{{$t('navTop.documentGeneration')}}</el-menu-item>
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
      projectName: '',
      isToPath: '',
      activeMenu: '/Inventory/inventoryChildren/detail'
    }
  },
  computed: {
    actinveInde() {
      return sessionStorage.getItem('ChildernMun') || this.activeMenu
    }
  },
  mounted() {
    this.projectName = JSON.parse(sessionStorage.getItem('projectDesc')).name
    this.getUnitRoleAccess()
  },
  methods: {
    goBack() {
      this.$router.replace('/inventory/inventoryList')
    },
    selectPage(val) {
      sessionStorage.setItem('ChildernMun', val)
    },
    getUnitRoleAccess() {
      let projectId = JSON.parse(sessionStorage.getItem('projectDesc') || '{}')
        .id
      let agentId = JSON.parse(sessionStorage.getItem('userInfo') || '{}')
        .agentId
      this.$Post(this.$api.getUnitRoleAccess, {
        projectId: projectId,
        agentId: agentId
      }).then(res => {
        if (res.code == 0) {
          sessionStorage.setItem('jurisdiction', JSON.stringify(res.datas))
        }
      })
    }
  },
  beforeRouteLeave(to, from, next) {
    let str = '/Inventory/inventoryChildren'
    if (to.path.indexOf(str) == -1) {
      sessionStorage.removeItem('projectDesc')
      sessionStorage.removeItem('jurisdiction')
      sessionStorage.removeItem('ChildernMun')
    }
    next()
  }
}
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
    top: 130px;
    width: 100%;
    bottom: 0;
  }
}
</style>

