<template>
  <div class="document_generation_wrapper">
    <div class="head">
      <div class="tab">
        <el-row>
          <el-col :span="12" class="tab_col">
            <div
              class="tab_div"
              :class="{ active: navIndex == 1 }"
              @click="changeIndex(1)"
            >
              {{ $t('documentGeneration.ImportSite') }}
            </div>
            <div
              class="tab_div"
              :class="{ active: navIndex == 2 }"
              @click="changeIndex(2)"
            >
              {{ $t('documentGeneration.Watermarking') }}
            </div>
          </el-col>
          <el-col :span="12" class="btn_col">
            <el-button
              size="small"
              :disabled="tableDataInit !== -1 || self == 0"
              @click="addRecord"
              >{{ $t('documentGeneration.AddNewRecord') }}</el-button
            >
            <el-button
              size="small"
              :disabled="self == 0"
              @click="getListData"
              >{{ $t('Refresh') }}</el-button
            >
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="import_site" v-if="navIndex == 1">
      <el-table border style="width: 100%" size="mini" :data="tableList">
        <el-table-column :label="$t('documentGeneration.Title')">
          <template slot-scope="scope">
            <el-input
              size="mini"
              v-if="scope.$index === tableDataInit"
              v-model="title"
            ></el-input>
            <div v-else>{{ scope.row.title }}</div>
          </template>
        </el-table-column>

        <el-table-column label="Type">
          <template slot-scope="scope">
            <el-select
              v-model="type"
              v-if="scope.$index === tableDataInit"
              size="mini"
            >
              <el-option
                v-for="(item, index) in typeList"
                :key="index"
                :value="item.type"
                :label="item.name"
              ></el-option>
            </el-select>
            <template v-else>
              <span v-if="scope.row.type">{{ typeList[scope.row.type - 1].name }}</span>
              
              <!-- <i class="el-icon-check" v-if="scope.row.active == '0'"></i>
              <i class="el-icon-close" v-else></i> -->
            </template>
          </template>
        </el-table-column>

        <el-table-column :label="$t('documentGeneration.Active')">
          <template slot-scope="scope">
            <el-checkbox
              v-model="active"
              v-if="scope.$index === tableDataInit"
              :false-label="1"
              :true-label="0"
            ></el-checkbox>
            <template v-else>
              <i class="el-icon-check" v-if="scope.row.active == '0'"></i>
              <i class="el-icon-close" v-else></i>
            </template>
          </template>
        </el-table-column>
        <el-table-column :label="$t('documentGeneration.IsSensitive')">
          <template slot-scope="scope">
            <el-checkbox
              v-model="isSensitive"
              v-if="scope.$index === tableDataInit"
              :false-label="1"
              :true-label="0"
            ></el-checkbox>
            <template v-else>
              <i class="el-icon-check" v-if="scope.row.isSensitive == '0'"></i>
              <i class="el-icon-close" v-else></i>
            </template>
          </template>
        </el-table-column>
        <el-table-column :label="$t('documentGeneration.AllowUpload')">
          <template slot-scope="scope">
            <el-checkbox
              v-model="allowUpload"
              v-if="scope.$index === tableDataInit"
              :false-label="1"
              :true-label="0"
            ></el-checkbox>
            <template v-else>
              <i class="el-icon-check" v-if="scope.row.allowUpload == '0'"></i>
              <i class="el-icon-close" v-else></i>
            </template>
          </template>
        </el-table-column>
        <el-table-column :label="$t('documentGeneration.AllowGenerate')">
          <template slot-scope="scope">
            <el-checkbox
              v-model="allowGenerate"
              v-if="scope.$index === tableDataInit"
              :false-label="1"
              :true-label="0"
            ></el-checkbox>
            <template v-else>
              <i
                class="el-icon-check"
                v-if="scope.row.allowGenerate == '0'"
              ></i>
              <i class="el-icon-close" v-else></i>
            </template>
          </template>
        </el-table-column>
        <el-table-column :label="$t('documentGeneration.OTPNo')">
          <template slot-scope="scope">
            <el-input
              size="mini"
              v-if="scope.$index === tableDataInit"
              v-model="otpNo"
            ></el-input>
            <div v-else>{{ scope.row.otpNo }}</div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('documentGeneration.NeedWatermark')">
          <template slot-scope="scope">
            <el-checkbox
              v-model="needWatermark"
              v-if="scope.$index === tableDataInit"
              :false-label="1"
              :true-label="0"
            ></el-checkbox>
            <template v-else>
              <i
                class="el-icon-check"
                v-if="scope.row.needWatermark == '0'"
              ></i>
              <i class="el-icon-close" v-else></i>
            </template>
          </template>
        </el-table-column>
        <el-table-column :label="$t('documentGeneration.RequiredFor')">
          <template slot-scope="scope">
            <el-select
              v-model="requiredFor"
              v-if="scope.$index === tableDataInit"
              size="mini"
            >
              <el-option value="None" lable="None"></el-option>
              <el-option value="Not Released" lable="Not Released"></el-option>
              <el-option value="Available" lable="Available"></el-option>
              <el-option
                value="Pending Reservation"
                lable="Pending Reservation"
              ></el-option>
              <el-option value="Reserved" lable="Reserved"></el-option>
              <el-option value="Sold" lable="Sold"></el-option>
              <el-option value="SPA Sign" lable="SPA Sign"></el-option>
              <el-option value="SPA Stamp" lable="SPA Stamp"></el-option>
            </el-select>
            <div v-else>{{ scope.row.requiredFor }}</div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('documentGeneration.DisplayOrder')">
          <template slot-scope="scope">
            <el-input
              size="mini"
              v-if="scope.$index === tableDataInit"
              v-model="displayOrder"
            ></el-input>
            <div v-else>{{ scope.row.displayOrder }}</div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('update')" width="120">
          <template slot-scope="scope">
            <uploader
              :isDisabled="
                Boolean(scope.$index == tableDataInit && scope.row.docId)
              "
              :fileId="'documentTable' + scope.row.docId"
              :maxSize="100"
              :uploadParam="uploadTableParam"
              @uploadAfter="uploadTableAfter"
              :url="$api.uploadDocument"
              fileType=".docx"
              :selfNum="self"
              :btnText="{ import: $t('documentGeneration.SelectFile') }"
              :showType="1"
            ></uploader>
          </template>
        </el-table-column>
        <el-table-column :label="$t('documentGeneration.Download')">
          <template slot-scope="scope">
            <el-button
              size="mini"
              plain
              :disabled="scope.$index === tableDataInit || self == 0"
              @click="downDocument(scope.row)"
              >{{ $t('documentGeneration.Download') }}</el-button
            >
          </template>
        </el-table-column>
        <!-- <el-table-column :label="$t('附件')">
          <template slot-scope="scope">
            <uploader
              v-if="scope.$index == tableDataInit"
              :isDisabled="
                Boolean(scope.$index == tableDataInit && scope.row.docId)
              "
              :fileId="'documentTable' + scope.row.docId"
              :maxSize="100"
              :uploadParam="uploadTableParam"
              @uploadAfter="uploadTableAfter"
              :url="$api.uploadDocument"
              fileType=".pdf"
              :selfNum="self"
              :btnText="{ import: '上传' }"
              :showType="1"
            ></uploader>
            <el-button 
            v-else
            size="mini"
            @click="downDocument(scope.row)"
            >
              下载
            </el-button>
          </template>
        </el-table-column> -->
        <el-table-column :label="$t('Delete')">
          <template slot-scope="scope">
            <el-button
              size="mini"
              plain
              :disabled="scope.$index === tableDataInit || self == 0"
              @click="deleteData(scope.row)"
              >{{ $t('Delete') }}</el-button
            >
          </template>
        </el-table-column>
        <el-table-column :label="$t('userLists.edit')" width="180">
          <template slot-scope="scope">
            <template v-if="scope.$index === tableDataInit">
              <el-button
                :disabled="self == 0"
                size="mini"
                plain
                @click="update(scope.row)"
                >{{ $t('update') }}</el-button
              >
              <el-button
                :disabled="self == 0"
                size="mini"
                plain
                @click="cancel(scope.row, scope.$index)"
                >{{ $t('cancel') }}</el-button
              >
            </template>
            <template v-else>
              <el-button
                size="mini"
                plain
                :disabled="self == 0"
                @click="edit(scope.row, scope.$index)"
                >{{ $t('userLists.edit') }}</el-button
              >
            </template>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="watermarking" v-if="navIndex == 2">
      <div class="prompt_text">
        <el-alert
          :title="$t('documentGeneration.waterImageCommand')"
          type="info"
          :closable="false"
        ></el-alert>
      </div>
      <div class="upload_waterImg">
        <uploader
          fileId="waterFile"
          :maxSize="50"
          :uploadParam="uploadwaterParam"
          @uploadAfter="uploadwaterAfter"
          :url="$api.uploadWatermark"
          fileType=".png"
          :selfNum="self"
          :btnText="{
            select: $t('documentGeneration.SelectFile'),
            import: $t('update'),
          }"
        ></uploader>
        <el-button :disabled="self == 0" size="mini" @click="downWater">{{
          $t('documentGeneration.Download')
        }}</el-button>
        <el-button size="mini" @click="deleteWater" :disabled="self == 0">{{
          $t('documentGeneration.DeleteWatermarkImage')
        }}</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import uploader from '@/components/uploader'
