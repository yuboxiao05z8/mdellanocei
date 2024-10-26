import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'

Vue.use(Vuex)

// 获取modules 下面的所有JS模块
const modulesFiles = require.context('./modules', true, /\.js$/)

// console.log(modulesFiles.keys())

// 导出 modulesFiles 下面所有的方法模块
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  modules[moduleName] = value.default
  return modules
}, {})

// console.log(modules)

export default new Vuex.Store({
  modules,
  getters
})
