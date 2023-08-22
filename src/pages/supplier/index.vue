<template>
  <div class="container">
    <img class="bg" src="./images/bg.png" alt="" />
    <div class="step-content" v-if="step === 1">
      <img class="title" src="./images/title.png" alt="" />
      <ul class="menu-list">
        <li
          class="menu-item"
          :class="{ active: curCategoryIdx === index }"
          :style="{
            backgroundImage:
              curCategoryIdx === index
                ? `url(${require(`./images/menu_bg_${index}.png`)})`
                : '',
          }"
          v-for="(item, index) in categoryOptions"
          :key="index"
          @click="curCategoryIdx = index"
        >
          {{ item.cat_name }}
        </li>
      </ul>
    </div>
    <div class="step-content" v-else>
      <img
        class="title"
        :src="require(`./images/sub_title_${curCategoryIdx}.png`)"
        alt=""
      />
      <ul class="sub-menu-list">
        <li
          class="sub-menu-item"
          v-for="(item, index) in categoryOptions[curCategoryIdx].sub"
          :key="index"
        >
          {{ item.cat_name }}
        </li>
      </ul>
    </div>
    <div class="bottom-bar">
      <div class="deposit" v-if="step === 2">
        保证金：{{ categoryOptions[curCategoryIdx].margin_num }}元
      </div>
      <div class="btn-wrap">
        <button class="last-step-btn" v-if="step === 2" @click="step = 1">
          上一步
        </button>
        <button class="next-step-btn" @click="nextStep">
          {{ step === 2 ? "确定开店" : "下一步" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import SupplierService from "./utils/supplierService";

const supplierService = new SupplierService();

export default {
  data() {
    return {
      step: 1,
      categoryOptions: [],
      curCategoryIdx: 0,
    };
  },

  created() {
    this.setCategoryOptions();
  },

  methods: {
    async setCategoryOptions() {
      this.categoryOptions = await supplierService.getCategoryOptions();
      this.$store.commit("setShopCategoryOptions", this.categoryOptions);
    },

    nextStep() {
      if (this.step === 1) {
        this.step = 2;
      } else {
        this.$router.push(`/supplier/info?categoryIdx=${this.curCategoryIdx}`);
      }
    },
  },
};
</script>

<style lang="stylus" scoped>
.container
  height: 100vh
  font-size: 0
  background: #fff
  overflow-y: scroll
  .bg
    width: 100%
  .step-content
    position relative
    height: 100%
    .title
      display: block
      margin: .4rem auto 0
      width: 3.2rem
    .menu-list
      display: flex
      flex-wrap: wrap
      justify-content: space-between
      margin: .4rem
      .menu-item
        display: flex
        align-items: center
        justify-content: center
        margin-bottom: .4rem
        width: 3.2rem
        height: .92rem
        color: #333
        font-size: .28rem
        font-weight: 500
        border-radius: .12rem
        background-color: #F4F2F2
        background-repeat: no-repeat
        background-size: 100%
        &.active
          color: #FFE5BD
    .sub-menu-list
      display: flex
      flex-wrap: wrap
      margin: .4rem
      .sub-menu-item
        display: flex
        align-items: center
        justify-content: center
        margin-bottom: .2rem
        margin-right: .2rem
        width: 2.1rem
        height: .92rem
        color: #333
        font-size: .28rem
        font-weight: 500
        border-radius: .12rem
        background-color: #F4F2F2
        &:nth-child(3n)
          margin-right: 0
  .bottom-bar
    position: fixed
    bottom: 1.28rem
    padding: 0 .4rem
    width: 100%
    .deposit
      color: #D4A553
      font-size: .32rem
      font-weight: 500
      text-align: center
    .btn-wrap
      display: flex
      margin-top: .2rem
      .last-step-btn, .next-step-btn
        flex: 1
        height: 1rem
        font-size: .32rem
        font-weight: 500
        border-radius: .5rem
      .last-step-btn
        margin-right: .2rem
        color: #333
        background: #F5F6F7
      .next-step-btn
        color: #FFE5BD
        background: linear-gradient(128deg, #404A5C 0%, #0F131A 100%)
</style>
