import Base from "./base/index";

class BaseService extends Base {
  async getCurrentUserInfo1(id) {
    return await this.get(`${this.liveUrl}/user/user-info`, {id});
  }

  async getOssInfo() {
    return await this.post(`${this.liveUrl}/common/ali-sts`);
  }

  async sendCode(data,success,fail) {
    return await this.post(`${this.liveUrl}/user/send-verification`, data,success,fail);
  }

  async bindNewMobile(data,success,fail) {
    return await this.post(`${this.liveUrl}/user/bind-new-mobile`, data,success,fail);
  }

  async createStudioManager(studio_id, user_type, parent_user_id, success) {
    return await this.post(
      `${this.liveUrl}/live-studio/studio-manager`,
      { studio_id, user_type, parent_user_id },
      success
    );
  }
}

export default BaseService;
