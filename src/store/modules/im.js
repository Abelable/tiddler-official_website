const user = {
  state: {
    isLogin: false,
    isSDKReady: false,
    userID: 0,
    userSig: '',
    sdkAppID: 0,
    userName: '',
    userAvatar: '',
    currentMessageList: [],
    fansPoints: 0,
    fansRank: 0,
    intimacyAddMsg: '',
    audienceActionTip: null
  },
  mutations: {
    toggleIsLogin(state, isLogin) {
      state.isLogin = typeof isLogin === 'undefined' ? !state.isLogin : isLogin
    },
    toggleIsSDKReady(state, isSDKReady) {
      state.isSDKReady = typeof isSDKReady === 'undefined' ? !state.isSDKReady : isSDKReady
    },
    setImInfo(state, imInfo) {
      let { userID, userSig, sdkAppID, userName, userAvatar } = imInfo
      state.userID = userID
      state.userSig = userSig
      state.sdkAppID = sdkAppID
      state.userName = userName
      state.userAvatar = userAvatar
    },
    pushCurrentMessageList(state, data) {
      if (Array.isArray(data)) {
        state.currentMessageList = [...state.currentMessageList, ...data]
      } else {
        state.currentMessageList = [...state.currentMessageList, data]
      }
    },
    reset(state) {
      Object.assign(state, {
        currentMessageList: []
      })
    }
  },
  actions: {
  }
}

export default user
