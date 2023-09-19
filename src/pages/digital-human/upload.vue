<template>
  <div>
    <img src="./images/home/bg_0.png" alt="" class="bg" />
    <div class="nav-bar">
      <img src="./images/home/bg_0.png" alt="" class="nav-bar-bg" />
      <img @click="back" src="./images/back.png" alt="" class="back-icon" />
      <div class="nav-bar-title">上传视频</div>
      <img style="opacity: 0;" src="./images/back.png" alt="" class="back-icon" />
    </div>

    <div class="container">
      <div class="title-wrap">
        <img src="./images/home/title_bg_0.png" alt="" class="title-bg" />
        <div class="title">上传训练视频</div>
      </div>
      <div class="video-uploader-wrap">
        <div class="video-uploader">
          <img src="./images/upload/video.png" alt="" class="uploader-icon">
          <div class="uploader-tips">
            <p>音频时长需在2-5分钟，分辨率需1080P-4K</p>
            <p>文件格式为MP3/MOV/WEBM，大小需在3G以内</p>
          </div>
          <div class="uploader-btn">
            <img src="./images/upload/upload.png" alt="" class="uploader-btn-icon">
            <div>上传视频</div>
          </div>
        </div>
      </div>

      <div class="title-wrap">
        <img src="./images/home/title_bg_0.png" alt="" class="title-bg" />
        <div class="title">形象授权视频</div>
        <div class="more">
          <div>选择已录制视频</div>
          <img src="./images/upload/more.png" alt="" class="more-icon">
        </div>
      </div>
      <div class="recorder-wrap">
        <div class="recorder-tips">
          <img src="./images/upload/tips.png" alt="" class="tips-icon">
          <div>
            <p>请确保由本人录制授权视频，如授权形象与上传形象不</p>
            <p>一致，将导致训练失败。</p>
          </div>
        </div>
        <div class="record-btn" @click="navToRecord">录制视频</div>
        <!-- <div class="recorder">
          <img src="./images/temp/video-2.jpg" alt="" class="recorder-cover">
          <img src="./images/upload/play.png" alt="" class="recorder-icon">
        </div>
        <img src="./images/upload/record.png" alt="" class="recorder-btn"> -->
      </div>

      <div class="agreement" @click="agree = !agree">
        <img
          class="agree-icon"
          :src="
            require(agree
              ? './images/recording-notes/selected.png'
              : './images/recording-notes/unselected.png')
          "
          alt=""
        />
        <p>我已阅读并同意 <span style="color: #3B75FF">《形象定制规则》</span></p>
      </div>

      <div class="start-btn" :class="{ active: agree }">提交</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      opened: true,
      agree: false,
    };
  },

  methods: {
    back() {
      this.$router.back()
    },

    navToRecord() {
      this.$router.push('/digital_human/record')
    }
  }
}
</script>

<style lang="stylus" scoped>
.bg
  position: fixed
  top: 0
  left: 0
  width: 100vw
  height: 100vh
  z-index: -1
.nav-bar
  position: fixed
  top: 0
  left: 0
  padding: 0 .3rem
  width: 100%
  height: 1.2rem
  display: flex
  align-items: center
  overflow: hidden
  z-index: 100
  .nav-bar-bg
    position: absolute
    top: 0
    left: 0
    width: 100vw
    height: 100vh
    z-index: -1
  .back-icon
    width: .36rem
    height: .36rem
  .nav-bar-title
    flex: 1
    color: #333
    font-size: .36rem
    font-weight: 600
    text-align: center
.container
  margin-top: 1.2rem
  padding-bottom: .88rem
  .title-wrap
    position: relative
    display: flex
    align-items: center
    justify-content: space-between
    padding-left: .6rem
    padding-right: .2rem
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
    .more
      display: flex
      align-items: center
      color: #333
      font-size: .28rem
      .more-icon
        width: .32rem
        height: .32rem
  .video-uploader-wrap
    margin: .3rem
    padding: .3rem
    background: #fff
    border-radius: .08rem
    .video-uploader
      display: flex
      flex-direction: column
      align-items: center
      padding: .3rem
      background: #FAFAFA
      border-radius: .2rem
      .uploader-icon
        width: 1rem
        height: 1rem
      .uploader-tips
        margin-top: .3rem
        color: #999
        font-size: .24rem
      .uploader-btn
        display: flex
        align-items: center
        justify-content: center
        margin-top: .3rem
        width: 2.28rem
        height: .6rem
        color: #fff
        font-size: .28rem
        border-radius: .3rem
        background: linear-gradient(90deg, #7DDFDF 0%, #99ABFF 100%)
        .uploader-btn-icon
          margin-right: .06rem
          width: .32rem
          height: .32rem
  .recorder-wrap
    display: flex
    flex-direction: column
    align-items: center
    margin: .3rem
    padding: .3rem
    border-radius: .08rem
    background: #fff
    .recorder-tips
      display: flex
      color: #71B4EF
      font-size: .24rem
      .tips-icon
        width: .32rem
        height: .32rem
    .record-btn
      display: flex
      align-items: center
      justify-content: center
      margin-top: .3rem
      width: 2.28rem
      height: .6rem
      color: #fff
      font-size: .28rem
      border-radius: .3rem
      background: linear-gradient(90deg, #7DDFDF 0%, #99ABFF 100%)
    .recorder
      position: relative
      margin-top: .2rem
      width: 2.96rem
      height: 3.9rem
      font-size: 0
      .recorder-cover
        width: 100%
        height: 100%
      .recorder-icon
        position: absolute
        top: 50%
        left: 50%
        transform: translate(-50%, -50%)
        width: .64rem
        height: .64rem 
    .recorder-btn
      margin-top: .2rem
      width: 2.28rem
      height: .8rem
  .agreement
    display: flex
    align-items: center
    justify-content: center
    margin-top: .4rem
    color: #333
    font-size: .24rem
    .agree-icon
      margin-right: .08rem
      width: .26rem
      height: .26rem
  .start-btn
    display: flex
    align-items: center
    justify-content: center
    margin: .2rem auto 0
    width: 6rem
    height: 1.08rem
    color: #999
    font-size: .32rem
    font-weight: 600
    background: #ddd
    border-radius: .54rem
    &.active
      color: #fff
      background: linear-gradient(90deg, #7DDFDF 0%, #99ABFF 100%)
</style>