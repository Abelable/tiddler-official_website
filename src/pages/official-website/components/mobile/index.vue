<template>
  <div>
    <div class="header" :class="{ active: menuTabActive }" ref="header">
      <div class="row center">
        <img class="logo" src="@/assets/images/logo.png" alt="" />
        <img class="logo-desc" src="@/assets/images/logo-desc.png" alt="" />
      </div>
      <img
        class="menu"
        @click="menuPopupVisible = true"
        src="https://calgee.com/cdn/shop/t/50/assets/icon-menu.svg"
        alt=""
      />
    </div>

    <div class="container" ref="container">
      <div class="home">
        <div class="home-title">聚焦千岛湖</div>
        <div class="home-desc">技术驱动变革，创新决胜未来</div>
        <img class="home-illus" src="./images/welcome.png" alt="" />
      </div>

      <div class="highlight-wrap" ref="highlight">
        <img class="highlight-bg" src="./images/highlights/bg.png" alt="" />
      </div>

      <div class="programme-wrap" ref="programme">
        <img
          class="programme-title"
          src="./images/programme/programme_title.png"
          alt=""
        />

        <div class="programme-card-wrap">
          <div
            class="programme-card"
            :class="{ active: curProgrammeIdx === index }"
            v-for="(item, index) in programmeList"
            :key="index"
            @click="curProgrammeIdx = index"
          >
            <div class="programme-card-title row">
              <img
                class="programme-icon"
                :src="require(`./images/programme/programme_${index + 1}.png`)"
                alt=""
              />
              <div>{{ item.title }}</div>
            </div>
            <div class="programme-desc">{{ item.desc }}</div>
          </div>
        </div>
      </div>

      <div class="footer" ref="footer">
        <div class="footer-content row">
          <div class="footer-title">服务保障</div>
          <div class="footer-line">
            <div class="footer-line-inner"></div>
          </div>
          <img
            class="service-qr-code"
            src="./images/service-qr-code.png"
            alt=""
          />
          <div class="service-qr-code-desc">
            扫描二维码咨询数字人专属定制服务
          </div>
          <div class="company">杭州鱼小小科技有限公司</div>
          <div class="icp" @click="checkIcp">
            浙ICP备2023054709号-2 https://tbbai.cn
          </div>
          <div class="tel">投诉电话: 0571-28834861</div>
        </div>
      </div>
    </div>

    <Popup v-model="menuPopupVisible" position="left">
      <div class="menu-draw">
        <div class="login-btn-wrap row">
          <div class="login-btn row center">鱼小小登录</div>
          <div class="login-btn row center">鱼小小代理版</div>
        </div>
        <div
          class="menu-item row between"
          :class="{ active: curMenuIdx === index }"
          v-for="(item, index) in menuList"
          :key="index"
          @click="selectMenu(index)"
        >
          <div>{{ item }}</div>
          <img
            class="arrow"
            :src="
              require(`./images/arrow${
                curMenuIdx === index ? '-active' : ''
              }.png`)
            "
            alt=""
          />
        </div>
      </div>
    </Popup>
  </div>
</template>

<script>
import { Popup } from "vant";
import _ from "lodash";

export default {
  components: { Popup },

  data() {
    return {
      menuList: ["首页", "应用图谱", "关于我们"],
      menuTabActive: false,
      curMenuIdx: 0,
      curHighlightIndex: 0,
      programmeList: [
        {
          title: "娱乐行业",
          desc:
            "真人出镜类素材的优势；持续投放时间是 2D 素材的 3 倍3D 素材的 1.5 倍点击率和有效播放率，高出其他类型素材 20%"
        },
        {
          title: "教育/公众事业",
          desc:
            "发展数字人营销的机会，无需真人出镜，规模化生产营销视频的天产能可达200+，在数字化时代更好地与消费者互动，提高市场竞争力"
        },
        {
          title: "电商行业",
          desc:
            "投资数字人资产营销的回报，快速产出，高效迭代，全面提升 3 倍创意效率，突破营销瓶颈；数字人分身，24h 随时上线，灵活度极高"
        }
      ],
      curProgrammeIdx: 0,
      menuPopupVisible: false
    };
  },

  mounted() {
    window.addEventListener("scroll", this.scroll);
    this.$nextTick(() => {
      this.parent = window || document.documentElement || document.body;
      this.containerScrollHeight = this.$refs.container.scrollHeight;
      this.headerHeight = this.$refs.header.getBoundingClientRect().height;
      this.highlightTop =
        this.$refs.highlight.getBoundingClientRect().top +
        this.headerHeight -
        30;
      this.programmeTop =
        this.$refs.programme.getBoundingClientRect().top +
        this.headerHeight -
        30;
      this.footerHeight = this.$refs.footer.getBoundingClientRect().height;
    });
  },

  methods: {
    selectMenu(index) {
      switch (index) {
        case 0:
          this.parent.scrollTo({ top: 0, behavior: "smooth" });
          break;

        case 1:
          this.parent.scrollTo({ top: this.highlightTop, behavior: "smooth" });
          break;

        case 2:
          this.parent.scrollTo({ top: this.programmeTop, behavior: "smooth" });
          break;

        case 3:
          this.parent.scrollTo({
            top: this.containerScrollHeight,
            behavior: "smooth"
          });
          break;
      }
      this.curMenuIdx = index;
    },

    selectHighlight(index) {
      this.curHighlightIndex = index;
    },

    scroll() {
      const scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;

      if (scrollTop >= 100 && !this.menuTabActive) {
        this.menuTabActive = true;
      }
      if (scrollTop < 100 && this.menuTabActive) {
        this.menuTabActive = false;
      }

      this.scrollHandler(scrollTop);
    },

    scrollHandler: _.debounce(function(scrollTop) {
      if (scrollTop < this.highlightTop && this.curMenuIdx !== 0) {
        this.curMenuIdx = 0;
      }
      if (
        scrollTop >= this.highlightTop - 32 &&
        scrollTop < this.pointTop - 32 &&
        this.curMenuIdx !== 1
      ) {
        this.curMenuIdx = 1;
      }
      if (
        scrollTop >= this.programmeTop - 32 &&
        scrollTop < this.programmeTop + this.footerHeight - 40 &&
        this.curMenuIdx !== 2
      ) {
        this.curMenuIdx = 2;
      }
      if (
        scrollTop >= this.programmeTop + this.footerHeight - 200 &&
        this.curMenuIdx !== 3
      ) {
        this.curMenuIdx = 3;
      }
    }, 50),

    checkIcp() {
      window.location.href = "https://beian.miit.gov.cn";
    }
  }
};
</script>

