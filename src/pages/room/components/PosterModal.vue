<template>
  <div class="modal" @click="hide">
    <div class="main" @click.stop="">
      <canvas id="poster" class="poster" width="335" height="580" />
      <div class="btn" @click.stop="save">保存海报</div>
      <div class="btn" @click.stop="copyLink">仅复制链接</div>
    </div>
  </div>
</template>

<script>
let canvas = null;
let ctx = null;

import { Toast } from "vant";
import { formatDate } from "@/utils/index";
import RoomService from "@/service/roomService";
const roomService = new RoomService();

export default {
  props: {
    roomInfo: Object,
  },

  data() {
    return {
      shareInfo: {},
    };
  },

  async mounted() {
    Toast.loading({ message: "海报加载中..." });
    await this.setShareInfo();
    canvas = document.getElementById("poster");
    ctx = canvas.getContext("2d");
    await this.creatRoomPoster();
    Toast.clear();
  },

  methods: {
    async setShareInfo() {
      const {
        id,
        cover,
        title,
        studio_id,
        status,
        lv_start_time,
        studio_head_img: avatar,
        studio_title: name,
        notice_time,
      } = this.roomInfo;
      const {
        web_url_qrcode: qrCode,
        web_url,
      } = await roomService.getShareInfo(studio_id, 3, id);
      this.shareInfo = {
        cover,
        title,
        avatar,
        name,
        qrCode,
        web_url,
        status: Number(status),
        startTime: lv_start_time * 1000,
        noticeTime: notice_time * 1000,
      };
    },

    async creatRoomPoster() {
      const {
        cover,
        title,
        avatar,
        name,
        status,
        qrCode,
        startTime,
        noticeTime,
      } = this.shareInfo;

      await this.drawImage(
        require("../../../assets/images/poster/poster-bg.png"),
        0,
        0,
        335,
        580
      );
      await this.drawImage(
        require("../../../assets/images/poster/poster-content-bg.png"),
        30,
        81,
        275,
        458
      );

      await this.roundRect(128, 41, 80, 80, 40, avatar, null, "#fff");

      this.setText(16, "#2F3241", 167.5, 150, name, "center");

      this.setText(
        14,
        "#909090",
        167.5,
        174,
        title.length > 20 ? title.slice(0, 20) + "..." : title,
        "center"
      );

      await this.drawImage(cover, 30, 195, 275, 150);

      const statusArr = [
        {},
        { desc: "直播中", color: "#FFE5BD", bgColor: "#404A5C" },
        { desc: "预告", color: "#fff", bgColor: "#223556" },
        { desc: "回放", color: "#2F3241", bgColor: "#DAB174" },
      ];
      this.roundRect(
        42,
        206,
        48,
        19,
        2,
        "",
        null,
        statusArr[Number(status)].bgColor
      );
      this.setText(
        12,
        statusArr[Number(status)].color,
        66,
        220,
        statusArr[Number(status)].desc,
        "center"
      );

      this.roundRect(86, 363, 164, 22, 11, "", null, "#404A5C");
      this.setText(
        12,
        "#fff",
        167.5,
        379,
        formatDate(
          status === 2
            ? new Date(noticeTime)
            : startTime
            ? new Date(startTime)
            : new Date(),
          "MM月DD日 week hh:mm"
        ),
        "center"
      );

      await this.drawImage(qrCode, 118, 395, 100, 100);
      this.setText(12, "#9E9E9E", 167.5, 516, "长按识别观看直播", "center");
    },

    async roundRect(
      x,
      y,
      w,
      h,
      r = 0,
      cover = "",
      shadow = null,
      c = "transparent"
    ) {
      ctx.save();
      ctx.beginPath();

      if (shadow) {
        let { x, y, blur, color } = shadow;
        ctx.shadowOffsetX = x;
        ctx.shadowOffsetY = y;
        ctx.shadowBlur = blur;
        ctx.shadowColor = color;
      }
      let r1, r2, r3, r4;
      typeof r === "number" ? (r1 = r2 = r3 = r4 = r) : ([r1, r2, r3, r4] = r);

      ctx.moveTo(x, y);
      r2 ? ctx.arcTo(x + w, y, x + w, y + h, r2) : ctx.lineTo(x + w, y);
      r3 ? ctx.arcTo(x + w, y + h, x, y + h, r3) : ctx.lineTo(x + w, y + h);
      r4 ? ctx.arcTo(x, y + h, x, y, r4) : ctx.lineTo(x, y + h);
      r1 ? ctx.arcTo(x, y, x + w, y, r1) : ctx.lineTo(x, y);

      ctx.fillStyle = c;
      ctx.fill();

      if (cover) {
        ctx.clip();
        await this.drawImage(cover, x, y, w, h);
      }
      ctx.restore();
    },

    setText(fs, color, x, y, c, align = "left") {
      ctx.font = `${fs}px`;
      ctx.fillStyle = color;
      ctx.textAlign = align;
      ctx.fillText(c, x, y);
      ctx.restore();
    },

    drawImage(src, x, y, w, h) {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = `${src}?time=${new Date().valueOf()}`;
        img.setAttribute("crossOrigin", "Anonymous");
        img.onload = () => {
          ctx.drawImage(img, x, y, w, h);
          resolve();
        };
      });
    },

    save() {
      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = "image.png";
      a.click();
      Toast("保存成功");
      this.hide();
    },

    copyLink() {
      const textareaC = document.createElement("textarea");
      textareaC.setAttribute("readonly", "readonly");
      textareaC.value = this.shareInfo.web_url;
      document.body.appendChild(textareaC);
      textareaC.select();
      document.execCommand("copy");
      document.body.removeChild(textareaC);
      Toast("复制成功");
      this.hide();
    },

    hide() {
      this.$emit("hide");
    },
  },
};
</script>

<style lang="stylus" scoped>
.modal
  position: fixed
  top: 0
  left: 0
  width: 100vw
  height: 100vh
  background-color: rgba(0, 0, 0, 0.3)
  backdrop-filter: blur(10px)
  z-index: 100
  .main
    position: absolute
    top: 50%
    left: 50%
    transform: translate(-50%, -50%)
.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 15px auto 0;
  padding: 0 20px;
  width: 200px;
  height: 40px;
  color: #2F3241;
  font-size: 13px;
  font-weight: 600;
  border-radius: 20px;
  background: linear-gradient(315deg, #DAB174 0%, #FFE5BD 100%);
}
</style>
