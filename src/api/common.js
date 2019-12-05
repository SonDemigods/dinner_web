/**
 * @description 公共接口
 * @author 张航
 * @date 2019-12-05 08:18:32
 * @version V1.0.0
 */

// axios封装
import axios from '@/libs/api.request'
// 获取token方法
import {
  getToken
} from '@/libs/util'

// 配置token
const header = {
  token: getToken()
}

// 登录
export const login = ({
  userName,
  password
}) => {
  const data = {
    userName,
    password
  }
  return axios.request({
    url: 'login',
    data,
    method: 'post'
  })
}

// 登出
export const logout = () => {
  return axios.request({
    header,
    url: 'logout',
    method: 'post'
  })
}
