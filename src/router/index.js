import Router from 'vue-router'

const router = new Router({
  routes: [
    {
      name: 'live_play',
      path: '/live_play',
      component: () => import('../pages/room/index')
    },
  ],
  scrollBehavior() {
    return { x: 0, y: 0 }
  }
})

export default router
