import axios from "axios";
import qs from "qs";
import { Toast } from "vant";
import { env } from "../../utils/config";
import { judgeHost } from "../../utils/bridge";
import sign from "./sign";

class Base {
  constructor() {
    switch (env) {
      case "pro":
        this.mmsUrl = "https://mms.youboi.com";
        this.liveUrl = "https://api.talking.vip";
        this.yb_mmsUrl = "https://mms.youboi.com";
        this.yb_liveUrl = "https://newlive.youboi.com/index.php?r=";
        break;

      case "dev":
        this.mmsUrl = "https://mms.youboe.com";
        this.liveUrl = "https://api.talking.vip";
        break;
    }
  }

  async get(url, params, success, fail) {
    return await this._axios({ url, params, success, fail });
  }

  async post(url, data, success, fail) {
    return await this._axios({ method: "POST", url, data, success, fail });
  }

  async _axios({ method = "GET", url, params, data, success, fail }) {
    axios.defaults.headers["platform"] = "official_account";
    switch (judgeHost()) {
      case "IOS":
        axios.defaults.headers["application_key"] = "ybj_ios";
        break;

      case "android":
        axios.defaults.headers["application_key"] = "ybj_android";
        break;

      case "mp":
        axios.defaults.headers["application_key"] = "ybj_xcx";
        break;

      default:
        axios.defaults.headers["application_key"] = "ybj_h5";
        break;
    }
    axios.defaults.headers["app_name"] = "ruibo";
    if (method === "POST") {
      axios.defaults.headers["Content-Type"] =
        "application/x-www-form-urlencoded";
    }

    let token = localStorage.getItem("token") || '';

    const userId = localStorage.getItem("userId");
    if (userId && url.includes(this.mmsUrl)) {
      axios.defaults.headers["uid"] = btoa(encodeURI(`${userId}`));
    }

    if (url.includes(this.yb_liveUrl)) {
      url = `${this.liveUrl}/shop/index?url_path=/index.php&r=${url.replace(
        this.yb_liveUrl,
        ""
      )}`;
      token =
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJhdWQiOiJodHRwczpcL1wvd3d3LnlvdWJvMi5jbiIsInN1YiI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJleHAiOjE2OTUxOTAyNTMsInVzZXJfaWQiOjI2ODUyfQ.0NvkehlTEMVAjrjcsdg-6EDIAejmeKdi1AL8RXPMR7w";
    }
    if (url.includes(this.yb_mmsUrl)) {
      url = `${this.liveUrl}/shop/index?url_path=${url.replace(this.yb_mmsUrl, "")}`;
      token =
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJhdWQiOiJodHRwczpcL1wvd3d3LnlvdWJvMi5jbiIsInN1YiI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJleHAiOjE2OTUxOTAyNTMsInVzZXJfaWQiOjI2ODUyfQ.0NvkehlTEMVAjrjcsdg-6EDIAejmeKdi1AL8RXPMR7w";
    }

    if (token) axios.defaults.headers["token"] = token;

    let res = await axios({
      method,
      url,
      params,
      data:
        method === "POST" && url.indexOf(this.liveUrl) >= 0
          ? qs.stringify(sign(data))
          : qs.stringify(data),
    }).catch(() => {
      localStorage.removeItem("token");
      Toast("服务繁忙, 请重试");
    });

    if (res) {
      if ([200, 201, 204].includes(res.status)) {
        if ([200, 1001].includes(res.data.code)) {
          if (success) success(res.data.data);
          else return res.data.data;
        } else if ([4040, 0].includes(res.data.code)) {
          if (fail) {
            fail(res);
          } else {
            localStorage.removeItem("token");
            Toast("身份已失效，请重新点击链接进入");
            return false;
          }
        } else {
          fail ? fail(res) : Toast(res.data.message);
          return false;
        }
      } else {
        Toast(res.errMsg);
        return false;
      }
    }
  }
}

export default Base;
