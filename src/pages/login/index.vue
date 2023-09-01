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
                <div>+{{areaCodeList[curAreaCodeIdx].value}}</div>
                <img
                  class="down-arrow"
                  src="./images/down-arrow.png"
                />
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
      <button class="login-btn" :class="{ active: code }" @click="login">登录</button>
    </div>
    <div class="protocol">
        注册即代表您同意<a
          href="https://h5.talking.vip/youbo_plus/h5/index.html#/privacy_policy"
          >《瑞播用户服务协议》</a
        >
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

  created() {
    const ua = navigator.userAgent.toLowerCase();
    if (
      (ua.match(/wxwork/i) &&
        ua.match(/wxwork/i).length &&
        ua.match(/wxwork/i)[0] === "wxwork") ||
      !ua.match(/MicroMessenger/i)
    ) {
      this.loginPageVisible = true;
      this.setAreaCodeList();
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
      this.curAreaCodeIdx = index
      this.showPopover = false
    },

    sendCode() {
      if (!this.countDown && this.mobile) {
        loginService.getSms(`${this.areaCodeList[this.curAreaCodeIdx].value}-${this.mobile}`);
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
        const { token } = await loginService.login(`${this.areaCodeList[this.curAreaCodeIdx].value}-${this.mobile}`, this.code) || {};
        const { redirect } = this.$route.query
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
    padding 1.2rem .4rem
    .title
      color #333
      font-size .68rem
      font-weight bold
    .tips
      margin-left .08rem
      font-size .3rem
      color #333
    .input-wrap
      margin-top 2.4rem
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
      margin .9rem auto
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
    position: absolute
    bottom: 1rem
    left: 0
    width: 100%
    color #A3A3A3
    font-size 10px
    text-align center
    a
      color #B2372B
      text-decoration none
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
