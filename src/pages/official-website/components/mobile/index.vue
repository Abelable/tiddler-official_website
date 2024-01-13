<template>
  <div>
    <div class="header" ref="header">
      <img class="logo" src="./images/logo.png" alt="" />
      <img
        class="menu"
        @click="menuPopupVisible = true"
        src="./images/menu.png"
        alt=""
      />
    </div>

    <div class="container" ref="container">
      <div class="introduce-wrap">
        <img class="introduce" src="./images/banner_1.png" alt="" />
      </div>

      <div class="highlight-wrap" ref="highlight">
        <img class="highlight-bg" src="./images/highlights/bg.png" alt="" />
        <img
          class="highlight-title"
          src="./images/highlights/title.png"
          alt=""
        />
        <div class="highlight-menu row">
          <div
            class="highlight-menu-item row"
            :class="{ active: curHighlightIndex === index }"
            v-for="(item, index) in highlightList"
            :key="index"
            @click="selectHighlight(index)"
          >
            <img
              class="menu-icon"
              :src="require(`./images/highlights/icon/${index + 1}.png`)"
              alt=""
            />
            <div>{{ item.iconDesc }}</div>
          </div>
        </div>
        <img
          class="highlight"
          :src="
            require(`./images/highlights/banner/${curHighlightIndex + 1}.png`)
          "
          alt=""
        />
        <div class="highlight-content">
          <div class="highlight-content-title">
            {{ highlightList[curHighlightIndex].title }}
          </div>
          <div class="highlight-content-desc">
            {{ highlightList[curHighlightIndex].desc }}
          </div>
        </div>
      </div>

      <div class="point-wrap" ref="point">
        <img class="point-title" src="./images/point/title.png" alt="" />
        <div class="point-card-wrap row">
          <div
            class="point-card row"
            v-for="(item, index) in pointList"
            :key="index"
          >
            <img
              class="point-icon"
              :src="require(`./images/point/${index + 1}.png`)"
              alt=""
            />
            <div class="point-card-title">{{ item.title }}</div>
            <div class="point-desc">
              <p v-for="(_item, _index) in item.desc" :key="_index">
                {{ _item }}
              </p>
            </div>
          </div>
        </div>
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
            <div class="programme-detail-wrap row between">
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
                <div>{{ _item }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="footer" ref="footer">
        <div class="footer-content row">
          <div class="footer-title">服务保障</div>
          <div class="footer-line">
            <div class="footer-line-inner"></div>
          </div>
          <div class="service-info row between">
            <div>7*12小时直播服务支持</div>
            <div>专业技术团队产品保障</div>
          </div>
          <div class="service-info row center">
            <div>满足您的定制化需求</div>
          </div>
        </div>
        <div class="footer-content row">
          <div class="footer-title">联系我们</div>
          <div class="footer-line">
            <div class="footer-line-inner"></div>
          </div>
          <div class="footer-desc">专业直播顾问随时为您服务</div>
          <div class="contact-info row center">
            <img class="tel-icon" src="./images/tel.png" alt="" />
            <div>联系方式：13342844010</div>
            <div class="call-btn row center">一键拨号</div>
          </div>
          <div class="qrcode-wrap row between">
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

    <Popup v-model="menuPopupVisible" position="left">
      <div class="menu-draw">
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
      menuList: ["产品介绍", "核心亮点", "行业痛点", "解决方案", "服务保障"],
      curMenuIdx: 0,
      highlightList: [
        {
          title: "小程序+ H5 皆可开播",
          desc: "稳定直播成交一步到位",
          iconDesc: "小程序/H5开播",
        },
        {
          title: "完美契合使用习惯",
          desc: "一键开播轻松易上手",
          iconDesc: "使用习惯",
        },
        {
          title: "商家自有私域流量",
          desc: "直播数据加密更安全",
          iconDesc: "私域流量",
        },
        {
          title: "技术实现超低延迟",
          desc: "弱网直播观看双稳定",
          iconDesc: "超低延迟",
        },
        {
          title: "智能互动氛围拉满",
          desc: "直播马甲助手轻松用",
          iconDesc: "智能互动",
        },
        {
          title: "全面支持海外直播",
          desc: "海外环境能播也能看",
          iconDesc: "海外直播",
        },
        {
          title: "实时判断网络环境",
          desc: "智能调节直播端码率",
          iconDesc: "网络环境",
        },
      ],
      curHighlightIndex: 0,
      pointList: [
        {
          title: "平台玩法很局限",
          desc: [
            "常规直播平台运营模式成",
            "本高，缺乏实用的营销工",
            "具，客户转化能以实现",
          ],
        },
        {
          title: "传统营销不适用",
          desc: [
            "图片、文字沟通与传播信息",
            "有限，缺乏实时互动性，难",
            "以建立好的信任度和忠诚度",
          ],
        },
        {
          title: "直播运营成本高",
          desc: [
            "直播间运营、助手、售后",
            "团队成本大，缺乏有效工",
            "具替代人力，帮助商家降",
            "本增效",
          ],
        },
        {
          title: "抓新用户难度大",
          desc: [
            "面向群体特殊，纯付费投",
            "放成本与客户质量难预",
            "估，很难发挥出客户推客",
            "户的效果",
          ],
        },
      ],
      programmeList: [
        {
          title: "引流获客",
          desc: "营销玩法刺激顾客一键转发，快速裂变",
          detailList: ["邀请榜单", "滚动广告", "现金红包"],
        },
        {
          title: "直播互动",
          desc: "强大互动实现直播火热氛围，方便好用",
          detailList: ["助手评论", "直播人气", "直播连麦"],
        },
        {
          title: "用户管理",
          desc: "高效快捷管理直播间用户，极致控场",
          detailList: ["用户白名单", "禁言用户", "拉黑用户"],
        },
        {
          title: "直播运营",
          desc: "掌握用户实时在线情况，轻松了解数据变化",
          detailList: ["在线人数", "用户标签", "数据统计"],
        },
      ],
      curProgrammeIdx: 0,
      menuPopupVisible: false,
    };
  },

  mounted() {
    window.addEventListener("scroll", this.scroll);
    this.$nextTick(() => {
      this.parent = window || document.documentElement || document.body;
      this.containerScrollHeight = this.$refs.container.scrollHeight;
      this.headerHeight = this.$refs.header.getBoundingClientRect().height;
      this.highlightTop =
        this.$refs.highlight.getBoundingClientRect().top + this.headerHeight - 30;
      this.pointTop =
        this.$refs.point.getBoundingClientRect().top + this.headerHeight - 30;
      this.programmeTop =
        this.$refs.programme.getBoundingClientRect().top + this.headerHeight - 30;
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

    selectHighlight(index) {
      this.curHighlightIndex = index;
    },

    scroll() {
      const scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;

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
        scrollTop >= this.pointTop - 32 &&
        scrollTop < this.programmeTop - 32 &&
        this.curMenuIdx !== 2
      ) {
        this.curMenuIdx = 2;
      }
      if (
        scrollTop >= this.programmeTop - 32 &&
        scrollTop < this.programmeTop + this.footerHeight - 40 &&
        this.curMenuIdx !== 3
      ) {
        this.curMenuIdx = 3;
      }
      if (
        scrollTop >= this.programmeTop + this.footerHeight - 200 &&
        this.curMenuIdx !== 4
      ) {
        this.curMenuIdx = 4;
      }
    }, 50),
  },
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
  align-items: flex-end
  justify-content: space-between
  padding: 0 .4rem .18rem
  width: 100vw
  height: 1.76rem
  background: #fff
  z-index: 100
  .logo
    width: 1.54rem
    height: .5rem
  .menu
    width: .5rem
    height: .5rem
