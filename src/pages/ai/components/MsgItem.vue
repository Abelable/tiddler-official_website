<template>
  <div class="chat-msg" :class="{ user: item.role === 'user' }">
    <div class="user-info row">
      <img
        class="avatar"
        v-if="item.role !== 'user'"
        :src="item.avatar"
        alt=""
      />
      <div class="name">
        {{
          item.role === "user"
            ? userInfo.nickname || "我"
            : assistantInfo
            ? assistantInfo.name
            : "YouAi"
        }}
      </div>
      <img
        class="avatar"
        v-if="item.role === 'user'"
        :src="item.avatar"
        alt=""
      />
    </div>
    <div class="chat-msg-content">
      <div v-if="item.role === 'user'">
        {{
          assistantInfo && item.content.includes("【")
            ? formatContent
            : item.content
        }}
      </div>
      <div class="markdown-body" v-if="item.role !== 'user'">
        <div
          style="font-size: 0;"
          v-if="index === msgListLength - 1 && replying"
        >
          <VueMarkdown class="vue-markdown" :source="replyingContent" />
          <div class="cursor" v-if="cursorVisible"></div>
        </div>
        <VueMarkdown
          class="vue-markdown"
          v-else
          :source="item.content"
          v-highlight
        />
      </div>
      <div
        class="more row between"
        v-if="
          item.role !== 'user' &&
            ((index === msgListLength - 1 && !replying) ||
              index !== msgListLength - 1)
        "
      >
        <div>
          <div
            class="reply-btn row"
            v-if="index === msgListLength - 1"
            @click="reply"
          >
            <img class="icon" src="../images/refresh-blue.png" alt="" />
            <div>重新回答</div>
          </div>
        </div>
        <div class="row">
          <div v-if="voiceLoading">音频加载中...</div>
          <img
            class="more-btn"
            v-if="!voiceLoading && !voicePlaying"
            @click="playVoice"
            src="../images/play.png"
            alt=""
          />
          <div class="row" v-if="!voiceLoading && voicePlaying">
            <AudioWave />
            <img
              class="stop-btn"
              @click="pauseVoice"
              src="../images/pause.png"
              alt=""
            />
          </div>
          <img class="more-btn" @click="copy" src="../images/copy.png" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
import VueMarkdown from "vue-markdown";
import AudioWave from "./AudioWave";

import { mapState } from "vuex";
import AiService from "../utils/aiService";

const aiService = new AiService();

