<template>
  <div class="live">
    <Player
      v-if="playerShow"
      :url="roomInfo.url"
      :horizontal="roomInfo.direction == 1"
      :roomInfo="roomInfo"
      :playerPause="playerPause"
      @checkMute="checkMute"
    />
    <div class="muteCls" v-if="mutedBtn && playerShow" @click="setMute">
      <Icon name="volume-o" size=".4rem" color="#fff" />
    </div>
    <Swipe
      class="cover"
      v-if="livePlaying"
      :loop="false"
      :show-indicators="false"
    >
      <SwipeItem class="cover-inner">
        <div class="top-part">
          <div class="row center between">
            <AuchorCapsule :roomInfo="roomInfo" />
            <div
              class="user-count-wrap"
              @click="roomInfo.type_name ? 'showUsersManagementPopup' : ''"
            >
              <img
                class="users-icon"
                src="../../../assets/images/live/user.png"
              />
              <div class="user-count">{{ audienceCount }}</div>
            </div>
          </div>
          <div class="row">
            <!-- <div class="recommend-goods" v-if="recommendGoods">
              <div class="recommend-goods-title">热门推荐</div>
              <img class="recommend-goods-pic" :src="recommendGoods.goods_img" >
            </div> -->
            <div class="rolling-caption-wrap">
              <div
                class="rolling-caption"
                v-if="subtitleVisible && subtitleContent"
                @click="adVisible = !adVisible"
              >
                <div class="rolling-caption-content-wrap">
                  <div class="rolling-caption-content">
                    {{ subtitleContent }}
                  </div>
                </div>
                <img
                  class="open-arrow"
                  src="../../../assets/images/live/open-arrow.png"
                />
              </div>
              <div class="ad-content-wrap" v-show="adVisible">
                <img
                  class="ad-content-title"
                  src="../../../assets/images/live/ad-title.png"
                />
                <div class="ad-content">{{ subtitleContent }}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="full-screen-btn" v-if="roomInfo.direction == 1">
          <wx-open-launch-weapp
            :username="originalMpId"
            :path="
              `pages/subpages/home/live-play/index?id=${roomInfo.id}&parent_user_id=${shareId}`
            "
          >
            <script type="text/wxtag-template">
              <style>
                .full-screen-btn {
                  display: flex;
                  align-items: center;
                  padding: 0 8px;
                  height: 30px;
                  border-radius: 15px;
                  background: rgba(0, 0, 0, 0.3);
                  border: 0.5px solid rgba(255,255,255,0.3);
                }
                .full-screen-icon {
                  width: 18px;
                  height: 18px;
                }
                .full-screen-desc {
                  margin-left: 4px;
                  color: #fff;
                  font-size: 12px;
                  line-height: 1;
                }
              </style>
              <div class="full-screen-btn">
                <img class="full-screen-icon" src="https://img.ubo.vip/youbo_plus/live/full-screen-icon.png" >
                <div class="full-screen-desc">全屏观看</div>
              </div>
            </script>
          </wx-open-launch-weapp>
        </div>

        <div class="hd-btn">
          <wx-open-launch-weapp
            :username="originalMpId"
            :path="
              `pages/subpages/home/live-play/index?id=${roomInfo.id}&parent_user_id=${shareId}`
            "
          >
            <script type="text/wxtag-template">
              <style>
                .hd-btn {
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  width: 60px;
                  height: 60px;
                  border-radius: 50%;
                  background: rgba(0, 0, 0, 0.3);
                }
                .hd-icon {
                  margin-left: 2px;
                  width: 24px;
                  height: 24px;
                }
                .hd-desc {
                  margin-top: 2px;
                  color: #fff;
                  font-size: 12px;
                }
              </style>
              <div class="hd-btn">
                <img class="hd-icon" src="https://img.ubo.vip/youbo_plus/live/hd.png">
                <div class="hd-desc">高清</div>
              </div>
            </script>
          </wx-open-launch-weapp>
        </div>

        <div class="shortcut-btns">
          <img
            class="shortcut-btn"
            v-if="roomInfo.type_name"
            @click.stop="assistantCommentsPopupVisible = true"
            src="../../../assets/images/live/short.png"
          />
          <img
            class="shortcut-btn"
            v-if="roomInfo.type_name"
            @click.stop="usersManagementPopupVisible = true"
            src="../../../assets/images/live/users.png"
          />
          <img
            class="shortcut-btn"
            v-if="roomInfo.type_name"
            @click.stop="virtualDataPopupVisible = true"
            src="../../../assets/images/live/add-user-icon.png"
          />
        </div>

        <div class="bottom-part">
          <EnterAnimation
            v-if="showEnterAnimation"
            :info="enterAnimationInfo"
            :isAnchor="!!roomInfo.type_name"
          />
          <Comment :roomId="roomInfo.id" :isAnchor="!!roomInfo.type_name" />
          <PhraseList
            v-if="userPhraseList.length"
            :roomInfo="roomInfo"
            :phraseList="userPhraseList"
          />
          <Praise :manual="manualPraise" :count="praiseCount" />
          <div class="interactive-area">
            <div
              class="chat-btn"
              :class="{ 'is-ban': isBan }"
              @click="inputModalVisible = true"
            >
              <img
                class="ban-icon"
                v-if="isBan"
                src="../../../assets/images/live/ban.png"
              />
              <div>说点什么......</div>
            </div>
            <div class="btns">
              <div class="btn" @click="praise">
                <img
                  class="icon"
                  src="https://img.ubo.vip/mp/index/room/praise-icon.png"
                />
                <div class="praise-count" v-if="praiseCount">
                  {{ praiseCount }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </SwipeItem>
      <SwipeItem></SwipeItem>
    </Swipe>

    <InputModal
      v-if="inputModalVisible"
      :roomInfo="roomInfo"
      :defaultContent="defaultContent"
      :phraseList="userPhraseList"
      @hide="inputModalVisible = false"
    />
    <GoodsPopup
      v-if="goodsPopupVisible"
      :roomId="roomInfo.id"
      :recommendGoodsId="`${recommendGoods ? recommendGoods.id : ''}`"
      @hide="goodsPopupVisible = false"
    />
    <AssistantCommentsPopup
      v-if="assistantCommentsPopupVisible"
      :roomInfo="roomInfo"
      @hide="assistantCommentsPopupVisible = false"
    />
    <UsersManagementPopup
      v-if="usersManagementPopupVisible"
      :roomInfo="roomInfo"
      @at="atUser"
      @hide="usersManagementPopupVisible = false"
    />
    <VirtualDataPopup
      v-if="virtualDataPopupVisible"
      :roomInfo="roomInfo"
      @hide="virtualDataPopupVisible = false"
    />
    <Animation />
  </div>
</template>

<script>
var hidden, visibilityChange;
if (typeof document.hidden !== "undefined") {
  hidden = "hidden";
  visibilityChange = "visibilitychange";
} else if (typeof document.msHidden !== "undefined") {
  hidden = "msHidden";
  visibilityChange = "msvisibilitychange";
} else if (typeof document.webkitHidden !== "undefined") {
  hidden = "webkitHidden";
  visibilityChange = "webkitvisibilitychange";
}
import { Toast, Dialog, Swipe, SwipeItem, Icon } from "vant";
import Player from "./Player";
import AuchorCapsule from "./AuchorCapsule";
import EnterAnimation from "./EnterAnimation";
import Comment from "./Comment";
import PhraseList from "./PhraseList";
import InputModal from "./InputModal";
import GoodsPopup from "./GoodsPopup";
import AssistantCommentsPopup from "./AssistantCommentsPopup";
import UsersManagementPopup from "./UsersManagementPopup";
import VirtualDataPopup from "./VirtualDataPopup";
import Animation from "./Animation";
import Praise from "./Praise";

import TIM from "tim-js-sdk";
import TIMUploadPlugin from "tim-upload-plugin";
import _ from "lodash";
import Vue from "vue";
import { mapState } from "vuex";
import RoomService from "@/service/roomService";

const roomService = new RoomService();

export default {
  components: {
    Player,
    Swipe,
    SwipeItem,
    AuchorCapsule,
    EnterAnimation,
    Comment,
    PhraseList,
    InputModal,
    GoodsPopup,
    AssistantCommentsPopup,
    UsersManagementPopup,
    VirtualDataPopup,
    Animation,
    Praise,
    Icon,
  },

  props: {
    roomInfo: Object,
  },

  data() {
    return {
      playerShow: true,
      originalMpId: "",
      userPhraseList: [],
      adVisible: false,
      recommendGoods: null,
      recommendGoodsSliderVisible: false,
      defaultContent: "",
      showEnterAnimation: false,
      enterAnimationInfo: {},
      inputModalVisible: false,
      goodsPopupVisible: false,
      assistantCommentsPopupVisible: false,
      usersManagementPopupVisible: false,
      liveStartModalVisible: false,
      virtualDataPopupVisible: false,
      playerPause: false,
      mutedBtn: false,
      mutedVolume: false,
    };
  },

  computed: {
    ...mapState({
      shareId: (state) => state.im.shareId,
      sdkAppID: (state) => state.im.sdkAppID,
      userID: (state) => state.im.userID,
      userSig: (state) => state.im.userSig,
      livePlaying: (state) => state.im.livePlaying,
      audienceCount: (state) => state.im.audienceCount,
      manualPraise: (state) => state.im.manualPraise,
      praiseCount: (state) => state.im.praiseCount,
      subtitleVisible: (state) => state.im.subtitleVisible,
      subtitleContent: (state) => state.im.subtitleContent,
      isBan: (state) => state.im.isBan,
    }),
  },

  async created() {
    this.originalMpId = "gh_6a8e1c4701d2";
    this.setStudioInfo();
    await this.setImInfo();
    this.initTim();
    this.setMsgHistory();
    this.setUserPhraseList();
    this.setRecommendGoods();
  },

  mounted() {
    if (window.WeixinJSBridge) {
      window.WeixinJSBridge.on("onPageStateChange", (res) => {
        if (res && res.active) {
          this.playerPause = false;
        } else {
          this.playerPause = true;
        }
      });
    } else {
      document.addEventListener(
        visibilityChange,
        this.handleVisibilityChange,
        false
      );
    }
  },

  destroyed() {
    this.quitGroup();
    this.logoutIm();
    if (!window.WeixinJSBridge)
      document.removeEventListener(
        visibilityChange,
        this.handleVisibilityChange,
        false
      );
  },

  methods: {
    handleVisibilityChange() {
      if (!document[hidden]) {
        this.playerShow = true;
      } else {
        this.playerShow = false;
      }
    },
    async setImInfo() {
      const imInfo = await roomService.getImInfo();
      this.$store.commit("setImInfo", imInfo);
    },

    async setStudioInfo() {
      const studioInfo = await roomService.getUserStudioInfo();
      this.$store.commit("setStudioInfo", studioInfo);
    },

    refresh() {
      Toast.loading({ message: "加载中..." });
      this.$set(this.roomInfo, "url", this.roomInfo.url);
      setTimeout(() => {
        Toast.clear();
      }, 1000);
    },

    async setMsgHistory() {
      const msgList = await roomService.getMsgHistory(this.roomInfo.id);
      if (!this.$store.state.im.liveChatMsgList.length) {
        this.$store.commit("setLiveChatMsgList", msgList);
      }
    },

    async setUserPhraseList() {
      const { list = [] } =
        (await roomService.getPhraseList(this.roomInfo.studio_id, 2)) || {};
      this.userPhraseList = list;
    },

    async setRecommendGoods() {
      this.recommendGoods = await roomService.getRecommendGoods(
        this.roomInfo.id
      );
      if (this.recommendGoods) {
        this.recommendGoodsSliderVisible = true;
        setTimeout(() => {
          this.recommendGoodsSliderVisible = false;
        }, 10000);
      }
    },

    praise() {
      !this.manualPraise && this.$store.commit("setManualPraise", true);
      this.$store.commit("setPraiseCount", this.praiseCount + 1);
      if (!this.tempPraiseCount) this.tempPraiseCount = 0;
      ++this.tempPraiseCount;
      this.savePraise();
    },

    savePraise: _.debounce(function() {
      roomService.savePraise(this.roomInfo.id, this.tempPraiseCount);
      this.tempPraiseCount = 0;
    }, 1000),

    initTim() {
      const tim = TIM.create({ SDKAppID: this.sdkAppID });
      if (tim) {
        tim.setLogLevel(1);
        tim.registerPlugin({ "tim-upload-plugin": TIMUploadPlugin });
        tim.on(TIM.EVENT.SDK_READY, this.onReadyStateUpdate, this);
        tim.on(TIM.EVENT.MESSAGE_RECEIVED, this.onMsgReceive, this);
        tim.login({ userID: this.userID, userSig: this.userSig });
        this.tim = tim;
        Vue.prototype.tim = tim;
      }
    },

    onReadyStateUpdate() {
      this.joinGroup();
    },

    onMsgReceive({ data = [] }) {
      data.forEach((item) => {
        const { conversationType, type, payload } = item;
        switch (conversationType) {
          case TIM.TYPES.CONV_SYSTEM:
            if (type === TIM.TYPES.MSG_GRP_SYS_NOTICE) {
              this.handleLiveCustomMsg(payload);
            }
            break;

          case TIM.TYPES.CONV_GROUP:
            if (type === TIM.TYPES.MSG_TEXT) {
              this.handleLiveChatMsg(payload);
            } else if (type === TIM.TYPES.MSG_CUSTOM) {
              this.handleLiveCustomMsg(payload);
            }
            break;
        }
      });
    },

    handleLiveChatMsg(payload) {
      const { nick_name, ...rest } =
        typeof payload.text === "string"
          ? JSON.parse(payload.text.replace(/&quot;/g, '"')).data
          : {};
      const liveMsg = nick_name ? { nick_name, ...rest } : null;

      if (!this.liveMsgCache) this.liveMsgCache = [];
      liveMsg && this.liveMsgCache.push(liveMsg);

      if (!this.setLiveMsgListTimeout) {
        this.setLiveMsgListTimeout = setTimeout(() => {
          this.$store.commit("setLiveChatMsgList", this.liveMsgCache);
          this.liveMsgCache = [];
          this.setLiveMsgListTimeout = null;
        }, 100 * this.liveMsgCache.length);
      }
    },

    handleLiveCustomMsg(payload) {
      let content;
      if (payload.userDefinedField) {
        if (payload.userDefinedField.includes("{")) {
          content = JSON.parse(payload.userDefinedField);
        } else if (payload.userDefinedField.includes("欢迎")) {
          content = { type: "user_coming", message: payload.userDefinedField };
        }
      } else if (payload.data) {
        content = JSON.parse(payload.data);
      }
      if (content && content.type) {
        this.handleCustomMsg(content);
      }
    },

    handleCustomMsg(customMsg) {
      if (customMsg) {
        const {
          userID,
          audienceCount,
          manualPraise,
          praiseCount,
          liveBreak,
        } = this.$store.state.im;

        switch (customMsg.type) {
          case "room_new_user":
            this.handleEnterAnimation(customMsg);
            break;

          case "robot_in_group":
            if (Number(customMsg.user_num) > 0) {
              if (this.roomInfo.type_name) {
                this.storeEnterAnimationInfo({
                  type: 1,
                  message: customMsg.message,
                  isRobot: 1,
                });
              } else {
                this.storeEnterAnimationInfo({
                  type: 1,
                  message: customMsg.message,
                });
                this.$store.commit(
                  "setAudienceCount",
                  audienceCount + Number(customMsg.user_num)
                );
              }
            }
            if (Number(customMsg.like_num) > 0) {
              manualPraise && (this.manualPraise = false);
              this.$store.commit(
                "setPraiseCount",
                praiseCount + Number(customMsg.like_num)
              );
            }
            break;

          case "user_comed":
            if (this.roomInfo.type_name) {
              if (customMsg.zhubo_total_num != audienceCount) {
                this.$store.commit(
                  "setAudienceCount",
                  Number(customMsg.zhubo_total_num)
                );
              }
            } else {
              this.$store.commit(
                "setAudienceCount",
                audienceCount + Number(customMsg.user_num)
              );
            }
            break;

          case "show_user_change":
            if (!this.roomInfo.type_name) {
              this.$store.commit(
                "setAudienceCount",
                Number(customMsg.user_num)
              );
            }
            break;

          case "user_leaving":
            if (this.roomInfo.type_name) {
              if (customMsg.zhubo_total_num) {
                this.$store.commit(
                  "setAudienceCount",
                  Number(customMsg.zhubo_total_num)
                );
              } else {
                const newCount = audienceCount - 1;
                this.$store.commit(
                  "setAudienceCount",
                  newCount < 0 ? 0 : newCount
                );
              }
            } else {
              const newCount = audienceCount - Number(customMsg.user_num);
              this.$store.commit(
                "setAudienceCount",
                newCount < 0 ? 0 : newCount
              );
            }
            break;

          case "live_room_like":
            if (Number(customMsg.like_num) > praiseCount) {
              manualPraise && this.$store.commit("setManualPraise", false);
              this.$store.commit("setPraiseCount", Number(customMsg.like_num));
            }
            break;

          case "ban_group_msg":
            this.$store.commit("setIsBan", Number(customMsg.is_ban));
            break;

          case "ban_user":
            var userIdList = customMsg.user_id.split(",");
            if (userIdList.includes(`${userID}`)) {
              this.$store.commit("setCurUserIsBan", 1);
            }
            break;

          case "unban_user":
            var unbanUserIds = customMsg.user_id.split(",");
            if (unbanUserIds.includes(`${userID}`)) {
              this.$store.commit("setCurUserIsBan", 0);
            }
            break;

          case "group_subtitle":
            this.$store.commit(
              "setSubtitleVisible",
              customMsg.show_subtitle == 1
            );
            this.$store.commit("setSubtitleContent", customMsg.subtitle);
            break;

          case "send_premiere":
            this.liveStartModalVisible = true;
            break;

          case "clear_group_msg":
            this.$store.commit("clearLiveMsgList");
            break;

          case "delete_group_msg":
            this.$store.commit("deleteLiveMsg", customMsg.delete);
            break;

          case "drop_live_stream":
            !liveBreak && this.$store.commit("setLiveBreak", true);
            break;

          case "resume_live_stream":
            liveBreak && this.$store.commit("setLiveBreak", false);
            break;

          case "room_anonymous":
            this.$store.commit(
              "setAnonymoused",
              Number(customMsg.is_anonymous)
            );
            break;

          case "black_user":
            if (customMsg.user_id.split(",").includes(`${userID}`)) {
              Dialog.alert({
                message: "抱歉，您已被主播拉黑",
              });
              this.$store.commit("blackUser");
            }
            break;

          case "close_live_room":
            liveBreak && this.$store.commit("setLiveBreak", false);
            this.$store.commit("setLiveDuration", customMsg.play_time);
            this.$store.commit("setLiveEnding", true);
            break;

          case "recommend_goods":
            this.setRecommendGoods();
            break;

          case "animation":
            this.$store.commit("setAnimationIndex", Number(customMsg.index));
            break;

          case "studio_freeze":
            if (this.roomInfo.id == customMsg.room_id) {
              Toast.fail(customMsg.msg);
              setTimeout(() => {
                location.reload();
              }, 2000);
            }
            break;

          case "manager_gift":
            this.handleManagerGift(customMsg);
            break;
        }
      }
    },

    handleEnterAnimation({ head_img, nick_name, data }) {
      const enterAnimationInfo = {
        type: 1,
        head_img,
        nick_name,
      };
      const animationList = JSON.parse(data);
      for (let i = 0; i < animationList.length; i++) {
        const { type, play_type, play_img } = animationList[i];
        if (type == 2) {
          this.$store.commit("setAnimationList", [
            ...this.$store.state.animationList,
            { svga: play_img },
          ]);
          this.$nextTick(() => {
            if (!this.$store.state.animationVisible) {
              this.$store.commit("setAnimationVisible", true);
            }
          });
        }
        if (type == 3) {
          if (play_type == 2) {
            enterAnimationInfo.type = 2;
            enterAnimationInfo.bg = play_img;
          } else {
            enterAnimationInfo.type = 3;
            enterAnimationInfo.bg = play_img;
          }
        }
      }
      this.storeEnterAnimationInfo(enterAnimationInfo);
    },

    storeEnterAnimationInfo(enterAnimationInfo) {
      if (!this.enterAnimationInfoList) this.enterAnimationInfoList = [];
      if (this.showEnterAnimation) {
        this.enterAnimationInfoList.push(enterAnimationInfo);
      } else {
        this.createEnterAnimation(enterAnimationInfo);
      }
    },

    createEnterAnimation(enterAnimationInfo) {
      this.enterAnimationInfo = enterAnimationInfo;
      this.showEnterAnimation = true;
      setTimeout(() => {
        this.showEnterAnimation = false;
        setTimeout(() => {
          if (this.enterAnimationInfoList.length) {
            this.createEnterAnimation(this.enterAnimationInfoList[0]);
            this.enterAnimationInfoList = this.enterAnimationInfoList.slice(1);
          }
        }, 500);
      }, 5000);
    },

    handleManagerGift({ num, play_img }) {
      const list = new Array(+num).fill("").map((item) => ({ svga: play_img }));
      this.$store.commit("setAnimationList", [
        ...this.$store.state.animationList,
        ...list,
      ]);
      this.$nextTick(() => {
        if (!this.$store.state.animationVisible) {
          this.$store.commit("setAnimationVisible", true);
        }
      });
    },

    joinGroup() {
      this.tim.joinGroup({
        groupID: this.roomInfo.group_id,
        type: TIM.TYPES.GRP_AVCHATROOM,
      });
    },

    quitGroup() {
      this.tim.quitGroup(this.roomInfo.group_id);
    },

    logoutIm() {
      this.tim.logout();
    },

    checkMute() {
      if (document.getElementById("audio_player").paused) {
        this.mutedBtn = true;
        this.mutedVolume = false;
      } else {
        this.mutedBtn = false;
      }
    },

    setMute() {
      if (!this.mutedVolume) {
        document.getElementById("audio_player").play();
        this.mutedBtn = false;
      }
    },

    atUser(name) {
      this.usersManagementPopupVisible = false;
      this.inputModalVisible = true;
      this.defaultContent = `@${name} `;
    },
  },
};
</script>

<style lang="stylus" scoped>
@keyframes wordsLoop
  0%
    transform: translateX(3.2rem)
  100%
    transform: translateX(-100%)
.row
  display flex
  margin-bottom: .3rem
  &.between
    justify-content space-between
  &.center
    align-items: center
.live
  position relative
  .cover
    position absolute
    top 0
    left 0
    width 100vw
    height 100vh
    .cover-inner
      position relative
      width 100vw
      height 100vh
      .top-part
        position absolute
        top 0
        left 0
        padding .24rem
        width 100%
        .user-count-wrap
          display: flex
          align-items: center
          padding: 0 .16rem
          width: fit-content
          height: .44rem
          background: rgba(0,0,0,0.3)
          border-radius: .22rem
          border: 0.5px solid rgba(255, 255, 255, 0.3)
          .users-icon
            width: .28rem
            height: .28rem
          .user-count
            margin-left: .04rem
            color: #fff
            font-size: .24rem
            line-height: 1
        .recommend-goods
          display: flex
          flex-direction: column
          align-items: center
          margin-right: .24rem
          width: 1.24rem
          height: 1.64rem
          background-image: url('https://img.ubo.vip/youbo_plus/live/recommend-goods-bg.png')
          background-size: 100%
          background-repeat: no-repeat
          .recommend-goods-title
            margin-top: .04rem
            color: #FFE5BD
            font-size: .2rem
            line-height: .3rem
          .recommend-goods-pic
            margin-top: .08rem
            width: 1.14rem
            height: 1.14rem
            border-radius: .18rem
        .rolling-caption-wrap
          display: flex
          flex-direction: column
          align-items: flex-end
          flex: 1
          .rolling-caption
            display: flex
            align-items: center
            padding-left: .18rem
            width: 3.68rem
            height: .44rem
            background: rgba(0,0,0,0.3)
            border-radius: .36rem
            border: 0.5px solid rgba(255, 255, 255, 0.3)
            .rolling-caption-content-wrap
              flex: 1
              overflow: hidden
              .rolling-caption-content
                width: fit-content
                color: #FDDF6A
                font-size: .22rem
                white-space: nowrap
                animation: wordsLoop 16s linear infinite
            .open-arrow
              margin: 0 .08rem
              width: .4rem
              height: .4rem
          .ad-content-wrap
            position: relative
            margin-top: .24rem
            padding: .3rem
            width 100%
            font-size: 0
            background: #FFFFFF
            border-radius: .2rem
            &::before
              position: absolute
              right: .4rem
              top: -0.28rem
              content: ""
              width: 0
              height: 0
              border: .16rem solid transparent
              border-bottom-color: #fff
            .ad-content-title
              width: .92rem
              height: .32rem
            .ad-content
              margin-top: .12rem
              color: #333
              font-size: .24rem
      .full-screen-btn
        position: absolute
        top: 6.8rem
        left: 50%
        transform: translateX(-50%)
        z-index: 100
      .hd-btn
        position: absolute
        top 50%
        transform: translateY(-50%)
        right: .24rem
        z-index: 100
      .shortcut-btns
        position: absolute
        top 50%
        transform: translateY(-50%)
        right: .24rem
        z-index: 100
        .shortcut-btn
          display: block
          margin-top: .16rem
          width: .7rem
          height: .7rem
      .bottom-part
        position absolute
        left 0
        bottom 0
        padding .24rem
        width 100%
        .interactive-area
          display flex
          align-items center
          .chat-btn
            display: flex
            align-items: center
            padding-left: .24rem
            flex: 1
            height: .7rem
            color: #fff
            font-size: .26rem
            border-radius: .35rem
            background: rgba(0, 0, 0, 0.3)
            &.is-ban
              opacity: 0.5
            .ban-icon
              margin-right: .1rem
              width: .4rem
              height: .4rem
          .btns
            display flex
            .btn
              position relative
              margin-left: .16rem
              width: 35px
              height: 35px
              font-size: 0
              overflow: initial
              .icon
                width: 35px
                height: 35px
              .praise-count
                position: absolute
                top: -0.28rem
                left: 50%
                transform: translateX(-50%)
                display flex
                align-items: center
                padding: 0 .1rem
                font-size: .18rem
                color: #F94950
                height: .28rem
                line-height: 1
                border-radius: .14rem
                background: #fff
                white-space: nowrap
.muteCls
  position:fixed
  z-index:2
  top:1.2rem
  right:.2rem
  width:.8rem
  height:.8rem
  border-radius:100%
  background:rgba(255,255,255,.3)
  display: flex
  align-items: center
  justify-content: center
.muteCls:after
  content:''
  width:2px
  height:.6rem
  background:#fff
  position:absolute
  left:50%
  top:.08rem
  transform:rotate(45deg)
</style>
