import { Toast } from "vant";
import crypto from "crypto-js";
import { Base64 } from "js-base64";
import { formatDate } from "@/utils/index";
import BaseService from "@/service/baseService";

export const upload = async (file, limit = 5) => {
  let ossConfig;
  if (localStorage.getItem("ossConfig")) {
    ossConfig = JSON.parse(localStorage.getItem("ossConfig"));
    if (new Date().getTime() > new Date(ossConfig.Expiration).getTime()) {
      ossConfig = await setOssConfig();
    }
  } else {
    ossConfig = await setOssConfig();
  }
  const formData = new FormData();
  const policy = createPolicy(limit);
  const signature = createSignature(ossConfig.AccessKeySecret, policy);
  const ossHost = "https://wenshang-img.oss-accelerate.aliyuncs.com";
  const key = `img/${formatDate(new Date(), "YYYY-MM-DD")}/${new Date().getTime()}_${file.name}`;
  formData.append("key", key);
  formData.append("success_action_status", "200");
  formData.append("x-oss-object-acl", "public-read");
  formData.append("policy", policy);
  formData.append("signature", signature);
  formData.append("OSSAccessKeyId", ossConfig.AccessKeyId);
  formData.append("x-oss-security-token", ossConfig.SecurityToken);
  formData.append("file", file);
  await window
    .fetch(ossHost, {
      method: "POST",
      body: formData,
    })
    .catch(() => {
      Toast("上传失败，请重试");
    });

  return `${ossHost}/${key}`;
};

const setOssConfig = async () => {
  const config = await new BaseService().getOssInfo();
  localStorage.setItem("ossConfig", JSON.stringify(config));
  return config;
};

const createPolicy = (limit) => {
  const date = new Date();
  date.setHours(date.getHours() + 10);
  const policyText = {
    expiration: date.toISOString(),
    conditions: [["content-length-range", 0, limit * 1024 * 1024]],
  };
  const policy = Base64.encode(JSON.stringify(policyText));
  return policy;
};

const createSignature = (accessKeySecret, canonicalString) => {
  return crypto.enc.Base64.stringify(
    crypto.HmacSHA1(canonicalString, accessKeySecret)
  );
};
