import Router from 'vue-router'

const router = new Router({
  routes: [
    {
      name: 'live_play',
      path: '/l_p',
      component: () => import('../pages/room/index')
    },
    {
      name: 'traffic_statistic',
      path: '/traffic_statistic',
      component: () => import('../pages/traffic-statistics/index'),
      meta: {
        title: '流量统计'
      }
    },
    {
      name: 'login',
      path: '/login',
      component: () => import('../pages/login/index')
    },
    {
      name: 'auth',
      path: '/auth',
      component: () => import('../pages/auth/index')
    },
    {
      name: "ai",
      path: "/ai",
      component: () => import("@/pages/ai"),
      meta: {
        title: "YOUAi",
        requireAuth: true,
      },
    },
    {
      name: "ai_chat",
      path: "/ai/chat",
      component: () => import("@/pages/ai/chat/chat"),
      meta: {
        title: "YOUAi",
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
      name: "ai_goods_mode",
      path: "/ai/goods_mode",
      component: () => import("@/pages/ai/chat/goods-mode"),
      meta: {
        title: "智能商品推荐",
      },
    },
    {
      name: "ai_assistant_center",
      path: "/ai/assistant_center",
      component: () => import("@/pages/ai/assistant-center"),
      meta: {
        title: "YouAi助手中心",
      },
    },
    {
      name: "ai_assistant_create",
      path: "/ai/assistant_create",
      component: () => import("@/pages/ai/assistant-center/create-assistant"),
      meta: {
        title: "创建助手",
      },
    },
    {
      name: "ai_assistant_preview",
      path: "/ai/assistant_preview",
      component: () => import("@/pages/ai/assistant-center/preview"),
      meta: {
        title: "预览与调试",
      },
    },
  ],
  scrollBehavior() {
    return { x: 0, y: 0 }
  }
})

router.beforeEach((to, from, next) => {
  if (to.meta.title) document.title = to.meta.title
  if (to.query.token) localStorage.setItem('token', to.query.token)
  next()
})

export default router
