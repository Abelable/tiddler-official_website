<template>
  <div class="red-packet" v-if="redPacketInfo" @click.stop="showRedPacketModal">
    <img style="width: 1rem; height: 1.66rem;" src="../../../assets/images/red-packet.png" >
    <!-- <div class="red-packet-amount">{{NUM.toFixed(redPacketInfo.denomination)}}元</div>
    <div class="red-packet-status">{{redPacketInfo.envelope_status != 1 ? RED_PACKET.status(redPacketInfo.envelope_status) : (TIME.countDown(redPacketTime).minutes + ':' + TIME.countDown(redPacketTime).seconds)}}</div> -->
  </div>
</template>

<script>
import RoomService from '../../../service/roomService'

export default {
  props: {
    roomId: String
  },

  data() {
    return {
      redPacketInfo: null
    }
  },

  created() {
    this.setRedPacketInfo()
  },

  methods: {
    async setRedPacketInfo() {
      let res = await new RoomService().getRedPacketInfo(this.roomId)
      if ([0, 1, 2, 3, 4].includes(res.envelope_status)) {
        this.redPacketInfo = res
        // this.redPacketCountDown && clearInterval(this.redPacketCountDown) // 停止红包倒计时
        // redPacketInfo.envelope_status == 1 && this.setRedPacketCountDown(redPacketInfo.preview_time)
        // redPacketInfo.envelope_status == 2 && this.setRedPacketCountDown(redPacketInfo.grab_time)
      }
    },

    showRedPacketModal() {
      this.$emit('showRedPacketModal')
    }
  }
}
</script>

<style lang="stylus" scoped>
.red-packet
  position relative
  margin-top .16rem
  width 1rem
  height 1.66rem
  .red-packet-amount
    position absolute
    left 0
    bottom .6rem
    width 100%
    font-size .28rem
    color #FFE1BA
    font-weight 600
    white-space nowrap
    line-height 1
    text-align center
  .red-packet-status
    position absolute
    left 0
    bottom .1rem
    width 100%
    font-size .22rem
    color #5D311F
    font-weight 600
    white-space nowrap
    line-height 1
    text-align center
</style>