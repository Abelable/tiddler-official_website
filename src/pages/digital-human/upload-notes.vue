<template>
  <div class="container">
    <img src="./images/home/bg_0.png" alt="" class="bg" />
    <img src="./images/back.png" alt="" class="back-icon" />

    <img src="./images/upload-notes/bg.png" alt="" class="header" />

    <div class="title-wrap">
      <img src="./images/home/title_bg_0.png" alt="" class="title-bg" />
      <div class="title">视频上传注意事项</div>
    </div>

    <div class="content">
      <img src="./images/upload-notes/note_1.png" alt="" class="note" />
      <img src="./images/upload-notes/note_2.png" alt="" class="note" />
      <img src="./images/upload-notes/note_3.png" alt="" class="note" />
      <img src="./images/upload-notes/note_4.png" alt="" class="note" />
    </div>

    <div class="start-btn">下一步</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
    };
  },
};
</script>

<style lang="stylus" scoped>
.container
  padding-bottom: .8rem
  font-size: 0
  .bg
    position: fixed
    top: 0
    left: 0
    width: 100vw
    height: 100vh
    z-index: -1
  .back-icon
    position: fixed
    top: .6rem
    left: .48rem
    width: .36rem
    height: .36rem
    z-index: 100
  .header
    width: 100%
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
  .content
    padding: .3rem
    padding-bottom: 0
    font-size: 0
    .note
      margin-bottom: .3rem
      width: 100%
    .deduct-wrap
      padding: .2rem
      background: #fff
      border-radius: .16rem
      .deduct-header
        display: flex
        align-items: center
        height: 1.26rem
        border-bottom: 1px solid #F1F1F1
        .deduct-icon
          width: .62rem
          height: .62rem
        .deduct-title-wrap
          padding-left: .12rem
          flex: 1
          .deduct-title
            color: #333
            font-size: .32rem
            font-weight: 600
          .deduct-tips
            margin-top: .08rem
            color: #666
            font-size: .24rem
      .deduct-content-wrap
        .menu-tabs
          display: flex
          justify-content: space-between
          padding: .28rem .9rem .2rem
          .menu-tab
            display: flex
            align-items: center
            justify-content: center
            width: 1.68rem
            height: .54rem
            color: #999
            font-size: .24rem
            border-radius: .27rem
            border: 1px solid #999
            &.active
              color: #333
              border: 1px solid #333
        .deduct-content
          color: #666
          font-size: .24rem
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
    color: #fff
    font-size: .32rem
    font-weight: 600
    background: linear-gradient(90deg, #7DDFDF 0%, #99ABFF 100%)
    border-radius: .54rem
</style>
