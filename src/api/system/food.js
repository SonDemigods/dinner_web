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

// 获取菜品分页
export const getFoodPage = data => {
  return axios.request({
    header,
    url: 'food/getFoodPage',
    data,
    method: 'post'
  })
}

// 获取菜品列表
export const getFoodList = data => {
  return axios.request({
    header,
    url: 'food/getFoodList',
    data,
    method: 'post'
  })
}

// 根据id删除菜品
export const deleteFood = data => {
  return axios.request({
    header,
    url: 'food/deleteFood',
    data,
    method: 'post'
  })
}

// 根据id查询菜品
export const getFood = data => {
  return axios.request({
    header,
    url: 'food/getFood',
    data,
    method: 'post'
  })
}

// 创建菜品
export const creatFood = data => {
  return axios.request({
    header,
    url: 'food/creatFood',
    data,
    method: 'post'
  })
}

// 修改菜品
export const modifyFood = data => {
  return axios.request({
    header,
    url: 'food/modifyFood',
    data,
    method: 'post'
  })
}
