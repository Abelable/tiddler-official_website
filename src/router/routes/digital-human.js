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
];

export default digitalHuman;
