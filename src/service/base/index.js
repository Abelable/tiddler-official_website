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

  async get(url, params, success, fail) {
    return await this._axios({ url, params, success, fail })
  }

  async post(url, data, success, fail) {
    return await this._axios({ method: 'POST', url, data, success, fail })
  }

  async _axios({ method = 'GET', url, params, data, success, fail }) {
    axios.defaults.headers['platform'] = 'official_account'
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
          if (success) success(res.data.data)
          else return res.data.data
        } else {
          fail ? fail(res) : Toast(res.data.message)
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