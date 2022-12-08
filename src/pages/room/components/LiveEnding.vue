<template>
  <div class="container">
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

</style>
