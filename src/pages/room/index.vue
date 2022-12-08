<template>
  <div class="container">
    <img class="bg" v-if="roomInfo" v-lazy="roomInfo.cover + '?x-oss-process=image/resize,w_10'">

    <Live v-if="roomInfo && roomInfo.status == 1 && !liveEnding" :roomInfo="roomInfo" />
    <LiveBreak v-if="liveBreak" />
    <LiveEnding v-if="liveEnding" :roomInfo="roomInfo" />
    <LiveNotice v-if="roomInfo && roomInfo.status == 2" :roomInfo="roomInfo" />
    <LiveEnd v-if="roomInfo && roomInfo.status == 3" :roomInfo="roomInfo" />

    <PasswordModal v-if="passwordModalVisible" :pwdError="pwdError" @resetPassword="pwdError = false" @confirm="refetch" @cancel="back" />
    <SharePopup v-if="sharePopupVisible" @hide="sharePopupVisible = false" />
  </div>
</template>

<script>
import { Toast, Dialog } from 'vant'
import Live from './components/Live'
import LiveBreak from './components/LiveBreak'
import LiveEnding from './components/LiveEnding'
import LiveNotice from './components/LiveNotice'
import LiveEnd from './components/LiveEnd'
import PasswordModal from './components/PasswordModal'
import SharePopup from './components/SharePopup'

import { mapState } from 'vuex'
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
      passwordModalVisible: false
    }
  },

  computed: {
    ...mapState({
      liveBreak: state => state.im.liveBreak,
      liveEnding: state => state.im.liveEnding,
    })
  },

  created() {
    this.setRoomInfo()
  },

  methods: {
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
        },
        res => {
          if (res.data.message === '直播间密码错误') {
            if (this.passwordModalVisible) {
              this.pwdError = true
            } else {  
              this.passwordModalVisible = true
            }
          } else if (res.data.message === '非白名单用户，无法查看' || res.data.message === '黑名单用户，无法查看') {
            Dialog.alert({
              message: '您暂无权限观看',
            }).then(() => {
              this.back()
            })
          } else Toast(res.data.message)
        }
      )
    },

    back() {}
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
