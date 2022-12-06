<template>
  <div>
    <div class="mask" :class="{ show }" @click="hide" />
    <div class="popup" :class="{ show }">
      <div class="share-modal">
        <div class="title">{{desc || '快把直播间分享给好友，和好友一起观看吧～'}}</div>
        <div class="content">
          <div class="btn" catchtap="showPosterModal">
            <div class="btn-icon">
              <img style="width: .52rem; height: .52rem;" src="https://img.ubo.vip/mp/i-share-modal/poster-icon.png">
            </div>
            <div>生成海报</div>
          </div>
          <div class="btn" catchtap="showPosterModal">
            <div class="btn-icon">
              <img style="width: .75rem; height: .75rem;" src="../../../assets/images/link-copy.png">
            </div>
            <div>复制链接</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    desc: String
  },

  data() {
    return {
      show: false,
    }
  },

  created() {
    setTimeout(() => {
      this.show = true
    }, 50)
  },

  methods: {
    hide() {
      this.show = false
      setTimeout(() => {
        this.$emit('hide')
      }, 200)
    }
  }
}
</script>

<style lang="stylus" scoped>
.mask
  position: fixed
  top: 0
  left: 0
  width: 100%
  height: 100%
  background: rgba(0, 0, 0, 0.3)
  z-index: 100
  opacity: 0
  transition: opacity .2s ease
  &.show
    opacity: 1
.popup
  position: fixed
  left: 50%
  bottom: 0 
  width: 100%
  max-width: 100vh
  max-height: 100vh
  border-radius: .2rem .2rem 0 0
  background: #fff
  overflow: hidden
  z-index: 100
  transform: translate(-50%, 100%)
  transition: transform .2s ease
  &.show
    transform: translate(-50%, 0)
    transition: transform .3s ease
  .share-modal
    height: 2.54rem
    background-image: url(https://img.ubo.vip/mp/modal-bg.png)
    background-size: 100%
    background-repeat: no-repeat
    .title
      margin: .36rem 0
      font-size: .24rem
      color: #000
      font-weight: 500
      line-height: .34rem
      text-align: center
    .content
      margin: 0 1rem
      display: flex
      align-items: center
      .btn
        display: flex
        flex-direction: column
        align-items: center
        justify-content: center
        flex: 1
        font-size: .22rem
        color: #000
        font-weight: normal
        line-height: .32rem
        .btn-icon
          margin-bottom: .1rem
          display: flex
          align-items: center
          justify-content: center
          width: 1rem
          height: 1rem
          border-radius: 50%
          background: #fff
          box-shadow: 0 .02rem .04rem 0 rgba(215,215,215,0.5)
</style>
