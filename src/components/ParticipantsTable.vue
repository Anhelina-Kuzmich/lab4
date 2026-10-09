<script setup lang="ts">
import type { Participant, SortField, SortOrder } from "../types";
import AppButton from "./AppButton.vue";

interface Props {
  participants: Participant[];
  sortField: SortField | null;
  sortOrder: SortOrder;
}

defineProps<Props>();

const emit = defineEmits<{
  (e: "sort", field: SortField): void;
  (e: "edit", participant: Participant): void;
  (e: "delete", participant: Participant): void;
}>();

const formatDate = (dateStr: string) => {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
};
</script>

<template>
  <div class="custom-card">
    <div class="table-responsive">
      <table class="table align-middle custom-table mb-0">
        <thead>
          <tr>
            <th scope="col" class="text-secondary fw-bold">#</th>
            <th
              scope="col"
              class="cursor-pointer sortable-th"
              @click="emit('sort', 'name')"
            >
              Name
              <i
                v-if="sortField === 'name'"
                :class="
                  sortOrder === 'asc'
                    ? 'bi bi-sort-alpha-down'
                    : 'bi bi-sort-alpha-up-alt'
                "
                class="ms-1"
              ></i>
            </th>
            <th
              scope="col"
              class="cursor-pointer sortable-th"
              @click="emit('sort', 'dateOfBirth')"
            >
              Date of Birth
              <i
                v-if="sortField === 'dateOfBirth'"
                :class="
                  sortOrder === 'asc'
                    ? 'bi bi-sort-numeric-down'
                    : 'bi bi-sort-numeric-up-alt'
                "
                class="ms-1"
              ></i>
            </th>
            <th scope="col">Email</th>
            <th scope="col">Phone number</th>
            <th scope="col" class="text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="participants.length === 0">
            <td colspan="6" class="text-center py-4 text-muted">
              Немає зареєстрованих учасників
            </td>
          </tr>
          <tr
            v-for="(participant, index) in participants"
            :key="participant.id"
          >
            <td class="text-muted">{{ index + 1 }}</td>
            <td>{{ participant.name }}</td>
            <td>{{ formatDate(participant.dateOfBirth) }}</td>
            <td>{{ participant.email }}</td>
            <td>{{ participant.phone }}</td>
            <td class="text-end">
              <AppButton
                variant="secondary"
                class="btn-sm me-2"
                @click="emit('edit', participant)"
              >
                Редагувати дані
              </AppButton>
              <AppButton
                variant="danger"
                class="btn-sm"
                @click="emit('delete', participant)"
              >
                Видалити учасника
              </AppButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.custom-table th {
  border-top: none;
  font-weight: 600;
  color: #333333;
  padding: 12px 14px;
}

.custom-table td {
  padding: 14px;
  color: #555555;
}

.sortable-th {
  user-select: none;
}

.cursor-pointer {
  cursor: pointer;
}
</style>
