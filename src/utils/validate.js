


/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/**
 * @param {string} url
 * @returns {Boolean}
 */
export function validURL(url) {
  const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return reg.test(url)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * @param {string} email
 * @returns {Boolean}
 */
export function validEmail(email) {
  const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return reg.test(email)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function isString(str) {
  if (typeof str === 'string' || str instanceof String) {
    return true
  }
  return false
}

/**
 * @param {Array} arg
 * @returns {Boolean}
 */
export function isArray(arg) {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
  return Array.isArray(arg)
}

/** 
  * @param {obj, arr} 
  * @returns {newObj}
 */

export const pick = (obj, arr) =>
  arr.reduce((iter, val) => (val in obj && (iter[val] = obj[val]), iter), {})

/** 
  * @param {string}
  * @returns {num}
 */
export function getPrice(str) {
  if (!str) {
    return 0
  }
  return str.replace(/[^\d.]/g, '')
}

/** 
  * @param {string, arr}
  * @returns {object}
 */
export function setRulesData(type, arr) {
  let rulesObj = {
    message: 'Please fill in the fields',
    required: true,
  }

  let obj = {}

  arr.forEach(i => obj[i] = [{ ...rulesObj, trigger: type }])

  return obj
}

export function TimeDifference(PastTense) {
  let newDate = new Date().getTime()
  let differenceTime = newDate - PastTense
  let minute = 1000 * 60
  let hour = minute * 60
  let day = hour * 24


  let dayC = parseInt(differenceTime / day)
  let hourC = parseInt(differenceTime / hour - parseInt(dayC) * 24)
  let minC = parseInt(differenceTime / minute - parseInt(dayC) * 24 * 60 - parseInt(hourC) * 60)

  

  return `${parseInt(dayC)} days, ${parseInt(hourC)} hours and ${parseInt(minC)} minutes `

}