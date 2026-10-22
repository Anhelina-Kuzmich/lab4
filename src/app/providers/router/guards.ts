import type { Router } from "vue-router";
import { useSessionStore } from "@/entities/session";

export function setupGuards(router: Router): void {
  router.beforeEach((to) => {
    const session = useSessionStore();

    if (to.matched.some((record) => record.meta.requiresAuth)) {
      if (!session.isAuthenticated) {
        return { name: "login", query: { redirect: to.fullPath } };
      }
    }

    if (to.meta.guestOnly && session.isAuthenticated) {
      return { name: "users" };
    }
  });

  router.afterEach((to) => {
    if (to.meta.title) {
      document.title = to.meta.title as string;
    }
  });
}
