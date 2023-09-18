<template>
  <div>
    <img src="./images/home/bg_0.png" alt="" class="bg" />

    <div class="header">
      <div class="user-info">
        <img src="./images/temp/avatar-1.jpg" alt="" class="avatar" />
        <div class="nickname">九爷</div>
      </div>

      <div class="equity-wrap">
        <div class="date-wrap">
          <div class="valid-date">有效期至2023-05-23</div>
          <img src="./images/mine/recharge.png" alt="" class="recharge-btn" />
        </div>
        <div class="equity-list">
          <div class="equity">
            形象定制权益 <span class="equity-num">1/2</span> 个
          </div>
          <div class="equity">
            声音定制权益 <span class="equity-num">0/2</span> 个
          </div>
        </div>
      </div>
    </div>

    <div class="content">
      <div class="menu-list">
        <div
          class="menu-item"
          :class="{ active: curMenuIdx === index }"
          v-for="(item, index) in ['形象', '声音']"
          :key="index"
          @click="curMenuIdx = index;curCategoryIdx = 0"
        >
          {{ item }}
        </div>
      </div>

      <div class="category-list">
        <div
          class="category-item"
          :class="{ active: curCategoryIdx === index }"
          v-for="(item, index) in ['全部', '已入驻', '未入驻', '制作中']"
          :key="index"
          @click="curCategoryIdx = index"
        >
          {{ item }}
        </div>
      </div>

      <div class="video-list" v-if="curMenuIdx === 0">
        <div class="video-item" v-for="(item,index) in videos" :key="index" v-show="curCategoryIdx == item.status || curCategoryIdx == 0" @click="goSetting(item,'video')">
          <img :src="item.cover" alt="" class="video-cover">
          <div class="video-status success" v-if="item.status == 1">已入驻</div>
          <div class="video-status fail" v-if="item.status == 2">
            <div>未入驻</div>
            <img src="./images/mine/question.png" alt="" class="tips-icon">
          </div>
          <div class="video-status doing" v-if="item.status == 3">制作中</div>
          <!-- <div class="action-num">动作库：3</div> -->
          <div class="video-date">{{item.time}}</div>
        </div>
      </div>

      <div class="voice-list" v-if="curMenuIdx === 1">
        <div class="voice-item" v-for="(item,index) in audios" :key="index" v-show="curCategoryIdx == item.status || curCategoryIdx == 0" @click="goSetting(item,'audio')">
          <div class="voice-status success" v-if="item.status == 1">已入驻</div>
          <div class="voice-status fail" v-if="item.status == 2">
            <div>未入驻</div>
            <img src="./images/mine/question.png" alt="" class="tips-icon">
          </div>
          <img :src="item.avatar" alt="" class="voice-avatar">
          <div class="voice-name">{{item.name}}</div>
          <div class="voice-identity">{{item.label}}</div>
          <img src="./images/voice-wave.png" alt="" class="voice-wave">
          <div class="voice-date">{{item.time}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
export default {
  data() {
    return {
      curMenuIdx: 0,
      curCategoryIdx: 0,
      videos:[],
      audios:[],
    };
  },
  activated(){
    this.getData()
  },
  methods:{
    getData(){
      let detail_videos = [{
        id:1,
        cover:'https://img.ubo.vip/temp/digital_human/video-1.jpg',
        sy_id:'1',
        avatar:'https://img.ubo.vip/temp/digital_human/avatar1.png',
        name:'通艳梁',
        label:'中文-普通话',
        time:'06-20 06:33',
        status:'1',
      },{
        id:2,
        cover:'https://img.ubo.vip/temp/digital_human/video-2.jpg',
        sy_id:'2',
        avatar:'https://img.ubo.vip/temp/digital_human/avatar2.png',
        name:'邵谦',
        label:'中文-普通话',
        time:'06-20 06:33',
        status:'2',
      },{
        id:3,
        cover:'https://img.ubo.vip/temp/digital_human/video-1.jpg',
        sy_id:'3',
        avatar:'https://img.ubo.vip/temp/digital_human/avatar3.png',
        name:'蓟玲元',
        label:'中文-普通话',
        time:'06-20 06:33',
        status:'3',
      }]
      let detail_audios = [{
        id:1,
        cover:'https://img.ubo.vip/temp/digital_human/video-1.jpg',
        sy_id:'4',
        avatar:'https://img.ubo.vip/temp/digital_human/avatar4.png',
        name:'元彩仁',
        label:'中文-普通话',
        time:'06-20 06:33',
        status:'1',
      },{
        id:2,
        cover:'https://img.ubo.vip/temp/digital_human/video-1.jpg',
        sy_id:'5',
        avatar:'https://img.ubo.vip/temp/digital_human/avatar5.png',
        name:'初辉',
        label:'中文-普通话',
        time:'06-20 06:33',
        status:'2',
      }]
      let mock_videos = JSON.parse(window.localStorage.getItem('mock_videos') || '[]')
      let mock_audios = JSON.parse(window.localStorage.getItem('mock_audios') || '[]')
      if(mock_videos.length == 0){
        this.videos = detail_videos
        window.localStorage.setItem('mock_videos',JSON.stringify(this.videos))
      }else{
        this.videos = mock_videos || []
      }
      if(mock_audios.length == 0){
        this.audios = detail_audios
        window.localStorage.setItem('mock_audios',JSON.stringify(this.audios))
      }else{
        this.audios = mock_audios || []
      }
    },
    goSetting(item,type){
      if(item.status != 1) {
        Toast('请先入驻')
        return false
      }
      if(type=='video'){
        this.$router.push('/digital_human/setting_va?id='+item.id+'&video=1')
      }else{
        this.$router.push('/digital_human/setting_va?id='+item.id)
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
.bg
  position: fixed
  top: 0
  left: 0
  width: 100vw
  height: 100vh
  z-index -1

.header
  padding: .3rem
  .user-info
    display: flex
    align-items: center
    margin-top: .3rem
    .avatar
      width: 1.2rem
      height: 1.2rem
      border-radius: 50%
    .nickname
      margin-left: .2rem
      color: #181C63
      font-size: .36rem
      font-weight: 500
  .equity-wrap
    margin-top: .3rem
    padding: .3rem
    height: 1.86rem
    background-image: url('./images/mine/bg.png')
    background-repeat: no-repeat
    background-size: 100%
    .date-wrap
      display: flex
      justify-content: space-between
      .valid-date
        margin-left: .42rem
        color: #214765
        font-size: .32rem
        font-weight: 600
        line-height: 1
      .recharge-btn
        width: .82rem
        height: .34rem
    .equity-list
      display: flex
      justify-content: space-between
      margin-top: .48rem
      padding: 0 .32rem
      .equity
        color: #666
        font-size: .24rem
        .equity-num
          color: #333
          font-weight: 500
.content
  padding-bottom: 1.3rem
  min-height: calc(100vh - 4.8rem)
  background: #fff
  border-radius: .4rem .4rem 0 0
  .menu-list
    display: flex
    .menu-item
      display: flex
      align-items: center
      justify-content: center
      flex: 1
      height: 1.1rem
      color: #999
      font-size: .36rem
      &.active
        position: relative
        color: #333
        font-weight: 500
        &::after
          position: absolute
          left: 50%
          bottom: .18rem
          transform: translateX(-50%)
          content: ''
          width: .72rem
          height: .08rem
          border-radius: .04rem
          background: linear-gradient(135deg, #FDABE4 0%, #A4DCFD 100%)
  .category-list
    display: flex
    .category-item
      display: flex
      align-items: center
      justify-content: center
      flex: 1
      height: 1rem
      color: #999
      font-size: .28rem
      &.active
        color: #333
        font-weight: 500
  .video-list
    display: flex
    justify-content: space-between
    flex-wrap: wrap
    padding: 0 .4rem
    .video-item
      position: relative
      margin-bottom: .18rem
      font-size: 0
      width: 3.24rem
      height: 4.4rem
      border-radius: .16rem
      overflow: hidden
      .video-cover
        width: 100%
        height: 100%
        object-fit: cover
      .video-status
        position: absolute
        top: 0
        left: 0
        display: flex
        align-items: center
        padding: 0 .1rem
        height: .4rem
        font-size: .24rem
        border-bottom-right-radius: .16rem
        &.success
          color: #070F8F
          background: linear-gradient(135deg, #FDABE4 0%, #A4DCFD 100%)
        &.fail
          color: #575B66
          background: #CCCCCC
        &.doing
          color: #fff
          background: #3841CB
        .tips-icon
          width: .28rem
          height: .28rem
      .action-num
        position: absolute
        top: 0
        right : 0
        display: flex
        align-items: center
        padding: 0 .1rem
        height: .4rem
        color: #fff
        font-size: .24rem
        border-bottom-left-radius: .16rem
        background: linear-gradient(90deg, #7DDFDF 0%, #99ABFF 100%)
      .video-date
        position: absolute
        left: 0
        bottom: 0
        display: flex
        padding: .4rem .12rem .12rem
        width: 100%
        color: #fff
        font-size: .24rem
        background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 100%)
  .voice-list
    display: flex
    justify-content: space-between
    flex-wrap: wrap
    padding: 0 .4rem
    .voice-item
      position: relative
      display: flex
      flex-direction: column
      align-items: center
      justify-content: center
      margin-bottom: .18rem
      font-size: 0
      width: 3.24rem
      height: 3.24rem
      border-radius: .16rem
      overflow: hidden
      background: #F5F7FC
      .voice-status
        position: absolute
        top: 0
        left: 0
        display: flex
        align-items: center
        padding: 0 .1rem
        height: .4rem
        font-size: .24rem
        border-bottom-right-radius: .16rem
        &.success
          color: #070F8F
          background: linear-gradient(135deg, #FDABE4 0%, #A4DCFD 100%)
        &.fail
          color: #575B66
          background: #CCCCCC
        .tips-icon
          width: .28rem
          height: .28rem
      .voice-avatar
        width: .84rem
        height: .84rem
        border-radius: 50%
      .voice-name
        margin-top: .1rem
        color: #575B66
        font-size: .24rem
      .voice-identity
        margin-top: .06rem
        color: #999
        font-size: .24rem
      .voice-wave
        margin-top: .1rem
        width: 1.4rem
        height: .34rem
      .voice-date
        position: absolute
        left: .16rem
        bottom: .16rem
        color: #999
        font-size: .24rem
</style>
