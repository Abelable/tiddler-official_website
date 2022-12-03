import Router from 'vue-router'
import { postMsg, isInApp } from '../utils/bridge'

const router = new Router({
  routes: [
    {
      name: 'login',
      path: '/login',
      component: () => import('../pages/login/index'),
      meta: {
        title: '登录'
      }
    },
    {
      name: 'live_play',
      path: '/live_play',
      component: () => import('../pages/room/index'),
      meta: {
        title: '直播间',
        requireAuth: true
      }
    },
  ],
  scrollBehavior() {
    return { x: 0, y: 0 }
  }
})

router.beforeEach((to, from, next) => {
  if (to.meta.title) document.title = to.meta.title
  // if (to.query.invite_code) localStorage.setItem('inviteCode', to.query.invite_code)

  const token = localStorage.getItem('token')
  if (to.meta.requireAuth) {
    if (!token) {
      if (to.query.token) {
        localStorage.setItem('token', to.query.token)
        next()
      } else {
        if (isInApp()) {
          postMsg({ type: '1002' })
        } else {
          next({ 
            path: '/login',
            query: { redirect: to.fullPath }
          })
        }
      }
    } else {
      if (to.query.token) {
        localStorage.setItem('token', to.query.token)
      }
      next()
    }
  } else {
    next()
  }
})

export default router
