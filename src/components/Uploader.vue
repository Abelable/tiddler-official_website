<template>
  <Uploader class="uploader" :after-read="uploadPic" max-count="1">
    <img
      class="photo"
      v-if="!loading && pic"
      :src="pic"
      alt=""
    />
    <img
      v-if="!loading && !pic"
      class="default-img"
      :src="defaultImg"
      alt=""
    />
    <div class="loading-wrap" v-if="loading">
      <Loading vertical color="#fff">上传中...</Loading>
    </div>
    <div class="desc">{{ desc }}</div>
  </Uploader>
</template>

<script>
import { Uploader, Loading } from "vant";
import { upload } from '@/utils/upload'

export default {
  components: { Uploader, Loading },

  props: {
    defaultImg: String,
    desc: String,
  },

  data() {
    return {
      loading: false,
      pic: ""
    }
  },

  methods: {
    async uploadPic({ file }) {
      this.loading = true
      this.pic = await upload(file)
      this.loading = false
      this.$emit('finish', this.pic)
    }
  }
};
</script>

<style lang="stylus" scoped>
.uploader
  font-size: 0
  .photo,
  .default-img,
  .loading-wrap
    width: 3rem
    height: 2rem
    border: 1px solid #f5f6f7
    border-radius: .1rem
    object-fit: cover
  .desc
    margin-top: 0.16rem
    color: #1F233B
    font-size: 0.28rem
    text-align: center
</style>
