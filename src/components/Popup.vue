<template>
  <div>
    <div class="mask" :class="{ show }" @click="hide" />
    <div class="popup" :class="{ show }" @click.stop="">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: false
    }
  },

  created() {
    setTimeout(() => {
      this.show = true
    }, 50)
  },

  methods: {
    hide() {
      this.show = false
      setTimeout(() => {
        this.$emit('hide')
      }, 200)
    }
  }
}
</script>

<style lang="stylus" scoped>
.mask
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  z-index: 100;
  opacity: 0;
  transition: opacity .2s ease;
  &.show
    opacity: 1;
.popup
  position: fixed;
  left: 50%;
  bottom: 0; 
  width: 100%;
  max-width: 100vh;
  max-height: 100vh;
  border-radius: .2rem .2rem 0 0;
  background: #fff;
  overflow: hidden;
  z-index: 100;
  transform: translate(-50%, 100%);
  transition: transform .2s ease;
  &.show
    transform: translate(-50%, 0);
    transition: transform .3s ease;
</style>
