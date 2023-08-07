import Base from './base/index'

class BaseService extends Base {
  async getCurrentUserInfo() {
    return await this.get(`${this.liveUrl}/user/user-info`)
  }

  async getOssInfo() {
    return await this.post(`${this.liveUrl}/common/ali-sts`);
  }
}

export default BaseService