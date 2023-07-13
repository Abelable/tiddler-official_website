<template>
  <div class="goods-item" :class="{ ani: replying, bigger }" @click="toGoodsDetail">
    <img class="cover" :src="info.cover" alt="" />
    <div class="info-wrap">
      <div class="title omit">{{ info.title }}</div>
      <div class="price-wrap row baseline between">
        <div class="row baseline">
          <div class="shop-price">
            <span style="font-size: 0.2rem;">¥</span>
            <span>{{ info.couponPrice }}</span>
          </div>
          <div class="market-price" v-if="info.couponPrice !== info.price">
            ¥{{ info.price }}
          </div>
        </div>
        <div class="sales">{{ info.sales | formatCount }}人付款</div>
      </div>
      <div class="shop-info row">
        <img class="shop-logo" src="../images/shop-icon.png" alt="" />
        <div class="shop-name omit">{{ info.shopName }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import wx from 'weixin-js-sdk'

export default {
  props: {
    info: Object,
    replying: Boolean,
    bigger: Boolean,
  },

  filters: {
    formatCount(count) {
      return count > 10000 ? `${(count / 10000).toFixed(1)}w` : count;
    },
  },

  methods: {
    toGoodsDetail() {
      switch (this.$host) {
        case "mp":
          wx.miniProgram.navigateTo({
            url: `/pages/subpages/mall/douyin/goods-detail/index?id=${this.info.productId}`,
          });
          break;

        case "IOS":
        case "android":
          window.location.href = `https://www.youboi.com/mobile/dy/goods.php?id=${this.info.productId}`;
          break;

        default:
          window.location.href = this.info.detailUrl;
          break;
      }
    },
  },
};
</script>

<style lang="stylus" scoped>
@keyframes flip
  0%
    opacity: 0
    transform: rotateY(-120deg)
  100%
    opacity: 1
    transform: rotateY(0deg)
.row
  display: flex
  align-items: center
  &.baseline
    align-items: baseline
  &.center
    justify-content: center
  &.between
    justify-content: space-between
.omit
  overflow: hidden
  text-overflow: ellipsis
  display: -webkit-box
  -webkit-line-clamp: 1
  -webkit-box-orient: vertical
.goods-item
  margin-bottom: .24rem
  font-size: 0
  width: 2.86rem
  border-radius: .1rem
  border: 1px solid #d4d4d4
  overflow hidden
  &.bigger
    width: 3.36rem
    .cover
      width: 3.36rem
      height: 3.2rem
    .info-wrap
      height: 1.58rem
  &.ani
    animation: flip 1.5s 1 ease-in-out
  .cover
    width: 2.86rem
    height: 2.74rem
  .info-wrap
    display: flex
    flex-direction: column
    justify-content: space-between
    padding: .1rem
    height: 1.4rem
    .title
      color: #333
      font-size: .24rem
      font-weight: 500
    .shop-price
      color: #FF2302
      font-size: .28rem
      font-weight: 500
    .market-price
      margin-left: .1rem
      color: #999
      font-size: .2rem
      text-decoration: line-through
    .sales
      color: #999
      font-size: .2rem
      white-space: nowrap
    .shop-logo
      width: .24rem
      height: .24rem
    .shop-name
      margin-left: .02rem
      flex: 1
      color: #999
      font-size: .2rem
</style>
