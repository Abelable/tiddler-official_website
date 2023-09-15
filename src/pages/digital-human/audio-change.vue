<template>
  <div class="container">
    <img src="./images/icons/back.png" class="back" @click="goBack" />
    <div class="header">
      更改声音
    </div>
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
    <div class="scroll-view">
      <div class="items">
        <div class="item item_cur">
          <div class="mine">我的</div>
          <div class="img">
            <img src="./images/icons/success.png" class="avatar" />
            <img src="./images/icons/play.png" class="play" />
          </div>
          <div class="p1">暴枫朋</div>
          <div class="p2">中文-普通话</div>
          <div class="btn">正在使用</div>
        </div>
        <div class="item ">
          <div class="img">
            <img src="./images/icons/success.png" class="avatar" />
            <img src="./images/icons/play.png" class="play" />
          </div>
          <div class="p1">暴枫朋</div>
          <div class="p2">中文-普通话</div>
          <div class="btn">使用</div>
        </div>
        <div class="item ">
          <div class="img">
            <img src="./images/icons/success.png" class="avatar" />
            <img src="./images/icons/play.png" class="play" />
          </div>
          <div class="p1">暴枫朋</div>
          <div class="p2">中文-普通话</div>
          <div class="btn">使用</div>
        </div>
        <div class="item ">
          <div class="img">
            <img src="./images/icons/success.png" class="avatar" />
            <img src="./images/icons/play.png" class="play" />
          </div>
          <div class="p1">暴枫朋</div>
          <div class="p2">中文-普通话</div>
          <div class="btn">使用</div>
        </div>
        
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menuList: ["定制", "官方"],
      curMenuIdx: 0,
    };
  },
  created(){

  },
  methods:{
    goBack(){
      this.$router.go(-1)
    },
  }
};
</script>

<style lang="stylus" scoped>
  .back{position:fixed;width:.36rem;height:.36rem;padding:.2rem;left:.2rem;top:.6rem;z-index:5;box-sizing: content-box;}
  .header{padding-top:.55rem;font-size:.36rem;font-weight:bold;text-align:center;height:.88rem;color:#333;box-sizing: content-box;line-height:.88rem;position:fixed;z-index:5px;width:100%;}
  .container{
    width:100%;
    min-height:100vh;
    background:url(./images/icons/bg_blue.png) no-repeat center top;
    background-size:cover;
    .scroll-view{position:absolute;left:0;top:2.3rem;bottom:0;background:#fff;right:0;overflow:auto;
      .items{padding:.3rem 0 .3rem .3rem;overflow:hidden;
        .item{width:2.18rem;height:2.8rem;background:#F5F7FC;border-radius:.16rem;float:left;margin-right:.18rem;margin-bottom:.18rem;text-align:center;font-size:0;position:relative;
          .mine{position:absolute;left:0;top:0;padding:.04rem .1rem;color:#070F8F;border-radius:.16rem 0 .16rem 0;background-image: linear-gradient(to right, #FDABE4, #A4DCFD);font-size:.2rem;}
          .img{display:inline-block;position:relative;width:.8rem;height:.8rem;margin-top:.2rem;
            .avatar{width:100%;height:100%;border-radius:100%;}
            .play{width:.24rem;height:.24rem;position:absolute;right:0;bottom:0;}
          }
          .p1{font-size:.28rem;font-weight:bold;color:#181C63;line-height:.4rem;margin-top:.12rem;white-space:nowrap;overflow: hidden;text-overflow: ellipsis;padding:0 .1rem;}
          .p2{font-size:.24rem;color:#999;line-height:.34rem;margin-top:.12rem;white-space:nowrap;overflow: hidden;text-overflow: ellipsis;padding:0 .1rem;}
          .btn{display:inline-block;width:1.56rem;height:.52rem;line-height:.56rem;color:#fff;background-image: linear-gradient(to right, #7DDFDF, #99ABFF);font-size:.24rem;border-radius:.26rem;margin-top:.12rem;}
        }
        .item_cur{
          border:1px solid transparent;
          background-clip:padding-box,border-box;
          background-origin:padding-box,border-box;
          background-image: linear-gradient(#FFF4FC, #EFF8FF),linear-gradient(#F8AEE6, #A9D9FB);
          .btn{color:#070F8F;background-image:linear-gradient(to right, #FDABE4, #A4DCFD);}
        }
      }
    }
  }
  .menu-tabs
    position: fixed
    top: 1.5rem
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

  
</style>
