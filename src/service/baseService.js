import Base from './base/index'

class BaseService extends Base {
  async getCurrentUserInfo() {
    return await this.get(`${this.liveUrl}/user/user-info`)
  }
}

export default BaseService