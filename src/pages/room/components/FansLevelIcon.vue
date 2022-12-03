<template>
  <div class="level-tips" :style="{ background: fansLevel.bgColor }">
    <img class="level-tips-icon" :src="fansLevel.iconUrl" alt="">
    <span>{{fansLevel.name}}{{gradeType}}</span>
  </div>
</template>

<script>
export default {
  props: ['gradeType', 'fansName'],

  computed: {
    fansLevel() {
      let fansLevelArr = [
        {
          name: this.fansName || '新粉',
          iconUrl: require('../../../assets/images/new-fans-icon.png'),
          bgColor: 'linear-gradient(317deg,rgba(0,149,40,1) 0%,rgba(255,255,255,1) 100%)'
        },
        {
          name: this.fansName || '铁粉',
          iconUrl: require('../../../assets/images/firm-fans-icon.png'),
          bgColor: 'linear-gradient(140deg,rgba(186,192,250,1) 0%,rgba(26,42,249,1) 100%)'
        },
        {
          name: this.fansName || '钻粉',
          iconUrl: require('../../../assets/images/senior-fans-icon.png'),
          bgColor: 'linear-gradient(137deg,rgba(255,255,255,1) 0%,rgba(115,15,239,1) 100%)'
        }
      ]
      let fansLevel
      if (this.gradeType >= 6 && this.gradeType < 11) {
        fansLevel = fansLevelArr[1]
      } else if (this.gradeType >= 11) {
        fansLevel = fansLevelArr[2]
      } else {
        fansLevel = fansLevelArr[0]
      }
      return fansLevel
    }
  }
}
</script>

<style lang="stylus" scoped>
.level-tips
  display flex
  align-items center
  padding 0 .08rem
  width fit-content
  height .32rem
  border-radius .04rem
  font-size .18rem
  color #fff
  line-height 1
  white-space nowrap
  .level-tips-icon
    margin-right .06rem
    width .28rem
    height .28rem
</style>