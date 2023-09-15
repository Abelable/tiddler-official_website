<template>
  <div class="container">
    <img src="./images/icons/back.png" class="back" @click="goBack" />
    <div class="header">
      {{isSuccess?'提交成功':'入驻失败'}}
    </div>

    <div class="box">
      <img src="./images/icons/success.png" v-if="isSuccess" class="icon"/>
      <img src="./images/icons/fail.png" v-else class="icon"/>
      <div class="p1">{{isSuccess?'提交成功':'入驻失败'}}</div>
      <div class="p2">{{isSuccess?'你已上传成功，后台正在审核':'失败原因：音频文件过大'}}</div>
      <div class="p3" v-if="isSuccess">预计审核时间：15分钟</div>
      <div class="btn" @click="goBack">
        <span>返回</span>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      isSuccess:true
    };
  },
  created(){
    this.isSuccess = this.$route.query.fail != 1
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
  .header{padding-top:.55rem;font-size:.36rem;font-weight:bold;text-align:center;height:.88rem;color:#333;box-sizing: content-box;line-height:.88rem;}
  .container{
    width:100%;
    min-height:100vh;
    background:url(./images/icons/bg_red.png) no-repeat center top;
    background-size:cover;

    .box{
      background:#fff;margin:.3rem;border-radius:.2rem;padding:.8rem .46rem;text-align:center;font-size: initial;
      .icon{width:2rem;height:2rem;}
      .p1{font-size:.32rem;color:#000;font-weight:bold;margin-top:.2rem;margin-bottom:.3rem;}
      .p2{font-size:.24rem;color:#999;margin-bottom:.2rem;}
      .p3{font-size:.24rem;color:#999;margin-bottom:.2rem;}
      .btn{background-image: linear-gradient(to right, #FD4851, #EF546B);font-size:.32rem;color:#fff;padding:.32rem .4rem;border-radius:.54rem;margin-top:2.6rem;}
      
    }
  }

  
</style>
