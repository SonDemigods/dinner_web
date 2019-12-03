/**
 * @description 工具方法
 * @author 张航
 * @date 2019-02-01 08:44:31
 * @version V1.0.0
 */

/**
 * @param {Array} arr 遍历的数组
 * @param {Function} fn 执行的方法
 * @description 循环数组并执行方法
 */
export const forEach = (arr, fn) => {
  if (!arr.length || !fn) return
  let i = -1
  let len = arr.length
  while (++i < len) {
    let item = arr[i]
    fn(item, i, arr)
  }
}

/**
 * @param {Array} arr1
 * @param {Array} arr2
 * @description 得到两个数组的交集, 两个数组的元素为数值或字符串
 */
export const getIntersection = (arr1, arr2) => {
  let len = Math.min(arr1.length, arr2.length)
  let i = -1
  let res = []
  while (++i < len) {
    const item = arr2[i]
    if (arr1.indexOf(item) > -1) res.push(item)
  }
  return res
}

/**
 * @param {Array} arr1
 * @param {Array} arr2
 * @description 得到两个数组的并集, 两个数组的元素为数值或字符串
 */
export const getUnion = (arr1, arr2) => {
  return Array.from(new Set([...arr1, ...arr2]))
}

/**
 * @param {Array} target 目标数组
 * @param {Array} arr 需要查询的数组
 * @description 判断要查询的数组是否至少有一个元素包含在目标数组中
 */
export const hasOneOf = (targetarr, arr) => {
  return targetarr.some(_ => arr.indexOf(_) > -1)
}

/**
 * @param {String|Number} value 要验证的字符串或数值
 * @param {*} validList 用来验证的列表
 */
export const oneOf = (value, validList) => {
  for (let i = 0; i < validList.length; i++) {
    if (value === validList[i]) {
      return true
    }
  }
  return false
}

/**
 * @param {Number} timeStamp 判断时间戳格式是否是毫秒
 * @returns {Boolean}
 */
const isMillisecond = timeStamp => {
  const timeStr = String(timeStamp)
  return timeStr.length > 10
}

/**
 * @param {Number} timeStamp 传入的时间戳
 * @param {Number} currentTime 当前时间时间戳
 * @returns {Boolean} 传入的时间戳是否早于当前时间戳
 */
const isEarly = (timeStamp, currentTime) => {
  return timeStamp < currentTime
}

/**
 * @param {Number} num 数值
 * @returns {String} 处理后的字符串
 * @description 如果传入的数值小于10，即位数只有1位，则在前面补充0
 */
const getHandledValue = num => {
  return num < 10 ? '0' + num : num
}

/**
 * @param {Number} timeStamp 传入的时间戳
 * @param {Number} startType 要返回的时间字符串的格式类型，传入'year'则返回年开头的完整时间
 */
const getDate = (timeStamp, startType) => {
  const d = new Date(timeStamp * 1000)
  const year = d.getFullYear()
  const month = getHandledValue(d.getMonth() + 1)
  const date = getHandledValue(d.getDate())
  const hours = getHandledValue(d.getHours())
  const minutes = getHandledValue(d.getMinutes())
  const second = getHandledValue(d.getSeconds())
  let resStr = ''
  if (startType === 'year') resStr = year + '-' + month + '-' + date + ' ' + hours + ':' + minutes + ':' + second
  else resStr = month + '-' + date + ' ' + hours + ':' + minutes
  return resStr
}

/**
 * @param {String|Number} timeStamp 时间戳
 * @returns {String} 相对时间字符串
 */
export const getRelativeTime = timeStamp => {
  // 判断当前传入的时间戳是秒格式还是毫秒
  const IS_MILLISECOND = isMillisecond(timeStamp)
  // 如果是毫秒格式则转为秒格式
  if (IS_MILLISECOND) Math.floor(timeStamp /= 1000)
  // 传入的时间戳可以是数值或字符串类型，这里统一转为数值类型
  timeStamp = Number(timeStamp)
  // 获取当前时间时间戳
  const currentTime = Math.floor(Date.parse(new Date()) / 1000)
  // 判断传入时间戳是否早于当前时间戳
  const IS_EARLY = isEarly(timeStamp, currentTime)
  // 获取两个时间戳差值
  let diff = currentTime - timeStamp
  // 如果IS_EARLY为false则差值取反
  if (!IS_EARLY) diff = -diff
  let resStr = ''
  const dirStr = IS_EARLY ? '前' : '后'
  // 少于等于59秒
  if (diff <= 59) resStr = diff + '秒' + dirStr
  // 多于59秒，少于等于59分钟59秒
  else if (diff > 59 && diff <= 3599) resStr = Math.floor(diff / 60) + '分钟' + dirStr
  // 多于59分钟59秒，少于等于23小时59分钟59秒
  else if (diff > 3599 && diff <= 86399) resStr = Math.floor(diff / 3600) + '小时' + dirStr
  // 多于23小时59分钟59秒，少于等于29天59分钟59秒
  else if (diff > 86399 && diff <= 2623859) resStr = Math.floor(diff / 86400) + '天' + dirStr
  // 多于29天59分钟59秒，少于364天23小时59分钟59秒，且传入的时间戳早于当前
  else if (diff > 2623859 && diff <= 31567859 && IS_EARLY) resStr = getDate(timeStamp)
  else resStr = getDate(timeStamp, 'year')
  return resStr
}

