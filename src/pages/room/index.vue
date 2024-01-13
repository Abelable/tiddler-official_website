<template>
  <div class="container" v-if="pageShow">
    <div v-if="roomInfo.status == 1" style="position:absolute;left:.24rem;top:1.2rem;z-index:9;color:#fff;font-size:.24rem;
    isplay: flex;
    align-items: center;
    padding: 0.08rem 0.16rem;
    width: -webkit-fit-content;
    width: -moz-fit-content;
    width: fit-content;
    background: rgba(0,0,0,0.3);
    border-radius: 0.22rem;
    border: 0.5px solid rgba(255,255,255,0.3);" @click="goLogin">切换账号{{is_tourist == 1?'[游客]':roomInfo.type_name?'['+roomInfo.type_name+']':''}}</div>
    <!-- <div style="position:absolute;left:.24rem;top:1.8rem;z-index:9;color:#fff;font-size:.24rem;
    isplay: flex;
    align-items: center;
    padding: 0.06rem 0.16rem 0.08rem 0.16rem;
    width: -webkit-fit-content;
    width: -moz-fit-content;
    width: fit-content;
    background: rgba(0,0,0,0.3);
    border-radius: 0.22rem;
    border: 0.5px solid rgba(255,255,255,0.3);" @click="clearFn">清缓存</div> -->
    <img
      class="bg"
      v-if="roomInfo"
      v-lazy="roomInfo.cover + '?x-oss-process=image/resize,w_10'"
    />

    <Live
      v-if="roomInfo && roomInfo.status == 1 && !liveEnding && !userBlacked"
      :roomInfo="roomInfo"
    />
    <LiveBreak v-if="(roomInfo && roomInfo.status == 0) || liveBreak" />
    <LiveEnding v-if="liveEnding" :roomInfo="roomInfo" />
    <LiveNotice v-if="roomInfo && roomInfo.status == 2" :roomInfo="roomInfo" />
    <LiveEnd v-if="roomInfo && roomInfo.status == 3" :roomInfo="roomInfo" />

    <PasswordModal
      v-if="passwordModalVisible"
      :pwdError="pwdError"
      @resetPassword="pwdError = false"
      @confirm="refetch"
    />
  </div>
</template>

<script>
import { h5Url } from "@/utils/config";
import { Toast } from "vant";
import Live from "./components/Live";
import LiveBreak from "./components/LiveBreak";
import LiveEnding from "./components/LiveEnding";
import LiveNotice from "./components/LiveNotice";
import LiveEnd from "./components/LiveEnd";
import PasswordModal from "./components/PasswordModal";

import { mapState } from "vuex";
import { getUrlParam } from "@/utils/index";
import RoomService from "@/service/roomService";

const roomService = new RoomService();

