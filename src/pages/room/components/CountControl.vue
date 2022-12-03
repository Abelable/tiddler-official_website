<template>
  <div class="count-control" @click.stop="">
    <div class="reduce-btn" @click="reduce">
      <img style="width: .32rem; height: .32rem;" :src="reduceIconSrc" >
    </div>
    <input class="count-view" :style="{ width: inputWidth + 'rem' }" type="number" v-model="count" @blur="onInputBlur">
    <div class="add-btn" @click="add">
      <img style="width: .32rem; height: .32rem;" src="../../../assets/images/add.png">
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      count: 1
    }
  },

  computed: {
    reduceIconSrc() {
      return this.count > 1 ?  require('../../../assets/images/reduce-active.png') : require('../../../assets/images/reduce.png')
    },
    inputWidth() {
      return 0.42 + String(this.count).length * 0.18
    }
  },

  methods: {
    add() {
      this.count++
      this.$emit('countChange', this.count)
    },
    reduce() {
      if (this.count > 1) {
        this.count--
        this.$emit('countChange', this.count)
      }
    },
    onInputBlur() {
      this.count = this.count < 1 ? 1 : this.count
      this.$emit('countChange', this.count)
    }
  }
}
</script>

<style lang="stylus" scoped>
.count-control
  display flex
  align-items center
  width fit-content
  height .64rem
  border-radius .32rem
  border .02rem solid rgb(242,242,242)
  .reduce-btn, .add-btn
    display flex
    align-items center
    justify-content center
    width .68rem
    height .64rem
  .count-view
    height .64rem
    text-align center
    color #333
    font-size .3rem
    font-weight 500
    background-color #F2F2F2
</style>