export default {
  components: { VueMarkdown, AudioWave },

  props: {
    assistantInfo: {
      type: Object,
      default: null,
    },
    formItemList: Array,
    item: Object,
    index: Number,
    msgListLength: Number,
    replying: Boolean,
    curPlayingVoiceIndex: Number,
  },

  data() {
    return {
      voicePlaying: false,
      voiceLoading: false,
      replyingContent: "",
      cursorVisible: true,
    };
  },

  watch: {
    curPlayingVoiceIndex: function(index) {
      if (index === this.index) {
        this.startVoicePlay();
      } else {
        this.stopVoicePlay();
      }
    },

    "item.content": function(content) {
      const tagList = this.item.content.match(new RegExp("```", "g"));
      if (tagList && tagList.length && tagList.length % 2 === 1) {
        this.replyingContent = content;
        this.cursorVisible = true;
      } else {
        this.replyingContent = `${content} <span class='cursor'></span>`;
        this.cursorVisible = false;
      }
    },
  },

  computed: {
    ...mapState({
      userInfo: (state) => state.userInfo,
    }),

    formatContent() {
      let content = "";
      if (this.formItemList.length > 1) {
        const contentList = this.item.content
          .match(new RegExp("【(.+?)】", "g"))
          .map((item) => item.replace("【", "").replace("】", ""));
        this.formItemList.forEach(({ name }, index) => {
          content = `${content}${name}：${contentList[index]}；`;
        });
      } else {
        content = this.item.content
          .match(new RegExp("【(.+?)】", "g"))[0]
          .replace("【", "")
          .replace("】", "");
      }
      return content;
    },
  },

  methods: {
    playVoice() {
      this.$emit("playVoice", this.index);
    },

    pauseVoice() {
      this.$emit("pauseVoice");
    },

    async startVoicePlay() {
      const reg = new RegExp(
        "[\u4e00-\u9fa5|\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]",
        "g"
      );
      const formatContent = this.item.content.match(reg).join("");
      const lengthLimit = 120;
      const contentList = [];
      const length = Math.floor(formatContent.length / lengthLimit);
      for (let i = 0; i <= length; i++) {
        contentList.push(
          formatContent.slice(i * lengthLimit, (i + 1) * lengthLimit)
        );
      }

      this.voiceSourceList = [];
      for (let i = 0; i < contentList.length; i++) {
        if (i === 0) {
          this.voiceLoading = true;
        }
        const data =
          (await aiService.transformVoiceSource(contentList[i])) || {};
        const list = data.res.list.map((item) => item.Audio);
        if (i === 0) {
          this.voiceLoading = false;
          this.voicePlaying = true;
          this.newAudioPlayer(list[0]);
          if (list.length > 1) {
            this.voiceSourceList = [...this.voiceSourceList, ...list.slice(1)];
          }
        } else {
          this.voiceSourceList = [...this.voiceSourceList, ...list];
        }
      }
    },

    newAudioPlayer(voiceSource) {
      this.audioPlayer = new Audio();
      this.audioPlayer.src = `data:audio/wav;base64,${voiceSource}`;
      this.audioPlayer.play();
      this.audioPlayer.addEventListener(
        "ended",
        () => {
          if (this.voiceSourceList.length) {
            this.newAudioPlayer(this.voiceSourceList[0]);
            this.voiceSourceList.splice(0, 1);
          } else {
            this.voicePlaying = false;
          }
        },
        false
      );
    },

    stopVoicePlay() {
      if (this.voicePlaying) {
        this.audioPlayer.pause();
        this.voicePlaying = false;
        this.voiceSourceList = [];
      }
    },

    copy() {
      const textareaC = document.createElement("textarea");
      textareaC.setAttribute("readonly", "readonly");
      textareaC.value = this.item.content;
      document.body.appendChild(textareaC);
      textareaC.select();
      document.execCommand("copy");
      document.body.removeChild(textareaC);
      Toast("复制成功");
    },

    reply() {
      this.$emit("reply");
    },
  },
};
</script>

<style lang="stylus" scoped>
.row
  display: flex
  align-items: center
  &.center
    justify-content: center
  &.between
    justify-content: space-between
.chat-msg
  margin-top: .3rem
  &.user
    display: flex
    flex-direction: column
    align-items: flex-end
    .chat-msg-content
      color: #fff
      background: #0866F4
  .user-info
    .avatar
      width: .6rem
      height: .6rem
      border-radius: 50%
    .name
      margin: 0 .2rem
      color: #999
      font-size: .22rem
  .chat-msg-content
    margin-top: .2rem
    padding: .24rem
    width: fit-content
    max-width: 6.4rem
    color: #333
    font-size: .24rem
    background: #fff
    border-radius: .08rem
    .vue-markdown
      font-size: .24rem
    .more
      margin-top: .24rem
      padding-top: .24rem
      border-top: 1px solid #E5E5E5
      .reply-btn
        color: #0866F4
        font-size: .22rem
        .icon
          width: .32rem
          height: .32rem
      .more-btn
        margin-left: .3rem
        width: .32rem
        height: .32rem
      .stop-btn
        margin-left: .18rem
        width: .32rem
        height: .32rem
</style>

<style>
.markdown-body p:last-child {
  margin-bottom: 0;
}
.markdown-body pre code,
.markdown-body pre tt {
  white-space: pre-wrap;
  word-break: break-all;
}
@keyframes blink {
  50% {
    background: transparent;
  }
}
.cursor {
  display: inline-block;
  vertical-align: top;
  width: 0.1rem;
  height: 0.32rem;
  background: #0866f4;
  animation: blink 1s infinite;
}
</style>
