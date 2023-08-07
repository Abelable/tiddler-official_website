<template>
  <div class="container">
    <img class="illus" src="./images/status/status_0.png" alt="" />
    <div class="status">等待审核</div>
    <!-- <div class="status-desc">已提交申请，请耐心等待平台人员处理</div> -->
    <!-- <div class="status-desc">
      失败原因：<br>
      1、失败原因1失败原因1失败原因1<br>
      2、失败原因2失败原因2失败原因2<br>
      3、失败原因3失败原因3失败原因3
    </div> -->
    <div class="status-desc">
      恭喜您成功通过申请，赶快提交保证金
    </div>
    <div class="status-desc">
      开启自己的赚钱之旅吧
    </div>
    <button class="confirm-btn">返回</button>
    <div class="tips">
      <p>
        提交保证金即代表同意平台的
        <span style="color: #FFBD64;">《保证金协议》</span>
      </p>
      <p>
        <span style="color: #FFBD64;">《商家入驻协议》</span>
      </p>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="stylus" scoped>
.container
  position: relative
  display: flex
  flex-direction: column
  align-items: center
  padding: 0 .5rem
  height: 100vh
  background: #fff
  .illus
    margin-top: 1rem
    width: 3.6rem
    height: 2.4rem
  .status
    margin-top: 1.44rem
    margin-bottom: .3rem
    color: #333
    font-size: .32rem
    font-weight: 500
  .status-desc
    color: #333
    font-size: .28rem
  .confirm-btn
    margin-top: 4rem
    width: 5.9rem
    height: 1rem
    color: #FFE5BD
    font-size: .32rem
    font-weight: 500
    background: linear-gradient(128deg, #404A5C 0%, #0F131A 100%)
    border-radius: .5rem
  .tips
    margin-top: .3rem
    color: #333
    font-size: .28rem
    text-align: center
</style>
