<template>
  <div class="anchor-capsule" @click.stop="showAnchorModal">
    <img class="anchor-avatar" :src="roomInfo.userInfo.head_img" >
    <div class="anchor-capsule-content">
      <div class="anchor-name">{{roomInfo.userInfo.head_img | sliceStr}}</div>
      <div>
        <span>{{roomInfo.user_watch_num}}人 </span>
        <span v-if="roomInfo.position">{{'| ' + roomInfo.position | sliceStr}}</span>
      </div>
    </div>
    <div class="follow-icon" v-if="!roomInfo.is_follow" @click.stop="toggleFollow">关注</div>
  </div>
</template>

<script>
export default {
  props: {
    roomInfo: Object
  },

  filters: {
    sliceStr(val) {
      if (val.lenght > 6) val = val.slice(0, 6) + '...'
      return val
    }
  },

  methods: {
    showAnchorModal() {
      this.$emit('showAnchorModal')
    },

    followAnchor() {}
  }
}
</script>

<style lang="stylus" scoped>
.anchor-capsule
  display flex
  align-items center
  justify-content space-between
  padding 0 .04rem
  width fit-content
  height .64rem
  color #000
  border-radius .32rem
  background-color rgba(0, 0, 0, 0.3)
  border .01rem solid rgba(255,255,255,0.3)
  .anchor-avatar
    width .54rem
    height .54rem
    flex-shrink 0
    border-radius 50%
  .anchor-capsule-content
    display flex
    flex-direction column
    justify-content space-between
    margin 0 .1rem
    height .64rem
    font-size .18rem
    color #fff
    line-height 1.5
    .anchor-name
      font-size .24rem
      font-weight bold
  .follow-icon
    padding .16rem .2rem .15rem
    font-weight bold
    font-size .24rem
    color #000
    line-height 1
    border-radius .27rem
    background-color #EAAB63
</style>