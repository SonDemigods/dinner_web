import axios from '@/libs/api.request'
import qs from 'qs'

export const getTableData = () => {
  return axios.request({
    url: 'get_table_data',
    method: 'get'
  })
}

export const getDragList = () => {
  return axios.request({
    url: 'get_drag_list',
    method: 'get'
  })
}

export const errorReq = () => {
  return axios.request({
    url: 'error_url',
    method: 'post'
  })
}

export const saveErrorLogger = info => {
  return axios.request({
    url: 'save_error_logger',
    data: info,
    method: 'post'
  })
}

export const api = (url, data, config) => {
  // 发送的数据类型
  const ContentType = {
    url: 'application/x-www-form-urlencoded;charset=utf-8',
    json: 'application/json;charset=utf-8'
  }

  // 初始化额外参数
  config = config || {}
  let _config = {
    method: config.method ? config.method : 'post',
    responseType: config.responseType ? config.responseType : 'json',
    contentType: config.contentType ? config.contentType : 'url',
    showMsg: config.showMsg ? config.showMsg : false
  }

  // 处理发送的数据
  let _data
  let _contentType
  if (_config['contentType'] === 'url') {
    _data = qs.stringify(data, {
      arrayFormat: 'repeat'
    })
    _contentType = ContentType.url
  } else if (_config['contentType'] === 'json') {
    _data = JSON.stringify(data)
    _contentType = ContentType.json
  }
  // 返回ajax方法
  return axios.request({
    url,
    data: _data,
    headers: {
      'Content-Type': _contentType
      // token: getToken() ? getToken() : ''
    },
    method: _config.method,
    responseType: _config.responseType
  }).then(res => {
    return res.data
  })
}
