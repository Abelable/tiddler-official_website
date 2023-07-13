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
          v-for="({ type, content, list, keywords }, _index) in contentList"
          :key="_index"
        >
          <VueMarkdown
            v-if="type === 'markdown'"
            class="vue-markdown"
            :source="content"
          />
          <div v-else>
            <div class="goods-list row between" v-if="list.length">
              <GoodsItem
                v-for="goods in list.slice(0, 2)"
                :key="goods.id"
                :info="goods"
                :replying="index === msgListLength - 1 && customReplying"
              />
            </div>
            <div
              class="check-more row center"
              v-if="list.length > 2"
              @click="checkMoreGoods(keywords)"
            >
              <div>查看更多</div>
              <img class="more-icon" src="../images/blue-arrow.png" alt="" />
            </div>
          </div>
        </div>
      </div>
      <div
        class="more row between"
        v-if="
          item.role !== 'user' &&
            ((index === msgListLength - 1 && !customReplying) ||
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
import GoodsItem from "./GoodsItem";

import { mapState } from "vuex";
import AiService from "../utils/aiService";

const aiService = new AiService();

export default {
  components: { VueMarkdown, AudioWave, GoodsItem },

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
    customReplying: Boolean,
    curPlayingVoiceIndex: Number,
    sessionId: Number,
    assistantAvatar: String,
  },

  data() {
    return {
      voicePlaying: false,
      voiceLoading: false,
      replyingContent: "",
      contentList: [],
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
      this.contentListCache = content
        .split(new RegExp(/(?=\n\d+\.|\n-)/))
        .map((item) => {
          if (item[item.length - 1].match(new RegExp(/\d+/))) {
            return item.slice(0, -1);
          } else {
            return item;
          }
        });
      const lastCacheContent = this.contentListCache[
        this.contentListCache.length - 1
      ];
      if (lastCacheContent.includes("\n\n")) {
        this.contentListCache = [
          ...this.contentListCache.slice(0, -1),
          ...lastCacheContent.split(new RegExp(/(?=\n\n)/)),
        ];
      }
      if (this.index === this.msgListLength - 1 && this.replying) {
        // 1. 没有搜索词条、或搜索词条为1条的情况
        if (this.contentListCache.length <= 2) {
          this.$set(
            this.contentList[0],
            "content",
            `${this.contentListCache
              .slice(0, 2)
              .join("")}<span class='cursor'></span>`
          );
          this.$emit("scrollToBottom");
          return;
        }

        // 2. 出现第2条搜索词条时
        // 2.1. 去掉第一段内容的光标
        // 2.2. 执行第1条词条的搜索
        if (
          this.contentList[0].content.includes(
            "<span class='cursor'></span>"
          ) &&
          !this.startCustomRendering
        ) {
          this.startCustomRendering = true;
          this.curContentIndex = 1;
          if (this.contentListCache[1].match(new RegExp(/\n\d+\.|\n-/))) {
            this.setGoodsList();
          }
        }
      }
    },

    replying: function(truthy) {
      if (
        this.index === this.msgListLength - 1 &&
        !truthy &&
        this.contentListCache.length === 1
      ) {
        this.contentList = [
          {
            type: "markdown",
            content: this.item.content,
          },
        ];
        this.saveMsg();
        this.$emit("finished");
      }
    },
  },

  computed: {
    ...mapState({
      userInfo: (state) => state.userInfo,
    }),

    formatContent() {
      return this.item.content
        .match(new RegExp("【(.+?)】", "g"))[0]
        .replace("【", "")
        .replace("】", "");
    },
  },

  created() {
    const { role, custom_content } = this.item;
    if (
      role !== "user" &&
      this.index === this.msgListLength - 1 &&
      this.replying
    ) {
      this.contentList = [
        {
          type: "markdown",
          content: "<span class='cursor'></span>",
        },
      ];
    }
    if (role !== "user" && custom_content) {
      this.contentList = JSON.parse(custom_content);
    }
  },

  methods: {
    async setGoodsList() {
      const content = this.contentListCache[this.curContentIndex];
      const keywords = content.match(new RegExp(/[\u4e00-\u9fa5]/g)).join("");

      const { list = [] } =
        (await aiService.searchGoodsList({ title: keywords, pageSize: 4 })) ||
        {};
      this.$set(
        this.contentList[this.contentList.length - 1],
        "content",
        this.curContentIndex === 1
          ? this.contentListCache.slice(0, 2).join("")
          : content
      );

      this.contentList = [
        ...this.contentList,
        {
          type: "goods",
          list: list && list.length ? list.slice(0, 1) : [],
          keywords,
        },
      ];

      if (list && list.length > 1) {
        setTimeout(() => {
          const cacheContent = this.contentList[this.contentList.length - 1];
          this.$set(cacheContent, "list", [
            ...cacheContent.list,
            ...list.slice(1),
          ]);
          this._checkRenderingMarkdown();
        }, 800);
      } else {
        this._checkRenderingMarkdown();
      }
    },

    _checkRenderingMarkdown() {
      this.$emit("scrollToBottom");

      ++this.curContentIndex;
      if (this.contentListCache[this.curContentIndex] && this.customReplying) {
        this.renderingMarkdown();
      } else {
        this.saveMsg();
        this.$emit("finished");
      }
    },

    async renderingMarkdown() {
      this.contentList = [
        ...this.contentList,
        {
          type: "markdown",
          content: "<span class='cursor'></span>",
        },
      ];
      const cacheContent = this.contentListCache[this.curContentIndex];
      this.renderingInterval = setInterval(() => {
        if (!this.wordIndex) {
          this.wordIndex = 0;
        }
        if (cacheContent.length === this.wordIndex) {
          clearInterval(this.renderingInterval);
          this.wordIndex = 0;

          if (
            cacheContent.match(new RegExp(/\n\d+\.|\n-/)) &&
            this.customReplying
          ) {
            this.setGoodsList();
          } else {
            this.$set(
              this.contentList[this.contentList.length - 1],
              "content",
              cacheContent
            );
            this.saveMsg();
            this.$emit("finished");
          }
          return;
        }

        ++this.wordIndex;
        this.$set(
          this.contentList[this.contentList.length - 1],
          "content",
          `${cacheContent.slice(0, this.wordIndex)}<span class='cursor'></span>`
        );
        this.$emit("scrollToBottom");
      }, 100);
    },

    saveMsg() {
      const customContent = JSON.stringify(this.contentList);
      aiService.saveChatMsg(
        this.sessionId,
        "assistant",
        this.item.content,
        this.assistantAvatar || "https://img.ubo.vip/ai/youai-avatar.png",
        customContent
      );
    },

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

    checkMoreGoods(keywords) {
      this.$emit("showGoodsPopup", keywords);
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
    .goods-list
      width: 5.92rem
      transform: perspective(1000)
    .check-more
      margin-bottom: .24rem
      color: #5D7CFF
      font-size: .24rem
      .more-icon
        width: .24rem
        height: .24rem
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
