<template>
  <div class="calendar_wrapper">
    <div class="calendar_list calendar_section">
      <el-row class="row_header">
        <el-col :span="6" class="col_text">
          {{$t('calendar.ManageCalendar')}}
        </el-col>
        <el-col :span="18" class="col_button">
          <el-button size="mini" @click="addCalendar">{{$t('calendar.AddCalendar')}}
          </el-button>
          <el-button size="mini" @click="refresh">{{$t('Refresh')}}
          </el-button>
        </el-col>
      </el-row>
    </div>
    <div class="calendar_list_table calendar_section">
      <el-form :inline="true" size="mini">
        <el-form-item :label="$t('calendar.title')">
          <el-input v-model="searchForm.title"></el-input>
        </el-form-item>
        <el-form-item :label="$t('calendar.startTime')">
          <el-date-picker v-model="searchForm.startTime" type="date" :placeholder="$t('calendar.startTime')" value-format="yyyy-MM-dd" format="dd-MMM-yyyy">
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('calendar.endTime')">
          <el-date-picker v-model="searchForm.endTime" type="date" :placeholder="$t('calendar.endTime')" value-format="yyyy-MM-dd" format="dd-MMM-yyyy">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button @click="searchFun">{{$t('userLists.search')}}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="clearFun">{{$t('userLists.clear')}}</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="calendarList" border style="width: 100%" :header-cell-style="{'background':'#f5f7fa'}" size="mini">
        <el-table-column :label="$t('calendar.calendarDate')">
          <template slot-scope="scope">
            <div>{{scope.row.calendarDate}}</div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('calendar.startTime')">
          <template slot-scope="scope">
            <div>{{scope.row.startTime}}</div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('calendar.endTime')">
          <template slot-scope="scope">
            <div>{{scope.row.endTime}}</div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('calendar.title')" prop="title">
        </el-table-column>
        <el-table-column :label="$t('calendar.content')" prop="content">
        </el-table-column>
        <el-table-column :label="$t('calendar.address')" prop="address">
        </el-table-column>
        <el-table-column :label="$t('Delete')">
          <template slot-scope="scope">
            <el-button size="mini" plain @click="deleteData(scope.row)">{{$t('Delete')}}</el-button>
          </template>
        </el-table-column>
        <el-table-column :label="$t('Edit')" width="160">
          <template slot-scope="scope">
            <el-button size="mini" plain @click="editData(scope.row)">{{$t('Edit')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page_section" v-if="calendarNum">
        <el-pagination background small @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-sizes="[5,10,30,50,100]" :page-size="pageSize" layout="prev, pager, next,sizes,total" :total="calendarNum">
        </el-pagination>
      </div>
    </div>
    <el-dialog title="Edit Calendar" :visible.sync="dialogVisible" width="700px" class="calendar_dialog">
      <el-form size="mini" label-width="120px" ref="ruleForm" :model="ruleForm" :rules="rules">
        <el-form-item :label="$t('calendar.title')" prop="title">
          <el-input class="input_375" v-model="ruleForm.title"></el-input>
        </el-form-item>
        <el-form-item :label="$t('calendar.calendarDate')" prop="calendarDate">
          <el-date-picker v-model="ruleForm.calendarDate" type="date" :placeholder="$t('calendar.calendarDate')" class="input_375" value-format="dd-MMM-yyyy" format="dd-MMM-yyyy">
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('calendar.startTime')" prop="startTime">
          <el-time-select :placeholder="$t('calendar.startTime')" v-model="ruleForm.startTime" class="input_375" :picker-options="{ start: '00:00',step: '00:05',end: '23:55'}"></el-time-select>
        </el-form-item>
        <el-form-item :label="$t('calendar.endTime')" prop="endTime">
          <el-time-select :placeholder="$t('calendar.endTime')" v-model="ruleForm.endTime" class="input_375" :picker-options="{ start: '00:00',step: '00:05',end: '23:55', minTime: ruleForm.startTime}">></el-time-select>
        </el-form-item>
        <el-form-item :label="$t('calendar.address')" prop="address">
          <el-input class="input_375" v-model="ruleForm.address"></el-input>
        </el-form-item>
        <el-form-item :label="$t('calendar.content')" prop="content">
          <el-input type="textarea" class="input_375" :rows="4" v-model="ruleForm.content"></el-input>
        </el-form-item>
        <el-form-item :label="$t('picture')" prop="calendayImgs">
          <uploaderImg :backData="ruleForm.calendayImgs" :id="'calendayImg'" :mixLength='3' folder="calendarImg" :maxSize="1000"></uploaderImg>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">{{$t('edit.cancel')}}</el-button>
        <el-button type="primary" size="small" @click="submitForm">{{$t('edit.update')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import uploaderImg from "@/components/uploaderImg.vue";
export default {
  components: {
    uploaderImg
  },
  data () {
    return {
      calendarList: [],
      currentPage: 1,
      pageSize: 5,
      calendarNum: 0,
      dialogVisible: false,
      ruleForm: {
        title: "",
        calendarDate: "",
        startTime: "",
        endTime: "",
        address: "",
        content: "",
        calendayImgs: []
      },
      searchForm: {
        title: "",
        startTime: "",
        endTime: ""
      },
      rules: {
        title: [
          { required: true, message: "title is require", trigger: "blur" }
        ],
        calendarDate: [
          {
            required: true,
            message: "calendarDate is require",
            trigger: "change"
          }
        ],
        startTime: [
          {
            required: true,
            message: "startTime is require",
            trigger: "change"
          }
        ],
        endTime: [
          {
            required: true,
            message: "endTime is require",
            trigger: "change"
          }
        ],
        address: [
          { required: true, message: "address is require", trigger: "blur" }
        ],
        content: [
          { required: true, message: "content is require", trigger: "blur" }
        ]
      },
      hostUrl: window.sessionStorage.getItem("serveUrl") || "",
      id: ""
    };
  },
  mounted () {
    this.getListData();
  },
  watch: {
    dialogVisible (now) {
      if (!now) {
        this.$refs["ruleForm"].clearValidate();
      }
    }
  },
  methods: {
    clearFun () {
      this.searchForm.title = "";
      this.searchForm.startTime = "";
      this.searchForm.endTime = "";
      this.searchFun();
    },
    searchFun () {
      this.currentPage = 1;
      this.getListData();
    },
    submitForm () {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          let imgs = "";
          this.ruleForm.calendayImgs.forEach(v => {
            imgs += `${v.url},`;
          });
          this.$Posting(this.$api.saveCalendar, {
            title: this.ruleForm.title,
            calendarDate: this.ruleForm.calendarDate,
            startTime: this.ruleForm.startTime,
            endTime: this.ruleForm.endTime,
            address: this.ruleForm.address,
            content: this.ruleForm.content,
            imgs: imgs ? imgs.slice(0, -1) : "",
            id: this.id,
          }).then(res => {
            if (res.code == 0) {
              this.dialogVisible = false;
              let newUploadImg = this.$changeUploadImg(
                this.ruleForm.calendayImgs
              ); //获取提交的图片数组
              this.$changeSessionUploadImage(newUploadImg); //提交的图片数组和session里面做比对进行并处理session
              this.$notify.success({
                title: this.$t("alert.alert_success_title"),
                message: this.$t("alert.operate_success_title")
              });
              this.getListData();
            } else {
              this.$notify.error({
                title: "fail",
                message: res.msg
              });
              return false;
            }
          });
        } else {
          return false;
        }
      });
    },
    addCalendar () {
      this.dialogVisible = true;
      this.ruleForm = {
        title: "",
        calendarDate: "",
        startTime: "",
        endTime: "",
        address: "",
        content: "",
        calendayImgs: []
      };
      this.id = ''
    },
    editData (row) {
      this.dialogVisible = true;
      this.ruleForm = {
        title: row.title,
        calendarDate: row.calendarDate,
        startTime: row.startTime,
        endTime: row.endTime,
        address: row.address,
        content: row.content,
        calendayImgs: []
      };
      this.id = row.id;
      if (row.imgs) {
        let imgArr = row.imgs.split(",");
        imgArr.forEach(v => {
          this.ruleForm.calendayImgs.push({
            src: this.hostUrl + v,
            url: v
          });
        });
      }
    },
    deleteData (row) {
      this.$confirm(
        this.$t("alert.alert_delete"),
        this.$t("alert.alert_command"),
        {
          confirmButtonText: this.$t("alert.sure"),
          cancelButtonText: this.$t("alert.cancel"),
          type: "warning"
        }
      ).then(() => {
        this.$Geting(this.$api.deleteCalendar, {
          id: row.id
        }).then(res => {
          if (res.code == 0) {
            this.$notify.success({
              title: this.$t("alert.alert_success_title"),
              message: this.$t("alert.alert_success_delete_title")
            });
            if (this.calendarList.length == 1 && this.currentPage !== 1) {
              this.currentPage--;
            }
            this.getListData();
          } else {
            this.$notify.error({
              title: this.$t("alert.fail"),
              message: this.$t("alert.alert_fail_delete_title")
            });
          }
        });
      });
    },
    refresh () {
      //刷新
      this.getListData();
    },

    handleSizeChange (val) {
      this.pageSize = val;
      this.getListData();
    },
    handleCurrentChange (val) {
      this.currentPage = val;
      this.getListData();
    },
    refresh () {
      this.getListData();
    },
    //获取列表数据
    getListData () {
      this.$Geting(this.$api.queryCalendarList, {
        pageSize: this.pageSize,
        pageNo: this.currentPage,
        startDate: this.searchForm.startTime,
        endDate: this.searchForm.endTime,
        title: this.searchForm.title
      }).then(res => {
        if (res.code == 0) {
          this.calendarList = res.datas.lists;
          this.calendarNum = res.datas.count;
        } else {
          this.$notify.error({
            title: "fail",
            message: res.msg
          });
          return false;
        }
      });
    }
  },
  beforeDestroy () {
    this.$deleteImg();
  }
};
</script>
<style lang="less">
.calendar_wrapper {
  background-color: #fff;
  height: 100%;
  position: relative;
  overflow: hidden;
  .calendar_section {
    padding: 0px 30px 15px;
    &.calendar_list_table {
      border-top: 1px solid #dcdfe6;
      padding-top: 15px;
      position: absolute;
      top: 60px;
      bottom: 0;
      left: 0;
      right: 0;
      overflow-y: auto;
    }
    &.calendar_list {
      padding-bottom: 0;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 60px;
    }
  }
  .row_header {
    height: 62px;
    padding: 15px 0;
    .col_text {
      padding: 4px 0;
    }
    .col_button {
      text-align: right;
    }
  }
  .page_section {
    text-align: center;
    margin-top: 30px;
  }
}
.calendar_dialog {
  .input_375 {
    width: 300px;
  }
}
</style>




