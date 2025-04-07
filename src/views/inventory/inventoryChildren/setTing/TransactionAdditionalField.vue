<template>
  <div class="additional-field-wrap">
    <header class="header">
      <el-button size="mini" :disabled="self==0" @click="addAdditionalField()">{{$t('ADD')}} </el-button>
    </header>
    <el-table :data="facilityList" border height="600" ref='progressListTable' style="width: 100%;">
      <el-table-column :label="$t('Name')">
        <template slot-scope="scope">
          <el-input v-if="scope.$index === additionalFieldIndex" v-model="additionalFieldName"></el-input>
          <div v-else>{{scope.row.name}}</div>
        </template>
      </el-table-column>
      <el-table-column :label="$t('参数')">
        <template slot-scope="scope">
          <el-input v-if="scope.$index === additionalFieldIndex" v-model="additionalFieldValues"></el-input>
          <div v-else>{{scope.row.values}}</div>
        </template>
      </el-table-column>
      <el-table-column :label="$t('Edit')">
          <template slot-scope="scope">
            <template v-if="scope.$index === additionalFieldIndex">
              <el-button @click="saveFacility(scope.row)" size="mini" :disabled="self==0">{{$t('save')}}</el-button>
              <el-button size="mini" @click="cancelFacility(scope.row, scope.$index)" :disabled="self==0">{{$t('cancel')}}</el-button>
            </template>
            <template v-else>
              <el-button @click="editItem(scope.row, scope.$index)" size="mini" :disabled="self==0">{{$t('update')}}</el-button>
              <el-button size="mini" @click="deleteItem(scope.row, scope.$index)" :disabled="self==0">{{$t('delete')}}</el-button>
            </template>
          </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  data(){
    return {
      facilityList: [], //项目进度列表
      projectId: JSON.parse(sessionStorage.getItem('projectDesc') || '{}').id ||'',
      additionalFieldIndex: -1,
      additionalFieldName: '',
      self: JSON.parse(sessionStorage.getItem("projectDesc")).self,
      additionalFieldValues: ''
    }
  },
  created(){
    this.getProjectFacilityList()
  },
  methods: {
    getProjectFacilityList(){
      this.$Get(this.$api.queryProjectFacility, {projectId: this.projectId})
      .then(res=>{
        this.facilityList = res.datas
        console.log(this.additionalFieldIndex)
      })

    },
    editItem(item, index){
      this.additionalFieldName = item.name
      this.additionalFieldValues = item.values
      this.additionalFieldIndex = index;
    },
    deleteItem(item, index){
      this.$Get(this.$api.deleteProjectFacility, {facilityId: item.facilityId})
      .then(res=>{
        if(res.code == 0){
          this.getProjectFacilityList()
          this.$notify.success({
            title: this.$t("alert.alert_success_title"),
            message: this.$t("alert.alert_success_title")
          });
        }
      })
    },
    addAdditionalField(){
      this.facilityList.unshift({});
      this.additionalFieldIndex = 0;
    },
    saveFacility(){
      let data = {
        name: this.additionalFieldName,
        values: this.additionalFieldValues,
        projectId: this.projectId
      }
      this.$Post(this.$api.addProjectFacility, data)
      .then(res=>{
        if(res.code == 0){
          this.getProjectFacilityList()
          this.additionalFieldIndex = -1
          this.$notify.success({
            title: this.$t("alert.alert_success_title"),
            message: this.$t("alert.alert_success_title")
          });
        }
      })
    },
    cancelFacility(item, index){
      this.additionalFieldIndex = -1;
      this.additionalFieldName = ''
      this.additionalFieldValues = ''
      this.getProjectFacilityList()
    }
  }
  
}
</script>
<style lang="less" scoped>
.additional-field-wrap{
  background-color: #fff;
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  .header{
    display: flex;
    padding: 10px;
    justify-content: flex-end;
  }
}
  
</style>