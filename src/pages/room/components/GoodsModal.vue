<template>
  <div class="goods-modal" :class="{ show: show }" @click.stop="">
    <div class="title">
      <div>{{'全部商品 （' + goodsList.length + '）'}}</div>
      <div class="shopcart-icon">
        <img style="width: .60rem; height: .52rem;" src="../../../assets/images/shopcart-icon.png" >
        <div class="count-tip" v-if="cartCount">{{cartCount}}</div>
      </div>
    </div>
    <ul class="goods-lists">
      <li class="goods-list-wrap" v-for="(item, index) in goodsList" :key="index">
        <GoodsList :goodsInfo="item" :index="index" @showSkuModal="showSkuModal" />    
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import GoodsList from './GoodsList'

export default {
  components: {
    GoodsList
  },

  props: {
    show: Boolean,
    roomId: String,
    goodsList: Array
  },

  computed: {
    ...mapState({
      cartCount: state => state.cartCount
    })
  },
  
  methods: {
    showSkuModal(id) {
      this.$emit('showSkuModal', id)
    }
  }
}
</script>

<style lang="stylus" scoped>
.goods-modal
  position absolute
  left 0
  bottom 0
  width 100%
  height 9rem
  transform translateY(100%)
  opacity 0
  transition .3s ease
  background-color rgba(255, 255, 255, 0.9)
  border-radius .16rem .16rem 0 0
  &.show
    opacity 1
    transform translateY(0)
    transition .3s ease
  .title
    display flex
    align-items center
    justify-content space-between
    padding-left .32rem
    height .8rem
    line-height .8rem
    font-size .32rem
    font-weight 500
    color #000
    border-bottom .01rem solid #A7A7A7
  .shopcart-icon
    position relative
    margin-right .36rem
    width .6rem
    height .52rem
    .count-tip
      position absolute
      right -0.12rem
      top -.06rem
      min-width .3rem
      height .3rem
      line-height .26rem
      border-radius 50%
      text-align center
      background-color red
      color #fff
      font-size .18rem
      border .02rem solid #fff
  .goods-lists
    padding-bottom .5rem
    height 8.2rem
    overflow-y scroll
    .goods-list-wrap
      margin 0 .32rem
      border-bottom .01rem solid #A7A7A7
      &:last-child
        border-bottom none
</style>