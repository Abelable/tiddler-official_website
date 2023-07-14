<template>
  <div class="container" ref="container">
    <img class="bg" src="../images/bg.png" alt="" />

    <div class="main">
      <div class="mode-desc">
        <p>您已进入助手模式，当前选择的助手为：</p>
        <p>{{ assistantInfo ? assistantInfo.name : "" }}</p>
      </div>
      <div class="mode-tips">
        {{ assistantInfo ? assistantInfo.desc : "" }}
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
          :curPlayingVoiceIndex="curPlayingVoiceIndex"
          @reply="reply"
          @playVoice="setCurPlayingVoiceIndex"
          @pauseVoice="curPlayingVoiceIndex = -1"
        />
      </div>
    </div>

    <div class="tips-bubble row" v-if="formItemList.length > 1">
      使用指令模版得到更准确回应
    </div>
    <div
      class="template-btn row center"
      v-if="formItemList.length > 1"
      @click="editPopupVisible = true"
    >
      <img class="flag-icon" src="../images/flag.png" alt="" />
      <div>获取指令</div>
    </div>
    <div class="stop-reply-btn row center" v-if="replying" @click="stopReply">
      <img class="stop-icon" src="../images/break.png" alt="" />
      <div>停止回复</div>
    </div>

    <InputBar
      v-if="!editPopupVisible && !voiceInputPopupVisible"
      :replying="replying"
      @send="send"
      @showVoiceInputPopup="voiceInputPopupVisible = true"
    />

    <Popup v-model="editPopupVisible" closeable round position="bottom">
      <div class="edit-popup-main">
        <div class="form">
          <div class="form-title">
            您当前选用的助手为“{{
              assistantInfo ? assistantInfo.name : ""
            }}”助手
          </div>
          <div class="form-subtitle">瑞播智能助手为您提供以下指令模版</div>
          <div
            class="form-item row"
            v-for="(item, index) in formItemList"
            :key="index"
          >
            <div class="form-label">{{ item.name }}：</div>
            <input
              class="form-input"
              v-model="item.value"
              type="text"
              :placeholder="`请输入${item.name}`"
            />
          </div>
        </div>
        <img class="confirm-btn" @click="confirm" src="../images/confirm-btn.png" alt="">
      </div>
    </Popup>

    <VoiceInputPopup
      :replying="replying"
      :visible="voiceInputPopupVisible"
      @send="sendVoiceText"
      @hide="voiceInputPopupVisible = false"
    />
  </div>
</template>

<script>
import { Popup, Toast } from "vant";
import InputBar from "../components/InputBar";
import MsgItem from "../components/MsgItem";
import VoiceInputPopup from "../components/VoiceInputPopup";

import { mapState } from "vuex";
import { removeWatermark, setWaterMark } from "../utils/wartermark";
import { sendMsgToChatGPT } from "../utils/chat";
import AiService from "../utils/aiService";

const aiService = new AiService();

export default {
  components: { Popup, InputBar, MsgItem, VoiceInputPopup },

  data() {
    return {
      assistantInfo: null,
      msgList: [],
      curPlayingVoiceIndex: -1,
      content: "",
      replying: false,
      formItemList: [],
      editPopupVisible: false,
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
      if (this.replying) {
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

    confirm() {
      if (this.replying) {
        Toast("YouAi正在答复中，请等待!");
        return;
      }

      const emptyItem = this.formItemList.find((item) => !item.value);
      if (emptyItem) {
        Toast(`请输入${emptyItem.name}`);
        return;
      }

      this.sendMsg();
      this.editPopupVisible = false;
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
          "https://img.ubo.vip/ai/ruiboai-avatar.png",
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
          "https://img.ubo.vip/ai/ruiboai-avatar.png",
        role: "assistant",
        content: "",
      };
      this._sendMsg(msg);
      this.msgList = [...this.msgList, robotMsg];
      this.scrollToBottom();
    },

    _sendMsg(msg) {
      this.replying = true;
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
              this.saveMsg(
                "assistant",
                content,
                this.assistantInfo.avatar ||
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

    async setAssitantInfo() {
      this.assistantInfo = await aiService.getAssistantDetail(this.assistantId);
      this.formItemList = this.assistantInfo.instruct
        .match(new RegExp("【(.+?)】", "g"))
        .map((item) => ({
          name: item.replace("【", "").replace("】", ""),
          value: "",
        }));
      if (this.formItemList.length > 1) {
        this.editPopupVisible = true;
      }
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
    padding: .3rem .3rem 2.68rem
    .mode-desc
      color: #05828C
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
  .tips-bubble
    position: fixed
    bottom: 3.36rem
    left: .3rem
    padding: 0 .1rem
    height: .46rem
    color: #fff
    font-size: .2rem
    border-radius: .23rem
    background: #FF546C
    &::after
      position: absolute
      left: .54rem
      bottom: -0.1rem
      width: 0
      height: 0
      content: ''
      border-top: .1rem solid #FF546C
      border-left: .1rem solid transparent
      border-right: .1rem solid transparent
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
  .template-btn
    left: .3rem
    overflow: initial
  .stop-reply-btn
    right: .3rem
  .edit-popup-main
    padding-bottom: .9rem
    .form
      position: relative
      padding: .3rem .3rem .9rem
      background: linear-gradient(90deg, #E7FAFA 0%, #EEFEFC 100%)
      &::after
        position: absolute
        left: 0
        bottom: 0
        width: 100%
        height: .9rem
        content: ""
        background: linear-gradient(180deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1))
      .form-title
        color: #333
        font-size: .28rem
        font-weight: 500
      .form-subtitle
        margin-top: .08rem
        color: #666
        font-size: .24rem
      .form-item
        margin-top: .3rem
        .form-label
          margin-right: .2rem
          color: #494970
          font-size: .28rem
        .form-input
          padding: 0 .2rem
          flex: 1
          height: .64rem
          font-size: .24rem
          background: #fff
          border: 1px solid #E2EBFF
          border-radius: .08rem
    .confirm-btn
      display: block
      margin: 0 auto
      width: 5.1rem
</style>
