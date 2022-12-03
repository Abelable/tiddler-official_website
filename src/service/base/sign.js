import md5 from 'js-md5'
import { env } from '../../utils/config'

const appKey = "Mini_1.0"
const signKey = env === 'pro' ? '40f6e43870bd6acf1455b087509aa91d' : '9d7b0200684e68b33d748515cb88a948'

let sign = (data) => {
  data = objKeySort({ _time: Date.now() / 1000 + localStorage.getItem('diffTime'), app_key: appKey, ...data })
  let str = `${appKey}`
  for (let i in data) {
    str += `${i}${data[i]}`
  }
  str += signKey
  data = { ...data, _sign: md5(md5(str)).toLowerCase() }
  return data
}

let objKeySort = obj => {
  let newkey = Object.keys(obj).sort()
  let newObj = {}
  newkey.forEach(item => {
    newObj[item] = obj[item]
  })
  return newObj
}


export default sign
