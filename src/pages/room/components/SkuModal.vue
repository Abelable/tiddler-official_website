<template>
  <div class="sku-modal" :class="{ show: show }" @click.stop="">
    <img class="close-btn" @click="hideModal" src="../../../assets/images/close-icon.png" >
    <div class="modal-inner" v-if="goodsInfo">
      <div class="goods-info-wrap">
        <img style="width: 2rem; height: 2rem;" :src="specPic || goodsInfo.goods_img" >
        <div class="goods-info">
          <div class="goods-name">{{goodsInfo.goods_name}}</div>
          <div class="goods-price">￥{{specPrice || basePrice | formatPrice}}</div>
          <div class="goods-stock">库存{{specStock || goodsInfo.goods_number}}</div>
          <div>请选择规格</div>
        </div>
      </div>
      <div class="selection-mian">
        <div class="spec-list" v-for="(item, specListIndex) in goodsInfo.attr_goods_info.specification" :key="specListIndex">
          <div class="dividing-line">
            <div class="dividing-line-title">{{item.name}}</div>
          </div>
          <div class="spec-tips" :class="{ selected: specIdArr[specListIndex] === tips.id }" v-for="(tips, index) in item.values" :key="index" @click="selectSpec(tips, specListIndex)">{{tips.label}}</div>
        </div>
        <div class="spec-list">
          <div class="dividing-line">
            <div class="dividing-line-title">数量</div>
          </div>
          <div class="count-control-wrap">
            <CountControl @countChange="onCountChange" />
          </div>
        </div>
      </div>
      <div class="btns-wrap">
        <div class="spec-btn addCart" @click="addCart">加入购物车</div>
        <div class="spec-btn directBuy" @click="directBuy">立即购买</div>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from 'vant'
import CountControl from './CountControl'
import RoomService from '../../../service/roomService'

const roomService = new RoomService()

export default {
  components: {
    CountControl
  },

  props: {
    show: Boolean,
    goodsInfo: Object,
    roomId: String,
    groupId: String
  },

  data() {
    return {
      specPic: '',
      specPrice: '',
      specStock: 0,
      count: 1,
      specIdArr: [],
      specNameArr: [],
      unitSpecPriceArr: []
    }
  },

  computed: {
    basePrice() {
      return this.goodsInfo.promote_price || this.goodsInfo.shop_price
    }
  },

  filters: {
    formatPrice(val) {
      return parseFloat(val).toFixed(2)
    }
  },

  methods: {
    selectSpec(tips, specListIndex) {
      let { id: specId, goods_attr_thumb: specPic, label: specName, price: unitSpecPrice } = tips
      this.specIdArr[specListIndex] = specId
      if (specPic) this.specPic = specPic
      // 拼接已选规格
      this.specNameArr[specListIndex] = specName
      let selectedSpec = this.specNameArr.join('')
      // 取库存
      this.specStock = this.goodsInfo.attr_goods_info.attr_num[selectedSpec] || 0
      // 如果选择的数量大于库存，则重置未库存数量
      if (this.specStock && this.count > this.specStock) this.count = this.specStock

      // 计算价格
      if (this.unitSpecPriceArr.length) {
        if (this.unitSpecPriceArr[specListIndex]) {
          this.specPrice = this.specPrice - this.unitSpecPriceArr[specListIndex] + Number(unitSpecPrice)
        } else {
          this.specPrice = this.specPrice + Number(unitSpecPrice)
          this.unitSpecPriceArr[specListIndex] = Number(unitSpecPrice)
        }
      } else {
        this.specPrice = Number(this.basePrice) + Number(unitSpecPrice)
      }
    },

    onCountChange(count) { 
      this.count = Number(count)
    },

    async addCart() {
      if (this.check()) {
        await roomService.addCart(this.goodsInfo.goods_id, this.specIdArr, this.count)
        Toast('添加成功')
        roomService.recordUserAddCart(this.roomId, this.groupId, this.$store.state.im.userName)
        this.hideModal()
      }
    },

    directBuy() {
      if (this.check()) {
        // swan.webView.navigateTo({ url: `/pages/subpages/selection/goods-detail/subpages/order-check/index?goods_id=${this.goodsInfo.goods_id}&count=${this.count}&sku=${this.specIdArr}&roomId=${this.roomId}` })
        this.hideModal()
      }
    },

    // 购买前核对
    check() {
      let toastTitle = ''
      // 判断规格选择是否有遗漏
      let specification = this.goodsInfo.attr_goods_info.specification
      if (specification.length) { 
        let unselectedIndex = this.specIdArr.findIndex(item => item === undefined)
        if (unselectedIndex !== -1) {
          toastTitle = `请选择${specification[unselectedIndex].name}`
        } else if (this.specIdArr.length < specification.length) {
          toastTitle = `请选择${specification[this.specIdArr.length].name}`
        }
      }
      // 判断是否有库存
      if (!toastTitle && this.specStock === 0) toastTitle = '该商品暂时没有存货'

      toastTitle && Toast(toastTitle)
      return !toastTitle
    },

    hideModal() {
      this.$emit('hideSkuModal')
    }
  }
}
</script>

