<template>
  <div>
    <div class="mask" :class="{ show }" @click="hide" />
    <div class="popup" :class="{ show }">
      <div class="enter-animation-popup">
        <div class="header">
          <img
            class="back-icon"
            @click.stop="back"
            src="https://img.ubo.vip/mp/index/room/rank/back-arrow.png"
          />
          <div class="title">进场动画选择（1/2）</div>
        </div>

        <div class="content">
          <div v-if="step === 0">
            <div class="menu-tabs">
              <div
                class="menu-tab"
                :class="{ active: curMenuIdx === index }"
                v-for="(item, index) in ['进场动画', '走马灯']"
                :key="index"
                @click.stop="selectMenu(index)"
              >
                {{ item }}
              </div>
            </div>

            <div class="selections" v-if="curMenuIdx === 0">
              <div
                class="selection"
                v-for="(item, index) in animationList"
                :key="index"
                @click.stop="selectAnimation(index)"
              >
                <div
                  class="animation-wrap"
                  :class="{ selected: selectedAnimationIdx === index }"
                >
                  <img
                    class="animation"
                    :src="item.show_img"
                    mode="aspectFill"
                  />
                  <div class="time-desc" v-if="item.is_select == 1">
                    <img
                      class="time-icon"
                      src="https://img.ubo.vip/youbo_plus/time-icon.png"
                    />
                    <div>{{ item.remainder }}</div>
                  </div>
                  <img
                    class="selected-icon"
                    v-if="item.is_select == 1"
                    src="https://img.ubo.vip/youbo_plus/selected.png"
                  />
                </div>
                <div class="selection-desc">{{ item.name }}</div>
              </div>
            </div>

            <div class="selections" v-if="curMenuIdx === 1">
              <div
                class="selection"
                v-for="(item, index) in bannerList"
                :key="index"
                @click.stop="selectBanner(index)"
              >
                <div
                  class="animation-wrap"
                  :class="{ selected: selectedBannerIdx === index }"
                >
                  <img class="banner" :src="item.show_img" />
                  <div class="time-desc" v-if="item.is_select == 1">
                    <img
                      class="time-icon"
                      src="https://img.ubo.vip/youbo_plus/time-icon.png"
                    />
                    <div>{{ item.remainder }}</div>
                  </div>
                  <img
                    class="selected-icon"
                    v-if="item.is_select == 1"
                    src="https://img.ubo.vip/youbo_plus/selected.png"
                  />
                </div>
                <div class="selection-desc">{{ item.name }}</div>
              </div>
            </div>
          </div>

          <div class="time-setting" v-if="step === 1">
            <div class="time-selections">
              <div
                class="time-selection"
                :class="{ selected: curTimeOptionIdx === index }"
                v-for="(item, index) in timeOptions"
                :key="index"
                @click.stop="selectTime(index)"
              >
                <div>{{ item.name }}</div>
                <img
                  class="time-selected-icon"
                  v-if="curTimeOptionIdx === index"
                  src="https://img.ubo.vip/youbo_plus/time-selected.png"
                />
              </div>
            </div>
            <div
              class="custom-time"
              v-if="curTimeOptionIdx === timeOptions.length - 1"
            >
              <div class="custom-time-label">自定义时长</div>
              <input
                class="custom-time-input"
                type="number"
                v-model="customTime"
                placeholder="请输入要设置的天数，最大不超过999天"
              />
            </div>
          </div>
        </div>

        <div class="btn" @click.stop="onBtnClick">
          {{
            step === 1
              ? "确认"
              : curMenuIdx === 0
              ? animationBtnDesc
              : bannerBtnDesc
          }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Dialog, Toast } from "vant";
import RoomService from "@/service/roomService";
const roomService = new RoomService();

