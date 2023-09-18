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
        {txt:'做人要诚恳，这是最经典人生格言之一。诚恳是一种美德，它能够赢得他人的信任和尊重。只有诚恳，我们才能建立起良好的人际关系，与他人和谐相处。',pinyin:'zuo ren yao cheng ken ，zhe shi zui jing dian ren sheng ge yan zhi yi 。cheng ken shi yi zhong mei de ，ta neng gou ying de ta ren de xin ren he zun zhong 。zhi you cheng ken ，wo men cai neng jian li qi liang hao de ren ji guan xi ，yu ta ren he xie xiang chu 。'},
        {txt:'独创性是指人们在面对新事物时，不依赖他人的意见或经验，而是通过自己的思考和创造来解决问题。',pinyin:'du chuang xing shi zhi ren men zai mian dui xin shi wu shi ，bu yi lai ta ren de yi jian huo jing yan ，er shi tong guo zi ji de si kao he chuang zao lai jie jue wen ti 。'},
        {txt:'如平直必以准绳，这句经典人生格言告诉我们，只有保持平衡和稳定，才能确保事物的准确和稳定。',pinyin:'ru ping zhi bi yi zhun sheng ，zhe ju jing dian ren sheng ge yan gao su wo men ，zhi you bao chi ping heng he wen ding ，cai neng que bao shi wu de zhun que he wen ding 。'},
        {txt:'与朋友交,言而有信最可爱的人是心地单纯的人。谁也比不上他们。多交朋友主要靠心地善良、单纯、性格热情、坦率。与朋友交,言而有信最可爱的人是那些真诚、坦率、善良的人。',pinyin:'yu peng you jiao ,yan er you xin zui ke ai de ren shi xin di dan chun de ren 。shui ye bi bu shang ta men 。duo jiao peng you zhu yao kao xin di shan liang 、dan chun 、xing ge re qing 、tan lü 。yu peng you jiao ,yan er you xin zui ke ai de ren shi na xie zhen cheng 、tan lü 、shan liang de ren 。'},
        {txt:'这句格言的含义是，人们应该能够理解别人的困难和需要，从而帮助他们解决问题并拯救他们。',pinyin:'zhe ju ge yan de han yi shi ，ren men ying gai neng gou li jie bie ren de kun nan he xu yao ，cong er bang zhu ta men jie jue wen ti bing zheng jiu ta men 。'},
        {txt:'勿以恶小而为之,勿以善小而不为，体现了一个人应该积极行善的态度和为他人着想的心态。',pinyin:'wu yi e xiao er wei zhi ,wu yi shan xiao er bu wei ，ti xian le yi ge ren ying gai ji ji hang shan de tai du he wei ta ren zhe xiang de xin tai 。'},
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
      Toast.loading({ message: '提交中...'})
      setTimeout(()=>{
        Toast.clear()
        this.$router.push('/digital_human/audio_result')
      },800)
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