<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import BaseService from "@/service/baseService";

const baseService = new BaseService();

export default {
  name: "App",

  created() {
    this.setUserInfo();
  },

  methods: {
    async setUserInfo() {
      const {
        id,
        head_img: avatar,
        nick_name: nickname,
        mobile,
      } = await baseService.getCurrentUserInfo();
      localStorage.setItem("userId", id);
      this.$store.commit("setUserInfo", { avatar, nickname, mobile });
    },
  },
};
</script>

<style lang="stylus">
#app
  font-family Avenir, Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
</style>
