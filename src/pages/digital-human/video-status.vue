<template>
  <div>
    <img src="./images/home/bg_0.png" alt="" class="bg" />
    <div class="nav-bar">
      <img src="./images/back.png" alt="" class="back-icon" />
      <div class="nav-bar-title">提交成功</div>
      <img style="opacity: 0;" src="./images/back.png" alt="" class="back-icon" />
    </div>
    <div class="status-wrap">
      <img src="./images/video-status/success.png" alt="" class="status-icon">
      <div class="status-title">成功提交入驻</div>
      <div class="status-tips">
        <p>你已上传成功，后台正在审核</p>
        <p>预计审核时间：15分钟</p>
      </div>
      <div class="back-btn">返回</div>
    </div>
  </div>
</template>

<script>
export default {

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
  display: flex
  align-items: center
  padding: 0 .3rem
  height: 1.2rem
  z-index: 100
  .back-icon
    width: .36rem
    height: .36rem
  .nav-bar-title
    flex: 1
    color: #333
    font-size: .36rem
    font-weight: 600
    text-align: center
.status-wrap
  display: flex
  flex-direction: column
  align-items: center
  margin: .3rem
  padding: .8rem 0
  background: #fff
  border-radius: .2rem
  .status-icon
    width: 2rem
    height: 2rem
  .status-title
    margin-top: .3rem
    color: #000
    font-size: .32rem
    font-weight: 600
  .status-tips
    margin-top: .3rem
    color: #999
    font-size: .24rem
    text-align: center
  .back-btn
    display: flex
    align-items: center
    justify-content: center
    margin-top: 2.84rem
    width: 6rem
    height: 1.08rem
    color: #fff
    font-size: .32rem
    font-weight: 600
    border-radius: .54rem
    background: linear-gradient(90deg, #7DDFDF 0%, #99ABFF 100%)
</style>
