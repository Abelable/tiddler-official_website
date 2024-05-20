import Router from "vue-router";
import routes from "./routes/index";

const router = new Router({
  routes,
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
});

router.beforeEach((to, from, next) => {
  next();
});

export default router;
