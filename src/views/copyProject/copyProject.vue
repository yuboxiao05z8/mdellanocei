<template>
  <div class="copyProject">
    <!-- <div class="copyProject_head_box">
      <div class="copyProject_header">
        <el-row>
          <el-col :span="8">
            <span style="padding:8px 0;margin-right:15px">CopyProject</span>
          </el-col>
        </el-row>
      </div>
    </div> -->
    <div class="copyProject_content">
      <el-tabs type="border-card">
        <el-tab-pane :label="$t('CopyProject')">
          <div class="copyHead">
            <el-row :gutter="20">
              <el-col :span="10">
                <div class="grid-content bg-purple-lf">
                  {{$t('FromOrg')}}
                  <!-- <el-select
                    @change="queryBrokeAll('change')"
                    v-model="mainCompany"
                    filterable
                    :placeholder="$t('pleaseSelect')"
                  > -->
                   <el-select
                    v-model="mainCompany"
                    filterable
                    :placeholder="$t('pleaseSelect')"
                  >
                    <el-option
                      v-for="item in mainCompanyList"
                      :key="item.brokeId"
                      :label="item.brokeName"
                      :value="item.brokeId"
                    ></el-option>
                  </el-select>
                </div>
              </el-col>
              <el-col :span="4">-</el-col>
              <el-col :span="10">
                <div class="grid-content bg-purple-rt">
                  {{$t('ToOrg')}}
                  <el-select
                    @change="getProject"
                    v-model="targetFirm"
                    filterable
                    :placeholder="$t('pleaseSelect')"
                  >
                    <el-option
                      v-for="item in targetFirmList"
                      :key="item.brokeId"
                      :label="item.brokeName"
                      :value="item.brokeId"
                    ></el-option>
                  </el-select>
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="copyBody">
            <div class="copyBodyLeft copyBox">
              <div class="copyBox_head">{{$t('FromOrg')}}</div>
              <div class="copyBox_body">
                <el-checkbox-group v-model="rootProjectActive" @change="getRootProjectActive">
                  <div class="checkBox_div" v-for="(item,index) in rootProjectList" :key="index">
                    <el-checkbox :label="item.projectId">{{item.projectName}}</el-checkbox>
                  </div>
                </el-checkbox-group>
              </div>
            </div>
            <div class="copyBodyCenter copyBox">
              <div class="copyBtnDiv">
                <el-button type="primary" @click="copyFn" :disabled="copyBtn">
                  {{$t('copy')}}
                  <i class="el-icon-arrow-right el-icon--right"></i>
                </el-button>
              </div>
              <div>
                <el-button
                  type="danger"
                  @click="deleteFn"
                  :disabled="deleteBtn"
                  icon="el-icon-arrow-left"
                >{{$t('delete')}}</el-button>
              </div>
            </div>
            <div class="copyBodyRight copyBox">
              <div class="copyBox_head">{{$t('ToOrg')}}</div>
              <div class="copyBox_body">
                <el-checkbox-group v-model="copyProjectActive" @change="getCopyProjectActive">
                  <div class="checkBox_div" v-for="(item,index) in copyProjectList" :key="index">
                    <el-checkbox :label="item.projectId">{{item.projectName}}</el-checkbox>
                  </div>
                </el-checkbox-group>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <!-- <el-tab-pane :label="$t('updateMapping')">
          <div class="mapPage_head">
            {{$t('ChooseCompany')}}
            <el-select v-model="mapCompanyActive" filterable :placeholder="$t('pleaseSelect')">
              <el-option
                v-for="item in mainCompanyList"
                :key="item.brokeId"
                :label="item.brokeName"
                :value="item.brokeId"
              ></el-option>
            </el-select>
          </div>
          <div class="mapPage_body">
            <el-table
              :data="projectList"
              border
              style="width: 100%"
              :header-cell-style="{'background':'#f5f7fa'}"
              size="mini"
            >
              <el-table-column :label="$t('accounts.companyName')">
                <template slot-scope="scope">
                  <div>{{scope.row.projectName}}</div>
                </template>
              </el-table-column>

              <el-table-column :label="$t('userLists.edit')">
                <template slot-scope="scope">
                  <template>
                    <el-button size="mini" plain @click="copyMap(scope.row)">{{$t('updateMapping')}}</el-button>
                  </template>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane> -->
      </el-tabs>
    </div>
    <el-dialog
      :title="$t('synchronousMappingData')"
      :visible.sync="dialogVisible"
      width="500px"
      class="account_dialog"
    >
      <el-checkbox-group v-model="synchronizationCompanyActive">
        <el-checkbox
          v-for="(item,index) in synchronizationCompanyList"
          :key="index"
          :label="item.projectId"
        >{{item.brokeName}}</el-checkbox>
      </el-checkbox-group>
      <div class="btn_box">
        <el-button @click="dialogVisible = false">{{$t('cancel')}}</el-button>
        <el-button type="primary" @click="onSubmitcopyMap">{{$t('copy')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      mainCompanyList: [],
      mainCompany: '',
      targetFirmList: [],
      targetFirm: '',
      rootProjectList: [],
      copyProjectList: [],
      rootProjectActive: [],
      copyProjectActive: [],
      copyBtn: true,
      deleteBtn: true,
      mapCompanyActive: '',
      projectList: [],
      dialogVisible: false,
      synchronizationCompanyList: [],
      synchronizationCompanyActive: [],
      copyProjectId: ''
    }
  },
  watch: {
    mainCompany(val) {
      this.targetFirm = ''
    },
    mapCompanyActive(val) {
      this.getMianPropertie()
    }
  },
  mounted() {
    this.queryBrokeAll()
  },
  methods: {
    queryBrokeAll() { // 查询经济公司
      this.$Get(this.$api.queryBrokeAll, { editBrokeId: this.mainCompany }).then(res => {
        if (res.code == 0) { 
            this.mainCompanyList = res.datas.filter(item => {
              return item.type == 1 || item.type == 2
            })
            this.targetFirmList = res.datas.filter(item => {
              return item.type == 3
            })
          }  
      })
    },
    getProject() {
      if (this.mainCompany && this.targetFirm) {
        this.$Get(this.$api.getProject, { mainBrokeId: this.mainCompany, editBrokeId: this.targetFirm }).then(res => {
          if (res.code == 0) {
            this.rootProjectList = res.datas.filter(item => {
              return item.isCheck == 0
            })
            this.copyProjectList = res.datas.filter(item => {
              return item.isCheck == 1
            })
            this.rootProjectActive = []
            this.copyProjectActive = []
            this.deleteBtn = true
            this.copyBtn = true
          }
        })
      } else if (!this.mainCompany) {
        this.$notify.error({
          title: "fail",
          message: this.$t('pleaseSelectFromOrg')
        })
      } else if (!this.targetFirm) {
        this.$notify.error({
          title: "fail",
          message: this.$t('pleaseSelectToOrg')
        })
      }
    },
    getRootProjectActive() {
      if (this.rootProjectActive.length !== 0) {
        this.copyBtn = false
      } else {
        this.copyBtn = true
      }
    },
    getCopyProjectActive() {
      if (this.copyProjectActive.length !== 0) {
        this.deleteBtn = false
      } else {
        this.deleteBtn = true
      }
    },
    copyFn() {
      this.$Post(this.$api.editProperties, {
        targetBrokeId: this.targetFirm,
        sourceBrokeId: this.mainCompany,
        addProjectIds: this.rootProjectActive.join(',')
      }).then(res => {
        if (res.code == 0) {
          this.$message({
            type: 'success',
            message: res.msg
          })
          this.getProject()
        } else {
          this.$notify.error({
            title: "fail",
            message: res.msg
          })
        }
      })
    },
    deleteFn() {
      this.$Post(this.$api.editProperties, {
        targetBrokeId: this.targetFirm,
        sourceBrokeId: this.mainCompany,
        delProjectIds: this.copyProjectActive.join(',')
      }).then(res => {
        if (res.code == 0) {
          this.$message({
            type: 'success',
            message: res.msg
          })
          this.getProject()
        } else {
          this.$notify.error({
            title: "fail",
            message: res.msg
          })
        }
      })
    },
    getMianPropertie() {
      this.$Get(this.$api.getMianPropertie, { editBrokeId: this.mapCompanyActive }).then(res => {
        if (res.code == 0) {
          this.projectList = res.datas
          // console.log(res)
        }
      })
    },
    copyMap(row) {
      this.dialogVisible = true
      this.copyProjectId = row.projectId
      this.$Get(this.$api.getCopyPropertieBroke, { projectId: row.projectId }).then(res => {
        if (res.code == 0) {
          this.synchronizationCompanyList = res.datas
        }
      })
    },
    onSubmitcopyMap() {
      if (this.synchronizationCompanyActive.length !== 0) {
        this.$Get(this.$api.copySitePlan, {
          mainBrokeId: this.mapCompanyActive,
          toProjectIds: this.synchronizationCompanyActive.join(','),
          mainProjectId: this.copyProjectId
        }).then(res => {
          if (res.code == 0) {
            this.dialogVisible = false
            this.$notify.success({
              title: "success",
              message: res.msg
            })
            this.synchronizationCompanyActive = []
          } else {
            this.$notify.error({
              title: "fail",
              message: res.msg
            });
          }
        })
      } else {
        this.$notify.error({
          title: "fail",
          message: this.$t('pleaseSelectToOrg')
        })
      }
    }
  }
};
</script>

