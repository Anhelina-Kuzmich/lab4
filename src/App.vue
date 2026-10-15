<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import AuthLayout from "@/layouts/AuthLayout.vue";

const route = useRoute();

const layouts: Record<string, any> = {
  DefaultLayout,
  AuthLayout,
};

const currentLayout = computed(() => {
  const layoutName = (route.meta.layout as string) || "DefaultLayout";
  return layouts[layoutName] || DefaultLayout;
});
</script>

<template>
  <component :is="currentLayout">
    <RouterView />
  </component>
</template>
