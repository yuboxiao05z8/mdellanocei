import Vue from 'vue'
import {
  baseURL
} from '@/config/env'
import {
  Base64
} from "js-base64";
const addDownUrl = (url = '', params = {}) => {
  let userId = JSON.parse(window.sessionStorage.getItem('userInfo') || '{}').userId || ''
  let token = JSON.parse(window.sessionStorage.getItem('userInfo') || '{}').token || ''
  let brokeId = JSON.parse(window.sessionStorage.getItem('userInfo') || '{}').brokeId || ''
  let str = "";
  for (let key in params) {
    str += `${key}=${params[key]}&`
  }
  return `${baseURL}${url}?${str}userId=${userId}&token=${token}&brokeId=${brokeId}`

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
  let uploadedImg = window.sessionStorage.getItem('uploadImg')
  if (!editorImg && !uploadedImg) {
    return false
  } else if (editorImg && !uploadedImg) {
    pathStr = editorImg.join()
  } else if (!editorImg && uploadedImg) {
    pathStr = uploadedImg
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
  let arr = htmlString.match(patt1)
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
  window.sessionStorage.setItem('uploadImg', JSON.stringify(sessionData))

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
