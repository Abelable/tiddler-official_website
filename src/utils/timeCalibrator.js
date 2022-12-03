import BaseService from '../service/baseService'

class TimeCalibrator extends BaseService {
  async setDiffTime() {
    const { now_time } = await this.getServiceTimeStamp()
    const diffTime = now_time * 1000 - new Date().getTime()
    localStorage.setItem('diffTime', diffTime)
  }
}

export default TimeCalibrator
