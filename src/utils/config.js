// 环境配置：'pro' - 正式环境, 'dev' - 开发环境, 'beta' - 预发布环境
let env = 'pro' 
if (window.location.href.includes('youboe')) env = 'dev'
else if (window.location.href.includes('youboi')) env = 'pro'

export { env }