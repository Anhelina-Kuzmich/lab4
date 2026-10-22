import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { getAuthService } from "../api/auth.service";
import type { AuthUser } from "./types";

const TOKEN_KEY = "session:token";
const REFRESH_TOKEN_KEY = "session:refreshToken";
const USER_KEY = "session:user";

function readUser(): AuthUser | null {
  const value = localStorage.getItem(USER_KEY);
  if (!value) return null;
  try {
    return JSON.parse(value) as AuthUser;
  } catch {
    localStorage.removeItem(USER_KEY);
    return null;
  }
}

export const useSessionStore = defineStore("session", () => {
  const accessToken = ref<string | null>(localStorage.getItem(TOKEN_KEY));
  const refreshToken = ref<string | null>(
    localStorage.getItem(REFRESH_TOKEN_KEY),
  );
  const user = ref<AuthUser | null>(readUser());
  const isAuthenticated = computed(() => Boolean(accessToken.value));

  function setSession(
    tokens: { accessToken: string; refreshToken: string },
    sessionUser: AuthUser,
  ): void {
    accessToken.value = tokens.accessToken;
    refreshToken.value = tokens.refreshToken;
    user.value = sessionUser;
    localStorage.setItem(TOKEN_KEY, tokens.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(sessionUser));
  }

  function clearSession(): void {
    accessToken.value = null;
    refreshToken.value = null;
    user.value = null;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  return {
    accessToken,
    refreshToken,
    user,
    isAuthenticated,
    async login(username: string, password: string): Promise<void> {
      const response = await getAuthService().login(username, password);
      const { accessToken: token, refreshToken: refresh, ...sessionUser } =
        response;
      setSession({ accessToken: token, refreshToken: refresh }, sessionUser);
    },
    setSession,
    clearSession,
    logout: clearSession,
  };
});
