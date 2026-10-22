import { API_URL } from "@/shared/config";

export async function http<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = localStorage.getItem("session:token");
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (response.status === 401 && token) {
    const refreshToken = localStorage.getItem("session:refreshToken");
    if (refreshToken) {
      const refreshed = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken, expiresInMins: 30 }),
      });

      if (refreshed.ok) {
        const tokens = (await refreshed.json()) as {
          accessToken: string;
          refreshToken: string;
        };
        localStorage.setItem("session:token", tokens.accessToken);
        localStorage.setItem("session:refreshToken", tokens.refreshToken);
        headers.set("Authorization", `Bearer ${tokens.accessToken}`);
        return parseResponse<T>(
          await fetch(`${API_URL}${path}`, { ...options, headers }),
        );
      }

      if (refreshed.status === 401) {
        localStorage.removeItem("session:token");
        localStorage.removeItem("session:refreshToken");
        localStorage.removeItem("session:user");
        window.location.hash = "#/login";
      } else {
        await parseResponse<unknown>(refreshed);
      }
    }
  }

  return parseResponse<T>(response);
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as
      | { message?: string }
      | null;
    throw new Error(
      body?.message ?? `HTTP ${response.status}: ${response.statusText}`,
    );
  }
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}
