import Vue from 'vue'
import md5 from 'js-md5'
import {
  baseURL
} from '@/InterfaceConfig/env'
import {
  Base64
} from "js-base64";
const addDownUrl = (url = '', params = {}) => {
  let userInfo = JSON.parse(window.sessionStorage.getItem('userInfo')) || {}
  let userId = userInfo.userId || ''
  let token = userInfo.token || ''
  let brokeId = userInfo.brokeId || ''
  let agentId = userInfo.agentId || ''
  let str = "";
  for (let key in params) {
    str += `${key}=${params[key]}&`
  }
  if (url.includes('pnd-api')) {
    let sign = md5(agentId + brokeId + 'manager' + token + userId + 'c1d65f3667324592a071ebec5038f38c')
    return `${baseURL}${url}?${str}userId=${userId}&token=${token}&brokeId=${brokeId}&source=manager&agentId=${userId}&signature=${sign}`
  } else {
    return `${baseURL}${url}?${str}userId=${userId}&token=${token}&brokeId=${brokeId}&source=manager&agentId=${userId}`
  }
}
const base64ToContent = (content) => {
  if (!content) {
    return ""
  } else {
    return Base64.decode(content)
  }
}
const contentToBase64 = (content) => {
  if (!content) {
    return ""
  } else {
    return Base64.encode(content)
  }
}
const alertWarn = (content) => {
  Vue.prototype.$message({
    message: content,
    type: 'warning'
  });
}
/**
 * 清楚缓存并且删除缓存里面的图片
 */
const deleteImg = (pathStr = "") => {
  let editorImg = JSON.parse(window.sessionStorage.getItem('editorImg'))
  let uploadedImg = JSON.parse(window.sessionStorage.getItem('uploadImg'))
  if (!editorImg && !uploadedImg) {
    return false
  } else if (editorImg && !uploadedImg) {
    pathStr = editorImg.join()
  } else if (!editorImg && uploadedImg) {
    pathStr = uploadedImg.join()
  } else {
    pathStr = [...editorImg, uploadedImg].join()
  }
  if (pathStr !== "") {
    Vue.Post(Vue.api.deleteFile, {
      path: pathStr
    }).then((res) => {
      if (res.code == 0) {
        editorImg && window.sessionStorage.removeItem('editorImg')
        uploadedImg && window.sessionStorage.removeItem('uploadImg')
      }
    })
  } else {
    editorImg && window.sessionStorage.removeItem('editorImg')
    uploadedImg && window.sessionStorage.removeItem('uploadImg')
  }
}
//删除pdf或者image或者video
const deleteFile = (path) => {
  Vue.prototype.$Geting(Vue.prototype.$api.deleteFile, {
    path: path
  }).then(
    res => {
      if (res.code == 0) {

      } else {

      }
    }
  );
}
/**
 * 匹配富文本编辑器里面的img标签里面的src
 */
