<template>
  <div class="container" :class="{ horizontal }">
    <div
      id="live_player_hw"
      v-show="roomInfo.live_platform == 'huawei' && rtcPeer"
      class="player"
      preload="auto"
      playsinline
      webkit-playsinline
    ></div>
    <video
      id="live_player"
      v-show="!(roomInfo.live_platform == 'huawei' && rtcPeer)"
      class="player"
      preload="auto"
      playsinline
      webkit-playsinline
    ></video>
  </div>
</template>

<script>
let rtcPeer =
  window.RTCPeerConnection ||
  window.webkitRTCPeerConnection ||
  window.mozRTCPeerConnection;
export default {
  props: {
    roomInfo: Object,
    url: String,
    horizontal: Boolean,
    playerPause: Boolean,
  },

  data() {
    return {
      player: null,
      HWclient: null,
      rtcPeer,
    };
  },

  watch: {
    "player.hasStarted_": {
      deep: true,
      immediate: true,
      handler(val) {
        if (val) {
          this.$store.commit("setLivePlaying", true);
        }
      },
    },
    playerPause(truthy) {
      if (truthy) {
        if (this.roomInfo.live_platform == "huawei" && this.rtcPeer) {
          this.HWclient.pause();
        } else {
          this.player.pause();
        }
      } else {
        if (this.roomInfo.live_platform == "huawei" && this.rtcPeer) {
          this.HWclient.replay();
          this.checkMute();
        } else {
          this.player.play();
        }
      }
    },
  },

  async mounted() {
    if (this.roomInfo.live_platform == "huawei" && this.rtcPeer) {
      this.$store.commit("setLivePlaying", true);
      this.HWclient = window.HWLLSPlayer.createClient("webrtc");
      await this.HWclient.startPlay(this.roomInfo.webrtc_url, {
        elementId: "live_player_hw",
        objectFit: "cover",
        autoPlay: true,
      });
      this.checkMute();
    } else {
      const player = window.TCPlayer("live_player", {
        autoplay: true,
        controlBar: false,
      });
      if (this.rtcPeer) {
        player.src(`${this.url.replace("rtmp", "webrtc")}.flv`);
      } else {
        if (this.roomInfo.start_spark == 1) {
          player.src(this.roomInfo.trtc.cdn_url.flv_url);
        } else {
          player.src(`${this.url.replace("rtmp", "https")}.m3u8`);
        }
      }
      this.player = player;
    }
  },
  methods: {
    checkMute() {
      setTimeout(() => {
        this.$emit("checkMute");
      }, 500);
      setTimeout(() => {
        this.$emit("checkMute");
      }, 1000);
    },
  },

  destroyed() {
    if (this.roomInfo.live_platform == "huawei" && this.rtcPeer) {
      this.HWclient.pause();
    } else {
      this.player.pause();
    }
  },
};
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
