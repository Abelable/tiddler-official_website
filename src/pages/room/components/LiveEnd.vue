<template>
  <div class="container">
    <div class="user-info">
      <img class="avatar" :src="roomInfo.head_img" />
      <div class="name-wrap">
        <div class="name">{{ roomInfo.studio_title }}</div>
        <div class="desc">本次直播已结束</div>
      </div>
    </div>

    <div class="cover-wrap">
      <img class="cover" :src="roomInfo.cover" />
      <div class="room-info">
        <div class="title">{{ roomInfo.title }}</div>
        <div class="time">{{ roomInfo.lv_start_time | timeFormat }}</div>
      </div>
    </div>

    <div class="bottom-bar">
      <div v-if="roomInfo.show_replay == 2">
        <wx-open-launch-weapp
          :username="originalMpId"
          :path="
            `pages/subpages/home/live-play/index?id=${roomInfo.id}&parent_user_id=${shareId}`
          "
        >
          <script type="text/wxtag-template">
            <style>
              .back-btn {
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 10px;
                width: 100px;
                height: 40px;
                font-size: 16px;
                font-weight: bold;
                color: #FFE5BD;
                background: linear-gradient(128deg, #404A5C 0%, #0F131A 100%);
                border-radius: 20px;
              }
            </style>
            <div class="back-btn">跳转小程序</div>
          </script>
        </wx-open-launch-weapp>
      </div>
      <div v-if="roomInfo.show_replay == 1">
        <wx-open-launch-weapp
          :username="originalMpId"
          :path="
            `pages/subpages/home/live-play/index?id=${roomInfo.id}&parent_user_id=${shareId}`
          "
        >
          <script type="text/wxtag-template">
            <style>
              .back-btn {
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 10px;
                width: 100px;
                height: 40px;
                font-size: 16px;
                font-weight: bold;
                color: #FFE5BD;
                background: linear-gradient(128deg, #404A5C 0%, #0F131A 100%);
                border-radius: 20px;
              }
            </style>
            <div class="back-btn">查看回放</div>
          </script>
        </wx-open-launch-weapp>
      </div>
      <div class="status-btn">直播已结束</div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  props: {
    roomInfo: Object,
  },

  data() {
    return {
      originalMpId: "",
    };
  },

  filters: {
    timeFormat(timeStamp) {
      timeStamp =
        timeStamp.toString().length === 10 ? timeStamp * 1000 : timeStamp;
      const date = new Date(timeStamp);
      const year = date.getFullYear();
      const month = `${date.getMonth() + 1}`.padStart(2, "0");
      const day = `${date.getDate()}`.padStart(2, "0");
      const hours = `${date.getHours()}`.padStart(2, "0");
      const minutes = `${date.getMinutes()}`.padStart(2, "0");
      const seconds = `${date.getSeconds()}`.padStart(2, "0");
      return "YYYY年MM月DD日 hh:mm:ss"
        .replace("YYYY", year)
        .replace("MM", month)
        .replace("DD", day)
        .replace("hh", hours)
        .replace("mm", minutes)
        .replace("ss", seconds);
    },
  },

  computed: {
    ...mapState({
      shareId: (state) => state.im.shareId,
    }),
  },

  created() {
    this.originalMpId = window.location.href.includes("sm")
      ? "gh_fede7ed137e1"
      : "gh_6a8e1c4701d2";
  },
};
</script>

<style lang="stylus" scoped>
.container
  background: #f5f6f7
  .user-info
    display: flex
    align-items: center
    padding: 0 .30rem
    height: 1.60rem
    background: #fff
    .avatar
      width: 1.00rem
      height: 1.00rem
      border-radius: 50%
    .name-wrap
      margin-left: .12rem
      flex: 1
      .name
        color: #333
        font-size: .32rem
        font-weight: bold
      .desc
        margin-top: .08rem
        color: #999
        font-size: .24rem
  .cover-wrap
    position: relative
    margin: .24rem
    height: 3.52rem
    font-size: 0
    border-radius: .20rem
    overflow: hidden
    .cover
      width: 100%
      height: 100%
    .room-info
      position: absolute
      left: 0
      bottom: 0
      padding: .50rem .20rem .20rem
      width: 100%
      background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.5) 100%)
      .title
        color: #fff
        font-size: .28rem
        font-weight: bold
      .time
        margin-top: .04rem
        color: #fff
        font-size: .24rem
  .bottom-bar
    position: fixed
    left: 0
    bottom: 0
    display: flex
    padding: .20rem .30rem calc(.20rem + env(safe-area-inset-bottom))
    width: 100%
    background: #fff
    .back-btn, .status-btn
      display: flex
      align-items: center
      justify-content: center
      height: .80rem
      font-size: .32rem
      font-weight: bold
      border-radius: .40rem
    .back-btn
      margin-left: .30rem
      width: 2.00rem
      color: #FFE5BD
      background: linear-gradient(128deg, #404A5C 0%, #0F131A 100%)
    .status-btn
      flex: 1
      color: #999
      background: #E4E4E4
</style>
