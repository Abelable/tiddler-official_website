<template>
  <div class="room-wrap" @click="hideModal">
    <Player :roomInfo="roomInfo" />
    <div class="top-part">
      <div class="top-part-left">
        <AuchorCapsule :roomInfo="roomInfo" />
        <IntimacyCapsule :roomInfo="roomInfo" />
        <Showcase :roomId="roomInfo.id" @showSkuModal="showSkuModal"/>
      </div>
      <div class="top-part-rigit">
        <div class="room-id-capsule">
          <div class="brand">有播ID</div>
          <div>{{roomInfo.id}}</div>
        </div>
        <RebPacket :roomId="roomInfo.id" />
      </div>
    </div>
    <div class="bottom-part">
      <AudienceActionTip />
      <Dialog :roomId="roomInfo.id" :fansName="roomInfo.fansName" @toggleSwipeTouchable="toggleSwipeTouchable" />
      <div class="interactive-area">
        <div class="goods-bag-wrap" @click.stop="showGoodsModal">
          <img class="goods-bag" src="../../../assets/images/goods-bag.png" >
          <div class="icon-desc">宝贝库</div>
          <div class="goods-count">{{goodsList.length}}</div>
        </div>
        <input class="chat-input" type="text" placeholder="跟主播聊点什么？">
        <div class="btns">
          <div class="btn" @click.stop="toggleFeaturesPop">
            <img style="width: .46rem; height: .46rem;" src="../../../assets/images/more-features-icon.png">
            <div class="icon-desc">更多</div>
            <div class="features-pop" v-if="featuresPopVisible">
              <div class="features-tip" @click.stop="report">举报</div>
              <div class="features-tip" @click.stop="showDefinitionModal">清晰度</div>
              <div class="features-tip" @click.stop="showDownloadModal">下载APP</div>
            </div>
          </div>
          <div class="btn" @click.stop="showPosterModal">
            <img style="width: .46rem; height: .46rem;" src="../../../assets/images/share-icon.png">
            <div class="icon-desc">分享</div>
          </div>
          <div class="btn" ontap="clickHandler">
            <img style="width: .46rem; height: .46rem;" src="../../../assets/images/praise-icon.png">
            <div class="icon-desc">点赞</div>
            <div class="praise-count" v-if="praiseCount">{{praiseCount | numOverflow}}</div>
          </div>
        </div>
      </div>
    </div>
    <GoodsModal :goodsList="goodsList" :show="goodsModalVisible" @showSkuModal="showSkuModal" />
    <SkuModal :show="skuModalVisible" :goodsInfo="skuGoodsInfo" :roomId="roomInfo.id" :groupId="roomInfo.groupId" @hideSkuModal="hideSkuModal"/>
  </div>
</template>

<script>
import RoomService from '@/service/roomService'
import Player from './Player'
import AuchorCapsule from './AuchorCapsule'
import IntimacyCapsule from './IntimacyCapsule'
import Showcase from './Showcase'
import RebPacket from './RebPacket'
import AudienceActionTip from './AudienceActionTip'
import Dialog from './Dialog'
import GoodsModal from './GoodsModal'
import SkuModal from './SkuModal'

const roomService = new RoomService()

export default {
  components: {
    Player,
    AuchorCapsule,
    IntimacyCapsule,
    Showcase,
    RebPacket,
    AudienceActionTip,
    Dialog,
    GoodsModal,
    SkuModal
  },

  props: {
    roomInfo: Object
  },

  data() {
    return {
      goodsList: [],
      praiseCount: 0,
      goodsModalVisible: false,
      skuModalVisible: false,
      skuGoodsInfo: null,
      featuresPopVisible: false
    }
  },

  filters: {
    numOverflow(val) {
      if (val > 100000) val = `${(val / 10000).toFixed(1)}w`
      return val
    }
  },

  created() {
    this.updateGoods()
  },

  methods: {
    async updateGoods() {
      let { goods } = await roomService.getGoodsList(this.roomInfo.id)
      this.goodsList = goods
    },

    showGoodsModal() {
      this.goodsModalVisible = true
      this.toggleSwipeTouchable(false)
      this.updateGoods()
    },

    showSkuModal(id) {
      this.skuGoodsInfo = this.goodsList.filter(item => item.goods_id == id)[0] 
      this.skuModalVisible = true
      this.toggleSwipeTouchable(false)
    },

    toggleFeaturesPop() {
      this.featuresPopVisible = !this.featuresPopVisible
    },

    hideModal() {
      this.goodsModalVisible = false
      this.hideSkuModal()
      this.featuresPopVisible = false
      this.toggleSwipeTouchable(true)
    },

    hideSkuModal() {
      this.skuModalVisible = false
      this.skuGoodsInfo = null
      if (!this.goodsModalVisible) this.toggleSwipeTouchable(true)
    },

    toggleSwipeTouchable(val) {
      this.$emit('toggleSwipeTouchable', val)
    }
  }
}
</script>

<style lang="stylus" scoped>
.room-wrap
  position absolute
  top 0
  left 0
  width 100%
  height 100%
  .top-part
    position absolute
    top 0
    left 0
    display flex
    justify-content space-between
    padding .16rem
    width 100%
    .top-part-rigit
      display flex
      flex-direction column
      align-items flex-end
      .room-id-capsule
        width 1.3rem
        height .64rem
        color #fff
        font-size .22rem
        text-align center
        border-radius .12rem
        background-color rgba(0, 0, 0, 0.3)
        border .01rem solid rgba(255,255,255,0.3)
        overflow hidden
        .brand
          height .32rem
          background-color #000
  .bottom-part
    position absolute
    left 0
    bottom 0
    padding-bottom .3rem
    width 100%
    .interactive-area
      display flex
      align-items center
      .goods-bag-wrap
        position relative
        margin-left .16rem
        font-size 0
        .goods-bag
          width .74rem
          height .74rem
        .icon-desc
          font-size .18rem
          color #fff
          text-align center
        .goods-count
          position absolute
          top 30%
          left 50%
          transform translateX(-50%)
          color #fff
          font-size .26rem
      .chat-input
        margin 0 .12rem
        flex 1
        height .68rem
        font-size .3rem
        color #fff
        border-bottom .01rem solid #fff
        &::-webkit-input-placeholder
          color #fff
      .btns
        display flex
        margin-top .26rem
        width 2.48rem
        .btn
          position relative
          text-align center
          overflow initial
          flex 1
          font-size 0
          .icon-desc
            font-size .18rem
            color #fff
            text-align center
          .features-pop
            position absolute
            top -2.5rem
            left 50%
            transform translateX(-50%)
            width 1.3rem
            height fit-content
            border-radius .2rem
            background #fff
            &::after
              position absolute
              bottom -0.1rem
              right .55rem
              width 0
              height 0
              content ''
              border-left .1rem solid rgba(0,0,0,0)
              border-right .1rem solid rgba(0,0,0,0)
              border-top .1rem solid #fff
            .features-tip
              font-size .24rem
              color #333
              text-align center
              line-height .8rem
              border-bottom .01rem solid rgba(0,0,0,0.6)
              &:last-child
                border-bottom none
</style>