import ai from "./ai";
import supplier from "./supplier";
import digitalHuman from "./digital-human";

const routes = [
  {
    name: "login",
    path: "/login",
    component: () => import("@/pages/login/index"),
  },
  {
    name: "live_play",
    path: "/l_p",
    component: () => import("@/pages/room/index"),
    meta: {
      title: "直播",
      requireAuth: true,
    },
  },
  {
    name: "clear",
    path: "/clear",
    component: () => import("@/pages/room/clear"),
    meta: {
      title: "清除缓存",
    },
  },
  {
    name: "test",
    path: "/test",
    component: () => import("@/pages/room/test"),
    meta: {
      title: "test",
    },
  },
  {
    name: "traffic_statistic",
    path: "/traffic_statistic",
    component: () => import("@/pages/traffic-statistics/index"),
    meta: {
      title: "流量统计",
    },
  },
  {
    name: "invite",
    path: "/invite_assistant",
    component: () => import("@/pages/invite-assistant"),
    meta: {
      title: "助手邀请",
    },
  },
  {
    name: "official-website",
    path: "/official_website",
    component: () => import("@/pages/official-website/index"),
    meta: {
      title: "官网",
    },
  },

  ...ai,
  ...supplier,
  ...digitalHuman,
];

export default routes;
