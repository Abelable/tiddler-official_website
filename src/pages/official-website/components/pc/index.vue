<template>
  <div class="container" ref="container">
    <div class="menu-tab" :class="{ active: menuTabActive }" ref="menuTab">
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
          <div
            class="menu-item login"
            @mouseover="loginModalVisible = true"
            @mouseleave="loginModalVisible = false"
          >
            <div>登录</div>
            <div class="login-modal" v-if="loginModalVisible">
              <div
                class="login-btn row"
                :class="{ active: curLoginBtnIndex === _index }"
                v-for="(_item, _index) in ['桃白白登录', '桃白白代理版']"
                :key="_index"
                @mouseover="curLoginBtnIndex = _index"
              >
                {{ _item }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="introduce">
      <img class="bg" src="./images/bg_1.png" alt="" />
      <div class="main row">
        <div :style="{ zoom }">
          <img
            class="introduce-content"
            src="./images/introduce-content.png"
            alt=""
          />
          <div class="download-btns row">
            <div class="download-btn-wrap" @mouseover="iosQrCodeVisible = true"
            @mouseleave="iosQrCodeVisible = false">
              <img
                class="download-btn"
                src="./images/ios-download-btn.png"
                alt=""
              />
              <img class="download-qr-code" v-if="iosQrCodeVisible" src="" alt="下载二维码" />
            </div>
            <div class="download-btn-wrap" @mouseover="winQrCodeVisile = true"
            @mouseleave="winQrCodeVisile = false">
              <img
                class="download-btn"
                src="./images/win-download-btn.png"
                alt=""
              />
              <img class="download-qr-code" v-if="winQrCodeVisile" src="" alt="下载二维码" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="highlights" ref="highlights">
      <img class="bg" src="./images/bg_2.png" alt="" />
      <div class="main row">
        <div style="width: 100%" :style="{ zoom }">
          <img class="atlas" src="./images/atlas.png" alt="" />
        </div>
      </div>
    </div>

    <div class="programme" ref="programme">
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
                <p v-for="(item, index) in item.desc" :key="index">
                  {{ item }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="footer" ref="footer">
      <div class="main row">
        <div class="row center" style="width: 100%" :style="{ zoom }">
          <div class="footer-info row">
            <div class="footer-title">数字分身定制咨询</div>
            <div class="footer-title-line">
              <div class="footer-title-line-inner"></div>
            </div>
            <img
              class="service-qr-code"
              src="./images/service-qr-code.png"
              alt=""
            />
            <div class="service-qr-code-desc">
              扫描二维码咨询数字人专属定制服务
            </div>
            <div class="icp" @click="checkIcp">
              杭州桃白白科技有限公司 浙ICP备2023054709号-2 https://tbbai.cn
            </div>
            <div class="tel">投诉电话: 0571-28834861</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from "lodash";

export default {
  data() {
    return {
      zoom: 1,
      menuList: ["首页", "应用图谱", "关于我们", "数字分身"],
      curMenuIdx: 0,
      menuTabActive: false,
      loginModalVisible: false,
      curLoginBtnIndex: 0,
      iosQrCodeVisible: false,
      winQrCodeVisile: false,
      programmeList: [
        {
          title: "娱乐行业",
          desc: [
            "真人出镜类素材的优势",
            "持续投放时间是 2D 素材的 3 倍",
            "3D 素材的 1.5 倍",
            "点击率和有效播放率，高出",
            "其他类型素材 20%",
          ],
        },
        {
          title: "教育/公众事业",
          desc: [
            "发展数字人营销的机会",
            "无需真人出镜，规模化生产营销",
            "视频的天产能可达200+",
            "在数字化时代更好地与消费者互",
            "动，提高市场竞争力",
          ],
        },
        {
          title: "电商行业",
          desc: [
            "投资数字人资产营销的回报",
            "快速产出，高效迭代，全面提升 3",
            "倍创意效率，突破营销瓶颈",
            "数字人分身，24h 随时上线，灵活",
            "度极高",
          ],
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
      this.programmeTop =
        this.$refs.programme.getBoundingClientRect().top - this.menuHeight;
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
          this.parent.scrollTo({ top: this.highlightsTop, behavior: "smooth" });
          break;

        case 2:
          this.parent.scrollTo({ top: this.programmeTop, behavior: "smooth" });
          break;

        case 3:
          this.parent.scrollTo({
            top: this.containerScrollHeight,
            behavior: "smooth",
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
        scrollTop >= this.programmeTop - 2 &&
        scrollTop < this.programmeTop + this.footerHeight - 2 &&
        this.curMenuIdx !== 2
      ) {
        this.curMenuIdx = 2;
      }
      if (
        scrollTop >= this.programmeTop + this.footerHeight - 2 &&
        this.curMenuIdx !== 3
      ) {
        this.curMenuIdx = 3;
      }
    }, 50),

    checkIcp() {
      window.open("https://beian.miit.gov.cn", "_blank");
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
  &.active
    backdrop-filter: blur(10px)
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
          background: #4F322D
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
              background: #FE8C8B;
            &:first-child
              margin-bottom: 0.05rem
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
  .introduce
    position: relative
    height: 100vh
    .introduce-content
      display: block
      width: 7.60rem
      height: 2.77rem
    .download-btns
      margin-top: .70rem
    .download-btn-wrap
      position: relative
      margin-right: 0.3rem
      font-size: 0
      cursor: pointer
      .download-btn
        width: 2.32rem
        height: 0.66rem
        &:hover
          opacity: 0.6
      .download-qr-code
        position: absolute
        top: calc(100% + 0.06rem)
        left: 0
        width: 2.32rem
        height: 2.32rem
        border-radius: 0.08rem
        background: #fff
        box-shadow: 0px 0px 10px 0px rgba(254,140,139,0.2)
  .highlights
    position: relative
    height: 90vh
    overflow: hidden
    .atlas
      width: 100%
      height: 8.26rem
  .programme
    height: 90vh
    overflow: hidden
    background: #fff
    .programme-title
      display: block
      margin: 0 auto
      width: 11.52rem
      height: 1.95rem
    .programme-card-wrap
      margin-top: 0.6rem
      .programme-card
        margin-right: .42rem
        flex-direction: column
        flex: 1
        height: 5.05rem
        background: #F7F8FA
        border-radius: 0.08rem
        cursor: pointer
        transition: .2s ease
        &:last-child
          margin-right: 0
        &:hover
          background: #fff
          box-shadow: 0px 0px 20px 0px rgba(35,151,141,0.2)
          transition: .2s ease
          .programme-card-title
            color: #FE8C8B
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
  .footer
    height: 40vh
    overflow: hidden
    background: #1C2037
    .footer-info
      flex-direction: column
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
          background: #FE8C8B
      .service-qr-code
        margin-top: 0.4rem
        width: 1rem
        height: 1rem
      .service-qr-code-desc, .icp, .tel
        margin-top: 0.1rem
        color: #8E8F9B
        font-size: 0.16rem
      .icp
        margin-top: 0.6rem
      .tel
        margin-top: 0.1rem
</style>
