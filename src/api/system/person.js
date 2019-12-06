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

// 获取人员分页
export const getPersonPage = data => {
  return axios.request({
    header,
    url: 'person/getPersonPage',
    data,
    method: 'post'
  })
}

// 获取人员列表
export const getPersonList = data => {
  return axios.request({
    header,
    url: 'person/getPersonList',
    data,
    method: 'post'
  })
}

// 根据id删除人员
export const deletePerson = data => {
  return axios.request({
    header,
    url: 'person/deletePerson',
    data,
    method: 'post'
  })
}

// 根据id查询人员
export const getPerson = data => {
  return axios.request({
    header,
    url: 'person/getPerson',
    data,
    method: 'post'
  })
}

// 创建人员
export const creatPerson = data => {
  return axios.request({
    header,
    url: 'person/creatPerson',
    data,
    method: 'post'
  })
}

// 修改人员
export const modifyPerson = data => {
  return axios.request({
    header,
    url: 'person/modifyPerson',
    data,
    method: 'post'
  })
}
