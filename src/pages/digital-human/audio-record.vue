<template>
  <div class="container">
    <img src="./images/icons/back_w.png" class="back" @click="goBack" />
    <div class="header">
      声音克隆
      <span class="right">
        录制完成
      </span>
    </div>
    <div class="notice">
      <img src="./images/icons/notice.png" class="icon" />
      <span>请暂时关闭其他应用，保持手机流畅录制</span>
    </div>
    <div class="btns">
      <div class="left">
        <img src="./images/icons/refresh.png" class="icon" />
        <span>换一换</span>
      </div>
      <div class="right">
        <span>拼音</span>
        <div class="switch" :class="{'switch_on':switchValue}" @click="switchValue = !switchValue">
          <div class="switch_bar"></div>
        </div>
      </div>
    </div>
    <div class="textarea">
      我做自媒体已经差不多有一年的时间了，今天来和大家分享一下。 自从我做自媒体训练语言表达之后呢，有很多的朋友一直想了解具体是怎么做的… 我做自媒体已经差不多有一年的时间了，今天来和大家分享一下。 自从我做自媒体训练语言表达之后呢，有很多的朋友一直想了解具体是怎么做的…自从我做自媒体训练语言表达之后呢，有很多的朋友一直想了解具体是怎么做的…自从我做自媒体训练语言表达之后呢，有很多的朋友一直想了解具体是怎么做的…
    </div>
    <div class="bottom_fix">
      <div class="recording_box" v-show="isRecord">
        <div class="gifs">
          <div class="gif gif1"><span></span></div>
          <div class="gif gif2"><span></span></div>
          <div class="gif gif3"><span></span></div>
          <div class="gif gif4"><span></span></div>
          <div class="gif gif5"><span></span></div>
          <div class="gif gif6"><span></span></div>
          <div class="gif gif7"><span></span></div>
          <div class="gif gif8"><span></span></div>
          <div class="gif gif9"><span></span></div>
          <div class="gif gif10"><span></span></div>
          <div class="gif gif12"><span></span></div>
          <div class="gif gif13"><span></span></div>
          <div class="gif gif14"><span></span></div>
          <div class="gif gif8"><span></span></div>
          <div class="gif gif9"><span></span></div>
          <div class="gif gif10"><span></span></div>
          <div class="gif gif3"><span></span></div>
          <div class="gif gif4"><span></span></div>
        </div>
        <div class="txt">00:33</div>
      </div>
      <img v-if="isRecord" src="./images/icons/audio_record_2.png" class="icon" @click="isRecord = false" />
      <img v-else src="./images/icons/audio_record_1.png" class="icon" @click="isRecord = true" />
      <div class="p">{{isRecord?'完成':'开始'}}</div>
    </div>
  </div>
</template>

<script>
export default {
  components: { },
  data() {
    return {
      switchValue:true,
      isRecord:false
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
  .header{padding-top:.55rem;font-size:.36rem;font-weight:bold;text-align:center;height:.88rem;color:#fff;box-sizing: content-box;line-height:.88rem;position:relative;
    .right{position:absolute;right:.1rem;bottom:-.02rem;padding:0 .2rem;color:#fff;font-size:.28rem;font-weight:normal;}
  }
  .container{
    width:100%;
    min-height:100vh;
    background:#333;
    .notice{margin:.22rem;color:#9A9B9F;font-size:.24rem;text-align:center;
      img{width:.32rem;height:.32rem;margin-right:.02rem;}
      *{display:inline-block;vertical-align: middle;}
    }
    .btns{padding:0 .2rem;overflow:hidden;
      .left{float:left;font-size:.28rem;color:#9A9B9F;font-weight:bold;padding:.2rem;
        .icon{width:.32rem;height:.32rem;margin-right:.04rem;}
        *{display:inline-block;vertical-align: middle;}
      }
      .right{float:right;font-size:.28rem;color:#fff;font-weight:bold;padding:.2rem;
        span,.switch{display:inline-block;vertical-align: middle;}
        .switch{width:.64rem;height:.34rem;border-radius:.2rem;background:#656565;position:relative;margin-left:.1rem;
          .switch_bar{position:absolute;width:.3rem;height:.3rem;border-radius:100%;left:.02rem;top:.02rem;background:#fff;transition:all .3s;}
        }
        .switch_on .switch_bar{left:.32rem;}
      }
    }
    .textarea{margin:0 .4rem .4rem .4rem;background:#444;border-radius:.2rem;padding:.24rem;color:#9A9B9F;font-size:.32rem;overflow:auto;max-height:3.8rem;}
  }
  .bottom_fix{position:fixed;z-index:5;left:0;bottom:0;width:100%;padding-bottom:1rem;text-align:center;font-size: initial;
    .recording_box{border-radius:.2rem;background:#444;margin:.2rem .4rem .36rem .4rem;padding:.56rem;
      .txt{text-align:center;color:#fff;font-size:.28rem;}
      .gifs{text-align:center;height:1.16rem;margin-bottom:.26rem;display:flex;align-items: center;justify-content: center;
        .gif{width:.14rem;height:100%;margin:0 .07rem;display:flex;align-items: center;justify-content: center;
          span{border-radius:.1rem;width:100%;height:20%;background:#49DAF1;}
        }
        .gif1 span{animation:audioAnim 2s infinite .3s,audioBgAnim 8s infinite 3s;}
        .gif2 span{animation:audioAnim 2s infinite .5s,audioBgAnim 8s infinite 4s;}
        .gif3 span{animation:audioAnim 2s infinite .7s,audioBgAnim 8s infinite 2s;}
        .gif4 span{animation:audioAnim 2s infinite .9s,audioBgAnim 8s infinite 2s;}
        .gif5 span{animation:audioAnim 2s infinite 1.1s,audioBgAnim 8s infinite 5s;}
        .gif6 span{animation:audioAnim 2s infinite 1.3s,audioBgAnim 8s infinite 2s;}
        .gif7 span{animation:audioAnim 2s infinite 1.1s,audioBgAnim 8s infinite 1s;}
        .gif8 span{animation:audioAnim 2s infinite .9s,audioBgAnim 8s infinite 3s;}
        .gif9 span{animation:audioAnim 2s infinite .7s,audioBgAnim 8s infinite 2s;}
        .gif10 span{animation:audioAnim 2s infinite .5s,audioBgAnim 8s infinite 5s;}
        .gif11 span{animation:audioAnim 2s infinite .7s,audioBgAnim 8s infinite 4s;}
        .gif12 span{animation:audioAnim 2s infinite .9s,audioBgAnim 8s infinite 2s;}
        .gif13 span{animation:audioAnim 2s infinite 1.1s,audioBgAnim 8s infinite 6s;}
        .gif14 span{animation:audioAnim 2s infinite 1.3s,audioBgAnim 8s infinite 2s;}
      }
    }
    .icon{width:1.2rem;height:1.2rem;}
    .p{color:#fff;font-size:.32rem;font-weight:bold;margin-top:.16rem;}
  }



@keyframes audioAnim
{
  0% {height:20%;}
  50% {height:100%;}
  100% {height:20%;}
}
@keyframes audioBgAnim
{
  0% {background:#46DFF3;}
  20% {background:#F130FF;}
  40% {background:#49DAF1;}
  60% {background:#B784FC;}
  80% {background:#F32BFF;}
  100% {background:#46DFF3;}
}

</style>