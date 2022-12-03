<template>
  <div class="showcase-wrap" v-if="showcaseList.length" @click.stop="">
    <div class="goods-list" v-for="(item, index) in showcaseList" :key="index" @click="showSkuModal(item.goods_id)">
      <div class="goods-desc">{{item.introduction_type === '1' ? '当前商品' : '下件商品'}}</div>
      <div class="goods-pic">
        <img width="100%" height="100%" :src="item.goods_img">
        <div class="goods-price">{{item.shop_price}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import RoomService from '../../../service/roomService'
let roomService = new RoomService()

export default {
  props: {
    roomId: String
  },

  data() {
    return {
      showcaseList: []
    }
  },

  created() {
    this.setShowcaseList()
  },

  methods: {
    async setShowcaseList() {
      this.showcaseList = await roomService.getShowcase(this.roomId)
    },

    showSkuModal(id) {
      this.$emit('showSkuModal', id)
    }
  }
}
</script>

<style lang="stylus" scoped>
.showcase-wrap
  margin-top .16rem
  padding .1rem
  width 1.6rem
  border-radius .08rem
  background rgba(0,0,0,0.3)
  .goods-list
    margin-bottom .2rem
    &:last-child
      margin-bottom 0
    .goods-desc
      font-size .2rem
      font-family PingFangSC-Medium,PingFang SC
      font-weight 500
      color rgba(250,250,250,1)
      line-height .28rem
    .goods-pic
      position relative
      width 1.4rem
      height 1.2rem
      border-radius .08rem
      overflow hidden
      .goods-price
        position absolute
        left 0
        bottom 0
        padding 0 .1rem
        height .26rem
        background rgba(0,0,0,0.6)
        border-radius .08rem
        text-align center
        line-height .26rem
        color #fff
        font-size .2rem
        font-weight 500
</style>