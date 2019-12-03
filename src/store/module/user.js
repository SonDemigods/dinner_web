import {
  Message
} from 'view-design'
import {
  login
  // logout,
  // getUserInfo
} from '@/api/user'
import {
  setToken,
  getToken
} from '@/libs/util'

export default {
  state: {
    userName: localStorage.getItem('userName') ? localStorage.getItem('userName') : '',
    userId: localStorage.getItem('userid') ? localStorage.getItem('userid') : '',
    avatorImgPath: localStorage.getItem('userpic') ? localStorage.getItem('userpic') : '',
    token: getToken(),
    access: localStorage.getItem('access') ? localStorage.getItem('access').split(',') : [],
    unitId: localStorage.getItem('unitid') ? localStorage.getItem('unitid') : '',
    unitName: localStorage.getItem('unitName') ? localStorage.getItem('unitName') : '',
    hasGetInfo: localStorage.getItem('hasGetInfo') === 'true'
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
    },
    setHasGetInfo (state, status) {
      localStorage.setItem('hasGetInfo', status)
      state.hasGetInfo = status
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
            commit('setHasGetInfo', true)
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
        // logout(state.token).then(() => {
        //   commit('setToken', '')
        //   commit('setAccess', [])
        //   resolve()
        // }).catch(err => {
        //   reject(err)
        // })
        // 如果你的退出登录无需请求接口，则可以直接使用下面三行代码而无需使用logout调用接口
        commit('setToken', '')
        commit('setAccess', [])
        localStorage.clear()
        resolve()
      })
    },
    // 获取用户相关信息
    getUserInfo ({
      state,
      commit
    }) {
      return localStorage.getItem('access') ? localStorage.getItem('access').split(',') : []
      // return new Promise((resolve, reject) => {
      // try {
      //   getUserInfo(state.token).then(res => {
      //     const data = res.data
      //     commit('setAvator', data.avator)
      //     commit('setUserName', data.name)
      //     commit('setUserId', data.user_id)
      //     commit('setAccess', data.access)
      //     commit('setHasGetInfo', true)
      //     resolve(data)
      //   }).catch(err => {
      //     reject(err)
      //   })
      // } catch (error) {
      //   reject(error)
      // }
      // })
    }
  }
}
