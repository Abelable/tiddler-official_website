const ai = [
  {
    name: "ai",
    path: "/ai",
    component: () => import("@/pages/ai"),
    meta: {
      title: "智能助手",
      requireAuth: true,
    },
  },
  {
    name: "ai_chat",
    path: "/ai/chat",
    component: () => import("@/pages/ai/chat/chat"),
    meta: {
      title: "智能助手",
    },
  },
  {
    name: "ai_assistant_mode",
    path: "/ai/assistant_mode",
    component: () => import("@/pages/ai/chat/assistant-mode"),
    meta: {
      title: "助手模式",
    },
  },
  {
    name: "ai_assistant_center",
    path: "/ai/assistant_center",
    component: () => import("@/pages/ai/assistant-center"),
    meta: {
      title: "助手中心",
    },
  },
];

export default ai;
