<template>
  <div class="container">
    <Live v-if="roomInfo && roomInfo.status == 1 && !liveEnding" :roomInfo="roomInfo" />
    <LiveEnding v-if="liveEnding" :roomInfo="roomInfo" />
    <LiveNotice v-if="roomInfo && roomInfo.status == 2" :roomInfo="roomInfo" />
    <LiveEnd v-if="roomInfo && roomInfo.status == 3" :roomInfo="roomInfo" />

    <SharePopup v-if="sharePopupVisible" @hide="sharePopupVisible = false" />
  </div>
</template>

<script>
import Live from './components/Live'
import LiveEnding from './components/LiveEnding'
import LiveNotice from './components/LiveNotice'
import LiveEnd from './components/LiveEnd'
import SharePopup from './components/SharePopup'

import { mapState } from 'vuex'
import RoomService from '@/service/roomService'

const roomService = new RoomService()

export default {
  components: {
    Live,
    LiveEnding,
    LiveNotice,
    LiveEnd,
    SharePopup,
  },

  data() {
    return {
      roomInfo: null,
    }
  },

  computed: {
    ...mapState({
      liveEnding: state => state.im.liveEnding,
    })
  },

  created() {
    this.setRoomInfo()
  },

  methods: {
    async setRoomInfo() {
      const { show_subtitle, subtitle, watch_num, user_watch_num, like_num, ...roomInfo } = await roomService.getRoomInfo(this.$route.query.id)
      this.roomInfo = roomInfo
      this.$store.commit('setSubtitleVisible', show_subtitle == 1)
      this.$store.commit('setSubtitleContent', subtitle)
      this.$store.commit('setAudienceCount', roomInfo.type_name ? Number(watch_num) : Number(user_watch_num))
      this.$store.commit('setPraiseCount', Number(like_num))
    },
  }
}
</script>

<style lang="stylus" scoped>
.container
  position relative
</style>
