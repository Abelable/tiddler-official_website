import BaseService from '../../../service/baseService'

class LoginService extends BaseService {
  async getSms(mobile) {
    return await this.post(`${this.mmsUrl}/api/v4/misc/sms/send`, { mobile, client: 'h5' })
  }

  async login(mobile, code) {
    return await this.post(`${this.mmsUrl}/api/v4/user/fast-login`, { mobile, code, client: 'h5' })
  }

  async bindSuperior(parent_id) {
    return await this.post(`${this.mmsUrl}/api/v4/user/bind`, { parent_id })
  }
}

export default LoginService