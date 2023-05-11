<template>
  <div></div>
</template>

<script>
import { getUrlParam } from '@/utils/index'

export default {
  created() {
    const token = this.$route.query.token || getUrlParam('token') || ''
    if (!token) {
      const login_type = 1
      const state = encodeURIComponent(`login_type=${login_type}`)
      window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx21737bccb934bd94&redirect_uri=https%3A%2F%2Fapi.talking.vip%2Fofficial-account%2Foauth-callback&response_type=code&scope=snsapi_userinfo&state=${state}#wechat_redirect`
      return
    } else {
      window.wx.miniProgram.navigateBack()
    }
  },
}
</script>

<style lang="stylus" scoped>

</style>
