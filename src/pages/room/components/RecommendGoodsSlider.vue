<template>
  <wx-open-launch-weapp 
    class="recommend-goods-slider"
    username="gh_7fa0cd4796ba" 
    :path="`pages/subpages/home/live-play/index?id=${roomId}&parent_user_id=${shareId}`"
  >
    <div class="goods-img-wrap">
      <img class="goods-img" :src="goodsInfo.goods_img">
      <div class="recommend-tag">推荐</div>
    </div>
    <div class="goods-info-wrap">
      <div class="goods-name">
        <span class="goods-tag">直播上新</span>
        <span>{{goodsInfo.goods_name}}</span>
      </div>
      <div class="goods-stock">库存：{{goodsInfo.goods_number}}件</div>
      <div class="goods-price-wrap">
        <div class="goods-price">{{goodsInfo.shop_price}}</div>
        <div class="buy-btn" catchtap="buyGoods">立即购买</div>
      </div>
    </div>
  </wx-open-launch-weapp>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: {
    roomId: String,
    goodsInfo: Object
  },

    computed: {
    ...mapState({
      shareId: state => state.im.shareId,
    })
  },
}
</script>

<style lang="stylus" scoped>
.recommend-goods-slider
  display: flex
  align-items: center
  margin-bottom: .3rem
  padding-left: .12rem
  padding-right: .18rem
  width: 5.46rem
  height: 2.16rem
  background: #FFFFFF
  border-radius: .24rem
  .goods-img-wrap
    position: relative
    width: 1.92rem
    height: 1.92rem
    font-size: 0
    border-radius: .2rem
    overflow: hidden
    .goods-img
      width: 1.92rem
      height: 1.92rem
      background: yellow
    .recommend-tag
      position: absolute
      left: 0
      top: 0
      display: flex
      align-items: center
      justify-content: center
      width: .6rem
      height: .32rem
      color: #fff
      font-size: .2rem
      line-height: 1
      background: #FF3148
      border-radius: .2rem 0 .12rem 0
  .goods-info-wrap
    display: flex
    flex-direction: column
    margin-left: .14rem
    flex: 1
    height: 1.92rem
    .goods-name
      color: #333
      font-size: .28rem
      .goods-tag
        display: inline-block
        margin-right: .04rem
        padding: .02rem .04rem
        color: #fff
        font-size: .2rem
        vertical-align: middle
        background: linear-gradient(270deg, #BCA26F 4%, #B98E4D 100%)
        border-radius: .04rem
    .goods-stock
      margin-top: .08rem
      flex: 1
      color: #999
      font-size: .24rem
    .goods-price-wrap
      display: flex
      align-items: flex-end
      justify-content: space-between
      .goods-price
        color: #BA9243
        font-size: .32rem
      .buy-btn
        display: flex
        align-items: center
        justify-content: center
        width: 1.28rem
        height: .48rem
        color: #FFE5BD
        font-size: .24rem
        line-height: 1
        background: linear-gradient(270deg, #404A5C 0%, #0F131A 99%)
        border-radius: .24rem
</style>