export default {
  components: {
    Live,
    LiveBreak,
    LiveEnding,
    LiveNotice,
    LiveEnd,
    PasswordModal,
  },

  data() {
    return {
      myId:'',
      view_type_value:'',
      pageShow:false,
      roomInfo: {},
      password: "",
      pwdError: false,
      passwordModalVisible: false,
      sharePopupVisible: false,
      is_tourist:'2'
    };
  },

  computed: {
    ...mapState({
      liveBreak: (state) => state.im.liveBreak,
      liveEnding: (state) => state.im.liveEnding,
      userBlacked: (state) => state.im.userBlacked,
    }),
  },

  created() {
    this.view_type_value = window.localStorage.getItem('view_type')
    this.id = this.$route.query.id || getUrlParam("id");
    this.parent_user_id =
      this.$route.query.parent_user_id || getUrlParam("parent_user_id") || "";

    if (this.parent_user_id) {
      this.$store.commit("setShareId", this.parent_user_id);
    }
    this.initPage()
  },

  mounted(){
    window.wx.ready(() => {
      this.setWXshare()
    })
  },

  methods: {
    setWXshare(){
      let title = this.roomInfo.title
      let desc = '听说好看的人才能收到这个链接哟~'
      let link = h5Url + '/h5/#/l_p?id='+this.id+'&parent_user_id='+(this.myId||'')
      let imgUrl = this.roomInfo.cover
      console.log(title,desc,link,imgUrl,'==========share')
      window.wx.updateAppMessageShareData({ 
        title, // 分享标题
        desc, // 分享描述
        link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl, // 分享图标
        success: function () {
          // 设置成功
        }
      })
      window.wx.updateTimelineShareData({ 
        title, // 分享标题
        link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl, // 分享图标
        success: function () {
          // 设置成功
        }
      })
    },
    goLogin(){
      this.$router.push({
        path: "/login",
        query: {
          showLoginPage: true,
          redirect: this.$route.fullPath,
        },
      });
    },
    clearFn(){
      localStorage.removeItem("token");
    },
    initPage(){
      let view_type = window.localStorage.getItem('view_type')
      roomService.getCurrentUserInfo((res)=>{
        //已经登录
        this.is_tourist = res.is_tourist
        this.myId = res.id
        if(view_type == 'h5'){
          this.initWx()
          this.setRoomInfo()
          this.pageShow = true
        }else{
          if(res.is_tourist == 1){
            localStorage.removeItem("token");
            window.location.reload()
          }else{
            this.initWx()
            this.setRoomInfo()
            this.pageShow = true
          }
        }
      },(res)=>{
        if(res.data.code == '4040' || res.data.code == '0'){
          if(view_type == 'h5'){
            let tourist_data = {}
            try {
              tourist_data = JSON.parse(localStorage.getItem("tourist_data") || '{}') || {}
            } catch (error) {
              console.log(error)
            }
            if(tourist_data.token){
              localStorage.setItem("token", tourist_data.token);
              this.myId = tourist_data.id
              this.initWx()
              this.setRoomInfo()
              this.is_tourist = '1'
              this.pageShow = true
            }else{
              roomService.addUser({},(res)=>{
                console.log(res,'游客')
                localStorage.setItem("token", res.token);
                localStorage.setItem("tourist_data", JSON.stringify(res));
                this.myId = res.id
                this.initWx()
                this.setRoomInfo()
                this.is_tourist = '1'
                this.pageShow = true
              },(res)=>{
                Toast.fail(res.data.message);
                this.goLogin()
                this.pageShow = true
              });
            }
          }else{
            this.goLogin()
            this.pageShow = true
          }
        }else{
          Toast.fail(res.data.message);
          this.goLogin()
          this.pageShow = true
        }
      });
    },
    async initWx() {
      let view_type = window.localStorage.getItem('view_type')
      if(view_type!='h5'){
        const { appId, timestamp, nonceStr, signature } =
          (await roomService.getWxSign(
            encodeURIComponent(window.location.href)
          )) || {};
        window.wx.config({
          appId,
          timestamp,
          nonceStr,
          signature,
          jsApiList: ["chooseImage", "previewImage", "wx-open-launch-weapp","updateAppMessageShareData","updateTimelineShareData"],
          openTagList: ["wx-open-launch-weapp"],
        });
      }
    },

    refetch(password) {
      this.password = password;
      this.setRoomInfo();
    },

    setRoomInfo() {
      roomService.getRoomInfo(
        this.id,
        this.password,
        this.parent_user_id,
        (res) => {
          const {
            show_subtitle,
            subtitle,
            watch_num,
            user_watch_num,
            like_num,
            is_anonymous,
            is_anonymous2,
            user_is_ban,
            ...roomInfo
          } = res;
          this.roomInfo = roomInfo;
          if (user_is_ban == 1) this.$store.commit("setCurUserIsBan", 1);
          this.$store.commit("setAnonymoused", is_anonymous == 1);
          this.$store.commit("setExtraAnonymoused", is_anonymous2 == 1);
          this.$store.commit("setSubtitleVisible", show_subtitle == 1);
          this.$store.commit("setSubtitleContent", subtitle);
          this.$store.commit(
            "setAudienceCount",
            roomInfo.type_name ? Number(watch_num) : Number(user_watch_num)
          );
          this.$store.commit("setPraiseCount", Number(like_num));
          document.title = roomInfo.title;
          if (this.passwordModalVisible) {
            this.passwordModalVisible = false;
          }
          this.setWXshare()
          if(roomInfo && roomInfo.status == 3){
            Toast("直播已结束");
          }
        },
        (res) => {
          if (res.data.message === "直播间密码错误") {
            if (this.passwordModalVisible) {
              this.pwdError = true;
            } else {
              this.passwordModalVisible = true;
            }
          } else if (
            res.data.message === "非白名单用户，无法查看" ||
            res.data.message === "黑名单用户，无法查看"
          ) {
            Toast.fail("您暂无权限观看");
          } else Toast(res.data.message);
        }
      );
    },
  },
};
</script>

<style lang="stylus" scoped>
.container
  position relative
  width: 100vw
  height: 100vh
  overflow hidden
  .bg
    position absolute
    top 0
    left 0
    width 100vw
    height 100vh
    filter blur(20px)
    transform scale(1.2)
    z-index -1
</style>
