<template>
  <div class="container">
    <img src="./images/icons/back.png" class="back" @click="goBack" />
    <div class="header">
      
      {{isVideo?'视频设置':'音频设置'}}
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
            <!-- <div class="btn flex" v-if="isVideo">关联动作库</div> -->
          </div>
          <div class="desc flex">
            <div class="label">
              <img src="./images/icons/audio2.png"><span>{{detailObj.label}}</span>
            </div>
            <div class="refresh" @click="$router.push('/digital_human/audio_change?id='+id+'&video='+(isVideo?'1':'0'))">
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
            <img src="./images/icons/time.png" /><span>{{curTxt.obj.time}}</span>
          </div>
          <div class="refresh">
            <span>{{curTxt.obj.txt.length}}/800</span>
            <img src="./images/icons/refresh_b.png" @click="huanFn" />
            <span class="b"  @click="huanFn">换一换</span>
          </div>
        </div>
        <div class="btn flex">{{isVideo?'生成视频':'生成语音'}}</div>
        <div class="notice">仅供测试使用，生成音频将使用音频时长权益</div>
      </div>
      <div class="box" v-if="!isVideo">
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
          <div class="audio_item">
            <div class="p1">大家好，今天在秦始皇...</div>
            <div class="p2"><span>00:03</span>/00:59</div>
            <img src="./images/icons/pause2.png" class="btn" />
            <div class="slider">
              <div class="slider_bar"></div>
            </div>
            <div class="p3">06-20 06:33</div>
          </div>
          <div class="audio_item">
            <div class="uploading_mask flex">
              <div>
                <Loading size="48" color="#7DDDE0" />
                <div class="t">25%</div>
                <div class="t">生成中...</div>
              </div>
            </div>
            <div class="p1">大家好，今天在秦始皇...</div>
            <div class="uploading"></div>
            <div class="audio_anim">
              <img src="./images/icons/audio_anim.png" />
            </div>
            <div class="p3">06-20 06:33</div>
          </div>
          <div class="audio_item">
            <div class="p1">大家好，今天在秦始皇...</div>
            <div class="p2">00:59</div>
            <img src="./images/icons/play2.png" class="btn" />
            <div class="audio_anim">
              <img src="./images/icons/audio_anim.png" />
            </div>
            <div class="p3">06-20 06:33</div>
          </div>
          <div class="audio_item">
            <div class="p1">大家好，今天在秦始皇...</div>
            <div class="p2">00:59</div>
            <img src="./images/icons/play2.png" class="btn" />
            <div class="audio_anim">
              <img src="./images/icons/audio_anim.png" />
            </div>
            <div class="p3">06-20 06:33</div>
          </div>
        </div>
      </div>
      <div class="box video" v-if="isVideo">
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
          <div class="video_item">
            <div class="bg" ></div>
            <img src="./images/icons/pause2.png" class="btn" />
            <div class="p3">06-20 06:33</div>
          </div>
          <div class="video_item">
            <div class="uploading_mask flex">
              <div>
                <Loading size="48" color="#7DDDE0" />
                <div class="t">25%</div>
                <div class="t">生成中...</div>
              </div>
            </div>
            <div class="bg" ></div>
            <div class="p3">06-20 06:33</div>
          </div>
          <div class="video_item">
            <div class="bg" ></div>
            <img src="./images/icons/play2.png" class="btn" />
            <div class="p3">06-20 06:33</div>
          </div>
          <div class="video_item">
            <div class="bg" ></div>
            <img src="./images/icons/play2.png" class="btn" />
            <div class="p3">06-20 06:33</div>
          </div>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script>
import { Loading, Dialog } from "vant";
export default {
  components: { Loading },
  data() {
    return {
      id:'',
      isVideo:false,
      detailObj:{},
      curTxt:{
        index:0,
        obj:{}
      },
      txts:[
        {txt:'两个同龄的年轻人同时受雇于一家店铺，并且拿同样的薪水。',time:'0:10'},
        {txt:'可是一段时间后，叫阿诺德的那个小伙子青云直上，而那个叫布鲁诺的小伙子却仍在原地踏步。',time:'0:15'},
        {txt:'布鲁诺很不满意老板的不公正待遇。终于有一天他到老板那儿发牢骚了。',time:'0:11'},
        {txt:'老板一边耐心地听着他的抱怨，一边在心里盘算着怎样向他解释清楚他和阿诺德之间的差别。',time:'0:14'},
        {txt:'“布鲁诺先生，”老板开口说话了，“您现在到集市上去一下，看看今天早上有什么卖的。',time:'0:13'},
      ],
    };
  },
  created(){
    this.isVideo = this.$route.query.video == 1
    this.id = this.$route.query.id
    let data = []
    if(this.isVideo == 1){
      data = JSON.parse(window.localStorage.getItem('mock_videos') || '[]')
    }else{
      data = JSON.parse(window.localStorage.getItem('mock_audios') || '[]')
    }
    for(var i=0;i<data.length;i++){
      if(data[i].id == this.id){
        this.detailObj = data[i]
        break;
      }
    }
    this.curTxt.index = 0
    this.curTxt.obj = this.txts[this.curTxt.index]
  },
  methods:{
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
    goBack(){
      this.$router.go(-1)
    },
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
              span{color:#48AADB;}
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
            .bg{background-size:cover!important;width:100%;height:100%;border-radius:.16rem;background:url(./images/temp/video-1.jpg) no-repeat center;}
            .btn{width:.52rem;height:.52rem;position:absolute;z-index:1;left:50%;top:50%;margin-left:-.26rem;margin-top:-.26rem;}
            .p3{text-align:left;font-size:.24rem;color:#fff;line-height:.34rem;position:absolute;z-index:1;left:.18rem;bottom:.18rem;right:.18rem;}
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
 