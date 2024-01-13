<template>
  <div id="app">
    <keep-alive :include="['digital_human_index']">
      <router-view v-if="routeVisible"></router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      routeVisible:true
    };
  },
  created() {
    
    // // 创建XMLHttpRequest对象
    // var xhr = new XMLHttpRequest();
    
    // // 设置请求类型、URL和是否同步（默认为false）
    // xhr.open('GET', 'https://ip.talking.vip', true); // GET请求示例
    
    // // 注册事件处理程序
    // xhr.onreadystatechange = function() {
    //     if (xhr.readyState === 4 && xhr.status === 200) {
    //       let ip = xhr.responseText || "";
    //       if (/^\d*\.\d*\.\d*\.\d*$/.test(ip)) {
    //         window.localStorage.setItem("ipip", ip);
    //       }
    //     }
    // };
    
    // // 发送请求
    // xhr.send();
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
