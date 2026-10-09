<script setup lang="ts">
import { ref, watch } from "vue";

const emit = defineEmits<{
  (e: "filter-by-name", value: string): void;
}>();

const searchTerm = ref("");
let timer: ReturnType<typeof setTimeout> | null = null;

watch(searchTerm, (newValue) => {
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    emit("filter-by-name", newValue);
  }, 300);
});
</script>

<template>
  <div class="position-relative">
    <input
      v-model="searchTerm"
      type="text"
      class="form-control custom-search-input"
      placeholder="Пошук за іменем..."
    />
  </div>
</template>

<style scoped>
.custom-search-input {
  background-color: #fafafa;
  border: 1px solid #e1e1e1;
  border-radius: 4px;
  height: 38px;
}
</style>
