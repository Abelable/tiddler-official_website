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
          :defaultImg="
            businessPic ||
              require('./images/info/business-uploader-default.png')
          "
          desc="点击上传营业执照"
          @finish="setBusinessPic"
        />
        <Uploader
          :defaultImg="
            coverPic || require('./images/info/uploader-default.png')
          "
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
          :defaultImg="
            cardFrontPic ||
              require('./images/info/card-front-uploader-default.png')
          "
          desc="点击上传身份证正面"
          @finish="setCardFrontPic"
        />
        <Uploader
          :defaultImg="
            cardBackendPic ||
              require('./images/info/card-backend-uploader-default.png')
          "
          desc="点击上传身份证反面"
          @finish="setCardBackendPic"
        />
        <Uploader
          style="margin-top: 0.3rem;"
          :defaultImg="
            holdCardPic ||
              require('./images/info/hold-card-uploader-default.png')
          "
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
        <div>
          {{ categoryList.length ? categoryList[categoryIdx].text : "" }}
        </div>
        <img class="arrow" src="./images/info/arrow.png" alt="" />
      </div>
    </div>

    <button class="submit-btn" @click="submit">提交申请</button>

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
import { Popup, Area, TreeSelect, Toast } from 'vant';
import Uploader from "@/components/Uploader";
import { areaList } from "@vant/area-data";
import { mapState } from "vuex";
import _ from "lodash";
import SupplierService from "./utils/supplierService";

const supplierService = new SupplierService();

export default {
  components: { Popup, Area, Uploader, TreeSelect },

  data() {
    return {
      areaList,
      regionOptions: [],
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
      cardFrontPic: "",
      cardBackendPic: "",
      holdCardPic: "",
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

  async created() {
    this.categoryIdx = this.$route.query.categoryIdx || 0;
    Toast.loading({ message: '加载中...'})
    await this.setRegionOptions();
    await this.setSupplierInfo();
    Toast.clear()
  },

  methods: {
    async setSupplierInfo() {
      const {
        merchants_steps_fields,
        seller_shop_info,
        merchants_shop_infomation,
      } = (await supplierService.getSupplierInfo()) || {};
      if (merchants_steps_fields) {
        this.categoryIdx = this.categoryList.findIndex(
          (item) => item.value == merchants_shop_infomation.shop_categoryMain
        );
  
        const {
          company_name,
          company_adress,
          contactPhone,
          contactEmail,
          zhizhao,
          shop_recruitment,
          contactName,
          personalNo,
          idcard_front,
          idcard_reverse,
          handheld_idcard,
        } = merchants_steps_fields;
        this.shopName = company_name;
        this.addressDetail = company_adress;
        this.mobile = contactPhone;
        this.email = contactEmail;
        this.businessPic = zhizhao;
        this.coverPic = shop_recruitment;
        this.name = contactName;
        this.idCardNum = personalNo;
        this.cardFrontPic = idcard_front;
        this.cardBackendPic = idcard_reverse;
        this.holdCardPic = handheld_idcard;
  
        const { province, city, district } = seller_shop_info;
        this.regionDesc = `${
          this.provinceList.find((item) => item.id == province).name
        } ${this.cityList.find((item) => item.id == city).name} ${
          this.countyList.find((item) => item.id == district).name
        }`;
        this.provinceId = province;
        this.cityId = city;
        this.countyId = district;
      }
    },

    async setRegionOptions() {
      const res = await supplierService.getRegionOptions();
      const options = res.data.child;
      let cityList = [];
      let countyList = [];
      const provinceList = options.map((province) => {
        cityList = [
          ...cityList,
          ...province.child.map((city) => {
            countyList = [
              ...countyList,
              ...city.child.map((county) => ({
                id: county.region_id,
                name: county.region_name,
              })),
            ];
            return { id: city.region_id, name: city.region_name };
          }),
        ];
        return { id: province.region_id, name: province.region_name };
      });
      this.provinceList = provinceList;
      this.cityList = cityList;
      this.countyList = countyList;
    },

    areaConfirm(areaList) {
      this.regionDesc = areaList.reduce((a, b) => `${a} ${b.name}`, "");

      this.provinceId = this.provinceList.find((item) =>
        areaList[0].name.includes(item.name)
      ).id;
      this.cityId = this.cityList.find((item) =>
        areaList[1].name.includes(item.name)
      ).id;
      this.countyId = this.countyList.find((item) =>
        areaList[2].name.includes(item.name)
      ).id;

      this.areaPickerPopupVisible = false;
    },

    setBusinessPic(pic) {
      this.businessPic = pic;
    },

    setCoverPic(pic) {
      this.coverPic = pic;
    },

    setCardFrontPic(pic) {
      this.cardFrontPic = pic;
    },

    setCardBackendPic(pic) {
      this.cardBackendPic = pic;
    },

    setHoldCardPic(pic) {
      this.holdCardPic = pic;
    },

    categoryConfirm(index) {
      this.categoryIdx = index;
    },

    submit() {
      if (!this.shopName) {
        Toast("请输入店铺名称");
        return;
      }
      if (!this.regionDesc) {
        Toast("请选择省市区");
        return;
      }
      if (!this.addressDetail) {
        Toast("请填写详细地址");
        return;
      }
      if (!this.mobile || !/^1[345789][0-9]{9}$/.test(this.mobile)) {
        Toast("请输入正确联系电话");
        return;
      }
      if (
        !this.email ||
        !/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(this.email)
      ) {
        Toast("请输入正确电子邮箱");
        return;
      }
      if (!this.businessPic) {
        Toast("请上传营业执照");
        return;
      }
      if (!this.coverPic) {
        Toast("请上传店招");
        return;
      }
      if (!this.name) {
        Toast("请填写本人姓名");
        return;
      }
      if (
        !this.idCardNum ||
        !/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(this.idCardNum)
      ) {
        Toast("请填写本人身份证号");
        return;
      }
      if (!this.cardFrontPic) {
        Toast("请上传身份证正面照片");
        return;
      }
      if (!this.cardBackendPic) {
        Toast("请上传身份证反面照片");
        return;
      }
      if (!this.holdCardPic) {
        Toast("请上传手持身份证照片");
        return;
      }

      this.apply();
    },

    apply: _.once(function() {
      supplierService.shopApply(
        {
          type_id: this.categoryList[this.categoryIdx].value,
          supplier_name: this.shopName,
          province: this.provinceId,
          city: this.cityId,
          district: this.countyId,
          address: this.addressDetail,
          tel: this.mobile,
          email: this.email,
          zhizhao: this.businessPic,
          shop_recruitment: this.coverPic,
          contacts_name: this.name,
          id_card_no: this.idCardNum,
          idcard_front: this.cardFrontPic,
          idcard_reverse: this.cardBackendPic,
          handheld_idcard: this.holdCardPic,
        },
        () => {
          this.$router.push("/supplier/status");
        }
      );
    }),
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
