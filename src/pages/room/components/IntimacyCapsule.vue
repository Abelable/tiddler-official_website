<template>
  <div class="intimacy-capsule" @click.stop="showIntimacyModal">
    <div class="status-unfollow" v-if="!roomInfo.isFollow">
      <img style="width: .4rem;height: .4rem" src="../../../assets/images/love-icon.png" >
      <div class="intimacy-num">{{fansPoints || roomInfo.fansPoints}}</div>
      <div>亲密度待领取</div>
      <img class="right-arrow" src="../../../assets/images/right-arrow.png" >
    </div>
    <div class="status-follow" v-if="roomInfo.isFollow" v-show="!intimacyAddMsg">
      <FansLevelIcon :gradeType="fansRank || roomInfo.fansRank" :fansName="fansName || roomInfo.fansName" />
      <div style="margin: 0 10rpx;">亲密度</div>
      <div>{{fansPoints || roomInfo.fansPoints}}</div>
    </div>
    <div class="toast" v-show="intimacyAddMsg" :style="{ background: bgColor }">{{intimacyAddMsg}}</div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import FansLevelIcon from './FansLevelIcon'

const colorArr = ["linear-gradient(360deg,rgb(0,149,40) 0%,rgb(161, 245, 184) 100%)", "linear-gradient(360deg,rgb(186,192,250) 0%,rgb(26, 42, 249) 100%)", "linear-gradient(360deg,rgb(208, 178, 245) 0%,rgb(115, 15, 239) 100%)"];

export default {
  components: {
    FansLevelIcon
  },

  computed: {
    ...mapState({
      fansPoints: state => state.fansPoints,
      fansRank: state => state.fansRank,
      intimacyAddMsg: state => state.intimacyAddMsg
    })
  },

  watch: {
    fansRank(val) {
      let bgColor
      if (val >= 6 && val < 11) {
        bgColor = colorArr[1]
      } else if (val >= 11) {
        bgColor = colorArr[2]
      } else {
        bgColor = colorArr[0]
      }
      this.bgColor = bgColor
    }
  },

  props: {
    roomInfo: Object
  },

  data() {
    return {
      bgColor: colorArr[0]
    }
  },

  methods: {
    showIntimacyModal() {
      this.$emit('showIntimacyModal')
    }
  }
}
</script>

<style lang="stylus" scoped>
.intimacy-capsule
  margin-top .16rem
  .status-unfollow, .status-follow, .toast
    display flex
    align-items center
    padding 0 .15rem
    height .44rem
    width fit-content
    color #fff
    font-size .22rem
    border-radius .22rem
  .status-unfollow, .status-follow
    background rgba(0, 0, 0, 0.3)
    border .01rem solid rgba(255,255,255,0.3)
  .intimacy-num
    margin 0 .1rem
    color #EAAB63
    font-weight 500
  .right-arrow
    margin-left .1rem
    width .24rem
    height .24rem
</style>