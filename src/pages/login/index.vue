<template>
  <div class="container" v-if="loginPageVisible">
    <img class="bg" src="https://img.ubo.vip/mp/login/login-bg.png" />
    <div class="content">
      <div class="title">请登录</div>
      <div class="tips">欢迎来到瑞播</div>
      <div class="input-wrap">
        <div class="input-list">
          <Popover v-model="showPopover" trigger="click">
            <ul class="area-code-list">
              <li
                class="area-code"
                v-for="(item, index) in areaCodeList"
                :key="index"
                @click="selectAreaCode(index)"
              >
                {{ item.text }}
              </li>
            </ul>
            <template #reference>
              <div class="area-code-pikcer" v-if="areaCodeList.length">
                <div>+{{ areaCodeList[curAreaCodeIdx].value }}</div>
                <img class="down-arrow" src="./images/down-arrow.png" />
              </div>
            </template>
          </Popover>
          <input v-model="mobile" placeholder="请输入手机号" />
        </div>
        <div class="input-list">
          <div class="code-label">验证码：</div>
          <input v-model="code" placeholder="请输入验证码" />
          <div class="get-code-btn" @click="sendCode">
            {{ timeStamp ? timeStamp + "s" : "获取验证码" }}
          </div>
        </div>
      </div>
      <button class="login-btn" :class="{ active: code }" @click="login">
        登录
      </button>
    </div>
    <div class="protocol">
      注册即代表您同意<a
        href="https://h5.talking.vip/youbo_plus/h5/index.html#/privacy_policy"
        >《瑞播用户服务协议》</a
      >
    </div>

    <div class="other-login">
      <img src="./images/title.png" alt="" class="other-login-title" />
      <div class="login-btn-wrap">
        <div class="login-btn" @click="lineLogin">
          <img src="./images/line.png" alt="" class="login-btn-icon" />
          <div class="login-btn-desc">LINE</div>
        </div>
        <!-- <div class="login-btn">
          <img src="./images/tiktok.png" alt="" class="login-btn-icon" />
          <div class="login-btn-desc">TikTok</div>
        </div>
        <div class="login-btn">
          <img src="./images/wechat.png" alt="" class="login-btn-icon" />
          <div class="login-btn-desc">微信</div>
        </div> -->
        <div class="login-btn" @click="facebookLogin">
          <img src="./images/facebook.png" alt="" class="login-btn-icon" />
          <div class="login-btn-desc">facebook</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Popover } from "vant";

import { getUrlParam } from "@/utils/index";
import LoginService from "./utils/loginService";

const loginService = new LoginService();

