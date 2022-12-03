<template>
  <div class="container" :class="{ horizontal: roomInfo.isHorizontal, connectting: roomInfo.isConnectting }">
    <div class="player" id="live-player"></div>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapState } from 'vuex'
import TWebLive from 'tweblive'
import RoomService from '../../../service/roomService'

let roomService = new RoomService()

export default {
  props: {
    roomInfo: Object
  },

  data() {
    return {
      options:{
        domID: 'live-player',
        autoplay: true,
        width: '100%',
        height:'100%',
        controls: 'none',
        wording: {
          2032: '请求视频失败，请检查网络',
          2048: '请求m3u8文件失败，可能是网络错误或者跨域问题'
        }
      }
    }
  },

  computed: {
    ...mapState({
      sdkAppID: state => state.im.sdkAppID,
      userID: state => state.im.userID,
      userSig: state => state.im.userSig
    })
  },

  mounted() {
    this.setMsgHistory()
    this.initPlayer()
    this.loginIm()
    this.enterRoom()
  },

  destroyed() {
    this.logoutIm()
    this.exitRoom()
  },

  methods: {
    async setMsgHistory() {
      const msgList = await roomService.getMsgHistory(this.roomInfo.id)
      this.$store.commit('pushCurrentMessageList', msgList)
    },

    initPlayer() {
      let m3u8, flv
      let src = this.roomInfo.url.replace("rtmp", "http")
      m3u8 = `${src}.m3u8`
      flv = `${src}.flv`
      let tweblive = new TWebLive({
        SDKAppID: this.sdkAppID,
        m3u8,
        flv,
        ...this.options
      })
      this.tweblive = tweblive
      Vue.prototype.tweblive = tweblive
    },

    loginIm() {
      this.tweblive.login({ userID: this.userID, userSig: this.userSig }).then(() => {
        this.$store.commit('toggleIsLogin', true)
      })
      this.tweblive.on(TWebLive.EVENT.IM_READY, this.onIMReady)
      this.tweblive.on(TWebLive.EVENT.TEXT_MESSAGE_RECEIVED, this.onTextMessageReceived)
    },

    onIMReady() {
      this.$store.commit('toggleIsSDKReady', true)
    },

    onTextMessageReceived({ data: msgList }) {
      msgList.forEach(item => {
        let { type, payload } = item
        type === "TIMTextElem" && this.addMessage(payload.text)
        // type === "TIMGroupSystemNoticeElem" && payload.operationType && payload.operationType === 255 && payload.userDefinedField[0] === '{' && this.addCustomMessage(payload.userDefinedField)
      })
    },

    addMessage(msg) {
      let message = JSON.parse(msg.replace(/&quot;/g, "\"")).data
      message.msgIndex = ++this.curMsgIndex
      message.nickname = message.nick_name
      message.message = message.show_message
      message.gradetype = message.gradetype && Number(message.gradetype)
      this.$store.commit('pushCurrentMessageList', message)
    },

    onCustomMessageReceived({ data: msgList }) {
      console.log(msgList)
    },

    logoutIm() {
      this.tweblive.logout().then(() => {
        this.$store.commit('toggleIsLogin', false)
      })
      this.tweblive.off(TWebLive.EVENT.IM_READY, this.onIMReady)
      this.tweblive.off(TWebLive.EVENT.TEXT_MESSAGE_RECEIVED, this.onTextMessageReceived)
      this.$store.commit('reset')
    },

    enterRoom() {
      this.tweblive.enterRoom(this.roomInfo.group_id)
    },

    exitRoom() {
      this.tweblive.exitRoom(this.roomInfo.group_id)
    }
  }
}
</script>

<style lang="stylus" scoped>
.container
  position absolute
  top 0
  left 0
  width 100%
  height 100vh
  &.horizontal
    top 2.3rem
    height 4.26rem
  &.connectting
    top 2.3rem
    height 6.5rem
  .player
    width 100%
    height 100%
</style>