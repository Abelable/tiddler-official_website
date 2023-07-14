<template>
  <div class="container" ref="container">
    <img class="bg" src="../images/bg.png" alt="" />

    <div class="main">
      <div class="chat-content-wrap">
        <MsgItem
          v-for="(item, index) in msgList"
          :key="index"
          :item="item"
          :index="index"
          :msgListLength="msgList.length"
          :replying="replying"
          :curPlayingVoiceIndex="curPlayingVoiceIndex"
          @reply="reply"
          @playVoice="setCurPlayingVoiceIndex"
          @pauseVoice="curPlayingVoiceIndex = -1"
        />
      </div>
    </div>

    <div class="stop-reply-btn row center" v-if="replying" @click="stopReply">
      <img class="stop-icon" src="../images/break.png" alt="" />
      <div>停止回复</div>
    </div>

    <InputBar
      v-if="!voiceInputPopupVisible"
      :replying="replying"
      @send="send"
      @showVoiceInputPopup="voiceInputPopupVisible = true"
    />

    <VoiceInputPopup
      :visible="voiceInputPopupVisible"
      :replying="replying"
      @send="sendVoiceText"
      @hide="voiceInputPopupVisible = false"
    />
  </div>
</template>

<script>
import { Toast } from "vant";
import InputBar from "../components/InputBar";
import MsgItem from "../components/MsgItem";
import VoiceInputPopup from "../components/VoiceInputPopup";

import { mapState } from "vuex";
import { removeWatermark, setWaterMark } from "../utils/wartermark";
import { sendMsgToChatGPT } from "../utils/chat";
import AiService from "../utils/aiService";

const aiService = new AiService();

export default {
  components: { InputBar, MsgItem, VoiceInputPopup },

  data() {
    return {
      msgList: [],
      curPlayingVoiceIndex: -1,
      replying: false,
      voiceInputPopupVisible: false,
    };
  },

  computed: {
    ...mapState({
      userInfo: (state) => state.userInfo,
    }),
  },

  async mounted() {
    const { nickname, mobile } = this.userInfo;
    setWaterMark(
      "AI输出内容，仅供参考",
      mobile
        ? `${mobile.slice(0, 3)}****${mobile.slice(-4)} ${nickname ||
            "暂无昵称"}`
        : nickname || "暂无昵称"
    );

    const { sessionId, content } = this.$route.query;
    if (sessionId) {
      this.sessionId = sessionId;
      this.setHistoryMsgList();
    } else {
      await this.createSession();
    }

    if (content) {
      this.send(content);
    }
  },

  destroyed() {
    if (this.replying) {
      this.stopReply();
    }
    removeWatermark();

    if (!this.msgList.length) {
      aiService.deleteSession(this.sessionId);
    }
  },

  methods: {
    sendVoiceText(content) {
      this.send(content);
      this.voiceInputPopupVisible = false;
    },

    send(content) {
      if (this.replying) {
        Toast("YouAi正在答复中，请等待!");
        return;
      }
      const msg = {
        avatar:
          this.userInfo.avatar || "https://img.ubo.vip/ai/default-avatar.png",
        role: "user",
        content,
      };
      const robotMsg = {
        avatar: "https://img.ubo.vip/ai/ruiboai-avatar.png",
        role: "assistant",
        content: "",
      };
      this.sendMsg(msg);
      this.msgList = [...this.msgList, msg, robotMsg];
      this.scrollToBottom();
      this.saveMsg(
        "user",
        content,
        this.userInfo.avatar || "https://img.ubo.vip/ai/default-avatar.png"
      );
    },

    reply() {
      const msg = {
        avatar:
          this.userInfo.avatar || "https://img.ubo.vip/ai/default-avatar.png",
        role: "user",
        content: this.msgList[this.msgList.length - 2].content,
      };
      const robotMsg = {
        avatar: "https://img.ubo.vip/ai/ruiboai-avatar.png",
        role: "assistant",
        content: "",
      };
      this.sendMsg(msg);
      this.msgList = [...this.msgList, robotMsg];
      this.scrollToBottom();
    },

    sendMsg(msg) {
      this.replying = true;
      this.abortController = new AbortController();

      sendMsgToChatGPT(
        [...this.msgList.slice(-4), msg],
        this.abortController.signal,
        ({ event, data }) => {
          const content = this.msgList[this.msgList.length - 1].content;

          switch (event) {
            case "message":
              if (data !== "<!finish>") {
                const { delta = {} } = JSON.parse(data) || {};
                if (delta.content) {
                  this.$set(
                    this.msgList[this.msgList.length - 1],
                    "content",
                    `${content}${delta.content}`
                  );
                  this.scrollToBottom();
                }
              }
              break;

            case "stop":
              this.saveMsg(
                "assistant",
                content,
                "https://img.ubo.vip/ai/ruiboai-avatar.png"
              );
              this.replying = false;
              this.scrollToBottom();
              break;
          }
        },
        () => {
          Toast("服务异常，请稍后再试");
          this.stopReply();
        }
      );
    },

    stopReply() {
      this.abortController.abort();
      this.replying = false;
    },

    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.container;
        if (container) {
          window.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
        }
      });
    },

    saveMsg(role, content, avatar) {
      aiService.saveChatMsg(this.sessionId, role, content, avatar);
    },

    async createSession() {
      const { id } = await aiService.createSession();
      this.sessionId = id;
    },

    async setHistoryMsgList() {
      const { list } = await aiService.getHistoryMsgList(this.sessionId);
      this.msgList = list;
      this.scrollToBottom();
    },

    setCurPlayingVoiceIndex(index) {
      this.curPlayingVoiceIndex = index;
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
.container
  .bg
    position: fixed
    top: 0
    left: 0
    width: 100vw
  .main
    padding: 0 .3rem 2.68rem
  .stop-reply-btn
    position: fixed
    right: .3rem
    bottom: 2.64rem
    width: 1.8rem
    height: .6rem
    color: #656983
    font-size: .28rem
    background: #fff
    border-radius: .3rem
    box-shadow: 0px 0px 4px 0px rgba(28,79,149,0.3)
    .stop-icon
      margin-right: .08rem
      width: .32rem
      height: .32rem
</style>
