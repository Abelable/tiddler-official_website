<template>
  <div class="password-modal">
    <div class="main">
      <img class="illus" src="https://img.ubo.vip/mp/sass/live-play/password-illus.png">
      <div class="title">请在此输入密码进入直播间</div>
      <input class="input" type="number" v-model="password" placeholder="请输入密码" >
      <div class="error-tips">{{pwdError ? '*密码错误' : ''}}</div>
      <div class="btns">
        <div class="cancel-btn" @click="cancel">取消</div>
        <div class="confirm-btn" @click="confirm">确认</div>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from 'vant'

export default {
  props: {
    pwdError: Boolean
  },

  data() {
    return {
      password: ''
    }
  },

  watch: {
    password(val) {
      if (this.pwdError && val) {
        this.$emit('resetPassword')
      }
    }
  },

  methods: {
    confirm() {
      if (!this.password) {
        Toast('请输入密码')
        return
      }
      this.$emit('confirm', this.password)
    },

    cancel() {
      this.$emit('cancel')
    },
  }
}
</script>

<style lang="stylus" scoped>
.password-modal
  position: fixed
  top: 0
  left: 0
  width: 100vw
  height: 100vh
  background-color: rgba(0, 0, 0, 0.3)
  backdrop-filter: blur(10px)
  .main
    position: absolute
    top: 50%
    left: 50%
    transform: translate(-50%, -50%)
    font-size: 0
    width: 6.14rem
    border-radius: .20rem
    background: #fff
    transform: translate(-50%, -50%)
    .illus
      width: 100%
      height: 4.9rem
    .title
      margin-top: .40rem
      color: #333
      font-size: .36rem
      text-align: center
      font-weight: bold
    .input
      margin: .40rem auto 0
      padding: 0 .24rem
      font-size: .28rem
      width: 5.20rem
      height: .88rem
      border-radius: .08rem
      background: #EFEFEF
    .error-tips
      margin-top: .10rem
      margin-left: .48rem
      color: #FF3E3E
      font-size: .28rem
      height: .86rem
    .btns
      display: flex
      border-top: 1px solid #eee
      .confirm-btn
        display: flex
        align-items: center
        justify-content: center
        flex: 1
        color: #D68C1E
        font-size: .34rem
        height: .92rem
      .cancel-btn
        display: flex
        align-items: center
        justify-content: center
        flex: 1
        font-size: .34rem
        height: .92rem
        color: #999
        border-right: 1px solid #eee
</style>
