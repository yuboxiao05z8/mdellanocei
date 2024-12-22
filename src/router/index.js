import Vue from 'vue'
import VueRouter from 'vue-router'

import routes from './modules'
import dynamicRouter from './modules/dynamic'
import adminRouter from './modules/admin'





Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  // mode: 'hash',
  base: process.env.BASE_URL,
  routes
})




export const constantRoutes = routes
export const asyncRoutes = [...dynamicRouter, ...adminRouter]

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}



export default router



