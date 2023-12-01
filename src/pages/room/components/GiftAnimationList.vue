<template>
  <view class="gift-animation-list">
    <GiftAnimation
      v-for="(item, index) in msgLists"
      :key="index"
      :giftInfo="item"
    />
  </view>
</template>

<script>
import GiftAnimation from "./GiftAnimation";

export default {
  components: { GiftAnimation },

  props: {
    giftMsgLists: Array,
  },

  data() {
    return {
      msgLists: [null, null, null, null],
    };
  },

  watch: {
    giftMsgLists(val) {
      if (val.length) {
        let item = val[val.length - 1];
        let index = -1;
        for (let i = 0; i < this.msgLists.length; i++) {
          if (this.msgLists[i]) {
            const { user_id, gift_id } = this.msgLists[i];
            if (item.user_id === user_id && item.gift_id === gift_id) {
              index = i;
              break;
            }
          } else index = i;
        }
        if (index !== -1) this.setMsgList(index, item);
        else {
          if (!this.cache) this.cache = [];
          this.cache.push(item);
        }
      }
    },
  },

  created() {
    this.timeoutArr = [null, null, null, null];
  },

  methods: {
    setMsgList(index, item) {
      const curItem = this.msgLists[index];
      if (curItem) {
        clearTimeout(this.timeoutArr[index]);
        item.num = Number(item.num) + Number(curItem.num);
      }
      this.$set(this.msgLists, index, item);
      this.timeoutArr[index] = setTimeout(() => {
        this.$set(this.msgLists, index, null);
        if (this.cache && this.cache.length) {
          this.setMsgList(index, this.cache[this.cache.length - 1]);
          this.cache.pop();
        }
      }, 3000);
    },
  },
};
</script>

<style lang="stylus" scoped>
.gift-animation-list {
  width: fit-content;
}
</style>
