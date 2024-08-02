<template>
  <!-- <div class="teams_wrapper">
    <div class="head">
      <el-row>
        <el-col :span="12" class="el_col_name">
          <div>
            <span>{{$t('teams.manageTeams')}}(2)</span>
          </div>
        </el-col>
        <el-col :span="12" style="text-align:right">
          <el-button size="mini" @click="dialogVisible = true">{{$t('teams.managerICTeamMembership')}}</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="teams_content">
      <el-row>
        <el-form :inline="true" size="mini">
          <el-form-item :label="$t('teams.teamName')">
            <el-input></el-input>
          </el-form-item>
          <el-form-item>
            <el-button>{{$t('teams.search')}}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button>{{$t('teams.clear')}}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button>{{$t('teams.refresh')}}</el-button>
          </el-form-item>
        </el-form>
      </el-row>
      <el-table :data="tableData6" border style="width: 100%" :header-cell-style="{'background':'#f5f7fa'}" size="mini">
        <el-table-column prop="name" :label="$t('teams.teamName')">
        </el-table-column>
        <el-table-column prop="name" :label="$t('teams.sellingEntity')">
        </el-table-column>
        <el-table-column prop="name" :label="$t('teams.isSensitive')">
        </el-table-column>
        <el-table-column :label="$t('teams.manageMembership')">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" plain @click="dialogVisible1 = true">{{$t('teams.manageMembership')}}</el-button>
          </template>
        </el-table-column>
        <el-table-column :label="$t('teams.delete')">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" plain>{{$t('teams.delete')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div> -->
    <!-- Manager IC Team Membership -->
    <!-- <el-dialog :title="$t('teams.managerICTeamMembership')" :visible.sync="dialogVisible" width="900px">
      <el-row class="row_header">
        <el-col :span="12" class="col_text">
          {{$t('teams.managerICTeamMembership')}}(69)
        </el-col>
        <el-col :span="12" class="col_button">
          <el-button size="mini"> {{$t('teams.email')}}</el-button>
          <el-button size="mini"> {{$t('teams.importFromExcel')}}
          </el-button>
          <el-button size="mini"> {{$t('teams.exporttoExcel')}}
          </el-button>
        </el-col>
      </el-row>
      <el-row class="row_header">
        <el-col :span="2" class="col_text">
          <div style="text-align:center">{{$t('teams.name')}}</div>
        </el-col>
        <el-col :span="17">
          <el-select v-model="value6" size="mini" style="width:100%" placeholder="">
            <ul class="select_title">
              <li>Name</li>
              <li>IC</li>
              <li>Email</li>
              <li>Mobile</li>
              <li>Reg Num</li>
            </ul>
            <el-option v-for="item in cities" :key="item.value" :label="item.label" :value="item.value" style="padding:0">
              <div style="float:left;width:20%;text-align:center">{{ item.label }}</div>
              <div style="float:left;width:20%;text-align:center">{{ item.value }}</div>
              <div style="float:left;width:20%;text-align:center">{{ item.label }}</div>
              <div style="float:left;width:20%;text-align:center">{{ item.value }}</div>
              <div style="float:left;width:20%;text-align:center">{{ item.label }}</div>

            </el-option>
          </el-select>
        </el-col>
        <el-col :span="5" class="col_button">
          <el-button size="mini">{{$t('teams.addMemberToTeam')}}</el-button>
        </el-col>
      </el-row>
      <el-table :data="tableData6" border style="width: 100%" :header-cell-style="{'background':'#f5f7fa'}" size="mini">
        <el-table-column prop="name" :label="$t('teams.name')">
        </el-table-column>
        <el-table-column prop="name" :label="$t('teams.email')">
        </el-table-column>
        <el-table-column prop="name" :label="$t('teams.mobile')">
        </el-table-column>
        <el-table-column prop="name" :label="$t('teams.regNum')">
        </el-table-column>
        <el-table-column :label="$t('teams.delete')">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" plain>{{$t('teams.delete')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog> -->
    <!-- Manager Membership -->
    <!-- <el-dialog :title="$t('teams.manageMembership')" :visible.sync="dialogVisible1" width="900px">
      <el-row class="row_header">
        <el-col :span="12" class="col_text">
          {{$t('teams.manageMembership')}}(69)
        </el-col>
        <el-col :span="12" class="col_button">
          <el-button size="mini"> {{$t('teams.email')}}</el-button>
          <el-button size="mini"> {{$t('teams.importFromExcel')}}
          </el-button>
          <el-button size="mini"> {{$t('teams.exporttoExcel')}}
          </el-button>
        </el-col>
      </el-row>
      <el-form :inline="true" size="mini">
        <el-row class="row_header">
          <el-col :span="8">
            <el-form-item :label="$t('teams.teamName')">
              <el-input></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('teams.isSensitive')">
              <el-checkbox></el-checkbox>
            </el-form-item>
          </el-col>
          <el-col :span="8" class="col_button">
            <el-form-item>
              <el-button>{{$t('teams.save')}}</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item :label="$t('teams.sellingEntity')">
              <el-checkbox label="复选框 A"></el-checkbox>
              <el-checkbox label="复选框 B"></el-checkbox>
              <el-checkbox label="复选框 C"></el-checkbox>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-row class="row_header">
        <el-col :span="2" class="col_text">
          <div style="text-align:center">{{$t('teams.name')}}</div>
        </el-col>
        <el-col :span="17">
          <el-select v-model="value6" size="mini" style="width:100%" placeholder="">
            <ul class="select_title">
              <li>{{$t('teams.name')}}</li>
              <li>{{$t('teams.ic')}}</li>
              <li>{{$t('teams.email')}}</li>
              <li>{{$t('teams.mobile')}}</li>
              <li>{{$t('teams.regNum')}}</li>
            </ul>
            <el-option v-for="item in cities" :key="item.value" :label="item.label" :value="item.value" style="padding:0">
              <div style="float:left;width:20%;text-align:center">{{ item.label }}</div>
              <div style="float:left;width:20%;text-align:center">{{ item.value }}</div>
              <div style="float:left;width:20%;text-align:center">{{ item.label }}</div>
              <div style="float:left;width:20%;text-align:center">{{ item.value }}</div>
              <div style="float:left;width:20%;text-align:center">{{ item.label }}</div>
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="5" class="col_button">
          <el-button size="mini">{{$t('teams.addMemberToTeam')}}</el-button>
        </el-col>
      </el-row>
      <el-table :data="tableData6" border style="width: 100%" :header-cell-style="{'background':'#f5f7fa'}" size="mini">
        <el-table-column prop="name" :label="$t('teams.name')">
        </el-table-column>
        <el-table-column prop="name" :label="$t('teams.ic')">
        </el-table-column>
        <el-table-column prop="name" :label="$t('teams.email')">
        </el-table-column>
        <el-table-column prop="name" :label="$t('teams.mobile')">
        </el-table-column>
        <el-table-column prop="name" :label="$t('teams.regNum')">
        </el-table-column>
        <el-table-column :label="$t('teams.delete')">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" plain>{{$t('teams.delete')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div> -->
  <div>report(2期)</div>
