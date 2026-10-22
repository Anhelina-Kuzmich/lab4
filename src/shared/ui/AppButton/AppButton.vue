<script setup lang="ts">
import Button from "primevue/button";

interface Props {
  label?: string;
  icon?: string;
  loading?: boolean;
  disabled?: boolean;
  severity?:
    | "primary"
    | "secondary"
    | "success"
    | "info"
    | "warn"
    | "help"
    | "danger"
    | "contrast";
  variant?: "outlined" | "text" | "link";
  size?: "small" | "large";
  type?: "button" | "submit" | "reset";
  ariaLabel?: string;
}

withDefaults(defineProps<Props>(), {
  label: "",
  icon: undefined,
  loading: false,
  disabled: false,
  severity: undefined,
  variant: undefined,
  size: undefined,
  type: "button",
  ariaLabel: undefined,
});

defineEmits<{
  (e: "click", event: MouseEvent): void;
}>();
</script>

<template>
  <Button
    :type="type"
    :aria-label="ariaLabel"
    :label="label"
    :icon="icon"
    :loading="loading"
    :disabled="disabled"
    :severity="severity"
    :variant="variant"
    :size="size"
    @click="$emit('click', $event)"
  >
    <slot />
  </Button>
</template>
