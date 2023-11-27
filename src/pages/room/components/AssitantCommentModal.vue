<template>
  <div class="password-modal" @click="hide">
    <div class="main" @click.stop="">
      <div class="comment-modal-title">添加评论</div>
      <textarea
        class="comment-textarea"
        v-model="content"
        placeholder="请添加不大于15字的助手评论"
      />
      <div class="comment-modal-btns">
        <div class="comment-modal-cancel-btn" @click="hide">取消</div>
        <div class="comment-modal-confirm-btn" @click="confirm">
          确定添加
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
import { mapState } from "vuex";
import RoomService from "@/service/roomService";
const roomService = new RoomService();

export default {
  data() {
    return {
      content: "",
    };
  },

  computed: {
    ...mapState({
      studioInfo: (state) => state.studioInfo,
    }),
  },

  methods: {
    confirm() {
      if (!this.content || this.content.length > 15) {
        Toast("请添加不大于15字的助手评论");
        return;
      }

      roomService.createPhrase(this.studioInfo.id, 4, this.content, () => {
        this.$emit("confirm");
      });
    },

    hide() {
      this.$emit("hide");
    },
  },
};
</script>

<style lang="stylus" scoped>
.password-modal
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
.comment-modal-title {
  color: #333;
  font-size: .36rem;
  font-weight: bold;
  text-align: center;
}
.comment-modal-content {
  margin-top: .60rem;
  padding: 0 .40rem;
  color: #666;
  font-size: .32rem;
  text-align: center;
}
.comment-textarea {
  margin: .30rem 0 0;
  padding: .24rem;
  width: 100%;
  height: 2.80rem;
  font-size: .28rem;
  background: #f5f6f7;
  border: none;
}
.comment-modal-btns {
  display: flex;
  justify-content: space-between;
}
.comment-modal-cancel-btn, .comment-modal-confirm-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.74rem;
  height: .88rem;
  color: #666;
  font-size: .32rem;
  border-radius: .44rem;
}
.comment-modal-cancel-btn {
  color: #666;
  background: #E4E4E4;
}
.comment-modal-confirm-btn {
  color: #FFE5BD;
  background: linear-gradient(128deg, #404A5C 0%, #0F131A 100%);
}
</style>
