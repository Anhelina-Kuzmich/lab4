import { http } from "@/api/http-client";
import type { LoginResponse, RefreshResponse, AuthUser } from "@/types/auth";

export class AuthService {
  login(credentials: {
    username: string;
    password: string;
  }): Promise<LoginResponse> {
    return http<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        username: credentials.username,
        password: credentials.password,
        expiresInMins: 30,
      }),
    });
  }

  getCurrentUser(): Promise<AuthUser> {
    return http<AuthUser>("/auth/me");
  }

  refreshToken(token: string): Promise<RefreshResponse> {
    return http<RefreshResponse>("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({
        refreshToken: token,
        expiresInMins: 30,
      }),
    });
  }
}
