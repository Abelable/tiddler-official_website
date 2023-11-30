<template>
  <div>
    <div class="mask" :class="{ show }" @click="hide" />
    <div class="popup" :class="{ show }">
      <div class="goods-shelves-popup">
        <div class="menu-wrap">
          <div 
            class="menu-item"
            :class="{ selected: curMenuIdx === index }"
            v-for="(item, index) in ['上架商品', '未上架商品']"
            :key="index"
            @click="selectMenu(index)"
          >{{item}}</div>
        </div>
        <List 
          class="goods-list-wrap" 
          v-if="curMenuIdx === 0" 
          v-model="upGoodsListloading"
          :finished="upGoodsListfinished"
          @load="onLoadMoreUpGoods"
        >
          <div class="all-pick-bar">
            <div class="all-pick-title-wrap" @click="selectAllUpGoods">
              <img class="select-icon" :src="upGoodsAllSelected ? '../../../assets/images/selected.png' : '../../../assets/images/unselected.png'" >
              <div class="all-pick-title">全选商品一键下架</div>
            </div>
            <div class="all-pick-btn" @click="downAllGoods">
              <div>下架</div>
              <img class="all-pick-icon" src="../../../assets/images/live/goods-shelves-popup/all-down.png">
            </div>
          </div>

          <div class="goods-list">
            <div class="goods-item" v-for="(item, index) in upGoodsList" :key="index">
              <img class="select-icon" v-if="upGoodsAllSelected" @click="selectUpGoods(item.id)" :src="item.check ? '../../../assets/images/selected.png' : '../../../assets/images/unselected.png'" >
              <div class="goods-img-wrap">
                <img class="goods-img" :src="item.goods_img" >
                <div class="goods-id" v-if="curMenuIdx === 0 && item.sort_no">{{item.sort_no}}</div>
              </div>
              <div class="goods-info-wrap">
                <div class="goods-name">
                  <span class="goods-tag">直播上新</span>
                  <span>{{item.goods_name}}</span>
                </div>
                <div class="goods-stock">库存：{{item.goods_number}}件</div>
                <div class="goods-price-wrap">
                  <div class="goods-price">{{item.shop_price}}</div>
                  <div class="btns-wrap">
                    <div class="recommend-btn invalid" ontap="recommendFn" data-type="2" data-id="{{item.goods_id}}" wx:if="{{recommend_id == item.goods_id}}">取消推荐</div>
                    <div class="recommend-btn" ontap="recommendFn" data-type="1" data-id="{{item.goods_id}}" wx:else>推荐</div>
                    <img class="goods-pick-btn" ontap="statusChange" data-type="downOne" data-id="{{item.goods_id}}" src="/images/live/goods-shelves-popup/down.png" >
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Empty v-if="upGoodsListfinished && !upGoodsList.length" description="暂无商品列表" />
        </List>

        <div class="goods-list-wrap" v-if="curMenuIdx === 1">
          <div class="all-pick-bar">
            <div class="all-pick-title-wrap" ontap="dataSelectAll1Fn">
              <img class="select-icon" src="{{dataSelectAll1 ? '/images/selected.png' : '/images/unselected.png'}}" >
              <div class="all-pick-title">全选商品一键上架</div>
            </div>
            <div class="all-pick-btn" ontap="statusChange" data-type="upAll">
              <div>上架</div>
              <img class="all-pick-icon" src="/images/live/goods-shelves-popup/all-up.png" >
            </div>
          </div>
          <div class="goods-list">
            <div class="goods-item" wx:for="{{dataList1}}" wx:key="index" >
              <img class="select-icon" wx:if="{{dataSelectAll1}}"  ontap="selectOne1" data-id="{{item.goods_id}}" src="{{item.check ? '/images/selected.png' : '/images/unselected.png'}}" >
              <div class="goods-img-wrap">
                <img class="goods-img" src="{{item.goods_img}}" />
                <div class="goods-id">{{index+1}}</div>
              </div>
              <div class="goods-info-wrap">
                <div class="goods-name">
                  <span class="goods-tag">直播上新</span>
                  <span>{{item.goods_name}}</span>
                </div>
                <div class="goods-stock">库存：{{item.goods_number}}件</div>
                <div class="goods-price-wrap">
                  <div class="goods-price">{{item.shop_price}}</div>
                  <div class="btns-wrap">
                    <img class="goods-pick-btn" ontap="statusChange" data-type="upOne" data-id="{{item.goods_id}}" src="/images/live/goods-shelves-popup/up.png" >
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="empty-illus-wrap" wx:if="{{dataList1.length == 0}}">
            <template is="i-empty-illus" data="{{desc: '暂无商品'}}" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { List, Empty } from 'vant'


export default {
  components: {
    List,
    Empty
  },

  data() {
    return {
      curMenuIdx: 0,
      upGoodsList: [],
      upGoodsListloading: false,
      upGoodsListfinished: false,
      upGoodsAllSelected: false,
      downGoodsList: [],
      downGoodsListloading: false,
      downGoodsListfinished: false,
    }
  },

  created() {
    setTimeout(() => {
      this.show = true
    }, 50)
  },

  methods: {
    selectMenu(index) {
      this.curMenuIdx = index
    },

    onLoadMoreUpGoods() {},

    selectAllUpGoods() {},

    downAllGoods() {},

    selectUpGoods(id) {},

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
</style>