/**
 * @returns {String} 当前浏览器名称
 */
export const getExplorer = () => {
  const ua = window.navigator.userAgent
  const isExplorer = (exp) => {
    return ua.indexOf(exp) > -1
  }
  if (isExplorer('MSIE')) return 'IE'
  else if (isExplorer('Firefox')) return 'Firefox'
  else if (isExplorer('Chrome')) return 'Chrome'
  else if (isExplorer('Opera')) return 'Opera'
  else if (isExplorer('Safari')) return 'Safari'
}

/**
 * @description 绑定事件 on(element, event, handler)
 */
export const on = (function () {
  if (document.addEventListener) {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.addEventListener(event, handler, false)
      }
    }
  } else {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.attachEvent('on' + event, handler)
      }
    }
  }
})()

/**
 * @description 解绑事件 off(element, event, handler)
 */
export const off = (function () {
  if (document.removeEventListener) {
    return function (element, event, handler) {
      if (element && event) {
        element.removeEventListener(event, handler, false)
      }
    }
  } else {
    return function (element, event, handler) {
      if (element && event) {
        element.detachEvent('on' + event, handler)
      }
    }
  }
})()

/**
 * 判断一个对象是否存在key，如果传入第二个参数key，则是判断这个obj对象是否存在key这个属性
 * 如果没有传入key这个参数，则判断obj对象是否有键值对
 */
export const hasKey = (obj, key) => {
  if (key) return key in obj
  else {
    let keysArr = Object.keys(obj)
    return keysArr.length
  }
}

/**
 * @param {*} obj1 对象
 * @param {*} obj2 对象
 * @description 判断两个对象是否相等，这两个对象的值只能是数字或字符串
 */
export const objEqual = (obj1, obj2) => {
  const keysArr1 = Object.keys(obj1)
  const keysArr2 = Object.keys(obj2)
  if (keysArr1.length !== keysArr2.length) return false
  else if (keysArr1.length === 0 && keysArr2.length === 0) return true
  else {
    let flag = true
    keysArr1.forEach(key => {
      if (typeof obj1[key] === 'undefined' || typeof obj2[key] === 'undefined') {
        if (typeof obj1[key] !== 'undefined' || typeof obj2[key] !== 'undefined') {
          flag = false
          return false
        }
      } else if (Array.isArray(obj1[key]) || Array.isArray(obj2[key])) {
        if (obj1[key].toString() !== obj2[key].toString()) {
          flag = false
          return false
        }
      } else {
        if (obj1[key] !== obj2[key]) {
          flag = false
          return false
        }
      }
    })
    return flag
  }

  /* eslint-disable-next-line */
  /*  else return !keysArr1.some(key => {
      if (typeof obj1[key] === 'undefined' && typeof obj2[key] === 'undefined') {

      }
      return obj1[key] != obj2[key]
    })*/
}

/**
 * @param {Date} date 时间对象
 * @returns {String} 时间字符串
 */
export const date2str = date => {
  let str
  if (Object.prototype.toString.call(date) === '[object Date]') {
    let Y = date.getFullYear()
    let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
    let D = date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()
    str = `${Y}-${M}-${D}`
  } else {
    console.warn(`参数"${date}"类型不正确,请传入[Date]类型！`)
    str = ''
  }
  return str
}

/**
 * @param {String|Number} str 时间字符串或时间戳
 * @returns {Date} 转换成Date数据
 */
export const str2date = str => {
  let date
  if (Object.prototype.toString.call(str) === '[object String]' || Object.prototype.toString.call(str) === '[object Number]') {
    date = new Date(str)
  } else {
    console.warn(`参数"${str}"类型不正确,请传入[String]或[Number]类型！`)
    date = null
  }
  return date
}

/**
 * @functionName setLocalStorage
 * @param {String} name 本地存储key
 * @param {String} data 本地存储value
 * @description 存储本地数据
 * @author 张航
 * @date 2019-02-03 09:18:09
 * @version V1.0.0
 */
export const setLocalStorage = (name, data) => {
  localStorage.setItem(name, data)
}

/**
 * @functionName getLocalStorage
 * @param {String} name 本地存储key
 * @description 获取本地数据
 * @author 张航
 * @date 2019-02-03 09:21:32
 * @version V1.0.0
 */
export const getLocalStorage = name => {
  return localStorage.getItem(name) || ''
}

/**
 * @functionName isStatic
 * @param {*} value 被检测的数据
 * @return {Boolean} 返回结果
 * @description 检测数据是不是除了symbol外的原始数据
 * @author 张航
 * @date 2019-07-10 09:21:32
 * @version V1.0.0
 */
export const isStatic = (value) => {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    typeof value === 'undefined' ||
    value === null
  )
}

