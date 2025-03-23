<template>
  <div class="architect_wrapper">
    <div class="architect_section">
      <el-row class="row_header">
        <el-col :span="22" class="col_text"><div>选择项目</div> </el-col>
        <el-col :span="2" class="col_button">
          <el-button size="mini" @click="create()">创建进度 </el-button>
        </el-col>
      </el-row>
      <div>更新记录</div>
      <el-table :data="tableData" border style="width: 100%;height: 600px;">
        <el-table-column prop="date" label="楼栋" width="90">
        </el-table-column>
        <el-table-column prop="name" label="单位" width="180">
        </el-table-column>
        <el-table-column prop="address" label="通知状态"> </el-table-column>
        <el-table-column prop="address2" label="进度"> </el-table-column>
        <el-table-column prop="address3" label="更新时间"> </el-table-column>
        <el-table-column prop="address4" width="240" label="文件">
        </el-table-column>
        <el-table-column prop="address5" label="操作" width="180">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="mini"
              >编辑</el-button
            >
            <el-button type="text" size="mini" @click="open()"
              >通知律师</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPageNo"
          :page-size="100"
          layout="total, prev, pager, next"
          :total="1000">
        </el-pagination>
      </div>
    </div>
    <el-dialog title="选择单位" :visible.sync="dialogFormVisible" width="867px">
      <el-form :model="form">
        <el-form-item label="进度" :label-width="formLabelWidth">
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="进度描述" :label-width="formLabelWidth">
          <ul class="progress_desc_list">
            <li>取得认购协议书5%</li>
            <li>签订买卖合约15%</li>
          </ul>
        </el-form-item>
        <el-form-item label="更新范围" :label-width="formLabelWidth">
          <el-tabs
            v-model="activeName"
            type="card"
            @tab-click="handleClick"
            class="scope-wrap"
          >
            <el-tab-pane
              v-for="(building, buildingIndex) in scopeList"
              :label="building.label"
              :name="building.name"
              :key="buildingIndex"
            >
              <el-checkbox
                v-for="(unit, unitIndex) in building.unitList"
                v-model="unit.checked"
                :key="unitIndex"
                >{{ unit.unit }}</el-checkbox
              >
            </el-tab-pane>
          </el-tabs>
        </el-form-item>
        <el-form-item label="进度证明" :label-width="formLabelWidth">
            <uploader
              :maxSize="300"
              :isDisabled='true'
              :fileId="'architect1'"
              :uploadParam="uploadModelParam"
              @uploadAfter="uploadModelAfter"
              :url="$api.uploadFile"
              fileType=".zip"
              :btnText="{import:'上传文件'}"
              :showType="1"
            ></uploader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitUpload">提交</el-button>
      </div>
    </el-dialog>
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
      tableData: [
        {
          date: '楼栋一',
          name: '#01-01、#02-03...',
          address: '待通知',
          address2: '进度1',
          address3: '2021-03-02',
          address4: 'http://www.ddd.com/ddd.pdf',
          address5: '',
        },
      ],
      dialogFormVisible: false,
      formLabelWidth: '120px',
      form: {
        name: '',
      },
      options: [
        {
          value: '选项1',
          label: '黄金糕',
        },
        {
          value: '选项2',
          label: '双皮奶',
        },
        {
          value: '选项3',
          label: '蚵仔煎',
        },
        {
          value: '选项4',
          label: '龙须面',
        },
        {
          value: '选项5',
          label: '北京烤鸭',
        },
      ],
      value: '',
      activeName: 'first',
      scopeList: [
        {
          label: '楼栋1',
          name: 'first',
          unitList: [
            { unit: '#01-01', checked: false },
            { unit: '#01-02', checked: false },
            { unit: '#01-03', checked: false },
            { unit: '#01-04', checked: false },
            { unit: '#01-05', checked: false },
            { unit: '#01-06', checked: false },
            { unit: '#01-07', checked: false },
            { unit: '#01-08', checked: false },
          ],
        },
        {
          label: '楼栋2',
          name: 'second',
          unitList: [
            { unit: '#01-01', checked: false },
            { unit: '#01-02', checked: false },
            { unit: '#01-03', checked: false },
            { unit: '#01-04', checked: false },
            { unit: '#01-05', checked: false },
            { unit: '#01-06', checked: false },
          ],
        },
        {
          label: '楼栋3',
          name: 'third',
          unitList: [
            { unit: '#01-01', checked: false },
            { unit: '#01-02', checked: false },
            { unit: '#01-03', checked: false },
            { unit: '#01-04', checked: false },
            { unit: '#01-05', checked: false },
            { unit: '#01-06', checked: false },
          ],
        },
        {
          label: '楼栋4',
          name: 'fourth',
          unitList: [
            { unit: '#01-01', checked: false },
            { unit: '#01-02', checked: false },
            { unit: '#01-03', checked: false },
            { unit: '#01-04', checked: false },
            { unit: '#01-05', checked: false },
            { unit: '#01-06', checked: false },
          ],
        },
      ],
      uploadModelParam: [
        {
          name: "projectId",
          value:
            JSON.parse(sessionStorage.getItem("projectDesc") || "{}").id || ""
        },
        {
          name: "floorPlanId",
          value: ""
        }
      ],
      currentPageNo: 1,
    }
  },
  created(){
    this.getQueryProgressList()
  },
  methods: {
    getQueryProgressList(){
        this.$Geting(this.$api.queryProgressList, {
          pageNo: this.currentPageNo,
          pageSize: 10,
          projectId: 1
        }).then(res => {
          if (res.code == 0) {
            console.log(res)
          } else {
            this.$notify.error({
              title: this.$t("alert.fail"),
              message: this.$t("alert.alert_fail_delete_title")
            });
          }
        });
    },
    create() {
      this.dialogFormVisible = true
    },
    handleClick(tab, event) {
      this.dialogFormVisible = true
      console.log(tab, event)
    },
    submitUpload() {
      this.dialogFormVisible = false
      this.$refs.upload.submit()
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    open() {
      this.$confirm('通知律师后、当前内容将不能更改、请谨慎操作 ！！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!',
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    uploadModelAfter() {

    },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      }
  },
}
</script>

<style lang='less' scoped>
.architect_wrapper {
  background-color: #fff;
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  .architect_section {
    padding: 0px 30px 15px;
    &.general_lists {
      border-top: 1px solid #dcdfe6;
      position: absolute;
      top: 120px;
      bottom: 0;
      right: 0;
      left: 0;
      overflow-y: auto;
    }
    &.import_general {
      height: 120px;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
    }
    .row_header {
      margin-top: 58px;
    }
  }
  /deep/.scope-wrap {
    width: 640px;
    .el-tabs__header {
      margin: 0;
    }
    .el-tab-pane {
      border: 1px solid #e4e7ed;
      border-top: none;
      padding: 0 15px;
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      .el-checkbox {
        flex: 0 0 64px;
        margin: 0;
        padding: 0 7px;
      }
    }
  }
  .dialog-footer {
    text-align: center;
  }
  .progress_desc_list {
    list-style-type: lower-alpha;
    line-height: 20px;
  }
}
</style>