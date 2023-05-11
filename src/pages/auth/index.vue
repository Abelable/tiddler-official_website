<template>
  <div>
    <div
    class="status"
    :class="{
      ing: authInfo?.status === '2',
      done: authInfo?.status === '1',
      fail: authInfo?.status === '3',
    }"
    v-if="authInfo?.status"
  >
    {{
      authInfo?.status === "2"
        ? "实名认证审核中"
        : authInfo?.status === "1"
        ? "实名认证审核成功过"
        : "实名认证失败"
    }}
  </div>
  <div class="fail-reason" v-if="authInfo?.status === '3'">
    <div>失败原因：</div>
    <div>{{ authInfo?.refuse_type }}</div>
  </div>

  <div class="container">
    <div class="title">
      <span>信息填写</span>
      <span class="tips">（均为法人信息）</span>
    </div>
    <div class="form">
      <div class="form-item">
        <div class="label">真实姓名</div>
        <div
          class="input"
          v-if="
            authInfo && (authInfo?.status === '1' || authInfo?.status === '2')
          "
        >
          {{ authInfo?.real_name }}
        </div>
        <input
          class="input"
          v-if="
            !authInfo ||
            (authInfo && (!authInfo?.status || authInfo?.status === '3'))
          "
          v-model="authInfo.real_name"
          placeholder="请输入真实姓名"
        />
      </div>
      <div class="form-item">
        <div class="label">身份证号</div>
        <div
          class="input"
          v-if="
            authInfo && (authInfo?.status === '1' || authInfo?.status === '2')
          "
        >
          {{ authInfo?.card_number }}
        </div>
        <input
          class="input"
          v-if="
            !authInfo ||
            (authInfo && (!authInfo?.status || authInfo?.status === '3'))
          "
          v-model="authInfo.card_number"
          placeholder="请输入身份证号"
        />
      </div>
      <div class="form-item">
        <div class="label">手机号码</div>
        <!-- <div
          class="input"
          v-if="
            authInfo && (authInfo?.status === '1' || authInfo?.status === '2')
          "
        >
          {{ authInfo?.mobile }}
        </div> -->
        <!-- <input
          class="input"
          v-if="
            !authInfo ||
            (authInfo && (!authInfo?.status || authInfo?.status === '3'))
          "
          v-model="authInfo.mobile"
          placeholder="请输入手机号码"
        /> -->
        <div style="font-size: 0.28rem; margin-left: 0.8rem; color: #999">
          {{ mobileStr }}
        </div>
      </div>
    </div>

    <div class="title">上传身份证照片</div>
    <div class="card">
      <div class="upload-wrap">
        <div class="upload">
          <div
            class="upload-bg"
            v-if="
              authInfo && (authInfo?.status === '1' || authInfo?.status === '2')
            "
            :style="
              'background:url(' +
              authInfo?.front +
              ') no-repeat center;background-size:cover;'
            "
          ></div>
          <div
            class="upload-bg-input"
            v-if="
              !authInfo ||
              (authInfo && (!authInfo?.status || authInfo?.status === '3'))
            "
          >
            <div
              class="upload-bg"
              v-if="authInfo.front"
              :style="
                'background:url(' +
                authInfo.front +
                ') no-repeat center;background-size:cover;'
              "
            ></div>
            <Uploader
              class="upload-bg"
              v-model="front"
              :preview-size="['3rem', '2rem']"
              max-count="1"
              :before-read="beforeRead"
              @delete="beforeDelete('front')"
            >
              <img
                class="upload-bg"
                :src="
                  authInfo.front ||
                  'https://img.ubo.vip/youbo_plus/auth/backend.png'
                "
              />
            </Uploader>
          </div>
          <div class="upload-desc">点击上传身份证正面</div>
        </div>
        <div class="upload">
          <div
            class="upload-bg"
            v-if="
              authInfo && (authInfo?.status === '1' || authInfo?.status === '2')
            "
            :style="
              'background:url(' +
              authInfo?.negative +
              ') no-repeat center;background-size:cover;'
            "
          ></div>
          <div
            class="upload-bg-input"
            v-if="
              !authInfo ||
              (authInfo && (!authInfo?.status || authInfo?.status === '3'))
            "
          >
            <div
              class="upload-bg"
              v-if="authInfo.negative"
              :style="
                'background:url(' +
                authInfo.negative +
                ') no-repeat center;background-size:cover;'
              "
            ></div>
            <Uploader
              class="upload-bg"
              v-model="negative"
              :preview-size="['3rem', '2rem']"
              max-count="1"
              :before-read="beforeRead"
              @delete="beforeDelete('negative')"
            >
              <img
                class="upload-bg"
                :src="
                  authInfo.negative ||
                  'https://img.ubo.vip/youbo_plus/auth/backend.png'
                "
              />
            </Uploader>
          </div>
          <div class="upload-desc">点击上传身份证反面</div>
        </div>
      </div>
    </div>

    <div class="title">上传手持身份证照片</div>
    <div class="card">
      <div class="upload-wrap">
        <div class="example">
          <img
            class="upload-bg"
            src="https://img.ubo.vip/youbo_plus/id-card-example.png"
          />
          <div class="example-tag">参考事例</div>
        </div>
        <div
          class="upload-bg"
          v-if="
            authInfo && (authInfo?.status === '1' || authInfo?.status === '2')
          "
          :style="
            'background:url(' +
            authInfo?.picture +
            ') no-repeat center;background-size:cover;'
          "
        ></div>
        <div
          class="upload-bg-input"
          v-if="
            !authInfo ||
            (authInfo && (!authInfo?.status || authInfo?.status === '3'))
          "
        >
          <div
            class="upload-bg"
            v-if="authInfo.picture"
            :style="
              'background:url(' +
              authInfo.picture +
              ') no-repeat center;background-size:cover;'
            "
          ></div>
          <Uploader
            class="upload-bg"
            v-model="picture"
            :preview-size="['3rem', '2rem']"
            max-count="1"
            :before-read="beforeRead"
            @delete="beforeDelete('picture')"
          >
            <img
              class="upload-bg"
              :src="
                authInfo.picture ||
                'https://img.ubo.vip/youbo_plus/auth/backend.png'
              "
            />
          </Uploader>
        </div>
      </div>
      <div class="card-tips">请保证照片中身份证信息清晰，漏出手臂。</div>
    </div>

    <div class="title">上传营业执照</div>
    <div class="card">
      <div class="upload-wrap">
        <div class="example">
          <img
            class="upload-bg"
            src="https://img.ubo.vip/youbo_plus/license-example.png"
          />
          <div class="example-tag">参考事例</div>
        </div>
        <div
          class="upload-bg"
          v-if="
            authInfo && (authInfo?.status === '1' || authInfo?.status === '2')
          "
          :style="
            'background:url(' +
            authInfo?.license +
            ') no-repeat center;background-size:cover;'
          "
        ></div>
        <div
          class="upload-bg-input"
          v-if="
            !authInfo ||
            (authInfo && (!authInfo?.status || authInfo?.status === '3'))
          "
        >
          <div
            class="upload-bg"
            v-if="authInfo.license"
            :style="
              'background:url(' +
              authInfo.license +
              ') no-repeat center;background-size:cover;'
            "
          ></div>
          <Uploader
            class="upload-bg"
            v-model="license"
            :preview-size="['3rem', '2rem']"
            max-count="1"
            :before-read="beforeRead"
            @delete="beforeDelete('license')"
          >
            <img
              class="upload-bg"
              :src="
                authInfo.license ||
                'https://img.ubo.vip/youbo_plus/auth/backend.png'
              "
            />
          </Uploader>
        </div>
      </div>
    </div>

    <div class="form" style="margin-top: 0.24rem">
      <div class="form-item">
        <div class="label">常驻地址</div>
        <div
          class="input"
          v-if="
            authInfo && (authInfo?.status === '1' || authInfo?.status === '2')
          "
        >
          {{ authInfo.address }}
        </div>
        <input
          class="input"
          v-if="
            !authInfo ||
            (authInfo && (!authInfo?.status || authInfo?.status === '3'))
          "
          v-model="authInfo.address"
          placeholder="请填写企业经营地址"
        />
      </div>
    </div>

    <div class="warning" @click="reloadFn">
      温馨提示：有播+承诺所有信息严格保密
    </div>

    <div
      class="submit-btn"
      v-if="
        !authInfo ||
        (authInfo && (!authInfo?.status || authInfo?.status === '3'))
      "
      @click="submit"
    >
      提交审核
    </div>
  </div>
  </div>