/**
 * @functionName isPrimitive
 * @param {*} value 被检测的数据
 * @return {Boolean} 返回结果
 * @description 检测数据是不是原始数据
 * @author 张航
 * @date 2019-07-10 13:42:00
 * @version V1.0.0
 */
export const isPrimitive = (value) => {
  return isStatic(value) || typeof value === 'symbol'
}

/**
 * @functionName isObject
 * @param {*} value 被检测的数据
 * @return {Boolean} 返回结果
 * @description 判断数据是不是引用类型的数据
 * @author 张航
 * @date 2019-07-10 13:43:48
 * @version V1.0.0
 */
export const isObject = (value) => {
  let type = typeof value
  return value != null && (type === 'object' || type === 'function')
}

/**
 * @functionName isObjectLike
 * @param {*} value 被检测的数据
 * @return {Boolean} 返回结果
 * @description 检查 value 是否是类对象
 * @author 张航
 * @date 2019-07-10 13:46:44
 * @version V1.0.0
 */
export const isObjectLike = (value) => {
  return value != null && typeof value === 'object'
}

/**
 * @functionName getRawType
 * @param {*} value 被检测的数据
 * @return {String} 数据类型
 * @description 获取数据类型
 * @author 张航
 * @date 2019-07-10 13:48:55
 * @version V1.0.0
 */
export const getRawType = (value) => {
  return Object.prototype.toString.call(value).slice(8, -1)
}

/**
 * @functionName isPlainObject
 * @param {*} value 被检测的数据
 * @return {Boolean} 返回结果
 * @description 判断数据是不是Object类型的数据
 * @author 张航
 * @date 2019-07-10 14:41:44
 * @version V1.0.0
 */
export const isPlainObject = (obj) => {
  return Object.prototype.toString.call(obj) === '[object Object]'
}

/**
 * @functionName isFunction
 * @param {*} value 被检测的数据
 * @return {Boolean} 返回结果
 * @description 检查 value 是不是函数
 * @author 张航
 * @date 2019-07-10 14:40:42
 * @version V1.0.0
 */
export const isFunction = (value) => {
  return Object.prototype.toString.call(value) === '[object Function]'
}

/**
 * @functionName isLength
 * @param {*} value 被检测的数据
 * @return {Boolean} 返回结果
 * @description 检查 value 是否为有效的类数组长度
 * @author 张航
 * @date 2019-07-10 14:38:53
 * @version V1.0.0
 */
export const isLength = (value) => {
  return typeof value === 'number' && value > -1 && value % 1 === 0 && value <= Number.MAX_SAFE_INTEGER
}

/**
 * @functionName isArrayLike
 * @param {*} value 被检测的数据
 * @return {Boolean} 返回结果
 * @description 检查 value 是否是类数组
 * @author 张航
 * @date 2019-07-10 14:36:32
 * @version V1.0.0
 */
export const isArrayLike = (value) => {
  return value != null && isLength(value.length) && !isFunction(value)
}

/**
 * @functionName isEmpty
 * @param {*} value 被检测的数据
 * @return {Boolean} 返回结果
 * @description 检查 value 是否为空
 * @author 张航
 * @date 2019-07-10 13:52:21
 * @version V1.0.0
 */
export const isEmpty = (value) => {
  if (value == null) {
    return true
  }
  if (isArrayLike(value)) {
    return !value.length
  } else if (isPlainObject(value)) {
    for (let key in value) {
      if (hasOwnProperty.call(value, key)) {
        return false
      }
    }
    return true
  }
  return false
}

/**
 * @functionName camelize
 * @param {String} str 待转换的字符串
 * @return {String} 转换后的字符串
 * @description 横线转驼峰命名
 * @author 张航
 * @date 2019-07-10 14:09:21
 * @version V1.0.0
 */
export const camelize = (str) => {
  const camelizeRE = /-(\w)/g
  return str.replace(camelizeRE, function (_, c) {
    return c ? c.toUpperCase() : ''
  })
}

/**
 * @functionName hyphenate
 * @param {String} str 待转换的字符串
 * @return {String} 转换后的字符串
 * @description 驼峰命名转横线命名
 * @author 张航
 * @date 2019-07-10 14:11:38
 * @version V1.0.0
 */

export const hyphenate = (str) => {
  const hyphenateRE = /\B([A-Z])/g
  return str.replace(hyphenateRE, '-$1').toLowerCase()
}

/**
 * @functionName capitalize
 * @param {String} str 待转换的字符串
 * @return {String} 转换后的字符串
 * @description 字符串首位大写
 * @author 张航
 * @date 2019-07-10 14:13:54
 * @version V1.0.0
 */
export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * @functionName isJSON
 * @param {String} str 待检测的字符串
 * @return {String} 检测后的结果
 * @description 是否json字符串
 * @author 张航
 * @date 2019-07-10 14:13:54
 * @version V1.0.0
 */
export const isJSON = (str) => {
  if (typeof str === 'string') {
    try {
      var obj = JSON.parse(str)
      if (typeof obj === 'object' && obj) {
        return true
      } else {
        return false
      }
    } catch (e) {
      console.log('error：' + str + '!!!' + e)
      return false
    }
  }
  console.error('It is not a string!')
}
