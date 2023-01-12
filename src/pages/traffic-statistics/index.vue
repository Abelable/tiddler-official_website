<template>
  <div class="container">
    <div class="card">
      <div class="title-wrap">
        <div class="title">直播流量</div>
        <div class="timer-picker" @click="timePickerPopupVisible = true">
          <div class="time-desc">时间筛选</div>
          <Icon name="arrow-down" />
        </div>
      </div>
      <div class="echart" id="mychart" :style="myChartStyle"></div>
    </div>

    <div class="card">
      <div class="title-wrap">
        <div class="title">回放流量</div>
        <div class="timer-picker" @click="datePickerPopupVisible = true">
          <div class="time-desc">请选择日期范围</div>
          <Icon name="arrow-down" />
        </div>
      </div>
      <div class="echart" id="mychart-2" :style="myChartStyle"></div>
    </div>

    <Popup v-model="timePickerPopupVisible" position="bottom" round>
      <div>时间筛选</div>
    </Popup>
    <Calendar v-model="datePickerPopupVisible" type="multiple" safe-area-inset-bottom />
  </div>
</template>

<script>
import * as echarts from "echarts";
import { Icon, Popup, Calendar } from 'vant'

import TrafficService from '@/service/trafficService'

const trafficService = new TrafficService()

export default {
  components: { Icon, Popup, Calendar },

  data() {
    return {
      myChart: {},
      xData: ["16:50", "17:00", "17:10", "17:20", "17:30"],
      yData: [0, 50, 100, 150, 200, 250],
      myChartStyle: { width: "100%", height: "320px" },
      timePickerPopupVisible: false,
      datePickerPopupVisible: false,
    };
  },

  created() {
    this.roomId = this.$route.query.room_id
    this.liveStartTime = this.$route.query.start_time
    this.liveEndTime = this.$route.query.end_time
    this.playBackStartTime = this.liveStartTime
    this.playBackEndTime = Date.parse(new Date(this.playBackStartTime * 1000 + 5 * 24 * 3600 * 1000)) / 1000 
  },

  mounted() {
    this.setLiveChartData()
    this.initEcharts()
    this.initEchartsTwo()
  },

  methods: {
    async setLiveChartData() {
      const res = await trafficService.getChartData(this.roomId, 3, `${this.liveStartTime},${this.liveEndTime}`)
      console.log('setLiveChartData', res)
    },

    async setPlayBackChartData() {
      const res = await trafficService.getChartData(this.roomId, 4, `${this.playBackStartTime},${this.playBackEndTime}`)
      console.log('setPlayBackChartData', res)
    },

    initEcharts() {
      const option = {
        legend: {
          y: 'top',
        },
        xAxis: {
          data: this.xData
        },
        yAxis: {},
        series: [
          {
            name: '流量使用(GB)',
            data: this.yData,
            type: "line",
            itemStyle: {
              normal: { 
                label : {
                  show: true  
                }
              }
            }
          }
        ],
        color: ['#BA9243']
      };
      this.myChart = echarts.init(document.getElementById("mychart"));
      this.myChart.setOption(option);
    },

    initEchartsTwo() {
      const option = {
        legend: {
          y: 'top',
        },
        xAxis: {
          data: this.xData
        },
        yAxis: {},
        series: [
          {
            name: '流量使用(GB)',
            data: this.yData,
            type: "line",
            itemStyle: {
              normal: { 
                label : {
                  show: true  
                }
              }
            }
          }
        ],
        color: ['#BA9243']
      };
      this.myChart = echarts.init(document.getElementById("mychart-2"));
      this.myChart.setOption(option);
    },
  }
};
</script>

<style lang="stylus" scoped>
.container
  padding: .24rem
  .card
    margin-bottom: .24rem
    padding: .32rem
    background: #fff
    border-radius: .12rem
    .title-wrap
      display: flex
      align-items: center
      justify-content: space-between
      .title
        color: #333
        font-size: .32rem
        font-weight: 550
      .timer-picker
        display: flex
        align-items: center
        padding: 0 .14rem
        width: 2.66rem
        height: .5rem
        border-radius: .08rem
        border: 1px solid #8D8D8D
        color: #333
        font-size: .24rem
        .time-desc
          flex: 1
    .echart
      margin-top: .64rem
</style>