</template>

<script>
import AuthService from '@/service/authService'

const authService = new AuthService()

export default {
  data() {
    return {
      authInfo: {}
    }
  },

  created() {
    this.setAuthInfo()
  },

  methods: {
    async setAuthInfo() {
      this.authInfo = await authService.getAuthInfo()
    }
  }
}
</script>

<style lang="stylus" scoped>
.status {
  display: flex;
  align-items: center;
  justify-content: center;
  height: .88rem;
  color: #fff;
  font-size: .30rem;
  &.ing {
    background: #FF7548;
  }
  &.done {
    background: #6ED29B;
  }
  &.fail {
    background: #FB6155;
  }
}
.fail-reason {
  padding: .24rem;
  color: #FB6155;
  font-size: .30rem;
}

.container {
  padding: 0 .24rem .80rem;
}

.title {
  margin: .24rem 0 .20rem;
  color: #333;
  font-size: .32rem;
}
.tips {
  color: #999;
  font-size: .24rem;
}

.form {
  padding: 0 .30rem;
  border-radius: .12rem;
  background: #fff;
}
.form-item {
  display: flex;
  align-items: center;
  height: 1rem;
  border-bottom: 1px solid #E8E8E8;
}
.form-item:last-child {
  border-bottom: none;
}
.label {
  color: #242424;
  font-size: .28rem;
}
.input {
  margin-left: .80rem;
  flex: 1;
  font-size: .28rem;
}

