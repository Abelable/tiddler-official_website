<template>
  <div class="room-wrap" @click="hideModal">
    <Player :roomInfo="roomInfo" />
    <div class="top-part">
      <div class="row center between">
        <AuchorCapsule :roomInfo="roomInfo" />
        <div class="user-count-wrap" @click.stop="roomInfo.type_name ? 'showUsersManagementPopup' : ''">
          <img class="users-icon" src="../../../assets/images/live/user.png" >
          <div class="user-count">{{0}}</div>
        </div>
      </div>
      <div class="row between">
        <div class="recommend-goods">
          <div class="recommend-goods-title">热门推荐</div>
          <img class="recommend-goods-pic" src="" >
        </div>
        <div class="rolling-caption">
          <div class="rolling-caption-content-wrap">
            <div class="rolling-caption-content">这里是公告</div>
          </div>
          <img class="open-arrow" src="../../../assets/images/live/open-arrow.png" >
        </div>
      </div>
    </div>

    <div class="shortcut-btns">
      <img class="shortcut-btn" src="../../../assets/images/live/refresh.png" >
      <img class="shortcut-btn" src="../../../assets/images/live/short.png" >
      <img class="shortcut-btn" src="../../../assets/images/live/users.png" >
      <img class="shortcut-btn" src="../../../assets/images/live/add-user-icon.png" >
      <img class="shortcut-btn" src="../../../assets/images/live/animation.png" >
    </div>

    <div class="bottom-part">
      <AudienceActionTip />
      <Dialog :roomId="roomInfo.id" :fansName="roomInfo.fansName" @toggleSwipeTouchable="toggleSwipeTouchable" />
      <div class="interactive-area">
        <div class="chat-btn" catchtap="showInputModal">
          <img class="ban-icon" src="../../../assets/images/live/ban.png" >
          <div>说点什么......</div>
        </div>
        <div class="btns">
          <img class="btn" src="../../../assets/images/live/cart.png" >
          <img class="btn" src="https://img.ubo.vip/mp/sass/live-push/share.png" >
          <div class="btn">
            <img class="icon" src="https://img.ubo.vip/mp/index/room/praise-icon.png" >
            <div class="praise-count">1</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RoomService from '@/service/roomService'
import Player from './Player'
import AuchorCapsule from './AuchorCapsule'
import AudienceActionTip from './AudienceActionTip'
import Dialog from './Dialog'

const roomService = new RoomService()

export default {
  components: {
    Player,
    AuchorCapsule,
    AudienceActionTip,
    Dialog,
  },

  props: {
    roomInfo: Object
  },

  data() {
    return {
      goodsList: [],
      praiseCount: 0,
      goodsModalVisible: false,
      skuModalVisible: false,
      skuGoodsInfo: null,
      featuresPopVisible: false
    }
  },

  filters: {
    numOverflow(val) {
      if (val > 100000) val = `${(val / 10000).toFixed(1)}w`
      return val
    }
  },

  methods: {
    toggleFeaturesPop() {
      this.featuresPopVisible = !this.featuresPopVisible
    },

    hideModal() {
      this.goodsModalVisible = false
      this.hideSkuModal()
      this.featuresPopVisible = false
      this.toggleSwipeTouchable(true)
    },

    hideSkuModal() {
      this.skuModalVisible = false
      this.skuGoodsInfo = null
      if (!this.goodsModalVisible) this.toggleSwipeTouchable(true)
    },

    toggleSwipeTouchable(val) {
      this.$emit('toggleSwipeTouchable', val)
    }
  }
}
</script>

<style lang="stylus" scoped>
@keyframes wordsLoop {
  0% {
    transform: translateX(3.2rem);
  }
  100% {
    transform: translateX(-100%);
  }
}
.row
  display flex
  margin-bottom: .3rem
  &.between
    justify-content space-between
  &.center
    align-items: center
.room-wrap
  position relative
  width: 100vw
  height: 100vh
  .top-part
    position absolute
    top 0
    left 0
    padding .24rem
    width 100%
    .user-count-wrap
      display: flex
      align-items: center
      padding: 0 .16rem
      width: fit-content
      height: .44rem
      background: rgba(0,0,0,0.3)
      border-radius: .22rem
      border: 0.5px solid rgba(255, 255, 255, 0.3)
      .users-icon
        width: .28rem
        height: .28rem
      .user-count
        margin-left: .04rem
        color: #fff
        font-size: .24rem
    .recommend-goods
      display: flex
      flex-direction: column
      align-items: center
      width: 1.24rem
      height: 1.64rem
      background-image: url('https://img.ubo.vip/youbo_plus/live/recommend-goods-bg.png')
      background-size: 100%
      background-repeat: no-repeat
      .recommend-goods-title
        margin-top: .03rem
        color: #FFE5BD
        font-size: .2rem
        line-height: .3rem
      .recommend-goods-pic
        margin-top: .12rem
        width: 1.14rem
        height: 1.14rem
        border-radius: .18rem
    .rolling-caption
      display: flex
      align-items: center
      padding-left: .18rem
      width: 3.68rem
      height: .44rem
      background: rgba(0,0,0,0.3)
      border-radius: .36rem
      border: 0.5px solid rgba(255, 255, 255, 0.3)
      .rolling-caption-content-wrap
        flex: 1
        overflow: hidden
        .rolling-caption-content
          width: fit-content
          color: #FDDF6A
          font-size: .22rem
          white-space: nowrap
          animation: wordsLoop 16s linear infinite
      .open-arrow
        margin: 0 .08rem
        width: .4rem
        height: .4rem
  .shortcut-btns
    position: absolute
    top 50%
    transform: translateY(-50%)
    right: .24rem
    z-index: 100
    .shortcut-btn
      display: block
      margin-top: .16rem
      width: .7rem
      height: .7rem
  .bottom-part
    position absolute
    left 0
    bottom 0
    padding .24rem
    width 100%
    .interactive-area
      display flex
      align-items center
      .chat-btn
        display: flex
        align-items: center
        padding-left: .24rem
        flex: 1
        height: .7rem
        color: #fff
        font-size: .26rem
        border-radius: .35rem
        background: rgba(0, 0, 0, 0.3)
        .ban-icon
          margin-right: .1rem
          width: .4rem
          height: .4rem
      .btns
        display flex
        .btn
          position relative
          margin-left: .16rem
          width: .7rem
          height: .7rem
          font-size: 0
          overflow: initial
          .icon
            width: .7rem
            height: .7rem
          .praise-count
            position: absolute
            top: -0.28rem
            left: 50%
            transform: translateX(-50%)
            padding: 0 .1rem
            font-size: .18rem
            color: #F94950
            height: .28rem
            line-height: .28rem
            border-radius: .14rem
            background: #fff
            white-space: nowrap
</style>
