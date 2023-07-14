<template>
  <Popup v-model="show" @click-overlay="hide" position="bottom">
    <div class="voice-input-popup">
      <div class="voice-input-wrap row">
        <div
          class="voice-input row"
          :class="{ active: `${content}${tempContent}` }"
          v-show="voiceRecognizing"
        >
          {{ `${content}${tempContent}` || "请点击按钮进行语音识别" }}
        </div>
        <textarea
          class="voice-input"
          :style="{ height: `${inputHeight}px` }"
          v-show="!voiceRecognizing"
          v-model="content"
          placeholder="请点击按钮进行语音识别"
        ></textarea>
        <img class="send-btn" @click="send" src="../images/send-btn.png" alt="">
      </div>

      <div class="voice-btn-wrap row center">
        <div
          class="voice-btn"
          v-if="!voiceRecognizing"
          @click="startVoiceInput"
        >
          <img class="btn-icon" src="../images/start-voice-input.png" alt="" />
          <div class="btn-tips">点击录制</div>
        </div>
        <div class="voice-btn" v-if="voiceRecognizing" @click="stopVoiceInput">
          <div class="btn-icon-wrap">
            <img class="btn-icon" src="../images/stop-voice-input.png" alt="" />
          </div>
          <div class="btn-tips">结束录制</div>
        </div>
      </div>

      <!-- 只用于监听输入框的高度 -->
      <div class="voice-input-wrap fixed row">
        <div class="voice-input row" ref="voiceInput">
          {{ `${content}${tempContent}` || "请点击按钮进行语音识别" }}
        </div>
        <img class="send-btn" src="../images/send-btn.png" alt="">
      </div>
    </div>
  </Popup>
</template>

<script>
import { Popup, Toast } from "vant";
import { signCallback } from "../utils/asrauthentication";
import AiService from "../utils/aiService";

const aiService = new AiService();

export default {
  components: { Popup },

  props: {
    visible: Boolean,
    replying: Boolean,
  },

  data() {
    return {
      show: false,
      content: "",
      tempContent: "",
      voiceRecognizing: false,
      inputHeight: 45,
    };
  },

  watch: {
    visible: function(truthy) {
      this.show = truthy;
    },
    content: function(content) {
      if (content) {
        this.inputHeight = this.$refs.voiceInput.offsetHeight;
      } else {
        this.inputHeight = 45;
      }
    },
  },

  methods: {
    startVoiceInput() {
      this.createSpeechRecognizer();

      this.speechRecognizer.start();
      this.voiceRecognizing = true;
    },

    stopVoiceInput() {
      this.speechRecognizer.stop();
      this.voiceRecognizing = false;
    },

    createSpeechRecognizer() {
      this.speechRecognizer = new window.WebAudioSpeechRecognizer({
        signCallback,
        secretid: "AKIDY2EDzYicqqlV1TlkPqHXYM55v751pMdg",
        appid: "1301400133",
        engine_model_type: "16k_zh",
        voice_format: 1,
        hotword_id: "08003a00000000000000000000000000",
        needvad: 1,
        filter_dirty: 1,
        filter_modal: 2,
        filter_punc: 0,
        convert_num_mode: 1,
        word_info: 2,
      });
      this.speechRecognizer.OnRecognitionResultChange = (res) => {
        this.tempContent = res.result.voice_text_str;
      };
      this.speechRecognizer.OnSentenceEnd = (res) => {
        this.content = `${this.content}${res.result.voice_text_str}`;
        this.tempContent = "";
      };
      this.speechRecognizer.OnError = () => {
        // Toast("语音识别失败，请重试");
        this.stopVoiceInput();
        this.tempContent = "";
      };
    },

    send() {
      if (this.voiceRecognizing) {
        this.stopVoiceInput()
      }
      if (this.replying) {
        Toast("YouAi正在答复中，请等待!");
        return;
      }
      if (!this.content) {
        Toast("内容不能为空哦");
        return;
      }
      this.$emit("send", this.content);
      this.content = "";
    },

    hide() {
      if (this.voiceRecognizing) {
        this.stopVoiceInput();
      }
      this.tempContent = "";
      this.content = "";

      this.$emit("hide");
    },
  },
};
</script>

<style lang="stylus" scoped>
@keyframes wave
  0%
    opacity: .6
    transform: scale(.8)
  to
    opacity: 0;
    transform: scale(2)
.row
  display: flex
  align-items: center
  &.center
    justify-content: center
.voice-input-popup
  position: relative
  height: fit-content
  overflow hidden
  .voice-input-wrap
    padding: .3rem
    &.fixed
     position: absolute
     bottom: -100%
     left: 0
     width: 100%
    .voice-input
      padding: .24rem .3rem
      flex: 1
      color: #666
      font-size: .26rem
      border-radius: .43rem
      border: 1px solid #DAE1EB
      background: #F5F6FC
      &.active
        color: #333
    .send-btn
      margin-left: .24rem
      width 1.54rem
  .voice-btn-wrap
    height: 5rem
    border-top: 1px solid #F1F3FA
    .voice-btn, .voice-btn
      display: flex
      flex-direction: column
      align-items: center
      .btn-icon-wrap, .btn-icon
        width: 1.96rem
        height: 1.96rem
        border-radius: 50%
      .btn-icon-wrap
        position: relative
        font-size: 0
        overflow: initial
        &::before
          position: absolute
          top: 0
          left: 0
          width: 1.96rem
          height: 1.96rem
          content: ""
          border-radius: 50%
          background: linear-gradient(180deg, #079799 0%, #057F8B 100%)
          animation: wave 1.5s ease-out infinite
      .btn-tips
        position relative
        margin-top: .24rem
        color: #333
        font-size: .3rem
        font-weight: 500
</style>
