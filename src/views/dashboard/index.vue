<template>
  <div class="dashboard">
    <errDiv></errDiv>
  </div>
</template>

<script>
import errDiv from '../errPage/404'
export default {
  components: { errDiv }
}
</script>

<style lang="less">
.dashboard{
  padding: 30px;
  width: 100%;
  height: 100%;
}
</style>