let isInApp = () => {
  return navigator.userAgent.toLowerCase().indexOf('ruibo') !== -1
}

let isInIOS = () => {
  return !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
}

let judgeHost = () => {
  let host
  if (window.__wxjs_environment === 'miniprogram') host = 'mp'
  else if (isInApp()) {
    if (isInIOS()) host = 'IOS'
    else host = 'android'
  }
  else host = 'web'
  return host
}

const postMsg = obj => {
  if (isInApp()) {
    if (isInIOS()) window.webkit.messageHandlers.TBBAPPJSBridge.postMessage(JSON.stringify(obj))
    else window.TBBAPPJSBridge.postMessage(JSON.stringify(obj))
  }
}

export { 
  isInApp,
  isInIOS,
  judgeHost,
  postMsg
}