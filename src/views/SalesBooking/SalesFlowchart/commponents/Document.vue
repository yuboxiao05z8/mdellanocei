<template>
  <div class="Document_content sonBox">
    <div class="case">
      <div class="lfLable">Booking of Unit</div>
      <div class="fromDiv publicity">
        <h1>
          Option Date
          <span>{{ documentObj.OptionDate }}</span>
        </h1>
        <h1>
          System No.
          <span>{{ documentObj.SystemNo }}</span>
        </h1>
      </div>
      <div class="fromDiv Document_content_div">
        <el-table
          border
          :header-cell-style="{ background: '#f5f7fa' }"
          class="Document_content_div_tab"
          :data="tableData"
          style="width: 100%"
        >
          <el-table-column label="No." prop="method">
            <template slot-scope="scope">{{ scope.$index + 1 }}</template>
          </el-table-column>
          <el-table-column label="Documet" prop="title"></el-table-column>
          <el-table-column label="Photo" prop="chequeNo" width="300">
            <template slot-scope="scope" v-if="scope.row.allowGenerate == 1">
              <div
                class="img_div"
                v-for="(item, index) in scope.row.url"
                :key="index"
              >
                <i
                  @click="deleteImg(scope.row, item)"
                  class="el-icon-error"
                ></i>
                <el-image
                  :src="hostUrl + item"
                  :preview-src-list="[hostUrl + item]"
                >
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="edit" width="400">
            <template slot-scope="scope">
              <el-button
                size="mini"
                v-if="scope.row.allowGenerate == 0"
                @click="ViewFn(scope.row)"
                >View</el-button
              >

              <el-upload
                class="upload-demo"
                :action="baseURL + $api.uploadTransactionFile"
                accept="image/*"
                :data="{
                  ...upDataObj,
                  docId: scope.row.docId,
                  id: scope.row.id,
                }"
                :limit="30"
                auto-upload
                :on-success="upImgSuccess"
                :on-error="upImgError"
                v-if="scope.row.allowGenerate == 1"
                :show-file-list="false"
              >
                <el-button
                  size="small"
                  type="primary"
                  v-if="scope.row.url.length < 2"
                  >Click on the upload</el-button
                >
                <div slot="tip" class="el-upload__tip">
                  Only JPG/PNG files and no more than 1MB can be uploaded
                </div>
              </el-upload>
              <el-button
                size="mini"
                v-if="scope.row.allowGenerate == 0"
                @click="VersionView(scope.row)"
                >Version</el-button
              >
              <el-button
                size="mini"
                v-if="scope.row.allowGenerate == 0"
                @click="GenerateFn(scope.row)"
                :disabled="isDisabled"
                >Generate</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog title="Version" center :visible.sync="dialogVisible" width="40%">
      <div>
        <el-table
          border
          class="Document_content_div_tab"
          :data="VersionData"
          style="width: 100%"
        >
          <el-table-column label="Date" prop="createTime"> </el-table-column>
          <el-table-column label="Adimin" prop="agentName"></el-table-column>

          <el-table-column label="edit">
            <template slot-scope="scope">
              <el-button size="mini" @click="ViewFn(scope.row)">View</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { baseURL } from '@/InterfaceConfig/env'