<style lang="less">
.copyProject {
  position: relative;
  height: 100%;
  overflow: hidden;
  .copyProject_header {
    margin-bottom: 15px;
    padding: 15px;
    background-color: #fff;
  }
  .copyProject_content {
    position: absolute;
    top: 0px;
    bottom: 0;
    left: 0;
    right: 0;
    .el-tabs--border-card {
      height: 100%;
      position: relative;
      overflow: hidden;
      .el-tabs__content {
        position: absolute;
        top: 40px;
        left: 0;
        right: 0;
        bottom: 0;
        overflow-y: auto;
        .copyHead {
          padding-bottom: 10px;
          border-bottom: 1px solid #ddd;
          text-align: center;
          .bg-purple-lf {
            text-align: right;
          }
          .bg-purple-rt {
            text-align: left;
          }
        }
        .copyBody {
          text-align: center;
          margin: 0 auto;
          padding-top: 15px;
          display: flex;
          width: 800px;
          .copyBox {
            display: inline-block;
            width: 350px;
            height: 450px;
            border: 1px solid #ddd;
            .copyBox_head {
              height: 40px;
              background-color: #f4f4f4;
              line-height: 40px;
            }
            .copyBox_body {
              height: 410px;
              overflow-y: auto;
              overflow-x: hidden;
              .checkBox_div {
                text-align: left;
                height: 40px;
                line-height: 40px;
                padding: 0 10px;
                border-bottom: 1px solid #ddd;
                box-sizing: border-box;
                .el-checkbox {
                  width: 100%;
                }
                .el-checkbox__label {
                  width: 100%;
                }
              }
            }
            .copyBox_footer {
              height: 40px;
              background-color: #f4f4f4;
              line-height: 40px;
            }
          }
          .copyBodyCenter {
            width: 100px;
            border: none;
            margin: 0 10px;
            position: relative;
            .copyBtnDiv {
              margin-top: 150px;
              margin-bottom: 50px;
            }
          }
        }
      }
    }
  }
  .mapPage_body {
    position: absolute;
    top: 70px;
    bottom: 0;
    left: 15px;
    right: 15px;
    overflow-y: auto;
    .page_section {
      text-align: center;
    }
  }
  .btn_box {
    margin-top: 40px;
    text-align: center;
  }
}
</style>
