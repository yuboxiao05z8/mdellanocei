<template>
  <div class="stimulate">
    <div class="nav">
      <div class="nav-title">
        <el-row>
          <el-col :span="8">
            <span style="padding:8px 0;margin-right:15px">{{$t('High commission incentive')}}</span>
          </el-col>
          <el-col :span="16" style="text-align:right"></el-col>
        </el-row>
      </div>
      <div class="nav-search">
        <el-row>
          <el-col :span="16">
            <el-input
              style="width:300px"
              size="mini"
              :placeholder="$t('input key words')"
              v-model="searchName"
            ></el-input>
            <el-select v-model="status" size="mini" :placeholder="$t('input key words')">
              <el-option
                v-for="item in stateList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-button @click="queryProjectAdvert" size="mini">{{$t('inventoryLists.Search')}}</el-button>
          </el-col>
          <el-col :span="8" style="text-align:right">
            <el-button size="mini" @click.native="dialogVisible = true">{{$t('Add the plan')}}</el-button>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="tabList">
      <el-table
        :data="tabList"
        border
        style="width: 100%"
        :header-cell-style="{'background':'#f5f7fa'}"
        size="mini"
      >
        <el-table-column  width="200" :label="$t('title')">
          <template slot-scope="scope">
            <div>{{scope.row.title}}</div>
          </template>
        </el-table-column>
        <el-table-column width="150" :label="$t('illustration')">
          <template slot-scope="scope">
            <img
              @click.stop="$imgPreview(serveUrl+scope.row.logo)"
              :src="serveUrl+scope.row.logo"
              alt
            />
          </template>
        </el-table-column>
        <el-table-column width="200" :label="$t('project name')">
          <template slot-scope="scope">
            <div>{{scope.row.projectName}}</div>
          </template>
        </el-table-column>
        <el-table-column width="100" :label="$t('start date')">
          <template slot-scope="scope">
            <div>{{$dateFormatNoTime( Number(scope.row.startTime))}}</div>
          </template>
        </el-table-column>
        <el-table-column width="100" :label="$t('ending date')">
          <template slot-scope="scope">
            <div>{{$dateFormatNoTime( Number(scope.row.endTime))}}</div>
          </template>
        </el-table-column>
        <el-table-column width="100" :label="$t('creation time')">
          <template slot-scope="scope">
            <div>{{$dateFormatNoTime( Number(scope.row.createTime))}}</div>
          </template>
        </el-table-column>
        <el-table-column width="100" :label="$t('status')">
          <template slot-scope="scope">
            <div v-if="scope.row.status == 1">{{$t('publish')}}</div>
            <div v-if="scope.row.status == 2">{{$t('revocation')}}</div>
          </template>
        </el-table-column>
        <el-table-column width="100" :label="$t('PV')">
          <template slot-scope="scope">
            <div>{{scope.row.viewNum}}</div>
          </template>
        </el-table-column>
        <el-table-column width="100" :label="$t('creator')">
          <template slot-scope="scope">
            <div>{{scope.row.createUserName}}</div>
          </template>
        </el-table-column>

        <el-table-column fixed="right"  width="400" :label="$t('userLists.edit')">
          <template slot-scope="scope">
            <template>
              <el-button
                @click="moveFn(scope.row,'up')"
                v-if="scope.row.status == 1"
                size="mini"
                plain
              >{{$t('move up')}}</el-button>
              <el-button
                @click="moveFn(scope.row,'down')"
                v-if="scope.row.status == 1"
                size="mini"
                plain
              >{{$t('move down')}}</el-button>
              <el-button
                v-if="scope.row.status == 1"
                size="mini"
                plain
                @click="editData(scope.row)"
              >{{$t('buildingPhases.edit')}}</el-button>
              <el-button
                @click="soldOutFn(scope.row)"
                v-if="scope.row.status == 1"
                size="mini"
                plain
              >{{$t('revocation')}}</el-button>
              <el-button
                @click="putawayFn(scope.row)"
                v-if="scope.row.status == 2"
                size="mini"
                plain
              >{{$t('publish')}}</el-button>
              <el-button
                v-if="scope.row.status == 2"
                size="mini"
                plain
                @click="deleteData(scope.row,scope.$index)"
              >{{$t('delete')}}</el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <div class="page_section" v-if="total">
        <el-pagination
          background
          small
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-sizes="[5,10]"
          :page-size="pageSize"
          layout="prev, pager, next,sizes,total"
          :total="total"
        ></el-pagination>
      </div>
    </div>

    <el-dialog
      :title="$t('Create/edit the plan')"
      center
      :visible.sync="dialogVisible"
      width="60%"
      @closed="closedFn"
    >
      <div class="dialogDiv">
        <el-form ref="form" :model="advertisingForm" label-width="150px">
          <el-form-item
            :label="$t('title')"
            prop="title"
            :rules="[{ required: true, message: $t('The title cannot be empty'),trigger: 'blur'},
            { min: 3, max: 40, message: $t('The length ranges from 3 to 40 characters'), trigger: 'blur' }]"
          >
            <el-input v-model="advertisingForm.title"></el-input>
          </el-form-item>
          <el-form-item
            :label="$t('developers')"
            prop="devBrokeId"
            :rules="[{ required: true, message: $t('Please select developer'),trigger: 'change'}]"
          >
            <el-select
              style="width:100%"
              v-model="advertisingForm.devBrokeId"
              filterable
              @change="getProjectFn"
              :placeholder="$t('pleaseSelect')"
            >
              <el-option
                v-for="item in Brokes"
                :key="item.brokeId"
                :label="item.brokeName"
                :value="item.brokeId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('project')"
            prop="projectId"
            :rules="[{ required: true, message: $t('pleaseSelect'),trigger: 'change'}]"
          >
            <el-select
              style="width:100%"
              v-model="advertisingForm.projectId"
              filterable
              @change="getProjectImg"
              :placeholder="$t('pleaseSelect')"
            >
              <el-option
                v-for="item in Projects"
                :key="item.projectId"
                :label="item.projectName"
                :value="item.projectId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('Custom illustration')">
            <el-switch v-model="isCustomImg"></el-switch>
          </el-form-item>
          <el-form-item :label="$t('Custom illustration')" v-if="isCustomImg">
            <uploaderImg
              :backData="customImg"
              :id="'calendayImg'"
              :mixLength="1"
              folder="brokeLogo"
            ></uploaderImg>
          </el-form-item>
          <el-form-item :label="$t('Project main photo')" v-if="!isCustomImg">
            <img
              class="mainImgDiv"
              @click.stop="$imgPreview(serveUrl+mainImage)"
              :src="serveUrl+mainImage"
              alt
            />
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item
                :label="$t('start date')"
                prop="startTime"
                :rules="[{ type: 'date', required: true, message: $t('Please select the start time'), trigger: 'change' }]"
              >
                <el-date-picker
                  style="width:100%"
                  value-format="timestamp"
                  v-model="advertisingForm.startTime"
                  type="date"
                  placeholder="Select Date"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('ending date')">
                <el-date-picker
                  style="width:100%"
                  value-format="timestamp"
                  v-model="advertisingForm.endTime"
                  type="date"
                  placeholder="Select Date"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="saveProjectAdvert">Ok</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import uploaderImg from '@/components/uploaderImg.vue'
