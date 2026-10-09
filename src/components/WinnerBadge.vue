<script setup lang="ts">
import type { Participant } from "../types";

defineProps<{
  winner: Participant;
}>();

const emit = defineEmits<{
  (e: "remove", id: string): void;
}>();
</script>

<template>
  <span class="winner-badge d-inline-flex align-items-center">
    <span>{{ winner.name }}</span>
    <button
      type="button"
      class="btn-badge-close"
      @click="emit('remove', winner.id)"
    >
      &times;
    </button>
  </span>
</template>

<style scoped>
.winner-badge {
  background-color: #38a9d1;
  color: #ffffff;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  gap: 6px;
}

.btn-badge-close {
  background: transparent;
  border: none;
  color: #ffffff;
  padding: 0;
  font-size: 14px;
  line-height: 1;
  cursor: pointer;
  opacity: 0.8;
}

.btn-badge-close:hover {
  opacity: 1;
}
</style>
