<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";

interface Props {
  isOpen: boolean;
  title: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const handleKeyDown = (event: KeyboardEvent) => {
  if (props.isOpen && event.key === "Escape") {
    emit("close");
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyDown);
});
</script>

<template>
  <Teleport to="body">
    <div v-if="isOpen" class="custom-modal-overlay" @click.self="emit('close')">
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
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
}

.custom-modal-container {
  background: #ffffff;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
  margin: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: modal-appear 0.2s ease-out;
}

@keyframes modal-appear {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.custom-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #dee2e6;
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
  font-size: 1.5rem;
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
  border-top: 1px solid #dee2e6;
  background-color: #f8f9fa;
}
</style>
