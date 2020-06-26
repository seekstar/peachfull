import { login, logout, getInfo, getRole, updateInfo, updateAvatar } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    phone: '',
    sex: '',
    age: '',
    roles: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_PHONE: (state, phone) => {
      state.phone = phone
    },
    SET_SEX: (state, sex) => {
      state.sex = sex
    },
    SET_AGE: (state, age) => {
      state.age = age
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    // 登录
    async Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      await login(username, userInfo.password)
      setToken(username)
      commit('SET_TOKEN', username)
    },
    // 获取用户信息
    async GetInfo({ commit, state }) {
      const roles = await getRole(state.token)
      commit('SET_ROLES', roles)
      const result = await getInfo(state.token)
      result['roles'] = roles
      commit('SET_NAME', result.name)
      commit('SET_AVATAR', result.avatar)
      commit('SET_PHONE', result.phone)
      commit('SET_AGE', result.age)
      commit('SET_SEX', result.sex)
      return result
    },
    async UpdateInfo({ commit, state }, userInfo) {
      await updateInfo(state.token, userInfo)
      const result = await getInfo(state.token)
      commit('SET_NAME', result.name)
      commit('SET_AVATAR', result.avatar)
      commit('SET_PHONE', result.phone)
      commit('SET_AGE', result.age)
      commit('SET_SEX', result.sex)
      return result
    },
    async UpdateAvatar({ commit, state }, url) {
      await updateAvatar(state.token, url)
      commit('SET_AVATAR', url)
    },
    // 登出
    async LogOut({ commit, state }) {
      await logout(state.token)
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
    },

    // 前端 登出
    async FedLogOut({ commit }) {
      removeToken()
      commit('SET_TOKEN', '')
    }
  }
}

export default user
