<template>
  <div class="container" ref="container">
    <div class="menu-tab" :class="{ active: menuTabActive }" ref="menuTab">
      <div class="main row between" ref="menuMain">
        <img class="logo" @click="scrollToTop" src="./images/logo.png" alt="" />
        <img
          class="logo-desc"
          @click="scrollToTop"
          src="./images/logo-desc.png"
          alt=""
        />
        <div class="menu row between">
          <div
            class="menu-item"
            :class="{ active: curMenuIdx === index }"
            v-for="(item, index) in menuList"
            :key="index"
            @click="selectMenu(index)"
          >
            {{ item[language] }}
          </div>
          <div
            class="menu-item login"
            @mouseover="loginModalVisible = true"
            @mouseleave="loginModalVisible = false"
          >
            <div>{{ language === "zh" ? "登录" : "Login" }}</div>
            <!-- <div class="login-modal" v-if="loginModalVisible">
              <div
                class="login-btn row"
                :class="{ active: curLoginBtnIndex === _index }"
                v-for="(_item, _index) in [
                  { zh: '鱼小小登录', en: 'User Login' },
                  { zh: '鱼小小代理版', en: 'Agent Login' }
                ]"
                :key="_index"
                @mouseover="curLoginBtnIndex = _index"
              >
                {{ _item[language] }}
              </div>
            </div> -->
          </div>
          <div
            class="language-switch-btn row"
            @click="languageModalVisible = !languageModalVisible"
          >
            <img class="global-icon" src="./images/global.png" alt="" />
            <div class="btn-main">
              {{ language === "zh" ? "中文" : "ENGLISH" }}
            </div>
            <img
              class="switch-arrow"
              :class="{ up: languageModalVisible }"
              src="./images/arrow.png"
              alt=""
            />
            <div class="language-modal" v-if="languageModalVisible">
              <div
                class="language-option"
                :class="{ active: language === item.value }"
                v-for="(item, index) in [
                  { text: '中文', value: 'zh' },
                  { text: 'ENGLISH', value: 'en' }
                ]"
                :key="index"
                @click.stop="selectLanguage(item.value)"
              >
                {{ item.text }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="home">
      <img class="wave-bg" src="./images/home/wave.png" alt="" />
      <div class="main row">
        <div class="row center" style="width: 100%" :style="{ zoom }">
          <div class="introduce">
            <div class="introduce-title">
              {{ language === "zh" ? "鱼小小科技" : "YUXIAOXIAO TECH" }}
            </div>
            <div class="introduce-desc">
              {{
                language === "zh"
                  ? "千岛湖生活、文旅技术服务"
                  : "Qiandaohu Life, Cultural and Tourism Technology Services"
              }}
            </div>
          </div>
          <img class="home-illus" src="./images/home/welcome.png" alt="" />
        </div>
      </div>
    </div>

    <div class="app-intro" ref="appIntro">
      <div class="main row">
        <div style="width: 100%" :style="{ zoom }">
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
      </div>
    </div>

    <div class="about-us" ref="aboutUs">
      <div class="main row">
        <div style="width: 100%" :style="{ zoom }">
          <div class="about-us-title">
            {{ language === "zh" ? "关于我们" : "ABOUT US" }}
          </div>
          <div class="row center">
            <div class="about-us-content" v-if="language === 'zh'">
              <p>我们坐落于美丽的千岛湖畔，</p>
              <p>我们是一群年轻、拥有梦想的年轻人，</p>
              <p>为千岛湖注入科技的血液、</p>
              <p>成为千岛湖发展的催化剂，</p>
              <p>将是我们永远的使命</p>
            </div>
            <div class="about-us-content" v-if="language === 'en'">
              <p>We are located by the beautiful Qiandaohu,</p>
              <p>We are a group of young people with dreams,</p>
              <p>Injecting the blood of technology into Qiandaohu,</p>
              <p>Becoming a catalyst</p>
              <p>for the development of Qiandaohu</p>
              <p>will be our eternal mission</p>
            </div>
            <img
              class="about-us-illus"
              src="https://calgee.com/cdn/shop/files/the_calgee_story_640x.webp?v=1693281072"
              alt=""
            />
          </div>
        </div>
      </div>
    </div>

    <div class="footer" ref="footer">
      <div class="main row">
        <div class="row center" style="width: 100%" :style="{ zoom }">
          <div class="footer-info row top">
            <div class="brand-introduction">
              <img class="brand-logo" src="./images/logo.png" alt="" />
              <div class="brand-desc" v-if="language === 'zh'">
                <p>以技术驱动千岛湖科技发展</p>
                <p>不断追求和探索是鱼小小科技的宗旨。</p>
              </div>
              <div class="brand-desc" v-if="language === 'en'">
                <p>Continuously pursuing</p>
                <p>and exploring</p>
                <p>Driving the Technological Development</p>
                <p>of Qiandaohu with Technology</p>
              </div>
            </div>
            <div class="footer-info-detail">
              <div class="footer-title">
                {{ language === "zh" ? "网站导航" : "tiddler.cn" }}
              </div>
              <div class="footer-title-line">
                <div class="footer-title-line-inner"></div>
              </div>
              <div class="footer-link-wrap">
                <div
                  class="footer-link"
                  v-for="(item, index) in footerLinkList"
                  :key="index"
                  @click="selectMenu(index)"
                >
                  {{ item[language] }}
                </div>
              </div>
            </div>
            <div class="footer-info-detail">
              <div class="footer-title">
                {{ language === "zh" ? "最新新闻" : "NEWS" }}
              </div>
              <div class="footer-title-line">
                <div class="footer-title-line-inner"></div>
              </div>
              <div class="footer-news-wrap" v-if="language === 'zh'">
                <div class="footer-news">2024年6月 小鱼游小程序 上线</div>
                <div class="footer-news">
                  <p>2024年4月 鱼小小科技成立</p>
                  <!-- <p>了解更多详情<span class="news-link">点击这里</span></p> -->
                </div>
              </div>
              <div class="footer-news-wrap" v-if="language === 'en'">
                <div class="footer-news">
                  June 2024, Trip Mp Online
                </div>
                <div class="footer-news">
                  <p>April 2024,</p>
                  <p>Yuxiaoxiao Tech was established</p>
                </div>
              </div>
            </div>
            <div class="footer-info-detail">
              <div class="footer-title">
                {{ language === "zh" ? "联系我们" : "CONTACT US" }}
              </div>
              <div class="footer-title-line">
                <div class="footer-title-line-inner"></div>
              </div>
              <div class="footer-contact-info-wrap">
                <div class="footer-contact-info row top">
                  <img
                    class="contact-info-icon"
                    src="./images/footer/position.png"
                    alt=""
                  />
                  <p class="footer-contact" v-if="language === 'zh'">
                    浙江省杭州市淳安县千岛湖镇青溪大道299号513-5室
                  </p>
                  <div class="footer-contact" v-if="language === 'en'">
                    <p>Room 513-5,</p>
                    <p>No. 299 Qingxi Avenue,</p>
                    <p>Qiandaohu Town,</p>
                    <p>Chun'an County, Hangzhou City,</p>
                    <p>Zhejiang Province, P.R.CNINA</p>
                  </div>
                </div>
                <div class="footer-contact-info row top">
                  <img
                    class="contact-info-icon"
                    src="./images/footer/email.png"
                    alt=""
                  />
                  <p class="footer-contact">tiddler_tech@126.com</p>
                </div>
                <div class="footer-contact-info row top">
                  <img
                    class="contact-info-icon"
                    src="./images/footer/tel.png"
                    alt=""
                  />
                  <p class="footer-contact">15869035014</p>
                </div>
                <div class="footer-contact-info row top">
                  <img
                    class="contact-info-icon"
                    src="./images/footer/wechat.png"
                    alt=""
                  />
                  <p class="footer-contact">
                    {{ language === "zh" ? "微信公众号" : "Wechat QRcode" }}
                  </p>
                </div>
                <img
                  class="wechat-qrcode"
                  src="./images/footer/qrcode.jpg"
                  alt=""
                />
              </div>
            </div>
            <div class="copyright">
              <span>{{
                language === "zh"
                  ? "Copyright © 杭州鱼小小科技有限公司 版权所有 免责声明"
                  : "Copyright © YUXIAOXIAO（HangZhou）Technology CO.,LTD  All Rights Reserved. "
              }}</span>
              <span class="icp" @click="checkIcp">浙ICP备2024096691号-1</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <img
      class="back-top-btn"
      v-if="backTopBtnVisible"
      @click="scrollToTop"
      src="./images/backtop.png"
      alt=""
    />
  </div>
</template>

<script>
import { Swipe, SwipeItem } from "vant";
import debounce from "lodash/debounce";

export default {
  components: { Swipe, SwipeItem },

  data() {
    return {
      zoom: 1,
      language: "zh",
      languageModalVisible: false,
      menuList: [
        { zh: "首页", en: "Home" },
        { zh: "应用图谱", en: "Products" },
        { zh: "关于我们", en: "About us" }
      ],
      footerLinkList: [
        { zh: "网站首页", en: "HOME" },
        { zh: "应用图谱", en: "PRODUCTS" },
        { zh: "关于我们", en: "ABOUT US" },
        { zh: "最新新闻", en: "NEWS" }
      ],
      curMenuIdx: 0,
      menuTabActive: false,
      loginModalVisible: false,
      curLoginBtnIndex: 0,
      backTopBtnVisible: false
    };
  },

  mounted() {
    const language = localStorage.getItem("language") || "zh";
    this.language = language;

    window.addEventListener("scroll", this.scroll);

    this.$nextTick(() => {
      this.parent = window || document.documentElement || document.body;
      this.containerScrollHeight = this.$refs.container.scrollHeight;
      this.menuHeight = this.$refs.menuTab.getBoundingClientRect().height;
      this.appIntroTop =
        this.$refs.appIntro.getBoundingClientRect().top - this.menuHeight;
      this.aboutUsTop =
        this.$refs.aboutUs.getBoundingClientRect().top - this.menuHeight;
      this.footerHeight = this.$refs.footer.getBoundingClientRect().height;
    });
  },

  methods: {
    selectLanguage(language) {
      this.language = language;
      this.languageModalVisible = false;
      localStorage.setItem("language", language);
    },

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

    scrollToTop() {
      this.parent.scrollTo({ top: 0, behavior: "smooth" });
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
      if (scrollTop > 10 && !this.backTopBtnVisible) {
        this.backTopBtnVisible = true;
      }
      if (scrollTop <= 10 && this.backTopBtnVisible) {
        this.backTopBtnVisible = false;
      }
      if (scrollTop < this.appIntroTop && this.curMenuIdx !== 0) {
        this.curMenuIdx = 0;
      }
      if (
        scrollTop >= this.appIntroTop - 2 &&
        scrollTop < this.aboutUsTop - 2 &&
        this.curMenuIdx !== 1
      ) {
        this.curMenuIdx = 1;
      }
      if (
        scrollTop >= this.aboutUsTop - 2 &&
        scrollTop < this.aboutUsTop + this.footerHeight - 2 &&
        this.curMenuIdx !== 2
      ) {
        this.curMenuIdx = 2;
      }
      if (
        scrollTop >= this.aboutUsTop + this.footerHeight - 2 &&
        this.curMenuIdx !== 3
      ) {
        this.curMenuIdx = 3;
      }
    }, 50),

    checkIcp() {
      window.open("https://beian.miit.gov.cn", "_blank");
    }
  }
};
</script>

