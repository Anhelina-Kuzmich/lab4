<script setup lang="ts">
import Logo from "./Logo.vue";
import AppNavigation from "./AppNavigation.vue";
</script>

<template>
  <header class="app-header">
    <div class="header-inner">
      <Logo />
      <AppNavigation />
    </div>
  </header>
</template>

<style scoped>
.app-header {
  border-bottom: 1px solid var(--p-content-border-color);
  background: var(--p-content-background);
}

.header-inner {
  display: flex;
  width: min(100% - 2rem, 1000px);
  min-height: 4.25rem;
  margin: 0 auto;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

@media (max-width: 640px) {
  .header-inner {
    align-items: flex-start;
    flex-direction: column;
    padding: 0.75rem 0;
  }

  .header-inner nav {
    justify-content: flex-start;
  }
}
</style>
