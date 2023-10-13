<template>
  <div class="container">
    <img src="./images/icons/back.png" class="back" @click="goBack" />
    <div class="header">
      
      {{detailObj.type == 'video'?'视频设置':'音频设置'}}
      <span class="right" @click="delFn">
        取消入驻
      </span>
    </div>
    <div class="scroll-view">
      <div class="flex info">
        <img :src="detailObj.avatar" class="avatar">
        <div class="flex1">
          <div class="title">
            {{detailObj.name}}
            <!-- <div class="btn flex" v-if="detailObj.type == 'video'">关联动作库</div> -->
          </div>
          <div class="desc flex">
            <div class="label">
              <img src="./images/icons/audio2.png"><span>{{detailObj.label}}</span>
            </div>
            <div class="refresh" @click="$router.push('/digital_human/audio_change?id='+id)">
              <img src="./images/icons/refresh.png"><span>更改</span>
            </div>
          </div>
        </div>
      </div>
      <div class="h4">
        <span class="bg"></span>
        <span class="bg bg1"></span>
        <span class="bg bg2"></span>
        <span class="b">来听听ta讲话的效果～</span>
      </div>
      <div class="create">
        <div class="textarea">{{curTxt.obj.txt}}</div>
        <div class="flex create_desc">
          <div class="time">
            <img src="./images/icons/time.png" /><span>{{changeTime(curTxt.obj.time)}}</span>
          </div>
          <div class="refresh">
            <span>{{curTxt.obj.txt.length}}/800</span>
            <img src="./images/icons/refresh_b.png" @click="huanFn" />
            <span class="b"  @click="huanFn">换一换</span>
          </div>
        </div>
        <div class="btn flex" @click="saveFn">{{detailObj.type == 'video'?'生成视频':'生成语音'}}</div>
        <div class="notice">仅供测试使用，生成音频将使用音频时长权益</div>
      </div>
      <div class="box" v-if="detailObj.type != 'video'">
        <div class="title">生成音频将消耗音频时长权益</div>
        <div class="quanyis">
          <div class="quanyi">
            <div class="txt">音频时长权益</div>
            <div class="slider">
              <div class="slider_bar"></div>
            </div>
            <div class="time"><span>32分钟</span>/45分钟</div>
          </div>
        </div>
        <div class="audio_items">
          <div class="audio_item" v-for="(item,index) in mock_shipin_list" :key="index" v-show="item.pid == id">
            <div class="uploading_mask flex" v-if="item.status == 0">
              <div>
                <Loading size="48" color="#7DDDE0" />
                <div class="t">{{item.progress}}%</div>
                <div class="t">生成中...</div>
              </div>
            </div>
            <div class="p1">{{item.content}}</div>
            <div class="uploading" v-if="item.status == 0"></div>
            <div class="p2" v-else>
              <!-- <span class="green">00:03</span>
              <span>/</span> -->
              <span>{{changeTime(item.duration)}}</span>
            </div>
            <img src="./images/icons/pause2.png" v-if="item.status == 1 && playId == item.id" @click="pauseFn()" class="btn" />
            <img src="./images/icons/play2.png" v-if="item.status == 1 && playId != item.id" @click="playFn(item)" class="btn" />
            
            <!-- <div class="slider">
              <div class="slider_bar"></div>
            </div> -->
            <div class="audio_anim">
              <img src="./images/icons/audio_anim.png" />
            </div>
            <div class="p3">{{parseTime(item.time,'{m}-{d} {h}:{i}')}}</div>
          </div>
          
        </div>
      </div>
      <div class="box video" v-if="detailObj.type == 'video'">
        <div class="title">生成视频将消耗视频及音频时长权益</div>
        <div class="quanyis flex">
          <div class="flex1">
            <div class="quanyi">
              <div class="txt">视频时长权益</div>
              <div class="slider">
                <div class="slider_bar"></div>
              </div>
              <div class="time"><span>20分钟</span>/45分钟</div>
            </div>
          </div>
          <div class="flex1">
            <div class="quanyi">
              <div class="txt">音频时长权益</div>
              <div class="slider">
                <div class="slider_bar"></div>
              </div>
              <div class="time"><span>32分钟</span>/45分钟</div>
            </div>
          </div>
        </div>
        <div class="video_items">
          <div class="video_item" v-for="(item,index) in mock_shipin_list" :key="index" v-show="item.pid == id">
            <div class="uploading_mask flex" v-if="item.status == 0">
              <div>
                <Loading size="48" color="#7DDDE0" />
                <div class="t">{{item.progress}}%</div>
                <div class="t">生成中...</div>
              </div>
            </div>
            <div class="bg" :style="'background:url('+item.cover+') no-repeat;'"></div>
            <video class="video" :ref="'video'+item.id" autoplay :src="item.url" v-if="item.status == 1&&item.videoShow"></video>
            <img src="./images/icons/pause2.png" v-if="item.status == 1 && item.videoShow" class="btn" @click="pauseVideo(item)" />
            <img src="./images/icons/play2.png" v-if="item.status == 1 && !item.videoShow" class="btn"  @click="playVideo(item)" />
            <div class="p3">{{parseTime(item.time,'{m}-{d} {h}:{i}')}}</div>
          </div>
        </div>
      </div>
    </div>
    <audio controls :src="playUrl" ref="audio" style="position:fixed;left:0;bottom:0;width:1px;height:1px;opacity:0;"></audio>
  </div>
