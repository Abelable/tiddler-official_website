<template>
  <div class="container">
    <img src="./images/icons/back.png" class="back" @click="goBack" />
    <div class="header">
      更改声音
    </div>
    <div class="menu-tabs">
      <div
        class="menu-item"
        :class="{ active: curMenuIdx === index }"
        v-for="(item, index) in menuList"
        :key="index"
        @click="curMenuIdx = index"
      >
        {{ item }}
      </div>
    </div>
    <div class="scroll-view">
      <div class="items">
        <div class="item" :class="{'item_cur':curId == item.id}" v-for="(item,index) in mock_sy" :key="index" v-show="curMenuIdx == item.type">
          <!-- <div class="mine" v-if="index==0">我的</div> -->
          <div class="img">
            <img :src="item.avatar" class="avatar" />
            <img src="./images/icons/pause.png" class="play" v-if="playId == item.id" @click="pauseFn()" />
            <img src="./images/icons/play.png" class="play" v-else @click="playFn(item)" />
          </div>
          <div class="p1">{{item.name}}</div>
          <div class="p2">{{item.label}}</div>
          <div class="btn"  @click="syFn(item)">{{curId == item.id?'正在使用':'使用'}}</div>
        </div>
        
      </div>
    </div>
    <audio controls :src="playUrl" ref="audio" style="position:fixed;left:0;bottom:0;width:1px;height:1px;opacity:0;"></audio>
  </div>
</template>

<script>
export default {
  data() {
    return {
      id:'',
      menuList: ["定制", "官方"],
      curMenuIdx: 0,
      mock_sy:[],
      curId:'',
      mock_shuzhiren_list: [],
      playId:'',
      playUrl:''
    };
  },
  created(){
    let detail_sy = [{
      id:1,
      avatar:'https://img.ubo.vip/temp/digital_human/avatar1.png',
      name:'通艳梁',
      label:'中文-普通话',
      url:'https://img.ubo.vip/temp/digital_human/1.wav',
      type:'0',
    },{
      id:2,
      avatar:'https://img.ubo.vip/temp/digital_human/avatar2.png',
      name:'邵谦',
      label:'中文-普通话',
      url:'https://img.ubo.vip/temp/digital_human/2.wav',
      type:'0',
    },{
      id:3,
      avatar:'https://img.ubo.vip/temp/digital_human/avatar3.png',
      name:'蓟玲元',
      label:'中文-普通话',
      url:'https://img.ubo.vip/temp/digital_human/3.wav',
      type:'0',
    },{
      id:4,
      avatar:'https://img.ubo.vip/temp/digital_human/avatar4.png',
      name:'元彩仁',
      label:'中文-普通话',
      url:'https://img.ubo.vip/temp/digital_human/4.wav',
      type:'1',
    },{
      id:5,
      avatar:'https://img.ubo.vip/temp/digital_human/avatar5.png',
      name:'初辉',
      label:'中文-普通话',
      url:'https://img.ubo.vip/temp/digital_human/5.wav',
      type:'1',
    },{
      id:6,
      avatar:'https://img.ubo.vip/temp/digital_human/avatar6.png',
      name:'充玲晨',
      label:'中文-普通话',
      url:'https://img.ubo.vip/temp/digital_human/6.wav',
      type:'1',
    },{
      id:7,
      avatar:'https://img.ubo.vip/temp/digital_human/avatar7.png',
      name:'邝影祥',
      label:'中文-普通话',
      url:'https://img.ubo.vip/temp/digital_human/7.wav',
      type:'1',
    },{
      id:8,
      avatar:'https://img.ubo.vip/temp/digital_human/avatar8.png',
      name:'张平子',
      label:'中文-普通话',
      url:'https://img.ubo.vip/temp/digital_human/8.wav',
      type:'1',
    },{
      id:9,
      avatar:'https://img.ubo.vip/temp/digital_human/avatar9.png',
      name:'朱和',
      label:'中文-普通话',
      url:'https://img.ubo.vip/temp/digital_human/9.wav',
      type:'1',
    },{
      id:10,
      avatar:'https://img.ubo.vip/temp/digital_human/avatar10.png',
      name:'庾珊',
      label:'中文-普通话',
      url:'https://img.ubo.vip/temp/digital_human/10.wav',
      type:'1',
    },{
      id:11,
      avatar:'https://img.ubo.vip/temp/digital_human/avatar11.png',
      name:'苟纨',
      label:'中文-普通话',
      url:'https://img.ubo.vip/temp/digital_human/11.wav',
      type:'1',
    },{
      id:12,
      avatar:'https://img.ubo.vip/temp/digital_human/avatar12.png',
      name:'厉芝',
      label:'中文-普通话',
      url:'https://img.ubo.vip/temp/digital_human/12.wav',
      type:'1',
    }]
    let mock_sy = JSON.parse(window.localStorage.getItem('mock_sy') || '[]')
    if(mock_sy.length == 0){
      this.mock_sy = detail_sy
      window.localStorage.setItem('mock_sy',JSON.stringify(this.mock_sy))
    }else{
      this.mock_sy = mock_sy || []
    }

    this.id = this.$route.query.id
    this.mock_shuzhiren_list = JSON.parse(window.localStorage.getItem('mock_shuzhiren_list') || '[]')
    let detailObj = {}
    for(var i=0;i<this.mock_shuzhiren_list.length;i++){
      if(this.mock_shuzhiren_list[i].id == this.id){
        detailObj = this.mock_shuzhiren_list[i]
        break;
      }
    }
    this.curId = detailObj.sy_id
    
  },
  mounted(){
    this.$refs.audio.addEventListener('ended',()=>{
      this.pauseFn()
    })
  },
  methods:{
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
    syFn(item){
      if(item.id == this.curId) return false
      this.curId = item.id
      for(var i=0;i<this.mock_shuzhiren_list.length;i++){
        if(this.mock_shuzhiren_list[i].id == this.id){
          this.mock_shuzhiren_list[i].sy_id = item.id
          this.mock_shuzhiren_list[i].avatar = item.avatar
          this.mock_shuzhiren_list[i].name = item.name
          this.mock_shuzhiren_list[i].label = item.label
        }
      }
      window.localStorage.setItem('mock_shuzhiren_list',JSON.stringify(this.mock_shuzhiren_list))
    },
    goBack(){
      this.$router.go(-1)
    },
  }
};
</script>

