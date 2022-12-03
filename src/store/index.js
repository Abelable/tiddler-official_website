import Vue from 'vue'
import Vuex from 'vuex'
import im from './modules/im'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    cartCount: 0,
    newUserStatus:0
  },
  getters: {
  },
  mutations: {
    setCartCount(state, count) {
      state.cartCount = count
    },
    setNewUserStatus(state,newUserStatus){
      state.newUserStatus = newUserStatus
    }
  },
  modules: {
    im
  }
})