.card {
  padding: .30rem;
  border-radius: .12rem;
  background: #fff;
}

.upload-wrap {
  display: flex;
  justify-content: space-between;
  font-size: 0;
}
.upload {
  text-align: center;
}
.upload-bg {
  width: 3.00rem;
  height: 2.00rem;
}
.upload-desc {
  margin-top: .16rem;
  color: #242424;
  font-size: .28rem;
}

.example {
  position: relative;
  width: 3.00rem;
  height: 2.00rem;
  font-size: 0;
  border-radius: 5px;
  overflow: hidden;
}
.example-tag {
  position: absolute;
  left: 0;
  top: .16rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.20rem;
  height: .38rem;
  color: #333;
  font-size: .24rem;
  background: #FDCC87;
  border-radius: 0 .20rem .20rem 0;
}

.card-tips {
  margin-top: .20rem;
  color: #999;
  font-size: .24rem;
}

.warning {
  margin-top: .24rem;
  color: #BA9243;
  font-size: .28rem;
  text-align: center;
}

.submit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: .50rem auto 0;
  width: 6.00rem;
  height: .88rem;
  color: #FFE5BD;
  font-size: .32rem;
  font-weight: 500;
  background: linear-gradient(128deg, #404A5C 0%, #0F131A 100%);
  border-radius: .44rem;
}
.upload-bg-input{
  width: 3rem;
  height: 2rem;
}
::v-deep .upload-bg-input .van-image .van-image__img {
  opacity: 0;
}
.upload-bg-input .van-uploader{
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}
</style>
