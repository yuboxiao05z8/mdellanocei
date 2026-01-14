<template>
  <div class="PDIFilesList">
    <div class="floor_plan_image floor_plan">
      <el-row class="row_header">
        <el-col :span="4" class="col_text">Update File 1</el-col>
        <el-col :span="6" class="col_button">
          <uploader
            fileId="floorImage"
            :maxSize="50"
            :selfNum="self"
            :uploadParam="[...uploadParam, { name: 'type', value: 1 }]"
            @uploadAfter="uploadImgAfter"
            :url="$api.uploadPdiFile"
            fileType=".jpg,.png,.zip"
            :btnText="{
              select: 'Select File',
              import: 'Import',
            }"
          ></uploader>
        </el-col>
        <el-col :span="14" class="col_text_info"
          >Support both Zip/Single file upload. File Name (Building Name@ FloorPlan Name@ unit type)</el-col
        >
      </el-row>
    </div>
    <div class="floor_plan_image floor_plan">
      <el-row class="row_header">
        <el-col :span="4" class="col_text">Update File 2</el-col>
        <el-col :span="6" class="col_button">
          <uploader
            fileId="floorImage2"
            :maxSize="50"
            :selfNum="self"
            :uploadParam="[...uploadParam, { name: 'type', value: 2 }]"
            @uploadAfter="uploadImgAfter"
            :url="$api.uploadPdiFile"
            fileType=".jpg,.png,.zip"
            :btnText="{
              select: 'Select File',
              import: 'Import',
            }"
          ></uploader>
        </el-col>
        <el-col :span="14" class="col_text_info"
          >Support both Zip/Single file upload. File Name (Building Name@ FloorPlan Name@ unit type)</el-col
        >
      </el-row>
    </div>

    <div class="tab_list">
      <el-table
        border
        :header-cell-style="{ background: '#f5f7fa' }"
        class="Document_content_div_tab"
        :data="DocumentList"
        style="width: 100%"
        max-height="450"
      >
        <el-table-column label="Building Name" prop="building">
        </el-table-column>
        <el-table-column label="Floor Plan" prop="floorPlan"></el-table-column>
        <el-table-column label="Unit Type" prop="type"></el-table-column>
        <el-table-column label="Flie 1" width="200">
          <template slot-scope="scope">
            <div class="Have_picture" v-if="scope.row.img1">
              <!-- <i
                class="el-icon-error"
                @click="DeleteFn(scope.row.img1, 'img')"
              ></i> -->
              <el-image
                class="img_div"
                :src="$urlEncode(hostUrl + scope.row.img1)"
                :preview-src-list="[$urlEncode(hostUrl + scope.row.img1)]"
              >
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>
            </div>
            <div class="no_picture" v-else></div>
          </template>
        </el-table-column>
        <el-table-column label="Flie 2"  width="200">
          <template slot-scope="scope">
            <div class="Have_picture" v-if="scope.row.img2">
              <!-- <i
                class="el-icon-error"
                @click="DeleteFn(scope.row.img2, 'img')"
              ></i> -->
              <el-image
                class="img_div"
                :src="$urlEncode(hostUrl + scope.row.img2)"
                :preview-src-list="[$urlEncode(hostUrl + scope.row.img2)]"
              >
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>
            </div>
            <div class="no_picture" v-else></div>
          </template>
        </el-table-column>
        <el-table-column label="Edit">
          <template slot-scope="scope">
            <el-button size="mini" @click="DeleteFn(scope.row)"
              >Delete</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="page_section">
        <el-pagination
          background
          layout="total,prev, pager, next"
          @current-change="handleCurrentChange"
          :page-size="pageSize"
          :total="total"
        ></el-pagination>
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
      self: JSON.parse(sessionStorage.getItem('projectDesc')).self,
      uploadParam: [],
      pageNo: 1,
      pageSize: 8,
      userInfo: {},
      projectId: '',
      DocumentList: [],
      total: 0,
      hostUrl: sessionStorage.getItem('serveUrl'),
    }
  },
  mounted() {
    let projectDesc = JSON.parse(sessionStorage.getItem('projectDesc'))
    this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    this.projectId = projectDesc.id
    this.uploadParam = [{ name: 'projectId', value: projectDesc.id }]

    this.queryPdiFileList()
  },
  methods: {
    uploadImgAfter() {
      this.$nextTick(() => {
        this.queryPdiFileList()
      })
    },
    queryPdiFileList() {
      let data = {
        projectId: this.projectId,
        pageNo: this.pageNo,
        pageSize: this.pageSize,
      }
      this.$Posting(this.$api.queryPdiFileList, data).then((res) => {
        if (res.code == 0) {
          this.total = res.datas.count
          this.DocumentList = res.datas.lists
        }
      })
    },
    handleCurrentChange(val) {
      this.pageNo = val
      this.queryPdiFileList()
    },
    DeleteFn(row, type) {
      let api = this.$api.deletePdiFile
      let data = {}
      switch (type) {
        case 'img':
          break

        default:
          data.id = row.id
          break
      }

      let _this = this

      this.$confirm('Are you sure you want to delete it?', 'Caution', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning',
      })
        .then(() => {
          _this.$Post(api, data).then((res) => {
            if (res.code == 0) {
              _this.$notify({
                title: 'Success',
                message: 'successfully delete',
                type: 'success',
              })
              this.queryPdiFileList()
            } else {
              _this.$notify.error({
                title: 'error',
                message: res.msg,
              })
            }
          })
        })
        .catch(() => {})
    },
  },
}
</script>


<style lang="less">
.PDIFilesList {
  width: 100%;
  height: 100%;
  background: #fff;
  .floor_plan {
    padding: 15px;
    border-bottom: 1px solid #dcdfe6;
  }
  .row_header {
    .col_text {
      padding: 4px 0;
      text-align: center;
    }
    .col_text_info {
      padding: 6px 0;
      font-size: 12px;
      color: #999;
      text-align: center;
    }
    .col_button {
      text-align: right;
    }
  }
  .close_ljt {
    cursor: pointer;
    font-size: 16px;
    margin-left: 5px;
    position: relative;
    top: 2px;
  }
  .tab_list {
    padding: 15px;
    .Document_content_div_tab {
      border: 1px solid #f4f4f4;
      .el-icon-circle-close {
        color: crimson;
      }
      .image-slot {
        width: 100%;
        height: 100%;
        line-height: 60px;
        background: #f4f4f4;
      }
      .Have_picture {
        position: relative;
        width: 100px;
        height: 60px;
        margin: 0 auto;
        .el-icon-error {
          position: absolute;
          font-size: 25px;
          background: #fff;
          border-radius: 50%;
          color: red;
          right: 0;
          top: 0;
          z-index: 100;
          opacity: 0.2;
          cursor: pointer;
        }
        &:hover {
          .el-icon-error {
            opacity: 1;
          }
        }
      }
      .img_div {
        width: 100%;
        height: 100%;
        background: #999;
        border-radius: 5px;
        img {
          object-fit: contain;
        }
      }
    }
  }
}
</style>