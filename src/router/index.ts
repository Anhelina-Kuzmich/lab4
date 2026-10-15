import { createRouter, createWebHashHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("@/views/HomeView.vue"),
      meta: {
        title: "Головна - Lottery App",
        layout: "DefaultLayout",
      },
    },
    {
      path: "/about",
      name: "about",
      component: () => import("@/views/AboutView.vue"),
      meta: {
        title: "Про автора - Lottery App",
        layout: "DefaultLayout",
      },
    },
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/LoginView.vue"),
      meta: {
        title: "Авторизація - Lottery App",
        layout: "AuthLayout",
        guestOnly: true,
      },
    },
    {
      path: "/users",
      meta: {
        requiresAuth: true,
        layout: "DefaultLayout",
      },
      children: [
        {
          path: "",
          name: "users",
          component: () => import("@/views/users/UsersView.vue"),
          meta: {
            title: "Користувачі - Lottery App",
            requiresAuth: true,
          },
        },
        {
          path: ":id",
          name: "user-details",
          component: () => import("@/views/users/UserDetailsView.vue"),
          props: true,
          meta: {
            title: "Деталі користувача - Lottery App",
            requiresAuth: true,
          },
          children: [
            {
              path: "edit",
              name: "user-edit",
              component: () => import("@/views/users/UserEditView.vue"),
              props: true,
              meta: {
                title: "Редагування користувача - Lottery App",
                requiresAuth: true,
              },
            },
          ],
        },
      ],
    },
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: () => import("@/views/NotFoundView.vue"),
      meta: {
        title: "404 - Сторінку не знайдено",
        layout: "DefaultLayout",
      },
    },
  ],
});

router.beforeEach((to) => {
  const authStore = useAuthStore();

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!authStore.isAuthenticated) {
      return {
        name: "login",
        query: { redirect: to.fullPath },
      };
    }
  }

  if (to.meta.guestOnly && authStore.isAuthenticated) {
    return { name: "users" };
  }
});

router.afterEach((to) => {
  if (to.meta.title) {
    document.title = to.meta.title as string;
  }
});

export default router;