export default {
  props: {
    documentObj: {
      type: Object,
    },
  },
  data() {
    return {
      tableData: [],
      SystemNo: '',
      upDataObj: {
        projectId: this.$route.query.projectId,
        unitId: this.$route.query.unitId,
        agentId: JSON.parse(sessionStorage.getItem('userInfo')).agentId,
        recordId: this.documentObj.recordId,
        brokeId: JSON.parse(sessionStorage.getItem('userInfo')).brokeId,
        token: JSON.parse(sessionStorage.getItem('userInfo')).token,
        source: 'manager',
        userId: JSON.parse(sessionStorage.getItem('userInfo')).agentId,
      },
      hostUrl: sessionStorage.getItem('serveUrl'),
      baseURL: baseURL,
      isDisabled: false,
      VersionData: [],
      dialogVisible: false,
    }
  },
  mounted() {
    this.queryDocumentList()
  },
  methods: {
    ViewFn(row) {
      if (!row.url) {
        this.$notify.error({
          title: 'Error',
          message: 'No file, click Generate!',
        })
        return false
      }
      window.open(this.hostUrl + row.url)
    },
    VersionView(row) {
      let data = {
        docId: row.docId,
        unitId: this.$route.query.unitId,
        recordId: this.documentObj.recordId,
      }
      this.$Posting(this.$api.queryDocumentsVersion, data).then((res) => {
        if (res.code == 0) {
          this.VersionData = res.datas
          this.dialogVisible = true
        } else {
          this.$notify.error({
            title: 'Error',
            message: res.msg,
          })
        }
      })
    },
    GenerateFn(row) {
      let data = {
        docId: row.docId,
        projectId: this.$route.query.projectId,
        unitId: this.$route.query.unitId,
        recordId: this.documentObj.recordId,
      }
      this.isDisabled = true
      this.$Posting(this.$api.transactionGenerate, data).then((res) => {
        this.isDisabled = false
        if (res.code == 0) {
          this.$notify({
            title: 'Success',
            message: 'Generated File!',
            type: 'success',
          })
          this.queryDocumentList()
        } else {
          this.$notify.error({
            title: 'Error',
            message: res.msg,
          })
        }
      })
    },
    queryDocumentList() {
      this.$Posting(this.$api.queryDocumentsList, {
        projectId: this.$route.query.projectId,
        recordId: this.documentObj.recordId,
        unitId: this.$route.query.unitId,
      }).then((res) => {
        if (res.code == 0) {
          this.tableData = res.datas.map((i) => {
            return { ...i, url: i.url ? i.url.split(';') : [] }
          })
          console.log(this.tableData)
        }
      })
    },
    upImgSuccess(response, file, fileList) {
      if (response.code == 0) {
        this.queryDocumentList()
      } else {
        this.$notify.error({
          title: 'Error',
          message: response.msg,
        })
      }
    },
    upImgError(err, file, fileList) {
      console.log('err', err, file, fileList)
    },
    deleteImg(row, url) {
      let _this = this
      this.$confirm(
        'This action will delete the photo completly, Whether or not to continue?',
        'Caution',
        {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning',
        }
      )
        .then(() => {
          let data = {
            id: row.id,
            url: url
          }
          _this.$Post(_this.$api.deleteTransactionFile, data).then((res) => {
            if (res.code == 0) {
              _this.$notify({
                title: 'Success',
                message: 'successfully delete',
                type: 'success',
              })
              this.queryDocumentList()
            } else {
              _this.$notify.error({
                title: 'error',
                message: res.msg,
              })
            }
          })
        })
        .catch(() => {})
      console.log(row, url)
    }
  },
}
</script>

<style lang="less">
.Document_content {
  .publicity {
    padding: 20px;
    h1 {
      margin-bottom: 15px;
      color: #999;
      padding-left: 30px;
      span {
        color: #000;
        margin-left: 20px;
      }
    }
  }
  .Document_content_div {
    padding: 20px 30px !important;
  }
  .Document_content_div_tab {
    border: 1px solid #f4f4f4;
    td,
    th {
      text-align: center;
    }
    .el-icon-circle-close {
      color: crimson;
    }
    .img_div {
      background: #999;
      width: 100px;
      height: 80px;
      display: inline-block;
      border-radius: 5px;
      position: relative;
      &:hover{
        .el-icon-error{
          opacity: 1;
        }
      }
      .el-icon-error {
        position: absolute;
        font-size: 25px;
        right: -5px;
        opacity: 0;
        top: 0;
        z-index: 100;
        box-shadow: 0 0 5px #000;
        border-radius: 50%;
        color: red;
        background: #fff;
        transition: all 0.2s;
      }
      &:last-child {
        margin-left: 15px;
      }
      .el-image {
        width: 100%;
        height: 100%;
      }
      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }
    .image-slot {
      width: 100%;
      height: 100%;
      line-height: 60px;
      background: #f4f4f4;
    }
  }
}
</style>