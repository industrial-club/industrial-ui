import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import index from "../views/index";
import login from "../views/login";

const routes: Array<RouteRecordRaw> = [
  { path: "/", meta: { name: "登录", hideMenu: true }, component: index },
  { path: "/login", meta: { name: "登录", hideMenu: true }, component: login },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
