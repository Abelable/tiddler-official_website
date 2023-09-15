<template>
  <div>
    <div class="nav-bar">
      <img src="./images/home/bg_0.png" alt="" class="nav-bar-bg" />
      <img src="./images/back.png" alt="" class="back-icon" />
      <div class="nav-bar-title">动作库</div>
      <div class="add-btn">添加</div>
    </div>
    <div class="container">
      <div class="action-list">
        <div class="action-item">
          <div class="cover-wrap">
            <img src="./images/temp/video-1.jpg" alt="" class="cover">
            <div class="status success">已入驻</div>
            <img src="./images/video-preview.png" alt="" class="video-icon">
          </div>
          <div class="main-info">
            <div class="name">动作库名称</div>
            <div class="relation">已关联数字人“甜甜”</div>
            <div class="date">添加时间：2023-03-23 13:3</div>
            <div class="delete-btn-wrap">
              <div class="delete-btn">删除动作</div>
            </div>
          </div>
        </div>
        <div class="action-item">
          <div class="cover-wrap">
            <img src="./images/temp/video-1.jpg" alt="" class="cover">
            <div class="status doing">审核中</div>
          </div>
          <div class="main-info">
            <div class="name">动作库名称</div>
            <div class="relation">已关联数字人“甜甜”</div>
            <div class="date">添加时间：2023-03-23 13:3</div>
            <div class="delete-btn-wrap">
              <div class="delete-btn">删除动作</div>
            </div>
          </div>
        </div>
        <div class="action-item">
          <div class="cover-wrap">
            <img src="./images/temp/video-1.jpg" alt="" class="cover">
            <div class="status fail">未入驻</div>
          </div>
          <div class="main-info">
            <div class="name">动作库名称</div>
            <div class="relation">已关联数字人“甜甜”</div>
            <div class="date">添加时间：2023-03-23 13:3</div>
            <div class="delete-btn-wrap">
              <div class="delete-btn">删除动作</div>
            </div>
          </div>
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
    padding-left: .96rem
    flex: 1
    color: #333
    font-size: .36rem
    font-weight: 600
    text-align: center
  .add-btn
    display: flex
    align-items: center
    justify-content: center
    width: 1.32rem
    height: .52rem
    color: #070F8F
    font-size: .28rem
    font-weight: 500
    border-radius: .26rem
    background: linear-gradient(135deg, #FDABE4 0%, #A4DCFD 100%)
.container
  padding: 1.5rem .3rem 0
  min-height: 100vh
  background: #fff
  .action-item
    display: flex
    align-items: center
    margin-bottom: .3rem
    padding: .12rem
    background: #F5F7FC
    border-radius: .2rem
    .cover-wrap
      position: relative
      width: 2.2rem
      height: 2.6rem
      border-radius: .16rem
      overflow: hidden
      .cover
        width: 100%
        height: 100%
      .status
        position: absolute
        top: 0
        left: 0
        display: flex
        align-items: center
        padding: 0 .1rem
        height: .4rem
        font-size: .24rem
        border-bottom-right-radius: .16rem
        &.success
          color: #070F8F
          background: linear-gradient(135deg, #FDABE4 0%, #A4DCFD 100%)
        &.fail
          color: #575B66
          background: #CCCCCC
        &.doing
          color: #fff
          background: #3841CB
      .video-icon
        position: absolute
        top: 50%
        left: 50%
        transform: translate(-50%, -50%)
        width: .52rem
        height: .52rem
    .main-info
      padding-left: .2rem
      padding-right: .06rem
      flex: 1
      .name
        margin-top: .2rem
        color: #333
        font-size: .3rem
        font-weight: 500
      .relation
        margin-top: .16rem
        color: #666
        font-size: .28rem
      .date
        margin-top: .16rem
        color: #999
        font-size: .24rem
      .delete-btn-wrap
        display: flex
        justify-content: flex-end
        margin-top: .28rem
        .delete-btn
          display: flex
          align-items: center
          justify-content: center
          width: 1.56rem
          height: .52rem
          color: #fff
          font-size: .24rem
          border-radius: .26rem
          background: linear-gradient(90deg, #FF99A1 0%, #FA70A5 100%)
</style>
