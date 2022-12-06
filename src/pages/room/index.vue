<template>
  <div class="container">
    <img class="bg" v-if="roomInfo" v-lazy="roomInfo.cover + '?x-oss-process=image/resize,w_10'">
    <Room v-if="roomInfo" :roomInfo="roomInfo" />
  </div>
</template>

<script>
import TIM from 'tim-js-sdk'
import TIMUploadPlugin from 'tim-upload-plugin'
import Vue from 'vue'
import RoomService from '@/service/roomService'
const roomService = new RoomService()

import Room from './components/Room'

export default {
  components: {
    Room
  },

  data() {
    return {
      roomInfo: null
    }
  },

  async created() {
    await this.setImInfo()
    this.setRoomInfo()
  },

  methods: {
    async setRoomInfo() {
      const { show_subtitle, subtitle, ...roomInfo } = await roomService.getRoomInfo(this.$route.query.id)
      this.roomInfo = roomInfo
      this.$store.commit('setSubtitleVisible', show_subtitle == 1)
      this.$store.commit('setSubtitleContent', subtitle)
    },

    async setImInfo() {
      const imInfo = await roomService.getImInfo()
      this.$store.commit('setImInfo', imInfo)
      const { app_id, user_id, user_sig } = imInfo
      this.sdkAppID = +app_id
      this.userID = `${user_id}`
      this.userSig = user_sig
      this.initTim()
    },

    initTim() {
      const tim = TIM.create({ SDKAppID: this.sdkAppID })
      if (tim) {
        tim.setLogLevel(1)
        tim.registerPlugin({'tim-upload-plugin': TIMUploadPlugin})
        tim.on(TIM.EVENT.MESSAGE_RECEIVED, this.onMsgReceive)
        tim.login({ userID: this.userID, userSig: this.userSig })
        this.tim = tim
        Vue.prototype.tim = tim
      }
    },

    onMsgReceive({ data = [] }) {
      console.log('tim', data)
      data.forEach(item => {
        const { conversationType, type, payload } = item
        switch (conversationType) {
          case TIM.TYPES.CONV_SYSTEM:
            if (type === TIM.TYPES.MSG_GRP_SYS_NOTICE) {
              // handleLiveCustomMsg(payload)
            }
            break

          case TIM.TYPES.CONV_GROUP:
            if (type === TIM.TYPES.MSG_TEXT) {
              this.handleLiveChatMsg(payload)
            } else if (type === TIM.TYPES.MSG_CUSTOM) {
              // handleLiveCustomMsg(payload)
            }
            break
        }
      })
    },

    handleLiveChatMsg(payload) {
      const { nick_name, ...rest } = typeof(payload.text) === 'string' ? JSON.parse(payload.text.replace(/&quot;/g, "\"")).data : {}
      const liveMsg = nick_name ? { nick_name, ...rest } : null

      if (!this.liveMsgCache) this.liveMsgCache = []
      liveMsg && this.liveMsgCache.push(liveMsg)

      if (!this.setLiveMsgListTimeout) {
        this.setLiveMsgListTimeout = setTimeout(() => {
          this.$store.commit('setLiveChatMsgList', this.liveMsgCache)
          this.liveMsgCache = []
          this.setLiveMsgListTimeout = null
        }, 100 * this.liveMsgCache.length)
      }
    },

  }
}
</script>

<style lang="stylus" scoped>
.container
  position relative
  overflow hidden
  .bg
    position absolute
    top 0
    left 0
    width 100vw
    height 100vh
    filter blur(20px)
    transform scale(1.2)
    z-index -1  
</style>
