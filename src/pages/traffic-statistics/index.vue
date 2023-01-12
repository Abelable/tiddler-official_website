<template>
  <div class="container">
    <div class="card">
      <div class="title-wrap">
        <div class="title">直播流量</div>
        <div class="time-picker-wrap">
          <div>时间范围：</div>
          <div class="timer-picker" @click="startTimePickerPopupVisible = true">
            <div class="time-desc">{{liveStartTime | timeDesc}}</div>
            <Icon name="arrow-down" />
          </div>
          <div style="margin: 0 0.1rem;">-</div>
          <div class="timer-picker" @click="endTimePickerPopupVisible = true">
            <div class="time-desc">{{liveEndTime | timeDesc}}</div>
            <Icon name="arrow-down" />
          </div>
        </div>
      </div>
      <div class="echart" id="liveChart" />
    </div>

    <div class="card">
      <div class="title-wrap">
        <div class="title">回放流量</div>
        <div class="time-picker-wrap">
          <div>起始日期：</div>
          <div class="timer-picker" @click="datePickerPopupVisible = true">
            <div class="time-desc">{{playBackStartDate | dateDesc}}</div>
            <Icon name="arrow-down" />
          </div>
        </div>
      </div>
      <div class="echart" id="playBackchart" />
    </div>

    <Popup v-model="startTimePickerPopupVisible" position="bottom" round>
      <DatetimePicker
        type="datetime" 
        title="选择开始时间" 
        :min-date="new Date(initialStartTime * 1000)"
        :max-date="new Date(initialEndTime * 1000)"
        @confirm="setLiveStartTime"
        @cancel="startTimePickerPopupVisible = false"
      />
    </Popup>
    <Popup v-model="endTimePickerPopupVisible" position="bottom" round>
      <DatetimePicker 
        type="datetime" 
        title="选择结束时间" 
        :min-date="new Date(liveStartTime * 1000)"
        :max-date="new Date(initialEndTime * 1000)"
        @confirm="setLiveEndTime"
        @cancel="endTimePickerPopupVisible = false"
      />
    </Popup>
    <Calendar
      v-model="datePickerPopupVisible"
      @confirm="setPlayBackDateRange"
      :min-date="new Date(initialStartTime * 1000)"
      safe-area-inset-bottom 
    />
  </div>
</template>

<script>
import * as echarts from "echarts";
import { Icon, Popup, DatetimePicker, Calendar } from 'vant'

import TrafficService from '@/service/trafficService'

const trafficService = new TrafficService()

export default {
  components: { Icon, Popup, DatetimePicker, Calendar },

  data() {
    return {
      initialStartTime: 0,
      initialEndTime: 0,
      liveStartTime: 0,
      liveEndTime: 0,
      playBackStartDate: 0,
      playBackEndDate: 0,
      liveXData: [],
      liveYData: [],
      playBackXData: [],
      playBackYData: [],
      startTimePickerPopupVisible: false,
      endTimePickerPopupVisible: false,
      datePickerPopupVisible: false,
    };
  },

  filters: {
    dateDesc(timestamp) {
      return (new Date(timestamp * 1000).toLocaleString()).split(' ')[0]
    },
    timeDesc(timestamp) {
      const date = new Date(timestamp * 1000)
      const hours = `${date.getHours()}`.padStart(2, '0')
      const minutes = `${date.getMinutes()}`.padStart(2, '0')
      return `${hours}:${minutes}`
    }
  },

  created() {
    this.roomId = this.$route.query.room_id
    this.initialStartTime = this.$route.query.start_time
    this.initialEndTime = this.$route.query.end_time

    this.liveStartTime = this.initialStartTime
    this.liveEndTime = this.initialEndTime
    this.playBackStartDate = this.liveStartTime
    this.playBackEndDate = Date.parse(new Date(this.playBackStartTime * 1000 + 5 * 24 * 3600 * 1000)) / 1000 
  },

  mounted() {
    this.setLiveChartData()
    this.setPlayBackChartData()
  },

  methods: {
    setLiveStartTime(date) {
      this.liveStartTime = Date.parse(new Date(date)) / 1000
      this.setLiveChartData()
      this.startTimePickerPopupVisible = false
    },

    setLiveEndTime(date) {
      this.liveEndTime = Date.parse(new Date(date)) / 1000
      this.setLiveChartData()
      this.endTimePickerPopupVisible = false
    },

    setPlayBackDateRange(date) {
      this.playBackStartDate = Date.parse(new Date(date)) / 1000
      this.playBackEndDate = Date.parse(new Date(this.playBackStartDate * 1000 + 5 * 24 * 3600 * 1000)) / 1000 
      this.setPlayBackChartData()
      this.datePickerPopupVisible = false
    },

    async setLiveChartData() {
      const { list = [] } = await trafficService.getChartData(this.roomId, 3, `${this.liveStartTime},${this.liveEndTime}`) || {}
      const xData = []
      const yData = []
      list.forEach(item => {
        xData.push(item.key)
        yData.push(item.value)
      })
      this.liveXData = xData
      this.liveYData = yData
      this.initLiveEcharts()
    },

    async setPlayBackChartData() {
      const { list = [] } = await trafficService.getChartData(this.roomId, 4, `${this.playBackStartDate},${this.playBackEndDate}`) || {}
      const xData = []
      const yData = []
      list.forEach(item => {
        xData.push(item.key)
        yData.push(item.value)
      })
      this.playBackXData = xData
      this.playBackYData = yData
      this.initPlayBackEcharts()
    },

    initLiveEcharts() {
      const averageValue = eval(this.liveYData.join("+")) / 5
      const unit = averageValue < 1000 ? 'MB' : averageValue < (1000 * 1000) ? 'GB' : 'TB'
      this.liveYData = this.liveYData.map(item => {
        switch (unit) {
          case 'MB':
            return item
          case 'GB':
            return (item / 1000).toFixed(3)
          case 'TB':
            return (item / (1000 * 1000)).toFixed(3)
        }
      })
      const option = {
        legend: {
          y: 'top',
        },
        xAxis: {
          data: this.liveXData
        },
        yAxis: {},
        series: [
          {
            name: `流量使用(${unit})`,
            data: this.liveYData,
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
      this.liveChart = echarts.init(document.getElementById("liveChart"));
      this.liveChart.setOption(option);
    },

    initPlayBackEcharts() {
      const averageValue = eval(this.playBackYData.join("+")) / 5
      const unit = averageValue < 1000 ? 'MB' : averageValue < (1000 * 1000) ? 'GB' : 'TB'
      this.playBackYData = this.playBackYData.map(item => {
        switch (unit) {
          case 'MB':
            return item
          case 'GB':
            return (item / 1000).toFixed(3)
          case 'TB':
            return (item / (1000 * 1000)).toFixed(2)
        }
      })
      const option = {
        legend: {
          y: 'top',
        },
        xAxis: {
          data: this.playBackXData
        },
        yAxis: {},
        series: [
          {
            name: '流量使用(GB)',
            data: this.playBackYData,
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
      this.playBackchart = echarts.init(document.getElementById("playBackchart"));
      this.playBackchart.setOption(option);
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
      .time-picker-wrap
        display: flex
        align-items: center
        color: #333
        font-size: .26rem
      .timer-picker
        display: flex
        align-items: center
        padding: 0 .14rem
        height: .5rem
        border-radius: .08rem
        border: 1px solid #8D8D8D
        color: #333
        font-size: .24rem
        .time-desc
          margin-right: .14rem
          flex: 1
    .echart
      margin-top: .64rem
      width: 100%
      height: 6.4rem
</style>
