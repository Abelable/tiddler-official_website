import BaseService from './baseService'

class TrafficService extends BaseService {
  async getRoomInfo(room_id) {
    return await this.get(`${this.liveUrl}/live-stream/room-info`, { room_id })
  }

  async getChartData(room_id, type, search_time = '') {
    return await this.post(`${this.liveUrl}/live-studio/studio-flux-log-chart`, { room_id, type, search_time })
  }
}

export default TrafficService
