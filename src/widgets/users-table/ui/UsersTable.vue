<script setup lang="ts">
import { AppButton, AppTable } from "@/shared/ui";
import type { User } from "@/entities/user";

defineProps<{
  users: User[];
  loading: boolean;
}>();

const columns = [
  { field: "firstName", header: "Ім'я" },
  { field: "lastName", header: "Прізвище" },
  { field: "email", header: "Електронна пошта" },
  { field: "username", header: "Логін" },
] as const;

defineEmits<{ remove: [user: User] }>();
</script>

<template>
  <AppTable :rows="users" :columns="columns" :loading="loading">
    <template #actions="{ row }">
      <div class="row-actions">
        <RouterLink :to="{ name: 'user-details', params: { id: row.id } }">
          Деталі
        </RouterLink>
        <AppButton
          label="Видалити"
          icon="pi pi-trash"
          severity="danger"
          size="small"
          @click="$emit('remove', row)"
        />
      </div>
    </template>
  </AppTable>
</template>

<style scoped>
.row-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.row-actions a {
  color: var(--p-primary-color);
}
</style>