<style lang="stylus" scoped>
.temp
  width: 100%
.row
  display: flex
  align-items: center
  &.top
    align-items: flex-start
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
  &.active
    background: #C6E8FA
  .logo
    width: .48rem
    height: .48rem
    cursor: pointer
  .logo-desc
    margin-left: 0.12rem
    height: .24rem
    cursor: pointer
  .menu
    margin-left: 5rem
    flex: 1
    .menu-item
      color: #0062A7
      font-size: .18rem
      cursor: pointer
      &.active
        position: relative
        font-weight: 600
        &::after
          position: absolute
          left: 50%
          bottom: -.10rem
          transform: translateX(-50%)
          width: .58rem
          height: .04rem
          content: ""
          background: #0062A7
          border-radius: .08rem
      &.login
        position: relative
        .login-modal
          position: absolute
          right: 0
          top: calc(100% + 0.14rem)
          padding: 0.15rem 0.04rem
          width: 1.48rem
          height: 1.28rem
          background: #fff
          border-radius: .1rem
          z-index: 100
          &::after
            position: absolute
            right: .1rem
            bottom: 100%
            width: 0
            height: 0
            content: ""
            border-top: .1rem solid transparent
            border-left: .1rem solid transparent
            border-right: .1rem solid transparent
            border-bottom: .1rem solid #fff
          .login-btn
            padding-left: 0.17rem
            width: 1.42rem
            height: 0.45rem
            color: #333
            font-size: 0.18rem
            border-radius: 0.06rem
            &.active
              color: #fff
              background: #FE8C8B
            &:first-child
              margin-bottom: 0.05rem
    .language-switch-btn
      position: relative
      padding: 0 0.2rem
      width: 2.36rem
      height: 0.52rem
      background: #fff
      border-radius: 0.08rem
      border: 1px solid #DCDCDC
      cursor: pointer
      .global-icon
        width: 0.22rem
        height: 0.22rem
      .btn-main
        margin-left: 0.2rem
        padding-left: 0.2rem
        flex: 1
        height: 0.2rem
        color: #333
        font-size: 0.18rem
        line-height: 0.2rem
        border-left: 1px solid #999
      .switch-arrow
        width: 0.14rem
        height: 0.14rem
        transform: rotate(0)
        transition: transform .2s
        &.up
          transform: rotate(180deg)
          transition: transform .2s
      .language-modal
        position: absolute
        right 0
        top: calc(100% + 0.1rem)
        padding: 0 0.12rem
        width: 1.73rem
        background: #fff
        border-radius: .08rem
        border: 1px solid #DCDCDC
        z-index: 100
        .language-option
          padding: 0.1rem 0.1rem
          color: #333
          font-size: 0.18rem
          &:first-child
            border-bottom: 1px solid #eee
          &.active
            color: #0062A7
            font-weight: 500
