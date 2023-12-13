<template>
  <div class="container">
    <img class="avatar" v-if="avatar" :src="avatar" />
    <div class="title" v-if="name">
      【{{ name }}】邀请您成为 {{ studioName }} 的{{
        type == 3 ? "小助手" : "直播助手"
      }}
    </div>
    <div class="invite-btn" v-if="!isManager" @click="accept">接受邀请</div>
    <div class="invalid-btn" v-if="isManager">
      您已经是该直播间的{{ type == 3 ? "小助手" : "直播助手" }}
    </div>
    <!-- <div class="mask" v-if="showMobileVisible"></div>
    <div class="pop_con" v-if="showMobileVisible">
      <div class="h1">绑定手机号</div>
      <div class="flex row">
        <div class="label">手机号码</div>
        <div class="flex1">
          <input
            class="form-input"
            v-model="pop_mobile"
            type="text"
            maxlength="11"
            :placeholder="`请输入手机号码`"
          />
        </div>
      </div>
      <div class="flex row">
        <div class="flex1">
          <input
            class="form-input"
            v-model="pop_code"
            type="text"
            :placeholder="`请输入验证码`"
          />
        </div>
        <div class="codeBtn flex" @click="getCodeFn" v-if="countDown === 0">获取验证码</div>
        <div class="codeBtn flex color999" v-else>{{countDown}}s后重试</div>
      </div>
      <div class="btn" @click="saveFn">绑定</div>
    </div> -->
  </div>
</template>

<script>
import { Toast } from "vant";
import BaseService from "@/service/baseService";

const baseService = new BaseService();
import RoomService from "@/service/roomService";

const roomService = new RoomService();

export default {
  data() {
    return {
      type: 3,
      avatar: "",
      name: "",
      studioName: "",
      isManager: false,
      showMobileVisible:false,
      mobile:'',
      countdownInterval:'',
      countDown: 0,
      pop_code:'',
      pop_mobile:'',
    };
  },
  destroyed(){
    clearInterval(this.countdownInterval)
  },

  created() {
    roomService.getCurrentUserInfo((res)=>{
      if(res.is_tourist == 1){
        localStorage.removeItem("token");
        this.$router.push({
          path: "/login",
          query: {
            showLoginPage: true,
            redirect: this.$route.fullPath,
          },
        });
      }else{
        const { type, inviter_id, studio_id, studio_name } = this.$route.query;
        this.type = type;
        this.inviterId = inviter_id;
        this.studioId = studio_id;
        this.studioName = studio_name;
        this.mobile = res.mobile
        if(!this.mobile){
          localStorage.removeItem("token");
          this.$router.push({
            path: "/login",
            query: {
              showLoginPage: true,
              redirect: this.$route.fullPath,
            },
          });
        }else{
          this.setInviterInfo();
        }
      }
    },(res)=>{
      this.$router.push({
        path: "/login",
        query: {
          showLoginPage: true,
          redirect: this.$route.fullPath,
        },
      });
      return;
    })
  },

  methods: {
    saveFn(){
      const reg = /^1\d{10}$/
      const mobile = this.pop_mobile
      if(!mobile || !reg.test(Number(mobile))){
        Toast('请输入正确的手机号码')
        return false
      }
      if (!this.pop_code) {
        Toast('请输入验证码')
        return
      }
      baseService.bindNewMobile({
        mobile: this.pop_mobile,
        code:  this.pop_code
      }, (res) => {
        Toast('操作成功')
        this.mobile = this.pop_mobile
        localStorage.setItem("token", res.token);
        setTimeout(()=>{
          window.location.reload()
        },1000)
      })
    },
    getCodeFn(){
      if (this.countDown) return
      const mobile = this.pop_mobile
      const reg = /^1\d{10}$/
      if(!mobile || !reg.test(Number(mobile))){
        Toast('请输入正确的手机号码')
        return false
      }
      baseService.sendCode({ 
        mobile:mobile, 
      }, () => {
        Toast('发送成功')
        this.startCountdown()
      })
    },
    startCountdown() {
      this.countDown = 60
      this.countdownInterval = setInterval(() => {
        if (this.countDown === 0) {
          clearInterval(this.countdownInterval)
          return
        }
        this.countDown = --this.countDown
      }, 1000)
    },

    async setInviterInfo() {
      const { nick_name, head_img } =
        (await baseService.getCurrentUserInfo(this.inviterId)) || {};
      this.avatar = head_img;
      this.name = nick_name;
    },

    accept() {
      // this.showMobileVisible = true
      if(!this.mobile){
        return false
      }
      baseService.createStudioManager(this.studioId, this.type, this.inviterId, () => {
        Toast(`您已成为该直播间的${this.type == 3 ? "小助手" : "直播助手"}`);
        this.isManager = true;
      });
    },
    
  },
};
</script>

<style lang="stylus" scoped>
.container
  height: 100vh
  background: #fff
  overflow: hidden
  .avatar
    display: block
    margin: .80rem auto 0
    width: 2.48rem
    height: 2.48rem
    border-radius: 50%
  .title
    margin-top: .40rem
    color: #333
    font-size: .32rem
    font-weight: bold
    text-align: center
  .invite-btn, .invalid-btn
    display: flex
    align-items: center
    justify-content: center
    margin: .40rem auto 0
    width: 6.40rem
    height: 1.00rem
    font-size: .32rem
    font-weight: bold
    border-radius: .50rem
  .invite-btn
    margin-top: .80rem
    color: #FFE5BD
    background: linear-gradient(128deg, #404A5C 0%, #0F131A 100%)
  .invalid-btn
    color: #999
    background: #E4E4E4




.mask{position:fixed;z-index:100;width:100%;height:100%;left:0;top:0;background:rgba(0,0,0,.3);}
.pop_con{background:#fff;border-radius:.20rem;position:fixed;width:6rem;left:50%;margin-left:-3rem;top:50%;transform: translateY(-50%);z-index:101;word-break:break-all;padding:.4rem;
  .h1{font-size:.36rem;font-weight:bold;color:#333;text-align:center;margin-bottom:.3rem;}
  .btn{width:80%;position:relative;left:10%;height:.88rem;line-height:.88rem;text-align:center;font-size:.32rem;color:#FFE5BD;border-radius:.44rem;background-image: linear-gradient(to right, #404A5C, #0F131A);margin-top:.4rem;}
  .row{font-size:0;border-bottom:1px solid #E8E8E8;
    .label{font-size:.32rem;color:#333;margin-right:.2rem;margin-left:.3rem;}
    input{width:100%;font-size:.3rem;padding:.3rem;}
  }
  .codeBtn{
    width:2.40rem;
    height:1.08rem;
    color:#BA9243;
    position:relative;
    font-size:.32rem;
  }
  .codeBtn.color999{
    color:#999;
  }
}
.flex{display: flex;flex-direction: row;justify-content: center;word-break:break-all;align-items: center;}
.flex1{flex:1;}

</style>
