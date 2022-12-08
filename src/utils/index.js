export const getUrlParam = (name) => {
  const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i")
  const r = window.location.search.substr(1).match(reg)
  if (r) return decodeURIComponent(r[2])
  return ""
}
