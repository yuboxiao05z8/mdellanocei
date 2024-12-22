<template>
  <div class="selectNav_page">
    <el-dialog title="Navigation Management" center :visible.sync="dialogVisible" width="30%">
      <div>
        <el-tree
          ref="elTree"
          default-expand-all
          node-key="menuId"
          :props="defaultProps"
          :data="navArr"
          show-checkbox
        ></el-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="confirmFn">Confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: ['receiveObj', 'type'],
  data() {
    return {
      dialogVisible: false,
      navArr: [],
      defaultProps: {
        children: 'childMenus',
        label: 'menuName',
      },
    }
  },
  watch: {
    receiveObj(val) {
      this.queryUserMenu()
    },
  },
  methods: {
    confirmFn() {
      let arr = this.$refs.elTree
        .getCheckedNodes(false, true)
        .map((i) => i.menuId)
      this.updateFn(arr)
    },

    updateFn(arr) {
      let api = this.$api.saveBrokeMenu
      if (this.type == 'roleId') {
        api = this.$api.saveRoleMenu
      }
      let data = {
        ...this.receiveObj,
        menuIds: arr.join(','),
      }
      this.$Posting(api, data).then((res) => {
        if (res.code == 0) {
          this.$notify.success({
            title: 'Success',
            message: 'submit successfully',
          })
          this.dialogVisible = false
          this.queryUserMenu()
        } else {
          this.$notify.error({
            title: 'error',
            message: res.msg,
          })
        }
      })
    },

    queryUserMenu() {
      let data = {
        type: this.receiveObj.brokeType || '',
        roleId: this.receiveObj.roleId || '',
      }
      this.$Posting(this.$api.queryUserMenu, data).then((res) => {
        if (res.code == 0) {
          this.navArr = res.datas
          let arr = []
          getActiveData(res.datas, arr)
          console.log('收到的', arr)
          this.$nextTick(() => {
            this.$refs.elTree.setCheckedKeys(arr)
          })
        }
      })
    },
  },
}

/** 
 * @param {params, accept} arr
 * 循环处理选中项数据
 */
function getActiveData(params, accept) {
  params.forEach((i) => {
    if (i.checked && !i.childMenus) {
      accept.push(i.menuId)
    }
    if (i.checked && i.childMenus) {
      getActiveData(i.childMenus, accept)
    }
  })
}
</script>

<style lang="less">
.selectNav_page {
}
</style>