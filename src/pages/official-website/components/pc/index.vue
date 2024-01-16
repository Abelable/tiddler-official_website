<template>
  <div class="container" ref="container">
    <img class="temp" src="./images/temp.png" alt="" >

    <!-- <div class="menu-tab" :class="{ active: menuTabActive }" ref="menuTab">
      <div class="main row between" ref="menuMain">
        <img class="logo" @click="scrollToTop" src="./images/logo.png" alt="" />
        <div class="menu row between">
          <div
            class="menu-item"
            :class="{ active: curMenuIdx === index }"
            v-for="(item, index) in menuList"
            :key="index"
            @click="selectMenu(index)"
          >
            {{ item }}
          </div>
        </div>
      </div>
    </div> -->

    <!-- <div class="introduce">
      <img class="bg" src="./images/bg_1.png" alt="" />
      <div class="main row">
        <div :style="{ zoom }">
          <img
            class="introduce-content"
            src="./images/introduce-content.png"
            alt=""
          />
          <img class="try-btn" src="./images/try-btn.png" alt="" />
        </div>
      </div>
    </div> -->

    <!-- <div class="highlights" ref="highlights">
      <img class="bg" src="./images/bg_2.png" alt="" />
      <div class="main row">
        <div style="width: 100%" :style="{ zoom }">
          <img
            class="highlights-title"
            src="./images/highlights-title.png"
            alt=""
          />
          <div class="banner-wrap row">
            <div class="banner-dots" ref="bannerDots">
              <div
                class="banner-dot"
                ref="bannerDot"
                v-for="(item, index) in bannerList"
                :key="index"
                @click="selectBanner(index)"
              >
                <div
                  class="banner-dot-inner row"
                  :class="{ active: curBannerIdx === index }"
                >
                  <img
                    class="banner-icon"
                    :src="
                      require(`./images/banner_icon/banner_${index +
                        1}_icon.png`)
                    "
                    alt=""
                  />
                  <div class="banner-dot-content">
                    <div
                      class="banner-dot-title"
                      :class="{ active: curBannerIdx === index }"
                    >
                      {{ item.title }}
                    </div>
                    <div class="banner-dot-desc">{{ item.desc }}</div>
                  </div>
                </div>
              </div>
            </div>
            <img
              class="banner"
              :src="require(`./images/banner/banner_${curBannerIdx + 1}.png`)"
              alt=""
            />
          </div>
        </div>
      </div>
    </div> -->

    <!-- <div class="point" ref="point">
      <div class="main row">
        <div style="width: 100%" :style="{ zoom }">
          <img
            class="point-title"
            src="./images/point/point-title.png"
            alt=""
          />
          <div class="point-card-wrap row">
            <div
              class="point-card row center"
              v-for="(item, index) in pointList"
              :key="index"
            >
              <img
                class="point-card-icon"
                :src="require(`./images/point/point_${index + 1}.png`)"
                alt=""
              />
              <div class="point-card-title">{{ item.title }}</div>
              <div class="point-card-desc">
                <p>{{ item.desc_1 }}</p>
                <p style="margin-top: 0.08rem;">{{ item.desc_2 }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div> -->

    <!-- <div class="programme" ref="programme">
      <div class="main row">
        <div style="width: 100%" :style="{ zoom }">
          <img
            class="programme-title"
            src="./images/programme/programme_title.png"
            alt=""
          />
          <div class="programme-card-wrap row between">
            <div
              class="programme-card row center"
              v-for="(item, index) in programmeList"
              :key="index"
            >
              <img
                class="programme-icon"
                :src="require(`./images/programme/programme_${index + 1}.png`)"
                alt=""
              />
              <div class="programme-card-title">{{ item.title }}</div>
              <div class="programme-desc">
                <p>{{ item.desc_1 }}</p>
                <p style="margin-top: 0.05rem;">{{ item.desc_2 }}</p>
              </div>
              <div class="programme-detail-wrap row">
                <div
                  class="programme-detail row"
                  v-for="(_item, _index) in item.detailList"
                  :key="_index"
                >
                  <img
                    class="programme-detail-icon"
                    :src="
                      require(`./images/programme/programme_${index +
                        1}_${_index + 1}.png`)
                    "
                    alt=""
                  />
                  <div class="programme-detail-desc">{{ _item }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div> -->

    <!-- <div class="footer" ref="footer">
      <div class="main row">
        <div class="row" style="width: 100%" :style="{ zoom }">
          <div class="footer-info">
            <div class="footer-title">服务保障</div>
            <div class="footer-title-line">
              <div class="footer-title-line-inner"></div>
            </div>
            <div class="service-info-wrap">
              <div class="service-info">7*12小时直播服务支持</div>
              <div class="service-info">专业技术团队产品保障</div>
              <div class="service-info">满足您的定制化需求</div>
            </div>
          </div>
          <div class="footer-info">
            <div class="footer-title">联系我们</div>
            <div class="footer-title-line">
              <div class="footer-title-line-inner"></div>
            </div>
            <div class="contact-info row">
              <img class="tel-icon" src="./images/tel.png" alt="" />
              <div>联系方式：13342844010 专业直播顾问随时为您服务</div>
            </div>
            <div class="qrcode-wrap row">
              <div class="qrcode">
                <img class="qrcode-img" src="./images/wx-qrcode.png" alt="" />
                <div class="qrcode-desc">微信扫码</div>
              </div>
              <div class="qrcode">
                <img class="qrcode-img" src="" alt="" />
                <div class="qrcode-desc">下载IOS客户端</div>
              </div>
              <div class="qrcode">
                <img class="qrcode-img" src="" alt="" />
                <div class="qrcode-desc">下载安卓客户端</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script>
import _ from "lodash";

export default {
  data() {
    return {
      zoom: 1,
      menuList: ["产品介绍", "核心亮点", "行业痛点", "解决方案", "服务保障"],
      curMenuIdx: 0,
      menuTabActive: false,
      bannerList: [
        { title: "小程序+ H5 皆可开播", desc: "稳定直播成交一步到位" },
        { title: "完美契合使用习惯", desc: "一键开播轻松易上手" },
        { title: "商家自有私域流量", desc: "直播数据加密更安全" },
        { title: "技术实现超低延迟", desc: "弱网直播观看双稳定" },
        { title: "智能互动氛围拉满", desc: "直播马甲助手轻松用" },
        { title: "全面支持海外直播", desc: "海外环境能播也能看" },
        { title: "实时判断网络环境", desc: "智能调节直播端码率" },
      ],
      curBannerIdx: 0,
      pointList: [
        {
          title: "平台玩法很局限",
          desc_1: "常规直播平台运营模式成本高，缺乏实用的",
          desc_2: "营销工具，客户转化能以实现",
        },
        {
          title: "传统营销不适用",
          desc_1: "图片、文字沟通与传播信息有限，缺乏实时",
          desc_2: "互动性，难以建立好的信任度和忠诚度",
        },
        {
          title: "直播运营成本高",
          desc_1: "直播间运营、助手、售后团队成本大，缺乏",
          desc_2: "有效工具替代人力，帮助商家降本增效",
        },
        {
          title: "抓新用户难度大",
          desc_1: "面向群体特殊，纯付费投放成本与客户质量",
          desc_2: "难预估，很难发挥出客户推客户的效果",
        },
      ],
      programmeList: [
        {
          title: "引流获客",
          desc_1: "营销玩法刺激顾客一键",
          desc_2: "转发，快速裂变",
          detailList: ["邀请榜单", "滚动广告", "现金红包"],
        },
        {
          title: "直播互动",
          desc_1: "强大互动实现直播火热",
          desc_2: "氛围，方便好用",
          detailList: ["助手评论", "直播人气", "直播连麦"],
        },
        {
          title: "用户管理",
          desc_1: "高效快捷管理直播间用",
          desc_2: "户，极致控场",
          detailList: ["用户白名单", "禁言用户", "拉黑用户"],
        },
        {
          title: "直播运营",
          desc_1: "掌握用户实时在线情",
          desc_2: "况，轻松了解数据变化",
          detailList: ["在线人数", "用户标签", "数据统计"],
        },
      ],
    };
  },

  mounted() {
    window.addEventListener("scroll", this.scroll);
    this.$nextTick(() => {
      this.parent = window || document.documentElement || document.body;
      this.containerScrollHeight = this.$refs.container.scrollHeight;
      this.menuHeight = this.$refs.menuTab.getBoundingClientRect().height;
      this.highlightsTop =
        this.$refs.highlights.getBoundingClientRect().top - this.menuHeight;
      this.pointTop =
        this.$refs.point.getBoundingClientRect().top - this.menuHeight;
      this.programmeTop =
        this.$refs.programme.getBoundingClientRect().top - this.menuHeight;
      this.footerHeight = this.$refs.footer.getBoundingClientRect().height;

      this.bannerDotHeight = this.$refs.bannerDot[0].getBoundingClientRect().height;
    });
  },

  destroyed() {
    this.stopBannerLoop();
  },

  watch: {
    curBannerIdx: function(index) {
      this.$nextTick(() => {
        this.$refs.bannerDots.scrollTo({
          top: this.bannerDotHeight * (index === 0 ? 0 : index - 1),
          behavior: "smooth",
        });
      });
    },
  },

  methods: {
    selectMenu(index) {
      switch (index) {
        case 0:
          this.parent.scrollTo({ top: 0, behavior: "smooth" });
          break;

        case 1:
          this.parent.scrollTo({ top: this.highlightsTop, behavior: "smooth" });
          break;

        case 2:
          this.parent.scrollTo({ top: this.pointTop, behavior: "smooth" });
          break;

        case 3:
          this.parent.scrollTo({ top: this.programmeTop, behavior: "smooth" });
          break;

        case 4:
          this.parent.scrollTo({
            top: this.containerScrollHeight,
            behavior: "smooth",
          });
          break;
      }
      this.curMenuIdx = index;
    },

    selectBanner(index) {
      this.stopBannerLoop();
      this.curBannerIdx = index;
    },

    scrollToTop() {
      this.parent.scrollTo({ top: 0, behavior: "smooth" });
    },

    scroll() {
      const scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;

      if (scrollTop >= 10 && !this.menuTabActive) {
        this.menuTabActive = true;
      }
      if (scrollTop < 10 && this.menuTabActive) {
        this.menuTabActive = false;
      }

      this.scrollHandler(scrollTop);
    },

    scrollHandler: _.debounce(function(scrollTop) {
      if (scrollTop < this.highlightsTop && this.curMenuIdx !== 0) {
        this.curMenuIdx = 0;
      }
      if (
        scrollTop >= this.highlightsTop - 2 &&
        scrollTop < this.pointTop - 2 &&
        this.curMenuIdx !== 1
      ) {
        this.curMenuIdx = 1;
      }
      if (
        scrollTop >= this.pointTop - 2 &&
        scrollTop < this.programmeTop - 2 &&
        this.curMenuIdx !== 2
      ) {
        this.curMenuIdx = 2;
      }
      if (
        scrollTop >= this.programmeTop - 2 &&
        scrollTop < this.programmeTop + this.footerHeight - 2 &&
        this.curMenuIdx !== 3
      ) {
        this.curMenuIdx = 3;
      }
      if (
        scrollTop >= this.programmeTop + this.footerHeight - 2 &&
        this.curMenuIdx !== 4
      ) {
        this.curMenuIdx = 4;
      }

      if (scrollTop >= this.highlightsTop && scrollTop < this.pointTop) {
        this.startBannerLoop();
      } else {
        this.stopBannerLoop();
      }
    }, 50),

    startBannerLoop() {
      this.stopBannerLoop();
      this.bannerLoopInterval = setInterval(() => {
        if (this.curBannerIdx < 6) {
          this.curBannerIdx = this.curBannerIdx + 1;
        } else {
          this.curBannerIdx = 0;
        }
      }, 3000);
    },

    stopBannerLoop() {
      if (this.bannerLoopInterval) {
        clearInterval(this.bannerLoopInterval);
      }
    },
  },
};
</script>

<style lang="stylus" scoped>
.temp
  width: 100%
.row
  display: flex
  align-items: center
  &.center
    justify-content: center
  &.between
    justify-content: space-between
  &.around
    justify-content: space-around
.main
  margin: 0 auto
  max-width: 90vw
  width: 14.5rem
  height: 100%
.bg
  position: absolute
  top: 0
  left: 0
  width: 100%
  height: 100%
.menu-tab
  position: fixed
  top: 0
  left: 0
  width: 100%
  height: 10vh
  z-index: 100
  transition: background .2s ease
  &.active
    background: #fff
    transition: background .2s ease
  .logo
    width: 1.48rem
    height: .48rem
    cursor: pointer
  .menu
    width: 6.40rem
    .menu-item
      color: #4B596B
      font-size: .18rem
      cursor: pointer
      &.active
        position: relative
        color: #333
        font-weight: 600
        &::after
          position: absolute
          left: 50%
          bottom: -.10rem
          transform: translateX(-50%)
          width: .58rem
          height: .04rem
          content: ""
          background: #20B364
          border-radius: .08rem
.container
  font-size: 0
  background: #f7f8fa
  .introduce
    position: relative
    height: 100vh
    .introduce-content
      display: block
      width: 7.60rem
      height: 2.77rem
    .try-btn
      margin-top: .70rem
      display: block
      width: 2.80rem
      height: .84rem
      cursor: pointer
  .highlights
    position: relative
    height: 90vh
    overflow: hidden
    .highlights-title
      display: block
      margin: 0 auto
      width: 5.97rem
      height: 1.33rem
    .banner-wrap
      margin-top: .4rem
      .banner-dots
        margin-right: .4rem
        padding: 0 .1rem
        flex: 1
        height: 5.6rem
        overflow-y: scroll
        .banner-dot
          padding-bottom: .6rem
          &:last-child
            padding-bottom: 0
          .banner-dot-inner
            padding: 0 .55rem
            width: 100%
            height: 1.45rem
            background: rgba(255, 255, 255, 0.5)
            border-radius: .30rem
            cursor: pointer
            &.active
              background: #fff
              box-shadow: 0px 0px 10px 0px rgba(35,151,141,0.2);
            .banner-icon
              width: .80rem
              height: .80rem
          &:first-child .banner-icon
            height: .66rem
        .banner-dot-content
          margin-left: .35rem
          flex: 1
          .banner-dot-title
            color: #222
            font-size: .26rem
            font-weight: 500
            &.active
              color: #00BC81
          .banner-dot-desc
            margin-top: .20rem
            color: #222
            font-size: .20rem
      .banner
        width: 5.52rem
        height: 5.86rem
  .point
    height: 90vh
    overflow: hidden
    .point-title
      display: block
      margin: 0 auto
      width: 1.85rem
      height: .64rem
    .point-card-wrap
      flex-wrap: wrap
      margin-top: .30rem
      width: 100%
      .point-card
        flex-direction: column
        width: 50%
        height: 3.5rem;
        cursor: pointer
        transition: box-shadow .2s ease
        &:nth-child(1)
          border-right: .01rem solid #E5E6EC
          border-bottom: .01rem solid #E5E6EC
          &:hover
            box-shadow: 0 .16rem .32rem 0 rgba(48, 55, 66, 0.15);
            transition: box-shadow .2s ease
        &:nth-child(2)
          border-left: .01rem solid #E5E6EC
          border-bottom: .01rem solid #E5E6EC
          &:hover
            box-shadow: 0 .16rem .32rem 0 rgba(48, 55, 66, 0.15);
            transition: box-shadow .2s ease
        &:nth-child(3)
          border-top: .01rem solid #E5E6EC
          border-right: .01rem solid #E5E6EC
          &:hover
            box-shadow: 0 -0.16rem 0.32rem 0 rgba(48, 55, 66, 0.15);
            transition: box-shadow .2s ease
        &:nth-child(4)
          border-top: .01rem solid #E5E6EC
          border-left: .01rem solid #E5E6EC
          &:hover
            box-shadow: 0 -0.16rem 0.32rem 0 rgba(48, 55, 66, 0.15);
            transition: box-shadow .2s ease
        .point-card-icon
          width: 1.10rem
          height: 1.20rem
        .point-card-title
          margin-top: .2rem
          color: #222
          font-size: .32rem
          font-weight: 600
        .point-card-desc
          margin-top: .2rem
          color: #4B596B
          font-size: .26rem
          text-align: center
  .programme
    height: 90vh
    overflow: hidden
    background: #fff
    .programme-title
      display: block
      margin: 0 auto
      width: 9.32rem
      height: 1.33rem
    .programme-card-wrap
      margin-top: 0.8rem
      .programme-card
        flex-direction: column
        width: 3.48rem
        height: 5.05rem
        background: #F7F8FA
        border-radius: 0.08rem
        cursor: pointer
        transition: .2s ease
        &:hover
          background: #fff
          box-shadow: 0px 0px 20px 0px rgba(35,151,141,0.2)
          transition: .2s ease
          .programme-card-title
            color: #20B364
            transition: color .2s ease
        .programme-icon
          width: 0.8rem
          height: 0.8rem
        .programme-card-title
          margin-top: 0.35rem
          color: #222
          font-size: .32rem
          font-weight: 600
          transition: color .2s ease
        .programme-desc
          margin-top: .3rem
          color: #4B596B
          font-size: .26rem
          text-align: center
        .programme-detail-wrap
          margin-top: .5rem
          padding: 0 .1rem
          width: 100%
          .programme-detail
            flex-direction: column
            flex: 1
            .programme-detail-icon
              width: .4rem
              height: .4rem
            .programme-detail-desc
              margin-top: .2rem
              color: #4B596B
              font-size: .2rem
  .footer
    height: 40vh
    overflow: hidden
    background: #1C2037
    .footer-info
      padding-left: 1.4rem
      flex: 1
      height: 2.7rem
      &:first-child
        padding-left: 2rem
        border-right: 2px solid #8E8F9B
      .footer-title
        color: #fff
        font-size: .2rem
        font-weight: 600
      .footer-title-line
        margin-top: .2rem
        width: 1.08rem
        height: .02rem
        background: #8E8F9B
        .footer-title-line-inner
          width: .26rem
          height: .02rem
          background: #20B364
      .service-info-wrap
        margin-top: .4rem
        .service-info
          margin-bottom: .4rem
          color: #8E8F9B
          font-size: .16rem
          &:last-child
            margin-bottom: 0
      .contact-info
        margin-top: .3rem
        color: #fff
        font-size: .16rem
        .tel-icon
          margin-right: .06rem
          width: .16rem
          height: .16rem
      .qrcode-wrap
        margin-top: .3rem
        .qrcode
          margin-right: .7rem
          font-size: 0
          &:last-child
            margin-right: 0
          .qrcode-img
            width: 1rem
            height: 1rem
            border-radius: .08rem
            background: #fff
          .qrcode-desc
            margin-top: .1rem
            color: #8E8F9B
            font-size: .16rem
            text-align: center
</style>
