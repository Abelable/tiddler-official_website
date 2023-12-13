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
    };
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

        this.setInviterInfo();
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
    async setInviterInfo() {
      const { nick_name, head_img } =
        (await baseService.getCurrentUserInfo(this.inviterId)) || {};
      this.avatar = head_img;
      this.name = nick_name;
    },

    accept() {
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
</style>
