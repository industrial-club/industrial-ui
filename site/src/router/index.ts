import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import index from "../views/index";

const routes: Array<RouteRecordRaw> = [
  { path: "/", meta: { name: "登录", hideMenu: true }, component: index },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
