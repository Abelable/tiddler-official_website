<template>
  <div class="container">
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
      roomInfo: null,
      password: "",
      pwdError: false,
      passwordModalVisible: false,
      sharePopupVisible: false,
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
    this.id = this.$route.query.id || getUrlParam("id");
    this.parent_user_id =
      this.$route.query.parent_user_id || getUrlParam("parent_user_id") || "";

    if (this.parent_user_id) {
      this.$store.commit("setShareId", this.parent_user_id);
    }
    this.setRoomInfo();
    this.initWx();
  },

  methods: {
    async initWx() {
      const { appId, timestamp, nonceStr, signature } =
        (await roomService.getWxSign(
          encodeURIComponent(window.location.href)
        )) || {};
      window.wx.config({
        appId,
        timestamp,
        nonceStr,
        signature,
        jsApiList: ["chooseImage", "previewImage", "wx-open-launch-weapp"],
        openTagList: ["wx-open-launch-weapp"],
      });
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
