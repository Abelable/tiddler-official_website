import Vue from 'vue'
import Vuex from 'vuex'
import im from './modules/im'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: null,
    vestInfo: null,
    userTagList: [],
    shopCategoryOptions: []
  },
  getters: {
  },
  mutations: {
    setUserInfo(state, info) {
      state.userInfo = info;
    },
    setVestInfo(state, data) {
      state.vestInfo = data
    },
    setUserTagList(state, data) {
      state.userTagList = data
    },
    setShopCategoryOptions(state, data) {
      state.shopCategoryOptions = data
    }
  },
  modules: {
    im
  }
})
