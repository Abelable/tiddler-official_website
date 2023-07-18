import Router from "vue-router";
import routes from "./routes/index";

const router = new Router({
  routes,
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
});

router.beforeEach((to, from, next) => {
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
});

export default router;
