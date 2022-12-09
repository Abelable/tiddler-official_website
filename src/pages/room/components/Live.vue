<template>
  <div class="live">
    <Player :url="roomInfo.url" :horizontal="roomInfo.direction == 1" />

    <Swipe class="cover" v-if="livePlaying" :loop="false" :show-indicators="false">
      <SwipeItem class="cover-inner">
        <div class="top-part">
          <div class="row center between">
            <AuchorCapsule :roomInfo="roomInfo" />
            <div class="user-count-wrap" @click="roomInfo.type_name ? 'showUsersManagementPopup' : ''">
              <img class="users-icon" src="../../../assets/images/live/user.png" >
              <div class="user-count">{{audienceCount}}</div>
            </div>
          </div>
          <div class="row">
            <!-- <div class="recommend-goods" v-if="recommendGoods">
              <div class="recommend-goods-title">热门推荐</div>
              <img class="recommend-goods-pic" :src="recommendGoods.goods_img" >
            </div> -->
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

        <wx-open-launch-weapp 
          class="full-screen-btn" 
          v-if="roomInfo.direction == 1" 
          username="gh_7fa0cd4796ba" 
          :path="`pages/subpages/home/live-play/index?id=${roomInfo.id}&parent_user_id=${shareId}`"
        >
          <img class="full-screen-icon" src="https://img.ubo.vip/youbo_plus/live/full-screen-icon.png" >
          <div class="full-screen-desc">全屏观看</div>
        </wx-open-launch-weapp>

        <!-- <div class="shortcut-btns">
          <img class="shortcut-btn" @click="refresh" src="../../../assets/images/live/refresh.png" >
          <img class="shortcut-btn" v-if="roomInfo.type_name" src="../../../assets/images/live/short.png" >
          <img class="shortcut-btn" v-if="roomInfo.type_name" src="../../../assets/images/live/users.png" >
          <img class="shortcut-btn" v-if="roomInfo.type_name" src="../../../assets/images/live/add-user-icon.png" >
          <img class="shortcut-btn" v-if="roomInfo.type_name && animationList.length" src="../../../assets/images/live/animation.png" >
        </div> -->

        <div class="bottom-part">
          <AudienceActionTip />
          <Comment :roomId="roomInfo.id" :isAnchor="!!roomInfo.type_name" />
          <PhraseList v-if="userPhraseList.length" :roomInfo="roomInfo" :phraseList="userPhraseList" />
          <Praise :manual="manualPraise" :count="praiseCount" />
          <div class="interactive-area">
            <div class="chat-btn" :class="{ 'is-ban': isBan }" @click="inputModalVisible = true">
              <img class="ban-icon" v-if="isBan" src="../../../assets/images/live/ban.png" >
              <div>说点什么......</div>
            </div>
            <div class="btns">
              <div class="btn">
                <wx-open-launch-weapp 
                  username="gh_7fa0cd4796ba" 
                  :path="`pages/subpages/home/live-play/index?id=${roomInfo.id}&parent_user_id=${shareId}`"
                >
                  <script type="text/wxtag-template">
                    <img style="width: 35px; height: 35px;" src="https://img.ubo.vip/youbo_plus/live/cart.png" >
                  </script>
                </wx-open-launch-weapp>
              </div>
              <div class="btn">
                <wx-open-launch-weapp 
                  username="gh_7fa0cd4796ba" 
                  :path="`pages/subpages/home/live-play/index?id=${roomInfo.id}&parent_user_id=${shareId}`"
                >
                  <script type="text/wxtag-template">
                    <img style="width: 35px; height: 35px;" src="https://img.ubo.vip/mp/sass/live-push/share.png" >
                  </script>
                </wx-open-launch-weapp>
              </div>
              <div class="btn" @click="praise">
                <img class="icon" src="https://img.ubo.vip/mp/index/room/praise-icon.png" >
                <div class="praise-count" v-if="praiseCount">{{praiseCount}}</div>
              </div>
            </div>
          </div>
        </div>
      </SwipeItem>
      <SwipeItem></SwipeItem>
    </Swipe>

    <InputModal v-if="inputModalVisible" :roomInfo="roomInfo" :phraseList="userPhraseList" @hide="inputModalVisible = false" />
    <GoodsPopup v-if="goodsPopupVisible" :roomId="roomInfo.id" :recommendGoodsId="`${recommendGoods ? recommendGoods.id : ''}`" @hide="goodsPopupVisible = false" />
  </div>
</template>

<script>
import { Toast, Dialog, Swipe, SwipeItem } from 'vant'
import Player from './Player'
import AuchorCapsule from './AuchorCapsule'
import AudienceActionTip from './AudienceActionTip'
import Comment from './Comment'
import PhraseList from './PhraseList'
import InputModal from './InputModal'
import GoodsPopup from './GoodsPopup'
import Praise from './Praise'

