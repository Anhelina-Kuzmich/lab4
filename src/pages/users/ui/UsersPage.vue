<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import { storeToRefs } from "pinia";
import { useUsersStore } from "@/entities/user";
import { UserForm } from "@/features/user-form";
import { AppButton, AppInput } from "@/shared/ui";
import { UsersTable } from "@/widgets/users-table";
import type { CreateUserDto, User } from "@/entities/user";

const pageSize = 10;
const route = useRoute();
const router = useRouter();
const confirm = useConfirm();
const toast = useToast();
const store = useUsersStore();
const { users, total, isLoading } = storeToRefs(store);
const searchInput = ref(typeof route.query.q === "string" ? route.query.q : "");
const showCreateForm = ref(false);

const currentPage = computed(() => {
  const parsed = Number(route.query.page);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
});
const pageCount = computed(() => Math.max(1, Math.ceil(total.value / pageSize)));

watch(
  () => [route.query.page, route.query.q],
  async () => {
    searchInput.value = typeof route.query.q === "string" ? route.query.q : "";
    try {
      await store.fetchUsers({
        limit: pageSize,
        skip: (currentPage.value - 1) * pageSize,
        query: searchInput.value,
      });
    } catch (cause) {
      toast.add({
        severity: "error",
        summary: "Не вдалося завантажити користувачів",
        detail: cause instanceof Error ? cause.message : "Спробуйте ще раз.",
        life: 5000,
      });
    }
  },
  { immediate: true },
);

function applySearch(): void {
  void router.push({
    query: {
      ...route.query,
      q: searchInput.value.trim() || undefined,
      page: undefined,
    },
  });
}

function changePage(page: number): void {
  void router.push({
    query: { ...route.query, page: page === 1 ? undefined : String(page) },
  });
}

async function createUser(data: CreateUserDto): Promise<void> {
  try {
    await store.createUser(data);
    showCreateForm.value = false;
    toast.add({
      severity: "success",
      summary: "Користувача створено",
      life: 3000,
    });
  } catch (cause) {
    toast.add({
      severity: "error",
      summary: "Не вдалося створити користувача",
      detail: cause instanceof Error ? cause.message : "Спробуйте ще раз.",
      life: 5000,
    });
  }
}

function requestDelete(user: User): void {
  confirm.require({
    message: `Видалити користувача ${user.firstName} ${user.lastName}?`,
    header: "Підтвердження видалення",
    icon: "pi pi-exclamation-triangle",
    acceptLabel: "Видалити",
    rejectLabel: "Скасувати",
    accept: async () => {
      try {
        await store.removeUser(user.id);
        toast.add({
          severity: "success",
          summary: "Користувача видалено",
          life: 3000,
        });
      } catch (cause) {
        toast.add({
          severity: "error",
          summary: "Не вдалося видалити користувача",
          detail: cause instanceof Error ? cause.message : "Спробуйте ще раз.",
          life: 5000,
        });
      }
    },
  });
}
</script>

<template>
  <section class="users-page">
    <header class="page-heading">
      <div>
        <h1>Користувачі</h1>
        <p>Знайдено: {{ total }}</p>
      </div>
      <AppButton
        :label="showCreateForm ? 'Закрити форму' : 'Додати користувача'"
        icon="pi pi-plus"
        severity="primary"
        @click="showCreateForm = !showCreateForm"
      />
    </header>

    <form class="search-form" @submit.prevent="applySearch">
      <AppInput
        v-model="searchInput"
        aria-label="Пошук користувачів"
        placeholder="Пошук за ім'ям, поштою або логіном"
      />
      <AppButton label="Шукати" type="submit" severity="secondary" />
    </form>

    <section v-if="showCreateForm" class="create-panel card">
      <h2>Новий користувач</h2>
      <UserForm @saved="createUser" @cancel="showCreateForm = false" />
    </section>

    <UsersTable :users="users" :loading="isLoading" @remove="requestDelete" />

    <nav v-if="pageCount > 1" class="pagination" aria-label="Пагінація">
      <AppButton
        label="Назад"
        severity="secondary"
        variant="outlined"
        :disabled="currentPage <= 1 || isLoading"
        @click="changePage(currentPage - 1)"
      />
      <span>Сторінка {{ currentPage }} з {{ pageCount }}</span>
      <AppButton
        label="Далі"
        severity="secondary"
        variant="outlined"
        :disabled="currentPage >= pageCount || isLoading"
        @click="changePage(currentPage + 1)"
      />
    </nav>
  </section>
</template>

<style scoped>
.users-page {
  display: grid;
  gap: 1.25rem;
}

.page-heading {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

h1,
h2,
.page-heading p {
  margin: 0;
}

.page-heading p {
  margin-top: 0.3rem;
  color: var(--p-text-muted-color);
}

.search-form {
  display: flex;
  gap: 0.75rem;
}

.search-form :deep(.app-input-wrapper) {
  flex: 1;
}

.create-panel {
  padding: 1.25rem;
}

.create-panel h2 {
  margin: 0 0 1rem;
}

.pagination {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

@media (max-width: 540px) {
  .search-form {
    flex-direction: column;
  }
}
</style>
