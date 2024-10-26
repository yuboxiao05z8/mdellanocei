<template>
  <div class="crumbs">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item v-for="(item, index) in crumbsData" :key="index">{{item}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  props: {
    crumbsData: {
      type: Array,
      default: []
    }
  }
}
</script>

<style lang="less">
</style>