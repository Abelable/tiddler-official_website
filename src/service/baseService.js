import Base from './base/index'

class BaseService extends Base {
  async getOssInfo() {
    return await this.post(`${this.liveUrl}/common/ali-sts`);
  }
}

export default BaseService