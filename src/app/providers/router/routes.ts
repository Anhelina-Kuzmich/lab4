import type { RouteRecordRaw } from "vue-router";

export const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "home",
    component: () => import("@/pages/home").then((m) => m.HomePage),
    meta: { title: "Головна - Lottery App" },
  },
  {
    path: "/about",
    name: "about",
    component: () => import("@/pages/about").then((m) => m.AboutPage),
    meta: { title: "Про автора - Lottery App" },
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/pages/login").then((m) => m.LoginPage),
    meta: { title: "Авторизація", guestOnly: true },
  },
  {
    path: "/users",
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "users",
        component: () => import("@/pages/users").then((m) => m.UsersPage),
        meta: { title: "Користувачі", requiresAuth: true },
      },
      {
        path: ":id",
        name: "user-details",
        component: () =>
          import("@/pages/user-details").then((m) => m.UserDetailsPage),
        props: true,
        meta: { title: "Деталі користувача", requiresAuth: true },
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: () => import("@/pages/not-found").then((m) => m.NotFoundPage),
    meta: { title: "404 - Сторінку не знайдено" },
  },
];
