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
      routeVisible: true,
    };
  },
  created() {},
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