.container
  padding-top: 1.76rem
  background: #F7F8FA
  overflow: hidden
  .introduce-wrap
    padding: .3rem
    .introduce
      display: block
      width: 100%
  .highlight-wrap
    position: relative
    margin: 0 0.3rem
    height: 10.96rem
    overflow: hidden
    .highlight-bg
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
    .highlight-title
      display: block
      margin: .3rem auto 0
      width: 4rem
      height: .86rem
    .highlight-menu
      margin-top: .3rem
      flex-wrap: nowrap
      overflow-x: scroll
      .highlight-menu-item
        margin-left: .3rem
        padding: 0 .28rem
        width: fit-content
        height: .74rem
        color: #222
        font-size: .24rem
        font-weight: 500
        white-space: nowrap
        border-radius: .37rem
        background: rgba(255, 255, 255, 0.5)
        &.active
          color: #00BC81
          background: #fff
        &:last-child
          margin-right: .3rem
        .menu-icon
          margin-right: .08rem
          width: .4rem
          height: .4rem
    .highlight
      display: block
      margin: .1rem auto 0
      width: 6.6rem
    .highlight-content
      margin: 0.05rem .3rem 0
      padding: .3rem
      line-height: 1
      background: #fff
      border-radius: .16rem
      .highlight-content-title
        color: #333
        font-size: .28rem
        font-weight: 500
      .highlight-content-desc
        margin-top: .2rem
        color: #4B596B
        font-size: .24rem
  .point-wrap
    margin-top: .3rem
    padding: .3rem
    padding-bottom: 0
    .point-title
      display: block
      margin: 0 auto
      width: 1.36rem
      height: .4rem
    .point-card-wrap
      flex-wrap: wrap
      justify-content: space-between
      margin-top: .3rem
      .point-card
        flex-direction: column
        justify-content: center
        margin-bottom: .3rem
        width: 3.3rem
        height: 3.48rem
        background: #fff
        border-radius: .16rem
        .point-icon
          width: .68rem
          height: .72rem
        .point-card-title
          margin-top: .2rem
          color: #222
          font-size: .28rem
          font-weight: 600
        .point-desc
          margin-top: .2rem
          color: #4B596B
          font-size: .24rem
  .programme-wrap
    padding: 0 .3rem
    background: #fff
    overflow: hidden
    .programme-title
      display: block
      margin: .4rem auto 0
      width: 6.48rem
      height: .96rem
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
          background: rgba(227,255,240,0.15)
          border: 1px solid #00CB5F
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
        .programme-detail-wrap
          margin-top: .32rem
          .programme-detail
            color: #4B596B
            font-size: .24rem
            .programme-detail-icon
              margin-right: .08rem
              width: .32rem
              height: .32rem
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
          background: #20B364
      .service-info
        margin-top: .3rem
        padding: 0 .52rem
        width: 100%
        color: #8E8F9B
        font-size: .24rem
      .footer-desc
        margin-top: .3rem
        color: #fff
        font-size: .24rem
      .contact-info
        margin-top: .3rem
        color: #fff
        font-size: .24rem
        .tel-icon
          margin-right: .08rem
          width: .32rem
          height: .32rem
        .call-btn
          margin-left: .26rem
          width: 1.36rem
          height: .46rem
          color: #fff
          font-size: .24rem
          background: linear-gradient(90deg, #00D573 0%, #00CA5C 100%)
          border-radius: .28rem
      .qrcode-wrap
        margin-top: .36rem
        .qrcode
          margin-right: .34rem
          font-size: 0
          text-align: center
          &:last-child
            margin-right: 0
          .qrcode-img
            width: 2rem
            height: 2rem
            background: #fff
            border-radius: .16rem
          .qrcode-desc
            margin-top: .16rem
            color: #8E8F9B
            font-size: .24rem
.menu-draw
  padding: .6rem .3rem
  width: 60vw
  height: 100vh
  background: #fff
  .menu-item
    height: 1rem
    color: #999
    font-size: .32rem
    &.active
      color: #20B364
      font-weight: 500
    .arrow
      width: .3rem
      height: .3rem
</style>
