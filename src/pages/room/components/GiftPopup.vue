<template>
  <div>
    <div class="mask" :class="{ show }" @click="hide" />
    <div class="popup" :class="{ show }">
      <div class="gift-popup">
        <div class="main">
          <div class="menu" v-if="roomInfo.type_name">
            <div
              class="menu-item"
              :class="{ selected: index === curMenuIdx }"
              v-for="(item, index) in ['礼物', '主播特权']"
              :key="index"
              @click.stop="selectMenu(index)"
            >
              {{ item }}
            </div>
          </div>

          <div class="menu" v-if="!roomInfo.type_name">
            <div class="menu-item selected">礼物</div>
          </div>

          <Swipe class="gift-wrap custom-dots" v-if="curMenuIdx === 0">
            <SwipeItem v-for="(list, listIdx) in giftLists" :key="listIdx">
              <div class="gift-list">
                <div
                  class="gift-item"
                  v-for="item in list"
                  :key="item.id"
                  @click.stop="selectedGiftId = item.id"
                >
                  <img
                    class="selected-border"
                    v-if="selectedGiftId == item.id"
                    src="https://img.ubo.vip/youbo_plus/gift_popup/selected.png"
                  />
                  <img class="gift-image" :src="item.show_img" />
                  <div class="gift-name">{{ item.name }}</div>
                  <div class="gift-price">
                    <img
                      class="price-icon"
                      src="https://img.ubo.vip/youbo_plus/gift_popup/coin.png"
                    />
                    <div>{{ item.money }}</div>
                  </div>
                </div>
              </div>
            </SwipeItem>
          </Swipe>

          <Swipe class="gift-wrap custom-dots" v-if="curMenuIdx === 1">
            <SwipeItem
              v-for="(list, listIdx) in anchorGiftLists"
              :key="listIdx"
            >
              <div class="gift-list">
                <div
                  class="gift-item"
                  v-for="item in list"
                  :key="item.id"
                  @click.stop="selectedAnchorGiftId = item.id"
                >
                  <img
                    class="selected-border"
                    v-if="selectedAnchorGiftId == item.id"
                    src="https://img.ubo.vip/youbo_plus/gift_popup/selected.png"
                  />
                  <img class="gift-image" :src="item.show_img" />
                  <div class="gift-name">{{ item.name }}</div>
                  <div class="gift-desc">主播特权</div>
                </div>
              </div>
            </SwipeItem>
          </Swipe>

          <div class="btns-wrap">
            <div class="recharge-btn" @click.stop="showRechargePopup">
              <img
                class="balance-icon"
                src="https://img.ubo.vip/youbo_plus/gift_popup/coin.png"
              />
              <div class="balance">{{ balance || 0 }}</div>
              <div>充值</div>
              <img
                class="arrow"
                src="https://img.ubo.vip/youbo_plus/gift_popup/more.png"
              />
            </div>

            <div class="send-btn">
              <input class="send-num" v-model="num" type="number" />
              <div class="send-btn-main" @click.stop="send">赠送</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast, Swipe, SwipeItem } from "vant";
import { mapState } from "vuex";
import _ from "lodash";
import RoomService from "@/service/roomService";
const roomService = new RoomService();

