<template>
  <Popup v-model="show" @click-overlay="hide" round position="bottom">
    <div class="main">
      <div class="header row center">
        <div class="title">历史记录</div>
        <div
          class="clear-btn row"
          v-if="historyList.length"
          @click="clearHistory"
        >
          <img
            class="clear-icon"
            src="../images/history-popup/clear.png"
            alt=""
          />
          <div>清除</div>
        </div>
      </div>
      <List
        v-model="loading"
        :finished="finished"
        @load="onLoadMore"
        :finished-text="historyList.length && finished ? '没有更多了' : ''"
      >
        <ul class="history-list">
          <li
            class="history-item row"
            v-for="item in historyList"
            :key="item.id"
            @click="navToChatPage(item)"
          >
            <img
              class="chat-icon"
              src="../images/history-popup/chat.png"
              alt=""
            />
            <div class="chat-content omit">{{ item.last_content }}</div>
            <img
              class="delete-icon"
              @click.stop="deleteHistory(item.id)"
              src="../images/history-popup/delete.png"
              alt=""
            />
          </li>
        </ul>

        <Empty
          v-if="!historyList.length && finished"
          description="暂无历史记录"
        />
      </List>
    </div>
  </Popup>
</template>

<script>
import { Popup, List, Empty, Dialog } from "vant";

import router from '@/router'
import AiService from "../utils/aiService";

const aiService = new AiService();

export default {
  components: { Popup, List, Empty },

  props: {
    visible: Boolean,
  },

  data() {
    return {
      show: false,
      loading: false,
      finished: false,
      historyList: [],
    };
  },

  computed: {
    _visible() {
      return this.visible;
    },
  },

  watch: {
    visible: function(truthy) {
      this.show = truthy;
      if (truthy) {
        this.setHistroryList(true);
      }
    },
  },

  methods: {
    onLoadMore() {
      this.setHistroryList();
    },

    async setHistroryList(init = false) {
      if (init) {
        this.finished = false;
        this.page = 0;
      }
      const { list = [] } =
        (await aiService.getHistorySessionList(++this.page)) || {};
      this.historyList = init ? list : [...this.historyList, ...list];

      if (this.loading) this.loading = false;
      if (!list.length && !this.finished) this.finished = true;
    },

    deleteHistory(id) {
      Dialog.confirm({
        title: "确认删除",
        message: "请注意，删除历史记录后，该问题的所有回答将不再保留",
        confirmButtonColor: "#4C75F7",
      })
        .then(async () => {
          await aiService.deleteSession(id);
          this.setHistroryList(true);
        })
        .catch(() => {});
    },

    clearHistory() {
      Dialog.confirm({
        title: "确认清楚历史记录",
        message: "是否确认清除所有历史记录",
        confirmButtonColor: "#4C75F7",
      })
        .then(async () => {
          await aiService.clearSessionHistory();
          this.setHistroryList(true);
        })
        .catch(() => {});
    },

    navToChatPage({ id: sessionId, gpt_assistant_id: assistantId }) {
      if (assistantId) {
        router.push(`/ai/assistant_mode?assistantId=${assistantId}`);
      } else {
        router.push(`/ai/chat?sessionId=${sessionId}`);
      }
    },

    hide() {
      this.$emit("hide");
    },
  },
};
</script>

<style lang="stylus" scoped>
.row
  display: flex
  align-items: center
  &.center
    justify-content: center
  &.between
    justify-content: space-between
.omit
  overflow: hidden
  text-overflow: ellipsis
  display: -webkit-box
  -webkit-line-clamp: 1
  -webkit-box-orient: vertical
.main
  height: 7.8rem
  .header
    position: relative
    height: 1rem
    color: #333
    font-size: .32rem
    font-weight: 500
    border-bottom: 1px solid #EAEAEA
    .clear-btn
      position: absolute
      top: 50%
      right: .3rem
      transform: translateY(-50%)
      color: #333
      font-size: .24rem
      .clear-icon
        margin-right: .04rem
        width: .28rem
        height: .28rem
  .history-list
    padding: 0 .3rem
    .history-item
      height: .86rem
      border-bottom: 1px solid #EAEAEA
      &:last-child
        border-bottom: none
      .chat-icon, .delete-icon
        width: .32rem
        height: .32rem
      .chat-content
        padding: 0 .08rem
        flex: 1
        color: #333
        font-size: .28rem
</style>
