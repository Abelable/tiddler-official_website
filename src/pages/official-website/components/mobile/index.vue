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

      <div class="app-intro" ref="appIntro">
        <div class="app-intro-title">应用图谱</div>
        <div class="app-intro-desc">千岛湖小鱼游小程序</div>
        <Swipe :autoplay="8000">
          <SwipeItem v-for="item in 4" :key="item">
            <img
              class="app-intro-banner"
              :src="require(`./images/app_intro/banner_${item}.png`)"
              alt=""
            />
          </SwipeItem>
        </Swipe>
      </div>

      <div class="about-us" ref="aboutUs">
        <div class="about-us-title">关于我们</div>
        <div class="about-us-content">
          <p>我们坐落于美丽的千岛湖畔，</p>
          <p>我们是一群朝气蓬勃而富有创新的年轻人，</p>
          <p>为千岛湖注入新鲜血液、</p>
          <p>成为千岛湖发展的催化剂，</p>
          <p>将是我们永远的使命</p>
        </div>
        <img
          class="about-us-illus"
          src="https://calgee.com/cdn/shop/files/the_calgee_story_640x.webp?v=1693281072"
          alt=""
        />
      </div>

      <div class="footer" ref="footer">
        <div class="footer-content row">
          <div class="footer-title">服务保障</div>
          <div class="footer-line">
            <div class="footer-line-inner"></div>
          </div>
          <img
            class="service-qr-code"
            src="@/assets/images/qrcode.jpg"
            alt=""
          />
          <div class="service-qr-code-desc">
            扫描二维码咨询相关服务
          </div>
          <div class="company">杭州鱼小小科技有限公司</div>
          <div class="icp" @click="checkIcp">
            浙ICP备2024096691号-1 https://tiddler.cn
          </div>
          <div class="tel">投诉电话: 15869035014</div>
        </div>
      </div>
    </div>

    <Popup v-model="menuPopupVisible" position="left">
      <div class="menu-draw">
        <div class="login-btn-wrap row">
          <div class="login-btn row center">登录鱼小小</div>
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
import { Popup, Swipe, SwipeItem } from "vant";
import debounce from "lodash/debounce";

export default {
  components: { Popup, Swipe, SwipeItem },

  data() {
    return {
      menuList: ["首页", "应用图谱", "关于我们"],
      menuTabActive: false,
      curMenuIdx: 0,
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
      this.appIntroTop =
        this.$refs.appIntro.getBoundingClientRect().top +
        this.headerHeight -
        30;
      this.aboutUsTop =
        this.$refs.aboutUs.getBoundingClientRect().top + this.headerHeight - 30;
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
          this.parent.scrollTo({ top: this.appIntroTop, behavior: "smooth" });
          break;

        case 2:
          this.parent.scrollTo({ top: this.aboutUsTop, behavior: "smooth" });
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

    scrollHandler: debounce(function(scrollTop) {
      if (scrollTop < this.appIntroTop && this.curMenuIdx !== 0) {
        this.curMenuIdx = 0;
      }
      if (
        scrollTop >= this.appIntroTop - 32 &&
        scrollTop < this.pointTop - 32 &&
        this.curMenuIdx !== 1
      ) {
        this.curMenuIdx = 1;
      }
      if (
        scrollTop >= this.aboutUsTop - 32 &&
        scrollTop < this.aboutUsTop + this.footerHeight - 40 &&
        this.curMenuIdx !== 2
      ) {
        this.curMenuIdx = 2;
      }
      if (
        scrollTop >= this.aboutUsTop + this.footerHeight - 200 &&
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
  .app-intro
    position: relative
    padding: 0 0.24rem 1rem
    font-size: 0
    text-align: center
    background: #fff
    &::after
      position: absolute
      left: 0
      bottom: 0
      width: 37.5rem
      height: 0.625rem
      content: ""
      background: url(https://calgee.com/cdn/shop/t/50/assets/blue-wave-newsssss.svg?v=56658232835608197261706585120) repeat-x center top
      animation: wavesmall 10s cubic-bezier(.36,.45,.63,.53) infinite;
    .app-intro-title
      color: #0062A7
      font-size: 0.32rem
      font-weight: 600
    .app-intro-desc
      margin: 0.08rem 0 0.24rem
      color: #333
      font-size: 0.24rem
    .app-intro-banner
      width: calc(100% - 0.48rem)
      border-radius: 0.24rem
  .about-us
    padding-bottom: 0.24rem
    color: #0062A7
    font-size: 0
    text-align: center
    background: #E4F5FD
    overflow: hidden
    .about-us-title
      color: #0062A7
      font-size: 0.32rem
      font-weight: 600
    .about-us-content
      margin-top: 0.12rem
      font-size: 0.24rem
      line-height: 2
    .about-us-illus
      margin-top: 0.24rem
      width: 4rem
  .footer
    padding: 0 .3rem
    background: #0062A7
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
          background: #fff
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
    background: #0062A7
    .login-btn
      padding: 0.1rem 0
      flex: 1
      color: #fff
      font-size: 0.24rem
      border: 1px solid #fff
      border-radius: .1rem
  .menu-item
    padding: .6rem .3rem
    height: 1rem
    color: #999
    font-size: .32rem
    &.active
      color: #0062A7
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
