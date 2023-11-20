import BaseService from './baseService'

class RoomService extends BaseService {
  async getWxSign(path) {
    return await this.get(`${this.liveUrl}/official-account/get-sign?real_url=${path}`)
  }

  async getImInfo() {
    return await this.post(`${this.liveUrl}/user/tim-login`)
  }

  async getRoomInfo(room_id, room_password = '', parent_user_id = '', success, fail) {
    return await this.post(`${this.liveUrl}/live-stream/live-room-url`, { room_id, room_password, parent_user_id }, success, fail)
  }

  async getMsgHistory(room_id) {
    const { list = [] } = await this.get(`${this.liveUrl}/live-stream/get-chat-message`, { room_id, page: 1, page_size: 100, reverse: 1, order: 'desc' }) || {}
    list.forEach((item) => {
      if (item.tag) {
        if (typeof item.tag === 'string') {
          item.tag = JSON.parse(item.tag)
        }
      } else {
        item.tag = []
      }
    })
    const liveChatReminder = '友情提示：直播间严谨出现违法违规，低俗血暴、吸烟醺酒、造谣诈骗等不良内容。'
    const warnTips = { message: liveChatReminder }
    const msgHistory = [...list, warnTips]
    return msgHistory
  }

  async handleUser({ studio_id, user_id, is_ban = 0, is_white = 0, is_black = 0, is_focus = 0 }) {
    return await this.post(`${this.liveUrl}/live-studio/live-user-update`, { studio_id, user_id, is_ban, is_white, is_black, is_focus })
  }

  async getPhraseList(studio_id, type) {
    return await this.get(`${this.liveUrl}/live-studio/live-phrase-list`, { studio_id, type })
  }

  async saveLiveMsg(room_id, nick_name, head_img, type_name, tag, message, time, is_vest = 0, success) {
    return await this.post(`${this.liveUrl}/live-stream/save-chat-message`, { room_id, nick_name, head_img, type_name, tag, message, time, is_vest }, success)
  }

  async setCurUserTagList(studio_id, user_id) {
    return await this.get(`${this.liveUrl}/live-tag/user-tag`, { studio_id, user_id })
  }

  async getGoodsList(room_id, type, page, page_size = 10) {
    return await this.get(`${this.liveUrl}/live-stream/good-list`, { room_id, type, page, page_size, platform: 'wechat' })
  }

  async getRecommendGoods(room_id) {
    const { list = [] } = await this.getGoodsList(room_id, 3, 1, 1) || {}
    return list.length ? list[0] : null
  }

  async getAnimationList() {
    return await this.get(`${this.liveUrl}/live-stream/dynamic`) || {}
  }

  async savePraise(room_id, count) {
    return await this.post(`${this.liveUrl}/live-stream/like`, { room_id, count })
  }
}

export default RoomService
