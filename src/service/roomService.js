import BaseService from './baseService'

class RoomService extends BaseService {
  async getImInfo() {
    return await this.post(`${this.liveUrl}/user/tim-login`)
  }

  async getRoomInfo(room_id, room_password, parent_user_id) {
    return await this.post(`${this.liveUrl}/live-stream/live-room-url`, { room_id, room_password, parent_user_id })
  }

  async getMsgHistory(room_id) {
    return await this.post(`${this.liveUrl}?r=lv/room/get-chat-message`, { room_id })
  }
}

export default RoomService