import BaseService from './baseService'

class RoomService extends BaseService {
  async getImInfo() {
    return await this.post(`${this.liveUrl}/user/tim-login`)
  }

  async getRoomInfo(room_id, room_password, parent_user_id) {
    return await this.post(`${this.liveUrl}/live-stream/live-room-url`, { room_id, room_password, parent_user_id })
  }

  async getMsgHistory(room_id) {
    const { list = [] } = await this.get({ 
      url: `${this.liveUrl}/live-stream/get-chat-message`, 
      data: { room_id, page: 1, page_size: 100, reverse: 1, order: 'desc' }
    }) || {}
    list.forEach((item) => {
      item.tag = item.tag ? JSON.parse(item.tag) : []
    })
    const liveChatReminder = '友情提示：直播间严谨出现违法违规，低俗血暴、吸烟醺酒、造谣诈骗等不良内容。'
    const warnTips = { message: liveChatReminder }
    const msgHistory = [...list, warnTips]
    return msgHistory
  }
}

export default RoomService