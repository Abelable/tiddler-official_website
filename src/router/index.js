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
  if (to.name === 'live_play') {
    if (
      !navigator.userAgent.match(
        /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|IEMobile)/i
      )
    ) {
      window.location.href = `https://h5.talking.vip/pc/#/l_p?id=${to.query.id}&parent_user_id=${to.query.parent_user_id || ''}`;
      return;
    }
  }

  if (to.meta.title) document.title = to.meta.title;
  
  const token = localStorage.getItem("token");
  if (to.meta.requireAuth) {
    if (!token) {
      if (to.query.token) {
        localStorage.setItem("token", to.query.token);
        next();
      } else {
        next({
          path: "/login",
          query: { redirect: to.fullPath },
        });
      }
    } else {
      if (to.query.token) {
        localStorage.setItem("token", to.query.token);
      }
      next();
    }
  } else {
    next();
  }
})

export default router
