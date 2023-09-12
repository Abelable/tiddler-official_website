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
      title: "有播数字人",
    },
  },
];

export default digitalHuman;
