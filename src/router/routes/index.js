import ai from "./ai";

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
    name: "traffic_statistic",
    path: "/traffic_statistic",
    component: () => import("@/pages/traffic-statistics/index"),
    meta: {
      title: "流量统计",
    },
  },
  {
    name: "supplier",
    path: "/supplier",
    component: () => import("@/pages/supplier/index"),
    meta: {
      title: "瑞播商家入驻",
    },
  },
  ...ai,
];

export default routes;
