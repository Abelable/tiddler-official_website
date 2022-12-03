<template>
  <div class="sroller" ref="sroller" @touchstart="touchStart($event)" @touchend="touchEnd($event)">
    <slot />
  </div>
</template>

<script>
export default {
  data() {
    return {
      canRefresh: true,
      canLoadMore: true
    }
  },

  methods: {
    touchStart(e) {
      this.startY = e.targetTouches[0].pageY
    },

    touchEnd(e) {
      let endY = e.changedTouches[0].pageY
      if (Math.abs(this.startY - endY) > 2) endY < this.startY ? this.scrollToEnd() : this.scrollToTop()
    },

    async scrollToTop() {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      if (scrollTop < -50 && this.canRefresh) {
        this.canRefresh && this.$emit('refresh')

        this.canRefresh = false
        if (this.refreshTimeout) {
          clearTimeout(this.refreshTimeout)
          this.refreshTimeout = null
        }
        this.refreshTimeout = setTimeout(() => {
          this.canRefresh = true
        }, 2000)
      }
    },

    async scrollToEnd() {
      let containerHeight = this.$refs.sroller.clientHeight
      let screenHeight = document.documentElement.clientHeight || document.body.clientHeight
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      if (scrollTop > 0 && (screenHeight + scrollTop + 5 >= containerHeight) && this.canLoadMore) {
        this.canLoadMore && this.$emit('loadMore')

        this.canLoadMore = false
        if (this.loadMoreTimeout) {
          clearTimeout(this.loadMoreTimeout)
          this.loadMoreTimeout = null
        }
        this.loadMoreTimeout = setTimeout(() => {
          this.canLoadMore = true
        }, 2000)
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.sroller
  min-height 100%
</style>