import { ServiceProvider, http } from "@/shared/api";
import type { LoginResponse, RefreshResponse } from "../model/types";

export class AuthService {
  login(username: string, password: string): Promise<LoginResponse> {
    return http<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password, expiresInMins: 30 }),
    });
  }

  refresh(refreshToken: string): Promise<RefreshResponse> {
    return http<RefreshResponse>("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken, expiresInMins: 30 }),
    });
  }
}

export function getAuthService(): AuthService {
  return ServiceProvider.get<AuthService>("auth");
}
