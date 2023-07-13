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
        title: "智能助手",
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