<style lang="stylus" scoped>
  .back{position:fixed;width:.36rem;height:.36rem;padding:.2rem;left:.2rem;top:.6rem;z-index:5;box-sizing: content-box;}
  .header{padding-top:.55rem;font-size:.36rem;font-weight:bold;text-align:center;height:.88rem;color:#333;box-sizing: content-box;line-height:.88rem;position:fixed;z-index:5px;width:100%;}
  .container{
    width:100%;
    min-height:100vh;
    background:url(./images/icons/bg_blue.png) no-repeat center top;
    background-size:cover;
    .scroll-view{position:absolute;left:0;top:2.3rem;bottom:0;background:#fff;right:0;overflow:auto;
      .items{padding:.3rem 0 .3rem .3rem;overflow:hidden;
        .item{width:2.18rem;height:2.8rem;background:#F5F7FC;border-radius:.16rem;float:left;margin-right:.18rem;margin-bottom:.18rem;text-align:center;font-size:0;position:relative;
          .mine{position:absolute;left:0;top:0;padding:.04rem .1rem;color:#070F8F;border-radius:.16rem 0 .16rem 0;background-image: linear-gradient(to right, #FDABE4, #A4DCFD);font-size:.2rem;}
          .img{display:inline-block;position:relative;width:.8rem;height:.8rem;margin-top:.2rem;
            .avatar{width:100%;height:100%;border-radius:100%;}
            .play{width:.24rem;height:.24rem;position:absolute;right:-.1rem;bottom:-.1rem;padding:.1rem;box-sizing:content-box;}
          }
          .p1{font-size:.28rem;font-weight:bold;color:#181C63;line-height:.4rem;margin-top:.12rem;white-space:nowrap;overflow: hidden;text-overflow: ellipsis;padding:0 .1rem;}
          .p2{font-size:.24rem;color:#999;line-height:.34rem;margin-top:.12rem;white-space:nowrap;overflow: hidden;text-overflow: ellipsis;padding:0 .1rem;}
          .btn{display:inline-block;width:1.56rem;height:.52rem;line-height:.56rem;color:#fff;background-image: linear-gradient(to right, #7DDFDF, #99ABFF);font-size:.24rem;border-radius:.26rem;margin-top:.12rem;}
        }
        .item_cur{
          border:1px solid transparent;
          background-clip:padding-box,border-box;
          background-origin:padding-box,border-box;
          background-image: linear-gradient(#FFF4FC, #EFF8FF),linear-gradient(#F8AEE6, #A9D9FB);
          .btn{color:#070F8F;background-image:linear-gradient(to right, #FDABE4, #A4DCFD);}
        }
      }
    }
  }
  .menu-tabs
    position: fixed
    top: 1.5rem
    left: 50%
    transform: translateX(-50%)
    display: flex
    padding: .06rem
    width: 3.7rem
    height: .7rem
    border-radius: .35rem
    background: #fff
    z-index 100
    .menu-item
      display: flex
      align-items: center
      justify-content: center
      flex: 1
      height: .6rem
      color: #333
      font-size: .28rem
      font-weight: 500
      border-radius: .3rem
      &.active
        color: #fff
        background: #2C2C30

  
</style>
