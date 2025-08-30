import Vue from 'vue'
import router from '@/router'
import {
  baseURL
} from './env'
import axios from 'axios'
import qs from 'qs'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import md5 from 'js-md5'
const axiosX = axios.create({
  baseURL: baseURL
})
const axiosY = axios.create({
  // withCredentials: true
})

// 检验登陆信息
const testIsLogin = () => {
  let user = JSON.parse(window.sessionStorage.getItem('userInfo') || '{}')
  if (user.id === '' || user.id === undefined) {
    location.replace(`${location.origin}/#/`)
  }
}

// 校验是否有html标签
function hasHTML(data) {
  data = JSON.stringify(data)
  let reg1 = /<\/?[^>]*>/g
  let reg2 = /&nbsp;/ig
  if (reg1.test(data) || reg2.test(data)) {
    return true
  } else {
    return false
  }
}



const XHR = ({
  method = 'post',
  qs = true,
  loading = false,
  loginRequire = true,
  reqComplex = false,
  reqContentType = 'urlencoded'
}) => {
  // 用户登陆信息
  const user = {
    userId: JSON.parse(window.sessionStorage.getItem('userInfo') || '{}').userId || '', //登陆用户的ID
    agentId: JSON.parse(window.sessionStorage.getItem('userInfo') || '{}').userId || '', //登陆用户的ID
    token: JSON.parse(window.sessionStorage.getItem('userInfo') || '{}').token || '',
    brokeId: JSON.parse(window.sessionStorage.getItem('userInfo') || '{}').brokeId || '',
    source: 'manager'
  }

  // 带请求进度条成功方法
  const sucFunX = res => {
    if (res.data.code === '-2') {
      NProgress.done()
      Vue.prototype.$alert('Repeat login or logon failure', 'Alert', {
        confirmButtonText: 'Confirm',
        callback: action => {
          window.sessionStorage.removeItem('Site');
          window.sessionStorage.removeItem('userInfo');
          window.sessionStorage.removeItem('serveUrl');
          router.replace('/login')
        }
      })
    } else {
      NProgress.done()
      return res.data
    }
  }

  // 成功执行方法
  const sucFunC = res => {
    if (res.data.code === '-2') {
      Vue.prototype.$alert('Repeat login or logon failure', 'Alert', {
        confirmButtonText: 'Confirm',
        callback: action => {
          router.replace('/login')
          window.sessionStorage.removeItem('Site');
          window.sessionStorage.removeItem('userInfo');
          window.sessionStorage.removeItem('serveUrl');
        }
      })
    } else {
      return res.data
    }
  }

  // 带请求进度条失败方法
  const errFunX = err => {
    console.log(err, NProgress.done())
  }

  // 失败执行访求
  const errFunC = err => {
    console.log(err)
  }

  // 判断是否需要Longing
  const sucFun = loading ? sucFunX : sucFunC

  // 判断是否需要Longing
  const errFun = loading ? errFunX : errFunC

  return {
    user,
    sucFun,
    errFun
  }
}

// 简单带请求带状态POST
// Posting('/fsddf', {id: 111, page: 1})
const Posting = function (url = '', data = {}, allowHTML = false) {
  if (!allowHTML && hasHTML(data)) {
    return Promise.resolve({
      msg: '您的填写的数据带有非法字符，请改正后重试'
    })
  }
  NProgress.start()
  let {
    user,
    sucFun,
    errFun
  } = XHR({
    loading: true
  })
  let reqData = qs.stringify({
    ...user,
    ...data
  })
  return axiosX.post(url, reqData).then(sucFun).catch(errFun)
}


// 简单带请求POST
// Post('/fsddf', {id: 111, page: 1})
// const Post = function (url = '', data = {}, allowHTML = false) {
//   if (!allowHTML && hasHTML(data)) {
//     return Promise.resolve({
//       msg: '您的填写的数据带有非法字符，请改正后重试'
//     })
//   }
//   let {
//     user,
//     sucFun,
//     errFun
//   } = XHR({
//     loading: false
//   })
//   let reqData = qs.stringify({
//     ...user,
//     ...data
//   })
//   return axiosX.post(url, reqData).then(sucFun).catch(errFun)
// }

