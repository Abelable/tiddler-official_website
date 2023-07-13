<template>
  <div class="container">
    <img class="bg" src="../images/bg.png" alt="" />

    <div class="main">
      <div class="chat-content-wrap">
        <div class="time">昨天 13:22:35</div>
        <div class="chat-msg user">
          <div class="user-info row">
            <div class="name">用户张女士</div>
            <!-- <img class="avatar" src="../images/default-avatar.png" alt=""> -->
          </div>
          <div class="chat-msg-content">请介绍市面上最火的三款吹风机，谢谢！</div>
        </div>
        <div class="chat-msg">
          <div class="user-info row">
            <!-- <img class="avatar" src="../images/youai-avatar.png" alt=""> -->
            <div class="name">数字人小张</div>
          </div>
          <div class="chat-msg-content">
            您好，这是YouAi。根据网上的信息，市面上最火的三款吹风机可能是以下这些：<br/>
            <br/>
            1、松下吹风机：具有智能温控、冷热风循环、头皮模式等功能，适合追求护发效果的用户。<br/>
            <br/>
            2、小米吹风机：具有负离子护发、磁吸式喷嘴、无刷电机等特点，适合追求性价比的用户。<br/>
            <br/>
            3、戴森吹风机：具有高速气流、智能温控、多种配件等优势，适合追求高端体验的用户。
            <div class="more row between">
              <div class="reply-btn row">
                <img class="icon" src="../images/refresh-blue.png" alt="">
                <div>重新回答</div>
              </div>
              <div class="row">
                <img class="more-btn" src="../images/play.png" alt="">
                <img class="more-btn" src="../images/copy.png" alt="">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="bottom-bar">
      <div class="row">
        <div class="input-wrap row">
          <input class="input" v-model="content" type="text" placeholder="在此处输入内容">
        </div>
        <div class="send-btn row center">发送</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      content: "",
    };
  },
};
</script>

<style lang="stylus" scoped>
.row
  display: flex
  align-items: center
  &.center
    justify-content: center
  &.between
    justify-content: space-between
.container
  position: relative
  .bg
    position: fixed
    top: 0
    left: 0
    width: 100vw
  .main
    padding: .3rem .3rem 2.3rem
    .chat-content-wrap
      margin-top: .3rem
      .time
        margin-top: .3rem
        color: #999
        font-size: .22rem
        text-align: center
      .chat-msg
        margin-top: .3rem
        &.user
          display: flex
          flex-direction: column
          align-items: flex-end
          .chat-msg-content
            color: #fff
            background: #0866F4
        .user-info
          .avatar
            width: .6rem
            height: .6rem
          .name
            margin: 0 .2rem
            color: #999
            font-size: .22rem
        .chat-msg-content
          margin-top: .2rem
          padding: .24rem
          width: fit-content
          max-width: 6.4rem
          color: #333
          font-size: .24rem
          background: #fff
          border-radius: .08rem
          .more
            margin-top: .24rem
            padding-top: .24rem
            border-top: 1px solid #E5E5E5
            .reply-btn
              color: #0866F4
              font-size: .22rem
              .icon
                width: .32rem
                height: .32rem
            .more-btn
              margin-left: .3rem
              width: .32rem
              height: .32rem
  .bottom-bar
    position: fixed
    left: 0
    bottom 0
    padding: .3rem .24rem .8rem
    width: 100%
    background: #fff
    .input-wrap
      padding: 0 .3rem
      flex: 1
      height: .86rem
      border-radius: .43rem
      border: 1px solid #DAE1EB
      background: #F5F6FC
      .input
        flex: 1
        font-size: .26rem
        height: .86rem
      .mike-icon
        margin-left: .3rem
        width: .44rem
        height: .44rem
    .send-btn
      margin-left: .24rem
      width 1.54rem
      height: .86rem
      color: #fff
      font-size: .28rem
      font-weight: 500
      border-radius: .43rem
      background: linear-gradient(180deg, #1399FA 0%, #085DF4 100%)
    .tips
      margin-top: .2rem
      color: #9499C2
      font-size: .22rem
      text-align: center
</style>
