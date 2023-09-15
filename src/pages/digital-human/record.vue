<template>
  <div>
    <div style="background-color: #ffffff;padding-top:200px;">
      <div class="video-box">
        <video
          ref="video"
          webkit-playsinline
          playsinline
          :controls="false"
          muted
          class="video"
        ></video>
      </div>
      <div class="checkagain" @click="startRecord">开始录制</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      mediaRecorder: {},
      recorderFile: {},
      stream: {},
      stopRecordCallback: null,
      video: null,
    };
  },

  created() {
    this.openCamera();
  },

  methods: {
    openCamera() {
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
      this.mediaRecorder.start(); // start方法里面传入一个时间片，每隔一个 时间片存储 一块数据
      setTimeout(() => {
        this.stopRecord(this.stream);
      }, 3 * 1000);
    },

    // 停止录制
    stopRecord(stream) {
      this.mediaRecorder.stop();
      this.closeStream(stream);
    },

    // 关闭流
    closeStream(stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => {
        track.stop();
      });
    },
  },
};
</script>

<style lang="stylus" scoped>
.checkagain {
  background-color: #f44242;
  height: 35px;
  position: fixed;
  width: 90%;
  margin-left: 5%;
  transform: translateY(2.5%);
  border-radius: 3px;
  font-size: 14px;
  text-align: center;
  line-height: 35px;
  bottom: 35px;
  color: #ffffff;
}
.video-box {
  width: 200px;
  height: 200px;
  border-radius: 100%;
  margin-left: calc((100% - 200px) / 2);
  -webkit-mask-image: -webkit-radial-gradient(circle, white 100%, black 100%);
  -webkit-transform: rotate(0.000001deg);
  -webkit-border-radius: 100%;
  -moz-border-radius: 100%;
  .video {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    object-fit: cover;
  }
}
</style>

<!-- <script>
import { reactive, ref, onMounted } from "vue"
export default {
  name: "v-video",
  setup(props, context) {
    const   this = reactive({
      mediaRecorder: {},
      recorderFile: {},
      stream: {},
      stopRecordCallback: null
    })

    const video = ref(null)
    
    onMounted(() => {
      openCamera()
    })

    const openCamera = () => {
      
    }

    

    return {
        this,
      video,
      startRecord
    }
  }
  
}
</script>
<style scoped lang="scss">

</style> -->
