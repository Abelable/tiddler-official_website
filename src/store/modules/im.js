const user = {
  state: {
    userID: 0,
    userSig: '',
    sdkAppID: 0,
    userName: '',
    userAvatar: '',
    livePlaying: false,
    liveChatMsgList: [],
    audienceActionTip: null,
    audienceCount: 0,
    manualPraise: false,
    praiseCount: 0,
    subtitleVisible: false,
    subtitleContent: '',
    isBan: 0,
    curUserIsBan: 0,
    liveBreak: false,
    anonymoused: 0,
    animationIndex: -1,
    liveDuration: 0,
    liveEnding: false,
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

    setLivePlaying(state, data) {
      state.livePlaying = data
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

    deleteLiveMsg(state, data) {
      const list = state.liveChatMsgList.filter(item => {
        const index = data.findIndex(_item => (_item.user_id == item.user_id && _item.time == item.time))
        if (index === -1) return item
      })
      state.liveChatMsgList = list
    },

    clearLiveMsgList(state) {
      state.liveChatMsgList = []
    },

    setAudienceActionTip(state, data) {
      state.audienceActionTip = data
    },

    setAudienceCount(state, data) {
      state.audienceCount = data
    },

    setManualPraise(state, data) {
      state.manualPraise = data
    },

    setPraiseCount(state, data) {
      state.praiseCount = data
    },

    setSubtitleVisible(state, data) {
      state.subtitleVisible = data
    },

    setSubtitleContent(state, data) {
      state.subtitleContent = data
    },

    setIsBan(state, data) {
      state.isBan = data
    },

    setCurUserIsBan(state, data) {
      state.curUserIsBan = data
    },

    setAnonymoused(state, data) {
      state.anonymoused = data
    },

    setLiveBreak(state, data) {
      state.liveBreak = data
    },

    setAnimationIndex(state, data) {
      state.animationIndex = data
    },

    setLiveDuration(state, data) {
      state.liveDuration = data
    },

    setLiveEnding(state, data) {
      state.liveEnding = data
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
