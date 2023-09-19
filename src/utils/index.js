export const getUrlParam = (name) => {
  const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  const r = window.location.search.substr(1).match(reg);
  if (r) return decodeURIComponent(r[2]);
  return "";
};

export const formatDate = (date, format) => {
  const week = ["日", "一", "二", "三", "四", "五", "六"];
  const formatObj = {
    YYYY: date.getFullYear(),
    MM: `${date.getMonth() + 1}`.padStart(2, "0"),
    DD: `${date.getDate()}`.padStart(2, "0"),
    hh: `${date.getHours()}`.padStart(2, "0"),
    mm: `${date.getMinutes()}`.padStart(2, "0"),
    ss: `${date.getSeconds()}`.padStart(2, "0"),
    week: `星期${week[date.getDay()]}`,
  };

  for (const key in formatObj) {
    format = format.replace(key, formatObj[key]);
  }

  return format;
};
