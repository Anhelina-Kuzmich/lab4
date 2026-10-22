<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useSessionStore } from "@/entities/session";
import { LogoutButton } from "@/features/auth";
import { ThemeSwitcher } from "@/features/theme-switcher";

const session = useSessionStore();
const { isAuthenticated } = storeToRefs(session);
</script>

<template>
  <nav class="navigation" aria-label="Головна навігація">
    <RouterLink to="/">Головна</RouterLink>
    <RouterLink to="/about">Про автора</RouterLink>
    <RouterLink v-if="isAuthenticated" to="/users">Користувачі</RouterLink>
    <RouterLink v-else to="/login">Увійти</RouterLink>
    <ThemeSwitcher />
    <LogoutButton v-if="isAuthenticated" />
  </nav>
</template>

<style scoped>
.navigation {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: 0.35rem 0.75rem;
}

.navigation a {
  color: var(--p-text-color);
  text-decoration: none;
}

.navigation a:hover,
.navigation a.router-link-active {
  color: var(--p-primary-color);
}
</style>
