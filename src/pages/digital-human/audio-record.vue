<template>
  <div class="container">
    <img src="./images/icons/back_w.png" class="back" @click="goBack" />
    <div class="header">
      声音克隆
      <span class="right" @click="goSave">
        录制完成
      </span>
    </div>
    <div class="notice">
      <img src="./images/icons/notice.png" class="icon" />
      <span>请暂时关闭其他应用，保持手机流畅录制</span>
    </div>
    <div class="btns">
      <div class="left" @click="huanFn">
        <img src="./images/icons/refresh.png" class="icon" />
        <span>换一换</span>
      </div>
      <div class="right">
        <span>拼音</span>
        <div class="switch" :class="{'switch_on':switchValue}" @click="switchValue = !switchValue">
          <div class="switch_bar"></div>
        </div>
      </div>
    </div>
    <div class="textarea">
      {{switchValue?curTxt.pinyin:curTxt.txt}}
    </div>
    <div class="bottom_fix">
      <div class="recording_box" v-show="isRecord">
        <div class="gifs">
          <div class="gif gif1"><span :style="'height:'+(recordVolume-12+20>100?100:recordVolume-12+20)+'%'"></span></div>
          <div class="gif gif2"><span :style="'height:'+(recordVolume-10+20>100?100:recordVolume-10+20)+'%'"></span></div>
          <div class="gif gif3"><span :style="'height:'+(recordVolume-8+20>100?100:recordVolume-8+20)+'%'"></span></div>
          <div class="gif gif4"><span :style="'height:'+(recordVolume-6+20>100?100:recordVolume-6+20)+'%'"></span></div>
          <div class="gif gif5"><span :style="'height:'+(recordVolume-8+20>100?100:recordVolume-8+20)+'%'"></span></div>
          <div class="gif gif6"><span :style="'height:'+(recordVolume-6+20>100?100:recordVolume-6+20)+'%'"></span></div>
          <div class="gif gif7"><span :style="'height:'+(recordVolume-4+20>100?100:recordVolume-4+20)+'%'"></span></div>
          <div class="gif gif8"><span :style="'height:'+(recordVolume-2+20>100?100:recordVolume-2+20)+'%'"></span></div>
          <div class="gif gif9"><span :style="'height:'+(recordVolume+20>100?100:recordVolume+20)+'%'"></span></div>
          <div class="gif gif10"><span :style="'height:'+(recordVolume-2+20>100?100:recordVolume-2+20)+'%'"></span></div>
          <div class="gif gif12"><span :style="'height:'+(recordVolume-4+20>100?100:recordVolume-4+20)+'%'"></span></div>
          <div class="gif gif13"><span :style="'height:'+(recordVolume-6+20>100?100:recordVolume-6+20)+'%'"></span></div>
          <div class="gif gif14"><span :style="'height:'+(recordVolume-8+20>100?100:recordVolume-8+20)+'%'"></span></div>
          <div class="gif gif8"><span :style="'height:'+(recordVolume-6+20>100?100:recordVolume-6+20)+'%'"></span></div>
          <div class="gif gif9"><span :style="'height:'+(recordVolume-8+20>100?100:recordVolume-8+20)+'%'"></span></div>
          <div class="gif gif10"><span :style="'height:'+(recordVolume-10+20>100?100:recordVolume-10+20)+'%'"></span></div>
          <div class="gif gif3"><span :style="'height:'+(recordVolume-12+20>100?100:recordVolume-12+20)+'%'"></span></div>
        </div>
        <div class="txt">{{changeTime(recordTime)}}</div>
      </div>
      <img v-if="isRecord" src="./images/icons/audio_record_2.png" class="icon" @click="endRecord" />
      <img v-else src="./images/icons/audio_record_1.png" class="icon" @click="startRecord" />
      <div class="p">{{isRecord?'完成':recordTime==0?'开始':'重录'}}</div>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
