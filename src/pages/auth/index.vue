<template>
  <div></div>
</template>

<script>
import AuthService from '@/service/authService'

const authService = new AuthService()

export default {
  data() {
    return {
      authInfo: {}
    }
  },

  created() {
    this.setAuthInfo()
  },

  methods: {
    async setAuthInfo() {
      this.authInfo = await authService.getAuthInfo()
    }
  }
}
</script>

<style lang="stylus" scoped>
// .status
//   display: flex
//   align-items: center
//   justify-content: center
//   height: .88rem
//   color: #fff
//   font-size: .30rem
//   &.ing
//     background: #FF7548
//   &.done
//     background: #6ED29B
//   &.fail
//     background: #FB6155

// .fail-reason
//   padding: .24rem
//   color: #FB6155
//   font-size: .30rem

// .container
//   padding: 0 .24rem .80rem

// .title
//   margin: .24rem 0 .20rem
//   color: #333
//   font-size: .32rem
// .tips
//   color: #999
//   font-size: .24rem

// .form
//   padding: 0 .30rem
//   border-radius: .12rem
//   background: #fff
// .form-item
//   display: flex
//   align-items: center
//   height: 1rem
//   border-bottom: 1px solid #E8E8E8
//   &:last-child
//   border-bottom: none
// .label
//   color: #242424
//   font-size: .28rem
// .input
//   margin-left: .80rem
//   flex: 1
//   font-size: .28rem

// .card
//   padding: .30rem
//   border-radius: .12rem
//   background: #fff

// .upload-wrap
//   display: flex
//   justify-content: space-between
//   font-size: 0
// .upload
//   text-align: center
// .upload-bg
//   width: 3.00rem
//   height: 2.00rem
// .upload-desc
//   margin-top: .16rem
//   color: #242424
//   font-size: .28rem

// .example
//   position: relative
//   width: 3.00rem
//   height: 2.00rem
//   font-size: 0
//   border-radius: 5px
//   overflow: hidden
// .example-tag
//   position: absolute
//   left: 0
//   top: .16rem
//   display: flex
//   align-items: center
//   justify-content: center
//   width: 1.20rem
//   height: .38rem
//   color: #333
//   font-size: .24rem
//   background: #FDCC87
//   border-radius: 0 .20rem .20rem 0

// .card-tips
//   margin-top: .20rem
//   color: #999
//   font-size: .24rem

// .warning
//   margin-top: .24rem
//   color: #BA9243
//   font-size: .28rem
//   text-align: center

// .submit-btn
//   display: flex
//   align-items: center
//   justify-content: center
//   margin: .50rem auto 0
//   width: 6.00rem
//   height: .88rem
//   color: #FFE5BD
//   font-size: .32rem
//   font-weight: 500
//   background: linear-gradient(128deg, #404A5C 0%, #0F131A 100%)
//   border-radius: .44rem
// .upload-bg-input
//   width: 3rem
//   height: 2rem
// .upload-bg-input .van-uploader
//   position: absolute
//   left: 0
//   top: 0
//   width: 100%
//   height: 100%
// ::v-deep .upload-bg-input .van-image .van-image__img {
//   opacity: 0;
// }
</style>
