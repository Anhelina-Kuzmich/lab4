<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useThemeStore } from "../model/theme.store";
import { AppButton } from "@/shared/ui";

const themeStore = useThemeStore();
const { isDark } = storeToRefs(themeStore);
</script>

<template>
  <AppButton
    :icon="isDark ? 'pi pi-sun' : 'pi pi-moon'"
    :aria-label="isDark ? 'Увімкнути світлу тему' : 'Увімкнути темну тему'"
    severity="secondary"
    variant="text"
    @click="themeStore.toggleTheme"
  />
</template>
