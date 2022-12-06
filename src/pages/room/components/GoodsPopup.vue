<template>
  <div>
    <div class="mask" :class="{ show }" @click="hide" />
    <div class="popup" :class="{ show }">
      <div class="goods-popup">
        <div class="title">全部商品（{{total}}）</div>
        <List
          class="goods-list"
          v-model="loading"
          :finished="finished"
          @load="onLoadMore"
        >
          <div class="goods-item" v-for="(item, index) in goodsList" :key="index" @click="checkDetail(item.goods_id)">
            <div class="goods-img-wrap">
              <img class="goods-img" :src="item.goods_img" >
              <div 
                class="goods-id" 
                :class="{ recommend: item.goods_id == recommendGoodsId }"
                v-if="item.sort_no || item.goods_id == recommendGoodsId"
              >{{item.sort_no}}{{item.goods_id == recommendGoodsId ? '推荐' : ''}}</div>
            </div>
            <div class="goods-info-wrap">
              <div class="goods-name">
                <span class="goods-tag">直播上新</span>
                <span>{{item.goods_name}}</span>
              </div>
              <div class="goods-stock">库存：{{item.goods_number}}件</div>
              <div class="goods-price-wrap">
                <div class="goods-price">{{item.shop_price}}</div>
                <div class="buy-btn" @click.stop="buy(item.goods_id)">立即购买</div>
              </div>
            </div>
          </div>
          <Empty v-if="finished && !goodsList.length" description="暂无商品列表" />
        </List>
      </div>
    </div>
  </div>
</template>

<script>
import { List, Empty } from 'vant'
import RoomService from '@/service/roomService'

export default {
  components: {
    List,
    Empty,
  },

  props: {
    roomId: String,
    recommendGoodsId: String
  },

  data() {
    return {
      show: false,
      total: 0,
      goodsList: [],
      loading: false,
      finished: false
    }
  },

  created() {
    setTimeout(() => {
      this.show = true
    }, 50)
  },

  methods: {
    onLoadMore() {
      this.setGoodsList()
    },

    async setGoodsList() {
      if (!this.page) this.page = 0
      const { total = 0, list = [] } = await new RoomService().getGoodsList(this.roomId, 1, ++this.page)
      if (this.page === 1) this.total = total
      if (list.length) {
        this.goodsList = this.page === 1 ? list : [...this.goodsList, list]
      } else this.finished = true
      this.loading = false
    },

    checkDetail(id) {},

    buy(id) {},

    hide() {
      this.show = false
      setTimeout(() => {
        this.$emit('hide')
      }, 200)
    }
  }
}
</script>

<style lang="stylus" scoped>
.mask
  position: fixed
  top: 0
  left: 0
  width: 100%
  height: 100%
  background: rgba(0, 0, 0, 0.3)
  z-index: 100
  opacity: 0
  transition: opacity .2s ease
  &.show
    opacity: 1
.popup
  position: fixed
  left: 50%
  bottom: 0 
  width: 100%
  max-width: 100vh
  max-height: 100vh
  border-radius: .2rem .2rem 0 0
  background: #fff
  overflow: hidden
  z-index: 100
  transform: translate(-50%, 100%)
  transition: transform .2s ease
  &.show
    transform: translate(-50%, 0)
    transition: transform .3s ease
  .goods-popup
    padding-bottom: env(safe-area-inset-bottom)
    background: #f5f6f7
    .title
      display: flex
      align-items: center
      padding-left: .3rem
      height: .88rem
      font-size: .28rem
    .goods-list
      padding: 0 .24rem
      height: 10rem
      max-height: calc(100vh - 0.88rem)
      overflow-y: scroll
      .goods-item
        display: flex
        align-items: center
        margin-bottom: .24rem
        padding: .3rem
        height: 2.52rem
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
        .goods-id
          position: absolute
          left: 0
          top: 0
          display: flex
          align-items: center
          padding: 0 .14rem
          height: .32rem
          color: #fff
          font-size: .2rem
          line-height: 1
          background: #000
          border-radius: .2rem 0 .12rem 0
          .goods-id.recommend
            background: #FF3148
      .goods-info-wrap
        display: flex
        flex-direction: column
        margin-left: .3rem
        flex: 1
        height: 1.92rem
        .goods-name
          color: #333
          font-size: .28rem
          .goods-tag
            display:inline-block
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
