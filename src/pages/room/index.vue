<template>
  <div class="container">
    <img class="bg" v-if="roomInfo" v-lazy="roomInfo.cover + '?x-oss-process=image/resize,w_10'">
    <Room v-if="roomInfo" :roomInfo="roomInfo" />
  </div>
</template>

<script>
import RoomService from '@/service/roomService'
const roomService = new RoomService()

import Room from './components/Room'

export default {
  components: {
    Room
  },

  data() {
    return {
      roomInfo: null,
      liveDuration: '',
      liveEnd: false,
      liveStartModalVisible: false
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
