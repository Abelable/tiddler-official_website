import Base from "./base/index";

class BaseService extends Base {
  async getCurrentUserInfo() {
    return await this.get(`${this.liveUrl}/user/user-info`);
  }

  async getOssInfo() {
    return await this.post(`${this.liveUrl}/common/ali-sts`);
  }

  async createStudioManager(studio_id, user_type, success) {
    return await this.post(
      `${this.liveUrl}/live-studio/studio-manager`,
      { studio_id, user_type },
      success
    );
  }
}

export default BaseService;