const changeHtmlStr = (htmlString = '', newArr = []) => {
  let patt1 = /<img\b.*?(?:\>|\/>)/gi
  let patt2 = /\bsrc\b\s*=\s*[\'\"]?([^\'\"]*)[\'\"]?/i
  let arr

  if (htmlString) {
    arr = htmlString.match(patt1)
  }
  if (arr) {
    for (let i = 0; i < arr.length; i++) {
      newArr.push(arr[i].match(patt2)[1])
    }
  }
  return newArr
}
/**
 * 提交的图片匹配缓存的图片
 *useData 表示使用过的图片
 *sessionData表示缓存里面的图片
 */
const changeSession = (useData = [], sessionData = []) => {
  sessionData = JSON.parse(window.sessionStorage.getItem('editorImg'))
  if (!sessionData || !sessionData.length || !useData.length) { //缓存里面没有数据或者提交的图片为空时直接跳出
    return false
  }
  for (let i = 0; i < useData.length; i++) { //遍历插件里面的数据匹配缓存里面的数据
    var index = sessionData.indexOf(useData[i]);
    if (index == -1) {
      continue;
    } else {
      sessionData.splice(index, 1)
    }

  }
  window.sessionStorage.setItem('editorImg', JSON.stringify(sessionData))



}
/**
 * 清楚缓存并且删除缓存里面的压缩文件
 */
const deleteZip = (pathStr = '') => {
  let uploadedZip = JSON.parse(window.sessionStorage.getItem('uploadedZip'))
  if (!uploadedZip) {
    return false
  } else {
    pathStr = [...uploadedZip].join()
  }
  if (pathStr !== "") {
    Vue.Post(Vue.api.deleteFile, {
      path: pathStr
    }).then((res) => {
      if (res.code == 0) {
        uploadedZip && window.sessionStorage.removeItem('uploadedZip')
      }
    })
  } else {
    uploadedZip && window.sessionStorage.removeItem('uploadedZip')
  }
}
/**
 * 改变upload上传组件里面的上传数据
 * uploadData为上传组件的数组
 * newData为返回的数组 筛选出src
 */
const changeUploadImg = (uploadData = [], newData = []) => {
  if (uploadData.length) {
    for (let i = 0; i < uploadData.length; i++) {
      newData.push(uploadData[i].src)
    }
  }
  return newData
}
/**
 * 提交的图片匹配缓存的图片
 *useData 表示使用过的图片
 *sessionData表示缓存里面的图片
 */
const changeSessionUploadImage = (useData = [], sessionData = []) => {
  sessionData = JSON.parse(window.sessionStorage.getItem('uploadImg'));
  console.log(useData, sessionData)
  if (!sessionData || !sessionData.length || !useData.length) { //缓存里面没有数据或者提交的图片为空时直接跳出
    return false
  }
  for (let i = 0; i < useData.length; i++) { //遍历插件里面的数据匹配缓存里面的数据
    var index = sessionData.indexOf(useData[i]);
    if (index == -1) {
      continue;
    } else {
      sessionData.splice(index, 1)
      console.log('222', index)
    }

  }
  window.sessionStorage.setItem('uploadImg', JSON.stringify(sessionData))

}
function objKeySort (obj) {//排序的函数
  //先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newkey是一个数组
  let newkey = Object.keys(obj).sort()
  let newObj = {};//创建一个新的对象，用于存放排好序的键值对
  for (let i = 0; i < newkey.length; i++) {//遍历newkey数组
    newObj[newkey[i]] = obj[newkey[i]]//向新创建的对象中按照排好的顺序依次增加键值对
  }
  return newObj//返回排好序的新对象
}

function signatrue (obj) {
  let str = ''
  for (const key in objKeySort(obj)) {
    if (
      objKeySort(obj)[key] !== null &&
      typeof objKeySort(obj)[key] !== 'undefined'
    ) {
      str += objKeySort(obj)[key]
    }
  }
  return Vue.prototype.$md5(str + 'c1d65f3667324592a071ebec5038f38c')
}

const urlEncode = (str) => {
  str = (str + '').toString();
  return str.replace('+', '%2B').replace(' ', '%20');
}

Vue.prototype.$addDownUrl = addDownUrl
Vue.prototype.$base64ToContent = base64ToContent
Vue.prototype.$contentToBase64 = contentToBase64
Vue.prototype.$alertWarn = alertWarn
Vue.prototype.$deleteImg = deleteImg
Vue.prototype.$deleteFile = deleteFile
Vue.prototype.$changeHtmlStr = changeHtmlStr
Vue.prototype.$changeSession = changeSession
Vue.prototype.$deleteZip = deleteZip
Vue.prototype.$changeSessionUploadImage = changeSessionUploadImage
Vue.prototype.$changeUploadImg = changeUploadImg
Vue.prototype.$objKeySort = objKeySort;
Vue.prototype.$signatrue = signatrue;
Vue.prototype.$urlEncode = urlEncode;
