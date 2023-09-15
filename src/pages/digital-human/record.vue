<template>
  <div class="container">
    <div class="nav-bar">
      <img src="./images/record/back.png" alt="" class="back-icon" />
      <div class="nav-bar-title">录制数字人</div>
      <div class="finish-btn" :style="{ opacity: recording ? 1 : 0 }" @click="finish">录制完成</div>
    </div>
    <div class="warning">
      <img src="./images/record/tips.png" alt="" class="tips-icon">
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

      <div class="controller-wrap">
        <div class="change-btn" :style="{ opacity: !recording ? 1 : 0 }">
          <img src="./images/record/change.png" alt="" class="change-icon">
          <div>换一换</div>
        </div>
        <div class="switch-wrap">
          <div style="margin-right: .1rem">拼音</div>
          <van-switch v-model="opened" size="18px" inactive-color="#656565" />
        </div>
      </div>

        <div class="words-wrap">
          <p class="words">
            我做自媒体已经差不多有一年的时间了，今天来和大家分享一下。自从我做自媒体训练语言表达之后呢，有很多的朋友一直想了解具体是怎么做的…我做自媒体已经差不多有一年的时间了，今天来和大家分享一下。自从我做自媒体训练语言表达之后呢，有很多的朋友一直想了解具体是怎么做的…
          </p>
        </div>

        <div class="outline-wrap">
          <img src="./images/record/outline.png" alt="" class="outline">
          <img @click="start" v-if="!recording" src="./images/record/start-btn.png" alt="" class="start-btn">
        </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      recording: false,
      opened: false
    };
  },

  created() {
    // this.openCamera();
  },

  methods: {
    start() {
      this.openCamera(() => {
        this.startRecord()
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
          callback()
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
      this.recording = true
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
        return
      }
      this.stopRecord()
    }
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
    .controller-wrap
      display: flex
      align-items: center
      justify-content: space-between
      width: 100%
      .change-btn
        display: flex
        align-items: center
        color: #9A9B9F
        font-size: .28rem
        font-weight: 600
        .change-icon
          width: .32rem
          height: .32rem
      .switch-wrap
        display: flex
        align-items: center
        color: #fff
        font-size: .24rem
        font-weight: 600
    .words-wrap
      margin-top: .3rem
      padding: 0 .24rem
      width: 100%
      flex: 1
      border-radius: .2rem
      background: rgba(0, 0, 0, 0.3)
      overflow-y: scroll
      .words
        padding: .2rem 0
        color: #fff
        font-size: .32rem
    .outline-wrap
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
