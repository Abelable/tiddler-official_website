import Router from "vue-router";
import routes from "./routes/index";

const router = new Router({
  routes,
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
});

router.beforeEach((to, from, next) => {
  if (to.name === "live_play") {
    if (
      !navigator.userAgent.match(
        /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|IEMobile)/i
      )
    ) {
      window.location.href = `https://h5.talking.vip/pc/#/l_p?id=${
        to.query.id
      }&parent_user_id=${to.query.parent_user_id || ""}`;
      return;
    }
  }

  if (to.meta.title) document.title = to.meta.title;
  let view_type = window.localStorage.getItem('view_type')
  // alert(view_type+'aaa'+to.name)
  if(view_type == 'h5' && to.name == 'live_play'){
    next();
    return
  }
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
});

export default router;
