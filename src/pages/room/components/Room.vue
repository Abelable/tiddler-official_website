<template>
  <div class="room-wrap">
    <Player :url="roomInfo.url" :horizontal="roomInfo.direction == 1" />
    <div class="top-part">
      <div class="row center between">
        <AuchorCapsule :roomInfo="roomInfo" />
        <div class="user-count-wrap" @click="roomInfo.type_name ? 'showUsersManagementPopup' : ''">
          <img class="users-icon" src="../../../assets/images/live/user.png" >
          <div class="user-count">{{0}}</div>
        </div>
      </div>
      <div class="row">
        <div class="recommend-goods" v-if="recommendGoods">
          <div class="recommend-goods-title">热门推荐</div>
          <img class="recommend-goods-pic" :src="recommendGoods.goods_img" >
        </div>
        <div class="rolling-caption-wrap">
          <div class="rolling-caption" v-if="subtitleVisible && subtitleContent" @click="adVisible = !adVisible">
            <div class="rolling-caption-content-wrap">
              <div class="rolling-caption-content">{{subtitleContent}}</div>
            </div>
            <img class="open-arrow" src="../../../assets/images/live/open-arrow.png" >
          </div>
          <div class="ad-content-wrap" v-show="adVisible">
            <img class="ad-content-title" src="../../../assets/images/live/ad-title.png">
            <div class="ad-content">{{subtitleContent}}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="shortcut-btns">
      <img class="shortcut-btn" @click="refresh" src="../../../assets/images/live/refresh.png" >
      <img class="shortcut-btn" src="../../../assets/images/live/short.png" >
      <img class="shortcut-btn" src="../../../assets/images/live/users.png" >
      <img class="shortcut-btn" src="../../../assets/images/live/add-user-icon.png" >
      <img class="shortcut-btn" src="../../../assets/images/live/animation.png" >
    </div>

    <div class="bottom-part">
      <AudienceActionTip />
      <Dialog :roomId="roomInfo.id" :isAnchor="!!roomInfo.type_name" />
      <PhraseList v-if="userPhraseList.length" :roomInfo="roomInfo" :phraseList="userPhraseList" />
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
import TIM from 'tim-js-sdk'
import { mapState } from 'vuex'
import { Toast } from 'vant'
import RoomService from '@/service/roomService'

import Player from './Player'
import AuchorCapsule from './AuchorCapsule'
import AudienceActionTip from './AudienceActionTip'
import Dialog from './Dialog'
import PhraseList from './PhraseList'

const roomService = new RoomService()

export default {
  components: {
    Player,
    AuchorCapsule,
    AudienceActionTip,
    Dialog,
    PhraseList,
  },

  props: {
    roomInfo: Object
  },

  data() {
    return {
      goodsList: [],
      userPhraseList: [],
      recommendGoods: null,
      praiseCount: 0,
      adVisible: false,
      goodsModalVisible: false,
      featuresPopVisible: false
    }
  },

  computed: {
    ...mapState({
      subtitleVisible: state => state.im.subtitleVisible,
      subtitleContent: state => state.im.subtitleContent
    })
  },

  filters: {
    numOverflow(val) {
      if (val > 100000) val = `${(val / 10000).toFixed(1)}w`
      return val
    }
  },

  created() {
    this.joinGroup()
    this.setMsgHistory()
    this.setUserPhraseList()
    this.setRecommendGoods()
  },

  destroyed() {
    this.quitGroup()
    this.logoutIm()
  },

  methods: {
    refresh() {
      Toast.loading({ message: '加载中...' })
      this.$set(this.roomInfo, 'url', this.roomInfo.url)
      setTimeout(() => {
        Toast.clear()
      }, 1000)
    },

    async setMsgHistory() {
      const msgList = await roomService.getMsgHistory(this.roomInfo.id)
      if (!this.$store.state.im.liveChatMsgList.length) {
        this.$store.commit('setLiveChatMsgList', msgList)
      }
    },

    async setUserPhraseList() {
      const { list = [] } = await roomService.getPhraseList(this.roomInfo.studio_id, 2) || {}
      this.userPhraseList = list
    },

    async setRecommendGoods() {
      this.recommendGoods = await roomService.getRecommendGoods(this.roomInfo.id)
    },

    joinGroup() {
      this.tim.joinGroup({ groupID: this.roomInfo.group_id, type: TIM.TYPES.GRP_AVCHATROOM })
    },

    quitGroup() {
      this.tim.quitGroup(this.roomInfo.group_id)
    },

    logoutIm() {
      this.tim.logout()
    },

    toggleFeaturesPop() {
      this.featuresPopVisible = !this.featuresPopVisible
    },

    hideModal() {
      this.featuresPopVisible = false
    },
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
      margin-right: .24rem
      width: 1.24rem
      height: 1.64rem
      background-image: url('https://img.ubo.vip/youbo_plus/live/recommend-goods-bg.png')
      background-size: 100%
      background-repeat: no-repeat
      .recommend-goods-title
        margin-top: .04rem
        color: #FFE5BD
        font-size: .2rem
        line-height: .3rem
      .recommend-goods-pic
        margin-top: .08rem
        width: 1.14rem
        height: 1.14rem
        border-radius: .18rem
    .rolling-caption-wrap
      display: flex
      flex-direction: column
      align-items: flex-end
      flex: 1
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
      .ad-content-wrap
        position: relative
        margin-top: .24rem
        padding: .3rem
        width 100%
        font-size: 0
        background: #FFFFFF
        border-radius: .2rem
        &::before
          position: absolute
          right: .4rem
          top: -0.28rem
          content: ""
          width: 0
          height: 0
          border: .16rem solid transparent
          border-bottom-color: #fff 
        .ad-content-title
          width: .92rem
          height: .32rem
        .ad-content
          margin-top: .12rem
          color: #333
          font-size: .24rem
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
