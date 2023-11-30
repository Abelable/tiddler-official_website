<template>
  <div>
    <div class="mask" :class="{ show }" @click="hide" />
    <div class="popup" :class="{ show }">
      <div class="increase-users-popup">
        <div class="pop-title">设置加人/点赞（仅添加用户端展示的人数）</div>

        <div class="task-tips" v-if="hasTask">
          <div class="task-tips-content">当前已有一个任务正在执行</div>
          <div class="cancel-btn" @click.stop="cancelTask">取消</div>
        </div>

        <div class="setting-list">
          <div class="setting-list-title">进入的虚拟人数</div>
          <div class="count-control-wrap">
            <Stepper v-model="userCount" max="10000" />
            <div class="unit">人</div>
          </div>
        </div>
        <div class="explain">最大限制1万</div>

        <div class="setting-list">
          <div class="setting-list-title">虚拟点赞数</div>
          <div class="count-control-wrap">
            <Stepper v-model="praiseCount" max="1000000" />
            <div class="unit">赞</div>
          </div>
        </div>
        <div class="explain">最大限制100万</div>

        <div class="setting-list">
          <div class="setting-list-title">任务完成时间</div>
          <div class="count-control-wrap">
            <Stepper v-model="minutes" max="1000" />
            <div class="unit">分</div>
          </div>
        </div>
        <div class="explain">
          我们会在指定时间内完成您想要加入的人数和点赞数
        </div>

        <div class="create-btn" @click.stop="createTask">生成任务</div>
      </div>
    </div>
  </div>
</template>

<script>
import { Stepper, Toast } from "vant";
import RoomService from "@/service/roomService";

const roomService = new RoomService();

export default {
  components: { Stepper },

  props: {
    roomInfo: Object,
  },

  data() {
    return {
      show: false,
      userCount: 0,
      praiseCount: 0,
      minutes: 0,
      hasTask: false,
    };
  },

  created() {
    this.checkHasTask();

    setTimeout(() => {
      this.show = true;
    }, 50);
  },

  methods: {
    async checkHasTask() {
      const { id, studio_id } = this.roomInfo;
      const { status } =
        (await roomService.checkHasCreatedRobot(studio_id, id)) || {};
      if (status == 1) {
        this.hasTask = true;
      }
    },

    async cancelTask() {
      const { id, studio_id } = this.roomInfo;
      roomService.deleteRobot(studio_id, id, () => {
        this.hasTask = false;
      });
    },

    async createTask() {
      const { userCount, praiseCount, minutes, hasTask } = this;
      if (hasTask) {
        Toast("已有任务正在执行");
        return;
      }
      if (userCount == 0 && praiseCount == 0) {
        Toast("请添加人数或点赞");
        return;
      }
      if (userCount > 10000) {
        Toast("虚拟人数不能大于1万");
        return;
      }
      if (praiseCount > 1000000) {
        Toast("虚拟点赞数不能大于101万");
        return;
      }
      if (minutes == 0) {
        Toast("请添加时间");
        return;
      }
      if (minutes > 1000) {
        Toast("时间不能超过1000分钟");
        return;
      }

      const { id, studio_id } = this.roomInfo;
      roomService.createRobot(
        studio_id,
        id,
        userCount,
        praiseCount,
        minutes,
        () => {
          this.hide();
        }
      );
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
    .increase-users-popup {
  padding: 15px;
  padding-bottom: calc(15px + env(safe-area-inset-bottom));
}

.pop-title {
  color: #333;
  font-size: 16px;
  font-weight: bold;
}

.task-tips {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 15px;
  padding: 0 10px;
  height: 42px;
  border-radius: 8px;
  border: 1px dashed #999;
}
.task-tips-content {
  color: #333;
  font-size: 14px;
}
.cancel-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 49px;
  height: 24px;
  color: #BA9243;
  font-size: 12px;
  line-height: 1;
  border-radius: 12px;
  border: 1px solid #BA9243;
}

.setting-list {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 15px;
  padding: 0 10px;
  height: 52px;
  border-radius: 8px;
  border: 1px solid #eee;
}
.setting-list-title {
  color: #333;
  font-size: 14px;
}
.count-control-wrap {
  display: flex;
  align-items: center;
}
.unit {
  margin-left: 8px;
  color: #333;
  font-size: 14px;
}

.explain {
  margin-top: 6px;
  color: #999;
  font-size: 12px;
}

.create-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px auto 0;
  width: 195px;
  height: 45px;
  color: #FFE5BD;
  font-size: 18px;
  background: linear-gradient(128deg, #404A5C 0%, #0F131A 100%);
  border-radius: 23px;
}
</style>
