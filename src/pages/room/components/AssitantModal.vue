<template>
  <div class="password-modal" @click="hide">
    <div class="main" @click.stop="">
      <div class="assistant-modal-title">编辑助手</div>
      <div class="assistant-modal-list-wrap">
        <div class="assistant-modal-list">
          <div class="list-label">头像</div>
          <Uploader
            class="content-wrap"
            :after-read="uploadAvatar"
            max-count="1"
          >
            <img class="assistant-avatar" :src="avatar" />
            <img
              class="more-icon"
              src="https://img.ubo.vip/youbo_plus/new_version/more.png"
            />
          </Uploader>
        </div>
        <div class="assistant-modal-list">
          <div class="list-label">昵称</div>
          <div class="content-wrap">
            <input class="input" v-model="name" placeholder="请输入昵称" />
            <img
              class="more-icon"
              src="https://img.ubo.vip/youbo_plus/new_version/more.png"
            />
          </div>
        </div>
      </div>
      <div class="assistant-modal-btns">
        <div class="assistant-modal-cancel-btn" @click="hide">取消</div>
        <div class="assistant-modal-confirm-btn" @click="confirm">确定</div>
      </div>
    </div>
  </div>
</template>

<script>
import { Uploader } from "vant";
import { upload } from "@/utils/upload";
import RoomService from "@/service/roomService";
const roomService = new RoomService();

export default {
  components: { Uploader },

  props: {
    vest: Object,
  },

  data() {
    return {
      avatar: "",
      name: "",
    };
  },

  created() {
    const { head_img, name } = this.vest
    this.avatar = head_img;
    this.name = name;
  },

  methods: {
    async uploadAvatar({ file }) {
      this.avatar = await upload(file);
    },

    confirm() {
      roomService.updateVest(this.vest.id, this.name, this.avatar, () => {
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
.assistant-modal-title {
  color: #333;
  font-size: .36rem;
  font-weight: bold;
  text-align: center;
}
.assistant-modal-content {
  margin-top: .60rem;
  padding: 0 .40rem;
  color: #666;
  font-size: .32rem;
  text-align: center;
}
.assistant-modal-list-wrap {
  padding: .40rem 0;
}
.assistant-modal-list {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 1.32rem;
  border-bottom: 1px solid #F5F6F7;
}
.assistant-modal-list:last-child {
  border-bottom: none;
}
.list-label {
  color: #333;
  font-size: .28rem;
  font-weight: bold;
}
.content-wrap {
  display: flex;
  align-items: center;
}
.input {
  font-size: .28rem;
  text-align: right;
}
.more-icon {
  margin-left: .08rem;
  width: .32rem;
  height: .32rem;
}
.assistant-avatar {
  width: .72rem;
  height: .72rem;
  border-radius: 50%;
}
.assistant-modal-list-title {
  color: #333;
  font-size: .24rem;
  font-weight: bold;
}
.assistant-modal-edit {
  color: #3682EC;
  font-size: .24rem;
  font-weight: bold;
}
.assistant-modal-btns {
  display: flex;
  justify-content: space-between;
}
.assistant-modal-cancel-btn, .assistant-modal-confirm-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.74rem;
  height: .88rem;
  color: #666;
  font-size: .32rem;
  border-radius: .44rem;
}
.assistant-modal-cancel-btn {
  color: #666;
  background: #E4E4E4;
}
.assistant-modal-confirm-btn {
  color: #FFE5BD;
  background: linear-gradient(128deg, #404A5C 0%, #0F131A 100%);
}
</style>
<style>
.van-uploader__input-wrapper {
  display: flex;
  align-items: center;
}
</style>
