<template>
  <canvas id="bubble" class="bubble" width="90" height="350"></canvas>
</template>

<script>
const imagesArr = []
let userAvatar = null
let queue = {}
let frameId = null
let canvas = null
let ctx = null

export default {
  props: {
    manual: Boolean,
    count: Number
  },

  watch: {
    count(newVal, oldVal) {
      this.likeChange(newVal, oldVal)
    }
  },

  mounted() {
    canvas = document.getElementById('bubble')
    ctx = canvas.getContext('2d')

    for (let i = 1; i < 8; i++) {
      const img = new Image()
      img.src = require(`../../../assets/images/praise/${i}.png`)
      img.onload = () => {
        imagesArr.push(img)
      }
    }

    const img = new Image()
    img.src = this.$store.state.im.userAvatar
    img.onload = () => {
      userAvatar = img
    }
  },

  destroyed() {
    if (frameId) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        window.cancelAnimationFrame(frameId)
        frameId = null
      }
      queue = {}
  },

  methods: {
    likeChange(newVal, oldVal) {
      // 第一次赋值不作处理
      if (oldVal === 0 && newVal > 1) {
        return
      }
      let times = newVal - oldVal
      // 限制差值大小
      if (times >= 6) {
        times = 6
      }
      for (let i = 0; i < times; i++) {
        setTimeout(() => {
          this.likeClick()
        }, 200 * i)
      }
    },

    async likeClick() {
      const anmationData = {
        id: new Date().getTime(),
        timer: 0,
        opacity: 1,
        pathData: this.generatePathData(),
        image: this.manual ? userAvatar : imagesArr[Math.floor(Math.random() * imagesArr.length)],
        imageSize: 0.5,
        factor: {
          speed: 0.01, // 运动速度，值越小越慢
          t: 0 //  贝塞尔函数系数
        }
      }

      if (Object.keys(queue).length > 0) {
        queue[anmationData.id] = anmationData
      } else {
        queue[anmationData.id] = anmationData
        frameId = window.requestAnimationFrame(() => {
          this.bubbleAnimate()
        })
      }
    },

    generatePathData() {
      const height = 350
      const p0 = { x: 53, y: height }
      const p1 = {
        x: this.getRandom(20, 70),
        y: this.getRandom(height * 0.6, height * 0.9)
      }
      const p2 = {
        x: this.getRandom(0, 90),
        y: this.getRandom(height * 0.2, height * 0.6)
      }
      const p3 = {
        x: this.getRandom(0, 90),
        y: this.getRandom(0, height * 0.2)
      }
      return [p0, p1, p2, p3]
    },

    getRandom(min, max) {
      return Math.random() * (max - min) + min
    },

    bubbleAnimate() {
      Object.keys(queue).forEach(key => {
        const anmationData = queue[+key];
        const { x, y } = this.updatePath(
          anmationData.pathData,
          anmationData.factor
        )
        const speed = anmationData.factor.speed
        anmationData.factor.t += speed
        if (y < 200) {
          anmationData.imageSize += 0.003
        } else {
          anmationData.imageSize += 0.01
        }
        if (y < 100) {
          anmationData.opacity -= 0.05
        }

        ctx.save()
        ctx.beginPath()
        ctx.arc(x + 15 * anmationData.imageSize, y + 15 * anmationData.imageSize , 15 * anmationData.imageSize, 0, 2 * Math.PI, false)
        ctx.clip()
        ctx.globalAlpha = anmationData.opacity <= 0 ? 0 : anmationData.opacity // 设置透明度
        ctx.drawImage(anmationData.image, x, y, 30 * anmationData.imageSize, 30 * anmationData.imageSize)
        ctx.restore()

        if (anmationData.opacity <= 0) {
          delete queue[anmationData.id]
        }
      })

      if (Object.keys(queue).length > 0) {
        frameId = window.requestAnimationFrame(() => {
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          this.bubbleAnimate()
        })
      } else {
        window.cancelAnimationFrame(frameId)
        frameId = null
      }
    },

    updatePath(data, factor) {
      const p0 = data[0] // 三阶贝塞尔曲线起点坐标值
      const p1 = data[1] // 三阶贝塞尔曲线第一个控制点坐标值
      const p2 = data[2] // 三阶贝塞尔曲线第二个控制点坐标值
      const p3 = data[3] // 三阶贝塞尔曲线终点坐标值

      const t = factor.t

      /*计算多项式系数*/
      const cx1 = 3 * (p1.x - p0.x)
      const bx1 = 3 * (p2.x - p1.x) - cx1
      const ax1 = p3.x - p0.x - cx1 - bx1

      const cy1 = 3 * (p1.y - p0.y)
      const by1 = 3 * (p2.y - p1.y) - cy1
      const ay1 = p3.y - p0.y - cy1 - by1

      /*计算xt yt的值 */
      const x = ax1 * (t * t * t) + bx1 * (t * t) + cx1 * t + p0.x
      const y = ay1 * (t * t * t) + by1 * (t * t) + cy1 * t + p0.y
      return { x,  y }
    }
  }
}
</script>

<style lang="stylus" scoped>
.bubble
  position: absolute
  right: 0
  bottom: 1.13rem
</style>
