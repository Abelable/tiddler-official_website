const digitalHuman = [
  {
    name: "digital_human",
    path: "/digital_human",
    component: () => import("@/pages/digital-human/index"),
    meta: {
      title: "有播数字人",
    },
  },
  {
    name: "digital_human_recording_notes",
    path: "/digital_human/recording_notes",
    component: () => import("@/pages/digital-human/recording-notes"),
    meta: {
      title: "录制数字人注意事项",
    },
  },
  {
    name: "digital_human_recording_steps",
    path: "/digital_human/recording_steps",
    component: () => import("@/pages/digital-human/recording-steps"),
    meta: {
      title: "录制数字人步骤",
    },
  },
  {
    name: "digital_human_upload_notes",
    path: "/digital_human/upload_notes",
    component: () => import("@/pages/digital-human/upload-notes"),
    meta: {
      title: "视频上传注意事项",
    },
  },
  {
    name: "digital_human_upload",
    path: "/digital_human/upload",
    component: () => import("@/pages/digital-human/upload"),
    meta: {
      title: "上传视频",
    },
  },
  {
    name: "digital_human_video_status",
    path: "/digital_human/video_status",
    component: () => import("@/pages/digital-human/video-status"),
    meta: {
      title: "入驻状态",
    },
  },
  {
    name: "digital_human_action_library",
    path: "/digital_human/action_library",
    component: () => import("@/pages/digital-human/action-library"),
    meta: {
      title: "动作库",
    },
  },
  {
    name: "digital_human_record",
    path: "/digital_human/record",
    component: () => import("@/pages/digital-human/record"),
    meta: {
      title: "录制数字人",
    },
  },
  {
    name: "digital_human_action_record",
    path: "/digital_human/action_record",
    component: () => import("@/pages/digital-human/action-record"),
    meta: {
      title: "录制动作库",
    },
  },
  {
    name: "digital_human_record_finish",
    path: "/digital_human/record_finish",
    component: () => import("@/pages/digital-human/record-finish"),
    meta: {
      title: "录制完成",
    },
  },
  {
    name: "digital_human_audio_notes",
    path: "/digital_human/audio_notes",
    component: () => import("@/pages/digital-human/audio-notes"),
    meta: {
      title: "录制声音注意事项",
    },
  },
  {
    name: "digital_human_audio_upload",
    path: "/digital_human/audio_upload",
    component: () => import("@/pages/digital-human/audio-upload"),
    meta: {
      title: "上传音频",
    },
  },
  {
    name: "digital_human_audio_record",
    path: "/digital_human/audio_record",
    component: () => import("@/pages/digital-human/audio-record"),
    meta: {
      title: "声音克隆",
    },
  },
  {
    name: "digital_human_audio_result",
    path: "/digital_human/audio_result",
    component: () => import("@/pages/digital-human/audio-result"),
    meta: {
      title: "入驻状态",
    },
  },
  {
    name: "digital_human_audio_change",
    path: "/digital_human/audio_change",
    component: () => import("@/pages/digital-human/audio-change"),
    meta: {
      title: "更改声音",
    },
  },
  {
    name: "digital_human_setting_va",
    path: "/digital_human/setting_va",
    component: () => import("@/pages/digital-human/setting-va"),
    meta: {
      title: "设置",
    },
  },
];

export default digitalHuman;
