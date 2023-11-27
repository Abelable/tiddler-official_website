<template>
  <div>
    <div class="mask" :class="{ show }" @click="hide" />
    <div class="popup" :class="{ show }">
      <div class="assistant-comments-popup">
        <div class="menu-wrap">
          <div class="menu-list">
            <div
              class="menu-item"
              :class="{ selected: curMenuIdx === index }"
              v-for="(item, index) in ['固定助手评论', '随机助手评论']"
              :key="index"
              @click="selectMenu(index)"
            >
              {{ item }}
            </div>
          </div>
          <div v-if="curMenuIdx === 0">
            <van-switch
              v-model="userFixed"
              size="18px"
              inactive-color="#656565"
            />
          </div>
          <img
            v-if="curMenuIdx === 1"
            class="add-btn"
            @click.stop="commentModalVisible = true"
            src="https://img.ubo.vip/youbo_plus/new_version/live/assistant-comments-popup/add-btn.png"
          />
        </div>

        <div class="stable-part" v-if="curMenuIdx === 0">
          <div class="tips">
            <div style="color: #FB6155;">
              助手身份数量：{{ userList.length }}/{{ studioInfo.vest_num }}个
            </div>
            <div>1、开启后，你评论时将显示以下头像和昵称：</div>
            <div>2、以下头像和昵称是系统随机产生。</div>
          </div>
          <div class="selected-assistant" v-if="userList.length">
            <div class="assistant-info">
              <div class="avatar-wrap selected">
                <img
                  class="avatar selected"
                  :src="userList[vestIndex].head_img"
                />
                <img
                  class="selected-icon"
                  src="https://img.ubo.vip/youbo_plus/new_version/live/assistant-comments-popup/selected.png"
                />
              </div>
              <div class="name">{{ userList[vestIndex].name }}</div>
            </div>
            <div class="edit-btns">
              <div
                class="edit-btn"
                v-if="userList[vestIndex].id"
                @click.stop="assistantModalVisible = true"
              >
                编辑
              </div>
              <div class="change-btn" @click.stop="addVest">
                {{ userList[vestIndex].id ? "换一个" : "新增" }}
              </div>
            </div>
          </div>
          <div class="assistant-list">
            <div
              class="assistant-item"
              v-for="(item, index) in userList"
              :key="index"
              @click.stop="selectVest(index)"
            >
              <div
                class="avatar-wrap"
                :class="{ selected: vestIndex === index }"
              >
                <img
                  class="avatar"
                  :class="{ selected: vestIndex === index }"
                  :src="item.head_img"
                />
                <img
                  class="selected-icon"
                  v-if="vestIndex === index"
                  src="https://img.ubo.vip/youbo_plus/new_version/live/assistant-comments-popup/selected.png"
                />
                <img
                  class="delete-icon"
                  @click.stop="deleteVestItem(index)"
                  src="https://img.ubo.vip/youbo_plus/new_version/delete.png"
                />
              </div>
              <div class="assistant-name">{{ item.name }}</div>
            </div>
          </div>
        </div>

        <div class="random-part" v-if="curMenuIdx === 1">
          <div class="tips">
            选择任意已经添加好的评论，系统将随机生成一个助手并以该助手的身份发表该评论。
          </div>
          <div class="comment-list">
            <div
              class="comment-item"
              v-for="(item, index) in phraseList"
              :key="index"
            >
              <div class="comment-content">{{ item.content }}</div>
              <div class="send-btn" @click.stop="send(item.content)">
                发送
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <AssitantModal
      v-if="assistantModalVisible"
      :vest="userList[vestIndex]"
      @confirm="confirmEditAssistant"
      @hide="assistantModalVisible = false"
    />
    <AssitantCommentModal
      v-if="commentModalVisible"
      @confirm="confirmAddComment"
      @hide="commentModalVisible = false"
    />
  </div>
</template>

<script>
import AssitantModal from "./AssitantModal";
import AssitantCommentModal from "./AssitantCommentModal";

import TIM from "tim-js-sdk";
import { Dialog, Toast } from "vant";
import { mapState } from "vuex";
import _ from "lodash";
import RoomService from "@/service/roomService";
const roomService = new RoomService();

