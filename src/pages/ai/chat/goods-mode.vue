<template>
  <div class="container" ref="container">
    <img class="bg" src="../images/bg.png" alt="" />

    <div class="main">
      <div class="mode-desc">您已进入有播AI智能商品推荐模式</div>
      <div class="mode-tips">
        您可以输入您的需求，有播AI智能会为您推荐您想要的商品
      </div>

      <div class="chat-content-wrap">
        <MsgItem
          v-for="(item, index) in msgList"
          :key="index"
          :item="item"
          :index="index"
          :msgListLength="msgList.length"
          :assistantInfo="assistantInfo"
          :formItemList="formItemList"
          :replying="replying"
          :customReplying="customReplying"
          :curPlayingVoiceIndex="curPlayingVoiceIndex"
          :sessionId="sessionId"
          :assistantAvatar="assistantInfo.avatar"
          @reply="reply"
          @playVoice="setCurPlayingVoiceIndex"
          @pauseVoice="curPlayingVoiceIndex = -1"
          @finished="customReplying = false"
          @scrollToBottom="scrollToBottom"
          @showGoodsPopup="showGoodsPopup"
        />
      </div>
    </div>

    <div
      class="stop-reply-btn row center"
      v-if="customReplying"
      @click="stopReply"
    >
      <img class="stop-icon" src="../images/break.png" alt="" />
      <div>停止回复</div>
    </div>

    <InputBar
      :replying="customReplying"
      @send="send"
      @showVoiceInputPopup="voiceInputPopupVisible = true"
    />

    <VoiceInputPopup
      :replying="customReplying"
      :visible="voiceInputPopupVisible"
      @send="sendVoiceText"
      @hide="voiceInputPopupVisible = false"
    />

    <GoodsPopup
      :visible="goodsPopupVisible"
      :keywords="keywords"
      @hide="hideGoodsPopup"
    />
  </div>
</template>

<script>
import { Toast } from "vant";
import InputBar from "../components/InputBar";
import MsgItem from "../components/GoodsModeMsgItem";
import VoiceInputPopup from "../components/VoiceInputPopup";
import GoodsPopup from "../components/GoodsPopup";

import { mapState } from "vuex";
import { removeWatermark, setWaterMark } from "../utils/wartermark";
import { sendMsgToChatGPT } from "../utils/chat";
import AiService from "../utils/aiService";

const aiService = new AiService();

export default {
  components: { InputBar, MsgItem, VoiceInputPopup, GoodsPopup },

  data() {
    return {
      assistantInfo: null,
      msgList: [],
      curPlayingVoiceIndex: -1,
      content: "",
      replying: false,
      customReplying: false,
      formItemList: [],
      voiceInputPopupVisible: false,
      keywords: "",
      goodsPopupVisible: false,
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

    const { assistantId } = this.$route.query;
    this.assistantId = assistantId;

    this.setAssitantInfo();
    await this.createSession();
    this.setHistoryMsgList();
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
      if (this.customReplying) {
        Toast("YouAi正在答复中，请等待!");
        return;
      }

      // 联系上下文场景：只有第一条为模版消息
      if (this.assistantInfo.is_context === 1 && this.msgList.length) {
        this.sendMsg(content);
      } else {
        this.formItemList[0].value = content;
        this.sendMsg();
      }
    },

    sendMsg(content = "") {
      if (!content) {
        content = this.assistantInfo.instruct;
        this.formItemList
          .filter((item) => item.value)
          .forEach((item) => {
            content = content.replace(`【${item.name}】`, `【${item.value}】`);
          });
      }

      const msg = {
        avatar:
          this.userInfo.avatar || "https://img.ubo.vip/ai/default-avatar.png",
        role: "user",
        content,
      };
      const robotMsg = {
        avatar:
          this.assistantInfo.avatar ||
          "https://img.ubo.vip/ai/youai-avatar.png",
        role: "assistant",
        content: "",
      };

      this._sendMsg(msg);
      this.msgList = [...this.msgList, msg, robotMsg];
      this.scrollToBottom();
      this.saveMsg(
        "user",
        content,
        this.userInfo.avatar || "https://img.ubo.vip/ai/default-avatar.png"
      );
    },

    reply() {
      const content = this.msgList[this.msgList.length - 2].content;
      const msg = {
        avatar:
          this.userInfo.avatar || "https://img.ubo.vip/ai/default-avatar.png",
        role: "user",
        content,
      };
      const robotMsg = {
        avatar:
          this.assistantInfo.avatar ||
          "https://img.ubo.vip/ai/youai-avatar.png",
        role: "assistant",
        content: "",
      };
      this._sendMsg(msg);
      this.msgList = [...this.msgList, robotMsg];
      this.scrollToBottom();
    },

    _sendMsg(msg) {
      this.replying = true;
      this.customReplying = true;
      this.abortController = new AbortController();

      sendMsgToChatGPT(
        this.assistantInfo.is_context === 1
          ? [...this.msgList.slice(-4), msg]
          : [msg],
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
      this.customReplying = false;
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

    async setAssitantInfo() {
      this.assistantInfo = await aiService.getAssistantDetail(this.assistantId);
      this.formItemList = this.assistantInfo.instruct
        .match(new RegExp("【(.+?)】", "g"))
        .map((item) => ({
          name: item.replace("【", "").replace("】", ""),
          value: "",
        }));
    },

    async createSession() {
      const { id } = (await aiService.createSession(this.assistantId)) || {};
      this.sessionId = id;
    },

    async setHistoryMsgList() {
      const { list = [] } =
        (await aiService.getHistoryMsgList(this.sessionId)) || {};
      this.msgList = list;
      this.scrollToBottom();
    },

    setCurPlayingVoiceIndex(index) {
      this.curPlayingVoiceIndex = index;
    },

    showGoodsPopup(keywords) {
      this.keywords = keywords;
      this.goodsPopupVisible = true;
    },

    hideGoodsPopup() {
      this.keywords = "";
      this.goodsPopupVisible = false;
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
.container
  .bg
    position: fixed
    top: 0
    left: 0
    width: 100vw
  .main
    padding: .3rem .3rem 2.68rem
    .mode-desc
      color: #0866F4
      font-size: .28rem
      font-weight: 500
      text-align: center
    .mode-tips
      margin-top: .2rem
      color: #999
      font-size: .24rem
      font-weight: 500
      text-align: center
    .chat-content-wrap
      margin-top: .3rem
  .template-btn, .stop-reply-btn
    position: fixed
    bottom: 2.64rem
    width: 1.8rem
    height: .6rem
    color: #656983
    font-size: .28rem
    background: #fff
    border-radius: .3rem
    box-shadow: 0px 0px 4px 0px rgba(28,79,149,0.3)
    .flag-icon, .stop-icon
      margin-right: .08rem
      width: .32rem
      height: .32rem
  .stop-reply-btn
    right: .3rem
</style>
