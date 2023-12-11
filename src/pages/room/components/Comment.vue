<template>
  <div
    class="msg-list-wrap"
    ref="msgListWrap"
    @touchstart="touchStart"
    @touchend="touchEnd"
    v-if="liveChatMsgList.length"
  >
    <ul class="msg-list">
      <li
        class="msg-item"
        v-for="(item, index) in liveChatMsgList"
        :key="index"
      >
        <div
          class="inner"
          :class="{ small: size == 1, middle: size == 2, large: size == 3 }"
          v-if="item.is_gift_msg"
          @click.stop="showDeleteBtn(index)"
        >
          <div class="gift-msg">
            <div class="gift-msg-content">
              <span style="color: #FDDF6A;" v-if="!isAnchor && (anonymoused || extraAnonymoused)">{{item.user_name | sliceName}}</span>
              <span style="color: #FDDF6A;" v-if="isAnchor || (anonymoused && extraAnonymoused)">{{item.user_name}}</span>
              <span> 送给 </span>
              <span style="color: #FDDF6A;">{{ item.studio_name }}</span>
            </div>
            <img class="gift-img" :src="item.show_img" />
            <div class="gift-num">x{{ item.num }}</div>
          </div>
        </div>

        <div
          class="inner"
          :class="{
            small: size == 1,
            middle: size == 2,
            large: size == 3,
          }"
          v-if="!item.is_gift_msg"
          @click.stop="showDeleteBtn(index)"
        >
          <img
            class="avatar"
            :class="{
              small: size == 1,
              middle: size == 2,
              large: size == 3,
              'is-draw-msg': item.is_draw_msg,
            }"
            v-if="
              item.head_img && (isAnchor || (!isAnchor && !extraAnonymoused))
            "
            :src="`${item.head_img}?x-oss-process=img/resize,w_78,h_78`"
            @click.stop="manageUser(item.user_id)"
          />
          <div
            class="tag"
            :class="{
              small: size == 1,
              middle: size == 2,
              large: size == 3,
              anchor: item.type_name === '创建者',
              'live-assistant': item.type_name === '直播助手',
              assistant: item.type_name === '小助手',
            }"
            v-if="isAnchor && item.type_name"
          >
            {{ item.type_name }}
          </div>
          <div
            class="tag"
            :class="{
              small: size == 1,
              middle: size == 2,
              large: size == 3,
            }"
            :style="{ color: tag.font_color, background: tag.bg_color }"
            v-for="(tag, tagIdx) in isAnchor ? item.tag : []"
            :key="tagIdx"
            wx:for-item="tag"
          >
            {{ tag.tag_name }}
          </div>
          <span class="msg-user-name" v-if="item.nick_name && !isAnchor && (anonymoused || extraAnonymoused)">
            {{ item.nick_name | sliceName }}：
          </span>
          <span class="msg-user-name" v-if="item.nick_name && isAnchor || (!anonymoused && !extraAnonymoused)">
            {{item.nick_name}}：
          </span>
          <span
            class="message-content"
            v-if="item.is_ban && item.is_ban == 1 && isAnchor"
            >(已禁言)</span
          >
          <span
            class="message-content"
            v-if="item.is_sensitive && item.is_sensitive == 1 && isAnchor"
            >(含敏感词)</span
          >
          <span class="message-content">{{ item.message }}</span>
        </div>

        <div
          class="delete-btns"
          :class="{ bottom: index === 0, top: index !== 0 }"
          v-if="selectedMsgIdx === index && item.id"
        >
          <div class="delete-btn" @click.stop="deleteCurMsg">删除此条</div>
          <div class="delete-btn" @click.stop="deleteCurUserMsg">
            删除此人全部消息
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  props: {
    roomId: String,
    isAnchor: Boolean,
    size: Number,
  },

  computed: {
    ...mapState({
      userID: (state) => state.im.userID,
      liveChatMsgList: (state) => state.im.liveChatMsgList,
      anonymoused: (state) => state.im.anonymoused,
      extraAnonymoused: (state) => state.im.extraAnonymoused,
      selectedMsgIdx: (state) => state.selectedMsgIdx,
    }),
  },

  watch: {
    liveChatMsgList() {
      this.autoScrollAbel && this.scrollToBottom();
    },
  },

  filters: {
    sliceName(name) {
      if (name) {
        if (name.length === 1) {
          return "*";
        } else if (name.length === 2) {
          return "*" + name.slice(-1);
        } else {
          return (
            name.slice(0, 1) +
            name
              .slice(1, -1)
              .split("")
              .map(function() {
                return "*";
              })
              .join("") +
            name.slice(-1)
          );
        }
      }
    }
  },

  data() {
    return {
      autoScrollAbel: true,
    };
  },

  methods: {
    touchstart(index) {
      console.log('touchstart')
      clearTimeout(this.touchTimeout);
      this.touchTimeout = setTimeout(() => {
        this.showDeleteBtn(index);
      }, 500);
    },

    touchmove() {
      console.log('touchmove')
      clearTimeout(this.touchTimeout);
    },

    touchend(id) {
      console.log('touchend')
      if (this.touchTimeout) {
        clearTimeout(this.touchTimeout);
        id && this.$emit("manageUser", id);
      }
      id && this.$emit("manageUser", id);
    },

    manageUser(id) {
      this.$emit("manageUser", id);
    },

    showDeleteBtn(index) {
      this.$store.commit("setSelectedMsgIdx", index);
    },

    scrollToBottom() {
      this.$nextTick(() => {
        this.$refs.msgListWrap.scrollTop = this.$refs.msgListWrap.scrollHeight;
      });
    },

    touchStart() {
      this.autoScrollAbel = false;
    },

    touchEnd() {
      this.autoScrollAbel = true;
    },
  },
};
</script>

