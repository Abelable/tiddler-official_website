import BaseService from './baseService'

class RoomService extends BaseService {
  async getAuthInfo() {
    return await this.get(`${this.liveUrl}/user/get-user-idcard`)
  }

  async uploadAuthInfo(authInfo) {
    return await this.post(`${this.liveUrl}/user/tim-login`, authInfo)
  }
}

export default RoomService
