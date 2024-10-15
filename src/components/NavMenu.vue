<template>
  <div class="sidebar-container">
    <el-menu
      class="el-menu-vertical-demo"
      :show-timeout="200"
      :default-active="Site"
      :unique-opened="true"
      @select="handleSelect"
      background-color="#002140"
      text-color="hsla(0, 0%, 100%, .65)"
      active-text-color="#409EFF"
    >
      <el-menu-item index="/home/inventoryList.html">
        <span slot="title">{{$t('navLeft.inventory')}}</span>
      </el-menu-item>
      <el-menu-item index="/home/transactions.html">
        <span slot="title">{{$t('navLeft.transactions')}}</span>
      </el-menu-item>
      <el-menu-item index="/home/interest.html">
        <span slot="title">{{$t('navLeft.interest')}}</span>
      </el-menu-item>
      <el-menu-item index="/home/notification.html">
        <span slot="title">{{$t('navLeft.notification')}}</span>
      </el-menu-item>
      <el-submenu index="admin">
        <span slot="title">{{$t('navLeft.admin')}}</span>
        <el-menu-item index="/home/generalFiles.html">
          <span slot="title">{{$t('navLeft.generalFiles')}}</span>
        </el-menu-item>
        <el-menu-item index="/home/auditLogs.html">
          <span slot="title">{{$t('navLeft.auditLogs')}}</span>
        </el-menu-item>
        <el-submenu index="userManagement">
          <span slot="title">{{$t('navLeft.userManagement')}}</span>
          <el-menu-item index="/home/userList.html">
            <span slot="title">{{$t('navLeft.userList')}}</span>
          </el-menu-item>
          <el-menu-item index="/home/createNewUsers.html">
            <span slot="title">{{$t('navLeft.createNewUsers')}}</span>
          </el-menu-item>
          <el-menu-item index="/home/createNewTeams.html">
            <span slot="title">{{$t('navLeft.teams')}}</span>
          </el-menu-item>
          <!-- <el-menu-item index="/home/teams.html">
            <span slot="title">{{$t('navLeft.createNewTeams')}}</span>
          </el-menu-item>-->
          <el-menu-item index="/home/roles.html">
            <span slot="title">{{$t('navLeft.roles')}}</span>
          </el-menu-item>
        </el-submenu>
        <!-- <el-submenu index="masterManagement">
          <span slot="title">{{$t('navLeft.masterDataManagement')}}</span>
          <el-menu-item index="/home/otherSellingEntities.html">
            <span slot="title">{{$t('navLeft.otherSellingEntities')}}</span>
          </el-menu-item>
        </el-submenu>-->
        <!-- <el-menu-item index="/home/report.html">
          <span slot="title">{{$t('navLeft.report')}}</span>
        </el-menu-item>-->
      </el-submenu>
      <el-menu-item v-if="isAdmin == 0" index="/home/versionList.html">
        <span slot="title">{{$t('navLeft.version_manage')}}</span>
      </el-menu-item>
      <el-menu-item index="/home/calendar.html">
        <span slot="title">{{$t('calendar.Calendar')}}</span>
      </el-menu-item>
      <el-menu-item v-if="isAdmin == 0 || isAdmin == 2" index="/home/accountLists.html">
        <span slot="title">Accounts</span>
      </el-menu-item>
      <el-menu-item v-if="isAdmin == 0" index="/home/copyProject.html">
        <span slot="title">CopyProject</span>
      </el-menu-item>
      <el-menu-item v-if="isAdmin == 0" index="/home/feedback.html">
        <span slot="title">feedback</span>
      </el-menu-item>
      <el-submenu v-if="isAdmin == 0 || isAdmin == 2" index="allocation">
        <span slot="title">Config</span>
        <el-menu-item index="/home/email.html">
          <span slot="title">Email</span>
        </el-menu-item>
      </el-submenu>

      <el-submenu v-if="isAdmin == 0" index="marketing">
        <span slot="title">{{$t('marketing management')}}</span>
        <el-menu-item index="/home/advertising.html">
          <span slot="title">{{$t('Project advertising')}}</span>
        </el-menu-item>
        <el-menu-item index="/home/stimulate.html">
          <span slot="title">{{$t('Commission incentive')}}</span>
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  computed: {
    ...mapState(['Site'])
  },
  props: {
    value: {
      type: Object,
      require: false
    }
  },
  data() {
    return {
      isAdmin: JSON.parse(window.sessionStorage.getItem('userInfo')).isAdmin
    }
  },
  mounted() {
    // console.log(this.Site);
    // console.log('是不是',this.isAdmin)
  },
  methods: {
    ...mapMutations(['changeSite']),
    handleSelect(key) {
      this.changeSite(key)
      this.$router.replace(key)
    }
  }
}
</script>


<style scoped lang="less">
.sidebar-container {
  box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
  transition: width 0.28s;
  width: 100%;
  height: 100%;
  overflow: hidden;
  a {
    display: inline-block;
    width: 100%;
  }
  .el-menu {
    padding-top: 16px;
    width: 100% !important;
    border: none;
  }
  .el-submenu .el-menu-item {
    min-width: 100%;
    background-color: #00142a !important;
    &:hover {
      color: #fff !important;
    }
  }
  .el-menu-item,
  .el-submenu .el-menu-item {
    &.is-active {
      background-color: #188fff !important;
      color: #fff !important;
    }
  }
  .el-submenu__title i {
    font-size: 16px;
    color: rgba(255, 255, 255, 0.65);
  }
}
</style>
