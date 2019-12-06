// axios封装
import axios from '@/libs/api.request'

// 数据序列化
// import qs from 'qs'

// 获取token方法
import {
  getToken
} from '@/libs/util'

// 配置token
const header = {
  token: getToken()
}

// 获取预定分页
export const getWorkPage = data => {
  return axios.request({
    header,
    url: 'work/getWorkPage',
    data,
    method: 'post'
  })
}

// 获取预定列表
export const getWorkList = data => {
  return axios.request({
    header,
    url: 'work/getWorkList',
    data,
    method: 'post'
  })
}

// 根据人员id获取预定信息
export const getWorkListByPersonId = data => {
  return axios.request({
    header,
    url: 'work/getWorkListByPersonId',
    data,
    method: 'post'
  })
}

// 根据id删除预定
export const deleteWork = data => {
  return axios.request({
    header,
    url: 'work/deleteWork',
    data,
    method: 'post'
  })
}

// 修改下班时间
export const leaveWork = data => {
  return axios.request({
    header,
    url: 'work/leaveWork',
    data,
    method: 'post'
  })
}

// 根据id获取预定信息
export const getWork = data => {
  return axios.request({
    header,
    url: 'work/getWork',
    data,
    method: 'post'
  })
}

// 创建预定信息
export const creatWork = data => {
  return axios.request({
    header,
    url: 'work/creatWork',
    data,
    method: 'post'
  })
}

// 修改预定信息
export const modifyWork = data => {
  return axios.request({
    header,
    url: 'work/modifyWork',
    data,
    method: 'post'
  })
}
