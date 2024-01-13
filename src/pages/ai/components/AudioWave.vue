<template>
  <div class="audio-wave">
    <div class="wave wave_5"></div>
    <div class="wave wave_6"></div>
    <div class="wave wave_7"></div>
    <div class="wave wave_1"></div>
    <div class="wave wave_2"></div>
    <div class="wave wave_3"></div>
    <div class="wave wave_5"></div>
    <div class="wave wave_6"></div>
    <div class="wave wave_7"></div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="stylus" scoped>
@keyframes audio
  from
    height: .04rem
  to
    height: .28rem
.row
  display: flex
  align-items: center
.audio-wave
  display: flex
  align-items: center
  .wave
    margin-right: .04rem
    width: .04rem
    border-radius: .02rem
    background: #5D7CFF
    &:last-child
      margin-right: 0
  .wave_1
    animation: audio .5s linear .1s infinite alternate
  .wave_2
    animation: audio .5s linear .2s infinite alternate
  .wave_3
    animation: audio .5s linear .5s infinite alternate
  .wave_5
    animation: audio .5s linear .2s infinite alternate
  .wave_6
    animation: audio .5s linear .3s infinite alternate
  .wave_7
    animation: audio .5s linear .1s infinite alternate
</style>