.container
  position: relative
  font-size: 0
  background: #f7f8fa
  .icp-cover
    position: absolute
    left: 0
    bottom: 0
    width: 100%
    height: 1.2rem
    color: #8E8F9B
    font-size: .22rem
    background: #1E0202
  .home
    position: relative
    height: 90vh
    background: #C6E8FA
    overflow-y: hidden
    .wave-bg
      position: absolute
      top: 0
      right: -0.5rem
      width: 6.32rem
      height: 1.6rem
    &::after
      position: absolute
      left: 0
      bottom: -2.4rem
      width: 488rem
      height: 3.125rem
      content: ''
      background: url(https://calgee.com/cdn/shop/t/50/assets/white-wave.svg?v=88207661338556974601706585120) repeat-x center top
      background-size: 1900px 204px
      animation: wave 15s cubic-bezier(0.36, 0.45, 0.63, 0.53) infinite
    .introduce
      flex: 1
      color: #0062A7
      font-weight: 600
      .introduce-title
        font-size: 1rem
        &.smaller
          font-size: 0.8rem
      .introduce-desc
        margin-top: 0.12rem
        font-size: 0.32rem
    .home-illus
      margin-top: 1rem
      width: 8rem
  .app-intro
    position: relative
    height: 84vh
    background: #fff
    overflow: hidden
    &::after
      position: absolute
      left: 0
      bottom: -2.4rem
      width: 488rem
      height: 3.125rem
      content: ''
      background: url(https://calgee.com/cdn/shop/t/50/assets/lightblue-wave.svg) repeat-x center top
      background-size: 1900px 204px
      animation: wave 15s cubic-bezier(0.36, 0.45, 0.63, 0.53) infinite
    .app-intro-banner
      width: 100%
      border-radius: 0.24rem
  .about-us
    height: 80vh
    overflow: hidden
    background: #E4F5FD
    .about-us-title
      margin-bottom: 1rem
      color: #0062A7
      font-size: 0.40rem
      font-weight: 600
      text-align: center
    .about-us-content
      flex: 1
      color: #0062A7
      font-size: 0.28rem
      line-height: 2.5
    .about-us-illus
      width: 5rem
      height: 5rem
  .footer
    height: 50vh
    overflow: hidden
    background: #0062A7
    .footer-info
      position: relative
      width: 100%
      .brand-introduction
        margin-right: 1.5rem
        .brand-logo
          width: 0.8rem
          height: 0.8rem
        .brand-desc
          margin-top: 0.18rem
          color: #fff
          font-size: 0.18rem
      .footer-info-detail
        flex: 1
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
            background: #fff
        .footer-link-wrap
          margin-top: 0.16rem
          .footer-link
            margin-bottom: 0.2rem
            color: #fff
            font-size: 0.16rem
            cursor: pointer
        .footer-news-wrap
          padding-left: 0.16rem
          .footer-news
            position: relative
            margin-top: 0.2rem
            color: #fff
            font-size: 0.16rem
            &::before
              position: absolute
              top: 0.1rem
              left: -0.12rem
              width: 0.04rem
              height: 0.04rem
              content: ''
              border-radius: 50%
              background: #fff
            .news-link
              margin-left: 0.12rem
              font-weight: 500
              cursor: pointer
              text-decoration-line: underline
        .footer-contact-info-wrap
          .footer-contact-info
            margin-top: 0.2rem
            .contact-info-icon
              margin-top: 0.04rem
              margin-right: 0.03rem
              width: 0.16rem
              height: 0.16rem
            .footer-contact
              max-width: 2.56rem
              color: #fff
              font-size: 0.16rem
          .wechat-qrcode
            margin-top: 0.1rem
            margin-left: 0.22rem
            width: 1rem
            height: 1rem
      .copyright
        position: absolute
        left: 0
        bottom: 0
        color: #fff
        font-size: 0.16rem
        .icp
          margin-left: 0.3rem
          cursor: pointer
.back-top-btn
  position: fixed
  bottom: 0.54rem
  right: 0.54rem
  width: 0.52rem
  height: 0.52rem
  z-index: 100
  cursor: pointer
@keyframes wave
  0%
    margin-left: 0
  100%
    margin-left: -1920px
</style>
