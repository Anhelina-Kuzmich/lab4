<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "@/stores/user.store";
import type { User, CreateUserDto } from "@/types/user";
import AppModal from "@/components/AppModal.vue";
import AppButton from "@/components/AppButton.vue";
import WinnersBlock from "@/components/WinnersBlock.vue";
import type { Participant } from "@/types";
import { useForm, useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const limit = 10;
const page = computed(() => Number(route.query.page) || 1);
const searchQuery = computed(() => (route.query.q as string) || "");
const localSearch = ref(searchQuery.value);

let searchTimeout: ReturnType<typeof setTimeout> | null = null;
watch(localSearch, (newVal) => {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    updateQueryParams({ q: newVal || undefined, page: 1 });
  }, 300);
});

function updateQueryParams(params: { page?: number; q?: string }) {
  const query = { ...route.query, ...params };
  if (!query.q) delete query.q;
  if (query.page === 1) delete query.page;
  router.push({ query });
}

const loadData = () => {
  const skip = (page.value - 1) * limit;
  userStore.fetchUsers({
    limit,
    skip,
    query: searchQuery.value,
  });
};

onMounted(() => {
  loadData();
});

watch([page, searchQuery], () => {
  loadData();
});

const totalPages = computed(() => Math.ceil(userStore.total / limit) || 1);

// Лотерея серед користувачів
const winnerIds = ref<number[]>([]);
const winners = computed<Participant[]>(() => {
  return winnerIds.value
    .map((id) => userStore.users.find((u) => u.id === id))
    .filter((u): u is User => Boolean(u))
    .map((u) => ({
      id: String(u.id),
      name: `${u.firstName} ${u.lastName}`,
      dateOfBirth: u.birthDate || "",
      email: u.email,
      phone: u.phone,
    }));
});

const canDrawWinner = computed(() => {
  if (winners.value.length >= 3) return false;
  const available = userStore.users.filter(
    (u) => !winnerIds.value.includes(u.id)
  );
  return available.length > 0;
});

const handleDrawWinner = () => {
  const available = userStore.users.filter(
    (u) => !winnerIds.value.includes(u.id)
  );
  if (available.length === 0) return;
  const rand = Math.floor(Math.random() * available.length);
  winnerIds.value.push(available[rand].id);
};

const handleRemoveWinner = (id: string) => {
  winnerIds.value = winnerIds.value.filter((wId) => String(wId) !== id);
};

// Створення користувача
const isCreateModalOpen = ref(false);

const createSchema = toTypedSchema(
  z.object({
    firstName: z.string().min(1, "Ім'я обов'язкове"),
    lastName: z.string().min(1, "Прізвище обов'язкове"),
    email: z.string().email("Некоректний email"),
    username: z.string().min(3, "Username мінімум 3 символи"),
    password: z.string().min(6, "Пароль мінімум 6 символів"),
    age: z.coerce.number().min(1, "Вік повинен бути більше 0"),
    gender: z.string().min(1, "Оберіть стать"),
    phone: z.string().regex(/^\+380\d{9}$/, "Формат: +380XXXXXXXXX"),
  })
);

const { handleSubmit: handleCreateSubmit, resetForm: resetCreateForm } =
  useForm({
    validationSchema: createSchema,
    initialValues: {
      gender: "female",
    },
  });

const { value: cFirstName, errorMessage: cFirstNameError } =
  useField<string>("firstName");
const { value: cLastName, errorMessage: cLastNameError } =
  useField<string>("lastName");
const { value: cEmail, errorMessage: cEmailError } = useField<string>("email");
const { value: cUsername, errorMessage: cUsernameError } =
  useField<string>("username");
const { value: cPassword, errorMessage: cPasswordError } =
  useField<string>("password");
const { value: cAge, errorMessage: cAgeError } = useField<number>("age");
const { value: cGender, errorMessage: cGenderError } =
  useField<string>("gender");
const { value: cPhone, errorMessage: cPhoneError } = useField<string>("phone");

const openCreateModal = () => {
  resetCreateForm();
  isCreateModalOpen.value = true;
};

