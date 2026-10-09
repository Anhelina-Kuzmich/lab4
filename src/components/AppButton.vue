<script setup lang="ts">
interface Props {
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "danger" | "secondary";
  disabled?: boolean;
}

withDefaults(defineProps<Props>(), {
  type: "button",
  variant: "primary",
  disabled: false,
});

const emit = defineEmits<{
  (e: "click", event: MouseEvent): void;
}>();
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="[
      'btn',
      variant === 'primary' ? 'btn-custom' : '',
      variant === 'danger' ? 'btn-danger' : '',
      variant === 'secondary' ? 'btn-secondary' : '',
    ]"
    @click="emit('click', $event)"
  >
    <slot />
  </button>
</template>
