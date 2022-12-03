<template>
  <div class="audience-action">
    <div class="tip" v-if="audienceActionTip" :class="[audienceActionTip.type, { show: show }]">{{audienceActionTip.message}}</div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      show: false
    }
  },
  computed: {
    ...mapState({
      audienceActionTip: state => state.audienceActionTip
    })
  },
  watch: {
    audienceActionTip(val) {
      if (val) {
        this.show = true
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.audience-action
  overflow hidden
  .tip
    display flex
    align-items center
    padding 0 .15rem
    font-size .26rem
    width fit-content
    height .44rem
    border-radius .08rem
    color #fff
    opacity 0
    transform translateX(-100%)
    transition .3s linear
    &.coming
      background rgba(11,157,59,0.6)
    &.follow
      background rgba(251,28,28,0.6)
    &.buy
      background rgba(114,0,251,0.6)
    &.cart
      background rgba(255,168,41,0.6)
    &.share
      background rgba(19,47,199,0.6)
    &.packet
      background rgba(251,85,28,0.6)
    &.show
      opacity 1
      transform translateX(0)
      transition .3s linear
</style>