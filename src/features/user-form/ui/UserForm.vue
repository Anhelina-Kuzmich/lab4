<script setup lang="ts">
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import { AppButton, AppInput } from "@/shared/ui";
import type { CreateUserDto, User } from "@/entities/user";

const props = defineProps<{ user?: User }>();
const emit = defineEmits<{
  saved: [user: CreateUserDto];
  cancel: [];
}>();

const { defineField, errors, handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(
    z.object({
      firstName: z.string().trim().min(1, "Вкажіть ім'я"),
      lastName: z.string().trim().min(1, "Вкажіть прізвище"),
      email: z.string().trim().email("Вкажіть коректну електронну пошту"),
      username: z.string().trim().min(1, "Вкажіть логін"),
      phone: z.string().trim().min(1, "Вкажіть телефон"),
      age: z.string().regex(/^\d{1,3}$/, "Вкажіть вік числом"),
      gender: z.string().min(1, "Оберіть стать"),
    }),
  ),
  initialValues: {
    firstName: props.user?.firstName ?? "",
    lastName: props.user?.lastName ?? "",
    email: props.user?.email ?? "",
    username: props.user?.username ?? "",
    phone: props.user?.phone ?? "",
    age: String(props.user?.age ?? ""),
    gender: props.user?.gender ?? "",
  },
});

const [firstName, firstNameAttrs] = defineField("firstName");
const [lastName, lastNameAttrs] = defineField("lastName");
const [email, emailAttrs] = defineField("email");
const [username, usernameAttrs] = defineField("username");
const [phone, phoneAttrs] = defineField("phone");
const [age, ageAttrs] = defineField("age");
const [gender, genderAttrs] = defineField("gender");

const submit = handleSubmit((values) => {
  emit("saved", {
    ...values,
    age: Number(values.age),
    gender: values.gender,
  });
});
</script>

<template>
  <form class="user-form" @submit.prevent="submit">
    <label for="user-first-name">Ім'я</label>
    <AppInput
      id="user-first-name"
      v-model="firstName"
      v-bind="firstNameAttrs"
      :error-message="errors.firstName"
    />
    <label for="user-last-name">Прізвище</label>
    <AppInput
      id="user-last-name"
      v-model="lastName"
      v-bind="lastNameAttrs"
      :error-message="errors.lastName"
    />
    <label for="user-email">Електронна пошта</label>
    <AppInput
      id="user-email"
      v-model="email"
      v-bind="emailAttrs"
      type="email"
      :error-message="errors.email"
    />
    <label for="user-username">Логін</label>
    <AppInput
      id="user-username"
      v-model="username"
      v-bind="usernameAttrs"
      :error-message="errors.username"
    />
    <label for="user-phone">Телефон</label>
    <AppInput
      id="user-phone"
      v-model="phone"
      v-bind="phoneAttrs"
      type="tel"
      :error-message="errors.phone"
    />
    <label for="user-age">Вік</label>
    <AppInput
      id="user-age"
      v-model="age"
      v-bind="ageAttrs"
      type="number"
      :error-message="errors.age"
    />
    <label for="user-gender">Стать</label>
    <select
      id="user-gender"
      v-model="gender"
      v-bind="genderAttrs"
      class="gender-select"
    >
      <option value="" disabled>Оберіть стать</option>
      <option value="female">Жіноча</option>
      <option value="male">Чоловіча</option>
      <option value="other">Інше</option>
    </select>
    <small v-if="errors.gender" class="field-error">{{ errors.gender }}</small>
    <div class="form-actions">
      <AppButton
        :label="user ? 'Зберегти зміни' : 'Створити користувача'"
        type="submit"
        :loading="isSubmitting"
        severity="primary"
      />
      <AppButton
        label="Скасувати"
        type="button"
        severity="secondary"
        variant="outlined"
        @click="emit('cancel')"
      />
    </div>
  </form>
</template>

<style scoped>
.user-form {
  display: grid;
  gap: 0.55rem;
}

.gender-select {
  min-height: 2.75rem;
  padding: 0.5rem;
  border: 1px solid var(--p-content-border-color);
  border-radius: 6px;
  background: var(--p-content-background);
  color: var(--p-text-color);
}

.field-error {
  color: #dc2626;
}

.form-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 0.5rem;
}
</style>
