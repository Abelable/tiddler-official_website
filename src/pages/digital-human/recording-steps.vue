<template>
  <div class="container">
    <img src="./images/recording-steps/bg.png" alt="" class="bg" />
    <img src="./images/back.png" alt="" class="back-icon" />

    <div class="content">
      <img src="./images/recording-steps/step_1.png" alt="" class="step">
      <img src="./images/recording-steps/step_2.png" alt="" class="step">
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="stylus" scoped>
.container
  
  .bg
    position: fixed
    top: 0
    left: 0
    width: 100vw
    height: 100vh
    z-index: -1
  .back-icon
    position: fixed
    top: .6rem
    left: .48rem
    width: .36rem
    height: .36rem
    z-index: 100
  .content
    margin-top: 5rem
    padding: .3rem
    font-size: 0
    .step
      margin-bottom: .7rem
      width: 100%
</style>