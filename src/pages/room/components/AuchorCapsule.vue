<template>
  <div class="anchor-capsule">
    <img class="anchor-avatar" :src="roomInfo.studio_head_img" >
    <div class="anchor-name">{{roomInfo.studio_title | sliceStr}}</div>
    <div class="follow-icon" v-if="roomInfo.is_focus == 1" @click.stop="followAnchor">关注</div>
  </div>
</template>

<script>
import RoomService from '@/service/roomService'

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
    followAnchor() {
      new RoomService().handleUser({ 
        studio_id: this.roomInfo.studio_id, 
        user_id: this.$store.state.im.userID, 
        is_focus: 1 
      })
    }
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
    background #fff
  .anchor-name
    margin: 0 .12rem
    color: #fff
    font-size: .24rem
    font-weight: bold
  .follow-icon
    display: flex
    align-items: center
    justify-content: center
    width: .56rem
    height: .54rem
    color: #000
    font-size: .2rem
    font-weight: bold
    border-radius: 50%
    background-color: #EAAB63
</style>