export default {
  props: {
    studioId: String,
    userId: String,
  },

  data() {
    return {
      show: false,
      curMenuIdx: 0,
      animationList: [],
      selectedAnimationIdx: 0,
      bannerList: [],
      selectedBannerIdx: 0,
      animationBtnDesc: "",
      bannerBtnDesc: "",
      step: 0,
      timeOptions: [],
      curTimeOptionIdx: 0,
      customTime: undefined,
    };
  },

  created() {
    this.setAnimationList();
    this.setBannerList();
    this.setTimeOptions();

    setTimeout(() => {
      this.show = true;
    }, 50);
  },

  methods: {
    selectMenu(index) {
      this.curMenuIdx = index;
    },

    async setAnimationList() {
      const { studioId, userId } = this;
      const { list: animationList = [] } =
        (await roomService.getEnterAnimationList(studioId, userId, 2)) || {};
      const index = animationList.findIndex((item) => item.is_select == 1);
      const selectedAnimationIdx = index === -1 ? 0 : index;
      const { remainder, is_select } = animationList[selectedAnimationIdx];
      const animationBtnDesc = remainder
        ? is_select == 1
          ? "取消使用"
          : "立即使用"
        : "下一步";
      this.animationList = animationList;
      this.selectedAnimationIdx = selectedAnimationIdx;
      this.animationBtnDesc = animationBtnDesc;
    },

    async setBannerList() {
      const { studioId, userId } = this;
      const { list: bannerList = [] } =
        (await roomService.getEnterAnimationList(studioId, userId, 3)) || {};
      const index = bannerList.findIndex((item) => item.is_select == 1);
      const selectedBannerIdx = index === -1 ? 0 : index;
      const { remainder, is_select } = bannerList[selectedBannerIdx];
      const bannerBtnDesc = remainder
        ? is_select == 1
          ? "取消使用"
          : "立即使用"
        : "下一步";
      this.bannerList = bannerList;
      this.selectedBannerIdx = selectedBannerIdx;
      this.bannerBtnDesc = bannerBtnDesc;
    },

    async setTimeOptions() {
      const { list: timeOptions = [] } =
        (await roomService.getEnterAnimationTimeOptions()) || {};
      this.timeOptions = timeOptions;
    },

    selectAnimation(e) {
      const selectedAnimationIdx = Number(e.currentTarget.dataset.index);
      const { is_select } = this.animationList[selectedAnimationIdx];
      const animationBtnDesc = is_select == 1 ? "取消使用" : "下一步";
      this.selectedAnimationIdx = selectedAnimationIdx;
      this.animationBtnDesc = animationBtnDesc;
    },

    selectBanner(index) {
      const { is_select } = this.bannerList[index];
      const bannerBtnDesc = is_select == 1 ? "取消使用" : "下一步";
      this.selectedBannerIdx = index;
      this.bannerBtnDesc = bannerBtnDesc;
    },

    cancelAnimation() {
      const { studioId, userId } = this;
      const { animationList, selectedAnimationIdx } = this;
      roomService.deleteEnterAnimation(
        studioId,
        userId,
        animationList[selectedAnimationIdx].gift_studio_user_id,
        () => {
          this.animationList[selectedAnimationIdx].is_select = 0;
          this.animationBtnDesc = "下一步";
        }
      );
    },

    cancelBanner() {
      const { studioId, userId } = this;
      const { bannerList, selectedBannerIdx } = this;
      roomService.deleteEnterAnimation(
        studioId,
        userId,
        bannerList[selectedBannerIdx].gift_studio_user_id,
        () => {
          this.bannerList[selectedBannerIdx].is_select = 0;
          this.bannerBtnDesc = "下一步";
        }
      );
    },

    selectTime(index) {
      this.curTimeOptionIdx = index;
    },

    onBtnClick() {
      const {
        studioId,
        userId,
        step,
        timeOptions,
        curTimeOptionIdx,
        customTime,
        curMenuIdx,
        animationBtnDesc,
        bannerBtnDesc,
        animationList,
        selectedAnimationIdx,
        bannerList,
        selectedBannerIdx,
      } = this;
      if (step === 1) {
        if (curTimeOptionIdx === timeOptions.length - 1) {
          if (!customTime) {
            Toast("自定义时间不能为空");
            return;
          }
          if (customTime > 999) {
            Toast("自定义时间不能大于999天");
            return;
          }
        }
        const id =
          curMenuIdx === 0
            ? animationList[selectedAnimationIdx].id
            : bannerList[selectedBannerIdx].id;
        roomService.updateEnterAnimation(
          studioId,
          userId,
          id,
          curTimeOptionIdx === timeOptions.length - 1
            ? customTime
            : timeOptions[curTimeOptionIdx].value,
          async () => {
            if (curMenuIdx === 0) {
              await this.setAnimationList();
            } else {
              await this.setBannerList();
            }
            this.step = 0;
            this.customTime = undefined;
          }
        );
      } else {
        if (curMenuIdx === 0) {
          if (animationBtnDesc === "下一步") {
            this.step = 1;
          } else {
            Dialog.confirm({
              message: "确定取消使用当前进场动画吗？",
              confirmButtonColor: "#05828C",
            })
              .then(async () => {
                this.cancelAnimation();
              })
              .catch(() => {});
          }
        } else {
          if (bannerBtnDesc === "下一步") {
            this.step = 1;
          } else {
            Dialog.confirm({
              message: "确定取消使用当前走马灯吗？",
              confirmButtonColor: "#05828C",
            })
              .then(async () => {
                this.cancelBanner();
              })
              .catch(() => {});
          }
        }
      }
    },

    back() {
      if (this.step === 1) {
        this.step = 0;
        this.customTime = undefined;
      } else {
        this.hide();
      }
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
.enter-animation-popup {
  padding-bottom: env(safe-area-inset-bottom);
}

.header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  border-bottom: 1px solid #F6F6F6;
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
  padding: 0 15px;
  height: 360px;
  max-height: calc(100vh - 156px - env(safe-area-inset-bottom));
  overflow-y: scroll;
}

.menu-tabs {
  display: flex;
  margin-top: 15px;
}
.menu-tab {
  flex: 1;
  height: 31px;
  color: #666;
  font-size: 16px;
  text-align: center;
}
.menu-tab.active {
  position: relative;
  color: #333;
  font-weight: 550;
}
.menu-tab.active::after {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 36px;
  height: 3px;
  content: "";
  background: #FDCC87;
  border-radius: 2px;
}

.selections {
  display: flex;
  flex-wrap: wrap;
  margin-top: 15px;
}
.selection {
  margin-right: 2.5vw;
  margin-bottom: 15px;
}
.selection:nth-child(3n) {
  margin-right: 0;
}
.animation-wrap {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 29vw;
  max-width: 29vh;
  height: 29vw;
  max-height: 29vh;
  background: #F5F7FA;
  border-radius: 6px;
}
.animation-wrap.selected {
  border: 1px solid #11161D;
}
.animation {
  width: 16vw;
  max-width: 16vh;
  height: 16vw;
  max-height: 16vh;
}
.banner {
  width: 24vw;
  max-width: 24vh;
}
.time-desc {
  position: absolute;
  top: 6px;
  left: 6px;
  display: flex;
  align-items: center;
  color: #999;
  font-size: 10px;
}
.time-icon {
  margin-right: 3px;
  width: 12px;
  height: 12px;
}
.selected-icon {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 14px;
  height: 14px;
}
.selection-desc {
  margin-top: 5px;
  color: #333;
  font-size: 14px;
  text-align: center;
}

.time-setting {
  padding-top: 19px;
}
.time-selections {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
.time-selection {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  width: 29vw;
  max-width: 29vh;
  height: 44px;
  color: #333;
  font-size: 16px;
  background: #FEFFFF;
  border-radius: 10px;
  border: 1px solid #B2B6C2;
}
.time-selection.selected {
  position: relative;
  border: 2px solid #11161D;
}
.time-selected-icon {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 16px;
  height: 16px;
}

.custom-time {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.custom-time-label {
  color: #333;
  font-size: 16px;
}
.custom-time-input {
  margin-left: 16px;
  padding: 0 10px;
  width: 66vw;
  max-width: 66vh;
  height: 44px;
  font-size: 12px;
  background: #FEFFFF;
  border-radius: 6px;
  border: 1px solid #B2B6C2;
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
  width: 310px;
  height: 44px;
  color: #FFE5BD;
  font-size: 16px;
  font-weight: 550;
  background: linear-gradient(128deg, #404A5C 0%, #0F131A 100%);
  border-radius: 22px;
}
</style>
