<template>
  <div class="container">
    <img class="bg" src="./images/bg.png" alt="" />

    <div class="main">
      <div class="introduce">
        <div class="introduce-title row">
          <img class="logo" src="./images/ruibo-logo.png" alt="" />
          <div>您好，我是您的智能助手</div>
        </div>
        <div class="introduce-content">
          <div>能够学习和理解人类的语言，进行多轮对话</div>
          <div>回答问题，高效便捷地帮助人们获取信息、知识和灵感</div>
        </div>
      </div>

      <div class="btns row between">
        <img class="btn" @click="navToAssistantCenter" src="./images/assistant-center-btn.png" alt="" >
        <img class="btn" @click="newChat" src="./images/new-chat-btn.png" alt="" >
      </div>

      <div class="recommend-assistants card">
        <div class="header row between">
          <div class="recommend-assistants-title">推荐助手</div>
          <div class="refresh-btn row" @click="setAssistantList">
            <img class="icon" src="./images/refresh.png" alt="" />
            <div>换一批</div>
          </div>
        </div>
        <div class="assistant-cards">
          <AssistantCard
            v-for="item in assistantList"
            :key="item.id"
            :item="item"
            hideMore
          />
        </div>
      </div>

      <div class="title">尝试这样问我：</div>
      <div class="question-example card">
        <div
          class="example row"
          v-for="(item, index) in hotTopicList"
          :key="index"
          @click="newChatWithContent(item.topic)"
        >
          {{ item.topic }}
        </div>
      </div>
    </div>

    <div class="history-btn row center" @click="historyPopupVisible = true">
      <img class="history-icon" src="./images/clock.png" alt="" />
      <div>历史记录</div>
    </div>

    <InputBar
      v-if="!historyPopupVisible && !voiceInputPopupVisible"
      @send="newChatWithContent"
      @showVoiceInputPopup="voiceInputPopupVisible = true"
    />

    <HistoryPopup
      :visible="historyPopupVisible"
      @hide="historyPopupVisible = false"
    />

    <VoiceInputPopup
      :visible="voiceInputPopupVisible"
      @send="sendVoiceText"
      @hide="voiceInputPopupVisible = false"
    />
  </div>
</template>

<script>
import InputBar from "./components/InputBar";
import AssistantCard from "./components/AssistantCard";
import HistoryPopup from "./components/HistoryPopup";
import VoiceInputPopup from "./components/VoiceInputPopup";

import router from "@/router";
import AiService from "./utils/aiService";

const aiService = new AiService();

export default {
  components: { InputBar, AssistantCard, HistoryPopup, VoiceInputPopup },

  data() {
    return {
      goodsAssistantList: [],
      assistantList: [],
      hotTopicList: [],
      historyPopupVisible: false,
      voiceInputPopupVisible: false,
    };
  },

  async created() {
    await this.setUserInfo();
    this.setGoodsAssistantList();
    this.setAssistantList();
    this.setHotTopicList();
  },

  methods: {
    async setUserInfo() {
      const {
        id,
        head_img: avatar,
        nick_name: nickname,
        mobile,
      } = await aiService.getCurrentUserInfo();
      localStorage.setItem("userId", id);
      this.$store.commit("setUserInfo", { avatar, nickname, mobile });
    },

    async setGoodsAssistantList() {
      const { list = [] } =
        (await aiService.getAssistantList({ is_goods: 1 })) || {};
      this.goodsAssistantList = list;
    },

    async setAssistantList() {
      if (!this.page) {
        this.page = 0;
      }
      const { list = [] } =
        (await aiService.getAssistantList({
          page: ++this.page,
          page_size: 6,
        })) || {};
      this.assistantList = list;
      if (this.loading) this.loading = false;
      if (this.refreshing) this.refreshing = false;
      if (!list.length && !this.finished) this.finished = true;
    },

    async setHotTopicList() {
      const { list = [] } = (await aiService.getHotTopic()) || {};
      this.hotTopicList = list;
    },

    navToAssistantCenter() {
      router.push("/ai/assistant_center");
    },

    newChat() {
      router.push("/ai/chat");
    },

    newChatWithContent(content) {
      router.push(`/ai/chat?content=${content}`);
    },

    sendVoiceText(content) {
      this.newChatWithContent(content);
      this.voiceInputPopupVisible = false;
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
.card
  padding: .3rem
  background: #fff
  border-radius: .16rem
.container
  position: relative
  .bg
    position: fixed
    top: 0
    left: 0
    width: 100vw
  .main
    padding: .3rem .3rem 2.68rem
    .title
      margin-top: .3rem
      color: #333
      font-size: .28rem
      font-weight: 500
    .introduce
      padding: .24rem
      height: 1.88rem
      background-image: url('./images/intro-bg.png')
      background-size: 100%
      background-repeat: no-repeat
      .introduce-title
        color: #05A5AF
        font-size: .28rem
        font-weight: 500
        .logo
          margin-right: .08rem
          width: .4rem
          height: .4rem
      .introduce-content
        margin-top: .16rem
        color: #44446F
        font-size: .26rem
        font-weight: 500
        white-space: nowrap
    .btns
      margin-top: .3rem
      .btn
        width: 3.36rem
    .recommend-assistants
      margin-top: .34rem
      background-image: url('./images/recommend-assistants-bg.png')
      background-size: 100%
      background-repeat: no-repeat
      .recommend-assistants-title
        color: #44446F
        font-size: .32rem
        font-weight: 500
      .refresh-btn
        color: #9092C5
        font-size: .24rem
        .icon
          margin-right: .02rem
          width .32rem
          height: .32rem
      .assistant-cards
        display: flex
        flex-wrap: wrap
        justify-content: space-between
        margin-top: .12rem
    .question-example
      margin-top: .2rem
      padding: 0 .3rem
      .example
        height: .9rem
        color: #454570
        font-size: .26rem
        font-weight: 500
        border-bottom: 1px solid #E5E5E5
        &:last-child
          border-bottom: none
  .history-btn
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
    .history-icon
      margin-right: .08rem
      width: .32rem
      height: .32rem
</style>
