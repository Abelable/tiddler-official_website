<template>
  <div class="modal" @click="hide">
    <div class="main" @click.stop="">
      <div class="modal-title-wrap" v-if="!addTagMode">
        <div class="modal-title">{{ isBatch ? "批量打标签" : "打标签" }}</div>
        <div class="create-tag-btn" @click.stop="toggleAddTagMode">
          添加标签
        </div>
      </div>
      <div class="modal-tag-list" v-if="!addTagMode">
        <div
          class="modal-tag-item"
          :style="{
            color: item.is_select ? item.font_color : '#404A5C',
            background: item.is_select ? item.bg_color : '#F1F5F7',
          }"
          v-for="(item, index) in tagList"
          :key="index"
          @click.stop="toggleTagSelect(index)"
        >
          {{ item.tag_name }}
        </div>
      </div>

      <div class="modal-title-wrap" v-if="addTagMode">
        <img
          class="back-icon"
          @click.stop="toggleAddTagMode"
          src="https://img.ubo.vip/youbo_plus/new_version/login/back.png"
        />
        <div class="modal-title">添加标签</div>
      </div>
      <input
        class="add-tag-input"
        v-if="addTagMode"
        v-model="tagName"
        placeholder="请输入标签名称，不超过10个字"
      />
      <div class="tag-example-wrap" v-if="addTagMode">
        <div
          class="tag-example"
          v-if="tagName"
          :style="{
            color: curColorIdx > 6 ? '#fff' : '#404a5c',
            background: colorList[curColorIdx],
          }"
        >
          {{ tagName }}
        </div>
      </div>
      <div class="color-picker-wrap" v-if="addTagMode">
        <div
          class="color-picker"
          :style="{
            background: item,
            border: `1px solid ${curColorIdx === index ? '#000' : item}`,
          }"
          v-for="(item, index) in colorList"
          :key="index"
          @click.stop="setColorIdx(index)"
        >
          <img
            class="tick"
            v-if="curColorIdx === index"
            :src="`https://img.ubo.vip/youbo_plus/new_version/tag-modal/${index > 6 ? 'white' : 'black'}-tick.png`"
          />
        </div>
      </div>

      <div class="modal-btns">
        <div class="cancel-btn" v-if="!addTagMode" @click.stop="hide">
          取消
        </div>
        <div class="confirm-btn" @click.stop="confirm">确定</div>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
import RoomService from "@/service/roomService";
const roomService = new RoomService();

export default {
  props: {
    userIds: Array,
    isBatch: Boolean,
    studioId: Number,
  },

  data() {
    return {
      colorList: [
        "rgba(192, 223, 200, 1)",
        "rgba(255, 188, 223, 1)",
        "rgba(231, 204, 255, 1)",
        "rgba(254, 219, 159, 1)",
        "rgba(255, 132, 122, 1)",
        "rgba(161, 255, 218, 1)",
        "rgba(170, 213, 255, 1)",
        "rgba(140, 52, 233, 1)",
        "rgba(242, 70, 47, 1)",
        "rgba(44, 214, 88, 1)",
        "rgba(245, 84, 200, 1)",
        "rgba(243, 167, 61, 1)",
        "rgba(44, 200, 202, 1)",
        "rgba(88, 172, 255, 1)",
      ],
      tagList: [],
      tagName: "",
      addTagMode: false,
      curColorIdx: 0,
    };
  },

  created() {
    this.setTagList();
  },

  methods: {
    async setTagList() {
      const { userIds, studioId } = this;
      const { list = [] } =
        userIds.length === 1
          ? (await roomService.getCurUserTagList(studioId, userIds[0])) || {}
          : (await roomService.getUserTagList(studioId, 1)) || {};
      this.tagList = list;
    },

    toggleTagSelect(index) {
      const curTag = this.tagList[index];
      this.tagList[index] = {
        ...curTag,
        is_select: curTag.is_select === 1 ? 0 : 1,
      };
    },

    confirm() {
      const {
        addTagMode,
        curColorIdx,
        colorList,
        tagName,
        tagList,
        userIds,
        studioId,
      } = this;
      if (addTagMode) {
        if (!tagName) {
          Toast("请输入标签名称");
          return;
        }

        const index = this.tagList.findIndex(
          (item) => item.tag_name === tagName
        );
        if (index !== -1) {
          Toast("标签名称重复，请重新输入");
          return;
        }

        roomService.createUserTag(
          this.studioId,
          tagName,
          1,
          curColorIdx > 6 ? "#fff" : "#404a5c",
          colorList[curColorIdx],
          "",
          () => {
            this.addTagMode = false;
            this.tagName = "";
            this.setTagList();
          }
        );
      } else {
        const selectedTagList = [];
        const selectedTagIds = [];
        tagList.forEach((item) => {
          if (item.is_select) {
            selectedTagList.push(item);
            selectedTagIds.push(item.id);
          }
        });
        roomService.bindUserTag(
          studioId,
          selectedTagIds.join(),
          userIds.join(),
          () => {
            this.$emit("confirm", selectedTagList);
          }
        );
      }
    },

    toggleAddTagMode() {
      this.addTagMode = !this.addTagMode;
    },

    setColorIdx(index) {
      this.curColorIdx = index;
    },

    hide() {
      this.$emit("hide");
    },
  },
};
</script>

