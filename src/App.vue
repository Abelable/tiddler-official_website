<template>
  <div id="app">
    <keep-alive :include="['digital_human_index']">
      <router-view v-if="routeVisible"></router-view>
    </keep-alive>
  </div>
</template>

<script>
import RoomService from "@/service/roomService";

const roomService = new RoomService();
import axios from "axios";
export default {
  name: "App",
  data() {
    return {
      routeVisible:false
    };
  },
  created() {
    roomService.getConfig((res)=>{
      window.localStorage.setItem('view_type',res.view_type)
      this.routeVisible = true
    },(err)=>{
      window.localStorage.setItem('view_type','h5')
      this.routeVisible = true
    });

    axios({
      method: "get",
      url: "https://ip.talking.vip",
    })
      .then((res) => {
        let ip = res.data || "";
        if (/^\d*\.\d*\.\d*\.\d*$/.test(ip)) {
          window.localStorage.setItem("ipip", ip);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  },
};
</script>

<style lang="stylus">
#app
  font-family Avenir, Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  -webkit-touch-callout: none !important
  -webkit-user-select: none
</style>
