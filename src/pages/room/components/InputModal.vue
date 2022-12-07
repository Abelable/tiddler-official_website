<template>
  <div class="input-modal" @click="hide">
    <div class="main" @click.stop>
      <div class="phrase-wrap" v-if="phraseList.length">
        <div class="tips">常用语：</div>
        <div class="phrase-list">
          <div class="phrase" v-for="(item, index) in phraseList" :key="index" @click="sendMsg(item.content)">{{item.content}}</div>
        </div>
      </div>

      <div class="input-main">
        <input 
          class="input" 
          type="text" 
          v-model="content"
          placeholder="说点什么~" 
          confirm-type="send"
          />
        <div class="send-btn" @click="send">发送</div>
      </div>
    </div>
  </div>
</template>

<script>
import TIM from 'tim-js-sdk'
import { Toast } from 'vant'
import RoomService from '@/service/roomService'

const roomService = new RoomService()

export default {
  props: {
    roomInfo: Object,
    phraseList: Array
  },

  data() {
    return {
      content: ''
    }
  },

  created() {
    this.setTagList()
    this.setSensitiveWordList()
  },

  methods: {
     async setTagList() {
      const { list = [] } = await roomService.setCurUserTagList(this.roomInfo.studio_id, this.$store.state.im.userID) || {}
      this.tagList = list
      this.$store.commit('setUserTagList', list)
    },

    async setSensitiveWordList() {
      const { list = [] } = await roomService.getPhraseList(this.properties.roomInfo.studio_id, 3) || {}
      this.sensitiveWordList = list
    },

    send() {
      if (!this.content) {
        Toast('消息不能为空')
        return
      }
      this.sendMsg(this.content)
    },

    async sendMsg(msg) {
      const { id: room_id, group_id, type_name } = this.roomInfo
      let { userID, userName, userAvatar, curUserIsBan } = this.$store.state.im

      // 马甲
      if (type_name && this.$store.state.vestInfo) {
        userName = this.$store.state.vestInfo.name
        userAvatar = this.$store.state.vestInfo.head_img
      }

      const chatMsg = {
        user_id: userID,
        nick_name: userName, 
        head_img: userAvatar,
        type_name,
        tag: this.tagList,
        message: msg,
        time: Date.parse(new Date()) / 1000
      }

      this.$store.commit('setLiveChatMsgList', chatMsg)

      // 敏感词过滤
      if (!type_name) {
        const index = this.sensitiveWordList.findIndex(item => msg.replace(/\s*/g,"").includes(item.content))
        if (index !== -1) {
          return
        }
      }

      // 当前用户被禁言
      if (curUserIsBan) {
        return
      }

      roomService.saveLiveMsg(room_id, userName, userAvatar, type_name, JSON.stringify(this.tagList), msg, chatMsg.time)
      const message = this.tim.createTextMessage({
        to: group_id,
        conversationType: TIM.TYPES.CONV_GROUP,
        payload: {
          text: JSON.stringify({ data: chatMsg })
        }
      })
      this.tim.sendMessage(message)
    },

    hide() {
      this.$emit('hide')
    }
  }
}
</script>

<style lang="stylus" scoped>
.input-modal
  position: fixed
  top: 0
  left: 0
  width: 100vw
  height: 100vh
  .main
    position: absolute
    left: 0
    bottom: 0
    width: 100%
    background: #fff
    border-radius: .2rem .2rem 0 0
    .phrase-wrap
      display: flex
      align-items: center
      padding: .2rem 0 0 .3rem
      .tips
        color: #999
        font-size: .24rem
      .phrase-list
        flex: 1
        overflow-x: scroll
        white-space: nowrap
        font-size: 0
        .phrase
          display: inline-block
          margin-right: .2rem
          padding: 0 .2rem
          height: .46rem
          color: #999
          font-size: .24rem
          line-height: .46rem
          background: #F1F5F7
          border-radius: .24rem
    .input-main
      display: flex
      align-items: center
      padding: .2rem .3rem
      width: 100%
      .input
        margin-left: .1rem
        flex: 1
        padding: 0 .3rem
        height: .72rem
        font-size: .26rem
        background: #F1F5F7
        border-radius: .36rem
      .send-btn
        display: flex
        align-items: center
        justify-content: center
        margin-left: .3rem
        width: 1.4rem
        height: .72rem
        color: #FFE5BD
        font-size: .28rem
        font-weight: bold
        background: linear-gradient(128deg, #404A5C 0%, #0F131A 100%)
        border-radius: .36rem
</style>
