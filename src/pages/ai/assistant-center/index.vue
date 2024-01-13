<template>
  <div class="container">
    <img class="bg" src="../images/bg.png" alt="" />

    <PullRefresh v-model="refreshing" @refresh="onRefresh">
      <List
        v-model="loading"
        :finished="finished"
        @load="onLoadMore"
        :finished-text="finishText"
      >
        <div class="main">
          <div class="menu row">
            <div
              class="menu-item row center"
              v-for="(item, index) in menuList"
              :key="index"
              @click="selectMenu(index)"
            >
              {{ item }}
            </div>
            <div class="slider row center" :class="{ mine: curMenuIdx === 1 }">
              {{ menuList[curMenuIdx] }}
            </div>
          </div>

          <div class="sub-menu row" v-if="curMenuIdx === 0">
            <div
              class="sub-menu-item row center"
              :class="{ active: index === curSubMenuIdx }"
              v-for="(item, index) in assistantTypeList"
              :key="index"
              @click="selectTypeMenu(index)"
            >
              {{ item.name }}
            </div>
          </div>

          <div class="mine-menu-wrap row" v-if="curMenuIdx === 1">
            <div
              class="editting-btn row center"
              v-if="curMineMenuIdx === 0"
              @click="isEditing = !isEditing"
            >
              {{ isEditing ? "取消" : "选择" }}
            </div>
          </div>

          <div class="assistant-cards" v-if="curMenuIdx === 0">
            <AssistantCard
              v-for="item in assistantList"
              :key="item.id"
              :item="item"
            />
          </div>
          <div
            class="assistant-cards"
            v-if="curMenuIdx === 1 && curMineMenuIdx === 0"
          >
            <AssistantCard
              v-for="item in userAssistantList"
              :key="item.id"
              :item="item"
              :isEditing="isEditing"
              @toggleSelected="item.selected = !item.selected"
            />
          </div>
          <div
            class="assistant-cards"
            v-if="curMenuIdx === 1 && curMineMenuIdx === 1"
          >
            <AssistantCard
              v-for="item in mineAssistantList"
              :key="item.id"
              :item="item"
            />
          </div>

          <div
            class="empty-illus"
            v-if="
              finished &&
                ((curMenuIdx === 0 && !assistantList.length) ||
                  (curMenuIdx === 1 &&
                    curMineMenuIdx === 0 &&
                    !userAssistantList.length))
            "
          >
            <img class="empty" src="../images/empty.png" alt="" />
            <div class="empty-desc">暂无助手列表</div>
          </div>
          <div
            class="empty-illus"
            v-if="
              curMenuIdx === 1 &&
                curMineMenuIdx === 1 &&
                finished &&
                !myuserAssistantList.length
            "
          >
            <img class="empty" src="../images/empty.png" alt="" />
            <div class="empty-desc">您还没有创建过助手，快去创建一个吧</div>
          </div>
        </div>
      </List>
    </PullRefresh>

    <div
      class="create-assistant-btn row center"
      v-if="curMenuIdx === 1 && curMineMenuIdx === 1"
      @click="createAssistant"
    >
      创建助手
    </div>

    <div class="bottom-bar row between" v-if="isEditing">
      <div class="all-select-btn row">
        <img
          class="all-select-icon"
          :src="
            allSelected
              ? require('../images/selected.png')
              : require('../images/unselected.png')
          "
          alt=""
          @click="toggleAllSelected"
        />
        全选
      </div>
      <div class="selected-count-desc">
        <span>已选择</span>
        <span style="color: #05828C;">{{ selectedCount }}</span>
        <span>个助手</span>
      </div>
      <div class="delete-btn row" @click="deleteCard">
        <img class="delete-icon" src="../images/delete.png" alt="" />
        <div>移除</div>
      </div>
    </div>
  </div>
</template>

<script>
import { PullRefresh, List, Dialog, Toast } from "vant";
import AssistantCard from "../components/AssistantCard";

import router from '@/router'
import AiService from "../utils/aiService";

const aiService = new AiService();

