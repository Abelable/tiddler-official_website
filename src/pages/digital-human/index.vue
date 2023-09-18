<template>
  <div class="container">
    <Home v-show="curTabIdx === 0" />
    <Mine v-show="curTabIdx === 1" />

    <div class="tab-bar">
      <div
        class="tab-item"
        v-for="(item, index) in tabList"
        :key="index"
        @click="curTabIdx = index"
      >
        <img
          class="tab-icon"
          :src="
            require(`./images/tab-bar/${item.icon}${
              curTabIdx === index ? '-active' : ''
            }.png`)
          "
          alt=""
        />
        <div class="tab-name" :class="{ active: curTabIdx === index }">
          {{ item.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Home from "./home";
import Mine from "./mine";

export default {
  name:'digital_human_index',
  components: { Home, Mine },
  data() {
    return {
      tabList: [
        { icon: "home", name: "首页" },
        { icon: "mine", name: "我的" },
      ],
      curTabIdx: 0,
    };
  },
};
</script>

<style lang="stylus" scoped>
.tab-bar
  position: fixed
  bottom: 0
  left: 0
  width: 100%
  display: flex
  padding: .4rem 0
  background: #fff
  .tab-item
    display: flex
    align-items: center
    justify-content: center
    flex: 1
    .tab-icon
      width: .5rem
      height: .5rem
    .tab-name
      margin-left: .1rem
      color: #999
      font-size: .32rem
      font-weight: 500
      &.active
        color: #333
</style>