export default {
  components: { Popover },

  data() {
    return {
      loginPageVisible: false,
      mobile: "",
      code: "",
      timeStamp: 0,
      showPopover: false,
      areaCodeList: [],
      curAreaCodeIdx: 0,
    };
  },

  async created() {
    if (this.$route.query.showLoginPage) {
      this.loginPageVisible = true;
      this.setAreaCodeList();
      return;
    }
    const ua = navigator.userAgent.toLowerCase();
    if (
      ua.match(/MicroMessenger/i) ||
      ua.match(/line/i) ||
      ua.match(/facebook/i)
    ) {
      const isAuthCallback = localStorage.getItem("isAuthCallback");
      const token = this.$route.query.token || getUrlParam("token") || "";
      if (!isAuthCallback || !token) {
        const { redirect = "" } = this.$route.query || {};
        redirect && localStorage.setItem("redirect", redirect);
        localStorage.setItem("isAuthCallback", true);

        if (ua.match(/MicroMessenger/i)) {
          // 微信环境
          const state = encodeURIComponent("login_type=1");
          window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx0803e1b3189df83d&redirect_uri=https%3A%2F%2Fapi.talking.vip%2Fofficial-account%2Foauth-callback&response_type=code&scope=snsapi_userinfo&state=${state}#wechat_redirect`;
        } else if (ua.match(/line/i)) {
          // line环境
          window.location.href = await this.setLineLoginUrl();
        } else if (ua.match(/facebook/i)) {
          // facebook环境
          window.location.href = await this.setFacebookLoginUrl();
        }
      } else {
        this.finishLogin();
      }
    } else {
      const isAuthCallback = localStorage.getItem("isAuthCallback");
      if (isAuthCallback) {
        this.finishLogin();
      } else {
        this.loginPageVisible = true;
        this.setAreaCodeList();
      }
    }
  },

  methods: {
    finishLogin() {
      localStorage.removeItem("isAuthCallback");

      const redirect = localStorage.getItem("redirect");

      if (redirect) {
        const token = this.$route.query.token || getUrlParam("token") || "";
        if (token) {
          localStorage.setItem("token", token);
          localStorage.removeItem("redirect");
          this.$router.push(`${redirect}`);
        } else {
          this.loginPageVisible = true;
          this.setAreaCodeList();
        }
      } else {
        window.wx.miniProgram.navigateBack();
      }
    },

    async setLineLoginUrl() {
      const { url } = (await loginService.getLineLoginUrl()) || {};
      return url;
    },

    async setFacebookLoginUrl() {
      const { url } = (await loginService.getFacebookLoginUrl()) || {};
      return url;
    },

    async lineLogin() {
      const { redirect = "" } = this.$route.query || {};
      redirect && localStorage.setItem("redirect", redirect);
      localStorage.setItem("isAuthCallback", true);

      window.location.href = await this.setLineLoginUrl();
    },

    async facebookLogin() {
      const { redirect = "" } = this.$route.query || {};
      redirect && localStorage.setItem("redirect", redirect);
      localStorage.setItem("isAuthCallback", true);

      window.location.href = await this.setFacebookLoginUrl();
    },

    async setAreaCodeList() {
      const list = await loginService.getAreaCodeList();
      this.areaCodeList = [
        { text: "86 中国", value: 86 },
        { text: "886 台湾", value: 886 },
        ...list
          .filter((item) => item[1] && item[0] !== "中国" && item[0] !== "台湾")
          .map((item) => ({
            text: `${item[1]} ${item[0]}`,
            value: item[1],
          })),
      ];
    },

    selectAreaCode(index) {
      this.curAreaCodeIdx = index;
      this.showPopover = false;
    },

    sendCode() {
      if (!this.countDown && this.mobile) {
        loginService.getSms(
          `${this.areaCodeList[this.curAreaCodeIdx].value}-${this.mobile}`
        );
        this.setCountDown();
      }
    },

    setCountDown() {
      this.timeStamp = 60;
      this.countDown = setInterval(() => {
        if (this.timeStamp > 0) {
          --this.timeStamp;
        } else {
          clearInterval(this.countDown);
          this.countDown = null;
        }
      }, 1000);
    },

    async login() {
      if (this.code) {
        const { token } =
          (await loginService.login(
            `${this.areaCodeList[this.curAreaCodeIdx].value}-${this.mobile}`,
            this.code
          )) || {};
        const { redirect } = this.$route.query;
        if (redirect) {
          localStorage.setItem("token", token);
          this.$router.push(`${redirect}`);
        } else {
          window.wx.miniProgram.navigateBack();
        }
      }
    },
  },
};
</script>

<style lang="stylus" scoped>
.container
  position relative
  width: 100vw;
  height: 100vh;
  .bg
    position absolute
    top 0
    left 0
    width 100%
    height 100%
    z-index -1
  .content
    padding .8rem .4rem .36rem
    .title
      color #333
      font-size .68rem
      font-weight bold
    .tips
      margin-left .08rem
      font-size .3rem
      color #333
    .input-wrap
      margin-top 2rem
      font-size .28rem
      .input-list
        display flex
        align-items center
        padding .26rem 0
        border-bottom 1px solid #e7e7e7
        .area-code-pikcer
          display: flex
          align-items: center
          width: 1.3rem
          border-right: 1px solid #D8D8D8
          .down-arrow
            margin-left: .06rem
            width: .32rem
            height: .32rem
        input
          margin-left .15rem
          flex 1
        .code-label
          width: 1.3rem
        .get-code-btn
          color: #DAB174
    .login-btn
      margin .9rem auto 0
      width 100%
      height 1rem
      color #fff
      font-weight 500
      font-size .36rem
      border-radius .5rem
      background #D8D8D8
      &.active
        color: #FFE5BD
        background: linear-gradient(128deg, #404A5C 0%, #0F131A 100%);
  .protocol
    color #A3A3A3
    font-size 10px
    text-align center
    a
      color #B2372B
      text-decoration none
  .other-login
    display: flex
    flex-direction: column
    align-items: center
    margin-top: 2rem
    width 100vw
    .other-login-title
      height: .4rem
    .login-btn-wrap
      display: flex
      justify-content: space-around
      margin-top: .4rem
      padding: 0 .6rem
      width 100%
      .login-btn
        display: flex
        flex-direction: column
        align-items: center
        .login-btn-icon
          width: .8rem
          height: .8rem
        .login-btn-desc
          margin-top: .16rem
          color: #333
          font-size: .24rem
.area-code-list
  height: 5rem
  overflow-y: scroll
  .area-code
    display: flex
    align-items: center
    justify-content: center
    color: #333
    font-size: .26rem
    height: .8rem
    border-bottom: 1px solid #ddd
</style>
