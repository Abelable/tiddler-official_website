<template>
  <div class="password-modal" @click="hide">
    <div class="main" @click.stop="">
      <div class="custome-modal-title">联系客服</div>
      <img class="custome-qrcode" :src="qrCodeImg" />
      <div class="modal-tips">长按识别二维码</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    qrCodeImg: String,
  },

  methods: {
    hide() {
      this.$emit("hide");
    },
  },
};
</script>

<style lang="stylus" scoped>
.password-modal
  position: fixed
  top: 0
  left: 0
  width: 100vw
  height: 100vh
  background-color: rgba(0, 0, 0, 0.3)
  z-index: 100
  .main
    position: absolute
    top: 50%
    left: 50%
    transform: translate(-50%, -50%)
    padding: .30rem;
    width: 6.50rem;
    border-radius: .20rem
    background: #fff
    transform: translate(-50%, -50%)
.custome-modal-title {
  margin: 0 auto;
  width: fit-content;
  color: #333;
  font-size: 18px;
  font-weight: bold;
}
.custome-qrcode {
  display: block;
  margin: 15px auto;
  width: 210px;
}
.modal-tips {
  margin: 0 auto;
  width: fit-content;
  color: #666;
  font-size: 16px;
}
</style>
