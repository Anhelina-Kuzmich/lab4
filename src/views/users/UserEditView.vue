<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ServiceProvider } from "@/services/service-provider";
import { useUserStore } from "@/stores/user.store";
import { useForm, useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";

const props = defineProps<{
  id: string;
}>();

const router = useRouter();
const userStore = useUserStore();
const isLoading = ref(true);
const isSaving = ref(false);
const error = ref<string | null>(null);

const editSchema = toTypedSchema(
  z.object({
    firstName: z.string().min(1, "Ім'я обов'язкове"),
    lastName: z.string().min(1, "Прізвище обов'язкове"),
    email: z.string().email("Некоректний email"),
    username: z.string().min(3, "Username мінімум 3 символи"),
    age: z.coerce.number().min(1, "Вік повинен бути більше 0"),
    gender: z.string().min(1, "Оберіть стать"),
    phone: z.string().regex(/^\+380\d{9}$/, "Формат: +380XXXXXXXXX"),
  })
);

const { handleSubmit, setValues } = useForm({
  validationSchema: editSchema,
});

const { value: firstName, errorMessage: firstNameError } =
  useField<string>("firstName");
const { value: lastName, errorMessage: lastNameError } =
  useField<string>("lastName");
const { value: email, errorMessage: emailError } = useField<string>("email");
const { value: username, errorMessage: usernameError } =
  useField<string>("username");
const { value: age, errorMessage: ageError } = useField<number>("age");
const { value: gender, errorMessage: genderError } = useField<string>("gender");
const { value: phone, errorMessage: phoneError } = useField<string>("phone");

onMounted(async () => {
  try {
    const data = await ServiceProvider.users.getById(Number(props.id));
    setValues({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      username: data.username,
      age: data.age,
      gender: data.gender,
      phone: data.phone,
    });
  } catch (e) {
    error.value = (e as Error).message;
  } finally {
    isLoading.value = false;
  }
});

const onSave = handleSubmit(async (values) => {
  isSaving.value = true;
  error.value = null;
  try {
    await userStore.editUser(Number(props.id), {
      ...values,
      age: Number(values.age),
    });
    router.push(`/users/${props.id}`);
  } catch (e) {
    error.value = (e as Error).message;
  } finally {
    isSaving.value = false;
  }
});
</script>

<template>
  <div
    class="card p-4 mx-auto mt-4 shadow-sm border-0"
    style="max-width: 650px"
  >
    <h4 class="fw-bold mb-3">Редагування користувача #{{ id }}</h4>

    <div v-if="isLoading" class="text-center py-4">
      <div class="spinner-border text-info" role="status"></div>
    </div>

    <div v-else-if="error" class="alert alert-danger">{{ error }}</div>

    <form v-else @submit.prevent="onSave">
      <div class="row g-2 mb-3">
        <div class="col-6">
          <label class="form-label small fw-bold">First Name</label>
          <input
            v-model="firstName"
            class="form-control"
            :class="{ 'is-invalid': firstNameError }"
          />
          <div class="invalid-feedback">{{ firstNameError }}</div>
        </div>
        <div class="col-6">
          <label class="form-label small fw-bold">Last Name</label>
          <input
            v-model="lastName"
            class="form-control"
            :class="{ 'is-invalid': lastNameError }"
          />
          <div class="invalid-feedback">{{ lastNameError }}</div>
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label small fw-bold">Email</label>
        <input
          v-model="email"
          class="form-control"
          :class="{ 'is-invalid': emailError }"
        />
        <div class="invalid-feedback">{{ emailError }}</div>
      </div>

      <div class="mb-3">
        <label class="form-label small fw-bold">Username</label>
        <input
          v-model="username"
          class="form-control"
          :class="{ 'is-invalid': usernameError }"
        />
        <div class="invalid-feedback">{{ usernameError }}</div>
      </div>

      <div class="row g-2 mb-3">
        <div class="col-4">
          <label class="form-label small fw-bold">Age</label>
          <input
            v-model="age"
            type="number"
            class="form-control"
            :class="{ 'is-invalid': ageError }"
          />
          <div class="invalid-feedback">{{ ageError }}</div>
        </div>
        <div class="col-8">
          <label class="form-label small fw-bold">Gender</label>
          <select
            v-model="gender"
            class="form-select"
            :class="{ 'is-invalid': genderError }"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <div class="invalid-feedback">{{ genderError }}</div>
        </div>
      </div>

      <div class="mb-4">
        <label class="form-label small fw-bold">Phone</label>
        <input
          v-model="phone"
          class="form-control"
          :class="{ 'is-invalid': phoneError }"
        />
        <div class="invalid-feedback">{{ phoneError }}</div>
      </div>

      <div class="d-flex justify-content-end gap-2">
        <button type="button" class="btn btn-secondary" @click="router.back()">
          Скасувати
        </button>
        <button type="submit" class="btn btn-primary" :disabled="isSaving">
          <span
            v-if="isSaving"
            class="spinner-border spinner-border-sm me-1"
          ></span>
          Зберегти зміни
        </button>
      </div>
    </form>
  </div>
</template>