export default {
  components: {
    uploader,
  },
  data() {
    return {
      navIndex: 1,
      self: JSON.parse(sessionStorage.getItem('projectDesc')).self,
      id: JSON.parse(sessionStorage.getItem('projectDesc') || '{}').id || '',
      hostUrl: sessionStorage.getItem('serveUrl') || '',
      tableList: [],
      tableDataInit: -1,
      title: '',
      active: 1,
      isSensitive: 1,
      allowUpload: 1,
      allowGenerate: 1,
      needWatermark: 1,
      requiredFor: 'None',
      otpNo: '',
      displayOrder: '',
      uploadwaterParam: [],
      waterPath: '',
      uploadTableParam: [],
      type: '',
      typeList: [
        {
          type: 1,
          name: 'PDI',
        },
        {
          type: 2,
          name: 'OTP',
        },
        {
          type: 3,
          name: 'Other',
        },
      ],
    }
  },
  mounted() {
    this.getListData()
    this.queryWatermark()
    this.uploadwaterParam = [{ name: 'projectId', value: this.id }]
    this.uploadTableParam = [
      { name: 'projectId', value: this.id },
      { name: 'docId', value: '' },
    ]
  },
  methods: {
    downDocument(row) {
      if (!row.path) {
        console.log(row)
        this.$alertWarn(this.$t('documentGeneration.noFile'))
      } else {
        window.location.href = this.hostUrl + row.path
      }
    },
    uploadTableAfter() {},
    cancel(row, index) {
      if (index == 0) {
        if (row.docId === undefined) {
          this.tableList.shift()
        }
      }
      this.cancelAddData()
    },
    cancelAddData() {
      this.title = ''
      this.active = 1
      this.isSensitive = 1
      this.allowUpload = 1
      this.allowGenerate = 1
      this.needWatermark = 1
      this.requiredFor = 'None'
      this.otpNo = ''
      this.displayOrder = ''
      this.tableDataInit = -1
      this.type = ''
    },
    deleteData(row) {
      this.$confirm(
        this.$t('alert.alert_delete'),
        this.$t('alert.alert_command'),
        {
          confirmButtonText: this.$t('alert.sure'),
          cancelButtonText: this.$t('alert.cancel'),
          type: 'warning',
        }
      ).then(() => {
        this.$Geting(this.$api.deleteDocument, {
          docId: row.docId,
        }).then((res) => {
          if (res.code == 0) {
            if (row.path) {
              this.$deleteFile(this.hostUrl + row.path)
            }
            this.$notify.success({
              title: this.$t('alert.alert_success_title'),
              message: this.$t('alert.alert_success_delete_title'),
            })
            this.getListData()
          } else {
            this.$notify.error({
              title: this.$t('alert.fail'),
              message: this.$t('alert.alert_fail_delete_title'),
            })
          }
        })
      })
    },
    update(row) {
      this.$Posting(this.$api.saveDocument, {
        projectId: this.id,
        docId: row.docId,
        title: this.title,
        active: this.active,
        isSensitive: this.isSensitive,
        allowUpload: this.allowUpload,
        allowGenerate: this.allowGenerate,
        needWatermark: this.needWatermark,
        requiredFor: this.requiredFor,
        displayOrder: this.displayOrder,
        otpNo: this.otpNo,
        type: this.type
      }).then((res) => {
        if (res.code == 0) {
          this.$notify.success({
            title: this.$t('alert.alert_success_title'),
            message: this.$t('alert.operate_success_title'),
          })
          this.getListData()
        } else {
          this.$notify.error({
            title: 'fail',
            message: res.msg,
          })
          return false
        }
      })
    },
    edit(row, index) {
      this.tableDataInit = index
      this.title = row.title
      this.active = row.active
      this.isSensitive = row.isSensitive
      this.allowUpload = row.allowUpload
      this.allowGenerate = row.allowGenerate
      this.needWatermark = row.needWatermark
      this.requiredFor = row.requiredFor
      this.otpNo = row.otpNo
      this.displayOrder = row.displayOrder
      this.uploadTableParam[1].value = row.docId
      this.type = row.type
    },
    changeIndex(index) {
      this.navIndex = index
    },
    uploadwaterAfter() {
      this.queryWatermark()
    },
    addRecord() {
      this.tableList.unshift({})
      this.tableDataInit = 0
    },
    //获取列表数据
    getListData() {
      this.cancel()
      this.$Geting(this.$api.queryDocumentList, {
        projectId: this.id,
        // pageSize: this.pageSize,
        // pageNo: this.currentPage
      }).then((res) => {
        if (res.code == 0) {
          // this.userList = res.datas.lists;
          // this.userNum = res.datas.count;
          this.tableList = res.datas
        } else {
          this.$notify.error({
            title: 'fail',
            message: res.msg,
          })
          return false
        }
      })
    },
    queryWatermark() {
      //查询水印图片
      this.$Geting(this.$api.queryWatermark, {
        projectId: this.id,
      }).then((res) => {
        if (res.code == 0) {
          this.waterPath = res.datas.path
        } else {
          this.$notify.error({
            title: 'fail',
            message: res.msg,
          })
          return false
        }
      })
    },
    downWater() {
      if (this.waterPath) {
        let url = this.hostUrl + this.waterPath
        window.open(url)
      } else {
        this.$alertWarn(this.$t('documentGeneration.noFile'))
      }
    },
    deleteWater() {
      if (this.waterPath) {
        this.$Geting(this.$api.deleteWatermark, {
          projectId: this.id,
        }).then((res) => {
          if (res.code == 0) {
            this.$notify.success({
              title: this.$t('alert.alert_success_title'),
              message: this.$t('alert.alert_success_delete_title'),
            })
            this.queryWatermark()
          } else {
            this.$notify.error({
              title: this.$t('alert.fail'),
              message: this.$t('alert.alert_fail_delete_title'),
            })
          }
        })
      } else {
        this.$alertWarn(this.$t('documentGeneration.noFile'))
      }
    },
  },
}
</script>
<style lang="less">
.document_generation_wrapper {
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
      .btn_col {
        text-align: right;
      }
    }
  }
  .import_site,
  .watermarking {
    position: absolute;
    top: 64px;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: auto;
    padding: 18px;
    .upload_waterImg {
      margin: 15px;
    }
  }
}
</style>

