<script setup lang="ts">
import { watch, ref, nextTick, onUnmounted } from "vue";

interface Props {
  isOpen: boolean;
  title: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const modalContainerRef = ref<HTMLDivElement | null>(null);

const handleGlobalKeyDown = (event: KeyboardEvent) => {
  if (event.key === "Escape" || event.key === "Esc" || event.keyCode === 27) {
    emit("close");
  }
};

watch(
  () => props.isOpen,
  async (open) => {
    if (open) {
      window.addEventListener("keydown", handleGlobalKeyDown, true);
      await nextTick();
      if (modalContainerRef.value) {
        modalContainerRef.value.focus();
      }
    } else {
      window.removeEventListener("keydown", handleGlobalKeyDown, true);
    }
  },
  { immediate: true }
);

onUnmounted(() => {
  window.removeEventListener("keydown", handleGlobalKeyDown, true);
});
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      ref="modalContainerRef"
      class="custom-modal-overlay"
      tabindex="-1"
      @keydown.esc="emit('close')"
      @click.self="emit('close')"
    >
      <div class="custom-modal-container">
        <div class="custom-modal-header">
          <h5 class="custom-modal-title">{{ title }}</h5>
          <button
            type="button"
            class="custom-modal-close"
            aria-label="Close"
            @click="emit('close')"
          >
            &times;
          </button>
        </div>
        <div class="custom-modal-body">
          <slot name="body" />
        </div>
        <div class="custom-modal-footer">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.custom-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
  outline: none;
}

.custom-modal-container {
  background: #ffffff;
  border-radius: 6px;
  width: 100%;
  max-width: 520px;
  margin: 16px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.custom-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #e9ecef;
}

.custom-modal-title {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 600;
  color: #212529;
}

.custom-modal-close {
  background: transparent;
  border: none;
  font-size: 1.6rem;
  line-height: 1;
  color: #6c757d;
  cursor: pointer;
  padding: 0;
}

.custom-modal-close:hover {
  color: #000000;
}

.custom-modal-body {
  padding: 20px;
}

.custom-modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  padding: 14px 20px;
  border-top: 1px solid #e9ecef;
  background-color: #f8f9fa;
}
</style>
