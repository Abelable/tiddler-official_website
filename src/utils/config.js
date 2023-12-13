// 环境配置：'pro' - 正式环境, 'dev' - 开发环境, 'beta' - 预发布环境
let env = 'pro'
let h5Url = "https://h5.talking.vip"
let liveUrl = "https://api.talking.vip";
if(window.location.host == 'h5.ningzhijie.top'){
  h5Url = "https://h5.ningzhijie.top"
  liveUrl = "https://api.ningzhijie.top";
}
export { env, liveUrl, h5Url }
