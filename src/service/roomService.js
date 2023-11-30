import BaseService from "./baseService";

class RoomService extends BaseService {
  async getWxSign(path) {
    return await this.get(
      `${this.liveUrl}/official-account/get-sign?real_url=${path}`
    );
  }

  async getUserStudioInfo() {
    return await this.get(`${this.liveUrl}/user/choose-studio`);
  }

  async getImInfo() {
    return await this.post(`${this.liveUrl}/user/tim-login`);
  }

  async getRoomInfo(
    room_id,
    room_password = "",
    parent_user_id = "",
    success,
    fail
  ) {
    return await this.post(
      `${this.liveUrl}/live-stream/live-room-url`,
      { room_id, room_password, parent_user_id },
      success,
      fail
    );
  }

  async getMsgHistory(room_id) {
    const { list = [] } =
      (await this.get(`${this.liveUrl}/live-stream/get-chat-message`, {
        room_id,
        page: 1,
        page_size: 100,
        reverse: 1,
        order: "desc",
      })) || {};
    list.forEach((item) => {
      if (item.tag) {
        if (typeof item.tag === "string") {
          item.tag = JSON.parse(item.tag);
        }
      } else {
        item.tag = [];
      }
    });
    const liveChatReminder =
      "友情提示：直播间严谨出现违法违规，低俗血暴、吸烟醺酒、造谣诈骗等不良内容。";
    const warnTips = { message: liveChatReminder };
    const msgHistory = [...list, warnTips];
    return msgHistory;
  }

  async handleUser({
    studio_id,
    user_id,
    is_ban = 0,
    is_white = 0,
    is_black = 0,
    is_focus = 0,
    success,
  }) {
    return await this.post(
      `${this.liveUrl}/live-studio/live-user-update`,
      {
        studio_id,
        user_id,
        is_ban,
        is_white,
        is_black,
        is_focus,
      },
      success
    );
  }

  async getPhraseList(studio_id, type) {
    return await this.get(`${this.liveUrl}/live-studio/live-phrase-list`, {
      studio_id,
      type,
    });
  }

  async saveLiveMsg(
    room_id,
    nick_name,
    head_img,
    type_name,
    tag,
    message,
    time,
    is_vest = 0,
    success
  ) {
    return await this.post(
      `${this.liveUrl}/live-stream/save-chat-message`,
      { room_id, nick_name, head_img, type_name, tag, message, time, is_vest },
      success
    );
  }

  async setCurUserTagList(studio_id, user_id) {
    return await this.get(`${this.liveUrl}/live-tag/user-tag`, {
      studio_id,
      user_id,
    });
  }

  async getGoodsList(room_id, type, page, page_size = 10) {
    return await this.get(`${this.liveUrl}/live-stream/good-list`, {
      room_id,
      type,
      page,
      page_size,
      platform: "wechat",
    });
  }

  async getRecommendGoods(room_id) {
    const { list = [] } = (await this.getGoodsList(room_id, 3, 1, 1)) || {};
    return list.length ? list[0] : null;
  }

  async getAnimationList() {
    return (await this.get(`${this.liveUrl}/live-stream/dynamic`)) || {};
  }

  async savePraise(room_id, count) {
    return await this.post(`${this.liveUrl}/live-stream/like`, {
      room_id,
      count,
    });
  }

  async getVestList(studio_id) {
    return await this.get(`${this.liveUrl}/live-stream/vest-list`, {
      studio_id,
    });
  }

  async createPhrase(studio_id, type, content, success) {
    return await this.post(
      `${this.liveUrl}/live-studio/live-phrase-create`,
      {
        studio_id,
        type,
        content,
      },
      success
    );
  }

  async updateVest(id, name, head_img, success) {
    return await this.post(
      `${this.liveUrl}/live-stream/update-vest`,
      { id, name, head_img },
      success
    );
  }

  async getUserCategoryTagList(studio_id, room_id, type) {
    return await this.get(`${this.liveUrl}/live-studio/user-tag`, {
      studio_id,
      room_id,
      type,
    });
  }

  async getRoomOnlineUserList({
    studio_id,
    room_id,
    type = "",
    tag_id = "",
    parent_user_id = "",
  }) {
    return await this.get(`${this.liveUrl}/live-studio/online-user`, {
      studio_id,
      room_id,
      type,
      tag_id,
      parent_user_id,
    });
  }

  async getHandledUserList({
    studio_id,
    type,
    tag_id = "",
    room_id = "",
    page = 1,
    page_size = 10,
  }) {
    return await this.get(`${this.liveUrl}/live-studio/is-user-list`, {
      studio_id,
      tag_id,
      room_id,
      type,
      page,
      page_size,
    });
  }

  async getOnlineUserListNotify() {
    return await this.post(`${this.liveUrl}/live-stream/online-message`);
  }

  async getCurUserTagList(studio_id, user_id) {
    return await this.get(`${this.liveUrl}/live-tag/user-tag-select`, {
      studio_id,
      user_id,
    });
  }

  async getUserTagList(studio_id, tag_type = 0) {
    return await this.get(`${this.liveUrl}/live-tag/tag-list`, {
      studio_id,
      tag_type,
    });
  }

  async bindUserTag(studio_id, tag_id, user_id, success) {
    return await this.post(
      `${this.liveUrl}/live-tag/tag-user-bind`,
      { studio_id, tag_id, user_id },
      success
    );
  }

  async createUserTag(
    studio_id,
    tag_name,
    tag_type,
    font_color,
    bg_color,
    cond,
    success
  ) {
    return await this.post(
      `${this.liveUrl}/live-tag/create-tag`,
      { studio_id, tag_type, tag_name, font_color, bg_color, cond },
      success
    );
  }

  async getEnterAnimationList(studio_id, user_id, type) {
    return await this.get(`${this.liveUrl}/gift/enter-room-user-list`, {
      studio_id,
      user_id,
      type,
    });
  }

  async getEnterAnimationTimeOptions() {
    return await this.post(`${this.liveUrl}/gift/enter-room-time`);
  }

  async updateEnterAnimation(studio_id, user_id, gift_id, use_time, success) {
    return await this.post(
      `${this.liveUrl}/gift/update-enter-room-user`,
      {
        studio_id,
        user_id,
        gift_id,
        use_time,
      },
      success
    );
  }

  async deleteEnterAnimation(studio_id, user_id, id, success) {
    return await this.post(
      `${this.liveUrl}/gift/enter-room-delete`,
      {
        studio_id,
        user_id,
        id,
      },
      success
    );
  }

  async createRobot(studio_id, room_id, num, like_num, minutes, success) {
    return await this.post(
      `${this.liveUrl}/live-stream/create-robot`,
      { studio_id, room_id, num, like_num, minutes },
      success
    );
  }

  async checkHasCreatedRobot(studio_id, room_id) {
    return await this.get(`${this.liveUrl}/live-stream/get-robot`, {
      studio_id,
      room_id,
    });
  }

  async deleteRobot(studio_id, room_id, success) {
    return await this.post(
      `${this.liveUrl}/live-stream/delete-robot`,
      { studio_id, room_id },
      success
    );
  }

  async getRoomUserInfo(studio_id, room_id, user_id) {
    return await this.get(`${this.liveUrl}/live-studio/user-info-all`, {
      studio_id,
      room_id,
      user_id,
    });
  }
}

export default RoomService;
