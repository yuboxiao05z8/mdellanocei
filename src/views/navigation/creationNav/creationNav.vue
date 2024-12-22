<template>
  <div class="creationNav">
    <el-row class="creationNav_nav_bar">
      <el-col :span="12" class="creationNav_nav_text">Creation Navigation</el-col>
      <el-col :span="12">
        <el-button
          icon="el-icon-circle-plus-outline"
          size="mini"
          type="primary"
          class="creationNav_nav_btn"
          @click="isNavShow = true"
        >New lead navigation</el-button>
      </el-col>
    </el-row>

    <div class="creationNav_tab">
      <div class="creationNav_tree">
        <el-tree :data="tagData" 
        node-key="id" 
        :expand-on-click-node="false" 
        :props="defaultProps"
        >
          <div class="custom-tree-node" slot-scope="{ node, data }">
            <span class="custom-tree-node_lab">{{ node.label }}</span>
            <span>
              <el-button
                v-if="(node.parent.parent == null)||(node.parent.parent&&node.parent.parent.parent == null)"
                type="primary"
                size="mini"
                @click="() => EditNav('add',data)"
              >Append</el-button>
              <el-button type="primary" size="mini" @click="() => EditNav('edit',data)">Edit</el-button>
              <el-button type="danger" size="mini" @click="() => removeNav(data)">Delete</el-button>
            </span>
          </div>
        </el-tree>
      </div>
    </div>

    <!-- 编辑弹框 -->
    <div>
      <el-dialog
        class="optFor_subject"
        title="Add or edit"
        :visible.sync="isNavShow"
        center
        width="700px"
        @closed="closeDialog"
      >
        <el-form
          label-position="left"
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="0"
        >
          <el-row :gutter="20">
            <el-col :span="15">
              <el-form-item label="Name" label-width="140px" prop="menuName">
                <el-input v-model="ruleForm.menuName" placeholder="The name of the navigation"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="15">
              <el-form-item label="Icon" label-width="140px">
                <el-input v-model="ruleForm.icon" placeholder="Navigation icon name"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="15">
              <el-form-item label="URL" label-width="140px" prop="link">
                <el-input v-model="ruleForm.link" placeholder="The URL to jump to"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="15">
              <el-form-item label="Navigation order" label-width="140px" prop="showIndex">
                <el-input v-model="ruleForm.showIndex" placeholder="input sequence number"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeDialog">Cancel</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')">Submit</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tagData: [],
      isNavShow: false,
      ruleForm: {},
      rules: {
        menuName: [
          {
            required: true,
            message: 'This field is a required field',
            trigger: 'blur',
          },
        ],
        icon: [
          {
            required: true,
            message: 'This field is a required field',
            trigger: 'blur',
          },
        ],
        link: [
          {
            required: true,
            message: 'This field is a required field',
            trigger: 'blur',
          },
        ],
        showIndex: [
          {
            required: true,
            message: 'This field is a required field',
            trigger: 'blur',
          },
        ],
      },
      defaultProps: {
        children: 'childMenus',
        label: 'menuName',
      },
    }
  },
  mounted() {
    this.queryUserMenu()
  },
  methods: {
    EditNav(type, data) {
      switch (type) {
        case 'edit':
          this.ruleForm = {
            menuId: data.menuId,
            menuName: data.menuName,
            parentId: data.parentId,
            showIndex: data.showIndex,
            link: data.link,
            icon: data.icon,
          }
          break

        default:
          this.ruleForm.parentId = data.menuId
          break
      }

      this.isNavShow = true
    },
    removeNav(data) {
      this.$confirm('Are you sure to delete it?', 'warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning',
      })
        .then(() => {
          this.$Posting(this.$api.deleteMenu, { menuId: data.menuId }).then(
            (res) => {
              if (res.code == 0) {
                this.$notify.success({
                  title: 'Success',
                  message: 'submit successfully',
                })
                this.queryUserMenu()
              } else {
                this.$notify.error({
                  title: 'error',
                  message: res.msg,
                })
              }
            }
          )
        })
        .catch(() => {})
    },
    closeDialog() {
      this.isNavShow = false
      this.ruleForm = {}
    },
    submitForm() {
      this.$refs.ruleForm.validate((valid) => {
        // 验证表单
        if (valid) {
          this.updata()
        } else {
          return false
        }
      })
    },
    updata() {
      this.$Posting(this.$api.saveMenu, this.ruleForm).then((res) => {
        if (res.code == 0) {
          this.queryUserMenu()
          this.$notify.success({
            title: 'Success',
            message: 'submit successfully',
          })
          this.isNavShow = false
        } else {
          this.$notify.error({
            title: 'error',
            message: res.msg,
          })
        }
      })
    },
    queryUserMenu() {
      this.$Posting(this.$api.queryUserMenu).then((res) => {
        if (res.code == 0) {
          this.tagData = res.datas
        }
      })
    },
  },
}
</script>


<style lang="less">
.creationNav {
  width: 100%;
  height: 100%;
  background: #fff;
  .creationNav_nav_bar {
    padding: 15px;
    border-bottom: 1px solid #ddd;
    .creationNav_nav_text {
      height: 28px;
      line-height: 28px;
    }
  }
  .creationNav_tab {
    height: calc(100% - 60px);
    overflow-y: scroll;
    .creationNav_tree {
      padding: 50px;
    }
    .el-tree-node__content {
      height: 45px;
      .custom-tree-node_lab {
        margin: 5px 20px 5px 5px;
      }
      .el-tree-node__expand-icon {
        font-size: 20px;
      }
    }
  }
}
</style>