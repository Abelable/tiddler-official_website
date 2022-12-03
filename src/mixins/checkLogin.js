const checkLogin = {
  methods: {
    checkLogin(success, needLogin = true) {
      if (localStorage.getItem('token')) {
        success && success()
      } else {
        needLogin && this.$router.push({ path: '/login' })
      }
    }
  }
}

export default checkLogin