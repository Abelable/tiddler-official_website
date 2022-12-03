import axios from 'axios'
import qs from 'qs'
import { Toast } from 'vant'
import { env } from '../../utils/config'
import sign from './sign'
class Base {
  constructor() {
    switch (env) {
      case 'pro':
        this.mmsUrl = 'https://mms.youboi.com'
        this.liveUrl = 'https://youbojia.youboi.com'
        break

      case 'dev':
        this.mmsUrl = 'https://mms.youboe.com'
        this.liveUrl = 'https://youbojia.youboe.com'
        break
    }
  }

  async get(url, params) {
    return await this._axios({ url, params })
  }

  async post(url, data) {
    return await this._axios({ method: 'POST', url, data})
  }

  async _axios({ method = 'GET', url, params, data }) {
    axios.defaults.headers['platform'] = 'wechat'
    if (method === 'POST') axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    const token = localStorage.getItem('token')
    if (token) axios.defaults.headers['token'] = token

    let res = await axios({ method, url, params, 
      data: (method === 'POST' && url.indexOf(this.liveUrl) >= 0) ? qs.stringify(sign(data)) : qs.stringify(data),
    }).catch(() => {
      Toast('服务器异常')
    })

    if (res) {
      if ([200, 201, 204].includes(res.status)) {
        if ([200, 1001].includes(res.data.code)) {
          return res.data.data
        } else {
          Toast(res.data.message)
          return false
        }
      } else {
        Toast(res.errMsg)
        return false
      }
    }
  }
}

export default Base