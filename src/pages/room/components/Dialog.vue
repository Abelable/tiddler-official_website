<template>
  <div class="msg-lists-wrap" ref="msgListsWrap" @touchstart="touchStart" @touchend="touchEnd" v-if="currentMessageList.length">
    <ul class="msg-lists" v-for="(item, index) in currentMessageList" :key="index">
      <li class="msg-list">
        <div class="identity-tip">
          <FansLevelIcon v-if="item.gradetype" :gradeType="item.gradetype" :fansName="fansName" />
        </div>
        <span class="user-name" :style="{color: item.color}" v-if="item.nickname">{{item.nickname | sliceName}}</span>
        <span class="message-content">{{item.message}}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import FansLevelIcon from '../components/FansLevelIcon'
import { mapState } from 'vuex'

export default {
  components: {
    FansLevelIcon
  },

  props: {
    roomId: String,
    fansName: String
  },

  computed: {
    ...mapState({
      currentMessageList: state => state.im.currentMessageList
    })
  },

  watch: {
    currentMessageList() {
      this.autoScrollAbel && this.scrollToBottom()
    }
  },

  filters: {
    sliceName(name) {
      if (name.length > 10) name = name.slice(10)
      return name
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
      this.$emit('toggleSwipeTouchable', false)
      this.autoScrollAbel = false
    },

    touchEnd() {
      this.$emit('toggleSwipeTouchable', true)
      this.autoScrollAbel = true
    }
  }
}
</script>

<style lang="stylus">
.msg-lists-wrap
  margin-left .16rem
  width 5rem
  max-height 4.3rem
  overflow-y scroll
  scrollbar-width none
  -ms-overflow-style none
  -webkit-overflow-scrolling touch
  mask-image linear-gradient(180deg,transparent,#000 20%)
  &::-webkit-scrollbar 
    display none
  .msg-lists
    .msg-list
      margin-bottom .12rem
      padding .04rem .1rem
      width fit-content
      font-size .26rem
      font-weight 500
      color #fff
      line-height 1.5
      border-radius .08rem
      background-color rgba(0, 0, 0, 0.3)
      .identity-tip
        display inline-block
        margin-top .04rem
        margin-right .1rem
        vertical-align top
      .user-name
        vertical-align top
        margin-right .1rem
        color #EAAB63
      .message-content
        vertical-align top
        color #fff
</style>