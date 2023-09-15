<template>
  <div class="container">
    <img src="./images/icons/back.png" class="back" @click="goBack" />
    <img class="banner" v-if="isUpload" src="./images/icons/recording_notes_audio_01_upload.png" />
    <img class="banner" v-else src="./images/icons/recording_notes_audio_01.png" />
    <div class="title">
      <span class="bg"></span>
      <span class="bg bg1"></span>
      <span class="bg bg2"></span>
      <span class="b">{{isUpload?'音频上传注意事项':'声音克隆注意事项'}}</span>
    </div>
    <div class="imgs">
      <img class="img" src="./images/icons/recording_notes_audio_02.png" />
      <img class="img" src="./images/icons/recording_notes_audio_03.png" />
      <img class="img" src="./images/icons/recording_notes_audio_04.png" />
      <img class="img" src="./images/icons/recording_notes_audio_05.png" />
    </div>
    <div style="height:2rem;"></div>
    <div class="bottom_fix">
      <div class="agree" @click="agree = !agree" v-if="!isUpload">
        <div class="flex">
          <img class="icon" v-if="agree" src="./images/icons/checkbox_on.png" />
          <img class="icon" v-else src="./images/icons/checkbox_off.png" />
          我已阅读并同意
          <span>《声音定制规则》</span>
        </div>
      </div>
      <div class="btn" @click="goNext">下一步</div>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
export default {
  data() {
    return {
      agree:true,
      isUpload:false,
    };
  },
  created(){
    this.isUpload = this.$route.query.upload == 1
  },
  methods:{
    goBack(){
      this.$router.go(-1)
    },
    goNext(){
      if(!this.isUpload && !this.agree){
        Toast('请先阅读并同意《声音定制规则》')
        return false
      }
      if(this.isUpload){
        this.$router.push('/digital_human/audio_upload')
      }else{
        this.$router.push('/digital_human/audio_record')
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
  .back{position:fixed;width:.36rem;height:.36rem;padding:.2rem;left:.2rem;top:.6rem;z-index:5;box-sizing: content-box;}
  .container{
    width:100%;
    min-height:100vh;
    background:url(./images/icons/bg_red.png) no-repeat center top;
    background-size:cover;
    .banner{width:100%;display:block;}
    .title{font-size:.36rem;
      padding:.4rem .6rem;background:#fff;border-radius:.4rem .4rem 0 0;position:relative;
      .bg{position:absolute;left:.4rem;top:.3rem;width:.36rem;height:.36rem;border-radius:100%;background:rgba(255, 235, 221, .3);}
      .bg1{left:.54rem;background:rgba(255, 235, 221, .6);}
      .bg2{left:.68rem;background:rgba(255, 235, 221, 1);}
      .b{color:#720C0C;font-weight: bold;}
    }
    .imgs{
      padding:.3rem .3rem 0 .3rem;
      img{width:100%;margin-bottom:.3rem;display:block;}
    }
  }
  .bottom_fix{position:fixed;z-index:5;left:0;bottom:0;width:100%;padding-bottom:.34rem;
    .agree{
      .flex{
        display:flex;align-items: center;justify-content: center;font-size:.24rem;color:#333;padding:.2rem;margin-bottom:.04rem;
      }
      .icon{width:.26rem;height:.26rem;margin-right:.08rem;}
      span{
        color:#3B75FF;
      }
    }
    .btn{margin:0 .74rem;background-image: linear-gradient(to right, #FD4851, #EF546B);height:1.08rem;border-radius:.54rem;color:#fff;font-weight:bold;font-size:.32rem;display:flex;align-items: center;justify-content: center;}
  }
  
</style>
