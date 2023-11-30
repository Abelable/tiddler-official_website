<template>
  <div class="msg-lists-wrap" ref="msgListsWrap" @touchstart="touchStart" @touchend="touchEnd" v-if="liveChatMsgList.length">
    <ul class="msg-lists">
      <li class="msg-list" v-for="(item, index) in liveChatMsgList" :key="index">
        <div class="msg-inner" v-if="isAnchor || (!isAnchor && item.is_ban != 1) || (!isAnchor && item.is_ban == 1 && item.user_id == userID)">
          <img class="avatar" v-if="item.head_img" :src="item.head_img" />
          <span 
            class="tag"
            :class="{ anchor: item.type_name === '创建者', 'live-assistant': item.type_name === '直播助手', assistant: item.type_name === '小助手' }"
            v-if="isAnchor && item.type_name"
          >{{item.type_name}}</span>
          <span class="user-name" v-if="item.nick_name">{{(!isAnchor && anonymoused) ? (item.nick_name | sliceName) : item.nick_name}}</span>
          <span class="message-content" v-if="item.is_ban == 1 && isAnchor">（已禁言）</span>
          <span class="message-content">{{item.message}}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: {
    roomId: String,
    isAnchor: Boolean
  },

  computed: {
    ...mapState({
      userID: state => state.im.userID,
      liveChatMsgList: state => state.im.liveChatMsgList,
      anonymoused: state => state.im.anonymoused,
    })
  },

  watch: {
    liveChatMsgList() {
      this.autoScrollAbel && this.scrollToBottom()
    }
  },

  filters: {
    sliceName(name) {
      if (name) {
        if (name.length === 1) {
          return '*';
        } else if (name.length === 2) {
          return '*' + name.slice(-1);
        } else {
          return name.slice(0, 1) + name.slice(1, -1).split('').map(function() { return '*' }).join('') + name.slice(-1);
        }
      }
    }
  },

  data() {
    return {
      autoScrollAbel: true
    }
  },

  methods: {
    scrollToBottom() {
      this.$nextTick(() =>{
        this.$refs.msgListsWrap.scrollTop = this.$refs.msgListsWrap.scrollHeight
      })
    },

    touchStart() {
      this.autoScrollAbel = false
    },

    touchEnd() {
      this.autoScrollAbel = true
    }
  }
}
</script>

<style lang="stylus">
.msg-lists-wrap
  margin-bottom: .1rem
  width 5.46rem
  max-height 6rem
  overflow-y scroll
  scrollbar-width none
  -ms-overflow-style none
  -webkit-overflow-scrolling touch
  mask-image linear-gradient(180deg,transparent,#000 20%)
  &::-webkit-scrollbar 
    display none
  .msg-lists
    .msg-list
      .msg-inner
        margin-bottom .12rem
        padding .18rem
        width fit-content
        max-width 5.46rem
        font-size .26rem
        font-weight 500
        color #fff
        line-height 1.5
        border-radius .2rem
        background-color rgba(0, 0, 0, 0.3)
        .avatar
          margin-right: .1rem
          margin-top: -0.06rem
          vertical-align: top
          width: .52rem
          height: .52rem
          border-radius: 50%
        .tag
          display: inline-block
          margin-right: .1rem
          vertical-align: top
          padding: 0 .12rem
          height: .36rem
          font-size: .22rem
          font-weight: bold
          line-height: .36rem
          border-radius: .06rem
          &.anchor
            color: #FFE5BD
            background: linear-gradient(128deg, #404A5C 0%, #0F131A 100%)
          &.assistant
            color: #404A5C
            background: #E7CCFF
          &.live-assistant
            color: #404A5C
            background: #FFBCDF
        .user-name
          vertical-align top
          margin-right .1rem
          color #EAAB63
        .message-content
          vertical-align top
          color #fff
</style>
