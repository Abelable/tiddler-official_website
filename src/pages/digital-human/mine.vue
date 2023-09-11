<template>
  <div>
    <img
      src="./images/home/bg_0.png"
      alt=""
      class="bg"
    />

    <div class="header">
      <div class="user-info">
        <img src="./images/temp/avatar-1.jpg" alt="" class="avatar">
        <div class="nickname">昵称</div>
      </div>

      <div class="equity-wrap">
        <div class="date-wrap">
          <div class="valid-date">有效期至2023-05-23</div>
          <img src="./images/mine/recharge.png" alt="" class="recharge-btn">
        </div>
        <div class="equity-list">
          <div class="equity">形象定制权益 <span class="equity-num">1/2</span> 个</div>
          <div class="equity">声音定制权益 <span class="equity-num">0/2</span> 个</div>
        </div>
      </div>
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
  z-index -1

.header
  padding: .3rem
  .user-info
    display: flex
    align-items: center
    margin-top: .3rem
    .avatar
      width: 1.2rem
      height: 1.2rem
      border-radius: 50%
    .nickname
      margin-left: .2rem
      color: #181C63
      font-size: .36rem
      font-weight: 500
  .equity-wrap
    margin-top: .3rem
    padding: .3rem
    height: 1.86rem
    background-image: url('./images/mine/bg.png')
    background-repeat: no-repeat
    background-size: 100%
    .date-wrap
      display: flex
      justify-content: space-between
      .valid-date
        margin-left: .42rem
        color: #214765
        font-size: .32rem
        font-weight: 600
        line-height: 1
      .recharge-btn
        width: .82rem
        height: .34rem
    .equity-list
      display: flex
      justify-content: space-between
      margin-top: .48rem
      padding: 0 .32rem
      .equity
        color: #666
        font-size: .24rem
        .equity-num
          color: #333
          font-weight: 500
</style>