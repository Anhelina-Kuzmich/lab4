import { defineStore } from "pinia";
import { ref } from "vue";
import type { User, CreateUserDto, UpdateUserDto } from "@/types/user";
import { ServiceProvider } from "@/services/service-provider";

export const useUserStore = defineStore("user", () => {
  const users = ref<User[]>([]);
  const total = ref<number>(0);
  const isLoading = ref<boolean>(false);
  const error = ref<string | null>(null);

  async function fetchUsers(
    params: { limit?: number; skip?: number; query?: string } = {}
  ) {
    isLoading.value = true;
    error.value = null;
    try {
      if (params.query && params.query.trim()) {
        const res = await ServiceProvider.users.search(params.query.trim(), {
          limit: params.limit,
          skip: params.skip,
        });
        users.value = res.items;
        total.value = res.total;
      } else {
        const res = await ServiceProvider.users.getAll({
          limit: params.limit,
          skip: params.skip,
        });
        users.value = res.items;
        total.value = res.total;
      }
    } catch (e: unknown) {
      error.value = (e as Error).message;
    } finally {
      isLoading.value = false;
    }
  }

  async function addUser(dto: CreateUserDto): Promise<User> {
    isLoading.value = true;
    error.value = null;
    try {
      const created = await ServiceProvider.users.create(dto);
      const userWithId: User = {
        ...created,
        id: created.id || Date.now(),
      };
      users.value.unshift(userWithId);
      total.value += 1;
      return userWithId;
    } catch (e: unknown) {
      error.value = (e as Error).message;
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  async function editUser(id: number, dto: UpdateUserDto): Promise<User> {
    isLoading.value = true;
    error.value = null;
    try {
      const updated = await ServiceProvider.users.update(id, dto);
      const idx = users.value.findIndex((u: User) => u.id === id);
      if (idx !== -1) {
        users.value[idx] = { ...users.value[idx], ...updated };
      }
      return updated;
    } catch (e: unknown) {
      error.value = (e as Error).message;
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  async function removeUser(id: number): Promise<void> {
    isLoading.value = true;
    error.value = null;
    try {
      await ServiceProvider.users.delete(id);
      users.value = users.value.filter((u: User) => u.id !== id);
      total.value = Math.max(0, total.value - 1);
    } catch (e: unknown) {
      error.value = (e as Error).message;
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    users,
    total,
    isLoading,
    error,
    fetchUsers,
    addUser,
    editUser,
    removeUser,
  };
});
