<template>
  <div class="gift-animation" :class="{ show }">
    <div class="gift-content">
      <img
        class="fans-avatar"
        :src="
          giftInfo
            ? giftInfo.head_img
            : 'https://img.ubo.vip/mp/default-ubo-icon.png'
        "
      />
      <div class="fans-info">
        <div class="fans-name omit">
          {{ giftInfo ? (giftInfo.user_name | formatName) : "" }}
        </div>
        <div class="fans-gift-desc omit">
          打赏“{{ giftInfo ? giftInfo.studio_name : "" }}”
        </div>
      </div>
      <img class="gift-img" :src="giftInfo ? giftInfo.show_img : ''" />
    </div>
    <div class="gift-amount" :class="{ show: showAmount }">
      <img class="multiple-sign" src="../../../assets/images/gift/x.png" />
      <img
        class="gift-num"
        v-for="(item, index) in numList"
        :key="index"
        :src="require(`../../../assets/images/gift/${item}.png`)"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    giftInfo: Object,
  },

  data() {
    return {
      numList: [],
      show: false,
      showAmount: false,
    };
  },

  watch: {
    giftInfo(newVal, oldVal) {
      console.log('giftInfo newVal', newVal)
      console.log('giftInfo oldVal', oldVal)
      if (newVal) {
        const num = `${newVal.num}`;
        this.numList = new Array(num.length)
          .fill("")
          .map((item, index) => num.slice(index, index + 1));

        if (!oldVal) {
          this.show = true;
          setTimeout(() => {
            this.showAmount = true;
          }, 200);
        } else {
          this.showAmount = false;
          setTimeout(() => {
            this.showAmount = true;
          }, 200);
        }
      } else {
        this.show = false;
        this.showAmount = false;
      }
    },
  },

  filters: {
    formatName(name) {
      return name.length > 4 ? `${name.slice(0, 4)}...` : name;
    },
  },
};
</script>

<style lang="stylus" scoped>
.omit {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  line-height: 1;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.gift-animation {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
  height: 114rpx;
  transform: translateX(-110%);
}
.gift-animation.show {
  transform: translateX(0);
  transition: transform .2s ease;
}
.gift-content {
  position: relative;
  display: flex;
  align-items: center;
  width: 168px;
  height: 40px;
  background-image: url('https://img.ubo.vip/youbo_plus/gift_animation/bg.png');
  background-size: 100%;
  background-repeat: no-repeat;
}
.fans-avatar {
  margin: 0 5px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
}
.fans-info {
  margin-right: 53px;
  flex: 1;
  color: #fff;
  font-size: 11px;
}
.fans-gift-desc {
  margin-top: 4px;
}

.gift-img {
  position: absolute;
  right: 8px;
  bottom: 6px;
  width: 40px;
  height: 40px;
}

.gift-amount {
  display: flex;
  align-items: flex-end;
  margin-left: 6px;
  transform: scale(0.2);
}
.gift-amount.show {
  transform: scale(1);
  transition: .2s ease;
}
.multiple-sign {
  margin-right: 2px;
  width: 16px;
  height: 14px;
}
.gift-num {
  width: 24px;
  height: 23px;
}
</style>
