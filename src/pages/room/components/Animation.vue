<template>
  <div id="animation"></div>
</template>

<script>
import SVGA from 'svgaplayerweb'

export default {
  props: {
    url: String,
  },

  watch: {
    url(url) {
      if (url) {
        this.parser.load(url, (videoItem) => {
        this.player.setVideoItem(videoItem);
        this.player.startAnimation();
      })
      }
    }
  },

  created() {
    this.player = new SVGA.Player('#animation');
    this.parser = new SVGA.Parser('#animation');
  },

  methods: {
  
  }
}
</script>

<style lang="stylus" scoped>
#animation
  position: fixed
  top: 0
  left: 0
  width: 100vw
  height: 100vh
  z-index: 100
  pointer-events: none
</style>
