<template>
  <div class="container">
    <div class="anchor-info">
      <img class="avatar" :src="roomInfo.cover" >
      <div class="title">{{roomInfo.title | titleSlice}}</div>
      <div class="id">直播间id：{{roomInfo.id}}</div>
    </div>

    <div class="time-wrap">
      <div>开始时间：{{roomInfo.notice_time | timeFormat}}</div>
      <div>倒计时：{{time | countDownFormat}}</div>
    </div>

    <div class="btn-wrap">
      <div class="btn" :class="{ invalid: isSubscribed }" @click="toggleSubscribe">{{isSubscribed ? '已订阅' : '订阅直播间'}}</div>
      <wx-open-launch-weapp 
        username="gh_7fa0cd4796ba" 
        :path="`pages/subpages/home/live-play/index?id=${roomInfo.id}&parent_user_id=${shareId}`"
      >
        <script type="text/wxtag-template">
          <style>
            .btn {
              display: flex;
              align-items: center;
              justify-content: center;
              margin-top: 15px;
              width: 290px;
              height: 44px;
              color: #fff;
              font-size: 18px;
              line-height: 1;
              border-radius: 22px;
              border: 1px solid #fff;
            }
          </style>
          <div class="btn">分享直播间</div>
        </script>
      </wx-open-launch-weapp>
      
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: {
    roomInfo: Object
  },

  data() {
    return {
      time: 0,
      isSubscribed: false,
    }
  },

  computed: {
    ...mapState({
      shareId: state => state.im.shareId,
    })
  },

  filters: {
    titleSlice(title) {
      return title.length > 10 ? `${title.slice(0, 10)}...` : title
    },

    timeFormat(timeStamp) {
      timeStamp = timeStamp.toString().length === 10 ? timeStamp * 1000 : timeStamp
      const date = new Date(timeStamp)
      const year = date.getFullYear()
      const month = `${date.getMonth() + 1}`.padStart(2, '0')
      const day = `${date.getDate()}`.padStart(2, '0')
      const hours = `${date.getHours()}`.padStart(2, '0')
      const minutes = `${date.getMinutes()}`.padStart(2, '0')
      const seconds = `${date.getSeconds()}`.padStart(2, '0')
      return 'YYYY/MM/DD hh:mm:ss'.replace('YYYY', year).replace('MM', month).replace('DD', day).replace('hh', hours).replace('mm', minutes).replace('ss', seconds)
    },

    countDownFormat(timeStamp) {
      var days = `${Math.floor(timeStamp / (24 * 60 * 60))}`.padStart(2, '0')
      var hours = `${Math.floor(timeStamp % (24 * 60 * 60) / (60 * 60))}`.padStart(2, '0')
      var minutes = `${Math.floor(timeStamp % (60 * 60) / 60)}`.padStart(2, '0')
      var seconds = `${Math.floor(timeStamp % 60)}`.padStart(2, '0')
      return 'dd天hh时mm分ss秒'.replace('dd', days).replace('hh', hours).replace('mm', minutes).replace('ss', seconds)
    }
  },

  created() {
    this.setCountDown(this.roomInfo.notice_time)
  },

  methods: {
    setCountDown(startTime) {
      const currentTime = (new Date()).getTime() / 1000
      let time = startTime - currentTime
      if (time > 0) {
        this.time = time
        this.countDownInterval = setInterval(() => {
          if (time > 0) {
            --time
            this.time = time
          } else clearInterval(this.countDownInterval)
        }, 1000)
      }
    },

    toggleSubscribe() {},

    share() {}
  }
}
</script>

<style lang="stylus" scoped>
.anchor-info
  display: flex
  flex-direction: column
  align-items: center
  margin-top: 2.4rem
  .avatar
    width: 2.00rem
    height: 1.00rem
    border-radius: .20rem
  .title
    margin-top: .30rem
    color: #fff
    font-size: .36rem
    font-weight: bold
  .id
    margin-top: .12rem
    color: #ccc
    font-size: .28rem
.time-wrap
  margin: .48rem auto 0
  padding: .30rem
  width: 5.38rem
  color: #fff
  font-size: .28rem
  text-align: center
  line-height: .70rem
  background: rgba(0, 0, 0, 0.1)
  border-radius: .60rem
.btn-wrap
  position: absolute
  left: 50%
  bottom: calc(50px + env(safe-area-inset-bottom))
  transform: translateX(-50%)
  .btn
    display: flex
    align-items: center
    justify-content: center
    margin-top: 15px
    width: 290px
    height: 44px
    color: #fff
    font-size: 18px
    line-height: 1
    border-radius: 22px
    border: 1px solid #fff
    &.invalid
      color: #ccc
      border: 1px solid #999
</style>
