<template>
  <div class="container" :class="{ horizontal }">
    <LivePlayer 
      class="player" 
      :videoUrl="`${url.replace('rtmp', 'https')}.m3u8`" 
      aspect='fullscreen' 
      :controls="false"
      fluent 
      autoplay 
      live 
      hide-big-play-button
    />
  </div>
</template>

<script>
import LivePlayer from '@liveqing/liveplayer'

export default {
  components: {
    LivePlayer,
  },

  props: {
    url: String,
    horizontal: Boolean
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
