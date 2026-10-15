import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { AuthUser } from "@/types/auth";
import { ServiceProvider } from "@/services/service-provider";

export const useAuthStore = defineStore("auth", () => {
  const token = ref<string | null>(localStorage.getItem("accessToken"));
  const user = ref<AuthUser | null>(
    localStorage.getItem("authUser")
      ? JSON.parse(localStorage.getItem("authUser")!)
      : null
  );

  const isAuthenticated = computed(() => Boolean(token.value));

  async function login(username: string, password: string): Promise<void> {
    const data = await ServiceProvider.auth.login({ username, password });
    token.value = data.accessToken;
    user.value = {
      id: data.id,
      username: data.username,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      gender: data.gender,
      image: data.image,
    };

    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    localStorage.setItem("authUser", JSON.stringify(user.value));
  }

  function logout(): void {
    token.value = null;
    user.value = null;
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("authUser");
  }

  return {
    token,
    user,
    isAuthenticated,
    login,
    logout,
  };
});
