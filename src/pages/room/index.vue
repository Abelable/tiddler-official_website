<template>
  <div class="container">
    <img class="bg" v-if="roomInfo" v-lazy="roomInfo.cover + '?x-oss-process=image/resize,w_10'">

    <Live v-if="roomInfo && roomInfo.status == 1 && !liveEnding" :roomInfo="roomInfo" />
    <LiveBreak v-if="(roomInfo && roomInfo.status == 0) || liveBreak" />
    <LiveEnding v-if="liveEnding" :roomInfo="roomInfo" />
    <LiveNotice v-if="roomInfo && roomInfo.status == 2" :roomInfo="roomInfo" />
    <LiveEnd v-if="roomInfo && roomInfo.status == 3" :roomInfo="roomInfo" />

    <PasswordModal v-if="passwordModalVisible" :pwdError="pwdError" @resetPassword="pwdError = false" @confirm="refetch" />
    <SharePopup v-if="sharePopupVisible" @hide="sharePopupVisible = false" />
  </div>
</template>

<script>
import { Toast } from 'vant'
import Live from './components/Live'
import LiveBreak from './components/LiveBreak'
import LiveEnding from './components/LiveEnding'
import LiveNotice from './components/LiveNotice'
import LiveEnd from './components/LiveEnd'
import PasswordModal from './components/PasswordModal'
import SharePopup from './components/SharePopup'

import { mapState } from 'vuex'
import { getUrlParam } from '@/utils/index'
import RoomService from '@/service/roomService'

const roomService = new RoomService()

export default {
  components: {
    Live,
    LiveBreak,
    LiveEnding,
    LiveNotice,
    LiveEnd,
    PasswordModal,
    SharePopup,
  },

  data() {
    return {
      roomInfo: null,
      password: '',
      pwdError: false,
      passwordModalVisible: false,
      sharePopupVisible: false
    }
  },

  computed: {
    ...mapState({
      liveBreak: state => state.im.liveBreak,
      liveEnding: state => state.im.liveEnding,
    })
  },

  created() {
    const id = this.$route.query.id || getUrlParam('id')
    const parent_user_id = this.$route.query.parent_user_id || getUrlParam('parent_user_id') || ''

    if (parent_user_id) {
      this.$store.commit('setShareId', parent_user_id)
    }

    if (!navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|IEMobile)/i)) {
      window.location.href = `https://h5.youboi.com/youbo_plus/pc_live/index.html#/live_play?id=${id}&parent_user_id=${parent_user_id}`
      return
    }

    const token = this.$route.query.token || getUrlParam('token') || localStorage.getItem('token') || ''
    if (!token) {
      window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx834688294afd4d48&redirect_uri=https%3A%2F%2Fyoubojia.youboi.com%2Fofficial-account%2Foauth-callback&response_type=code&scope=snsapi_userinfo&state=${encodeURIComponent(`id=${id}&parent_user_id=${parent_user_id}`)}#wechat_redirect`
      return
    }

    if (this.$route.query.token || getUrlParam('token')) {
      localStorage.setItem('token', token)
    }

    this.setRoomInfo()
    this.initWx()
  },

  methods: {
    async initWx() {
      const { appId, timestamp, nonceStr, signature } = await roomService.getWxSign() || {}
      window.wx.config({
        appId,
        timestamp,
        nonceStr,
        signature,
        jsApiList: ['chooseImage', 'previewImage', 'wx-open-launch-weapp'],
        openTagList:['wx-open-launch-weapp'],
      })
    },

    refetch(password) {
      this.password = password
      this.setRoomInfo()
    },

    setRoomInfo() {
      const { id, parent_user_id } = this.$route.query
      roomService.getRoomInfo(
        id, this.password, parent_user_id, 
        res => {
          const { show_subtitle, subtitle, watch_num, user_watch_num, like_num, ...roomInfo } = res
          this.roomInfo = roomInfo
          this.$store.commit('setSubtitleVisible', show_subtitle == 1)
          this.$store.commit('setSubtitleContent', subtitle)
          this.$store.commit('setAudienceCount', roomInfo.type_name ? Number(watch_num) : Number(user_watch_num))
          this.$store.commit('setPraiseCount', Number(like_num))
          document.title = roomInfo.title
        },
        res => {
          if (res.data.message === '直播间密码错误') {
            if (this.passwordModalVisible) {
              this.pwdError = true
            } else {  
              this.passwordModalVisible = true
            }
          } else if (res.data.message === '非白名单用户，无法查看' || res.data.message === '黑名单用户，无法查看') {
            Toast.fail('您暂无权限观看')
          } else Toast(res.data.message)
        }
      )
    }
  }
}
</script>

<style lang="stylus" scoped>
.container
  position relative
  width: 100vw
  height: 100vh
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
