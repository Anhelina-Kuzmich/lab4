<script setup lang="ts">
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = () => {
  authStore.logout();
  router.push({ name: "login" });
};
</script>

<template>
  <nav class="d-flex align-items-center gap-3">
    <RouterLink to="/" class="nav-link-custom"> Home </RouterLink>

    <RouterLink to="/about" class="nav-link-custom"> About author </RouterLink>

    <RouterLink to="/users" class="nav-link-custom"> Users </RouterLink>

    <button
      v-if="authStore.isAuthenticated"
      type="button"
      class="btn btn-outline-danger btn-sm"
      @click="handleLogout"
    >
      Logout
    </button>
    <RouterLink v-else to="/login" class="btn btn-primary btn-sm">
      Login
    </RouterLink>
  </nav>
</template>

<style scoped>
.nav-link-custom {
  color: #495057;
  font-weight: 500;
  text-decoration: none;
  padding: 6px 12px;
  border-radius: 4px;
  transition: all 0.2s;
}

.nav-link-custom:hover {
  color: #0d6efd;
  background-color: #f1f7f9;
}

.router-link-active:not(.brand-logo) {
  color: #0d6efd !important;
  font-weight: 700;
  background-color: #e6f4f8;
}
</style>
