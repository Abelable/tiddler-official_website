const supplier = [
  {
    name: "supplier",
    path: "/supplier",
    component: () => import("@/pages/supplier/index"),
    meta: {
      title: "有播商家入驻",
      requireAuth: true,
    },
  },
  {
    name: "supplier_info",
    path: "/supplier/info",
    component: () => import("@/pages/supplier/info"),
    meta: {
      title: "店铺基本信息",
    },
  },
  {
    name: "supplier_status",
    path: "/supplier/status",
    component: () => import("@/pages/supplier/status"),
    meta: {
      title: "入驻申请",
    },
  },
];

export default supplier;
