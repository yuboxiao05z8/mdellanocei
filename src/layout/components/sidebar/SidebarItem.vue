<template>
  <div>
    <!-- 匹配只有一个父或者只有一个子的情况 -->
    <template
      v-if="!item.childMenus"
    >
      <app-link v-if="item.link" :to="resolvePath(item.link)">
        <el-menu-item
          :index="resolvePath(item.link)"
        >
          <item
            :icon="item.icon"
            :title="item.menuName"
          />
        </el-menu-item>
      </app-link>
    </template>

    <!-- 匹配多级别导航 -->
    <el-submenu v-else ref="subMenu" :index="resolvePath(item.link)" popper-append-to-body>
      <template slot="title">
        <item  :icon="item.icon" :title="item.menuName" />
      </template>
      <sidebar-item
        v-for="child in item.childMenus"
        :key="child.link"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.link)"
        class="nest-menu"
      />
    </el-submenu>
  </div>
</template>

<script>
import path from 'path'
import { isExternal } from '@/utils/validate'
import Item from './Item'
import AppLink from './Link'

export default {
  components: { Item, AppLink },
  name: 'SidebarItem',
  props: {
    item: {
      type: Object,
      required: true,
    },
    basePath: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      accountType: JSON.parse(sessionStorage.getItem('userInfo') || '{}').type,
    }
  },
  
  methods: {
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(this.basePath)) {
        return this.basePath
      }
      return path.resolve(this.basePath, routePath)
    },
  },
}
</script>

