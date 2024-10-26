<template>
  <div class="rowTab_content">
    <el-row :gutter="20" v-if="forArr">
      <el-col v-for="(item, index) in forArr" :key="index" :span="spanNum">
        <div>
          <span>{{item.type}}</span>
          <span>{{item.value}}</span>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: {
    forArr: {
      type: Array,
      default: []
    },
    spanNum: {
      type: Number,
      default: 8
    }
  }
}
</script>

<style lang="less">
.rowTab_content{
  .el-row{
    padding: 20px;
  }
  .el-col{
    margin-bottom: 15px;
    span{
      color: #666;  
    }
    span:last-child{
      margin-left: 15px;
      color: #000;
    }
  }
}
  
</style>