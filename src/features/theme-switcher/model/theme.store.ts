import { ref } from "vue";
import { defineStore } from "pinia";

export const useThemeStore = defineStore(
  "theme",
  () => {
    const isDark = ref(false);

    function applyTheme(): void {
      document.documentElement.classList.toggle("my-app-dark", isDark.value);
    }

    function toggleTheme(): void {
      isDark.value = !isDark.value;
      applyTheme();
    }

    return { isDark, applyTheme, toggleTheme };
  },
  { persist: true },
);
