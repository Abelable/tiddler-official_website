<template>
  <div>
    <div class="mask" :class="{ show }" @click="hide" />
    <div class="popup" :class="{ show }">
      <div class="invite-rank-list-popup" :class="{ bg: moreMode }">
        <div class="header">
          <img
            class="back-icon"
            @click.stop="back"
            v-if="moreMode"
            src="https://img.ubo.vip/mp/index/room/rank/back-arrow.png"
          />
          <div class="title">邀请榜</div>
        </div>

        <div class="content">
          <div class="content-desc" v-if="!moreMode">
            <div>邀请人信息</div>
            <div>邀请数量</div>
          </div>
          <div class="user-list" v-if="!moreMode">
            <div
              class="inviter-item"
              v-for="(item, index) in inviterList"
              :key="index"
              @click.stop="showUserManagementPopup(item.user_id)"
            >
              <div class="inviter-index">
                <div v-if="index > 2">{{ index + 1 }}</div>
                <img
                  class="rank-tag"
                  wx:else
                  :src="
                    `https://img.ubo.vip/mp/index/room/rank/rank_${index +
                      1}.png`
                  "
                />
              </div>
              <div class="user-info-wrap">
                <img class="user-avatar" :src="item.head_img" />
                <div class="user-info">
                  <div class="user-name">
                    <div class="name">{{ item.nick_name }}</div>
                    <div
                      class="identity-tag"
                      :class="{
                        anchor: item.type_name === '创建者',
                        'live-assistant': item.type_name === '直播助手',
                        assistant: item.type_name === '小助手',
                      }"
                      v-if="item.type_name"
                    >
                      {{ item.type_name }}
                    </div>
                    <div
                      class="status-tag"
                      :class="{ 'off-line': item.is_online != 1 }"
                    >
                      <div
                        class="status-tag-spot"
                        :class="{ 'off-line': item.is_online != 1 }"
                      />
                      <div>{{ item.is_online == 1 ? "在线" : "离线" }}</div>
                    </div>
                  </div>
                  <div class="inviter-id">ID：{{ item.user_id }}</div>
                </div>
              </div>
              <div class="invite-num" @click.stop="showMore(item.user_id)">
                <div>{{ item.invite_num }}</div>
                <img
                  class="more-arrow"
                  src="https://img.ubo.vip/mp/index/room/rank/more-arrow.png"
                />
              </div>
            </div>
          </div>

          <div class="user-list" v-else>
            <div
              class="user-item"
              v-for="(item, index) in userList"
              :key="index"
              @click.stop="showUserManagementPopup(item.user_id)"
            >
              <div class="user-info-wrap">
                <img class="user-avatar" :src="item.head_img" />
                <div class="user-info">
                  <div class="user-name-wrap">
                    <div class="user-name">
                      <div class="name">{{ item.nick_name }}</div>
                      <div
                        class="identity-tag"
                        :class="{
                          anchor: item.type_name === '创建者',
                          'live-assistant': item.type_name === '直播助手',
                          assistant: item.type_name === '小助手',
                        }"
                        v-if="item.type_name"
                      >
                        {{ item.type_name }}
                      </div>
                      <div
                        class="status-tag"
                        :class="{ 'off-line': item.is_online != 1 }"
                      >
                        <div
                          class="status-tag-spot"
                          :class="{ 'off-line': item.is_online != 1 }"
                        />
                        <div>{{ item.is_online == 1 ? "在线" : "离线" }}</div>
                      </div>
                    </div>
                    <div class="user-id">ID：{{ item.user_id }}</div>
                  </div>
                  <div class="watch-time-wrap">
                    <div class="watch-time">
                      <img
                        class="time-icon"
                        src="https://img.ubo.vip/youbo_plus/new_version/live/users-management-popup/time.png"
                      />
                      <div class="time-desc">观看时长</div>
                      <div class="time-content">
                        {{ item.watch_time | timeFormat }}
                      </div>
                    </div>
                    <div class="region">
                      <span>{{ item.province }}</span>
                      <span v-if="item.city">｜{{ item.city }}</span>
                      <span v-if="item.area">｜{{ item.area }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="tag-list-wrap" v-if="item.tag.length">
                <div class="tag-label">标签</div>
                <div class="tag-list">
                  <div
                    class="tag-item"
                    :style="{ color: tag.font_color, background: tag.bg_color }"
                    v-for="(tag, tagIndex) in item.tag"
                    :key="tagIndex"
                  >
                    {{ tag.tag_name }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RoomService from "@/service/roomService";
const roomService = new RoomService();

export default {
  props: {
    roomInfo: Object,
  },

  data() {
    return {
      show: false,
      inviterList: [],
      userList: [],
      moreMode: false,
    };
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
    this.setInviterList();

    setTimeout(() => {
      this.show = true;
    }, 50);
  },

  methods: {
    async setInviterList() {
      const { studio_id, id: room_id } = this.roomInfo;
      const { list: inviterList = [] } =
        (await roomService.getRoomOnlineUserList({
          studio_id,
          room_id,
          type: "invite_rank",
        })) || {};
      this.inviterList = inviterList;
    },

    async setUserList(parent_user_id) {
      const { studio_id, id: room_id } = this.roomInfo;
      const { list: userList = [] } =
        (await roomService.getRoomOnlineUserList({
          studio_id,
          room_id,
          type: "invite_user_list",
          parent_user_id,
        })) || {};
      this.userList = userList;
    },

    showMore(id) {
      this.moreMode = true;
      this.setUserList(id);
    },

    showUserManagementPopup(id) {
      this.$emit("showUserManagementPopup", id);
    },

    back() {
      this.moreMode = false;
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
.invite-rank-list-popup {
  padding-bottom: env(safe-area-inset-bottom);
}
.invite-rank-list-popup.bg {
  background-image: url('https://img.ubo.vip/mp/index/room/rank-bg.png');
  background-repeat: no-repeat;
  background-size: contain;
}

.header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  border-bottom: 1px solid #EEEEEC;
}
.title {
  color: #333;
  font-size: 16px;
  font-weight: bold;
}
.back-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
}

.content {
  height: 400px;
  max-height: calc(100vh - 45px - env(safe-area-inset-bottom));
  overflow-y: scroll;
}
.content-desc {
  display: flex;
  justify-content: space-between;
  margin: 14px 15px 0;
  color: #666;
  font-size: 12px;
}

.user-list {
  padding: 0 15px;
}
.inviter-item {
  display: flex;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #ECECEC;
}
.inviter-item:last-child {
  border-bottom: none;
}
.inviter-index {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  width: 24px;
  height: 24px;
  color: #333;
  font-size: 14px;
  font-weight: bold;
}
.rank-tag {
  width: 24px;
  height: 24px;
}
.user-info-wrap {
  display: flex;
  align-items: center;
  flex: 1;
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
.user-name {
  display: flex;
  align-items: center;
  flex: 1;
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
.user-name-wrap {
  display: flex;
  align-items: center;
}
.name {
  color: #333;
  font-size: 14px;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
.user-id {
  color: #999;
  font-size: 10px;
}

.identity-tag {
  display: flex;
  align-items: center;
  margin-left: 4px;
  padding: 0 6px;
  height: 18px;
  font-size: 11px;
  font-weight: bold;
  white-space: nowrap;
  border-radius: 3px;
}
.identity-tag.audience {
  color: #fff;
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
.inviter-id {
  margin-top: 8px;
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
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.tag-list-wrap {
  display: flex;
  align-items: center;
  margin-top: 15px;
  opacity:0;
}
.tag-list-wrap-show {
  opacity: 1;
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

.invite-num {
  display: flex;
  align-items: center;
  color: #333;
  font-size: 14px;
  font-weight: bold;
}
.more-arrow {
  margin-left: 4px;
  width: 14px;
  height: 14px;
}
</style>
