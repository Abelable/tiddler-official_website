<template>
  <div class="phrase-list">
    <div 
      class="phrase" 
      v-for="(item, index) in phraseList" 
      :key="index" 
      @click="sendPhrase(item.content)" 
    >{{item.content}}</div>
  </div>
</template>

<script>
import TIM from 'tim-js-sdk'
import RoomService from '@/service/roomService'

const roomService = new RoomService()

export default {
  props: {
    roomInfo: Object,
    phraseList: Array
  },

  data() {
    return {
      tagList: []
    }
  },

  async created() {
    const { list = [] } = await roomService.setCurUserTagList(this.roomInfo.studio_id, this.$store.state.im.userID) || {}
    this.tagList = list
    this.$store.commit('setUserTagList', list)
  },

  methods: {
    async sendPhrase(msg) {
      const { id: room_id, group_id, type_name } = this.roomInfo
      let { userID, userName, userAvatar } = this.$store.state.im

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
      roomService.saveLiveMsg(room_id, userName, userAvatar, type_name, JSON.stringify(this.tagList), msg, chatMsg.time)
      const message = this.tim.createTextMessage({
        to: group_id,
        conversationType: TIM.TYPES.CONV_GROUP,
        payload: {
          text: JSON.stringify({ data: chatMsg })
        }
      })
      this.tim.sendMessage(message)
    }
  }
}
</script>

<style lang="stylus" scoped>
.phrase-list
  margin-bottom: .3rem
  white-space: nowrap
  font-size: 0
  overflow-x: scroll
  mask-image: linear-gradient(270deg,transparent,#000 40%)
  .phrase
    display: inline-block
    margin-right: .2rem
    padding: 0 .2rem
    height: .46rem
    color: #fff
    font-size: .24rem
    line-height: .48rem
    background: rgba(0, 0, 0, 0.3)
    border-radius: .24rem
    &:last-child
      margin-right: 2rem
</style>
