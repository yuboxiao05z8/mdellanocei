<template>
  <div class="lawyer-wrapper">
    <div class="lawyer-section">
      <div class="project-select-wrap">
        <div class="project-select-label">项目选择:</div>
        <el-select v-model="value" placeholder="请选择1">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="perject-table-wrap">
        <div class="screen-box">
          <el-button class="stay-informed">待通知</el-button>
          <el-button class="stay-payment">待付款</el-button>
          <el-button class="overdue-payment">超时未付款</el-button>
          <el-button class="receiving">已收款</el-button>
          <el-button class="screen-all">全部</el-button>
        </div>

        <el-table :data="tableData" border style="width: 100%; height: 600px">
          <el-table-column prop="date" label="楼栋" width="60">
          </el-table-column>
          <el-table-column prop="name" label="单位" width="60">
          </el-table-column>
          <el-table-column prop="address" label="总售价格"> </el-table-column>
          <el-table-column prop="firstPhase">
            <template slot="header" slot-scope="scope">
              <span>第一期付款 15%</span>
              <i class="el-icon-info"></i>
            </template>
            <template slot-scope="scope">
              <div class='phase-wrap'>
                <p>{{scope.row.price}}</p>
                <p>{{scope.row.status}}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column>
            <template slot="header" slot-scope="scope">
              <span>第二期付款 15%</span>
              <i class="el-icon-info"></i>
            </template>
          </el-table-column>
          <el-table-column>
            <template slot="header" slot-scope="scope">
              <span>第三期付款 10%</span>
              <i class="el-icon-info"></i>
            </template>
          </el-table-column>
          <el-table-column>
            <template slot="header" slot-scope="scope">
              <span>第四期付款 5%</span>
              <i class="el-icon-info"></i>
            </template>
          </el-table-column>
          <el-table-column>
            <template slot="header" slot-scope="scope">
              <span>第五期付款 5%</span>
              <i class="el-icon-info"></i>
            </template>
          </el-table-column>
          <el-table-column>
            <template slot="header" slot-scope="scope">
              <span>第六期付款 10%</span>
              <i class="el-icon-info"></i>
            </template>
          </el-table-column>
          <el-table-column>
            <template slot="header" slot-scope="scope">
              <span>第七期付款 5%</span>
              <i class="el-icon-info"></i>
            </template>
          </el-table-column>
          <el-table-column>
            <template slot="header" slot-scope="scope">
              <span>第八期付款 20%</span>
              <i class="el-icon-info"></i>
            </template>
          </el-table-column>
          <el-table-column>
            <template slot="header" slot-scope="scope">
              <span>第九期付款 15%</span>
              <i class="el-icon-info"></i>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: 1,
      options: [
        {
          value: 1,
          label: 1,
        },
        {
          value: 2,
          label: 2,
        },
        {
          value: 3,
          label: 3,
        },
      ],
      tableData: [{
        date: '楼栋1',
        name: '#01-02',
        firstPhase: 1,
        price: '$100,000.00',
        status: 1
      }],
    }
  },
}
</script>

<style lang='less' scoped>
.lawyer-wrapper {
  background-color: #fff;
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  .lawyer-section {
    padding: 0px 30px 15px;
    .project-select-wrap {
      display: flex;
      margin: 10px 0;
      align-items: center;
      .project-select-label {
        margin-right: 20px;
      }
    }
    /deep/.perject-table-wrap {
      width: 100%;
      height: 752px;
      border: 1px solid rgba(187, 187, 187, 100);
      .screen-box {
        margin: 52px 20px 10px;
        height: 72px;
        border: 1px solid rgba(187, 187, 187, 100);
        display: flex;
        align-items: center;
        padding-left: 30px;
        .el-button {
          font-size: 14px;
          border: none;
          color: #fff;
          width: 155px;
          height: 40px;
        }
        .stay-informed {
          background: #dfd41a;
        }
        .stay-payment {
          background: #f9ad03;
        }
        .overdue-payment {
          background: #f44144;
        }
        .receiving {
          background: #00d2c8;
        }
        .screen-all {
          color: rgba(16, 16, 16, 100);
          border: 1px solid rgba(187, 187, 187, 100);
        }
      }
      .el-table {
        td{
          padding: 0;
          .cell{
            padding: 0;
          }
        }
      }
      .phase-wrap{
        background: #9EA7B4;
      }
    }
  }
}
</style>