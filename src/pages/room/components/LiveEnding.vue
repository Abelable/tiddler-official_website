<template>
  <div class="live-end-wrap">
    <div class="anchor-info">
      <img class="anchor-avatar" :src="roomInfo.head_img" >
      <div class="anchor-name">{{roomInfo.studio_title}}</div>
    </div>
    <div class="time-wrap">
      <div class="line" />
      <div class="tips">直播结束</div>
      <div class="time">时长：{{liveDuration | formatTime}}</div>
      <div class="line" />
    </div>
    <div class="harvest-wrap">
      <div class="watcher-num">
        <div class="num">{{audienceCount | numOver}}</div>
        <div>观看人数</div>
      </div>
      <div class="parise-num">
        <div class="num">{{praiseCount | numOver}}</div>
        <div>获点赞数</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: {
    roomInfo: Object,
  },

  filters: {
    numOver(num) {
      const unitDesc = 'w'
      const baseUnit = 10000
      return num >= 100000 ? (num / baseUnit).toFixed(1) + unitDesc : num
    },

    formatTime(time) {
      const hours = `${Math.floor(time / 3600)}`.padStart(2, '0')
      const minutes = `${Math.floor(time % 3600 / 60)}`.padStart(2, '0')
      const seconds = `${time % 60}`.padStart(2, '0')
      return `${hours}:${minutes}:${seconds}`
    },
  },

  computed: {
    ...mapState({
      audienceCount: state => state.im.audienceCount,
      praiseCount: state => state.im.praiseCount,
      liveDuration: state => state.im.liveDuration,
    })
  },
}
</script>

<style lang="stylus" scoped>
.live-end-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, .5);
  color: #fff;
}
.back-icon-wrap {
  position: absolute;
  left: 0;
  display: flex;
  align-items: center;
  padding-left: 8px;
  height: 44px;
}
.anchor-info {
  padding-top: 3.20rem;
  text-align: center;
}
.anchor-avatar {
  width: 1.76rem;
  height: 1.76rem;
  border-radius: 50%;
  border: .04rem solid #fff;
}
.anchor-name {
  font-size: 15px;
  line-height: 21px;
  margin-top: 10px;
}
.time-wrap {
  margin-top: .68rem;
  margin-left: 10%;
  width: 80%;
  text-align: center;
}
.line {
  width: 100%;
  height: .02rem;
  background: linear-gradient(90deg,rgba(238,238,238,0) 0%,rgba(255,255,255,1) 49%,rgba(216,216,216,0) 100%);
  opacity: 0.4;
}
.tips {
  margin-top: .20rem;
  font-size: .40rem;
}
.time {
  margin-bottom: .20rem;
  font-size: .24rem;
  color: #B9B9B9;
}
.harvest-wrap {
  margin-top: .70rem;
  margin-left: 20%;
  width: 60%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.watcher-num, .parise-num {
  font-size: .24rem;
  text-align: center;
  color: #B9B9B9;
}
.num {
  font-size: .30rem;
}
</style>
