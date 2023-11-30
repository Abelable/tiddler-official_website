<template>
  <div
    id="animation"
    class="animation"
    :class="{ fit: mode === 1, fill: mode !== 1 }"
    :style="{
      width: mode === 1 ? '100vw' : width,
      height: mode === 1 ? height : '100vh',
    }"
  ></div>
</template>

<script>
import SVGA from "svgaplayerweb";
import { mapState } from "vuex";

export default {
  props: {
    url: String,
  },

  data() {
    return {
      mode: 1,
      width: "",
      height: "",
    };
  },

  computed: {
    ...mapState({
      animationVisible: (state) => state.animationVisible,
    }),
  },

  watch: {
    animationVisible(truthy) {
      if (truthy) {
        this.playAnimation();
      }
    },
  },

  methods: {
    async playAnimation() {
      this.parser = new SVGA.Parser("#animation");
      this.player = new SVGA.Player("#animation");
      this.player.loops = 1;
      const { svga } = this.$store.state.animationList[0] || {};
      this.parser.load(svga, (videoItem) => {
        const { width, height } = videoItem.videoSize;
        if (width >= height) {
          this.mode = 1;
          this.height = `${(window.screen.width / width) * height}px`;
        } else {
          this.mode = 2;
          this.width = `${(window.screen.height / height) * width}px`;
        }
        this.player.setVideoItem(videoItem);
        this.player.startAnimation();
        this.player.onFinished(() => {
          const animationList = this.$store.state.animationList.slice(1);
          this.$store.commit("setAnimationList", animationList);
          this.$store.commit("setAnimationVisible", false);
          this.$nextTick(() => {
            if (
              this.$store.state.animationList.length &&
              !this.$store.state.animationVisible
            ) {
              this.$store.commit("setAnimationVisible", true);
            }
          });
        });
      });
    },
  },
};
</script>

<style lang="stylus" scoped>
.animation {
  position: absolute;
  pointer-events: none;
}
.animation.fit {
  top: 50%;
  left: 0;
  transform: translateY(-50%);
}
.animation.fill {
  top: 0;
  left: 50%;
  transform: translateX(-50%);
}
</style>
