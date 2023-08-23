<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: "App",
  created() {
    axios({
      method: 'get',
      url: 'https://ip.talking.vip'
    }).then(res => {
      let ip = res.data || ''
      if(/^\d*\.\d*\.\d*\.\d*$/.test(ip)){
        window.localStorage.setItem('ipip',ip)
      }
    }).catch((error)=>{
      console.log(error)
    })
  }
};
</script>

<style lang="stylus">
#app
  font-family Avenir, Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
</style>
