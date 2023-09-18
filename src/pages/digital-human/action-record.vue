<template>
  <div class="container">
    <div class="nav-bar">
      <img src="./images/record/back.png" alt="" class="back-icon" />
      <div class="nav-bar-title">录制动作库</div>
      <div
        class="finish-btn"
        :style="{ opacity: recording ? 1 : 0 }"
        @click="finish"
      >
        录制完成
      </div>
    </div>
    <div class="warning">
      <img src="./images/record/tips.png" alt="" class="tips-icon" />
      <div>请暂时关闭其他应用，保持手机流畅录制</div>
    </div>

    <div class="video-wrap">
      <video
        class="video"
        ref="video"
        webkit-playsinline
        playsinline
        :controls="false"
        muted
      ></video>

      <div class="action-name">挥手动作</div>
      <div class="action-video-wrap">
        <img src="./images/temp/action-video.jpg" alt="" class="action-video">
      </div>

      <div class="outline-wrap">
        <img src="./images/record/outline.png" alt="" class="outline" />
        <img
          @click="start"
          v-if="!recording"
          src="./images/record/start-btn.png"
          alt=""
          class="start-btn"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      recording: false,
      opened: false,
    };
  },

  filters: {
    timing(count) {
      return `${`${Math.floor(count / 60)}`.padStart(2, "0")}:${`${count %
        60}`.padStart(2, "0")}`;
    },
  },

  methods: {
    start() {
      this.openCamera(() => {
        this.startRecord();
      });
    },

    openCamera(callback) {
      this.getUserMedia((error, stream) => {
        if (error) {
          console.log(error);
        } else {
          let options = { mimeType: "video/webm;codecs=vp9,opus" };
          if (!MediaRecorder.isTypeSupported(options.mimeType)) {
            console.log(`${options.mimeType} is not supported`);
            options = { mimeType: "video/webmcodecs=vp8,opus" };
            if (!MediaRecorder.isTypeSupported(options.mimeType)) {
              console.log(`${options.mimeType} is not supported`);
              options = { mimeType: "video/webm" };
              if (!MediaRecorder.isTypeSupported(options.mimeType)) {
                console.log(`${options.mimeType} is not supported`);
                options = { mimeType: "" };
              }
            }
          }
          this.mediaRecorder = new MediaRecorder(stream, options);
          callback();
          this.stream = stream;
          // 存储数据流
          let chunks = [];
          this.$refs.video.srcObject = stream;
          this.$refs.video.play();
          this.mediaRecorder.ondataavailable = (e) => {
            this.mediaRecorder.blobs.push(e.data);
            chunks.push(e.data);
          };
          this.mediaRecorder.blobs = [];
          this.mediaRecorder.onstop = () => {
            // 数据流转换为 file
            this.recorderFile = this.getRecorderFile(chunks);
            console.log("this.recorderFile", this.recorderFile);
          };
        }
      });
    },

    getUserMedia(callback) {
      const constraints = {
        // 表示同时采集视频金和音频
        video: {
          width: 400, // 宽带
          height: 400, // 高度
          frameRate: 15, // 帧率
          facingMode: "user", //  设置为前置摄像头
        },
        audio: true, // 将声音获取设为true
      };
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        callback(new Error("您的浏览器暂不支持视频录制"));
      } else {
        navigator.mediaDevices
          .getUserMedia(constraints)
          .then(function(stream) {
            callback(false, stream);
          })
          .catch(function(error) {
            callback(error);
          });
      }
    },

    getRecorderFile(chunks) {
      const blob = new Blob(chunks, { type: this.mediaRecorder.mimeType });
      const file = new File([blob], "media_.mp4");
      return file;
    },

    // 开始录制
    startRecord() {
      this.mediaRecorder.start();
      this.recording = true;
    },

    // 停止录制
    stopRecord() {
      this.mediaRecorder.stop();
      this.closeStream(this.stream);
    },

    // 关闭流
    closeStream(stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => {
        track.stop();
      });
    },

    finish() {
      if (!this.recording) {
        return;
      }
      this.stopRecord();
      this.recording = false;
    },
  },
};
</script>

<style lang="stylus" scoped>
.container
  background: #333333
  height: 100vh
  .nav-bar
    padding: 0 .3rem
    width: 100%
    height: 1.2rem
    display: flex
    align-items: center
    overflow: hidden
    z-index: 100
    .back-icon
      width: .36rem
      height: .36rem
    .nav-bar-title
      padding-left: .76rem
      flex: 1
      color: #fff
      font-size: .36rem
      font-weight: 600
      text-align: center
    .finish-btn
      color: #fff
      font-size: .28rem
  .warning
    display: flex
    justify-content: center
    height: .6rem
    color: #9A9B9F
    font-size: .24rem
    .tips-icon
      width: .32rem
      height: .32rem
  .video-wrap
    position: relative
    display: flex
    flex-direction: column
    align-items: center
    padding: .3rem .4rem .8rem
    height: calc(100vh - 2rem)
    .video
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: calc(100vh - 1.8rem)
      object-fit: cover
    .action-name
      color: #fff
      font-size: .28rem
      font-weight: 600
      text-align: center
    .action-video-wrap
      margin-top: .2rem
      width: 100%
      height: 3.8rem
      border-radius: .06rem
      overflow: hidden
      z-index: 10
      .action-video
        width: 100%
        height: 100%
    .outline-wrap
      position: absolute
      bottom: .8rem
      left: 0
      width: 100%
      display: flex
      flex-direction: column
      align-items: center
      height: 8.45rem
      .outline
        margin-top: .3rem
        width: 6.18rem
        height: 7.7rem
      .start-btn
        margin-top: -0.75rem
        width: 1.5rem
        height: 1.5rem
</style>
