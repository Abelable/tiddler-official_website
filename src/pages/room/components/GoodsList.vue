<template>
  <div class="goods-list" @click.stop="navToGoodsDetail">
    <div class="goods-pic">
      <img width="100%" height="100%" :src="goodsInfo.goods_img" alt="">
      <div class="goods-index">{{index | formatIndex}}</div>
    </div>
    <div class="goods-info">
      <div class="goods-name">{{goodsInfo.goods_name}}</div>
      <div class="goods-desc-wrap">
        <div class="goods-desc">
          <span class="goods-price">￥{{goodsInfo.promote_price ? goodsInfo.promote_price : goodsInfo.shop_price}}</span>
          <span class="goods-num">库存{{goodsInfo.goods_number}}</span>
        </div>
        <div class="cart-icon" :class="{ active: goodsInfo.goods_number > 0 }" @click.stop="selectSku">立即购买</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    goodsInfo: Object,
    index: Number
  },
  
  filters: {
    formatIndex(index) {
      index = String(index + 1)
      return index[1] ? index : '0' + index
    }
  },

  methods: {
    selectSku() {
      this.$emit('showSkuModal', this.goodsInfo.goods_id)
    },
    
    navToGoodsDetail() {}
  }
}
</script>

<style lang="stylus" scoped>
.goods-list
  height 2.34rem
  display flex
  align-items center
  justify-content space-between
  .goods-pic
    position relative
    width 1.8rem
    height 1.8rem
    border-radius .16rem
    overflow hidden
    .goods-index
      position absolute
      top 0
      left 0
      padding 0 .12rem
      height .4rem
      text-align center
      line-height .4rem
      font-size .24rem
      color #000
      font-weight 500
      border-radius 0 0 .16rem 0
      background linear-gradient(360deg,rgba(234,171,99,1) 0%,rgba(236,196,152,1) 100%)
  .goods-info
    margin-left .2rem
    flex 1
    height 1.8rem
    display flex
    flex-direction column
    justify-content space-between
  .goods-name
    height .72rem
    font-size .28rem
    color #000
    font-weight 500
    line-height .36rem
    overflow hidden
    text-overflow ellipsis
    display -webkit-box
    -webkit-line-clamp 2
    -webkit-box-orient vertical
  .goods-desc-wrap
    display flex
    justify-content space-between
    align-items baseline
    .goods-desc
      line-height 1
      .goods-price
        margin-right .2rem
        color #EAAB63
        font-size .36rem
      .goods-num
        font-size .24rem
        color #999
    .cart-icon
      padding 0 .2rem
      height .48rem
      background #999
      border-radius .24rem
      font-size .24rem
      color #000
      line-height .48rem
      font-weight 500
      text-align center
  .cart-icon.active
    background linear-gradient(2deg,rgba(234,171,99,1) 0%,rgba(236,196,152,1) 100%)
</style>