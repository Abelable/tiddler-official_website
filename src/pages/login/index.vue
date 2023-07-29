<template>
  <div class="container" v-if="loginPageVisible">
    <img class="bg" src="https://img.ubo.vip/mp/login/login-bg.png" />
    <div class="content">
      <div class="title">请登录</div>
      <div class="tips">欢迎来到瑞播</div>
      <div class="input-wrap">
        <div class="input-list">
          <img
            style="width: .38rem; height: .38rem;"
            src="./images/phone-icon.png"
          />
          <input v-model="mobile" placeholder="请输入手机号" />
        </div>
        <div class="input-list">
          <img
            style="width: .38rem; height: .38rem;"
            src="./images/code-icon.png"
          />
          <input v-model="code" placeholder="请输入验证码" />
          <div class="get-code-btn" @click="sendCode">
            {{ timeStamp ? timeStamp + "s" : "获取验证码" }}
          </div>
        </div>
      </div>
      <div class="protocol">
        注册即代表您同意<a
          href="https://h5.talking.vip/youbo_plus/h5/index.html#/privacy_policy"
          >《瑞播用户服务协议》</a
        >
      </div>
      <div class="login-btn" :class="{ active: code }" @click="login">登录</div>
    </div>
  </div>
</template>

<script>
import { getUrlParam } from "@/utils/index";
import LoginService from "./utils/loginService";

const loginService = new LoginService();

export default {
  data() {
    return {
      loginPageVisible: false,
      mobile: "",
      code: "",
      timeStamp: 0,
    };
  },

  created() {
    const ua = navigator.userAgent.toLowerCase();
    if (
      (ua.match(/wxwork/i) &&
        ua.match(/wxwork/i).length &&
        ua.match(/wxwork/i)[0] === "wxwork") ||
      !ua.match(/MicroMessenger/i)
    ) {
      this.loginPageVisible = true;
    } else {
      // 公众号授权返回标识
      const isWxAuthCallback = localStorage.getItem("isWxAuthCallback");

      if (!isWxAuthCallback) {
        // 公众号授权
        const { redirect = "" } = this.$route.query || {};
        redirect && localStorage.setItem("redirect", redirect);
        localStorage.setItem("isWxAuthCallback", true);

        const state = encodeURIComponent("login_type=1");
        window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx21737bccb934bd94&redirect_uri=https%3A%2F%2Fapi.talking.vip%2Fofficial-account%2Foauth-callback&response_type=code&scope=snsapi_userinfo&state=${state}#wechat_redirect`;
      } else {
        localStorage.removeItem("isWxAuthCallback");

        const redirect = localStorage.getItem("redirect");
        if (redirect) {
          const token = this.$route.query.token || getUrlParam("token") || "";
          localStorage.setItem("token", token);
          localStorage.removeItem("redirect");
          this.$router.push(`${redirect}`);
        } else {
          window.wx.miniProgram.navigateBack();
        }
      }
    }
  },

  methods: {
    sendCode() {
      if (!this.countDown && this.mobile) {
        loginService.getSms(this.mobile);
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
        const { token } = await loginService.login(this.mobile, this.code);
        if (token) {
          localStorage.setItem("token", token);
          this.$router.push(`${this.$route.query.redirect}`);
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
    padding 1.2rem .6rem
    .title
      color #333
      font-size .68rem
      font-weight bold
    .tips
      margin-left .08rem
      font-size .3rem
      color #333
    .input-wrap
      margin-top .6rem
      padding 0 .5rem
      font-size .26rem
      .input-list
        display flex
        align-items center
        padding .26rem 0
        border-bottom .01rem solid #D8D8D8
        input
          margin-left .15rem
          flex 1
    .protocol
      margin-top 27px
      color #A3A3A3
      font-size 10px
      text-align center
      a
        color #B2372B
        text-decoration none
    .login-btn
      margin .5rem auto
      width 5rem
      height .8rem
      line-height .8rem
      text-align center
      color #fff
      font-weight 500
      font-size .36rem
      border-radius .4rem
      background-color #D8D8D8
      &.active
        background-color #CB9B49
</style>
