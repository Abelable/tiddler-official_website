import ai from "./ai";

const routes = [
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
    name: "traffic_statistic",
    path: "/traffic_statistic",
    component: () => import("@/pages/traffic-statistics/index"),
    meta: {
      title: "流量统计",
    },
  },
  {
    name: "login",
    path: "/login",
    component: () => import("@/pages/login/index"),
  },
  {
    name: "auth",
    path: "/auth",
    component: () => import("@/pages/auth/index"),
  },
  ...ai,
];

export default routes;