export default {
  components: { },
  data() {
    return {
      curTxt:{
        index:0,
        txt:'',
        pinyin:''
      },
      txts:[
        {txt:'两个同龄的年轻人同时受雇于一家店铺，并且拿同样的薪水。',pinyin:'liang ge tong ling de nian qing ren tong shi shou gu yu yi jia dian pu ，bing qie na tong yang de xin shui 。'},
        {txt:'可是一段时间后，叫阿诺德的那个小伙子青云直上，而那个叫布鲁诺的小伙子却仍在原地踏步。',pinyin:'ke shi yi duan shi jian hou ，jiao a nuo de de na ge xiao huo zi qing yun zhi shang ，er na ge jiao bu lu nuo de xiao huo zi que reng zai yuan di ta bu 。'},
        {txt:'布鲁诺很不满意老板的不公正待遇。终于有一天他到老板那儿发牢骚了。',pinyin:'bu lu nuo hen bu man yi lao ban de bu gong zheng dai yu 。zhong yu you yi tian ta dao lao ban na er fa lao sao le 。'},
        {txt:'老板一边耐心地听着他的抱怨，一边在心里盘算着怎样向他解释清楚他和阿诺德之间的差别。',pinyin:'lao ban yi bian nai xin di ting zhe ta de bao yuan ，yi bian zai xin li pan suan zhe zen yang xiang ta jie shi qing chu ta he a nuo de zhi jian de cha bie 。'},
        {txt:'“布鲁诺先生，”老板开口说话了，“您现在到集市上去一下，看看今天早上有什么卖的。',pinyin:'“bu lu nuo xian sheng ，”lao ban kai kou shuo hua le ，“nin xian zai dao ji shi shang qu yi xia ，kan kan jin tian zao shang you shi me mai de 。'},
      ],
      switchValue:false,
      isRecord:false,
      recordTime:0,
      recordVolume:0
    };
  },
  created(){
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    if (!navigator.getUserMedia) {
      Toast('当前浏览器暂不支持获取麦克风权限，请更换浏览器试试')
    }
    this.curTxt.txt = this.txts[0].txt
    this.curTxt.pinyin = this.txts[0].pinyin
  },
  destroyed(){
    clearInterval(this.intervalTime)
  },
  methods:{
    huanFn(){
      let index = this.curTxt.index + 1
      if(index > this.txts.length-1) index = 0
      this.curTxt.index = index
      this.curTxt.txt = this.txts[index].txt
      this.curTxt.pinyin = this.txts[index].pinyin
    },
    add0(V){
			return V < 10 ? '0' + V : V
		},
		changeTime(time){
			let T = Number(time)
			let h = Math.floor(T/3600)
			let m = Math.floor((T - h * 3600) / 60)
			let s = T%60
      if(h>0){
        return this.add0(h) + ':' + this.add0(m) + ':' + this.add0(s)
      }else{
        return this.add0(m) + ':' + this.add0(s)
      }
		},
    startRecord(){
      let self = this
      navigator.getUserMedia({video: false,audio:true}, function onSuccess(stream) {
        self.openRecordSuccess(stream)
        self.recordTime = 0
        self.startTime()
      }, function onError(error) {
        console.log("错误：", error);
      });
    },
    openRecordSuccess(stream){
      this.audioContext = new AudioContext()
      this.analyser = this.audioContext.createAnalyser()
      this.microphone = this.audioContext.createMediaStreamSource(stream)
      this.recordEventNode = this.audioContext.createScriptProcessor(2048, 1, 1)
      this.analyser.smoothingTimeConstant = 0.8
      this.analyser.fftSize = 1024
      this.microphone.connect(this.analyser)
      this.analyser.connect(this.recordEventNode)
      this.recordEventNode.connect(this.audioContext.destination)
      this.recordEventNode.addEventListener('audioprocess', this.analyzeMicrophoneVolume)
    },
    analyzeMicrophoneVolume(){
      const array = new Uint8Array(this.analyser.frequencyBinCount)
      this.analyser.getByteFrequencyData(array)
      let values = 0
      const length = array.length
      for (let i = 0; i < length; i++) {
        values += array[i]
      }
      const average = Math.ceil(values / length)
      this.recordVolume = average
    },
    startTime(){
      this.isRecord = true
      this.intervalTime = setInterval(()=>{
        this.recordTime ++
      },1000)
    },
    endRecord(){
      this.isRecord = false
      clearInterval(this.intervalTime)
    },
    goBack(){
      this.$router.go(-1)
    },
    goSave(){

      if(this.recordTime == 0){
        Toast('请先录制声音')
        return false
      }
      if(this.isRecord){
        Toast('请先点击完成按钮，再提交')
        return false
      }
      Toast('当前音频训练时长果断，不符合克隆音频条件')
      // Toast.loading({ message: '提交中...'})
      // setTimeout(()=>{
      //   Toast.clear()
      //   this.$router.push('/digital_human/audio_result')
      // },800)
    }
  }
};
</script>

