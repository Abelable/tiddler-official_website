<template>
  <Popup v-model="show" @click-overlay="hide" round position="bottom">
    <div class="main">
      <img class="logo" src="../images/youai-logo.png" alt="" />
      <img class="title" src="../images/goods-popup-title.png" alt="" />
      <div class="goods-list-wrap">
        <List
          v-model="loading"
          :finished="finished"
          @load="onLoadMore"
          :finished-text="goodsList.length && finished ? '没有更多了' : ''"
        >
          <div class="goods-list">
            <GoodsItem
              v-for="(item, index) in goodsList"
              :key="index"
              :info="item"
              bigger
            />
          </div>
        </List>
      </div>
    </div>
  </Popup>
</template>

<script>
import { Popup, List } from "vant";
import GoodsItem from "./GoodsItem";

import AiService from "../utils/aiService";

const aiService = new AiService();

export default {
  components: { Popup, List, GoodsItem },

  props: {
    visible: Boolean,
    keywords: String,
  },

  data() {
    return {
      show: false,
      loading: false,
      finished: false,
      goodsList: [],
    };
  },

  computed: {
    _visible() {
      return this.visible;
    },
  },

  watch: {
    visible: function(truthy) {
      this.show = truthy;
      if (truthy) {
        this.setGoodsList(true);
      }
    },
  },

  methods: {
    onLoadMore() {
      this.setGoodsList();
    },

    async setGoodsList(init = false) {
      if (init) {
        this.finished = false;
        this.page = 0;
        this.goodsList = []
      }
      const { list = [] } =
        (await aiService.searchGoodsList({
          title: this.keywords,
          page: ++this.page,
          pageSize: 10,
        })) || {};
      this.goodsList = init ? list : [...this.goodsList, ...list];

      if (this.loading) this.loading = false;
      if (!list.length && !this.finished) this.finished = true;
    },

    hide() {
      this.$emit("hide");
    },
  },
};
</script>

<style lang="stylus" scoped>
.row
  display: flex
  align-items: center
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
.main
  position: relative
  .logo
    position: absolute
    left: .34rem
    top: -1.2rem
    width: 2.5rem
    height: 2.12rem
    z-index: 1
  .title
    display: block
    margin: .24rem auto
    width: 1.48rem
  .goods-list-wrap
    height: 10rem
    overflow-y: scroll
    .goods-list
      display: flex
      justify-content: space-between
      flex-wrap: wrap
      padding: 0 .3rem
</style>
<style>
.van-popup {
  overflow: initial;
}
</style>
