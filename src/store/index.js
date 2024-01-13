import Vue from "vue";
import Vuex from "vuex";
import im from "./modules/im";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    studioInfo: null,
    userInfo: null,
    vestInfo: null,
    vestIndex: 0,
    userFixed: false,
    userTagList: [],
    shopCategoryOptions: [],
    animationList: [],
    animationVisible: false,
    selectedMsgIdx: -1,
    balance: 0,
  },
  getters: {
  },
  mutations: {
    setStudioInfo(state, info) {
      state.studioInfo = info;
    },
    setUserInfo(state, info) {
      state.userInfo = info;
    },
    setVestInfo(state, data) {
      state.vestInfo = data;
    },
    setVestIndex(state, data) {
      state.vestIndex = data
    },
    setUserFixed(state, data) {
      state.userFixed = data
    },
    setUserTagList(state, data) {
      state.userTagList = data
    },
    setShopCategoryOptions(state, data) {
      state.shopCategoryOptions = data
    },
    setAnimationList(state, data) {
      state.animationList = data
    },
    setAnimationVisible(state, data) {
      state.animationVisible = data
    },
    setSelectedMsgIdx(state, data) {
      state.selectedMsgIdx = data
    },
    setBalance(state, data) {
      state.balance = data
    },
  },
  modules: {
    im,
  },
});
