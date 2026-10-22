<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import { useSessionStore } from "@/entities/session";
import { AppButton, AppInput } from "@/shared/ui";

const session = useSessionStore();
const route = useRoute();
const router = useRouter();
const toast = useToast();
const isSubmitting = ref(false);
const { handleSubmit, defineField, errors } = useForm({
  validationSchema: toTypedSchema(
    z.object({
      username: z.string().min(1, "Вкажіть логін"),
      password: z.string().min(1, "Вкажіть пароль"),
    }),
  ),
  initialValues: { username: "", password: "" },
});
const [username, usernameAttrs] = defineField("username");
const [password, passwordAttrs] = defineField("password");

const submit = handleSubmit(async (values) => {
  isSubmitting.value = true;
  try {
    await session.login(values.username, values.password);
    toast.add({
      severity: "success",
      summary: "Вхід виконано",
      detail: "Ви успішно увійшли в систему.",
      life: 3000,
    });
    const redirect = route.query.redirect;
    await router.replace(typeof redirect === "string" ? redirect : "/users");
  } catch (cause) {
    toast.add({
      severity: "error",
      summary: "Помилка авторизації",
      detail: cause instanceof Error ? cause.message : "Не вдалося увійти.",
      life: 5000,
    });
  } finally {
    isSubmitting.value = false;
  }
});
</script>

<template>
  <form class="form-stack" @submit.prevent="submit">
    <label for="username">Логін</label>
    <AppInput
      id="username"
      v-model="username"
      v-bind="usernameAttrs"
      autocomplete="username"
      placeholder="Введіть логін"
      :error-message="errors.username"
    />
    <label for="password">Пароль</label>
    <AppInput
      id="password"
      v-model="password"
      v-bind="passwordAttrs"
      type="password"
      autocomplete="current-password"
      placeholder="Введіть пароль"
      :error-message="errors.password"
    />
    <AppButton
      label="Увійти"
      type="submit"
      :loading="isSubmitting"
      severity="primary"
    />
  </form>
</template>

<style scoped>
.form-stack {
  display: grid;
  gap: 0.65rem;
}
</style>
