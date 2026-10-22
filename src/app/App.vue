<script setup lang="ts">
import { onMounted } from "vue";
import Toast from "primevue/toast";
import { AppConfirmDialog } from "@/shared/ui";
import { AppHeader } from "@/widgets/app-header";
import { useThemeStore } from "@/features/theme-switcher";

const themeStore = useThemeStore();

onMounted(() => {
  themeStore.applyTheme();
});
</script>

<template>
  <div class="app-layout">
    <Toast position="top-right" />
    <AppConfirmDialog />
    <AppHeader />
    <main class="main-content">
      <div class="container">
        <RouterView />
      </div>
    </main>
    <footer class="app-footer">
      vue-lottery-app &copy; 2026. ЧНУ. Feature-Sliced Design.
    </footer>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.main-content {
  flex: 1;
  padding: 1.5rem 1rem;
}
.container {
  max-width: 1000px;
  margin: 0 auto;
}
.app-footer {
  text-align: center;
  padding: 1rem;
  font-size: 0.85rem;
  border-top: 1px solid var(--p-content-border-color, #e5e7eb);
  color: var(--p-text-muted-color, #6b7280);
}
</style>
