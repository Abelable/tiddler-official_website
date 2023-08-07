const supplier = [
  {
    name: "supplier",
    path: "/supplier",
    component: () => import("@/pages/supplier/index"),
    meta: {
      title: "瑞播商家入驻",
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
];

export default supplier;
