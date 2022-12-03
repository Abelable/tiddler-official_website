import BaseService from './baseService'

class RoomService extends BaseService {
  async getImInfo() {
    return await this.post(`${this.liveUrl}?r=lv/user/tim-login-info`)
  }

  async getRoomInfo(streamId) {
    let res = await this.post(`${this.liveUrl}?r=lv/room/getliveroomurl`, { streamId })
    let { audio_url: audioUrl, converts, direction, position, member_num: audienceCount, praise_count: praiseCount, fans_rank, fans_name, fans_points: fansPoints, hot_goods, is_follow: isFollow } = res
    let roomInfo = { audioUrl, isFollow, fansPoints, audienceCount, praiseCount,
      definition: converts || [],
      horizontal: !direction,
      position: position || '',
      fansRank: fans_rank ? Number(fans_rank) : 0,
      fansName: fans_name || '',
      hotGoods: (hot_goods && hot_goods.goods_id) ? hot_goods : null
    }
    return roomInfo
  }

  async getMsgHistory(room_id) {
    return await this.post(`${this.liveUrl}?r=lv/room/get-chat-message`, { room_id })
  }
}

export default RoomService