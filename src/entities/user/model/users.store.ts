import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { getUserService } from "../api/user.service";
import type { CreateUserDto, UpdateUserDto, User } from "./types";

export const useUsersStore = defineStore("users", () => {
  const users = ref<User[]>([]);
  const total = ref(0);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const hasUsers = computed(() => users.value.length > 0);

  async function run<T>(operation: () => Promise<T>): Promise<T> {
    isLoading.value = true;
    error.value = null;
    try {
      return await operation();
    } catch (cause) {
      error.value =
        cause instanceof Error ? cause.message : "Не вдалося виконати операцію";
      throw cause;
    } finally {
      isLoading.value = false;
    }
  }

  function fetchUsers(params: {
    limit?: number;
    skip?: number;
    query?: string;
  } = {}): Promise<void> {
    return run(async () => {
      const result = await getUserService().getAll(params);
      users.value = result.items;
      total.value = result.total;
    });
  }

  return {
    users,
    total,
    isLoading,
    error,
    hasUsers,
    fetchUsers,
    fetchUser(id: number): Promise<User> {
      return run(async () => {
        const user = await getUserService().getById(id);
        const index = users.value.findIndex((item) => item.id === user.id);
        if (index === -1) users.value.push(user);
        else users.value[index] = user;
        return user;
      });
    },
    createUser(data: CreateUserDto): Promise<User> {
      return run(async () => {
        const user = await getUserService().create(data);
        users.value = [user, ...users.value];
        total.value += 1;
        return user;
      });
    },
    updateUser(id: number, data: UpdateUserDto): Promise<User> {
      return run(async () => {
        const user = await getUserService().update(id, data);
        users.value = users.value.map((item) =>
          item.id === id ? { ...item, ...user } : item,
        );
        return user;
      });
    },
    removeUser(id: number): Promise<void> {
      return run(async () => {
        await getUserService().delete(id);
        users.value = users.value.filter((user) => user.id !== id);
        total.value = Math.max(0, total.value - 1);
      });
    },
  };
});
