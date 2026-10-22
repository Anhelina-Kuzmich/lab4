<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useToast } from "primevue/usetoast";
import { storeToRefs } from "pinia";
import { useUsersStore } from "@/entities/user";
import { UserForm } from "@/features/user-form";
import { AppButton } from "@/shared/ui";
import type { CreateUserDto } from "@/entities/user";

const props = defineProps<{ id: string }>();
const store = useUsersStore();
const { users, isLoading } = storeToRefs(store);
const toast = useToast();
const editing = ref(false);
const loadError = ref<string | null>(null);
const user = computed(() => users.value.find((item) => item.id === Number(props.id)));

watch(
  () => props.id,
  async (id) => {
    loadError.value = null;
    try {
      await store.fetchUser(Number(id));
    } catch (cause) {
      loadError.value =
        cause instanceof Error ? cause.message : "Не вдалося завантажити дані.";
    }
  },
  { immediate: true },
);

async function saveUser(data: CreateUserDto): Promise<void> {
  try {
    await store.updateUser(Number(props.id), data);
    editing.value = false;
    toast.add({
      severity: "success",
      summary: "Дані користувача оновлено",
      life: 3000,
    });
  } catch (cause) {
    toast.add({
      severity: "error",
      summary: "Не вдалося оновити користувача",
      detail: cause instanceof Error ? cause.message : "Спробуйте ще раз.",
      life: 5000,
    });
  }
}
</script>

<template>
  <section class="details-page">
    <RouterLink to="/users" class="back-link">← До користувачів</RouterLink>
    <p v-if="isLoading && !user" role="status">Завантаження...</p>
    <p v-else-if="loadError" class="error-message" role="alert">
      {{ loadError }}
    </p>
    <template v-else-if="user">
      <header class="page-heading">
        <h1>{{ user.firstName }} {{ user.lastName }}</h1>
        <AppButton
          :label="editing ? 'Скасувати редагування' : 'Редагувати'"
          :icon="editing ? 'pi pi-times' : 'pi pi-pencil'"
          severity="secondary"
          variant="outlined"
          @click="editing = !editing"
        />
      </header>
      <UserForm
        v-if="editing"
        :user="user"
        @saved="saveUser"
        @cancel="editing = false"
      />
      <dl v-else class="user-details card">
        <div><dt>Електронна пошта</dt><dd>{{ user.email }}</dd></div>
        <div><dt>Телефон</dt><dd>{{ user.phone }}</dd></div>
        <div><dt>Логін</dt><dd>{{ user.username }}</dd></div>
        <div><dt>Вік</dt><dd>{{ user.age }}</dd></div>
        <div><dt>Стать</dt><dd>{{ user.gender }}</dd></div>
      </dl>
    </template>
    <p v-else>Користувача не знайдено.</p>
  </section>
</template>

<style scoped>
.details-page {
  display: grid;
  gap: 1rem;
}

.back-link {
  width: fit-content;
  color: var(--p-primary-color);
}

.page-heading {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.page-heading h1 {
  margin: 0;
}

.user-details {
  display: grid;
  gap: 0;
  margin: 0;
  padding: 0 1rem;
}

.user-details div {
  display: grid;
  grid-template-columns: minmax(9rem, 1fr) 2fr;
  gap: 1rem;
  padding: 0.9rem 0;
  border-bottom: 1px solid var(--p-content-border-color);
}

.user-details div:last-child {
  border-bottom: 0;
}

.user-details dt {
  color: var(--p-text-muted-color);
}

.user-details dd {
  margin: 0;
  overflow-wrap: anywhere;
}

.error-message {
  color: #dc2626;
}

@media (max-width: 480px) {
  .user-details div {
    grid-template-columns: 1fr;
    gap: 0.25rem;
  }
}
</style>
