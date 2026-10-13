<template>
  <div class="salesContent">
    <router-view></router-view>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="less">
.salesContent {
  width: 100%;
  height: 100%;
  .seekInput,
  .seekBtn {
    display: inline-block;
  }
  .seekInput {
    width: 300px;
    margin-right: 10px;
  }
}
</style>