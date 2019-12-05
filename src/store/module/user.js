// 提示信息组件
import {
  Message
} from 'view-design'

// 接口
import {
  login,
  logout
} from '@/api/common'

// token方法
import {
  setToken,
  getToken
} from '@/libs/util'

export default {
  state: {
    // 用户名
    userName: localStorage.getItem('userName') ? localStorage.getItem('userName') : '',
    // 用户ID
    userId: localStorage.getItem('userId') ? localStorage.getItem('userId') : '',
    // 用户头像
    avatorImgPath: localStorage.getItem('userPic') ? localStorage.getItem('userPic') : '',
    // token
    token: getToken(),
    // 权限
    access: localStorage.getItem('access') ? localStorage.getItem('access').split(',') : []
  },
  mutations: {
    setAvator (state, avatorPath) {
      localStorage.setItem('userpic', avatorPath)
      state.avatorImgPath = avatorPath
    },
    setUserId (state, id) {
      localStorage.setItem('userid', id)
      state.userId = id
    },
    setUserName (state, name) {
      localStorage.setItem('userName', name)
      state.userName = name
    },
    setAccess (state, access) {
      localStorage.setItem('access', access)
      state.access = access
    },
    setToken (state, token) {
      state.token = token
      setToken(token)
    }
  },
  actions: {
    // 登录
    handleLogin ({
      commit
    }, {
      userName,
      password
    }) {
      userName = userName.trim()
      return new Promise((resolve, reject) => {
        login({
          userName,
          password
        }).then(res => {
          const data = res.data
          if (data.success) {
            Message.success(data.msg)
            localStorage.clear()
            commit('setToken', data.data.isAdmin)
            commit('setAvator', 'https://avatars2.githubusercontent.com/u/23623726?s=460&v=4')
            commit('setUserName', data.data.name)
            commit('setUserId', data.data.id)
            commit('setToken', data.data.isAdmin)
            commit('setAccess', data.data.isAdmin === 1 ? ['isAdmin'] : [])
          } else {
            Message.error(data.msg)
          }
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 退出登录
    handleLogOut ({
      state,
      commit
    }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('setToken', '')
          commit('setAccess', [])
          resolve()
        }).catch(err => {
          reject(err)
        })
        // 如果你的退出登录无需请求接口，则可以直接使用下面四行代码而无需使用logout调用接口
        // commit('setToken', '')
        // commit('setAccess', [])
        // localStorage.clear()
        // resolve()
      })
    }
  }
}
