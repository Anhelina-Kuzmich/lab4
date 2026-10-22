<script setup lang="ts">
import InputText from "primevue/inputtext";

defineOptions({ inheritAttrs: false });

interface Props {
  modelValue: string | number;
  type?: string;
  placeholder?: string;
  errorMessage?: string;
  disabled?: boolean;
}

withDefaults(defineProps<Props>(), {
  type: "text",
  placeholder: "",
  errorMessage: "",
  disabled: false,
});

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit("update:modelValue", target.value);
};
</script>

<template>
  <div class="app-input-wrapper w-full">
    <InputText
      :type="type"
      :value="modelValue"
      v-bind="$attrs"
      :placeholder="placeholder"
      :disabled="disabled"
      :invalid="Boolean(errorMessage)"
      class="w-full"
      @input="onInput"
    />
    <small v-if="errorMessage" class="text-danger p-error block mt-1">
      {{ errorMessage }}
    </small>
  </div>
</template>

<style scoped>
.app-input-wrapper {
  display: flex;
  flex-direction: column;
}
.text-danger {
  color: #e24c4c;
  font-size: 0.8rem;
}
.w-full {
  width: 100%;
}
</style>