<style lang="stylus" scoped>
.modal
  position: fixed
  top: 0
  left: 0
  width: 100vw
  height: 100vh
  background-color: rgba(0, 0, 0, 0.3)
  z-index: 100
  .main
    position: absolute
    top: 50%
    left: 50%
    transform: translate(-50%, -50%)
    padding: .30rem .30rem .40rem;
    width: 6.50rem;
    height: 5.44rem;
    border-radius: .20rem
    background: #fff
    transform: translate(-50%, -50%)
    .back-icon {
  position: absolute;
  top: 0;
  left: 10px;
  width: 20px;
  height: 20px;
}
.modal-title {
  margin-top: 15px;
  color: #333;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
}
.create-tag-btn {
  position: absolute;
  top: 2px;
  right: 15px;
  color: #1A2040;
  font-size: 12px;
}

.add-icon {
  margin-left: 10px;
  width: 18px;
  height: 18px;
}
.modal-tag-list {
  display: flex;
  flex-wrap: wrap;
  padding: 15px;
  padding-right: 0;
}
.modal-tag-item {
  display: flex;
  align-items: center;
  margin-right: 15px;
  margin-bottom: 10px;
  padding: 0 10px;
  height: 26px;
  font-size: 12px;
  line-height: 1;
  border-radius: 13px;
}

.add-tag-input {
  margin: 15px auto 0;
  padding: 0 12px;
  width: 273px;
  height: 36px;
  font-size: 12px;
  background: #F1F5F7;
  border-radius: 10px;
}

.tag-example-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 15px auto 0;
  width: 273px;
  height: 80px;
  font-size: 12px;
  background: #F1F5F7;
  border-radius: 10px;
}
.tag-example {
  display: flex;
  align-items: center;
  padding: 0 10px;
  height: 26px;
  font-size: 12px;
  line-height: 1;
  border-radius: 13px;
}

.color-picker-wrap {
  display: flex;
  flex-wrap: wrap;
  margin: 25px auto 0;
  width: 270px;
}
.color-picker {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 14px;
  margin-bottom: 18px;
  width: 26px;
  height: 26px;
  border-radius: 13px;
}
.color-picker:nth-child(7n) {
  margin-right: 0;
}
.tick {
  width: 14px;
  height: 10px;
}

.modal-btns {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  display: flex;
  border-top: 1px solid #EAECEF;
}
.cancel-btn, .confirm-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  height: 43px;
  font-size: 14px;
  font-weight: 500;
}
.cancel-btn {
  border-right: 1px solid #EAECEF;
  color: #B2B6C2;
}
.confirm-btn {
  color: #1A2040;
}
</style>
