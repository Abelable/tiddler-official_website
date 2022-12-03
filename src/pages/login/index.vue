<template>
  <div class="container">
    <img class="bg" src="https://img.ubo.vip/mp/login/login-bg.png">
    <div class="content">
      <div class="title">请登录</div>
      <div class="tips">欢迎来到有播</div>
      <div class="input-wrap">
        <div class="input-list">
          <img style="width: .38rem; height: .38rem;" src="./images/phone-icon.png">
          <input v-model="mobile" placeholder="请输入手机号">
        </div>
        <div class="input-list">
          <img style="width: .38rem; height: .38rem;" src="./images/code-icon.png">
          <input v-model="code" placeholder="请输入验证码">
          <div class="get-code-btn" @click="sendCode">{{timeStamp ? timeStamp + 's' : '获取验证码'}}</div>
        </div>
      </div>
      <div class="protocol">注册即代表您同意<a href="https://madmin.youboi.com/admin/view_article.php?act=view&article_id=144">《有播用户服务协议》</a></div>
      <div class="login-btn" :class="{ active: code }" @click="login">登录</div>
    </div>
  </div>
</template>

<script>
import LoginService from './utils/loginService'
const loginService = new LoginService()

export default {
  data() {
    return {
      mobile: '',
      code: '',
      timeStamp: 0
    }
  },
  methods: {
    sendCode() {
      if (!this.countDown && this.mobile) {
        loginService.getSms(this.mobile)
        this.setCountDown()
      }
    },

    setCountDown() {
      this.timeStamp = 60
      this.countDown = setInterval(() => {
        if (this.timeStamp > 0) {
          --this.timeStamp
        } else {
          clearInterval(this.countDown)
          this.countDown = null
        }
      }, 1000)
    },

    async login() {
      if (this.code) {
        const { token, is_parent } = await loginService.login(this.mobile, this.code)
        if (token) {
          !is_parent && this.bindSuperior()
          localStorage.setItem('token', token)
          this.$route.query.redirect ? this.$router.push(`${this.$route.query.redirect}`) : this.$router.go(-1)
        }
      }
    },

    bindSuperior() {
      const inviteCode = localStorage.getItem('inviteCode')
      loginService.bindSuperior(inviteCode || 1)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
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