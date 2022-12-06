const user = {
  state: {
    userID: 0,
    userSig: '',
    sdkAppID: 0,
    userName: '',
    userAvatar: '',
    liveChatMsgList: [],
    audienceActionTip: null,
    subtitleVisible: false,
    subtitleContent: '',
  },
  mutations: {
    setImInfo(state, imInfo) {
      const { app_id, user_id, user_sig, user_name, user_avatar } = imInfo
      state.sdkAppID = +app_id
      state.userID = `${user_id}`
      state.userSig = user_sig
      state.userName = user_name
      state.userAvatar = user_avatar
    },

    setLiveChatMsgList(state, data) {
      switch (data.constructor) {
        case Array:
          state.liveChatMsgList = state.liveChatMsgList.length > 50 ? [...state.liveChatMsgList.slice(-30), ...data] : [...state.liveChatMsgList, ...data]
          break
        case Object:
          state.liveChatMsgList = state.liveChatMsgList.length > 50 ? [...state.liveChatMsgList.slice(-30), data] : [...state.liveChatMsgList, data]
          break
      }
    },

    setSubtitleVisible(state, data) {
      state.subtitleVisible = data
    },

    setSubtitleContent(state, data) {
      state.subtitleContent = data
    },

    reset(state) {
      Object.assign(state, {
        liveChatMsgList: []
      })
    }
  },
  actions: {
  }
}

export default user
