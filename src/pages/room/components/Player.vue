<template>
  <div class="container" :class="{ horizontal }">
    <div id="live_player_hw" v-show="roomInfo.live_platform == 'huawei'" class="player" preload="auto" playsinline webkit-playsinline></div>
    <video id="live_player" v-show="roomInfo.live_platform != 'huawei'"  class="player" preload="auto" playsinline webkit-playsinline></video>
  </div>
</template>

<script>
export default {
  props: {
    roomInfo: Object,
    url: String,
    horizontal: Boolean,
    playerPause: Boolean
  },

  data() {
    return {
      player: null,
      HWclient: null
    }
  },

  watch: {
    'player.hasStarted_': {
      deep: true,
      immediate: true,
      handler(val) {
        if (val) {
          this.$store.commit('setLivePlaying', true)
        }
      },
    },
    playerPause(truthy) {
      if (truthy) {
        if(this.roomInfo.live_platform == 'huawei'){
          this.HWclient.pause()
        }else{
          this.player.pause()
        }
      } else {
        if(this.roomInfo.live_platform == 'huawei'){
          this.HWclient.replay()
        }else{
          this.player.play()
        }
      }
    }
  },

  mounted() {
    if(this.roomInfo.live_platform == 'huawei'){
      this.$store.commit('setLivePlaying', true)
      this.HWclient = window.HWLLSPlayer.createClient("webrtc")
      this.HWclient.startPlay(`${this.url.replace('rtmp', 'webrtc')}`,{
        elementId:'live_player_hw',
        objectFit:'cover',
        autoPlay:true
      })
    }else{
      const player = window.TCPlayer('live_player', {
        autoplay: true,
        controlBar: false
      })
      // player.src(`${this.url.replace('rtmp', 'https')}.m3u8`)
      player.src(`${this.url.replace('rtmp', 'webrtc')}.flv`)
      this.player = player
    }
  },

  destroyed() {
    if(this.roomInfo.live_platform == 'huawei'){
      this.HWclient.pause()
    }else{
      this.player.pause()
    }
  },
}
</script>

<style lang="stylus" scoped>
.container
  position absolute
  top 0
  left 50%
  transform: translateX(-50%)
  width 124vw
  height 100vh
  &.horizontal
    top 2.3rem
    width 100vw
    height 4.1rem
  .player
    width 100%
    height 100%
</style>