</template>

<script>
import { Loading, Dialog, Toast } from "vant";
export default {
  components: { Loading },
  data() {
    return {
      id:'',
      detailObj:{},
      curTxt:{
        index:0,
        obj:{}
      },
      txts:[
        {txt:'尊敬的盛行长、各位领导、亲爱的同事们：大家好！在这个美好的时刻，我们怀着无比激动的心情，热烈欢迎盛行长及各位领导莅临我司考察指导。您的到来是我们前进道路上的一股强大动力，我们将以更加饱满的热情、更加务实的作风，迎接挑战，追求卓越。在此，我谨代表全体员工，向盛行长及各位领导表示最诚挚的感谢和最热烈的欢迎！',time:30},
        {txt:'可是一段时间后，叫阿诺德的那个小伙子青云直上，而那个叫布鲁诺的小伙子却仍在原地踏步。',time:15},
        {txt:'布鲁诺很不满意老板的不公正待遇。终于有一天他到老板那儿发牢骚了。',time:11},
        {txt:'老板一边耐心地听着他的抱怨，一边在心里盘算着怎样向他解释清楚他和阿诺德之间的差别。',time:14},
        {txt:'“布鲁诺先生，”老板开口说话了，“您现在到集市上去一下，看看今天早上有什么卖的。',time:13},
      ],
      mock_shipin_list:[],
      playId:'',
      playUrl:'',
    };
  },
  created(){
    this.id = this.$route.query.id
    this.curTxt.index = 0
    this.curTxt.obj = this.txts[this.curTxt.index]
    
    this.setIntervalFn()
    this.getData()
  },
  mounted(){
    this.$refs.audio.addEventListener('ended',()=>{
      this.pauseFn()
    })
  },
  destroyed(){
    clearInterval(this.intervalTime)
  },
  methods:{
    pauseVideo(item){
      item.videoShow = false
    },
    playVideo(item){
      window.location.href = item.url
      // item.videoShow = true
    },
    playFn(item){
      this.pauseFn()
      setTimeout(()=>{
        this.playId = item.id
        this.playUrl = item.url
        setTimeout(()=>{
          this.$refs.audio.play()
        })
      })
    },
    pauseFn(){
      this.playId = ''
      this.playUrl = ''
    },
    getRandom(){
      return Math.floor(Math.random()*10)+10
    },
    setIntervalFn(){
      this.intervalTime = setInterval(()=>{
        let mock_shipin_list = [...this.mock_shipin_list]
        let hasChange = false
        for(var i=0;i<mock_shipin_list.length;i++){
          if(mock_shipin_list[i].status == 0){
            let progress = mock_shipin_list[i].progress + this.getRandom()
            mock_shipin_list[i].progress = progress > 100 ? 100 : progress
            if(mock_shipin_list[i].progress>=100){
              mock_shipin_list[i].status = 1
            }
            hasChange = true
          }
        }
        if(hasChange){
          this.mock_shipin_list = mock_shipin_list
          window.localStorage.setItem('mock_shipin_list',JSON.stringify(this.mock_shipin_list))
        }
      },2000)
    },
    getData(){
      let mock_shuzhiren_list = JSON.parse(window.localStorage.getItem('mock_shuzhiren_list') || '[]')
      for(var i=0;i<mock_shuzhiren_list.length;i++){
        if(mock_shuzhiren_list[i].id == this.id){
          this.detailObj = mock_shuzhiren_list[i]
          break;
        }
      }
      let mock_shipin_list = JSON.parse(window.localStorage.getItem('mock_shipin_list') || '[]')

      let default_list = [
        {
          "id":1695209629195,
          "pid":1,
          "content":"君不见，黄河之水天上来，奔流到海不复回。君不见，高堂明镜悲白发，朝如青丝暮成雪。人生得意须尽欢，莫使金樽空对月。天生我材必有用，千金散尽还复来。烹羊宰牛且为乐，会须一饮三百杯。岑夫子，丹丘生，将进酒，杯莫停。与君歌一曲，请君为我倾耳听。钟鼓馔玉不足贵，但愿长醉不愿醒。古来圣贤皆寂寞，惟有饮者留其名。陈王昔时宴平乐，斗酒十千恣欢谑。主人何为言少钱，径须沽取对君酌。",
          "cover":"https://img.ubo.vip/temp/digital_human/video-1.jpg",
          "url":"https://img.ubo.vip/temp/digital_human/111.mp4",
          "time":1695209629000,
          "duration":39,
          "type":"video",
          "status":1,
          "progress":100,
          "sy_id":"1",
          "avatar":"https://img.ubo.vip/temp/digital_human/avatar1.png",
          "name":"通艳梁",
          "label":"中文-普通话"
        },
        {
          "id":1695209640195,
          "pid":1,
          "content":"有播是一个以移动直播为核心的综合电商平台，公司位于杭州未来科技城创新园",
          "cover":"https://img.ubo.vip/temp/digital_human/video-1.jpg",
          "url":"https://img.ubo.vip/temp/digital_human/222.mp4",
          "time":1695209640000,
          "duration":68,
          "type":"video",
          "status":1,
          "progress":100,
          "sy_id":"1",
          "avatar":"https://img.ubo.vip/temp/digital_human/avatar1.png",
          "name":"通艳梁",
          "label":"中文-普通话"
        },
        {
          "id":1695210220994,
          "pid":4,
          "content":"大家好，我是今天的主播很高兴能和大家一起来品尝和推荐可口可乐",
          "cover":"https://img.ubo.vip/temp/digital_human/video-1.jpg",
          "url":"https://img.ubo.vip/temp/digital_human/111.wav",
          "time":1695210220000,
          "duration":115,
          "type":"audio",
          "status":1,
          "progress":100,
          "sy_id":"4",
          "avatar":"https://img.ubo.vip/temp/digital_human/avatar4.png",
          "name":"元彩仁",
          "label":"中文-普通话"
        },
        {
          "id":1695210330994,
          "pid":4,
          "content":"有播作为一家专业的微直播电商平台，通过立足于微信生态的直播产品工具",
          "cover":"https://img.ubo.vip/temp/digital_human/video-1.jpg",
          "url":"https://img.ubo.vip/temp/digital_human/222.wav",
          "time":1695210330000,
          "duration":45,
          "type":"audio",
          "status":1,
          "progress":100,
          "sy_id":"4",
          "avatar":"https://img.ubo.vip/temp/digital_human/avatar4.png",
          "name":"元彩仁",
          "label":"中文-普通话"
        }
      ]
      if(mock_shipin_list.length == 0){
        mock_shipin_list = default_list
        window.localStorage.setItem('mock_shipin_list',JSON.stringify(mock_shipin_list))
      }
      for(var j=0;j<mock_shipin_list.length;j++){
        mock_shipin_list[j].videoShow = false
      }
      this.mock_shipin_list = mock_shipin_list || []
    },
    huanFn(){
      let index = this.curTxt.index + 1
      if(index > this.txts.length-1) index = 0
      this.curTxt.index = index
      this.curTxt.obj = this.txts[index]
    },
    delFn(){
      Dialog.confirm({
        title: '温馨提示',
        message: '是否要取消入驻',
      })
      .then(() => {
        // on confirm
        this.$router.go(-1)
      })
      .catch(() => {
        // on cancel
      });
    },
    saveFn(){

      Toast.loading({ message: '提交中...'})
      setTimeout(()=>{
        Toast.clear()
        this.mock_shipin_list.unshift({
          id:new Date().getTime(),
          pid:this.detailObj.id,
          content:this.curTxt.obj.txt,
          cover:this.detailObj.cover,
          url:this.detailObj.type == 'video'?'https://img.ubo.vip/temp/digital_human/333.mp4':'https://img.ubo.vip/temp/digital_human/333.wav',
          time:Date.parse(new Date()),
          duration:this.curTxt.obj.time,
          type:this.detailObj.type,
          status:0,
          progress:0,
          sy_id:this.detailObj.sy_id,
          avatar:this.detailObj.avatar,
          name:this.detailObj.name,
          label:this.detailObj.label,
          videoShow:false,
        })
        window.localStorage.setItem('mock_shipin_list',JSON.stringify(this.mock_shipin_list))
      },1000)
    },
    goBack(){
      this.$router.go(-1)
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
    parseTime(time, cFormat) {
      if (arguments.length === 0 || !time) {
        return null
      }
      const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
      let date
      if (typeof time === 'object') {
        date = time
      } else {
        if ((typeof time === 'string')) {
          if ((/^[0-9]+$/.test(time))) {
            time = parseInt(time)
          } else {
            time = time.replace(new RegExp(/-/gm), '/')
          }
        }

        if ((typeof time === 'number') && (time.toString().length === 10)) {
          time = time * 1000
        }
        date = new Date(time)
      }
      const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
      }
      const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
        const value = formatObj[key]
        // Note: getDay() returns 0 on Sunday
        if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
        return value.toString().padStart(2, '0')
      })
      return time_str
    }
  }
};
</script>

