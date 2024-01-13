<template>
  <div>
    <Mobile v-if="scene === 1" />
    <PC v-if="scene === 2" />
  </div>
</template>

<script>
import Mobile from './components/mobile/index.vue'
import PC from "./components/pc/index.vue";

export default {
  components: { Mobile, PC },

  data() {
    return {
      scene: 1,
    };
  },

  created() {
    this.scene = navigator.userAgent.match(
      /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|IEMobile)/i
    )
      ? 1
      : 2;
  },
};
</script>

<style></style>
