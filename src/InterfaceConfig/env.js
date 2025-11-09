/*
 * @Author: aze
 * @Date: 2021-07-19 18:40:20
 * @LastEditors: aze
 * @LastEditTime: 2021-09-03 15:26:49
 * @Description: 
 * @FilePath: \ecoprop_c_managere:\e_admin\src\InterfaceConfig\env.js
 */

// const env = 'development' // 开发环境 
const env = 'test' // 测试环境
// const env = 'production' // 生产环境 

let baseURL = '' // 接口地址
let socketLink = ''


switch (env) {
  case 'development':
    baseURL = 'http://192.168.1.126:9998'
    break
  case 'test':
    baseURL = 'http://192.168.0.145:9998'
    socketLink = 'ws://192.168.0.145:4447/websocket'
    break
  case 'production':
    baseURL = 'https://api.singmap.com'
    socketLink = 'wss://scoket.singmap.com/websocket'
    break
}

export { baseURL, socketLink }

