<script setup lang="ts">
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";
import { useForm, useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import Logo from "@/components/Logo.vue";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const serverError = ref<string | null>(null);
const isSubmitting = ref(false);

const validationSchema = toTypedSchema(
  z.object({
    username: z.string().min(1, "Ім'я користувача обов'язкове"),
    password: z.string().min(6, "Мінімальна довжина пароля — 6 символів"),
  })
);

const { handleSubmit } = useForm({
  validationSchema,
});

const { value: username, errorMessage: usernameError } =
  useField<string>("username");
const { value: password, errorMessage: passwordError } =
  useField<string>("password");

const onSubmit = handleSubmit(async (values) => {
  serverError.value = null;
  isSubmitting.value = true;
  try {
    await authStore.login(values.username, values.password);
    const redirect = (route.query.redirect as string) || "/users";
    router.push(redirect);
  } catch (e) {
    serverError.value =
      (e as Error).message || "Помилка авторизації. Перевірте дані.";
  } finally {
    isSubmitting.value = false;
  }
});

const fillEmily = () => {
  username.value = "emilys";
  password.value = "emilyspass";
};
</script>

<template>
  <div
    class="card p-4 shadow-sm border-0"
    style="max-width: 420px; width: 100%"
  >
    <div class="text-center mb-4">
      <Logo class="justify-content-center mb-2" />
      <h4 class="fw-bold">Авторизація</h4>
      <p class="text-muted small">
        Увійдіть для доступу до списку користувачів
      </p>
    </div>

    <div v-if="serverError" class="alert alert-danger py-2 small" role="alert">
      {{ serverError }}
    </div>

    <form @submit.prevent="onSubmit">
      <div class="mb-3">
        <label class="form-label small fw-bold">Username</label>
        <input
          v-model="username"
          type="text"
          class="form-control"
          :class="{ 'is-invalid': usernameError }"
          placeholder="Введіть username"
        />
        <div class="invalid-feedback">{{ usernameError }}</div>
      </div>

      <div class="mb-3">
        <label class="form-label small fw-bold">Password</label>
        <input
          v-model="password"
          type="password"
          class="form-control"
          :class="{ 'is-invalid': passwordError }"
          placeholder="Введіть пароль"
        />
        <div class="invalid-feedback">{{ passwordError }}</div>
      </div>

      <button
        type="submit"
        class="btn btn-primary w-100 mb-3"
        :disabled="isSubmitting"
      >
        <span
          v-if="isSubmitting"
          class="spinner-border spinner-border-sm me-2"
        ></span>
        Увійти
      </button>

      <button
        type="button"
        class="btn btn-outline-secondary btn-sm w-100"
        @click="fillEmily"
      >
        Заповнити тестовими (emilys / emilyspass)
      </button>
    </form>
  </div>
</template>
