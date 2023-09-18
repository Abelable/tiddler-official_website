<template>
  <div class="container">
    <img src="./images/icons/back.png" class="back" @click="goBack" />
    <div class="header">
      上传音频
    </div>
    <div class="title">
      <span class="bg"></span>
      <span class="bg bg1"></span>
      <span class="bg bg2"></span>
      <span class="b">上传训练音频</span>
    </div>
    <div class="box">
      <div class="box_g">
        <img src="./images/icons/audio.png" class="audio"/>
        <div class="p">音频时长需在2-5分钟，文件格式为MP3/WAV等</div>
        <div class="file_name">{{fileName}}</div>
        <div class="btn">
          <Uploader class="uploader" :after-read="uploadPic" max-count="100"></Uploader>
          <img src="./images/icons/upload.png" class="upload"/>
          <span>上传音频</span>
        </div>
        
      </div>
    </div>
    <div style="height:2rem;"></div>
    <div class="bottom_fix">
      <div class="agree" @click="agree = !agree">
        <div class="flex">
          <img class="icon" v-if="agree" src="./images/icons/checkbox_on_r.png" />
          <img class="icon" v-else src="./images/icons/checkbox_off.png" />
          我已阅读并同意
          <span>《声音定制规则》</span>
        </div>
      </div>
      <div class="btn" @click="goSave">提交</div>
    </div>
  </div>
</template>

<script>
import { Toast, Uploader } from "vant";
export default {
  components: { Uploader },
  data() {
    return {
      agree:true,
      fileName:'',
    };
  },
  created(){

  },
  methods:{
    uploadPic(file){
      Toast.loading({ message: '上传中...', duration: 0})
      setTimeout(()=>{
        this.fileName = file.file.name
        Toast.clear()
      },3000)
    },
    goBack(){
      this.$router.go(-1)
    },
    goSave(){
      if(!this.agree){
        Toast('请先阅读并同意《声音定制规则》')
        return false
      }
      if(!this.fileName){
        Toast('请上传音频')
        return false
      }
      Toast.loading({ message: '提交中...'})
      setTimeout(()=>{
        Toast.clear()
        this.$router.push('/digital_human/audio_result')
      },800)
    }
  }
};
</script>

<style lang="stylus" scoped>
  .back{position:fixed;width:.36rem;height:.36rem;padding:.2rem;left:.2rem;top:.6rem;z-index:5;box-sizing: content-box;}
  .header{padding-top:.55rem;font-size:.36rem;font-weight:bold;text-align:center;height:.88rem;color:#333;box-sizing: content-box;line-height:.88rem;}
  .container{
    width:100%;
    min-height:100vh;
    background:url(./images/icons/bg_red.png) no-repeat center top;
    background-size:cover;
    .banner{width:100%;display:block;}
    .title{font-size:.36rem;margin-top:.2rem;
      padding:.4rem .6rem;background:#fff;border-radius:.4rem .4rem 0 0;position:relative;
      .bg{position:absolute;left:.4rem;top:.3rem;width:.36rem;height:.36rem;border-radius:100%;background:rgba(255, 235, 221, .3);}
      .bg1{left:.54rem;background:rgba(255, 235, 221, .6);}
      .bg2{left:.68rem;background:rgba(255, 235, 221, 1);}
      .b{color:#720C0C;font-weight: bold;}
    }
    .box{
      background:#fff;margin:.3rem;border-radius:.08rem;padding:.3rem;
      .box_g{background:#FAFAFA;border-radius:.2rem;padding:.32rem .5rem .3rem .5rem;text-align:center;font-size: initial;
        .audio{width:1rem;height:1rem;}
        .p{font-size:.24rem;color:#999;margin-top:.2rem;margin-bottom:.6rem;}
        .file_name{font-size:.24rem;color:#999;margin-bottom:.2rem;white-space:nowrap;overflow: hidden;text-overflow: ellipsis;}
        .btn{display:inline-block;background-image: linear-gradient(to right, #FD4851, #EF546B);font-size:.28rem;color:#fff;padding:.16rem .4rem;border-radius:.35rem;
          *{display:inline-block;vertical-align:middle;}
          .upload{width:.28rem;height:.28rem;margin-right:.08rem;}
        }
        ::v-deep .van-uploader{
          opacity:0;position:absolute;left:0;top:0;right:0;bottom:0;overflow:hidden;z-index:1;
          .van-uploader__wrapper,.van-uploader__upload,.van-uploader__upload input{margin:0;width:100%;height:100%;}
        }
      }
    }
  }
  .bottom_fix{position:fixed;z-index:5;left:0;bottom:0;width:100%;padding-bottom:.34rem;
    .agree{
      .flex{
        display:flex;align-items: center;justify-content: center;font-size:.24rem;color:#333;padding:.2rem;margin-bottom:.04rem;
      }
      .icon{width:.26rem;height:.26rem;margin-right:.08rem;}
      span{
        color:#FC5E66;
      }
    }
    .btn{margin:0 .74rem;background-image: linear-gradient(to right, #FD4851, #EF546B);height:1.08rem;border-radius:.54rem;color:#fff;font-weight:bold;font-size:.32rem;display:flex;align-items: center;justify-content: center;}
  }
  
</style>
