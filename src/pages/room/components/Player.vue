<template>
  <div class="container" :class="{ horizontal }">
    <video id="live_player" class="player" preload="auto" playsinline webkit-playsinline></video>
  </div>
</template>

<script>
export default {
  props: {
    url: String,
    horizontal: Boolean
  },

  mounted() {
    const player = window.TCPlayer('live_player', {})
    player.src(`${this.url.replace('rtmp', 'https')}.m3u8`)
  }
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
    height 4.26rem
  .player
    width 100%
    height 100%
</style>
