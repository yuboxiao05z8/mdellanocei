<template>
  <span class="custom_btn" :class="{'custom_red':btnConfig.type==-1,'custom_half_red':btnConfig.type==2,'custom_green':btnConfig.type==3,'pointer':isPointer}" @click="changeBtn"></span>
</template>
<script>
export default {
  props: {
    btnConfig: {
      type:Object
    },
    isPointer: {
      type: Boolean,
      default: true
    },
    isChange: {
      type: Number,
      default: 2
    }
  },
  methods: {
    changeBtn() {
      if (!this.isPointer) return;
      switch (this.btnConfig.type) {
        case -1:
          if (this.isChange == 2) {
            this.btnConfig.type = 3;
          } else {
            this.btnConfig.type = 2;
          }
          break;
        case 2:
          this.btnConfig.type = 3;
          break;
        default:
          this.btnConfig.type = -1;
          break;
      }
    }
  }
};
</script>
<style lang="less">
.custom_btn {
  display: inline-block;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  position: relative;
  vertical-align: -4px;
  &.pointer {
    cursor: pointer;
  }
  &.custom_red {
    border: 2px solid red;
  }
  &.custom_half_red {
    border: 2px solid red;
    &::after {
      content: "";
      position: absolute;
      bottom: 0;
      top: 8px;
      left: 0;
      right: 0;
      background-color: red;
      border-bottom-left-radius: 50%;
      border-bottom-right-radius: 50%;
    }
  }
  &.custom_green {
    border: 2px solid green;
    background-color: green;
  }
}
</style>

