<template>
  <div class="container">
    <img class="illus" src="./images/status/status_0.png" alt="" />
    <div class="status">
      {{
        ["等待审核", "审核失败", "缴纳成功", "审核通过"][
          statusInfo.review_status - 1
        ]
      }}
    </div>
    <div class="status-desc" v-if="statusInfo.review_status === 1">
      已提交申请，请耐心等待平台人员处理
    </div>
    <div class="status-desc" v-if="statusInfo.review_status === 2">
      失败原因：<br />
      {{ statusInfo.supplier_remark }}
    </div>
    <div class="status-desc" v-if="statusInfo.review_status === 4">
      恭喜您成功通过申请，赶快提交保证金
    </div>
    <div class="status-desc" v-if="statusInfo.review_status === 4">
      开启自己的赚钱之旅吧
    </div>
    <div class="status-desc" v-if="statusInfo.review_status === 3">
      店铺已开通
    </div>
    <button class="confirm-btn" @click="confirm">
      {{
        [
          "返回",
          "重新申请",
          "返回",
          `提交保证金（${statusInfo.supplier_bond}元）`,
        ][statusInfo.review_status - 1]
      }}
    </button>
    <div class="tips" v-if="statusInfo.review_status === 4">
      <p>
        提交保证金即代表同意平台的
        <span style="color: #FFBD64;" @click="checkAgreement">《商家入驻协议》</span>
      </p>
    </div>
  </div>
</template>

<script>
import { postMsg } from "@/utils/bridge";
import SupplierService from "./utils/supplierService";

const supplierService = new SupplierService();

export default {
  data() {
    return {
      statusInfo: {},
    };
  },

  created() {
    this.setStatusInfo();
  },

  methods: {
    async setStatusInfo() {
      this.statusInfo = (await supplierService.getStatusInfo()) || {};
    },

    async confirm() {
      switch (this.statusInfo.review_status) {
        case 2:
          this.$router.push("/supplier/info");
          break;

        case 4:
          postMsg({ type: "3", obj: { bond: this.statusInfo.supplier_bond } });
          break;

        default:
          postMsg({ type: "2" });
          break;
      }
    },

    checkAgreement() {
      window.location.href = 'https://h5.talking.vip/web/supplier/pages/agreement/index.html?head=no'
    }
  },
};
</script>

<style lang="stylus" scoped>
.container
  position: relative
  display: flex
  flex-direction: column
  align-items: center
  padding: 0 .5rem
  height: 100vh
  background: #fff
  .illus
    margin-top: 1rem
    width: 3.6rem
    height: 2.4rem
  .status
    margin-top: 1.44rem
    margin-bottom: .3rem
    color: #333
    font-size: .32rem
    font-weight: 500
  .status-desc
    color: #333
    font-size: .28rem
  .confirm-btn
    margin-top: 4rem
    width: 5.9rem
    height: 1rem
    color: #FFE5BD
    font-size: .32rem
    font-weight: 500
    background: linear-gradient(128deg, #404A5C 0%, #0F131A 100%)
    border-radius: .5rem
  .tips
    margin-top: .3rem
    color: #333
    font-size: .28rem
    text-align: center
</style>