<style lang="stylus" scoped>
.row
  display: flex
  align-items: center
  &.between
    justify-content: space-between
  &.center
    justify-content: center
.header
  position: fixed
  top: 0
  left: 0
  display: flex
  align-items: center
  justify-content: space-between
  padding: .24rem .4rem
  width: 100vw
  z-index: 100
  &.active
    background: #C6E8FA
  .logo
    width: .5rem
    height: .5rem
  .logo-desc
    margin-left: 0.12rem
    height: .32rem
  .menu
    width: .4rem
    height: .3rem
.container
  background: #F7F8FA
  overflow: hidden
  .home
    position: relative
    padding-top: 0.98rem
    padding-bottom: 0.4rem
    color: #0062A7
    font-size: 0
    font-weight: 600
    text-align: center
    background: #C6E8FA
    &::before
      position: absolute
      top: 0
      right: 0
      width: 4.2rem
      height: 100%
      content: ""
      background: url(https://calgee.com/cdn/shop/t/50/assets/home-nav-shape2.png) no-repeat left top
      background-size: auto 1.3rem
    &::after
      position: absolute
      left: 0
      bottom: 0
      width: 37.5rem
      height: 0.625rem
      content: ""
      background: url(https://calgee.com/cdn/shop/t/50/assets/white-wave.svg?v=88207661338556974601706585120) repeat-x center top
      animation: wavesmall 10s cubic-bezier(.36,.45,.63,.53) infinite;
    .home-title
      font-size: 0.38rem
    .home-desc
      margin-top: 0.12rem
      font-size: 0.24rem
    .home-illus
      margin-top: 0.24rem
      width: 6rem
  .introduce-wrap
    height: 3.48rem
    font-size: 0
    .introduce
      width: 100%
      height: 100%
  .highlight-wrap
    height: 19.6rem
    font-size: 0
    .highlight-bg
      width: 100%
      height: 100%
  .programme-wrap
    padding: 0 .3rem
    background: #fff
    overflow: hidden
    .programme-title
      display: block
      margin: .4rem auto 0
      width: 5.32rem
      height: 2.02rem
    .programme-card-wrap
      margin-top: .3rem
      .programme-card
        margin-bottom: .3rem
        padding: .3rem
        height: 2.2rem
        background: #F7F8FA
        border-radius: .16rem
        border: 1px solid #F7F8FA
        &.active
          background: rgba(255,237,236,0.15)
          border: 1px solid #FE8C8B
        .programme-card-title
          color: #363636
          font-size: .28rem
          font-weight: 500
          .programme-icon
            margin-right: .12rem
            width: .4rem
            height: .4rem
        .programme-desc
          margin-top: .2rem
          color: #6A6A6F
          font-size: .24rem
  .footer
    padding: 0 .3rem
    background: #1C2037
    .footer-content
      flex-direction: column
      &:first-child
        padding: .3rem 0 .6rem
        border-bottom: 1px solid #8E8F9B
      &:last-child
        padding: .6rem 1rem
      .footer-title
        color: #fff
        font-size: .32rem
        font-weight: 600
      .footer-line
        margin-top: .3rem
        width: 2.16rem
        height: .04rem
        background: #8E8F9B
        .footer-line-inner
          width: .52rem
          height: .04rem
          background: #FE8C8B
      .service-qr-code
        margin-top: 0.5rem
        width: 2rem
        height: 2rem
      .service-qr-code-desc
        margin-top: 0.3rem
        color: #8E8F9B
        font-size: 0.24rem
      .company, .icp, .tel
        margin-top: 0.6rem
        color: #fff
        font-size: 0.24rem
      .icp
        margin-top: 0.1rem
      .tel
        margin-top: 0.1rem
.menu-draw
  width: 60vw
  height: 100vh
  background: #fff
  .login-btn-wrap
    padding: 1rem .3rem
    width: 60vw
    background: #E55958
    .login-btn
      padding: 0.1rem 0
      flex: 1
      color: #fff
      font-size: 0.24rem
      border: 1px solid #fff
      border-radius: .1rem
      &:first-child
        margin-right: .2rem
  .menu-item
    padding: .6rem .3rem
    height: 1rem
    color: #999
    font-size: .32rem
    &.active
      color: #FE8C8B
      font-weight: 500
    .arrow
      width: .3rem
      height: .3rem
@keyframes wavesmall
  0%
    margin-left: 0
  100%
    margin-left: -750px
</style>