<style lang="stylus" scoped>
  .back{position:fixed;width:.36rem;height:.36rem;padding:.2rem;left:.2rem;top:.6rem;z-index:5;box-sizing: content-box;}
  .header{padding-top:.55rem;font-size:.36rem;font-weight:bold;text-align:center;height:.88rem;color:#333;box-sizing: content-box;line-height:.88rem;position:fixed;z-index:5px;width:100%;
    .right{position:absolute;right:.1rem;bottom:-.02rem;padding:0 .2rem;color:#666;font-size:.28rem;font-weight:normal;}
  }
  .flex{display: flex;flex-direction: row;justify-content: center;word-break:break-all;align-items: center;line-height: initial;}
  .flex1{flex:1;overflow:hidden;}
  .container{
    width:100%;
    min-height:100vh;
    background:url(./images/icons/bg_blue.png) no-repeat center top;
    background-size:cover;
    .scroll-view{position:absolute;left:0;top:1.5rem;bottom:0;right:0;overflow:auto;
      .info{
        padding:.2rem .4rem;
        .avatar{width:1.2rem;height:1.2rem;border-radius:100%;margin-right:.2rem;}
        .title{font-size:.36rem;color:#181C63;font-weight:bold;position:relative;padding-right:1.9rem;
          .btn{width:1.8rem;height:.5rem;color:#fff;font-size:.28rem;background-image: linear-gradient(to right, #7DDFDF, #99ABFF);border-radius:.26rem;position:absolute;right:0;top:0;}
        }
        .desc{
          justify-content:unset;margin-top:.08rem;
          .label{padding:.04rem .08rem;color:#181C63;font-size:.24rem;background-image: linear-gradient(to right, #FDABE4, #A4DCFD);border-radius:.08rem;margin-right:.1rem;
            img{width:.28rem;height:.28rem;margin-right:.04rem;}
            *{display:inline-block;vertical-align:middle;}
          }
          .refresh{padding:.04rem .08rem;color:#999999;font-size:.24rem;
            img{width:.28rem;height:.28rem;margin-right:.04rem;}
            *{display:inline-block;vertical-align:middle;}
          }
        }
      }
      .h4{font-size:.36rem;
        padding:.4rem .6rem;background:#fff;border-radius:.4rem .4rem 0 0;position:relative;
        .bg{position:absolute;left:.4rem;top:.3rem;width:.36rem;height:.36rem;border-radius:100%;background:rgba(221, 231, 255, .3);}
        .bg1{left:.54rem;background:rgba(221, 231, 255, .6);}
        .bg2{left:.68rem;background:rgba(221, 231, 255, 1);}
        .b{color:#333;font-weight: bold;}
      }
      .create{
        margin:.3rem;background:#fff;border-radius:.16rem;padding:.3rem;
        .textarea{width:100%;min-height:2rem;padding:.2rem;background:#F5F7FC;border-radius:.16rem;color:#333;font-size:.24rem;border:none;}
        .create_desc{justify-content: space-between;
          .time{font-size:.24rem;color:#9A9B9F;padding:.16rem 0;
            img{width:.32rem;height:.32rem;margin-right:.04rem;}
            *{display:inline-block;vertical-align:middle;}
          }
          .refresh{font-size:.24rem;color:#9A9B9F;padding:.16rem 0;
            img{width:.24rem;height:.24rem;margin-right:.08rem;margin-left:.2rem;}
            .b{color:#48AADB;}
            *{display:inline-block;vertical-align:middle;}
          }
        }
        .btn{
          height:.88rem;background-image: linear-gradient(to right, #7DDFDF, #99ABFF);border-radius:.44rem;font-size:.32rem;color:#fff;font-weight:bold;margin-top:.16rem;
        }
        .notice{font-size:.24rem;color:#9A9B9F;margin-top:.2rem;text-align:center;}
      }
      .box{margin:0 .3rem .3rem .3rem;background:#fff;border-radius:.16rem;padding-bottom:.2rem;
        .title{font-size:.24rem;color:#48AADB;padding:.3rem .3rem .2rem .3rem;}
        .quanyis{margin:0 .3rem;background:#F5F7FC;border-radius:.16rem;padding:.2rem .05rem;
          .quanyi{padding:0 .15rem;
            .txt{font-size:.24rem;color:#333;}
            .slider{width:100%;height:.08rem;border-radius:.04rem;background:#DAEDFF;margin-top:.2rem;
              .slider_bar{height:.08rem;width:60%;border-radius:.2rem;background-image: linear-gradient(to right, #7DDFDF, #99ABFF);}
            }
            .time{font-size:.24rem;color:#333;margin-top:.2rem;
              span{color:#48AADB;}
            }
          }
        }
        .audio_items{padding:.2rem 0 0 .3rem;overflow:hidden;
          .audio_item{width:3.06rem;height:3.24rem;background:#F5F7FC;border-radius:.16rem;padding:.3rem; .2rem .16rem .2rem;font-size:0;text-align:center;float:left;margin-right:.18rem;margin-bottom:.18rem;position:relaitve;
            .uploading_mask{position:absolute;left:0;top:0;right:0;bottom:0;background:rgba(34, 33, 55, .4);border-radius:.16rem;z-index:1;
              .t{font-size:.24rem;color:#fff;margin-top:.1rem;}
            }
            .p1{line-height:.34rem;font-size:.24rem;color:#575B66;white-space:nowrap;overflow: hidden;text-overflow: ellipsis;text-align:left;font-weight:bold;}
            .uploading{height:1.3rem;}
            .p2{margin-top:.2rem;line-height:.28rem;font-size:.2rem;color:#999;margin-top:.2rem;
              .green{color:#48AADB;}
            }
            .btn{width:.52rem;height:.52rem;margin-top:.32rem;}
            .slider{width:100%;height:.08rem;border-radius:.04rem;background:#DAEDFF;margin-top:.3rem;margin-bottom:.16rem;
              .slider_bar{height:.08rem;width:60%;border-radius:.2rem;background-image: linear-gradient(to right, #7DDFDF, #99ABFF);}
            }
            .audio_anim{margin:.2rem 0 0 0;
              img{width:1.4rem;.34rem;}
            }
            .p3{text-align:left;font-size:.24rem;color:#999;padding-top:.24rem;line-height:.34rem;}
          }
        }
        .video_items{padding:.2rem 0 0 .3rem;overflow:hidden;
          .video_item{width:3.06rem;height:4rem;background:#F5F7FC;border-radius:.16rem;font-size:0;float:left;margin-right:.18rem;margin-bottom:.18rem;position:relaitve;
            .uploading_mask{position:absolute;left:0;top:0;right:0;bottom:0;background:rgba(34, 33, 55, .4);border-radius:.16rem;z-index:2;text-align:center;
              .t{font-size:.24rem;color:#fff;margin-top:.1rem;}
            }
            .bg{background-size:cover!important;width:100%;height:100%;border-radius:.16rem;}
            .video{width:100%;height:100%;border-radius:.16rem;position:absolute;left:0;top:0;z-index:1;object-fit:cover;}
            .btn{width:.52rem;height:.52rem;position:absolute;z-index:2;left:50%;top:50%;margin-left:-.26rem;margin-top:-.26rem;}
            .p3{text-align:left;font-size:.24rem;color:#fff;line-height:.34rem;position:absolute;z-index:2;left:.18rem;bottom:.18rem;right:.18rem;}
          }
        }

      }
      .video{
        .quanyis{
          text-align:center;
        }
      }
    }
    
  }
 
  
</style>
 