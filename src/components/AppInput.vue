<script setup lang="ts">
interface Props {
  modelValue: string;
  type?: string;
  placeholder?: string;
  errorMessage?: string;
  isValid?: boolean;
  max?: string;
}

withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: '',
  errorMessage: '',
  isValid: false,
  max: undefined
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
};
</script>

<template>
  <div class="position-relative mb-3">
    <div class="input-wrapper position-relative">
      <input
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :max="max"
        :class="[
          'form-control',
          'custom-input',
          errorMessage ? 'is-invalid' : '',
          isValid ? 'is-valid' : ''
        ]"
        @input="handleInput"
      />
      <i
        v-if="isValid && !errorMessage"
        class="bi bi-check-lg valid-icon text-success position-absolute"
      ></i>
    </div>
    <div v-if="errorMessage" class="text-danger small mt-1">
      {{ errorMessage }}
    </div>
  </div>
</template>

<style scoped>
.custom-input {
  background-color: #fafafa;
  border: 1px solid #e1e1e1;
  border-radius: 4px;
  height: 42px;
  padding: 8px 12px;
  color: #495057;
}

.custom-input:focus {
  background-color: #ffffff;
  border-color: #a8d5e5;
  box-shadow: none;
}

.custom-input.is-invalid {
  border-color: #e3342f;
  background-image: none;
}

.custom-input.is-valid {
  border-color: #38c172;
  background-image: none;
}

.valid-icon {
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.1rem;
}
</style>