</template>
<script>
// export default {
//   data() {
//     return {
//       cities: [
//         {
//           value: "Beijing",
//           label: "北京"
//         },
//         {
//           value: "Shanghai",
//           label: "上海"
//         },
//         {
//           value: "Nanjing",
//           label: "南京"
//         },
//         {
//           value: "Chengdu",
//           label: "成都"
//         },
//         {
//           value: "Shenzhen",
//           label: "深圳"
//         },
//         {
//           value: "Guangzhou",
//           label: "广州"
//         },
//         {
//           value: "Guangzhou",
//           label: "广州"
//         },
//         {
//           value: "Guangzhou",
//           label: "广州"
//         },
//         {
//           value: "Guangzhou",
//           label: "广州"
//         },
//         {
//           value: "Guangzhou",
//           label: "广州"
//         }
//       ],
//       value6: "",
//       tableData6: [
//         {
//           name: "D02-Spottiswoode Residences"
//         },
//         {
//           name: "D02-Spottiswoode Residences"
//         },
//         {
//           name: "D02-Spottiswoode Residences"
//         },
//         {
//           name: "D02-Spottiswoode Residences"
//         },
//         {
//           name: "D02-Spottiswoode Residences"
//         },
//         {
//           name: "D02-Spottiswoode Residences"
//         },
//         {
//           name: "D02-Spottiswoode Residences"
//         },

//         {
//           name: "D03-Commonwealth Towers  "
//         }
//       ],
//       dialogVisible: false,
//       dialogVisible1: false
//     };
//   }
// };
</script>
<style lang="less">
// .teams_wrapper {
//   background-color: #fff;
//   height: 100%;
//   position: relative;
//   overflow: hidden;
//   .head {
//     height: 62px;
//     position: absolute;
//     top: 0;
//     width: 100%;
//     border-bottom: 1px solid #dcdfe6;
//     border-top: 1px solid #dcdfe6;
//     padding: 15px 30px;
//     .el_col_name {
//       div {
//         padding: 4px 0;
//       }
//     }
//   }
//   .teams_content {
//     position: absolute;
//     top: 62px;
//     bottom: 0;
//     width: 100%;
//     overflow: auto;
//     padding: 15px 30px;
//   }
//   .row_header {
//     height: 62px;
//     padding: 15px 0;
//     border-top: 1px solid #dcdfe6;
//     .col_text {
//       padding: 4px 0;
//     }
//     .col_button {
//       text-align: right;
//     }
//   }
// }
// .select_title {
//   height: 34px !important;
//   position: absolute;
//   width: 100%;
//   background-color: rgb(245, 247, 250);
//   top: 0;
//   z-index: 999;
//   li {
//     float: left;
//     width: 20%;
//     height: 100%;
//     line-height: 34px;
//     text-align: center;
//     font-size: 14px;
//     color: #606266;
//   }
// }
</style>