export default {
  components: { PullRefresh, List, AssistantCard },

  data() {
    return {
      loading: false,
      finished: false,
      refreshing: false,
      menuList: ["助手中心", "我的助手"],
      assistantTypeList: [],
      curMenuIdx: 0,
      curSubMenuIdx: 0,
      curMineMenuIdx: 0,
      assistantList: [],
      userAssistantList: [],
      mineAssistantList: [],
      myuserAssistantList: [],
      isEditing: false,
    };
  },

  computed: {
    allSelected() {
      return (
        this.userAssistantList.filter((item) => item.selected).length ===
        this.userAssistantList.length
      );
    },
    selectedCount() {
      return this.userAssistantList.filter((item) => item.selected).length;
    },
    finishText() {
      return this.finished &&
        ((this.curMenuIdx === 0 && this.assistantList.length) ||
          (this.curMenuIdx === 1 &&
            ((this.curMineMenuIdx === 0 && this.userAssistantList.length) ||
              (this.curMineMenuIdx === 1 && this.mineAssistantList.length))))
        ? "没有更多了"
        : "";
    },
  },

  async created() {
    await this.setAssistantTypeList();
    this.setAssistantList(true);
  },

  methods: {
    onLoadMore() {
      if (this.assistantTypeList.length) {
        this.setList();
      }
    },

    onRefresh() {
      this.setList(true);
    },

    setList(init = false) {
      if (this.curMenuIdx === 0) {
        this.setAssistantList(init);
      } else {
        if (this.curMineMenuIdx === 0) {
          this.setUserAssistantList(init);
        } else {
          this.setMineAssistantList(init);
        }
      }
    },

    async setAssistantTypeList() {
      const { list = [] } = (await aiService.getAssistantTypeList()) || {};
      this.assistantTypeList = list;
    },

    async setAssistantList(init = false) {
      if (init || !this.page) {
        this.finished = false;
        this.page = 0;
        this.assistantList = [];
      }
      const { list = [] } =
        (await aiService.getAssistantList({
          type: this.assistantTypeList[this.curSubMenuIdx].value,
          page: ++this.page,
        })) || {};
      this.assistantList = init ? list : [...this.assistantList, ...list];
      if (this.loading) this.loading = false;
      if (this.refreshing) this.refreshing = false;
      if (!list.length && !this.finished) this.finished = true;
    },

    async setUserAssistantList(init = false) {
      if (init || !this.page) {
        this.finished = false;
        this.page = 0;
        this.userAssistantList = [];
      }
      let { list = [] } =
        (await aiService.getUserAssistantList({ page: ++this.page })) || {};
      list = list.map((item) => ({ ...item, selected: false, is_add: 1 }));
      this.userAssistantList = init
        ? list
        : [...this.userAssistantList, ...list];
      if (this.loading) this.loading = false;
      if (this.refreshing) this.refreshing = false;
      if (!list.length && !this.finished) this.finished = true;
    },

    async setMineAssistantList(init = false) {
      if (init || !this.page) {
        this.finished = false;
        this.page = 0;
        this.mineAssistantList = [];
      }
      const { list = [] } =
        (await aiService.getAssistantList({
          user_id: -1,
          page: ++this.page,
        })) || {};
      this.mineAssistantList = init
        ? list
        : [...this.mineAssistantList, ...list];
      if (this.loading) this.loading = false;
      if (this.refreshing) this.refreshing = false;
      if (!list.length && !this.finished) this.finished = true;
    },

    selectMenu(index) {
      this.curMenuIdx = index;
      this.setList(true);
      this.isEditing = false;
    },

    selectTypeMenu(index) {
      this.curSubMenuIdx = index;
      this.setList(true);
    },

    selectMineMenu(index) {
      this.curMineMenuIdx = index;
      this.setList(true);
      this.isEditing = false;
    },

    toggleAllSelected() {
      this.userAssistantList = this.userAssistantList.map((item) => ({
        ...item,
        selected: !this.allSelected,
      }));
    },

    deleteCard() {
      if (!this.selectedCount) {
        return;
      }

      Dialog.confirm({
        title: "确认移除",
        message: "请注意，移除助手会清空与该助手的历史对话",
        confirmButtonColor: "#05828C",
      })
        .then(async () => {
          const ids = this.userAssistantList
            .filter((item) => item.selected)
            .map((item) => item.id)
            .join();
          await aiService.unAddUserAssistant(ids);
          this.setList(true);
        })
        .catch(() => {});
    },

    createAssistant() {
      // router.push("/ai/assistant_create");
      Toast("功能暂未开放，敬请期待");
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
  -webkit-line-clamp: 2
  -webkit-box-orient: vertical
.container
  position: relative
  .bg
    position: fixed
    top: 0
    left: 0
    width: 100vw
  .main
    padding: .24rem
    .menu
      position: relative
      margin: 0 auto
      width: 6.3rem
      height: .88rem
      border-radius: .44rem
      background: #fff
      .menu-item
        flex: 1
        color: #9598C1
        font-size: .28rem
      .slider
        position: absolute
        left: .06rem
        top: .06rem
        width: 3.1rem
        height: .76rem
        color: #fff
        font-size: .28rem
        font-weight: 500
        background: #05828C
        border-radius: .38rem
        &.mine
          left: 3.14rem
    .sub-menu
      margin-top: .2rem
      flex-wrap: nowrap
      overflow-x: scroll
      .sub-menu-item
        margin-right: .2rem
        padding: 0 .54rem
        height: .6rem
        color: #494970
        font-size: .28rem
        white-space: nowrap
        border-radius: .3rem
        background: #F1F5FF
        &.active
          color: #fff
          font-weight: 500
          background: #05828C
    .mine-menu-wrap
      margin-top: .2rem
      justify-content: flex-end
      .editting-btn
        margin-left: .3rem
        width: 1.24rem
        height: .5rem
        color: #fff
        font-size: .24rem
        font-weight: 500
        border-radius: .25rem
        background: #05828C
    .assistant-cards
      display: flex
      flex-wrap: wrap
      justify-content: space-between
      margin-top: .12rem
    .empty-illus
      margin: 1.4rem auto
      text-align: center
      font-size: 0
      .empty
        width: 4rem
        height: 4rem
      .empty-desc
        margin-top: .1rem
        color: #494970
        font-size: .28rem
  .create-assistant-btn
    position: fixed
    left: 50%
    bottom: 1rem
    transform: translateX(-50%)
    width: 4.4rem
    height: .92rem
    color: #fff
    font-size: .32rem
    font-weight: 500
    border-radius: .46rem
    background: #6178FF
  .bottom-bar
    position: fixed
    left: 0
    bottom: 0
    padding: .24rem .24rem .8rem
    width: 100%
    background: #fff
    .all-select-btn, .selected-count-desc, .delete-btn
      color: #333
      font-size: .28rem
    .all-select-btn
      font-weight: 500
    .all-select-icon, .delete-icon
      margin-right: .08rem
      width: .36rem
      height: .36rem
</style>