import TIM from 'tim-js-sdk'
import TIMUploadPlugin from 'tim-upload-plugin'
import _ from "lodash"
import Vue from 'vue'
import { mapState } from 'vuex'
import RoomService from '@/service/roomService'

const roomService = new RoomService()

export default {
  components: {
    Player,
    Swipe, 
    SwipeItem,
    AuchorCapsule,
    AudienceActionTip,
    Comment,
    PhraseList,
    InputModal,
    GoodsPopup,
    Praise,
  },

  props: {
    roomInfo: Object
  },

  data() {
    return {
      userPhraseList: [],
      animationList: [],
      adVisible: false,
      recommendGoods: null,
      recommendGoodsSliderVisible: false,
      inputModalVisible: false,
      goodsPopupVisible: false,
      liveStartModalVisible: false
    }
  },

  computed: {
    ...mapState({
      shareId: state => state.im.shareId,
      sdkAppID: state => state.im.sdkAppID,
      userID: state => state.im.userID,
      userSig: state => state.im.userSig,
      livePlaying: state => state.im.livePlaying,
      audienceCount: state => state.im.audienceCount,
      manualPraise: state => state.im.manualPraise,
      praiseCount: state => state.im.praiseCount,
      subtitleVisible: state => state.im.subtitleVisible,
      subtitleContent: state => state.im.subtitleContent,
      isBan: state => state.im.isBan,
    })
  },

  async created() {
    await this.setImInfo()
    this.initTim()
    this.joinGroup()
    this.setMsgHistory()
    this.setUserPhraseList()
    this.setRecommendGoods()
    this.setAnimationList()
  },

  destroyed() {
    this.quitGroup()
    this.logoutIm()
  },

  methods: {
    async setImInfo() {
      const imInfo = await roomService.getImInfo()
      this.$store.commit('setImInfo', imInfo)
    },

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
      if (this.recommendGoods) {
        this.recommendGoodsSliderVisible = true
        setTimeout(() => {
          this.recommendGoodsSliderVisible = false
        }, 10000)
      }
    },

    async setAnimationList() {
      const { list = [] } = await roomService.getAnimationList() || {}
      this.animationList = list
    },

    praise() {
      !this.manualPraise && this.$store.commit('setManualPraise', true)
      this.$store.commit('setPraiseCount', this.praiseCount + 1)
      if (!this.tempPraiseCount) this.tempPraiseCount = 0
      ++this.tempPraiseCount
      this.savePraise()
    },

    savePraise: _.debounce(function () {
      roomService.savePraise(this.roomInfo.id, this.tempPraiseCount)
      this.tempPraiseCount = 0
    }, 1000),

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
      data.forEach(item => {
        const { conversationType, type, payload } = item
        switch (conversationType) {
          case TIM.TYPES.CONV_SYSTEM:
            if (type === TIM.TYPES.MSG_GRP_SYS_NOTICE) {
              this.handleLiveCustomMsg(payload)
            }
            break

          case TIM.TYPES.CONV_GROUP:
            if (type === TIM.TYPES.MSG_TEXT) {
              this.handleLiveChatMsg(payload)
            } else if (type === TIM.TYPES.MSG_CUSTOM) {
              this.handleLiveCustomMsg(payload)
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

    handleLiveCustomMsg(payload) {
      let content
      if (payload.userDefinedField) {
        if (payload.userDefinedField.includes('{')) {
          content = JSON.parse(payload.userDefinedField)
        } else if (payload.userDefinedField.includes('欢迎')) {
          content = { type: 'user_coming', message: payload.userDefinedField }
        }
      } else if (payload.data) {
        content = JSON.parse(payload.data)
      }
      if (content && content.type) {
        this.handleCustomMsg(content)
      }
    },

    handleCustomMsg(customMsg) {
      if (customMsg) {
        const { userID, audienceCount, manualPraise, praiseCount, liveBreak } = this.$store.state.im

        switch (customMsg.type) {
          case 'user_coming':
            this.setAudienceActionTip(customMsg.message)
            break

          case 'robot_in_group':
            this.setAudienceActionTip(customMsg.message)
            if (!this.roomInfo.type_name) {
              this.$store.commit('setAudienceCount', audienceCount + Number(customMsg.user_num))
            }
            break

          case 'user_comed':
            if (this.roomInfo.type_name) {
              if (customMsg.zhubo_total_num != audienceCount) {
                this.$store.commit('setAudienceCount', Number(customMsg.zhubo_total_num))
              }
            } else {
              this.$store.commit('setAudienceCount', audienceCount + Number(customMsg.user_num))
            }
            break

          case 'show_user_change':
            if (!this.roomInfo.type_name) {
              this.$store.commit('setAudienceCount', Number(customMsg.user_num))
            }
            break

          case 'user_leaving':
            if (this.roomInfo.type_name) {
              if (customMsg.zhubo_total_num) {
                this.$store.commit('setAudienceCount', Number(customMsg.zhubo_total_num))
              } else {
                const newCount = audienceCount - 1
                this.$store.commit('setAudienceCount', newCount < 0 ? 0 : newCount)
              }
            } else {
              const newCount = audienceCount - Number(customMsg.user_num)
              this.$store.commit('setAudienceCount', newCount < 0 ? 0 : newCount)
            }
            break

          case 'live_room_like':
            if (Number(customMsg.like_num) > praiseCount) {
              manualPraise && this.$store.commit('setManualPraise', false)
              this.$store.commit('setPraiseCount', Number(customMsg.like_num))
            }
            break
          
          case 'ban_group_msg':
            this.$store.commit('setIsBan', Number(customMsg.is_ban))
            break

          case 'ban_user':
            this.$store.commit('setCurUserIsBan', customMsg.user_id.split(',').includes(`${userID}`) ? 1 : 0)
            break

          case 'group_subtitle':
            this.$store.commit('setSubtitleVisible', customMsg.show_subtitle == 1)
            this.$store.commit('setSubtitleContent', customMsg.subtitle)
            break
          
          case 'send_premiere':
            this.liveStartModalVisible = true
            break

          case 'clear_group_msg':
            this.$store.commit('clearLiveMsgList')
            break

          case 'delete_group_msg':
            this.$store.commit('deleteLiveMsg', customMsg.delete)
            break
          
          case 'drop_live_stream':
            !liveBreak && this.$store.commit('setLiveBreak', true)
            break

          case 'resume_live_stream':
            liveBreak && this.$store.commit('setLiveBreak', false)
            break

          case 'room_anonymous':
            this.$store.commit('setAnonymoused', Number(customMsg.is_anonymous))
            break
        
          case 'black_user':
            if (customMsg.user_id.split(',').includes(`${userID}`)) {
              Dialog.alert({
                message: '抱歉，您已被主播拉黑',
              })
            }
            break

          case 'close_live_room':
            liveBreak && this.$store.commit('setLiveBreak', false)
            this.$store.commit('setLiveDuration', customMsg.play_time)
            this.$store.commit('setLiveEnding', true)
            break

          case 'recommend_goods':
            this.setRecommendGoods()
            break

          case 'animation':
            this.$store.commit('setAnimationIndex', Number(customMsg.index))
            break
        }
      }
    },

    setAudienceActionTip(message) {
      if (!this.$store.state.im.audienceActionTip) {
        this.$store.commit('setAudienceActionTip', {
          type: 'coming',
          isRobot: this.roomInfo.type_name ? 1 : 0,
          message
        })
        setTimeout(() => { 
          this.$store.commit('setAudienceActionTip', null)
        }, 2000)
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
  }
}
</script>

<style lang="stylus" scoped>
@keyframes wordsLoop
  0%
    transform: translateX(3.2rem)
  100%
    transform: translateX(-100%)
.row
  display flex
  margin-bottom: .3rem
  &.between
    justify-content space-between
  &.center
    align-items: center
.live
  position relative
  .cover 
    position absolute
    top 0
    left 0
    width 100vw
    height 100vh
    .cover-inner
      position relative
      width 100vw
      height 100vh
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
            line-height: 1
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
      .full-screen-btn
        position: absolute
        top: 6.8rem
        left: 50%
        transform: translateX(-50%)
        display: flex
        align-items: center
        padding: 0 .16rem
        height: .6rem
        border-radius: .3rem
        background-color: rgba(0, 0, 0, 0.3)
        border: 0.5px solid rgba(255,255,255,0.3)
        z-index: 1
        .full-screen-icon
          width: .36rem
          height: .36rem
        .full-screen-desc
          margin-left: .08rem
          color: #fff
          font-size: .24rem
          line-height: 1
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
            &.is-ban
              opacity: 0.5
            .ban-icon
              margin-right: .1rem
              width: .4rem
              height: .4rem
          .btns
            display flex
            .btn
              position relative
              margin-left: .16rem
              width: 35px
              height: 35px
              font-size: 0
              overflow: initial
              .icon
                width: 35px
                height: 35px
              .praise-count
                position: absolute
                top: -0.28rem
                left: 50%
                transform: translateX(-50%)
                display flex
                align-items: center
                padding: 0 .1rem
                font-size: .18rem
                color: #F94950
                height: .28rem
                line-height: 1
                border-radius: .14rem
                background: #fff
                white-space: nowrap
</style>