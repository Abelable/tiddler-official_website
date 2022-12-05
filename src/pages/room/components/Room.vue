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
      <img class="shortcut-btn" @click="refresh" src="../../../assets/images/live/refresh.png" >
      <img class="shortcut-btn" src="../../../assets/images/live/short.png" >
      <img class="shortcut-btn" src="../../../assets/images/live/users.png" >
      <img class="shortcut-btn" src="../../../assets/images/live/add-user-icon.png" >
      <img class="shortcut-btn" src="../../../assets/images/live/animation.png" >
    </div>

    <div class="bottom-part">
      <AudienceActionTip />
      <Dialog :roomId="roomInfo.id" :isAnchor="!!roomInfo.type_name" @toggleSwipeTouchable="toggleSwipeTouchable" />
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
import TIMUploadPlugin from 'tim-upload-plugin'
import Vue from 'vue'
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
      praiseCount: 0,
      goodsModalVisible: false,
      featuresPopVisible: false
    }
  },

  computed: {
    ...mapState({
      sdkAppID: state => state.im.sdkAppID,
      userID: state => state.im.userID,
      userSig: state => state.im.userSig
    })
  },

  filters: {
    numOverflow(val) {
      if (val > 100000) val = `${(val / 10000).toFixed(1)}w`
      return val
    }
  },

  created() {
    this.initTim()
    this.joinGroup()
    this.setMsgHistory()
    this.setUserPhraseList()
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

    initTim() {
      const tim = TIM.create({ SDKAppID: this.sdkAppID })
      if (tim) {
        tim.setLogLevel(1)
        tim.registerPlugin({'tim-upload-plugin': TIMUploadPlugin})
        tim.on(TIM.EVENT.MESSAGE_RECEIVED, this.onMsgReceive)
        tim.login({ userID: this.userID, userSig: this.userSig })
        this.tim = tim
        Vue.prototype.tim = tim
      }
    },

    onMsgReceive({ data = [] }) {
      console.log('tim', data)
      data.forEach(item => {
        const { conversationType, type, payload } = item
        switch (conversationType) {
          case TIM.TYPES.CONV_SYSTEM:
            if (type === TIM.TYPES.MSG_GRP_SYS_NOTICE) {
              // handleLiveCustomMsg(payload)
            }
            break

          case TIM.TYPES.CONV_GROUP:
            if (type === TIM.TYPES.MSG_TEXT) {
              this.handleLiveChatMsg(payload)
            } else if (type === TIM.TYPES.MSG_CUSTOM) {
              // handleLiveCustomMsg(payload)
            }
            break
        }
      })
    },

    handleLiveChatMsg(payload) {
      const { nick_name, ...rest } = typeof(payload.text) === 'string' ? JSON.parse(payload.text.replace(/&quot;/g, "\"")).data : {}
      const liveMsg = nick_name ? { nick_name, ...rest } : null

      if (!this.liveMsgCache) this.liveMsgCache = []
      liveMsg && this.liveMsgCache.push(liveMsg)

      if (!this.setLiveMsgListTimeout) {
        this.setLiveMsgListTimeout = setTimeout(() => {
          this.$store.commit('setLiveChatMsgList', this.liveMsgCache)
          this.liveMsgCache = []
          this.setLiveMsgListTimeout = null
        }, 100 * this.liveMsgCache.length)
      }
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
