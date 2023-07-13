<template>
  <div class="input-bar">
    <div class="row">
      <div class="input-wrap row">
        <input
          class="input"
          v-model="content"
          type="text"
          placeholder="瑞播智能为您服务"
          @blur="onBlur"
        />
        <img
          class="mike-icon"
          @click="showVoiceInputPopup"
          src="../images/mike.png"
          alt=""
        />
      </div>
      <img class="send-btn" @click="send" src="../images/send-btn.png" alt="">
    </div>
    <div class="tips">
      产生的内容均为AI智能模型输出，其内容的准确性和完整性无法保证不代表我们的态度或观点
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
import AiService from "../utils/aiService";

const aiService = new AiService();

export default {
  props: {
    replying: Boolean,
  },

  data() {
    return {
      content: "",
    };
  },

  computed: {
    scrollHeight() {
      return (
        document.documentElement.scrollTop ||
        window.pageYOffset ||
        document.body.scrollTop ||
        0
      );
    },
  },

  methods: {
    send() {
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

    showVoiceInputPopup() {
      this.$emit("showVoiceInputPopup");
    },

    onBlur() {
      window.scrollTo(0, Math.max(this.scrollHieght - 1, 0));
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
.input-bar
  position: fixed
  left: 0
  bottom 0
  padding: .3rem .24rem
  width: 100%
  background: #fff
  .input-wrap
    padding: 0 .3rem
    flex: 1
    height: .86rem
    border-radius: .43rem
    border: 1px solid #DAEBE7
    background: #F5FCFA
    .input
      flex: 1
      font-size: .26rem
      height: .86rem
    .mike-icon
      margin-left: .3rem
      width: .44rem
      height: .44rem
  .send-btn
    margin-left: .24rem
    width 1.54rem
  .tips
    margin-top: .2rem
    color: #94B4C2
    font-size: .22rem
    text-align: center
</style>