<style lang="stylus">
.msg-list-wrap
  margin-bottom: .1rem
  width 5.46rem
  max-height 6rem
  overflow-y scroll
  scrollbar-width none
  -ms-overflow-style none
  -webkit-overflow-scrolling touch
  mask-img linear-gradient(180deg,transparent,#000 20%)
  &::-webkit-scrollbar
    display none
.msg-item {
  position: relative;
  margin-bottom: 6px;
  overflow: inherit;
}

.inner {
  padding: 9px 8px;
  width: fit-content;
  font-weight: 500;
  border-radius: 6px;
  color: #fff;
  background: rgba(0, 0, 0, 0.4);
}
.inner.is-draw-msg {
  color: #404A5C;
  background: linear-gradient(315deg, #DAB174 0%, #FFE5BD 100%);
}
.inner.small {
  font-size: 11px;
  line-height: 18px;
}
.inner.middle {
  font-size: 13px;
  line-height: 20px;
}
.inner.large {
  font-size: 15px;
  line-height: 22px;
}

.avatar {
  vertical-align: top;
  border-radius: 50%;
}
.avatar.small {
  margin-right: 4px;
  margin-top: -2px;
  width: 22px;
  height: 22px;
}
.avatar.middle {
  margin-right: 4px;
  margin-top: -2px;
  width: 26px;
  height: 26px;
}
.avatar.large {
  margin-right: 6px;
  margin-top: -2.5px;
  width: 28px;
  height: 28px;
}

.tag {
  display: inline-block;
  margin-right: 5px;
  vertical-align: top;
  padding: 0 6px;
  font-weight: bold;
  border-radius: 3px;
}
.tag.small {
  margin-top: 1.45px;
  font-size: 9px;
  height: 16px;
  line-height: 16px;
}
.tag.middle {
  margin-top: 1.5px;
  font-size: 11px;
  height: 18px;
  line-height: 18px;
}
.tag.large {
  margin-top: 0.5px;
  font-size: 13px;
  height: 20px;
  line-height: 20px;
}
.tag.anchor {
  color: #FFE5BD;
  background: linear-gradient(128deg, #404A5C 0%, #0F131A 100%);
}
.tag.assistant {
  color: #404A5C;
  background: #E7CCFF;
}
.tag.live-assistant {
  color: #404A5C;
  background: #FFBCDF;
}

.msg-user-name {
  margin-right: 5px;
  color: #FDDF6A;
  vertical-align: top;
}
.message-content {
  vertical-align: top;
}

.delete-btns {
  position: absolute;
  left: 0;
  display: flex;
  align-items: center;
  width: 237px;
  height: 38px;
  background: #fff;
  border-radius: 10px;
  overflow: inherit;
}
.delete-btns.top {
  top: -44px;
  z-index: 1;
}
.delete-btns.bottom {
  bottom: -44px;
  z-index: 1;
}
.delete-btns.top::after, .delete-btns.bottom::after {
  position: absolute;
  left: 15px;
  width: 0;
  height: 0;
  content: '';
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
}
.delete-btns.top::after {
  bottom: -6px;
  border-top: 6px solid #fff;
}
.delete-btns.bottom::after {
  top: -6px;
  border-bottom: 6px solid #fff;
}
.delete-btn {
  display: flex;
  align-items: center;
  padding: 0 20px;
  color: #333;
  font-size: 13px;
  font-weight: bold;
  white-space: nowrap;
}
.delete-btn:first-child {
  height: 30px;
  color: #BA9243;
  border-right: 1px solid #ECECEC;
}

.gift-msg {
  display: flex;
  align-items: center;
}
.gift-msg-content {
  flex: 1;
  color: #fff;
}
.gift-img {
  margin-left: 9px;
  width: 24px;
  height: 24px;
}
.gift-num {
  margin-left: 4px;
  color: #fff;
  font-size: 13px;
}
</style>
