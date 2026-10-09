<script setup lang="ts">
import { ref, computed } from "vue";
import type { Participant } from "../types";
import AppButton from "./AppButton.vue";
import AppInput from "./AppInput.vue";

interface Props {
  participants: Participant[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "submit", participant: Omit<Participant, "id">): void;
}>();

const name = ref("");
const dateOfBirth = ref("");
const email = ref("");
const phone = ref("");

const isSubmitted = ref(false);

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+380\d{9}$/;

const todayDate = computed(() => {
  return new Date().toISOString().split("T")[0];
});

const isEmailUnique = (val: string) => {
  return !props.participants.some(
    (p) => p.email.toLowerCase() === val.trim().toLowerCase()
  );
};

const nameError = computed(() => {
  if (!isSubmitted.value) return "";
  if (!name.value.trim()) return "This value is required.";
  return "";
});

const dateError = computed(() => {
  if (!isSubmitted.value) return "";
  if (!dateOfBirth.value) return "This value is required.";
  if (dateOfBirth.value > todayDate.value)
    return "Date of Birth cannot be in the future.";
  return "";
});

const emailError = computed(() => {
  if (!isSubmitted.value) return "";
  if (!email.value.trim()) return "This value is required.";
  if (!emailRegex.test(email.value.trim())) return "Invalid email format.";
  if (!isEmailUnique(email.value))
    return "Participant with this email already exists.";
  return "";
});

const phoneError = computed(() => {
  if (!isSubmitted.value) return "";
  if (!phone.value.trim()) return "This value is required.";
  if (!phoneRegex.test(phone.value.trim()))
    return "Invalid format. Use +380XXXXXXXXX.";
  return "";
});

const isNameValid = computed(() => isSubmitted.value && !nameError.value);
const isDateValid = computed(() => isSubmitted.value && !dateError.value);
const isEmailValid = computed(() => isSubmitted.value && !emailError.value);
const isPhoneValid = computed(() => isSubmitted.value && !phoneError.value);

const handleSubmit = () => {
  isSubmitted.value = true;

  if (
    nameError.value ||
    dateError.value ||
    emailError.value ||
    phoneError.value
  ) {
    return;
  }

  emit("submit", {
    name: name.value.trim(),
    dateOfBirth: dateOfBirth.value,
    email: email.value.trim(),
    phone: phone.value.trim(),
  });

  name.value = "";
  dateOfBirth.value = "";
  email.value = "";
  phone.value = "";
  isSubmitted.value = false;
};
</script>

<template>
  <div class="custom-card mb-4">
    <div class="form-header mb-4">
      <h5 class="fw-bold mb-1 text-uppercase text-dark tracking-wide">
        Register Form
      </h5>
      <span class="text-secondary small">Please fill in all the fields.</span>
    </div>

    <form @submit.prevent="handleSubmit" @keyup.enter="handleSubmit">
      <div class="mb-3">
        <label class="form-label fw-bold small text-dark mb-1">Name</label>
        <AppInput
          v-model="name"
          placeholder="Enter user name"
          :error-message="nameError"
          :is-valid="isNameValid"
        />
      </div>

      <div class="mb-3">
        <label class="form-label fw-bold small text-dark mb-1"
          >Date of Birth</label
        >
        <AppInput
          v-model="dateOfBirth"
          type="date"
          :max="todayDate"
          :error-message="dateError"
          :is-valid="isDateValid"
        />
      </div>

      <div class="mb-3">
        <label class="form-label fw-bold small text-dark mb-1">Email</label>
        <AppInput
          v-model="email"
          type="email"
          placeholder="Enter email"
          :error-message="emailError"
          :is-valid="isEmailValid"
        />
      </div>

      <div class="mb-4">
        <label class="form-label fw-bold small text-dark mb-1"
          >Phone number</label
        >
        <AppInput
          v-model="phone"
          placeholder="+380XXXXXXXXX"
          :error-message="phoneError"
          :is-valid="isPhoneValid"
        />
      </div>

      <div class="d-flex justify-content-end">
        <AppButton type="submit" class="px-4"> Save </AppButton>
      </div>
    </form>
  </div>
</template>

<style scoped>
.tracking-wide {
  letter-spacing: 0.5px;
}
</style>
