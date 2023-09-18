<template>
  <div>
    <img src="./images/home/bg_0.png" alt="" class="bg" />
    <div class="nav-bar">
      <img src="./images/home/bg_0.png" alt="" class="nav-bar-bg" />
      <img src="./images/back.png" alt="" class="back-icon" />
      <div class="nav-bar-title">录制完成</div>
      <img
        style="opacity: 0;"
        src="./images/back.png"
        alt=""
        class="back-icon"
      />
    </div>
    <div class="content">
      <div class="finish-title">您的视频已经录制完成，正在检测中</div>
      <div class="finish-desc">
        预计完成时间需要
        <span style="color: #99ACFF;">0.5</span>
        小时，通过后自动开始制作形象哦～
      </div>
      <div class="finish-illus">
        <img src="./images/finish/bg.png" alt="" class="illus-bg">
        <div class="finish-status">
          <img src="./images/finish/loading.png" alt="" class="loading">
          <div class="status-desc">正在检测</div>
        </div>
      </div>
      <div class="voice-tips">
        <img src="./images/finish/mike.png" alt="" class="mike-icon">
        <div>为您的专属形象定制声音</div>
      </div>
      <div class="warning-tips">检测过程中，您可以退出本页面，不影响检测</div>
    </div>
  </div>
</template>

<script>
export default {};
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
.content
  margin-top: 1.2rem
  padding: .5rem .3rem 0
  height: calc(100vh - 1.2rem)
  background: #fff
  border-radius: .2rem .2rem 0 0
  .finish-title
    color: #000
    font-size: .32rem
    font-weight: 600
    text-align: center
  .finish-desc
    margin-top: .3rem
    color: #999
    font-size: .24rem
    text-align: center
  .finish-illus
    position: relative
    margin-top: .4rem
    width: 100%
    height: 6.2rem
    .illus-bg
      width: 100%
      height: 100%
    .finish-status
      position: absolute
      left: 0
      bottom: .32rem
      width: 100%
      display: flex
      flex-direction: column
      align-items: center
      .loading
        width: .54rem
        height: .54rem
        animation: loading 1s linear infinite
      .status-desc
        margin-top: .14rem
        color: #333
        font-size: .32rem
        font-weight: 600
  .voice-tips
    display: flex
    align-items: center
    justify-content: center
    margin-top: .3rem
    color: #3B75FF
    font-size: .24rem
    .mike-icon
      width: .32rem
      height: .32rem
  .warning-tips
    margin-top: .4rem
    color: #999
    font-size: .24rem
    text-align: center
@keyframes loading
  0%
    transform: rotate(0deg)
  100%
    transform: rotate(360deg)
</style>
