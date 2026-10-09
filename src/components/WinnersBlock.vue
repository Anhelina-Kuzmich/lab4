<script setup lang="ts">
import type { Participant } from "../types";
import AppButton from "./AppButton.vue";
import WinnerBadge from "./WinnerBadge.vue";

interface Props {
  winners: Participant[];
  canDrawWinner: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  (e: "draw-winner"): void;
  (e: "remove-winner", id: string): void;
}>();
</script>

<template>
  <div
    class="custom-card mb-4 d-flex align-items-center justify-content-between"
  >
    <div class="winners-container d-flex align-items-center flex-grow-1 me-3">
      <div class="badges-wrapper d-flex flex-wrap gap-2 me-2">
        <WinnerBadge
          v-for="winner in winners"
          :key="winner.id"
          :winner="winner"
          @remove="emit('remove-winner', $event)"
        />
      </div>
      <span v-if="winners.length === 0" class="placeholder-text">
        Winners
      </span>
    </div>
    <AppButton :disabled="!canDrawWinner" @click="emit('draw-winner')">
      New winner
    </AppButton>
  </div>
</template>

<style scoped>
.winners-container {
  border: 1px solid #e1e1e1;
  min-height: 44px;
  padding: 6px 12px;
  border-radius: 4px;
  background-color: #ffffff;
}

.placeholder-text {
  color: #8c8c8c;
  font-size: 15px;
}
</style>