//带签名的请求POST
const Post = function(url = '', data = {}, allowHTML = false){
  if (!allowHTML && hasHTML(data)) {
    return Promise.resolve({
      msg: '您的填写的数据带有非法字符，请改正后重试'
    })
  }
  let {
    user,
    sucFun,
    errFun
  } = XHR({
    loading: false
  })
  let params = {
    ...user,
    ...data
  }
  console.log(params);
  let str = ''
  for (const key in Vue.prototype.$objKeySort(params)) {
    if (
      Vue.prototype.$objKeySort(params)[key] !== null &&
      typeof Vue.prototype.$objKeySort(params)[key] !== 'undefined'
    ) {
      if(Array.isArray(Vue.prototype.$objKeySort(params)[key])) console.log(params[key] = JSON.stringify(Vue.prototype.$objKeySort(params)[key]));
      str += Vue.prototype.$objKeySort(params)[key]
    }
  }
  str = md5(str + 'c1d65f3667324592a071ebec5038f38c')
 let reqData = qs.stringify({
    ...params,
    signature: str
  })
  return axiosX.post(url, reqData).then(sucFun).catch(errFun)
}

// 简单带请求带状态Get
// Geting('/fsddf', {id: 111, page: 1})
const Geting = function (url = '', data = {}, allowHTML = false) {
  if (!allowHTML && hasHTML(data)) {
    return Promise.resolve({
      msg: '您的填写的数据带有非法字符，请改正后重试'
    })
  }
  NProgress.start()
  let {
    user,
    sucFun,
    errFun
  } = XHR({
    loading: true
  })
  let params = {
    params: {
      ...user,
      ...data
    }
  }
  return axiosX.get(url, params).then(sucFun).catch(errFun)
}

// 简单带请求GET
// Get('/fsddf', {id: 111, page: 1})
// const Get = function (url = '', data = {}, allowHTML = false) {
//   if (!allowHTML && hasHTML(data)) {
//     return Promise.resolve({
//       msg: '您的填写的数据带有非法字符，请改正后重试'
//     })
//   }
//   let {
//     user,
//     sucFun,
//     errFun
//   } = XHR({
//     loading: false
//   })
//   let params = {
//     params: {
//       ...user,
//       ...data
//     }
//   }
//   return axiosX.get(url, params).then(sucFun).catch(errFun)
// }

//简单带请求GET带签名
const Get  = function (url = '', data = {}, allowHTML = false) {
  if (!allowHTML && hasHTML(data)) {
    return Promise.resolve({
      msg: '您的填写的数据带有非法字符，请改正后重试'
    })
  }
  let {
    user,
    sucFun,
    errFun
  } = XHR({
    loading: false
  })
  let param = {
    ...user,
    ...data
  }
  let str = ''
  for (const key in Vue.prototype.$objKeySort(param)) {
    if (
      Vue.prototype.$objKeySort(param)[key] !== null &&
      typeof Vue.prototype.$objKeySort(param)[key] !== 'undefined'
    ) {
      str += Vue.prototype.$objKeySort(param)[key]
    }
  }
  str = md5(str + 'c1d65f3667324592a071ebec5038f38c')
  let params = {
    params: {
      ...param,
      signature:str
    }
  }
  return axiosX.get(url, params).then(sucFun).catch(errFun)
}

//  默认请求
Vue.prototype.$axios = axios
Vue.axios = axios

// 带等待状态POST请求
Vue.prototype.$Posting = Posting
Vue.Posting = Posting

// 带等待状态GET请求
Vue.prototype.$Geting = Geting
Vue.Geting = Geting

// 无等待状态POST请求
Vue.prototype.$Post = Post
Vue.Post = Post

// 无等待状态GETt请求
Vue.prototype.$Get = Get
Vue.Get = Get

Vue.prototype.$md5 = md5
Vue.md5 = md5

// 上传图文表单


const PostFormData = function (url = '', formData, allowHTML = false) {
  let config = {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }
  NProgress.start()
  let {
    user,
    sucFun,
    errFun
  } = XHR({
    loading: true
  })
  // let reqData = {...user, ...formData}
  return axios.post(baseURL + url, formData, config).then(sucFun).catch(errFun)
}
Vue.prototype.$PostFormData = PostFormData
Vue.PostFormData = PostFormData

const PostY = function (url = '', data = {}, allowHTML = false) {
  if (!allowHTML && hasHTML(data)) {
    return Promise.resolve({
      msg: '您的填写的数据带有非法字符，请改正后重试'
    })
  }
  let {
    user,
    sucFun,
    errFun
  } = XHR({
    loading: false
  })
  let reqData = qs.stringify({
    ...user,
    ...data
  })
  return axiosY.post(url, reqData).then(sucFun).catch(errFun)
}


Vue.prototype.$PostY = PostY
Vue.PostY = PostY

// Vue.prototype.$PostHasSign = PostHasSign
// Vue.prototype.$GetHasSign = GetHasSign