<style lang="stylus" scoped>
.sku-modal
  position absolute
  left 0
  bottom 0
  display flex
  flex-direction column
  width 100%
  height 9rem
  background-color #fff
  border-radius .16rem .16rem 0 0
  transform translateY(100%)
  transition .3s ease
  opacity 0
  &.show
    opacity 1
    transform translateY(0)
    transition .3s ease
    z-index 100
  .close-btn
    position absolute
    top .3rem
    right .3rem
    width .46rem 
    height .46rem
    z-index 20
  .modal-inner
    display flex
    flex-direction column
    padding .3rem
    height 100%
    .goods-info-wrap
      margin-bottom .2rem
      display flex
      height 2rem
      .goods-info
        padding-left .28rem
        padding-right .46rem
        flex 1
        height 2rem
        display flex
        flex-direction column
        justify-content flex-end
        color #333
        font-size .24rem
        .goods-name
          height .9rem
          font-size .3rem
          font-weight 500
          color #333
          overflow hidden
          text-overflow ellipsis
          display -webkit-box
          -webkit-line-clamp 2
          -webkit-box-orient vertical
        .goods-price
          color #E82631
          font-size .34rem
        .goods-stock
          color #999
    .selection-mian
      flex 1
      overflow-y scroll
      &::-webkit-scrollbar
        width 0
        height 0
        color transparent
      .spec-list
        padding .3rem 0
        font-size 0
        .dividing-line
          position relative
          margin-bottom .3rem
          height .02rem
          background-color #D9D9D9
        .dividing-line-title
          position absolute
          top -0.14rem
          left 0
          padding-right .2rem
          line-height .3rem
          color #333
          font-size .3rem
          font-weight 500
          background-color #fff
        .spec-tips
          display inline-block
          margin .24rem .24rem 0 0
          padding 0 .20rem
          height .64rem
          font-size .24rem
          color #333
          line-height .62rem
          border-radius .08rem
          border 1px solid #F6F6F6
          background-color #F6F6F6
          &.selected
            border 1px solid #E1C7AA
            background-color rgb(254, 244, 245)
        .count-control-wrap
          display flex
          justify-content flex-end
    .btns-wrap
      margin .2rem 0
      display flex
      justify-content space-between
      .spec-btn
        width 3rem
        height .68rem
        text-align center
        font-size .32rem
        font-weight 500
        line-height .64rem
        border-radius .44rem
        border .02rem solid #ECC498
        &.addCart
          color #ECC498
        &.directBuy
          color #000
          background linear-gradient(2deg,rgba(234,171,99,1) 0%,rgba(236,196,152,1) 100%)
</style>