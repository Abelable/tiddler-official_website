<template>
  <div class="container" :class="{ horizontal: roomInfo.isHorizontal, connectting: roomInfo.isConnectting }">
    <div class="player" id="live-player"></div>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapState } from 'vuex'
import TWebLive from 'tweblive'
import { ROOM_STATUS_LIVE, ROOM_STATUS_PLAYBACK } from '../utils/roomStatus'
import RoomService from '../../../service/roomService'

let roomService = new RoomService()

export default {
  props: {
    roomInfo: Object
  },

  data() {
    return {
      ROOM_STATUS_LIVE,
      ROOM_STATUS_PLAYBACK,
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

  async created() {
    await this.setMsgHistory()
  },

  mounted() {
    this.initPlayer()
    if (this.roomInfo.status === ROOM_STATUS_LIVE) {
      this.loginIm()
      this.enterRoom()
    }
  },

  destroyed() {
    if (this.roomInfo.status === ROOM_STATUS_LIVE) {
      this.logoutIm()
      this.exitRoom()
    }
  },

  methods: {
    async setMsgHistory() {
      let msgLists = await roomService.getMsgHistory(this.roomInfo.id)
      const warnTips = { message: '平台依法对直播内容进行24小时巡查，倡导绿色直播，维护网络文明健康。切勿与他人私下交易，非官方活动谨慎参与，避免上当受骗。'}
      if (this.roomInfo.status === ROOM_STATUS_LIVE) msgLists.push(warnTips)
      this.$store.commit('pushCurrentMessageList', msgLists)
    },

    initPlayer() {
      let m3u8, flv
      if (this.roomInfo.status === ROOM_STATUS_LIVE) {
        let src = this.roomInfo.definition[0].replace("rtmp", "http")
        m3u8 = `${src}.m3u8`
        flv = `${src}.flv`
      } else {
        m3u8 = this.roomInfo.definition[0]
        flv = this.roomInfo.definition[0].replace("m3u8", "flv")
      }
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
      this.tweblive.enterRoom(this.roomInfo.groupId)
    },

    exitRoom() {
      this.tweblive.exitRoom(this.roomInfo.groupId)
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