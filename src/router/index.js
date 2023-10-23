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

  if (to.name === "live_play") {
    const { cover, title } = to.query;
    const head = document.getElementsByTagName("head");

    const coverMeta = document.createElement("meta");
    coverMeta.property = "og:image";
    coverMeta.content = cover;
    head[0].appendChild(coverMeta);

    const titleMeta = document.createElement("meta");
    titleMeta.property = "og:title";
    titleMeta.content = title;
    head[0].appendChild(titleMeta);
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