export default {
  components: { uploaderImg },
  data() {
    return {
      searchName: '',
      tabList: [],
      pageSize: 5,
      currentPage: 1,
      total: 0,
      dialogVisible: false,
      advertisingForm: {
        advertId: '',
        type: 2
      },
      isCustomImg: false,
      customImg: [],
      Brokes: [],
      Projects: [],
      mainImage: '',
      serveUrl: sessionStorage.getItem('serveUrl'),
      stateList: [
        {
          label: this.$t('publish'),
          value: '1'
        },
        {
          label: this.$t('revocation'),
          value: '2'
        }
      ],
      status: ''
    }
  },
  mounted() {
    this.queryProjectAdvert()
    this.getBroke()
  },
  methods: {
    saveProjectAdvert() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.advertisingForm.startTime > this.advertisingForm.endTime) {
            this.$notify.error({
              title: 'fail',
              message: this.$t('The end time is greater than the start time')
            })
            return false
          }
          if (this.isCustomImg && !this.customImg.length) {
            this.$notify.error({
              title: 'fail',
              message: this.$t('Please submit custom pictures')
            })
            return false
          }
          console.log(this.advertisingForm, this.customImg)
          let data = JSON.parse(JSON.stringify(this.advertisingForm))
          data.logo = this.mainImage
          if (this.isCustomImg) {
            data.logo = this.customImg[0].url
          }
          this.$Posting(this.$api.saveProjectAdvert, data).then(res => {
            if (res.code == 0) {
              this.$notify({
                title: 'Success',
                message: 'Success',
                type: 'success'
              })
              this.queryProjectAdvert()
              if (this.customImg.length) {
                this.$changeSessionUploadImage([this.customImg[0].src])
              }
              this.dialogVisible = false
            } else {
              this.$notify.error({
                title: 'fail',
                message: res.msg
              })
            }
          })
        } else {
          return false
        }
      })
    },
    async getBroke() {
      let arr = await this.$Posting(this.$api.getBroke, { type: 2 })
      if (arr) {
        this.Brokes = arr.datas
      }
    },
    async queryProjectAdvert() {
      let data = {
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        type: 2,
        projectName: this.searchName,
        status: this.status
      }
      let arr = await this.$Post(this.$api.queryProjectAdvert, data)
      if (arr) {
        this.tabList = arr.datas.lists
        this.total = arr.datas.count
      }
    },
    getProjectFn(val, refresh = true) {
      let data = {
        pageSize: 10000,
        pageNo: 1,
        devBrokeId: val
      }
      this.$Post(this.$api.queryBrokeProject, data).then(res => {
        if (res.code == 0) {
          this.Projects = res.datas.lists
          if (this.advertisingForm.projectId && refresh) {
            this.advertisingForm.projectId = ''
            this.mainImage = ''
            this.customImg = []
            this.isCustomImg = false
          }
        }
      })
    },
    getProjectImg(val) {
      let arr = this.Projects.filter(i => i.projectId == val)
      if (arr.length) {
        this.mainImage = arr[0].mainImage
        this.customImg = []
        this.isCustomImg = false
      }
    },
    editData(item) {
      this.advertisingForm = {
        advertId: item.advertId,
        devBrokeId: item.brokeId,
        projectId: item.projectId,
        startTime: item.startTime,
        endTime: item.endTime,
        title: item.title,
        type: 2
      }
      this.getProjectFn(item.brokeId, false)
      if (item.isMainImg) {
        this.isCustomImg = false
        this.mainImage = item.mainImage
      } else {
        this.isCustomImg = true
        this.mainImage = item.mainImage
        this.customImg = [
          {
            url: item.logo,
            src: this.serveUrl + item.logo
          }
        ]
      }
      this.dialogVisible = true
    },
    deleteData(item) {
      this.$confirm(this.$t('Are you sure to delete it'), 'hint', {
        confirmButtonText: 'Ok',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(() => {
          this.$Post(this.$api.deleteProjectAdvert, {
            advertId: item.advertId
          }).then(res => {
            if (res.code == 0) {
              this.queryProjectAdvert()
              this.$notify({
                title: 'Success',
                message: 'Success',
                type: 'success'
              })
            } else {
              this.$notify.error({
                title: 'fail',
                message: res.msg
              })
            }
          })
        })
        .catch(() => {
        })
    },
    putawayFn(item) {
      this.$confirm(this.$t('Are you sure you want it on the shelf'), 'hint', {
        confirmButtonText: 'Ok',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(() => {
          this.$Post(this.$api.updateAdvertStatus, {
            advertId: item.advertId,
            status: 1
          }).then(res => {
            if (res.code == 0) {
              this.queryProjectAdvert()
              this.$notify({
                title: 'Success',
                message: 'Success',
                type: 'success'
              })
            } else {
              this.$notify.error({
                title: 'fail',
                message: res.msg
              })
            }
          })
        })
        .catch(() => {
        })
    },
    soldOutFn(item) {
      this.$confirm(this.$t('Are you sure you want to take it off the shelf'), 'hint', {
        confirmButtonText: 'Ok',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(() => {
          this.$Post(this.$api.updateAdvertStatus, {
            advertId: item.advertId,
            status: 2
          }).then(res => {
            if (res.code == 0) {
              this.queryProjectAdvert()
              this.$notify({
                title: 'Success',
                message: 'Success',
                type: 'success'
              })
            } else {
              this.$notify.error({
                title: 'fail',
                message: res.msg
              })
            }
          })
        })
        .catch(() => {
        })
    },
    moveFn(item, type) {
      this.$Post(this.$api.move, {
        advertId: item.advertId,
        moveType: type
      }).then(res => {
        if (res.code == 0) {
          this.queryProjectAdvert()
          this.$notify({
            title: 'Success',
            message: res.msg,
            type: 'success'
          })
        } else {
          this.$notify.error({
            title: 'fail',
            message: res.msg
          })
        }
      })
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.queryProjectAdvert()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.queryProjectAdvert()
    },
    closedFn() {
      this.customImg = []
      this.advertisingForm = {
        advertId: '',
        type: 2
      }
    }
  },
  beforeDestroy() {
    this.$deleteImg()
  }
}
</script>

<style lang="less">
.stimulate {
  .nav-title,
  .nav-search {
    background: #fff;
    padding: 10px;
    margin-bottom: 10px;
  }
  .tabList {
    text-align: center;
    padding: 10px;
    background: #fff;
    img {
      width: 100%;
    }
  }
  .mainImgDiv {
    width: 80px;
    height: 80px;
    margin-right: 10px;
    float: left;
    text-align: center;
    line-height: 80px;
    border: 1px dashed #ececec;
    font-size: 30px;
    cursor: pointer;
  }
}
</style>