export default {
  components: { Swipe, SwipeItem },

  props: {
    roomInfo: Object,
  },

  data() {
    return {
      show: false,
      curMenuIdx: 0,
      giftLists: [],
      anchorGiftLists: [],
      selectedGiftId: 0,
      selectedAnchorGiftId: 0,
      num: 1,
    };
  },

  computed: {
    ...mapState({
      balance: (state) => state.balance,
    }),
  },

  created() {
    this.setUserBalance();
    this.setGiftLists();

    setTimeout(() => {
      this.show = true;
    }, 50);
  },

  methods: {
    async setUserBalance() {
      const { num: balance } = (await roomService.getUserBalance()) || {};
      this.$store.commit("setBalance", balance);
    },

    selectMenu(index) {
      this.curMenuIdx = index;
      if (index === 1 && !this.anchorGiftLists.length) {
        this.setAnchorGiftLists();
      }
    },

    async setGiftLists() {
      const { list = [] } = (await roomService.getGiftList(1)) || {};
      this.selectedGiftId = list[0].id;
      this.giftLists = _.chunk(list, 8);
    },

    async setAnchorGiftLists() {
      const { list = [] } =
        (await roomService.getStudioGiftList(this.roomInfo.studio_id, 4)) || {};
      this.selectedAnchorGiftId = list[0].id;
      this.anchorGiftLists = _.chunk(list, 8);
    },

    send() {
      const { id, studio_id } = this.roomInfo;
      const {
        balance,
        curMenuIdx,
        giftLists,
        selectedGiftId,
        selectedAnchorGiftId,
        num,
      } = this;
      if (curMenuIdx === 0) {
        const giftPrice = _.flatten(giftLists).find(
          (item) => item.id == selectedGiftId
        ).money;
        if (giftPrice * num > balance) {
          Toast("余额不足，请充值");
          return;
        }
        roomService.sendGift(studio_id, id, selectedGiftId, num, () => {
          this.$store.commit("setBalance", balance - giftPrice * num);
        });
      } else {
        roomService.sendAnchorGift(studio_id, id, selectedAnchorGiftId, num);
      }
    },

    showRechargePopup() {
      this.triggerEvent("showRechargePopup");
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
  overflow: hidden
  z-index: 100
  transform: translate(-50%, 100%)
  transition: transform .2s ease
  &.show
    transform: translate(-50%, 0)
    transition: transform .3s ease
.gift-popup {
  padding-bottom: env(safe-area-inset-bottom);
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  border-radius: 10px 10px 0px 0px;
}

.main {
  padding: 8px 0;
}
.menu {
  display: flex;
  align-items: center;
  padding-left: 16px;
  height: 44px;
}
.menu-item {
  margin-right: 25px;
  height: 26px;
  color: #999;
  font-size: 14px;
  font-weight: 550;
}
.menu-item.selected {
  position: relative;
  color: #fff;
}
.menu-item.selected::after {
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  width: 20px;
  height: 2px;
  content: '';
  background: #FFFFFF;
  border-radius: 2px;
}

.gift-wrap {
  margin-top: 12px;
  height: 230px;
}
.gift-list {
  display: flex;
  flex-wrap: wrap;
  padding-left: 8px;
  height: 210px;
}
.gift-item {
  position: relative;
  margin-right: 1.2vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 23vw;
  max-width: 23vh;
  height: 100px;
}
.gift-item:nth-child(4n) {
  margin-right: 0;
}
.selected-border {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}
.gift-image {
  margin-top: 5px;
  width: 50px;
  height: 50px;
}
.gift-name {
  margin-top: 5px;
  color: #fff;
  font-size: 12px;
}
.gift-price {
  display: flex;
  align-items: center;
  margin-top: 2px;
  color: #fff;
  font-size: 10px;
}
.price-icon {
  margin-right: 1px;
  width: 10px;
  height: 10px;
}
.gift-desc {
  margin-top: 2px;
  color: #fff;
  font-size: 10px;
}

.btns-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
}
.recharge-btn {
  display: flex;
  align-items: center;
  color: #FFD514;
  font-size: 14px;
}
.balance-icon {
  margin-right: 1px;
  width: 14px;
  height: 14px;
}
.balance {
  margin-right: 30px;
  color: #fff;
}
.arrow {
  width: 12px;
  height: 12px;
}

.send-btn {
  display: flex;
  align-items: center;
  width: 136px;
  height: 32px;
  background: rgba(134,66,185,0.1);
  border-radius: 16px;
  border: 1px solid #FDCC87;
}
.send-num {
  width: 66px;
  color: #fff;
  font-size: 12px;
  text-align: center;
}
.send-btn-main {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 68px;
  height: 32px;
  color: #404A5C;
  font-size: 14px;
  background: linear-gradient(315deg, #DAB174 0%, #FFE5BD 100%);
  border-radius: 16px;
}
</style>
