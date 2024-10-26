<template>
  <div class="crumbsStation">
    <el-tag
      v-for="(tag,index) in tags"
      size="small"
      class="tagDiv"
      :class="isActive(tag)?'active':''"
      :key="tag.name"
      :closable="isShowClose(tag)"
      :type="tag.type"
      @click.native="isAffix(tag)"
      @close="closeTagFn(tag,index)"
    >{{tag.name}}</el-tag>
  </div>
</template>

<script>
import path from 'path'
export default {
  data() {
    return {
      tags: [{ name: 'Dashboard', path: '/dashboard' }],
      active: 'Dashboard'
    }
  },
  watch: {
    $route(route) {
      if (route.path.startsWith('/redirect/')) {
        return
      }
      this.getRouterTages(route)
    }
  },
  created() {
    this.getRouterTages(this.$route)
  },
  methods: {
    getRouterTages(route) {
      console.log('进入', route)
      let activeName = ''
      if (route.query.vanish) {
        let isSnclude = this.tags.findIndex(i => {
          return i.name == route.query.name
        })
        if (route.query.type == 'InEdit') {
          if (isSnclude == -1) {
            this.tags = this.tags.concat({
              name: route.query.name,
              path: route.path,
              id: route.query.id,
              type: 'InEdit'
            })
          }
          activeName = route.query.name
        }
      } else {
        let isSnclude = this.tags.findIndex(i => {
          return i.name == route.meta.title
        })
        if (isSnclude == -1) {
          this.tags = this.tags.concat({
            name: route.meta.title,
            path: route.path
          })
        }
        activeName = route.meta.title
      }

      this.activeFn({
        name: activeName,
        path: route.path
      })
    },
    isAffix(tag) {
      this.activeFn(tag, true)
      this.isActive(tag)
    },
    isShowClose(tag) {
      return tag.path == '/dashboard' ? false : true
    },
    isActive(tag) {
      return tag.name == this.active ? true : false
    },
    activeFn(acitve, link) {
      this.active = acitve.name
      if (link) {
        if (acitve.type) {
          if (acitve.type == 'InEdit') {
            this.$nextTick(() => {
              this.$router.push({
                path: acitve.path,
                query: {
                  id: acitve.id,
                  name: acitve.name,
                  type: 'InEdit'
                }
              })
            })
          }
        } else {
          this.$nextTick(() => {
            this.$router.push({
              path: acitve.path
            })
          })
        }
      }
    },
    closeTagFn(tag, index) {
      this.tags.splice(index, 1)
      if (this.active == tag.name) {
        this.activeFn(this.tags[index - 1], true)
      }
    }
  }
}
</script>

<style lang="less">
.crumbsStation {
  height: 35px;
  line-height: 32px;
  padding: 0 10px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
  .tagDiv {
    background: #fff;
    margin: 0 5px;
    cursor: pointer;
    color: #000;
    border-color: #ddd;
    .el-tag__close {
      color: #ddd;
      &:hover {
        background-color: #999;
        color: #fff;
      }
    }
    &.active {
      background-color: #42b983;
      color: #fff;
      border-color: #42b983;
      &::before {
        content: '';
        background: #fff;
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        position: relative;
        margin-right: 2px;
      }
    }
  }
}
</style>