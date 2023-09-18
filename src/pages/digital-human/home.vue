<template>
  <div class="container">
    <img
      :src="require(`./images/home/bg_${curMenuIdx}.png`)"
      alt=""
      class="bg"
    />

    <div class="menu-tabs">
      <div
        class="menu-item"
        :class="{ active: curMenuIdx === index }"
        v-for="(item, index) in menuList"
        :key="index"
        @click="curMenuIdx = index"
      >
        {{ item }}
      </div>
    </div>

    <img
      :src="require(`./images/home/slogan_${curMenuIdx}.png`)"
      alt=""
      class="slogan"
    />
    <div class="title-wrap">
      <img
        :src="require(`./images/home/title_bg_${curMenuIdx}.png`)"
        alt=""
        class="title-bg"
      />
      <div class="title" :class="{ voice: curMenuIdx === 1 }">
        {{ curMenuIdx === 0 ? "制作数字人" : "数字人声音克隆" }}
      </div>
      <div class="activity-tag" v-if="curMenuIdx === 0">限时特惠</div>
    </div>

    <div class="content" v-if="curMenuIdx === 0">
      <img @click="navToRecord" src="./images/home/module_1.png" alt="" class="functional-module" />
      <img @click="navToUpload" src="./images/home/module_2.png" alt="" class="functional-module" />

      <div class="list-wrap">
        <div class="list-header">
          <div class="list-header-title">录制视频草稿</div>
          <div class="store-space">
            <div class="store-desc">
              储存空间 <span style="color: #66A9FC;">1G</span>/2G
            </div>
            <div class="store-strip">
              <div class="store-strip-inner" style="width: 50%"></div>
            </div>
          </div>
        </div>
        <div class="video-list">
          <div class="video-item">
            <img src="./images/temp/video-1.jpg" alt="" class="cover" />
          </div>
          <div class="video-item">
            <img src="./images/temp/video-2.jpg" alt="" class="cover" />
          </div>
        </div>
      </div>
    </div>

    <div class="content" v-if="curMenuIdx === 1">
      <img src="./images/home/module_4.png" alt="" class="functional-module" />
      <img src="./images/home/module_3.png" alt="" class="functional-module" />

      <div class="list-wrap">
        <div class="list-header">
          <div class="list-header-title">录制视频草稿</div>
          <div class="store-space">
            <div class="store-desc">
              储存空间 <span style="color: #66A9FC;">1G</span>/2G
            </div>
            <div class="store-strip">
              <div class="store-strip-inner" style="width: 50%"></div>
            </div>
          </div>
        </div>
        <div class="voice-list">
          <div class="voice-item">
            <img src="./images/temp/avatar-1.jpg" alt="" class="avatar" />
            <div class="name">白执法</div>
            <div class="identity">元气少女</div>
            <img src="./images/voice-wave.png" alt="" class="voice-wave" />
            <div class="date">06-20 06:33</div>
          </div>
          <div class="voice-item">
            <img src="./images/temp/avatar-2.jpg" alt="" class="avatar" />
            <div class="name">露脸可</div>
            <div class="identity">元气少女</div>
            <img src="./images/voice-wave.png" alt="" class="voice-wave" />
            <div class="date">06-20 06:33</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menuList: ["形象", "声音"],
      curMenuIdx: 0,
    };
  },

  methods: {
    navToRecord() {
      this.$router.push('/digital_human/recording_notes')
    },

    navToUpload() {
      this.$router.push('/digital_human/upload_notes')
    }
  }
};
</script>

<style lang="stylus" scoped>
.container
  .bg
    position: fixed
    top: 0
    left: 0
    width: 100vw
    height: 100vh
    z-index -1
  .menu-tabs
    position: fixed
    top: .6rem
    left: 50%
    transform: translateX(-50%)
    display: flex
    padding: .06rem
    width: 3.7rem
    height: .7rem
    border-radius: .35rem
    background: #fff
    z-index 100
    .menu-item
      display: flex
      align-items: center
      justify-content: center
      flex: 1
      height: .6rem
      color: #333
      font-size: .28rem
      font-weight: 500
      border-radius: .3rem
      &.active
        color: #fff
        background: #2C2C30
  .slogan
    width: 100%
    height: 4.44rem
  .title-wrap
    position: relative
    display: flex
    align-items: center
    justify-content: space-between
    padding-left: .6rem
    padding-right: .4rem
    height: 1.26rem
    background: #fff
    border-radius: .4rem .4rem 0 0
    .title-bg
      position: absolute
      left: .4rem
      top: .3rem
      width: .62rem
      height: .36rem
    .title
      color: #070F8F
      font-size: .36rem
      font-weight: 500
      &.voice
        color: #720C0C
    .activity-tag
      display: flex
      align-items: center
      justify-content: center
      width: 1.4rem
      height: .48rem
      color: #070F8F
      font-size: .24rem
      background: linear-gradient(135deg, #FDABE4 0%, #A4DCFD 100%)
      border-radius: .24rem
  .content
    font-size: 0
    padding: 0 .3rem 1.6rem
    .functional-module
      display: block
      margin-top: .2rem
      width: 100%
    .list-wrap
      margin-top: .5rem
      padding: .3rem
      background: #fff
      border-radius: .16rem
      .list-header
        display: flex
        align-items: center
        justify-content: space-between
        .list-header-title
          color: #333
          font-size: .32rem
          font-weight: 600
        .store-space
          display: flex
          flex-direction: column
          align-items: center
          .store-desc
            color: #666
            font-size: .24rem
          .store-strip
            position: relative
            width: 1.8rem
            height: .08rem
            border-radius: .04rem
            background: #EFEFEF
            .store-strip-inner
              position: absolute
              top: 0
              left: 0
              height: .08rem
              border-radius: .04rem
              background: #66A9FC
      .video-list
        display: flex
        justify-content: space-between
        flex-wrap: wrap
        .video-item
          margin-top: .3rem
          width: 3.06rem
          height: 3.78rem
          font-size: 0
          border-radius: .16rem
          .cover
            width: 100%
            height: 100%
      .voice-list
        display: flex
        justify-content: space-between
        flex-wrap: wrap
        .voice-item
          position: relative
          display: flex
          flex-direction: column
          align-items: center
          justify-content: center
          margin-top: .3rem
          width: 3.06rem
          height: 3.24rem
          background: #F5F7FC
          border-radius: .16rem
          .avatar
            width: .84rem
            height: .84rem
            border-radius: 50%
          .name
            margin-top: .1rem
            color: #575B66
            font-size: .24rem
          .identity
            margin-top: .06rem
            color: #999
            font-size: .24rem
          .voice-wave
            margin-top: .1rem
            width: 1.4rem
            height: .34rem
          .date
            position: absolute
            left: .16rem
            bottom: .16rem
            color: #999
            font-size: .24rem
</style>
