<template>
  <div></div>
</template>

<script>
import { getUrlParam } from '@/utils/index'
import { Toast } from 'vant';

export default {
  created() {
    const ua = navigator.userAgent.toLowerCase();
    if (ua.match(/wxwork/i) == 'wxwork') {
      Toast('请在微信中打开')
      return
    }
    if (ua.match(/MicroMessenger/i) != "micromessenger") {
      Toast('请在微信中打开')
      return
    }

    const token = this.$route.query.token || getUrlParam('token') || ''
    if (!token) {
      const login_type = window.location.href.includes('sm') ? 2 : 1
      const state = encodeURIComponent(`login_type=${login_type}`)
      window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx834688294afd4d48&redirect_uri=https%3A%2F%2Fyoubojia.youboi.com%2Fofficial-account%2Foauth-callback&response_type=code&scope=snsapi_userinfo&state=${state}#wechat_redirect`
      return
    } else {
      window.wx.miniProgram.navigateBack()
    }
  },
}
</script>

<style lang="stylus" scoped>

</style>
