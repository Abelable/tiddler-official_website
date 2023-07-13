<template>
  <div class="container">
    <img class="bg" src="../images/bg.png" alt="" />

    <div class="main">
      <div class="form-label">助手名称</div>
      <input class="form-input" type="text" placeholder="请填写最多20个字" />

      <div class="form-label">助手类型</div>
      <div class="form-selection row">
        <div class="selection-content" :class="{ active: type }">
          {{ type || "请选择助手类型" }}
        </div>
        <img class="selection-icon" src="../images/down-arrow.png" alt="" />
      </div>

      <div class="form-label">助手回答</div>
      <div class="form-selection row">
        <div class="selection-content" :class="{ active: replay }">
          {{ replay || "请选择助手回答" }}
        </div>
        <img class="selection-icon" src="../images/down-arrow.png" alt="" />
      </div>
      <div class="tips">精确控制每轮对话，避免历史会话影响，效果稳定</div>

      <div class="form-label">助手名称</div>
      <textarea
        class="form-textarea"
        style="height: 1.48rem"
        cols="30"
        rows="10"
        placeholder="请最多填写30个字"
      ></textarea>

      <div class="form-label">助手指令</div>
      <textarea
        class="form-textarea"
        style="height: 3.12rem"
        cols="30"
        rows="10"
        placeholder="例如：作为一位演示脚本编写专家， 请根据以下主题【】，生成一份完整的演示脚本。要求内容详细，逻辑清晰。"
      />
      <div class="tips">
        <span>{{ specialTips }}</span>
        <span style="color: #3090FF">助手指令编写指南</span>
      </div>

      <div class="btns row between">
        <div class="preview-btn row center">调试与预览</div>
        <div class="create-btn row center">创建助手</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      type: "",
      replay: "",
      specialTips:
        "特别提示：指令中必须包含一个【】用来标识用户输入的问在指令中的位置，【】中不能包含空格或文字信息。详细教程请查看",
    };
  },

  methods: {},
};
</script>

<style lang="stylus" scoped>
.row
  display: flex
  align-items: center
  &.center
    justify-content: center
  &.between
    justify-content: space-between
.container
  position: relative
  .bg
    position: fixed
    top: 0
    left: 0
    width: 100vw
  .main
    padding: .3rem
    font-size: 0
    .form-label
      margin-top: .2rem
      color: #43436B
      font-size: .32rem
      &:first-child
        margin-top: 0
    .form-input, .form-selection, .form-textarea
      margin-top: .16rem
      padding: 0 .2rem
      width: 6.9rem
      height: .84rem
      font-size: .28rem
      border: 1px solid #DAE1EB
      background: #fff
      border-radius: .12rem
    .form-textarea
      padding: .2rem
    .selection-content
      flex: 1
      color: #999
      &.active
        color: #333
    .selection-icon
      width: .32rem
      height: .32rem
    .tips
      position: relative
      margin-top: .12rem
      padding-left: .2rem
      color: #9394AA
      font-size: .26rem
      &::before
        position: absolute
        left: 0
        top: 0
        content: "*"
        color: #FF3838
        font-size: .32rem
    .btns
      margin-top: .4rem
      .preview-btn, .create-btn
        width: 3.34rem
        height: .92rem
        font-size: .32rem
        font-weight: 500
        border: 1px solid #6B89FF
        border-radius: .46rem
      .preview-btn
        color: #6178FF
        background: #fff
      .create-btn
        color: #fff
        background: #6B89FF
</style>
