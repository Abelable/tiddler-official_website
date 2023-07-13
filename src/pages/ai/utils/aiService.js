import BaseService from "@/service/baseService";

class aiService extends BaseService {
  async getHotTopic() {
    return await this.get(`${this.mmsUrl}/api/v4/gpt/hot_topic`);
  }

  async getAssistantTypeList() {
    return await this.get(`${this.mmsUrl}/api/v4/gpt/assistant_type`);
  }

  async getAssistantList({
    user_id = 0,
    type,
    is_goods = 2,
    page = 1,
    page_size = 10,
  }) {
    return await this.get(`${this.mmsUrl}/api/v4/gpt/assistant_list`, {
      user_id,
      type,
      is_goods,
      page,
      page_size,
    });
  }

  async getUserAssistantList({ type, page, page_size = 10 }) {
    return await this.get(`${this.mmsUrl}/api/v4/gpt/user_assistant_list`, {
      type,
      page,
      page_size,
    });
  }

  async addUserAssistant(gpt_assistant_id) {
    return await this.post(`${this.mmsUrl}/api/v4/gpt/add_user_assistant`, {
      gpt_assistant_id,
    });
  }

  async unAddUserAssistant(gpt_assistant_id) {
    return await this.post(`${this.mmsUrl}/api/v4/gpt/delete_user_assistant`, {
      gpt_assistant_id,
    });
  }

  async getHistorySessionList(page, page_size = 10) {
    return await this.get(`${this.mmsUrl}/api/v4/gpt/session_list`, {
      page,
      page_size,
    });
  }

  async deleteSession(id) {
    return await this.post(`${this.mmsUrl}/api/v4/gpt/delete_session`, {
      id,
    });
  }

  async clearSessionHistory() {
    return await this.post(`${this.mmsUrl}/api/v4/gpt/clear_session`);
  }

  async createSession(gpt_assistant_id = 0) {
    return await this.post(`${this.mmsUrl}/api/v4/gpt/add_session`, {
      gpt_assistant_id,
    });
  }

  async getHistoryMsgList(
    gpt_session_id,
    page = 1,
    page_size = 100,
    is_reversal = 1
  ) {
    return await this.get(`${this.mmsUrl}/api/v4/gpt/message_list`, {
      gpt_session_id,
      page,
      page_size,
      is_reversal,
    });
  }

  async saveChatMsg(gpt_session_id, role, content, avatar, custom_content) {
    return await this.post(`${this.mmsUrl}/api/v4/gpt/add_message`, {
      gpt_session_id,
      role,
      content,
      avatar,
      custom_content
    });
  }

  async getAssistantDetail(id) {
    return await this.get(`${this.mmsUrl}/api/v4/gpt/assistant`, { id });
  }

  async transformVoiceSource(Text) {
    return await this.post(`${this.mmsUrl}/api/v4/gpt/str_to_voice`, { Text });
  }

  async filterSensitiveContent(content, success, fail) {
    return await this.post(
      `${this.mmsUrl}/api/v4/gpt/shumei`,
      { content },
      success,
      fail
    );
  }

  async searchGoodsList({
    title,
    page = 1,
    pageSize = 10,
    searchType = 0,
    sortType = 1,
  }) {
    return await this.get(`${this.mmsUrl}/api/v4/taoke/goods_list`, {
      title,
      searchType,
      sortType,
      page,
      pageSize,
    });
  }
}

export default aiService;
