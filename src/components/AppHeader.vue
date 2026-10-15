<script setup lang="ts">
import Logo from "./Logo.vue";
import AppNavigation from "./AppNavigation.vue";
</script>

<template>
  <header class="header bg-white border-bottom shadow-sm">
    <div
      class="container py-3 d-flex align-items-center justify-content-between"
    >
      <Logo />
      <AppNavigation />
    </div>
  </header>
</template>
