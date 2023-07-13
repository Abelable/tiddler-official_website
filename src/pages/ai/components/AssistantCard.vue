<template>
  <div
    class="assistant-card"
    :class="{ nomore: hideMore }"
    @click.stop="select"
  >
    <img class="watermark" src="../images/watermark.png" alt="" />
    <div class="card-tag" :style="{ color: info.color }">
      {{ info.name.slice(0, 1) }}
    </div>
    <img
      class="select-icon"
      v-if="isEditing"
      :src="
        info.selected
          ? require('../images/selected.png')
          : require('../images/unselected.png')
      "
      alt=""
    />
    <div class="card-title omit single-line" :style="{ color: info.color }">
      {{ info.name }}
    </div>
    <div class="card-content">
      <div class="omit">{{ info.desc }}</div>
    </div>
    <div class="more row between" v-if="!hideMore">
      <div></div>
      <div class="add-btn row" v-if="!info.is_add" @click.stop="add">
        <img class="add-icon" src="../images/add.png" alt="" />
        <div>添加</div>
      </div>
      <div class="done-tag row" v-if="info.is_add">
        <img class="done-icon" src="../images/done.png" alt="" />
        <div>已添加</div>
      </div>
    </div>
  </div>
</template>

<script>
import router from '@/router'
import AiService from "../utils/aiService";

const aiService = new AiService();

export default {
  props: {
    item: Object,
    isEditing: Boolean,
    hideMore: Boolean,
  },

  data() {
    return {
      info: {},
    };
  },

  watch: {
    "item.selected": function(truthy) {
      this.info.selected = truthy;
    },
  },

  created() {
    this.info = { ...this.item };
  },

  methods: {
    add() {
      aiService.addUserAssistant(this.info.id);
      this.info = { ...this.info, is_add: 1 };
    },

    select() {
      if (this.isEditing) {
        this.$emit("toggleSelected");
      } else {
        router.push(`/ai/assistant_mode?assistantId=${this.info.id}`);
      }
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
  &.single-line
    -webkit-line-clamp: 1
.assistant-card
  position: relative
  display: flex
  flex-direction: column
  margin-top: 0.18rem
  padding: 0.16rem
  width: 3.4rem
  height: 1.94rem
  border: 1px solid #EDF2FF
  border-radius: .16rem
  background: #fff
  &.nomore
    width: 3.06rem
    height: 1.6rem
  .watermark
    position: absolute
    top: 50%
    left: 50%
    transform: translate(-50%, -50%)
    width: 1.38rem
    height: 0.36rem
  .card-tag
    position: absolute
    top: 0.12rem
    right: 0.12rem
    font-size: .4rem
    opacity: 0.2
  .select-icon
    position: absolute
    top: 0.12rem
    right: 0.12rem
    width: .32rem
    height: .32rem
  .card-title
    max-width 2.6rem
    font-size: .28rem
    font-weight: 500
  .card-content
    margin-top: .1rem
    flex: 1
    color: #9497C0
    font-size: .24rem
  .more
    .add-icon, .done-icon
      margin-right: .04rem
      width: .24rem
      height: .24rem
    .add-btn
      color: #333
      font-size: .2rem
    .done-tag
      color: #6BC04E
      font-size: .2rem
</style>
