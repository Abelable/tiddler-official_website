<template>
  <div class="container" >
    <div style="padding-top:10px;">
      <span style="display:inline-block;background:green;border-radius:10px;color:#fff;padding:20px;" @click="clearFn">
        清数据缓存
      </span>
    </div>
    <div style="padding-top:10px;">
      <span style="display:inline-block;background:green;border-radius:10px;color:#fff;padding:20px;" @click="authFn">
        授权
      </span>
    </div>
    企业微信{{isComWx}}
  </div>
</template>

<script>

import { h5Url, liveUrl } from "@/utils/config";
export default {
   data() {
    return {
      isComWx:false
    };
  },
  created() {
    this.isComWx = /wxwork/i.test(navigator.userAgent); 
  },
  mounted(){
  },
  methods:{
    clearFn(){
      localStorage.removeItem("token");
      alert('clear ok')
    },
    authFn(){
       // 微信环境
      let auth_appid = window.localStorage.getItem('auth_appid')
      const state = encodeURIComponent("login_type=1");
      const hostUrl = encodeURIComponent(liveUrl)
      window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${auth_appid}&redirect_uri=${hostUrl}%2Fofficial-account%2Foauth-callback&response_type=code&scope=snsapi_userinfo&state=${state}#wechat_redirect`;

      // https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb20a819bb31fdfdc&redirect_uri=https%3A%2F%2Fzhushou.zhubaozhibo.net%2Fh5%2Fpages%2Flogin%2Flogin&response_type=code&scope=snsapi_userinfo&state=10653&component_appid=wx6ba2f2c753a8be69&uin=MjU0ODQwNjEyMg%3D%3D&key=9ba562e5536c96484b1e25648d1c18986c4c4078c0e5ea119bac17567935ae2eb33b92d2fd7a52bac34d0129bda233bf28a96fcf13fa5601df90dc5b1a9730d20494b7b2ee41ee4603a1b4d976631355598fc64f926244ded9854f0a6d358588a72b3148bdbbc9e3b6d1390baf8b27c9923255398e153b9e645f23a9a6c4f725&version=6309080f&exportkey=n_ChQIAhIQS5D542F0TVwWej95R2ig5RLMAQIE97dBBAEAAAAAAPdxL9FNJ1UAAAAOpnltbLcz9gKNyK89dVj0DDs0ppzz4juu4CplB21sTwMgfZK41ZtdxsowsypfzR4od8JL1liaM5ecpqwAqHU267xqJqhSNJijQdLGIzbOTxxLLxFJIjEoaAuoa3LqruT%2FpQvu%2F%2FTnrA3lskGIGHkjjOnwwX9xSYfbnbxY6z0UYk9U3%2BFNtI5lGudqgapGYDYLExuaINfI4LvGDcHXpKmMTZ6pfUPtWoyj0kdLfFpMAok0wdK%2FHA%3D%3D&pass_ticket=kk%2FwdFVqjSqqnGqKx%2BLP4utjNmBjKmQT3LpW7aofv47UpinoegPQSo%2Fx7aHgXluRUxrCiS99AKs3lpUS7Nuk6Q%3D%3D&wx_header=0

      // https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx771e17d37273409a&redirect_uri=https%3A%2F%2Fvzan.com%2Fuser-center-prod%2Foauth%2Fv1%2Fthirdparty%2Fmulti_callback&response_type=code&scope=snsapi_userinfo&state=6eb7db96c4ea79e1a94dbfeb1dd0810e&uin=MjA3NDM1NjgwMQ%3D%3D&key=44e83de2b369101de38b48080d2797dcd34bd76a21b623076468b9d525ef53147ad193d5a44fd9dbd5e798346748fa3413a060d7e2d931e208ac8b0d7a0782719069b42b638b88daf9531db71bc34fdfc116d469081d1e85a21653f4c2e8c60447ae3e7a658031d9269a5592260ae29718e56f9539e2d5b6263edb18409a1724&version=6309080f&exportkey=n_ChQIAhIQeeMe9L%2FLXMb9uV30pg9GxRLLAQIE97dBBAEAAAAAAMIrOrGqKUMAAAAOpnltbLcz9gKNyK89dVj0cBGaTlJmuI6GJEfSLp8HUHGlulq3AjgHzbhlfGtAE45O0pAfJP9cASJH90N2WyrUEKCdEUkQovQhkSu3tGvSW1FSdaylLq%2FzqurNGOFr7EZrSkM6rKN8dX1fUVa57HjQ3PBNYE9g%2FGe150XlnM9UAdDUjLJamIbniFuWA17JyVvuhS9P2yqzJAi%2BJUOqM0ywTrjinkoSMcMfshJIgGR2KF50Cgzm&pass_ticket=%2FInPNWlrLXXdLsSl%2B9ot7WNmSEJK%2F9WcOn3hiw4Z2UBo8%2B%2BBVen5PAI36ChmQQOw0cenYPd0TwwB%2FvHeLdliFA%3D%3D&wx_header=0
    },
  }
};
</script>

<style lang="stylus" scoped>

</style>