<style lang="stylus" scoped>
  .back{position:fixed;width:.36rem;height:.36rem;padding:.2rem;left:.2rem;top:.6rem;z-index:5;box-sizing: content-box;}
  .header{padding-top:.55rem;font-size:.36rem;font-weight:bold;text-align:center;height:.88rem;color:#fff;box-sizing: content-box;line-height:.88rem;position:relative;
    .right{position:absolute;right:.1rem;bottom:-.02rem;padding:0 .2rem;color:#fff;font-size:.28rem;font-weight:normal;}
  }
  .container{
    width:100%;
    min-height:100vh;
    background:#333;
    .notice{margin:.22rem;color:#9A9B9F;font-size:.24rem;text-align:center;
      img{width:.32rem;height:.32rem;margin-right:.02rem;}
      *{display:inline-block;vertical-align: middle;}
    }
    .btns{padding:0 .2rem;overflow:hidden;
      .left{float:left;font-size:.28rem;color:#9A9B9F;font-weight:bold;padding:.2rem;
        .icon{width:.32rem;height:.32rem;margin-right:.04rem;}
        *{display:inline-block;vertical-align: middle;}
      }
      .right{float:right;font-size:.28rem;color:#fff;font-weight:bold;padding:.2rem;
        span,.switch{display:inline-block;vertical-align: middle;}
        .switch{width:.64rem;height:.34rem;border-radius:.2rem;background:#656565;position:relative;margin-left:.1rem;
          .switch_bar{position:absolute;width:.3rem;height:.3rem;border-radius:100%;left:.02rem;top:.02rem;background:#fff;transition:all .3s;}
        }
        .switch_on .switch_bar{left:.32rem;}
      }
    }
    .textarea{margin:0 .4rem .4rem .4rem;background:#444;border-radius:.2rem;padding:.24rem;color:#9A9B9F;font-size:.32rem;overflow:auto;max-height:3.8rem;}
  }
  .bottom_fix{position:fixed;z-index:5;left:0;bottom:0;width:100%;padding-bottom:1rem;text-align:center;font-size: initial;
    .recording_box{border-radius:.2rem;background:#444;margin:.2rem .4rem .36rem .4rem;padding:.56rem;
      .txt{text-align:center;color:#fff;font-size:.28rem;}
      .gifs{text-align:center;height:1.16rem;margin-bottom:.26rem;display:flex;align-items: center;justify-content: center;
        .gif{width:.14rem;height:100%;margin:0 .07rem;display:flex;align-items: center;justify-content: center;
          span{border-radius:.1rem;width:100%;height:20%;background:#49DAF1;}
        }
        .gif1 span{animation:audioBgAnim 8s infinite 3s;}
        .gif2 span{animation:audioBgAnim 8s infinite 4s;}
        .gif3 span{animation:audioBgAnim 8s infinite 2s;}
        .gif4 span{animation:audioBgAnim 8s infinite 2s;}
        .gif5 span{animation:audioBgAnim 8s infinite 5s;}
        .gif6 span{animation:audioBgAnim 8s infinite 2s;}
        .gif7 span{animation:audioBgAnim 8s infinite 1s;}
        .gif8 span{animation:audioBgAnim 8s infinite 3s;}
        .gif9 span{animation:audioBgAnim 8s infinite 2s;}
        .gif10 span{animation:audioBgAnim 8s infinite 5s;}
        .gif11 span{animation:audioBgAnim 8s infinite 4s;}
        .gif12 span{animation:audioBgAnim 8s infinite 2s;}
        .gif13 span{animation:audioBgAnim 8s infinite 6s;}
        .gif14 span{animation:audioBgAnim 8s infinite 2s;}
      }
    }
    .icon{width:1.2rem;height:1.2rem;}
    .p{color:#fff;font-size:.32rem;font-weight:bold;margin-top:.16rem;}
  }



@keyframes audioAnim
{
  0% {height:20%;}
  50% {height:100%;}
  100% {height:20%;}
}
@keyframes audioBgAnim
{
  0% {background:#46DFF3;}
  20% {background:#F130FF;}
  40% {background:#49DAF1;}
  60% {background:#B784FC;}
  80% {background:#F32BFF;}
  100% {background:#46DFF3;}
}

</style>