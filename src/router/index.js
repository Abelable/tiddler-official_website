import Router from 'vue-router'
import routes from './routes/index'

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
    ...routes
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
