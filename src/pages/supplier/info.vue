<template>
  <div class="container">
    <div class="title">填写基本信息</div>
    <div class="card">
      <ul class="form">
        <li class="form-item row">
          <div class="name">店铺名称</div>
          <input
            class="form-input"
            v-model="shopName"
            placeholder="请输入店铺名称"
          />
        </li>
        <li class="form-item row">
          <div class="name">联系地址</div>
          <div
            class="picker"
            :class="{ active: regionDesc }"
            @click="areaPickerPopupVisible = true"
          >
            {{ regionDesc || "请选择省、市、区" }}
          </div>
          <img class="arrow" src="./images/info/arrow.png" alt="" />
        </li>
        <li class="form-item row">
          <div class="name">详细地址</div>
          <input
            class="form-input"
            v-model="addressDetail"
            placeholder="请输入您的详细地址"
          />
        </li>
        <li class="form-item row">
          <div class="name">联系电话</div>
          <input
            class="form-input"
            v-model="mobile"
            placeholder="请输入您的联系电话"
          />
        </li>
        <li class="form-item row">
          <div class="name">电子邮箱</div>
          <input
            class="form-input"
            v-model="email"
            placeholder="请填写您的电子邮箱"
          />
        </li>
      </ul>
    </div>
    <div class="card">
      <div class="uploader-wrap">
        <Uploader
          :defaultImg="require('./images/info/business-uploader-default.png')"
          desc="点击上传营业执照"
          @finish="setBusinessPic"
        />
        <Uploader
          :defaultImg="require('./images/info/uploader-default.png')"
          desc="点击上传店招或办公场地"
          @finish="setCoverPic"
        />
      </div>
    </div>
    <div class="tips">
      请保证您上传的图片内容完整且清晰可见，模糊或内容缺失将 导致审核不通过。
    </div>

    <div class="title">填写本人实名信息</div>
    <div class="card">
      <ul class="form">
        <li class="form-item row">
          <div class="name">姓名</div>
          <input
            class="form-input"
            v-model="name"
            placeholder="请填写您本人真实姓名"
          />
        </li>
        <li class="form-item row">
          <div class="name">身份证</div>
          <input
            class="form-input"
            v-model="idCardNum"
            placeholder="请填写您本人身份证号码"
          />
        </li>
      </ul>
    </div>
    <div class="card">
      <div class="uploader-wrap">
        <Uploader
          :defaultImg="require('./images/info/card-front-uploader-default.png')"
          desc="点击上传身份证正面"
          @finish="setCardFrontPic"
        />
        <Uploader
          :defaultImg="
            require('./images/info/card-backend-uploader-default.png')
          "
          desc="点击上传身份证反面"
          @finish="setCardBackendPic"
        />
        <Uploader
          style="margin-top: 0.3rem;"
          :defaultImg="require('./images/info/hold-card-uploader-default.png')"
          desc="点击上传手持身份证照片"
          @finish="setHoldCardPic"
        />
      </div>
    </div>
    <div class="tips">
      身份证正/背面/手持身份证照片确保无水印无污渍，身份信息清晰，非文字反向照片，请勿进行PS处理。
    </div>

    <div class="category-selector row between">
      <div class="label">选择类目</div>
      <div class="content row" @click="categoryPickerPopupVisible = true">
        <div>{{categoryList[categoryIdx].text}}</div>
        <img class="arrow" src="./images/info/arrow.png" alt="" />
      </div>
    </div>

    <button class="submit-btn">提交申请</button>

    <Popup v-model="areaPickerPopupVisible" position="bottom" round>
      <Area
        :area-list="areaList"
        @confirm="areaConfirm"
        @cancel="areaPickerPopupVisible = false"
      />
    </Popup>

    <Popup
      v-model="categoryPickerPopupVisible"
      position="bottom"
      round
      closeable
    >
      <div class="popup-title">选择类目</div>
      <TreeSelect
        :main-active-index.sync="categoryIdx"
        :items="categoryList"
        @click-nav="categoryConfirm"
      />
    </Popup>
  </div>
</template>

<script>
import { Popup, Area, TreeSelect } from "vant";
import Uploader from "@/components/Uploader";
import { areaList } from "@vant/area-data";
import { mapState } from "vuex";

console.log('areaList', areaList)

export default {
  components: { Popup, Area, Uploader, TreeSelect },

  data() {
    return {
      areaList,
      categoryIdx: 0,
      shopName: "",
      regionDesc: "",
      addressDetail: "",
      mobile: "",
      email: "",
      businessPic: "",
      coverPic: "",
      name: "",
      idCardNum: "",
      areaPickerPopupVisible: false,
      categoryPickerPopupVisible: false,
    };
  },

  computed: {
    ...mapState({
      categoryList: (state) =>
        state.shopCategoryOptions.map((item) => ({
          text: item.cat_name,
          value: item.cat_id,
          children: item.sub.map((_item) => ({
            text: _item.cat_name,
            disabled: true,
          })),
        })),
    }),
  },

  created() {
    this.categoryIdx = this.$route.query.categoryIdx;
  },

  methods: {
    areaConfirm(areaList) {
      this.regionDesc = areaList.reduce((a, b) => `${a} ${b.name}`, "");
      this.areaPickerPopupVisible = false;
    },

    setBusinessPic(pic) {
      this.businessPic = pic;
    },

    setCoverPic(pic) {
      this.coverPic = pic;
    },

    setCardFrontPic(pic) {
      this.coverPic = pic;
    },

    setCardBackendPic(pic) {
      this.coverPic = pic;
    },

    setHoldCardPic(pic) {
      this.coverPic = pic;
    },

    categoryConfirm(index) {
      this.categoryIdx = index;
    },
  },
};
</script>

<style lang="stylus" scoped>
.row
  display: flex
  align-items: center
  &.between
    justify-content: space-between
.container
  padding: .3rem
  padding-bottom: 2.28rem
  min-height: 100vh
  background: #F7F9FC
  .title
    color: #1F233B
    font-size: 0.32rem
    font-weight: 600
  .arrow
    width: .32rem
    height: .32rem
  .card
    margin-top: 0.3rem
    background: #fff
    border-radius: 0.1rem
    .form
      padding: 0 0.3rem
      font-size: .28rem
      .form-item
        height: 1rem
        border-bottom: 1px solid #E8E8E8
        &:last-child
          border-bottom: none
        .name
          width: 1.6rem
          color: #1F233B
        .form-input, .picker
          flex: 1
          font-size: .28rem
        .form-input::placeholder
          color: #AEB6C3
        .picker
          color: #AEB6C3
          &.active
            color: #333
    .uploader-wrap
      display: flex
      flex-wrap: wrap
      justify-content: space-between
      padding: .3rem
  .tips
    margin-top: .2rem
    margin-bottom: .3rem
    color: #AEB6C3
    font-size: .24rem
  .category-selector
    padding: 0 .3rem
    height: 1rem
    font-size: .28rem
    border-radius: .1rem
    background: #fff
    .label
      color: #1F233B
    .content
      color: #333
  .popup-title
    padding: .3rem 0
    color: #333
    font-size: .32rem
    font-weight: 500
    text-align: center
    border-bottom: 1px solid #f5f6f7
  .submit-btn
    position: fixed
    left: 50%
    bottom: 1rem
    transform: translateX(-50%)
    width: 5.9rem
    height: 1rem
    color: #FFE5BD
    font-size: .32rem
    font-weight: 500
    background: linear-gradient(128deg, #404A5C 0%, #0F131A 100%)
    border-radius: 25px
</style>
<style>
.van-tree-select__item--disabled {
  color: #333;
}
</style>