const onSaveNewUser = handleCreateSubmit(async (values) => {
  const dto: CreateUserDto = {
    ...values,
    age: Number(values.age),
  };
  await userStore.addUser(dto);
  isCreateModalOpen.value = false;
});

// Видалення
const isDeleteModalOpen = ref(false);
const deletingUser = ref<User | null>(null);

const openDeleteModal = (u: User) => {
  deletingUser.value = u;
  isDeleteModalOpen.value = true;
};

const confirmDelete = async () => {
  if (!deletingUser.value) return;
  const id = deletingUser.value.id;
  await userStore.removeUser(id);
  winnerIds.value = winnerIds.value.filter((wId) => wId !== id);
  isDeleteModalOpen.value = false;
};
</script>

<template>
  <div>
    <WinnersBlock
      :winners="winners"
      :can-draw-winner="canDrawWinner"
      @draw-winner="handleDrawWinner"
      @remove-winner="handleRemoveWinner"
    />

    <div
      class="card p-3 mb-4 shadow-sm border-0 d-flex flex-wrap justify-content-between align-items-center gap-3"
    >
      <div class="flex-grow-1" style="max-width: 350px">
        <input
          v-model="localSearch"
          type="text"
          class="form-control"
          placeholder="Пошук за ім'ям..."
        />
      </div>
      <AppButton @click="openCreateModal">
        <i class="bi bi-person-plus me-1"></i>Додати користувача
      </AppButton>
    </div>

    <div v-if="userStore.isLoading" class="text-center py-5">
      <div class="spinner-border text-info" role="status"></div>
      <p class="text-muted mt-2">Завантаження...</p>
    </div>

    <div v-else-if="userStore.error" class="alert alert-danger">
      {{ userStore.error }}
    </div>

    <div v-else class="card p-4 shadow-sm border-0">
      <div class="table-responsive">
        <table class="table align-middle">
          <thead>
            <tr>
              <th>#</th>
              <th>Фото</th>
              <th>Ім'я</th>
              <th>Username</th>
              <th>Email</th>
              <th>Телефон</th>
              <th>Вік</th>
              <th class="text-end">Дії</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="userStore.users.length === 0">
              <td colspan="8" class="text-center py-4 text-muted">
                Користувачів не знайдено
              </td>
            </tr>
            <tr v-for="(u, idx) in userStore.users" :key="u.id">
              <td>{{ (page - 1) * limit + idx + 1 }}</td>
              <td>
                <img
                  :src="u.image || 'https://dummyjson.com/icon/user/40'"
                  alt="avatar"
                  width="36"
                  height="36"
                  class="rounded-circle border"
                />
              </td>
              <td>
                <RouterLink
                  :to="`/users/${u.id}`"
                  class="fw-bold text-decoration-none text-dark"
                >
                  {{ u.firstName }} {{ u.lastName }}
                </RouterLink>
              </td>
              <td>
                <code>@{{ u.username }}</code>
              </td>
              <td>{{ u.email }}</td>
              <td>{{ u.phone }}</td>
              <td>{{ u.age }}</td>
              <td class="text-end">
                <RouterLink
                  :to="`/users/${u.id}`"
                  class="btn btn-sm btn-outline-info me-1"
                  title="Деталі"
                >
                  <i class="bi bi-eye"></i>
                </RouterLink>
                <RouterLink
                  :to="`/users/${u.id}/edit`"
                  class="btn btn-sm btn-outline-secondary me-1"
                  title="Редагувати"
                >
                  <i class="bi bi-pencil"></i>
                </RouterLink>
                <button
                  class="btn btn-sm btn-outline-danger"
                  title="Видалити"
                  @click="openDeleteModal(u)"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        class="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2"
      >
        <div class="text-muted small">
          Усього: <strong>{{ userStore.total }}</strong> користувачів (Сторінка
          {{ page }} з {{ totalPages }})
        </div>
        <div class="btn-group">
          <button
            class="btn btn-outline-secondary btn-sm"
            :disabled="page <= 1"
            @click="updateQueryParams({ page: page - 1 })"
          >
            &laquo; Попередня
          </button>
          <button
            class="btn btn-outline-secondary btn-sm"
            :disabled="page >= totalPages"
            @click="updateQueryParams({ page: page + 1 })"
          >
            Наступна &raquo;
          </button>
        </div>
      </div>
    </div>

    <!-- Модалка створення -->
    <AppModal
      :is-open="isCreateModalOpen"
      title="Створення нового користувача"
      @close="isCreateModalOpen = false"
    >
      <template #body>
        <form @submit.prevent="onSaveNewUser">
          <div class="row g-2 mb-2">
            <div class="col-6">
              <label class="form-label small fw-bold">First Name</label>
              <input
                v-model="cFirstName"
                class="form-control form-control-sm"
                :class="{ 'is-invalid': cFirstNameError }"
              />
              <div class="invalid-feedback">{{ cFirstNameError }}</div>
            </div>
            <div class="col-6">
              <label class="form-label small fw-bold">Last Name</label>
              <input
                v-model="cLastName"
                class="form-control form-control-sm"
                :class="{ 'is-invalid': cLastNameError }"
              />
              <div class="invalid-feedback">{{ cLastNameError }}</div>
            </div>
          </div>

          <div class="mb-2">
            <label class="form-label small fw-bold">Email</label>
            <input
              v-model="cEmail"
              class="form-control form-control-sm"
              :class="{ 'is-invalid': cEmailError }"
            />
            <div class="invalid-feedback">{{ cEmailError }}</div>
          </div>

          <div class="row g-2 mb-2">
            <div class="col-6">
              <label class="form-label small fw-bold">Username</label>
              <input
                v-model="cUsername"
                class="form-control form-control-sm"
                :class="{ 'is-invalid': cUsernameError }"
              />
              <div class="invalid-feedback">{{ cUsernameError }}</div>
            </div>
            <div class="col-6">
              <label class="form-label small fw-bold">Password</label>
              <input
                v-model="cPassword"
                type="password"
                class="form-control form-control-sm"
                :class="{ 'is-invalid': cPasswordError }"
              />
              <div class="invalid-feedback">{{ cPasswordError }}</div>
            </div>
          </div>

          <div class="row g-2 mb-2">
            <div class="col-4">
              <label class="form-label small fw-bold">Age</label>
              <input
                v-model="cAge"
                type="number"
                class="form-control form-control-sm"
                :class="{ 'is-invalid': cAgeError }"
              />
              <div class="invalid-feedback">{{ cAgeError }}</div>
            </div>
            <div class="col-8">
              <label class="form-label small fw-bold">Gender</label>
              <select
                v-model="cGender"
                class="form-select form-select-sm"
                :class="{ 'is-invalid': cGenderError }"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <div class="invalid-feedback">{{ cGenderError }}</div>
            </div>
          </div>

          <div class="mb-2">
            <label class="form-label small fw-bold"
              >Phone (+380XXXXXXXXX)</label
            >
            <input
              v-model="cPhone"
              class="form-control form-control-sm"
              :class="{ 'is-invalid': cPhoneError }"
            />
            <div class="invalid-feedback">{{ cPhoneError }}</div>
          </div>
        </form>
      </template>
      <template #footer>
        <button
          class="btn btn-secondary btn-sm"
          @click="isCreateModalOpen = false"
        >
          Скасувати
        </button>
        <button class="btn btn-primary btn-sm" @click="onSaveNewUser">
          Зберегти
        </button>
      </template>
    </AppModal>

    <!-- Модалка видалення -->
    <AppModal
      :is-open="isDeleteModalOpen"
      title="Підтвердження видалення"
      @close="isDeleteModalOpen = false"
    >
      <template #body>
        <p v-if="deletingUser" class="mb-0">
          Ви дійсно бажаєте видалити користувача
          <strong
            >{{ deletingUser.firstName }} {{ deletingUser.lastName }}</strong
          >
          ({{ deletingUser.email }})?
        </p>
      </template>
      <template #footer>
        <button
          class="btn btn-secondary btn-sm"
          @click="isDeleteModalOpen = false"
        >
          Ні
        </button>
        <button class="btn btn-danger btn-sm" @click="confirmDelete">
          Так, видалити
        </button>
      </template>
    </AppModal>
  </div>
</template>
