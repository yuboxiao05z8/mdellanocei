<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <!-- <keep-alive > -->
        <router-view :key="key" />
      <!-- </keep-alive> -->
    </transition>
  </section>
</template>

<script>
export default {
  data() {
    return {}
  },
  computed: {
    key() {
      return this.$route.path
    }
  },
  mounted() {},
  methods: {}
}
</script>

<style lang="less">
.app-main {
  /* 50= navbar  50  */
  // min-height: calc(100vh - 50px);
  // min-height: calc(100% - 50px);
  // height: calc(100% - 50px);
  height: 100%;
  width: 100%;
  position: relative;
  overflow: hidden;
}


</style>

