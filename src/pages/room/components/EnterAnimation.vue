<template>
  <div class="enter-animation-wrap">
    <div class="enter-animation nomal" :class="{ show }" v-if="info.type === 1">
      <div class="robot-icon" v-if="info.isRobot == 1">虚</div>
      <div class="content" v-if="info.nick_name">
        <div>欢迎</div>
        <div class="omit single-line">
          {{
            !isAnchor && (anonymoused || extraAnonymoused)
              ? (formatName(info.nick_name))
              : info.nick_name
          }}
        </div>
        <div>进入直播间</div>
      </div>
      <div class="content" v-if="info.message">{{ info.message }}</div>
    </div>

    <div
      class="enter-animation static-bg"
      :class="{ show }"
      :style="{ 'background-image': `url(${info.bg})` }"
      v-if="info.type === 2"
    >
      <img
        class="avatar"
        v-if="info.head_img && (isAnchor || (!isAnchor && !extraAnonymoused))"
        :src="info.head_img"
      />
      <div class="content">
        <div class="omit single-line">
          {{
            !isAnchor && (anonymoused || extraAnonymoused)
              ? (formatName(info.nick_name))
              : info.nick_name
          }}
        </div>
        <div>进入直播间</div>
      </div>
    </div>

    <div
      id="svga-player"
      class="svga-player"
      :style="{ height }"
      v-if="info.type === 3"
    ></div>
  </div>
</template>

<script>
import SVGA from "svgaplayerweb";
import { mapState } from "vuex";

export default {
  props: {
    info: Object,
    isAnchor: Boolean,
  },

  data() {
    return {
      show: false,
      height: "",
    };
  },

  computed: {
    ...mapState({
      anonymoused: (state) => state.im.anonymoused,
      extraAnonymoused: (state) => state.im.extraAnonymoused,
    }),
  },

  filters: {

  },

  created() {
    if (this.info.type == 3) {
      setTimeout(() => {
        this.playAnimation();
      });
    } else {
      setTimeout(() => {
        this.show = true;
      });
      setTimeout(() => {
        this.show = false;
      }, 3000);
    }
  },

  methods: {
    formatName(name){
      if (name) {
        if (name.length === 1) {
          return "*";
        } else if (name.length === 2) {
          return "*" + name.slice(-1);
        } else {
          return (
            name.slice(0, 1) +
            name
              .slice(1, -1)
              .split("")
              .map(function() {
                return "*";
              })
              .join("") +
            name.slice(-1)
          );
        }
      }
    },
    async playAnimation() {
      this.parser = new SVGA.Parser("#svga-player");
      this.player = new SVGA.Player("#svga-player");
      this.player.loops = 1;
      const { bg, head_img, nick_name } = this.info;
      this.parser.load(bg, (videoItem) => {
        const { width, height } = videoItem.videoSize;
        this.height = `${(window.screen.width / width) * height}px`;
        this.player.setImage(head_img, "03");
        this.player.setText(
          {
            text: nick_name,
            size: '22px',
            color: "#ffffff",
            offset: { x: -50, y: 0 },
          },
          "01"
        );
        this.player.setText(
          {
            text: "进入直播间",
            size: '22px',
            color: "#ffffff",
            offset: { x: -50, y: 0 },
          },
          "02"
        );
        this.player.setVideoItem(videoItem);
        this.player.startAnimation();
      });
    },
  },
};
</script>

<style lang="stylus" scoped>
.omit {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.omit.single-line {
  line-height: 1;
  -webkit-line-clamp: 1;
}

.enter-animation-wrap {
  position: relative;
  margin-bottom: 12px;
  width: 100vw;
}
.enter-animation {
  opacity: 0;
  transform: translateX(-100%);
  transition: .3s linear;
}
.enter-animation.show {
  opacity: 1;
  transform: translateX(0);
  transition: .3s linear;
}

.nomal, .static-bg {
  display: flex;
  align-items: center;
  padding: 0 5px;
  height: 30px;
}
.nomal {
  width: fit-content;
  background: rgba(11,157,59,0.6);
  border-radius: 4px;
}
.static-bg {
  width: 172px;
  background-repeat: no-repeat;
  background-size: 100%;
}
.avatar {
  margin-right: 5px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
}
.content {
  display: flex;
  align-items: center;
  flex: 1;
  color: #fff;
  font-size: 12px;
}

.robot-icon {
  margin-right: 4px;
  padding: 0 5px;
  height: 18px;
  color: #fff;
  font-size: 11px;
  line-height: 18px;
  background: #BA9243;
  border-radius: 3px;
}

.svga-player {
  width: 100vw;
}
</style>