export default {
  components: { AssitantModal, AssitantCommentModal },

  props: {
    roomInfo: Object,
  },

  data() {
    return {
      show: false,
      curMenuIdx: 0,
      featureList: [],
      phraseList: [],
      userList: [],
      userFixed: false,
      commentModalVisible: false,
      assistantModalVisible: false,
    };
  },

  computed: {
    ...mapState({
      studioInfo: (state) => state.studioInfo,
      vestIndex: (state) => state.vestIndex,
      userTagList: (state) => state.userTagList,
    }),
  },

  watch: {
    userFixed: function(truthy) {
      if (truthy) {
        this.$store.commit("setVestInfo", this.userList[this.vestIndex]);
      } else {
        this.$store.commit("setVestInfo", null);
      }
      this.$store.commit("setUserFixed", truthy);
    },
  },

  created() {
    this.setPhraseList();
    this.setRandomUserList();
    this.setUserList();

    setTimeout(() => {
      this.show = true;
    }, 50);
  },

  methods: {
    selectMenu(index) {
      this.curMenuIdx = index;
    },

    selectUser(index) {
      this.$store.commit("vestIndex", index);
    },

    async setPhraseList() {
      const { list: phraseList = [] } =
        (await roomService.getPhraseList(this.roomInfo.studio_id, 4)) || {};
      this.phraseList = phraseList;
    },

    async setRandomUserList() {
      const { list = [] } = (await roomService.getVestList(0)) || {};
      this.randomUserList = list;
    },

    async setUserList() {
      const { list: userList = [] } =
        (await roomService.getVestList(this.roomInfo.studio_id)) || {};
      if (userList.length) {
        this.userList = userList;
        if (this.userFixed) {
          this.$store.commit("setVestInfo", this.userList[this.vestIndex]);
        }
      } else {
        this.addVest();
      }
    },

    addVest: _.debounce(function() {
      roomService.createVest(this.roomInfo.studio_id, (res) => {
        this.userList = [res.data.data, ...this.userList];
        this.$store.commit("vestIndex", 0);
        if (this.userFixed) {
          this.$store.commit("setVestInfo", this.userList[this.vestIndex]);
        }
      });
    }, 1000),

    selectVest(index) {
      this.$store.commit("vestIndex", index);
      if (this.userFixed) {
        this.$store.commit("setVestInfo", this.userList[index]);
      }
    },

    deleteVestItem(index) {
      Dialog.confirm({
        title: "确定删除该助手吗？",
        confirmButtonColor: "#05828C",
      })
        .then(async () => {
          const userList = this.userList;
          roomService.deleteVest(userList[index].id, () => {
            userList.splice(index, 1);
            this.userList = userList;
            if (this.userFixed) {
              this.$store.commit("setVestInfo", this.userList[this.vestIndex]);
            }
          });
        })
        .catch(() => {});
    },

    async send(msg) {
      const { id: room_id, group_id, type_name } = this.roomInfo;
      let user;
      if (this.userFixed) {
        user = this.userList[this.vestIndex] || {};
      } else {
        const randomIndex = Math.floor(
          Math.random() * this.randomUserList.length
        );
        user = this.randomUserList[randomIndex] || {};
      }

      roomService.saveLiveMsg(
        room_id,
        user.name,
        user.head_img,
        type_name,
        JSON.stringify(this.userTagList),
        msg,
        Date.parse(new Date()) / 1000,
        1,
        (res) => {
          const { tag, ...rest } = res;
          const chatMsg = { tag: this.userTagList, ...rest };
          this.$store.commit("setLiveChatMsgList", chatMsg);
          const message = this.tim.createTextMessage({
            to: group_id,
            conversationType: TIM.TYPES.CONV_GROUP,
            payload: {
              text: JSON.stringify({ data: chatMsg }),
            },
          });
          this.tim.sendMessage(message);
          Toast("发送成功");
        }
      );
    },

    confirmEditAssistant() {
      this.setUserList();
      this.assistantModalVisible = false;
    },

    confirmAddComment() {
      this.setPhraseList();
      this.commentModalVisible = false;
    },

    hideModal() {
      const { addCommentModalVisible, editAssistantModalVisible } = this.data;
      if (addCommentModalVisible)
        this.setData({ addCommentModalVisible: false });
      if (editAssistantModalVisible)
        this.setData({ editAssistantModalVisible: false });
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
.assistant-comments-popup {
  padding-bottom: env(safe-area-inset-bottom);
}

.menu-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  height: 50px;
}
.menu-list {
  display: flex;
}
.menu-item {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 30px;
  height: 30px;
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
  width: 76px;
  height: 2px;
  content: '';
  background: #FDCC87;
  border-radius: 1px;
}
.add-btn {
  width: 88px;
  height: 26px;
}

.random-part, .stable-part {
  padding-left: 15px;
  height: 360px;
  overflow-y: scroll;
  max-height: calc(100vh - 50px - env(safe-area-inset-bottom));
}
.tips {
  margin-right: 15px;
  padding: 12px;
  color: #333;
  font-size: 12px;
  line-height: 1.8;
  background: #F5F6F7;
  border-radius: 6px;
}
.comment-list {
  padding-right: 15px;
}
.comment-item {
  display: flex;
  align-items: center;
  height: 50px;
  border-bottom: 1px solid #F5F6F7;
}
.comment-item:last-child {
  border-bottom: none;
}
.comment-content {
  margin-right: 24rpx;
  flex: 1;
  color: #333;
  font-size: 14px;
  font-weight: bold;
}
.send-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 26px;
  color: #333;
  font-size: 12px;
  font-weight: bold;
  background: #FDCC87;
  border-radius: 4px;
}

.selected-assistant {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 86px;
  border-bottom: 1px solid #F5F6F7;
}
.assistant-info {
  display: flex;
  align-items: center;
}
.avatar-wrap {
  position: relative;
  width: 36px;
  height: 36px;
  font-size: 0;
  border-radius: 50%;
}
.avatar-wrap.selected {
  border: 2px solid #FB6155;
}
.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
}
.avatar.selected {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}
.selected-icon {
  position: absolute;
  right: -3px;
  bottom: -3px;
  width: 12px;
  height: 12px;
}
.delete-icon {
  position: absolute;
  right: -3.5px;
  top: -3.5px;
  width: 14px;
  height: 14px;
}
.avatar-wrap.selected > .delete-icon {
  right: -5.5px;
  top: -5.5px;
}
.name {
  margin-left: 8px;
  color: #333;
  font-size: 12px;
  font-weight: bold;
}
.edit-btns {
  display: flex;
  padding-right: 15px;
}
.edit-btn, .change-btn {
  margin-left: 20px;
  color: #3682EC;
  font-size: 12px;
  font-weight: bold;
}

.assistant-list {
  display: flex;
  flex-wrap: wrap;
  margin-top: 24px;
}
.assistant-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 20px;
  margin-bottom: 18px;
}
.assistant-name {
  margin-top: 5px;
  width: 40px;
  color: #333;
  font-size: 10px;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
</style>
