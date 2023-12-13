<template>
  <div>
    <div class="mask" :class="{ show }" @click="hide" />
    <div class="popup" :class="{ show }">
      <div class="user-management-popup">
        <div class="user-list">
          <div class="user-item">
            <div class="user-info-wrap-w">
              <div class="user-info-wrap">
                <img class="user-avatar" :src="userInfo.head_img" />
                <div class="user-info">
                  <div class="user-name-wrap">
                    <div class="user-name">
                      <div class="name">{{ userInfo.nick_name }}</div>
                      <div
                        class="identity-tag"
                        :class="{
                          anchor: userInfo.type_name === '创建者',
                          'live-assistant': userInfo.type_name === '直播助手',
                          assistant: userInfo.type_name === '小助手',
                        }"
                        v-if="userInfo.type_name"
                      >
                        {{ userInfo.type_name }}
                      </div>
                      <div
                        class="status-tag"
                        :class="{ 'off-line': userInfo.is_online != 1 }"
                      >
                        <div
                          class="status-tag-spot"
                          :class="{ 'off-line': userInfo.is_online != 1 }"
                        />
                        <div>
                          {{ userInfo.is_online == 1 ? "在线" : "离线" }}
                        </div>
                      </div>
                    </div>
                    <div class="user-id">ID：{{ userInfo.id }}</div>
                  </div>
                  <div class="watch-time-wrap">
                    <div class="watch-time">
                      <img
                        class="time-icon"
                        src="https://img.ubo.vip/youbo_plus/new_version/live/users-management-popup/time.png"
                      />
                      <div class="time-desc">观看时长</div>
                      <div class="time-content">
                        {{ userInfo.watch_time | timeFormat }}
                      </div>
                    </div>
                    <div class="region">
                      <span>{{ userInfo.province }}</span>
                      <span v-if="userInfo.city">｜{{ userInfo.city }}</span>
                      <span v-if="userInfo.area">｜{{ userInfo.area }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              class="tag-list-wrap"
              v-if="userInfo.tag && userInfo.tag.length"
            >
              <div class="tag-label">标签</div>
              <div class="tag-list">
                <div
                  class="tag-item"
                  :style="{ color: tag.font_color, background: tag.bg_color }"
                  v-for="(tag, tagIdx) in userInfo.tag"
                  :key="tagIdx"
                >
                  {{ tag.tag_name }}
                </div>
              </div>
            </div>
            <div class="popup-btns">
              <div
                class="popup-btn"
                v-if="
                  roomInfo.type_name === '创建者' ||
                    roomInfo.type_name === '直播助手'
                "
                @click.stop="addTagModalVisible = true"
              >
                <img
                  class="popup-btn-icon"
                  src="https://img.ubo.vip/youbo_plus/new_version/live/users-management-popup/tag.png"
                />
                <div class="pupup-btn-desc">标签</div>
              </div>
              <div class="popup-btn" @click.stop="atUser">
                <img
                  class="popup-btn-icon"
                  src="https://img.ubo.vip/youbo_plus/new_version/live/users-management-popup/at.png"
                />
                <div class="pupup-btn-desc">@TA</div>
              </div>
              <div class="popup-btn" @click.stop="toggleBanStatus">
                <img
                  class="popup-btn-icon"
                  :src="
                    `https://img.ubo.vip/youbo_plus/live_features_popup/${
                      userInfo.is_ban == 1 ? 'baned' : 'ban'
                    }.png`
                  "
                />
                <div class="pupup-btn-desc">
                  {{ userInfo.is_ban == 1 ? "取消禁言" : "禁言" }}
                </div>
              </div>
              <div class="popup-btn" @click.stop="blackStatusComfirm">
                <img
                  class="popup-btn-icon"
                  :src="
                    `https://img.ubo.vip/youbo_plus/live_features_popup/${
                      userInfo.is_black == 1 ? 'blacked' : 'black'
                    }.png`
                  "
                />
                <div class="pupup-btn-desc">
                  {{ userInfo.is_black == 1 ? "取消拉黑" : "拉黑" }}
                </div>
              </div>
              <div
                class="popup-btn"
                v-if="
                  roomInfo.type_name === '创建者' ||
                    roomInfo.type_name === '直播助手'
                "
                @click.stop="toggleWhiteStatus"
              >
                <img
                  class="popup-btn-icon"
                  :src="
                    `https://img.ubo.vip/youbo_plus/live_features_popup/${
                      userInfo.is_white == 1 ? 'whited' : 'white'
                    }.png`
                  "
                />
                <div class="pupup-btn-desc">
                  {{ userInfo.is_white == 1 ? "取消白名单" : "白名单" }}
                </div>
              </div>
              <div
                class="popup-btn"
                @click.stop="enterAnimationPopupVisible = true"
              >
                <img
                  class="popup-btn-icon"
                  src="https://img.ubo.vip/youbo_plus/live_features_popup/enter-room-animation.png"
                />
                <div class="pupup-btn-desc">进场动画</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <TagModal
      v-if="addTagModalVisible"
      :studioId="studioInfo.id"
      :userIds="[userInfo.id]"
      @confirm="finishBindTag"
      @hide="addTagModalVisible = false"
    />
    <EnterAnimationPopup
      v-if="enterAnimationPopupVisible"
      :studioId="studioInfo.id"
      :userId="userInfo.id"
      @hide="enterAnimationPopupVisible = false"
    />
  </div>
</template>

<script>
import { Dialog } from "vant";
import TagModal from "./TagModal";
import EnterAnimationPopup from "./EnterAnimationPopup";

import { mapState } from "vuex";
import _ from "lodash";
import RoomService from "@/service/roomService";
const roomService = new RoomService();

export default {
  components: { TagModal, EnterAnimationPopup },

  props: {
    roomInfo: Object,
    userId: String,
  },

  data() {
    return {
      show: false,
      userInfo: {},
      addTagModalVisible: false,
      enterAnimationPopupVisible: false,
    };
  },

  computed: {
    ...mapState({
      studioInfo: (state) => state.studioInfo,
    }),
  },

  filters: {
    timeFormat(timeStamp) {
      var hours = `${Math.floor(
        (timeStamp % (24 * 60 * 60)) / (60 * 60)
      )}`.padStart(2, "0");
      var minutes = `${Math.floor((timeStamp % (60 * 60)) / 60)}`.padStart(
        2,
        "0"
      );
      var seconds = `${Math.floor(timeStamp % 60)}`.padStart(2, "0");
      return "hh时mm分ss秒"
        .replace("hh", hours)
        .replace("mm", minutes)
        .replace("ss", seconds);
    },
  },

  created() {
    this.setUserInfo();

    setTimeout(() => {
      this.show = true;
    }, 50);
  },

  methods: {
    async setUserInfo() {
      const { roomInfo, userId } = this;
      const { id, studio_id } = roomInfo;
      const userInfo = await roomService.getRoomUserInfo(studio_id, id, userId);
      this.userInfo = userInfo;
    },

    finishBindTag(tagList) {
      this.userInfo.tag = tagList;
      this.addTagModalVisible = false;
    },

    toggleBanStatus() {
      roomService.handleUser({
        studio_id: this.roomInfo.studio_id,
        user_id: this.userId,
        is_ban: this.userInfo.is_ban == 1 ? 2 : 1,
        success: () => {
          this.userInfo.is_ban = this.userInfo.is_ban == 1 ? 2 : 1;
        },
      });
    },

    blackStatusComfirm() {
      if (this.userInfo.is_black == 2) {
        Dialog.confirm({
          message: "确定拉黑该用户吗？",
          confirmButtonColor: "#05828C",
        })
          .then(async () => {
            this.toggleBlackStatus();
          })
          .catch(() => {});
      } else {
        this.toggleBlackStatus();
      }
    },

    toggleBlackStatus() {
      roomService.handleUser({
        studio_id: this.roomInfo.studio_id,
        user_id: this.userId,
        is_black: this.userInfo.is_black == 1 ? 2 : 1,
        success: () => {
          this.userInfo.is_black = this.userInfo.is_black == 1 ? 2 : 1;
        },
      });
    },

    toggleWhiteStatus() {
      roomService.handleUser({
        studio_id: this.roomInfo.studio_id,
        user_id: this.userId,
        is_white: this.userInfo.is_white == 1 ? 2 : 1,
        success: () => {
          this.userInfo.is_white = this.userInfo.is_white == 1 ? 2 : 1;
        },
      });
    },

    atUser() {
      this.$emit("at", this.userInfo.nick_name);
    },

    hide() {
      this.show = false;
      setTimeout(() => {
        this.$emit("hide");
      }, 200);
    },
  },
};
</script>

<style lang="stylus" scoped>
.mask
  position: fixed
  top: 0
  left: 0
  width: 100%
  height: 100%
  background: rgba(0, 0, 0, 0.3)
  z-index: 100
  opacity: 0
  transition: opacity .2s ease
  &.show
    opacity: 1
.popup
  position: fixed
  left: 50%
  bottom: 0
  width: 100%
  max-width: 100vh
  max-height: 100vh
  border-radius: .2rem .2rem 0 0
  background: #fff
  overflow: hidden
  z-index: 100
  transform: translate(-50%, 100%)
  transition: transform .2s ease
  &.show
    transform: translate(-50%, 0)
    transition: transform .3s ease
  .user-management-popup
    padding-bottom: env(safe-area-inset-bottom);

.menu-wrap {
  display: flex;
  align-items: center;
  height: 45px;
  border-bottom: 1px solid #F6F6F6;
}
.menu {
  display: flex;
  flex: 1;
}
.menu-item {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  height: 45px;
  color: #999;
  font-size: 14px;
}
.menu-item.selected {
  position: relative;
  color: #333;
  font-weight: bold;
}
.menu-item.selected::after {
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  width: 36px;
  height: 1px;
  content: '';
  border-radius: 0.5px;
  background: #FDCC87;
}
.refresh-btn {
  display: flex;
  align-items: center;
  margin: 0 15px;
  color: #333;
  font-size: 14px;
}
.refresh-icon {
  margin-right: 2px;
  width: 16px;
  height: 16px;
}

.content {
  height: 400px;
  max-height: calc(100vh - 45px - env(safe-area-inset-bottom));
  overflow-y: scroll;
}

.notify-bar {
  display: flex;
  align-items: center;
  height: 44px;
  padding: 0 15px;
  background: #FEF7E8;
}
.notify-icon, .close-notify-icon {
  width: 16px;
  height: 16px;
}
.notify-content {
  padding: 0 6px;
  flex: 1;
  color: #FF7D00;
  font-size: 12px;
}

.type-menu-list {
  padding-top: 10px;
  overflow-x: scroll;
  white-space: nowrap;
}
.type-menu-item {
  display: inline-block;
  margin-left: 8px;
  padding: 0 8px;
  height: 24px;
  color: #999;
  font-size: 12px;
  line-height: 24px;
  background: #EAEAEA;
  border-radius: 12px;
}
.type-menu-item:first-child {
  margin-left: 15px;
}
.type-menu-item:last-child {
  margin-right: 8px;
}
.type-menu-item.selected {
  color: #333;
  background: #FDCC87;
}

.user-list {
  padding: 0 15px;
}
.user-item {
  padding: 15px 0;
  border-bottom: 1px solid #ECECEC;
}
.user-item:last-child {
  border-bottom: none;
}
.user-info-wrap-w {
  height:48px;
}
.user-info-wrap {
  display: flex;
  align-items: center;
}
.user-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
}
.user-info {
  margin-left: 8px;
  flex: 1;
}
.user-name-wrap {
  display: flex;
  align-items: center;
}
.user-name {
  display: flex;
  align-items: center;
  flex: 1;
}
.name {
  color: #333;
  font-size: 14px;
  font-weight: bold;
  overflow: hidden;
  span-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.identity-tag {
  display: flex;
  align-items: center;
  margin-left: 4px;
  padding: 0 6px;
  height: 18px;
  color: #fff;
  font-size: 11px;
  font-weight: bold;
  white-space: nowrap;
  border-radius: 3px;
  background: #8B9EC2;
}
.identity-tag.anchor {
  color: #FFE5BD;
  background: linear-gradient(128deg, #404A5C 0%, #0F131A 100%);
}
.identity-tag.assistant {
  color: #404A5C;
  background: #E7CCFF;
}
.identity-tag.live-assistant {
  color: #404A5C;
  background: #FFBCDF;
}

.status-tag {
  display: flex;
  align-items: center;
  margin-left: 4px;
  padding: 0 6px;
  height: 18px;
  color: #fff;
  font-size: 10px;
  white-space: nowrap;
  background: #3BDB41;
  border-radius: 9px;
}
.status-tag.off-line {
  color: #999;
  background: #F1F5F7;
}
.status-tag-spot {
  margin-right: 2px;
  width: 4px;
  height: 4px;
  border-radius: 2px;
  background: #fff;
}
.status-tag-spot.off-line {
  background: #999;
}
.user-id {
  color: #999;
  font-size: 10px;
}

.watch-time-wrap {
  display: flex;
  align-items: center;
  margin-top: 10px;
}
.watch-time {
  display: flex;
  align-items: center;
  flex: 1;
}
.time-icon {
  width: 14px;
  height: 14px;
}
.time-desc {
  margin-left: 4px;
  color: #999;
  font-size: 10px;
  white-space: nowrap;
}
.time-content {
  margin-left: 4px;
  color: #333;
  font-size: 10px;
  white-space: nowrap;
}

.region {
  margin-left: 8px;
  color: #333;
  font-size: 10px;
  overflow: hidden;
  span-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.tag-list-wrap {
  display: flex;
  align-items: center;
  margin-top: 15px;
}
.tag-label {
  color: #333;
  font-size: 10px;
}
.tag-list {
  display: flex;
  flex-wrap: nowrap;
  flex: 1;
  height: 18px;
  overflow-x: scroll;
}
.tag-item {
  display: flex;
  align-items: center;
  margin-left: 4px;
  padding: 0 6px;
  height: 18px;
  color: #404A5C;
  font-size: 11px;
  font-weight: bold;
  white-space: nowrap;
  background: #FFE5BD;
  border-radius: 3px;
}
.popup-btns {
  display: flex;
  flex-wrap: nowrap;
  margin-top: 13px;
  width: 100%;
  overflow-x: scroll;
}
.popup-btn {
  margin-right: .36rem;
  width: .9rem;
  font-size: 0;
  span-align: center;
}
.popup-btn-icon {
  width: .84rem;
  height: .84rem;
}
.pupup-btn-desc {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 7px;
  height: 12px;
  color: #999;
  font-size: 10px;
  line-height: 1;
  white-space: nowrap;
}
</style>
