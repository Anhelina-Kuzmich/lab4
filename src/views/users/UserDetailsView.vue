<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ServiceProvider } from "@/services/service-provider";
import type { User } from "@/types/user";

const props = defineProps<{
  id: string;
}>();

const router = useRouter();
const user = ref<User | null>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);

onMounted(async () => {
  try {
    user.value = await ServiceProvider.users.getById(Number(props.id));
  } catch (e) {
    error.value = (e as Error).message;
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="card p-4 mx-auto shadow-sm border-0" style="max-width: 650px">
    <button
      class="btn btn-outline-secondary btn-sm mb-3"
      @click="router.back()"
    >
      &larr; Назад до списку
    </button>

    <div v-if="isLoading" class="text-center py-4">
      <div class="spinner-border text-info" role="status"></div>
    </div>

    <div v-else-if="error" class="alert alert-danger">
      Помилка завантаження даних: {{ error }}
    </div>

    <div v-else-if="user">
      <div class="d-flex align-items-center gap-3 mb-4">
        <img
          :src="user.image || 'https://dummyjson.com/icon/user/80'"
          alt="Avatar"
          class="rounded-circle border"
          width="80"
          height="80"
        />
        <div>
          <h3 class="mb-0 fw-bold">{{ user.firstName }} {{ user.lastName }}</h3>
          <span class="text-muted"
            >@{{ user.username }} &bull; {{ user.role || "User" }}</span
          >
        </div>
      </div>

      <div class="row g-3">
        <div class="col-6">
          <strong>Email:</strong>
          <div>{{ user.email }}</div>
        </div>
        <div class="col-6">
          <strong>Телефон:</strong>
          <div>{{ user.phone }}</div>
        </div>
        <div class="col-6">
          <strong>Вік:</strong>
          <div>{{ user.age }}</div>
        </div>
        <div class="col-6">
          <strong>Стать:</strong>
          <div class="text-capitalize">{{ user.gender }}</div>
        </div>
        <div class="col-6">
          <strong>Дата народження:</strong>
          <div>{{ user.birthDate || "Н/Д" }}</div>
        </div>
        <div class="col-6">
          <strong>ID:</strong>
          <div>#{{ user.id }}</div>
        </div>
      </div>

      <div class="mt-4 pt-3 border-top d-flex gap-2 justify-content-end">
        <RouterLink
          :to="`/users/${user.id}/edit`"
          class="btn btn-primary btn-sm"
        >
          <i class="bi bi-pencil me-1"></i>Редагувати користувача
        </RouterLink>
      </div>

      <RouterView />
    </div>
  </div>
</template>
