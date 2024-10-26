<template>
  <div class="roles_wrapper">
    <div class="head">
      <div class="tab">
        <el-row>
          <el-col :span="24" class="tab_col">
            <div class="tab_div" :class="{'active':navIndex == 1}" @click="changeIndex(1,'organizationRoles')">{{$t('role.OrganizationRoles')}}</div>
            <div class="tab_div" :class="{'active':navIndex == 2}" @click="changeIndex(2,'propertyRoles')">{{$t('role.PropertyRoles')}}</div>
            <div class="tab_div" :class="{'active':navIndex == 3}" @click="changeIndex(3,'maintenanceRoles')">{{$t('role.MaintenanceRoles')}}</div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="content">
      <keep-alive>
        <component :is="componentName"></component>
      </keep-alive>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      navIndex: 1,
      componentName: "organizationRoles"
    };
  },
  components: {
    organizationRoles: () => import("./roles/organizationRoles.vue"),
    propertyRoles: () => import("./roles/propertyRoles.vue"),
    maintenanceRoles: () => import("./roles/maintenanceRoles.vue")
  },
  methods: {
    changeIndex(index, name) {
      this.navIndex = index;
      this.componentName = name;
    }
  }
};
</script>
<style lang="less">
.roles_wrapper {
  background-color: #fff;
  height: 100%;
  position: relative;
  overflow: hidden;
  .head {
    .tab {
      padding: 15px 30px;
      border-top: 1px solid #dcdfe6;
      border-bottom: 1px solid #dcdfe6;
      background-color: #fff;
      .tab_col {
        .tab_div {
          float: left;
          height: 32px;
          line-height: 32px;
          width: 250px;
          text-align: center;
          border: 1px solid #dcdfe6;
          cursor: pointer;
          border-radius: 2px;
          color: #909399;
          background-color: #f5f7fa;
          &.active {
            background-color: #fff;
            color: #151c22;
          }
        }
      }
    }
  }
  .content {
    position: absolute;
    top: 64px;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
  }
  .row_header {
    padding: 10px 30px;
    height: 52px;
    box-sizing: border-box;
    border-bottom: 1px solid #dcdfe6;
    text-align: right;
  }
  .roles_content {
    position: absolute;
    top: 52px;
    bottom: 0;
    left: 18px;
    right: 18px;
    overflow: auto;
    padding: 10px 0;
    //自定义表格样式修改
    .roles_table {
      .noData {
        padding: 20px;
        text-align: center;
        border: 1px solid #ebeef5;
      }
      .table {
        position: relative;
        font-size: 12px;
        color: #909399;
        .thead {
          background: rgb(245, 247, 250);
          color: #909399;
          &::after {
            content: "";
            display: table;
            clear: both;
          }
          .th {
            float: left;
            width: 20%;
            text-align: center;
            font-size: 12px;
            font-weight: 600;
            padding: 10px 0;
          }
        }
        .tbody {
          border-bottom: 1px solid #ebeef5;
          .tbody_item {
            border-bottom: 1px solid #ebeef5;
            &:last-child {
              border: none;
            }
            .tbody_item_left {
              width: 20%;
              border: 1px solid #ebeef5;
              border-top: none;
              border-bottom: none;
              justify-content: center;
              align-items: center;
            }
            .tbody_item_right {
              width: 80%;
              .right_item {
                align-items: center;
                flex-wrap: wrap;
                & > div {
                  width: 100%;
                  border-right: 1px solid #ebeef5;
                  padding: 0;
                  border-bottom: 1px solid #ebeef5;
                  &:last-child {
                    border-bottom: none;
                  }
                }
                &.opration_column {
                  text-align: center;
                  .opration_column_children {
                    width: 25%;
                    height: 50px;
                    line-height: 50px;
                  }
                }
                &.add_column {
                  background: rgb(245, 247, 250);
                  .add {
                    padding: 4px 0;
                  }
                  .el-button {
                    &:first-child {
                      margin-left: 20px;
                    }
                  }
                }
                &.data_column {
                  .data_column_item {
                    padding: 10px 0;
                    & > div {
                      width: 50%;
                      padding: 0 10px;
                    }
                    .data_column_item_left {
                      align-items: center;
                      & > div {
                        width: 50%;
                        &.team_name {
                          color: #000;
                        }
                      }
                    }
                    .data_column_item_right {
                      text-align: right;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  .flex {
    display: -webkit-box; /* Chrome 4+, Safari 3.1, iOS Safari 3.2+ */
    display: -moz-box; /* Firefox 17- */
    display: -webkit-flex; /* Chrome 21+, Safari 6.1+, iOS Safari 7+, Opera 15/16 */
    display: -moz-flex; /* Firefox 18+ */
    display: -ms-flexbox; /* IE 10 */
    display: flex; /* Chrome 29+, Firefox 22+, IE 11+, Opera 12.1/17/18, Android 4.4+ */
  }
}
//弹窗样式修改
.roles_dialog {
  .dialog_header {
    padding: 10px 0;
    border-top: 1px solid #dcdfe6;
    border-bottom: 1px solid #dcdfe6;
    .col_text {
      padding: 4px 0;
      text-align: left;
      color: #000;
    }
    .col_button {
      text-align: right;
    }
  }
  .permissions_command {
    border-bottom: 1px solid #dcdfe6;
    padding: 5px 0;
    text-align: center;
  }
  .permissions_tab {
    margin-top: 10px;
    .el-tabs__content {
      height: 400px;
      overflow: hidden;

      .car_tab_div {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: auto;
        padding: 10px 0;
        .permissions_single {
          & > div {
            border: 1px solid #dcdfe6;
            border-bottom: 0;
            padding: 5px;
          }
          .permissions_single_left {
            text-align: center;
            border-right: 0;
          }
          &:last-child {
            border-bottom: 1px solid #dcdfe6;
          }
        }
      }
    }
  }
  .el-dialog__body {
    padding: 10px 20px;
  }
  .selling_entity {
    display: block !important;
    .el-form-item__content {
      padding: 10px 0;
      display: block !important;
    }
    .el_checkbox_group {
      .el-checkbox {
        margin: 0;
        width: 24%;
        margin-right: 1%;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>



