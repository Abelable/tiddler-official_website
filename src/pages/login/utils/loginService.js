import BaseService from '../../../service/baseService'

class LoginService extends BaseService {
  async getSms(mobile) {
    return await this.post(`${this.liveUrl}/user/send-verification`, { mobile, skip_first_check: 1 })
  }

  async login(mobile, code) {
    return await this.post(`${this.liveUrl}/user/login`, { mobile, code, skip_first_check: 1 })
  }

  async getAreaCodeList() {
    return await this.post(`${this.liveUrl}/user/mobile-area-code`)
  }

  async getLineLoginUrl() {
    return await this.get(`${this.liveUrl}/line/login-url`)
  }

  async getFacebookLoginUrl() {
    return await this.get(`${this.liveUrl}/facebook/login-url`)
  }
}

export default LoginService