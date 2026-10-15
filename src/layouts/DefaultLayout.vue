<script setup lang="ts">
import AppHeader from "@/components/AppHeader.vue";
</script>

<template>
  <div class="default-layout d-flex flex-column min-vh-100 bg-light">
    <AppHeader />
    <main class="flex-grow-1 py-4">
      <div class="container" style="max-width: 900px">
        <slot />
      </div>
    </main>
    <footer class="bg-white border-top py-3 text-center text-muted small">
      vue-lottery-app &copy; 2026. ЧНУ.
    </footer>
  </div>
</template>

