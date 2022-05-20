import axios from 'axios'
export default {
  namespaced: true,
  state: {
    token: localStorage.getItem('token') || '',
    userInfo: {}
  },
  mutations: {
    uodateToken (state, newToken) {
      state.token = newToken
      localStorage.setItem('token', newToken)
    },
    uodateUserInfo (state, info) {
      state.userInfo = info
    }
  },
  actions: {
    async getUserInfo (context) {
      const { data: res } = await axios.get('/my/userinfo')
      context.commit('uodateUserInfo', res.data)
    }
  },
  getters: {}

}
